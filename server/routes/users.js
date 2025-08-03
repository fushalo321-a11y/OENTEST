const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// 사용자 프로필 조회
router.get('/profile/:username', optionalAuth, async (req, res) => {
  try {
    const user = await User.findOne({ 
      username: req.params.username,
      isActive: true 
    }).select('-password -resetPasswordToken -resetPasswordExpires -emailVerificationToken -emailVerificationExpires');

    if (!user) {
      return res.status(404).json({ 
        message: '사용자를 찾을 수 없습니다.' 
      });
    }

    // 사용자 게시물 수
    const postCount = await Post.countDocuments({
      author: user._id,
      isDeleted: false,
      moderationStatus: 'approved'
    });

    // 사용자 댓글 수
    const commentCount = await Comment.countDocuments({
      author: user._id,
      isDeleted: false,
      moderationStatus: 'approved'
    });

    const userData = user.toJSON();
    userData.postCount = postCount;
    userData.commentCount = commentCount;

    res.json({ user: userData });

  } catch (error) {
    console.error('사용자 프로필 조회 오류:', error);
    res.status(500).json({ 
      message: '사용자 프로필을 불러오는 중 오류가 발생했습니다.' 
    });
  }
});

// 사용자 게시물 목록
router.get('/:username/posts', [
  require('express-validator').query('page').optional().isInt({ min: 1 }).withMessage('페이지는 1 이상의 정수여야 합니다.'),
  require('express-validator').query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('한 페이지당 게시물 수는 1-50개여야 합니다.')
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: '검색 조건이 올바르지 않습니다.',
        errors: errors.array() 
      });
    }

    const user = await User.findOne({ 
      username: req.params.username,
      isActive: true 
    });

    if (!user) {
      return res.status(404).json({ 
        message: '사용자를 찾을 수 없습니다.' 
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({
      author: user._id,
      isDeleted: false,
      moderationStatus: 'approved'
    })
    .populate('author', 'username avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

    const total = await Post.countDocuments({
      author: user._id,
      isDeleted: false,
      moderationStatus: 'approved'
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
    console.error('사용자 게시물 목록 조회 오류:', error);
    res.status(500).json({ 
      message: '사용자 게시물 목록을 불러오는 중 오류가 발생했습니다.' 
    });
  }
});

// 내 프로필 수정
router.put('/profile', [
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('자기소개는 최대 500자까지 가능합니다.')
], authenticateToken, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: '입력 데이터가 올바르지 않습니다.',
        errors: errors.array() 
      });
    }

    const { bio } = req.body;

    const user = await User.findById(req.user._id);
    if (bio !== undefined) {
      user.bio = bio;
    }

    await user.save();

    res.json({
      message: '프로필이 성공적으로 수정되었습니다.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('프로필 수정 오류:', error);
    res.status(500).json({ 
      message: '프로필 수정 중 오류가 발생했습니다.' 
    });
  }
});

// 비밀번호 변경
router.put('/password', [
  body('currentPassword')
    .notEmpty()
    .withMessage('현재 비밀번호를 입력해주세요.'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('새 비밀번호는 최소 8자 이상이어야 합니다.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('새 비밀번호는 영문 대소문자와 숫자를 포함해야 합니다.')
], authenticateToken, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: '입력 데이터가 올바르지 않습니다.',
        errors: errors.array() 
      });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    // 현재 비밀번호 확인
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ 
        message: '현재 비밀번호가 올바르지 않습니다.' 
      });
    }

    // 새 비밀번호 설정
    user.password = newPassword;
    await user.save();

    res.json({ 
      message: '비밀번호가 성공적으로 변경되었습니다.' 
    });

  } catch (error) {
    console.error('비밀번호 변경 오류:', error);
    res.status(500).json({ 
      message: '비밀번호 변경 중 오류가 발생했습니다.' 
    });
  }
});

// 계정 삭제
router.delete('/account', [
  body('password')
    .notEmpty()
    .withMessage('비밀번호를 입력해주세요.')
], authenticateToken, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: '입력 데이터가 올바르지 않습니다.',
        errors: errors.array() 
      });
    }

    const { password } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    // 비밀번호 확인
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ 
        message: '비밀번호가 올바르지 않습니다.' 
      });
    }

    // 계정 비활성화 (실제 삭제 대신)
    user.isActive = false;
    await user.save();

    res.json({ 
      message: '계정이 성공적으로 비활성화되었습니다.' 
    });

  } catch (error) {
    console.error('계정 삭제 오류:', error);
    res.status(500).json({ 
      message: '계정 삭제 중 오류가 발생했습니다.' 
    });
  }
});

// 사용자 검색
router.get('/search/:query', [
  require('express-validator').query('page').optional().isInt({ min: 1 }).withMessage('페이지는 1 이상의 정수여야 합니다.'),
  require('express-validator').query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('한 페이지당 사용자 수는 1-50개여야 합니다.')
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

    const users = await User.find({
      username: { $regex: req.params.query, $options: 'i' },
      isActive: true
    })
    .select('-password')
    .sort({ username: 1 })
    .skip(skip)
    .limit(limit)
    .lean();

    const total = await User.countDocuments({
      username: { $regex: req.params.query, $options: 'i' },
      isActive: true
    });

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
    console.error('사용자 검색 오류:', error);
    res.status(500).json({ 
      message: '사용자 검색 중 오류가 발생했습니다.' 
    });
  }
});

module.exports = router; 