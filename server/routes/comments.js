const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { authenticateToken, optionalAuth, userRateLimiter } = require('../middleware/auth');

const router = express.Router();

// 댓글 목록 조회
router.get('/post/:postId', [
  query('page').optional().isInt({ min: 1 }).withMessage('페이지는 1 이상의 정수여야 합니다.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('한 페이지당 댓글 수는 1-100개여야 합니다.')
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: '검색 조건이 올바르지 않습니다.',
        errors: errors.array() 
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // 게시물 존재 확인
    const post = await Post.findOne({
      _id: req.params.postId,
      isDeleted: false,
      moderationStatus: 'approved'
    });

    if (!post) {
      return res.status(404).json({ 
        message: '게시물을 찾을 수 없습니다.' 
      });
    }

    // 댓글 조회 (계층 구조)
    const comments = await Comment.find({
      post: req.params.postId,
      isDeleted: false,
      moderationStatus: 'approved',
      parentComment: null // 최상위 댓글만
    })
    .populate('author', 'username avatar')
    .populate({
      path: 'replies',
      populate: {
        path: 'author',
        select: 'username avatar'
      },
      match: { isDeleted: false, moderationStatus: 'approved' }
    })
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit)
    .lean();

    const total = await Comment.countDocuments({
      post: req.params.postId,
      isDeleted: false,
      moderationStatus: 'approved',
      parentComment: null
    });

    const totalPages = Math.ceil(total / limit);

    res.json({
      comments,
      pagination: {
        currentPage: page,
        totalPages,
        totalComments: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('댓글 목록 조회 오류:', error);
    res.status(500).json({ 
      message: '댓글 목록을 불러오는 중 오류가 발생했습니다.' 
    });
  }
});

// 댓글 작성
router.post('/', [
  body('content')
    .isLength({ min: 1, max: 2000 })
    .withMessage('댓글 내용은 1-2000자 사이여야 합니다.')
    .trim(),
  body('postId')
    .isMongoId()
    .withMessage('유효하지 않은 게시물 ID입니다.'),
  body('parentCommentId')
    .optional()
    .isMongoId()
    .withMessage('유효하지 않은 부모 댓글 ID입니다.')
], authenticateToken, userRateLimiter(20, 15 * 60 * 1000), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: '입력 데이터가 올바르지 않습니다.',
        errors: errors.array() 
      });
    }

    const { content, postId, parentCommentId } = req.body;

    // 게시물 존재 확인
    const post = await Post.findOne({
      _id: postId,
      isDeleted: false,
      moderationStatus: 'approved'
    });

    if (!post) {
      return res.status(404).json({ 
        message: '게시물을 찾을 수 없습니다.' 
      });
    }

    // 게시물이 잠겨있는지 확인
    if (post.isLocked) {
      return res.status(403).json({ 
        message: '댓글이 잠긴 게시물입니다.' 
      });
    }

    // 부모 댓글 확인 (대댓글인 경우)
    if (parentCommentId) {
      const parentComment = await Comment.findOne({
        _id: parentCommentId,
        post: postId,
        isDeleted: false,
        moderationStatus: 'approved'
      });

      if (!parentComment) {
        return res.status(404).json({ 
          message: '부모 댓글을 찾을 수 없습니다.' 
        });
      }
    }

    const comment = new Comment({
      content,
      author: req.user._id,
      post: postId,
      parentComment: parentCommentId || null
    });

    await comment.save();

    // 부모 댓글의 replies 배열에 추가
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id }
      });
    }

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username avatar');

    res.status(201).json({
      message: '댓글이 성공적으로 작성되었습니다.',
      comment: populatedComment
    });

  } catch (error) {
    console.error('댓글 작성 오류:', error);
    res.status(500).json({ 
      message: '댓글 작성 중 오류가 발생했습니다.' 
    });
  }
});

// 댓글 수정
router.put('/:id', [
  body('content')
    .isLength({ min: 1, max: 2000 })
    .withMessage('댓글 내용은 1-2000자 사이여야 합니다.')
    .trim()
], authenticateToken, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: '입력 데이터가 올바르지 않습니다.',
        errors: errors.array() 
      });
    }

    const comment = await Comment.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!comment) {
      return res.status(404).json({ 
        message: '댓글을 찾을 수 없습니다.' 
      });
    }

    // 작성자만 수정 가능
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: '댓글을 수정할 권한이 없습니다.' 
      });
    }

    const { content } = req.body;
    comment.content = content;
    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate('author', 'username avatar');

    res.json({
      message: '댓글이 성공적으로 수정되었습니다.',
      comment: updatedComment
    });

  } catch (error) {
    console.error('댓글 수정 오류:', error);
    res.status(500).json({ 
      message: '댓글 수정 중 오류가 발생했습니다.' 
    });
  }
});

// 댓글 삭제
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!comment) {
      return res.status(404).json({ 
        message: '댓글을 찾을 수 없습니다.' 
      });
    }

    // 작성자만 삭제 가능
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: '댓글을 삭제할 권한이 없습니다.' 
      });
    }

    // 소프트 삭제
    await comment.softDelete(req.user._id);

    res.json({ 
      message: '댓글이 성공적으로 삭제되었습니다.' 
    });

  } catch (error) {
    console.error('댓글 삭제 오류:', error);
    res.status(500).json({ 
      message: '댓글 삭제 중 오류가 발생했습니다.' 
    });
  }
});

// 댓글 좋아요/싫어요
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.findOne({
      _id: req.params.id,
      isDeleted: false,
      moderationStatus: 'approved'
    });

    if (!comment) {
      return res.status(404).json({ 
        message: '댓글을 찾을 수 없습니다.' 
      });
    }

    await comment.toggleLike(req.user._id);

    res.json({
      message: '좋아요가 업데이트되었습니다.',
      likeCount: comment.likes.length,
      dislikeCount: comment.dislikes.length
    });

  } catch (error) {
    console.error('댓글 좋아요 오류:', error);
    res.status(500).json({ 
      message: '좋아요 처리 중 오류가 발생했습니다.' 
    });
  }
});

router.post('/:id/dislike', authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.findOne({
      _id: req.params.id,
      isDeleted: false,
      moderationStatus: 'approved'
    });

    if (!comment) {
      return res.status(404).json({ 
        message: '댓글을 찾을 수 없습니다.' 
      });
    }

    await comment.toggleDislike(req.user._id);

    res.json({
      message: '싫어요가 업데이트되었습니다.',
      likeCount: comment.likes.length,
      dislikeCount: comment.dislikes.length
    });

  } catch (error) {
    console.error('댓글 싫어요 오류:', error);
    res.status(500).json({ 
      message: '싫어요 처리 중 오류가 발생했습니다.' 
    });
  }
});

// 댓글 신고
router.post('/:id/report', [
  body('reason')
    .isIn(['스팸', '부적절한 내용', '폭력', '기타'])
    .withMessage('유효하지 않은 신고 사유입니다.'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('신고 설명은 최대 500자까지 가능합니다.')
], authenticateToken, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: '신고 사유가 올바르지 않습니다.',
        errors: errors.array() 
      });
    }

    const comment = await Comment.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!comment) {
      return res.status(404).json({ 
        message: '댓글을 찾을 수 없습니다.' 
      });
    }

    const { reason, description } = req.body;

    await comment.addReport(req.user._id, reason, description);

    res.json({ 
      message: '댓글이 신고되었습니다.' 
    });

  } catch (error) {
    console.error('댓글 신고 오류:', error);
    res.status(500).json({ 
      message: '댓글 신고 중 오류가 발생했습니다.' 
    });
  }
});

module.exports = router; 