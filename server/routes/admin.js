const express = require('express');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { authenticateToken, requireAdmin, requireModerator } = require('../middleware/auth');

const router = express.Router();

// 모든 라우트에 관리자 권한 필요
router.use(authenticateToken);
router.use(requireAdmin);

// 대시보드 통계
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const totalPosts = await Post.countDocuments({ isDeleted: false });
    const totalComments = await Comment.countDocuments({ isDeleted: false });
    const pendingPosts = await Post.countDocuments({ 
      isDeleted: false, 
      moderationStatus: 'pending' 
    });
    const pendingComments = await Comment.countDocuments({ 
      isDeleted: false, 
      moderationStatus: 'pending' 
    });

    // 최근 7일간의 통계
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    const newPostsThisWeek = await Post.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
      isDeleted: false
    });

    const newCommentsThisWeek = await Comment.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
      isDeleted: false
    });

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        verifiedUsers,
        totalPosts,
        totalComments,
        pendingPosts,
        pendingComments,
        newUsersThisWeek,
        newPostsThisWeek,
        newCommentsThisWeek
      }
    });

  } catch (error) {
    console.error('대시보드 통계 오류:', error);
    res.status(500).json({ 
      message: '대시보드 통계를 불러오는 중 오류가 발생했습니다.' 
    });
  }
});

// 사용자 관리
router.get('/users', [
  query('page').optional().isInt({ min: 1 }).withMessage('페이지는 1 이상의 정수여야 합니다.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('한 페이지당 사용자 수는 1-100개여야 합니다.'),
  query('search').optional().isLength({ min: 1, max: 100 }).withMessage('검색어는 1-100자 사이여야 합니다.'),
  query('role').optional().isIn(['user', 'moderator', 'admin']).withMessage('유효하지 않은 역할입니다.'),
  query('status').optional().isIn(['active', 'inactive', 'locked']).withMessage('유효하지 않은 상태입니다.')
], async (req, res) => {
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
    
    const { search, role, status } = req.query;

    // 검색 조건 구성
    const searchConditions = {};

    if (search) {
      searchConditions.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      searchConditions.role = role;
    }

    if (status) {
      switch (status) {
        case 'active':
          searchConditions.isActive = true;
          break;
        case 'inactive':
          searchConditions.isActive = false;
          break;
        case 'locked':
          searchConditions.lockUntil = { $gt: Date.now() };
          break;
      }
    }

    const users = await User.find(searchConditions)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments(searchConditions);
    const totalPages = Math.ceil(total / limit);

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('사용자 목록 조회 오류:', error);
    res.status(500).json({ 
      message: '사용자 목록을 불러오는 중 오류가 발생했습니다.' 
    });
  }
});

// 사용자 상태 변경
router.patch('/users/:id/status', [
  body('action')
    .isIn(['activate', 'deactivate', 'unlock', 'changeRole'])
    .withMessage('유효하지 않은 액션입니다.'),
  body('role')
    .optional()
    .isIn(['user', 'moderator', 'admin'])
    .withMessage('유효하지 않은 역할입니다.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: '입력 데이터가 올바르지 않습니다.',
        errors: errors.array() 
      });
    }

    const { action, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ 
        message: '사용자를 찾을 수 없습니다.' 
      });
    }

    switch (action) {
      case 'activate':
        user.isActive = true;
        break;
      case 'deactivate':
        user.isActive = false;
        break;
      case 'unlock':
        user.lockUntil = undefined;
        user.loginAttempts = 0;
        break;
      case 'changeRole':
        if (!role) {
          return res.status(400).json({ 
            message: '역할을 지정해주세요.' 
          });
        }
        user.role = role;
        break;
    }

    await user.save();

    res.json({
      message: '사용자 상태가 성공적으로 변경되었습니다.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('사용자 상태 변경 오류:', error);
    res.status(500).json({ 
      message: '사용자 상태 변경 중 오류가 발생했습니다.' 
    });
  }
});

// 게시물 관리
router.get('/posts', [
  query('page').optional().isInt({ min: 1 }).withMessage('페이지는 1 이상의 정수여야 합니다.'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('한 페이지당 게시물 수는 1-50개여야 합니다.'),
  query('status').optional().isIn(['pending', 'approved', 'rejected']).withMessage('유효하지 않은 상태입니다.'),
  query('category').optional().isIn(['일반', '질문', '정보', '후기', '잡담', '공지사항']).withMessage('유효하지 않은 카테고리입니다.')
], async (req, res) => {
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
    
    const { status, category } = req.query;

    // 검색 조건 구성
    const searchConditions = { isDeleted: false };

    if (status) {
      searchConditions.moderationStatus = status;
    }

    if (category) {
      searchConditions.category = category;
    }

    const posts = await Post.find(searchConditions)
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
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
    console.error('게시물 관리 목록 조회 오류:', error);
    res.status(500).json({ 
      message: '게시물 목록을 불러오는 중 오류가 발생했습니다.' 
    });
  }
});

// 게시물 상태 변경
router.patch('/posts/:id/status', [
  body('action')
    .isIn(['approve', 'reject', 'pin', 'unpin', 'lock', 'unlock'])
    .withMessage('유효하지 않은 액션입니다.'),
  body('note')
    .optional()
    .isLength({ max: 500 })
    .withMessage('메모는 최대 500자까지 가능합니다.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: '입력 데이터가 올바르지 않습니다.',
        errors: errors.array() 
      });
    }

    const { action, note } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ 
        message: '게시물을 찾을 수 없습니다.' 
      });
    }

    switch (action) {
      case 'approve':
        post.moderationStatus = 'approved';
        break;
      case 'reject':
        post.moderationStatus = 'rejected';
        break;
      case 'pin':
        post.isPinned = true;
        break;
      case 'unpin':
        post.isPinned = false;
        break;
      case 'lock':
        post.isLocked = true;
        break;
      case 'unlock':
        post.isLocked = false;
        break;
    }

    if (note) {
      post.moderationNote = note;
    }

    await post.save();

    res.json({
      message: '게시물 상태가 성공적으로 변경되었습니다.',
      post: {
        id: post._id,
        title: post.title,
        moderationStatus: post.moderationStatus,
        isPinned: post.isPinned,
        isLocked: post.isLocked,
        moderationNote: post.moderationNote
      }
    });

  } catch (error) {
    console.error('게시물 상태 변경 오류:', error);
    res.status(500).json({ 
      message: '게시물 상태 변경 중 오류가 발생했습니다.' 
    });
  }
});

// 신고된 게시물 목록
router.get('/reports/posts', [
  query('page').optional().isInt({ min: 1 }).withMessage('페이지는 1 이상의 정수여야 합니다.'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('한 페이지당 게시물 수는 1-50개여야 합니다.')
], async (req, res) => {
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

    const posts = await Post.find({
      isDeleted: false,
      'reportedBy.0': { $exists: true }
    })
    .populate('author', 'username email')
    .populate('reportedBy.user', 'username email')
    .sort({ 'reportedBy.reportedAt': -1 })
    .skip(skip)
    .limit(limit)
    .lean();

    const total = await Post.countDocuments({
      isDeleted: false,
      'reportedBy.0': { $exists: true }
    });

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
    console.error('신고된 게시물 목록 조회 오류:', error);
    res.status(500).json({ 
      message: '신고된 게시물 목록을 불러오는 중 오류가 발생했습니다.' 
    });
  }
});

// 신고된 댓글 목록
router.get('/reports/comments', [
  query('page').optional().isInt({ min: 1 }).withMessage('페이지는 1 이상의 정수여야 합니다.'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('한 페이지당 댓글 수는 1-50개여야 합니다.')
], async (req, res) => {
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

    const comments = await Comment.find({
      isDeleted: false,
      'reportedBy.0': { $exists: true }
    })
    .populate('author', 'username email')
    .populate('post', 'title')
    .populate('reportedBy.user', 'username email')
    .sort({ 'reportedBy.reportedAt': -1 })
    .skip(skip)
    .limit(limit)
    .lean();

    const total = await Comment.countDocuments({
      isDeleted: false,
      'reportedBy.0': { $exists: true }
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
    console.error('신고된 댓글 목록 조회 오류:', error);
    res.status(500).json({ 
      message: '신고된 댓글 목록을 불러오는 중 오류가 발생했습니다.' 
    });
  }
});

// 댓글 관리
router.patch('/comments/:id/status', [
  body('action')
    .isIn(['approve', 'reject'])
    .withMessage('유효하지 않은 액션입니다.'),
  body('note')
    .optional()
    .isLength({ max: 500 })
    .withMessage('메모는 최대 500자까지 가능합니다.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: '입력 데이터가 올바르지 않습니다.',
        errors: errors.array() 
      });
    }

    const { action, note } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ 
        message: '댓글을 찾을 수 없습니다.' 
      });
    }

    switch (action) {
      case 'approve':
        comment.moderationStatus = 'approved';
        break;
      case 'reject':
        comment.moderationStatus = 'rejected';
        break;
    }

    if (note) {
      comment.moderationNote = note;
    }

    await comment.save();

    res.json({
      message: '댓글 상태가 성공적으로 변경되었습니다.',
      comment: {
        id: comment._id,
        content: comment.content,
        moderationStatus: comment.moderationStatus,
        moderationNote: comment.moderationNote
      }
    });

  } catch (error) {
    console.error('댓글 상태 변경 오류:', error);
    res.status(500).json({ 
      message: '댓글 상태 변경 중 오류가 발생했습니다.' 
    });
  }
});

module.exports = router; 