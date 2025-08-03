const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { authenticateToken, optionalAuth, requireModerator, userRateLimiter } = require('../middleware/auth');

const router = express.Router();

// 게시물 목록 조회
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('페이지는 1 이상의 정수여야 합니다.'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('한 페이지당 게시물 수는 1-50개여야 합니다.'),
  query('category').optional().isIn(['일반', '질문', '정보', '후기', '잡담', '공지사항']).withMessage('유효하지 않은 카테고리입니다.'),
  query('search').optional().isLength({ min: 1, max: 100 }).withMessage('검색어는 1-100자 사이여야 합니다.')
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
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { category, search, sort = 'createdAt' } = req.query;

    // 검색 조건 구성
    const searchConditions = {
      isDeleted: false,
      moderationStatus: 'approved'
    };

    if (category) {
      searchConditions.category = category;
    }

    if (search) {
      searchConditions.$text = { $search: search };
    }

    // 정렬 조건
    let sortOption = {};
    switch (sort) {
      case 'views':
        sortOption = { views: -1, createdAt: -1 };
        break;
      case 'likes':
        sortOption = { likeCount: -1, createdAt: -1 };
        break;
      case 'comments':
        sortOption = { commentCount: -1, createdAt: -1 };
        break;
      default:
        sortOption = { isPinned: -1, createdAt: -1 };
    }

    const posts = await Post.find(searchConditions)
      .populate('author', 'username avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Post.countDocuments(searchConditions);
    const totalPages = Math.ceil(total / limit);

    res.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('게시물 목록 조회 오류:', error);
    res.status(500).json({ 
      message: '게시물 목록을 불러오는 중 오류가 발생했습니다.' 
    });
  }
});

// 게시물 상세 조회
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      isDeleted: false,
      moderationStatus: 'approved'
    }).populate('author', 'username avatar bio');

    if (!post) {
      return res.status(404).json({ 
        message: '게시물을 찾을 수 없습니다.' 
      });
    }

    // 조회수 증가 (로그인한 사용자만)
    if (req.user) {
      await post.incrementViews();
    }

    // 댓글 수 계산
    const commentCount = await Comment.countDocuments({
      post: post._id,
      isDeleted: false,
      moderationStatus: 'approved'
    });

    const postData = post.toJSON();
    postData.commentCount = commentCount;

    res.json({ post: postData });

  } catch (error) {
    console.error('게시물 상세 조회 오류:', error);
    res.status(500).json({ 
      message: '게시물을 불러오는 중 오류가 발생했습니다.' 
    });
  }
});

// 게시물 작성
router.post('/', [
  body('title')
    .isLength({ min: 1, max: 200 })
    .withMessage('제목은 1-200자 사이여야 합니다.')
    .trim(),
  body('content')
    .isLength({ min: 1, max: 10000 })
    .withMessage('내용은 1-10000자 사이여야 합니다.')
    .trim(),
  body('category')
    .isIn(['일반', '질문', '정보', '후기', '잡담', '공지사항'])
    .withMessage('유효하지 않은 카테고리입니다.'),
  body('tags')
    .optional()
    .isArray({ max: 10 })
    .withMessage('태그는 최대 10개까지 가능합니다.')
], authenticateToken, userRateLimiter(10, 15 * 60 * 1000), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: '입력 데이터가 올바르지 않습니다.',
        errors: errors.array() 
      });
    }

    const { title, content, category, tags = [] } = req.body;

    // 태그 검증
    if (tags.length > 0) {
      for (const tag of tags) {
        if (typeof tag !== 'string' || tag.length > 20) {
          return res.status(400).json({ 
            message: '태그는 20자 이하의 문자열이어야 합니다.' 
          });
        }
      }
    }

    const post = new Post({
      title,
      content,
      category,
      tags,
      author: req.user._id
    });

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username avatar');

    res.status(201).json({
      message: '게시물이 성공적으로 작성되었습니다.',
      post: populatedPost
    });

  } catch (error) {
    console.error('게시물 작성 오류:', error);
    res.status(500).json({ 
      message: '게시물 작성 중 오류가 발생했습니다.' 
    });
  }
});

// 게시물 수정
router.put('/:id', [
  body('title')
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage('제목은 1-200자 사이여야 합니다.')
    .trim(),
  body('content')
    .optional()
    .isLength({ min: 1, max: 10000 })
    .withMessage('내용은 1-10000자 사이여야 합니다.')
    .trim(),
  body('category')
    .optional()
    .isIn(['일반', '질문', '정보', '후기', '잡담', '공지사항'])
    .withMessage('유효하지 않은 카테고리입니다.')
], authenticateToken, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: '입력 데이터가 올바르지 않습니다.',
        errors: errors.array() 
      });
    }

    const post = await Post.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!post) {
      return res.status(404).json({ 
        message: '게시물을 찾을 수 없습니다.' 
      });
    }

    // 작성자 또는 관리자만 수정 가능
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: '게시물을 수정할 권한이 없습니다.' 
      });
    }

    const { title, content, category, tags } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;
    if (tags) {
      // 태그 검증
      if (Array.isArray(tags)) {
        for (const tag of tags) {
          if (typeof tag !== 'string' || tag.length > 20) {
            return res.status(400).json({ 
              message: '태그는 20자 이하의 문자열이어야 합니다.' 
            });
          }
        }
        post.tags = tags;
      }
    }

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('author', 'username avatar');

    res.json({
      message: '게시물이 성공적으로 수정되었습니다.',
      post: updatedPost
    });

  } catch (error) {
    console.error('게시물 수정 오류:', error);
    res.status(500).json({ 
      message: '게시물 수정 중 오류가 발생했습니다.' 
    });
  }
});

// 게시물 삭제
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!post) {
      return res.status(404).json({ 
        message: '게시물을 찾을 수 없습니다.' 
      });
    }

    // 작성자 또는 관리자만 삭제 가능
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: '게시물을 삭제할 권한이 없습니다.' 
      });
    }

    // 소프트 삭제
    post.isDeleted = true;
    await post.save();

    res.json({ 
      message: '게시물이 성공적으로 삭제되었습니다.' 
    });

  } catch (error) {
    console.error('게시물 삭제 오류:', error);
    res.status(500).json({ 
      message: '게시물 삭제 중 오류가 발생했습니다.' 
    });
  }
});

// 게시물 좋아요/싫어요
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      isDeleted: false,
      moderationStatus: 'approved'
    });

    if (!post) {
      return res.status(404).json({ 
        message: '게시물을 찾을 수 없습니다.' 
      });
    }

    await post.toggleLike(req.user._id);

    res.json({
      message: '좋아요가 업데이트되었습니다.',
      likeCount: post.likes.length,
      dislikeCount: post.dislikes.length
    });

  } catch (error) {
    console.error('게시물 좋아요 오류:', error);
    res.status(500).json({ 
      message: '좋아요 처리 중 오류가 발생했습니다.' 
    });
  }
});

router.post('/:id/dislike', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      isDeleted: false,
      moderationStatus: 'approved'
    });

    if (!post) {
      return res.status(404).json({ 
        message: '게시물을 찾을 수 없습니다.' 
      });
    }

    await post.toggleDislike(req.user._id);

    res.json({
      message: '싫어요가 업데이트되었습니다.',
      likeCount: post.likes.length,
      dislikeCount: post.dislikes.length
    });

  } catch (error) {
    console.error('게시물 싫어요 오류:', error);
    res.status(500).json({ 
      message: '싫어요 처리 중 오류가 발생했습니다.' 
    });
  }
});

// 게시물 신고
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

    const post = await Post.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!post) {
      return res.status(404).json({ 
        message: '게시물을 찾을 수 없습니다.' 
      });
    }

    const { reason, description } = req.body;

    await post.addReport(req.user._id, reason, description);

    res.json({ 
      message: '게시물이 신고되었습니다.' 
    });

  } catch (error) {
    console.error('게시물 신고 오류:', error);
    res.status(500).json({ 
      message: '게시물 신고 중 오류가 발생했습니다.' 
    });
  }
});

module.exports = router; 