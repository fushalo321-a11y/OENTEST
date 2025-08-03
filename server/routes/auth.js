const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { generateToken, authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 회원가입
router.post('/register', [
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('사용자명은 3-20자 사이여야 합니다.')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다.'),
  body('email')
    .isEmail()
    .withMessage('올바른 이메일 형식을 입력해주세요.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('비밀번호는 최소 8자 이상이어야 합니다.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('비밀번호는 영문 대소문자와 숫자를 포함해야 합니다.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: '입력 데이터가 올바르지 않습니다.',
        errors: errors.array() 
      });
    }

    const { username, email, password } = req.body;

    // 중복 확인
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: '이미 사용 중인 사용자명 또는 이메일입니다.' 
      });
    }

    // 이메일 인증 토큰 생성
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24시간

    const user = new User({
      username,
      email,
      password,
      emailVerificationToken,
      emailVerificationExpires
    });

    await user.save();

    // 이메일 인증 토큰은 실제로는 이메일로 전송해야 함
    // 여기서는 개발용으로 토큰을 응답에 포함
    res.status(201).json({
      message: '회원가입이 완료되었습니다. 이메일 인증을 완료해주세요.',
      emailVerificationToken: process.env.NODE_ENV === 'development' ? emailVerificationToken : undefined
    });

  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({ 
      message: '회원가입 중 오류가 발생했습니다.' 
    });
  }
});

// 로그인
router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('올바른 이메일 형식을 입력해주세요.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('비밀번호를 입력해주세요.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: '입력 데이터가 올바르지 않습니다.',
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // 사용자 찾기 (비밀번호 포함)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ 
        message: '이메일 또는 비밀번호가 올바르지 않습니다.' 
      });
    }

    // 계정 잠금 확인
    if (user.isLocked()) {
      return res.status(401).json({ 
        message: '계정이 잠겨있습니다. 잠시 후 다시 시도해주세요.' 
      });
    }

    // 비밀번호 확인
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      await user.incLoginAttempts();
      return res.status(401).json({ 
        message: '이메일 또는 비밀번호가 올바르지 않습니다.' 
      });
    }

    // 로그인 성공 시 잠금 해제
    await user.resetLoginAttempts();

    // JWT 토큰 생성
    const token = generateToken(user._id);

    res.json({
      message: '로그인이 완료되었습니다.',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ 
      message: '로그인 중 오류가 발생했습니다.' 
    });
  }
});

// 이메일 인증
router.post('/verify-email', [
  body('token')
    .notEmpty()
    .withMessage('인증 토큰이 필요합니다.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: '인증 토큰이 필요합니다.' 
      });
    }

    const { token } = req.body;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: '유효하지 않거나 만료된 인증 토큰입니다.' 
      });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ 
      message: '이메일 인증이 완료되었습니다.' 
    });

  } catch (error) {
    console.error('이메일 인증 오류:', error);
    res.status(500).json({ 
      message: '이메일 인증 중 오류가 발생했습니다.' 
    });
  }
});

// 비밀번호 재설정 요청
router.post('/forgot-password', [
  body('email')
    .isEmail()
    .withMessage('올바른 이메일 형식을 입력해주세요.')
    .normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: '올바른 이메일을 입력해주세요.' 
      });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      // 보안을 위해 사용자가 존재하지 않아도 성공 메시지 반환
      return res.json({ 
        message: '비밀번호 재설정 이메일이 전송되었습니다.' 
      });
    }

    // 비밀번호 재설정 토큰 생성
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1시간

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    // 실제로는 이메일로 토큰 전송
    // 개발용으로는 토큰을 응답에 포함
    res.json({
      message: '비밀번호 재설정 이메일이 전송되었습니다.',
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    });

  } catch (error) {
    console.error('비밀번호 재설정 요청 오류:', error);
    res.status(500).json({ 
      message: '비밀번호 재설정 요청 중 오류가 발생했습니다.' 
    });
  }
});

// 비밀번호 재설정
router.post('/reset-password', [
  body('token')
    .notEmpty()
    .withMessage('재설정 토큰이 필요합니다.'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('비밀번호는 최소 8자 이상이어야 합니다.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('비밀번호는 영문 대소문자와 숫자를 포함해야 합니다.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: '입력 데이터가 올바르지 않습니다.',
        errors: errors.array() 
      });
    }

    const { token, password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: '유효하지 않거나 만료된 재설정 토큰입니다.' 
      });
    }

    // 새 비밀번호 설정
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ 
      message: '비밀번호가 성공적으로 재설정되었습니다.' 
    });

  } catch (error) {
    console.error('비밀번호 재설정 오류:', error);
    res.status(500).json({ 
      message: '비밀번호 재설정 중 오류가 발생했습니다.' 
    });
  }
});

// 현재 사용자 정보 조회
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: req.user
    });
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    res.status(500).json({ 
      message: '사용자 정보 조회 중 오류가 발생했습니다.' 
    });
  }
});

// 로그아웃 (클라이언트에서 토큰 삭제)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // 서버에서는 특별한 처리가 필요 없음 (JWT는 stateless)
    res.json({ 
      message: '로그아웃이 완료되었습니다.' 
    });
  } catch (error) {
    console.error('로그아웃 오류:', error);
    res.status(500).json({ 
      message: '로그아웃 중 오류가 발생했습니다.' 
    });
  }
});

module.exports = router; 