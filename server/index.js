require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const {
  isIPAllowed,
  validatePassword,
  generateMFASecret,
  generateMFACode,
  verifyOTP,
  recordLoginAttempt,
  isIPLocked,
  getRemainingLockoutTime,
  getRemainingAttempts,
  securityConfig
} = require('./config/security');
const { dbManager } = require('./database/connections');
const UserService = require('./services/userService');
const AdminService = require('./services/adminService');

const app = express();
const PORT = process.env.PORT || 5000;

// 서비스 인스턴스 생성 (데이터베이스 초기화 후에 생성)
let userService;
let adminService;

// 미들웨어 설정
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100 // IP당 최대 요청 수
});
app.use('/api/', limiter);

// JWT 시크릿 키 (실제 환경에서는 환경변수로 관리)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 임시 데이터 저장소 (실제 환경에서는 데이터베이스 사용)
let users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password: bcrypt.hashSync('Admin123!@#2024', 10),
    role: 'admin',
    mfaSecret: null,
    mfaEnabled: false,
    passwordChangedAt: new Date(),
    lastLoginAt: null,
    createdAt: new Date()
  }
];

let posts = [
  {
    id: 1,
    title: '첫 번째 게시글',
    content: '이것은 첫 번째 게시글입니다.',
    authorId: 1,
    authorName: 'admin',
    category: 'Category1',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let reports = [
  {
    id: 1,
    postId: 1,
    reporterId: 1,
    reporterName: 'admin',
    reason: '부적절한 내용',
    status: 'pending',
    createdAt: new Date()
  }
];

// IP 화이트리스트 미들웨어
const checkIPWhitelist = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  
  if (!isIPAllowed(clientIP)) {
    return res.status(403).json({ 
      message: '접근이 허용되지 않은 IP 주소입니다.',
      error: 'IP_NOT_ALLOWED'
    });
  }
  
  next();
};

// 로그인 시도 제한 미들웨어
const checkLoginAttempts = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  
  if (isIPLocked(clientIP)) {
    const remainingTime = getRemainingLockoutTime(clientIP);
    return res.status(429).json({
      message: `로그인이 일시적으로 차단되었습니다. ${remainingTime}분 후에 다시 시도해주세요.`,
      error: 'ACCOUNT_LOCKED',
      remainingTime
    });
  }
  
  next();
};

// 인증 미들웨어
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: '액세스 토큰이 필요합니다.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }
    req.user = user;
    next();
  });
};

// 관리자 권한 확인 미들웨어
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
  }
  next();
};

// API 라우트

// 1. 인증 관련
app.post('/api/auth/login', checkIPWhitelist, checkLoginAttempts, [
  body('email').isEmail().withMessage('유효한 이메일을 입력해주세요.'),
  body('password').notEmpty().withMessage('비밀번호를 입력해주세요.')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, otp } = req.body;
  const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  const user = users.find(u => u.email === email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    recordLoginAttempt(clientIP, false);
    const remainingAttempts = getRemainingAttempts(clientIP);
    
    return res.status(401).json({ 
      message: '이메일 또는 비밀번호가 잘못되었습니다.',
      remainingAttempts,
      error: 'INVALID_CREDENTIALS'
    });
  }

  // 2단계 인증 확인
  if (user.mfaEnabled && user.role === 'admin') {
    if (!otp) {
      return res.status(400).json({ 
        message: '2단계 인증 코드가 필요합니다.',
        error: 'MFA_REQUIRED',
        requiresMFA: true
      });
    }

    if (!verifyOTP(user.mfaSecret, otp)) {
      recordLoginAttempt(clientIP, false);
      return res.status(401).json({ 
        message: '잘못된 2단계 인증 코드입니다.',
        error: 'INVALID_MFA'
      });
    }
  }

  // 로그인 성공
  recordLoginAttempt(clientIP, true);
  user.lastLoginAt = new Date();

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      mfaEnabled: user.mfaEnabled
    }
  });
});

app.post('/api/auth/register', [
  body('username').isLength({ min: 3 }).withMessage('사용자명은 최소 3자 이상이어야 합니다.'),
  body('email').isEmail().withMessage('유효한 이메일을 입력해주세요.'),
  body('password').isLength({ min: 6 }).withMessage('비밀번호는 최소 6자 이상이어야 합니다.')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
  }

  const newUser = {
    id: users.length + 1,
    username,
    email,
    password: bcrypt.hashSync(password, 10),
    role: 'user',
    createdAt: new Date()
  };

  users.push(newUser);

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.status(201).json({
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
      mfaEnabled: newUser.mfaEnabled
    }
  });
});

// 2단계 인증 설정
app.post('/api/admin/mfa/setup', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 2단계 인증 시크릿 생성
    const secret = generateMFASecret(user.username);
    const qrCode = await generateMFACode(secret);

    // 임시로 시크릿 저장 (실제로는 데이터베이스에 저장)
    user.mfaSecret = secret.base32;

    res.json({
      secret: secret.base32,
      qrCode,
      otpauthUrl: secret.otpauth_url
    });
  } catch (error) {
    res.status(500).json({ message: '2단계 인증 설정에 실패했습니다.' });
  }
});

// 2단계 인증 활성화
app.post('/api/admin/mfa/enable', authenticateToken, requireAdmin, [
  body('otp').isLength({ min: 6, max: 6 }).withMessage('6자리 OTP를 입력해주세요.')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { otp } = req.body;
  const user = users.find(u => u.id === req.user.id);

  if (!user || !user.mfaSecret) {
    return res.status(400).json({ message: '먼저 2단계 인증을 설정해주세요.' });
  }

  if (!verifyOTP(user.mfaSecret, otp)) {
    return res.status(400).json({ message: '잘못된 OTP입니다.' });
  }

  user.mfaEnabled = true;
  res.json({ message: '2단계 인증이 활성화되었습니다.' });
});

// 2단계 인증 비활성화
app.post('/api/admin/mfa/disable', authenticateToken, requireAdmin, [
  body('otp').isLength({ min: 6, max: 6 }).withMessage('6자리 OTP를 입력해주세요.')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { otp } = req.body;
  const user = users.find(u => u.id === req.user.id);

  if (!user || !user.mfaEnabled) {
    return res.status(400).json({ message: '2단계 인증이 활성화되어 있지 않습니다.' });
  }

  if (!verifyOTP(user.mfaSecret, otp)) {
    return res.status(400).json({ message: '잘못된 OTP입니다.' });
  }

  user.mfaEnabled = false;
  user.mfaSecret = null;
  res.json({ message: '2단계 인증이 비활성화되었습니다.' });
});

// 비밀번호 변경
app.post('/api/admin/change-password', authenticateToken, requireAdmin, [
  body('currentPassword').notEmpty().withMessage('현재 비밀번호를 입력해주세요.'),
  body('newPassword').notEmpty().withMessage('새 비밀번호를 입력해주세요.')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { currentPassword, newPassword } = req.body;
  const user = users.find(u => u.id === req.user.id);

  if (!user || !bcrypt.compareSync(currentPassword, user.password)) {
    return res.status(400).json({ message: '현재 비밀번호가 올바르지 않습니다.' });
  }

  // 새 비밀번호 정책 검증
  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.isValid) {
    return res.status(400).json({ 
      message: '비밀번호가 정책을 만족하지 않습니다.',
      errors: passwordValidation.errors
    });
  }

  user.password = bcrypt.hashSync(newPassword, 10);
  user.passwordChangedAt = new Date();

  res.json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
});

// 2. 관리자 대시보드
app.get('/api/admin/dashboard', checkIPWhitelist, authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [userStats, adminStats] = await Promise.all([
      userService.getUserStats(),
      adminService.getAdminStats()
    ]);

    const analytics = {
      users: userStats,
      admins: adminStats,
      recentUsers: await userService.getUsers(1, 5),
      recentLogs: await adminService.getAdminLogs(1, 5)
    };

    res.json(analytics);
  } catch (error) {
    console.error('대시보드 데이터 조회 오류:', error);
    res.status(500).json({ message: '대시보드 데이터를 가져오는데 실패했습니다.' });
  }
});

// 3. 사용자 관리
app.get('/api/admin/users', checkIPWhitelist, authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const result = await userService.getUsers(parseInt(page), parseInt(limit), search);
    res.json(result);
  } catch (error) {
    console.error('사용자 목록 조회 오류:', error);
    res.status(500).json({ message: '사용자 목록을 가져오는데 실패했습니다.' });
  }
});

app.get('/api/admin/users/:id', checkIPWhitelist, authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(parseInt(id));
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    res.json(user);
  } catch (error) {
    console.error('사용자 조회 오류:', error);
    res.status(500).json({ message: '사용자 정보를 가져오는데 실패했습니다.' });
  }
});

app.put('/api/admin/users/:id', checkIPWhitelist, authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    const updatedUser = await userService.updateUser(parseInt(id), userData);
    res.json(updatedUser);
  } catch (error) {
    console.error('사용자 수정 오류:', error);
    res.status(500).json({ message: '사용자 수정에 실패했습니다.' });
  }
});

app.delete('/api/admin/users/:id', checkIPWhitelist, authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(parseInt(id));
    res.json({ message: '사용자가 삭제되었습니다.' });
  } catch (error) {
    console.error('사용자 삭제 오류:', error);
    res.status(500).json({ message: '사용자 삭제에 실패했습니다.' });
  }
});

// 4. 게시글 관리
app.get('/api/admin/posts', checkIPWhitelist, authenticateToken, requireAdmin, (req, res) => {
  res.json(posts);
});

app.put('/api/admin/posts/:id', checkIPWhitelist, authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { title, content, category } = req.body;

  const postIndex = posts.findIndex(p => p.id === parseInt(id));
  if (postIndex === -1) {
    return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
  }

  posts[postIndex] = {
    ...posts[postIndex],
    title,
    content,
    category,
    updatedAt: new Date()
  };

  res.json({ message: '게시글이 업데이트되었습니다.' });
});

app.delete('/api/admin/posts/:id', checkIPWhitelist, authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const postIndex = posts.findIndex(p => p.id === parseInt(id));
  
  if (postIndex === -1) {
    return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
  }

  posts.splice(postIndex, 1);
  res.json({ message: '게시글이 삭제되었습니다.' });
});

// 5. 신고 관리
app.get('/api/admin/reports', checkIPWhitelist, authenticateToken, requireAdmin, (req, res) => {
  res.json(reports);
});

app.put('/api/admin/reports/:id', checkIPWhitelist, authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const reportIndex = reports.findIndex(r => r.id === parseInt(id));
  if (reportIndex === -1) {
    return res.status(404).json({ message: '신고를 찾을 수 없습니다.' });
  }

  reports[reportIndex].status = status;
  res.json({ message: '신고 상태가 업데이트되었습니다.' });
});

// 6. 보증사이트 관리
let warrantySites = [
  {
    id: 1,
    title: "보증사이트 보상관련안내",
    date: "11-30",
    views: "23-4",
    description: "안녕하세요. OEN TEST 대표입니다. 보증커뮤니티 통하여 이용하시는 사이트에서 먹튀를 당하셨다면 저희측에서 사이트와 확인 후 실제 먹튀를 한 내용이 확인이 된다면 전액 보상해드리고 있습니다. 또한 현재 피싱이나 협박범들이 많아 항상 이용하시는데 유의하시어 이용 부탁 드리며 언제든지 문제가 있으신 부분은 고객센터 1:1 문의하기로 연락 주시면 최대한 빠르게 답변 드리도록 하겠습니다. 보상가능한 총 예치금 : 30억원",
    status: "verified"
  },
  {
    id: 2,
    title: "OO카지노 보증금 1억원",
    date: "07-12",
    views: "98-11",
    description: "보증금 1억원 주소: http://OEN Test.com 자동코드등록 출금 롤링 모든롤링 100% [게임 안내] 1. 라이브 카지노 (10개 게임사) 영상 제공 ASTAR카지노 / 에볼루션 / 아시아게임 / 프래그마틱 / 마이크로/더블유엠/드림게이밍 / 오리엔탈/올벳/빅게이밍 / BB 카지노 / 섹시 카지노/게임 플레이 2. 슬롯게임 (50개 게임사)",
    status: "verified"
  },
  {
    id: 3,
    title: "OO카지노 보증금 2억원",
    date: "12-15",
    views: "124-8",
    description: "보증금 2억원 주소: http://OEN Test.com 자동코드등록 출금 롤링 모든롤링 100% [게임 안내] 1. 라이브 카지노 (10개 게임사) 영상 제공 ASTAR카지노 / 에볼루션 / 아시아게임 / 프래그마틱 / 마이크로/더블유엠/드림게이밍 / 오리엔탈/올벳/빅게이밍 / BB 카지노 / 섹시 카지노/게임 플레이 2. 슬롯게임 (50개 게임사)",
    status: "verified"
  },
  {
    id: 4,
    title: "OO카지노 보증금 3억원",
    date: "01-20",
    views: "156-23",
    description: "보증금 3억원 주소: http://OEN Test.com 자동코드등록 출금 롤링 모든롤링 100% [게임 안내] 1. 라이브 카지노 (15개 게임사) 영상 제공 ASTAR카지노 / 에볼루션 / 아시아게임 / 프래그마틱 / 마이크로/더블유엠/드림게이밍 / 오리엔탈/올벳/빅게이밍 / BB 카지노 / 섹시 카지노/게임 플레이 2. 슬롯게임 (60개 게임사)",
    status: "verified"
  },
  {
    id: 5,
    title: "OO카지노 보증금 5억원",
    date: "02-08",
    views: "203-45",
    description: "보증금 5억원 주소: http://OEN Test.com 자동코드등록 출금 롤링 모든롤링 100% [게임 안내] 1. 라이브 카지노 (20개 게임사) 영상 제공 ASTAR카지노 / 에볼루션 / 아시아게임 / 프래그마틱 / 마이크로/더블유엠/드림게이밍 / 오리엔탈/올벳/빅게이밍 / BB 카지노 / 섹시 카지노/게임 플레이 2. 슬롯게임 (80개 게임사)",
    status: "verified"
  },
  {
    id: 6,
    title: "OO카지노 보증금 10억원",
    date: "03-15",
    views: "342-67",
    description: "보증금 10억원 주소: http://OEN Test.com 자동코드등록 출금 롤링 모든롤링 100% [게임 안내] 1. 라이브 카지노 (25개 게임사) 영상 제공 ASTAR카지노 / 에볼루션 / 아시아게임 / 프래그마틱 / 마이크로/더블유엠/드림게이밍 / 오리엔탈/올벳/빅게이밍 / BB 카지노 / 섹시 카지노/게임 플레이 2. 슬롯게임 (100개 게임사)",
    status: "verified"
  }
];

app.get('/api/admin/warranty-sites', checkIPWhitelist, authenticateToken, requireAdmin, (req, res) => {
  res.json(warrantySites);
});

app.post('/api/admin/warranty-sites', checkIPWhitelist, authenticateToken, requireAdmin, [
  body('title').notEmpty().withMessage('제목을 입력해주세요.'),
  body('description').notEmpty().withMessage('설명을 입력해주세요.'),
  body('status').isIn(['pending', 'verified', 'rejected']).withMessage('유효한 상태를 선택해주세요.')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, status, views } = req.body;
  const newSite = {
    id: warrantySites.length + 1,
    title,
    description,
    status,
    views: views || '0-0',
    date: new Date().toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })
  };

  warrantySites.push(newSite);
  res.status(201).json(newSite);
});

app.put('/api/admin/warranty-sites/:id', checkIPWhitelist, authenticateToken, requireAdmin, [
  body('title').notEmpty().withMessage('제목을 입력해주세요.'),
  body('description').notEmpty().withMessage('설명을 입력해주세요.'),
  body('status').isIn(['pending', 'verified', 'rejected']).withMessage('유효한 상태를 선택해주세요.')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { title, description, status, views } = req.body;

  const siteIndex = warrantySites.findIndex(s => s.id === parseInt(id));
  if (siteIndex === -1) {
    return res.status(404).json({ message: '보증사이트를 찾을 수 없습니다.' });
  }

  warrantySites[siteIndex] = {
    ...warrantySites[siteIndex],
    title,
    description,
    status,
    views: views || warrantySites[siteIndex].views
  };

  res.json({ message: '보증사이트가 업데이트되었습니다.' });
});

app.delete('/api/admin/warranty-sites/:id', checkIPWhitelist, authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const siteIndex = warrantySites.findIndex(s => s.id === parseInt(id));
  
  if (siteIndex === -1) {
    return res.status(404).json({ message: '보증사이트를 찾을 수 없습니다.' });
  }

  warrantySites.splice(siteIndex, 1);
  res.json({ message: '보증사이트가 삭제되었습니다.' });
});

// 일반 사용자를 위한 보증사이트 API
app.get('/api/warranty-sites', (req, res) => {
  const verifiedSites = warrantySites.filter(site => site.status === 'verified');
  res.json(verifiedSites);
});

// 7. 이벤트 관리
let events = [
  {
    id: 1,
    title: "OEN TEST 이벤트",
    description: "OEN TEST 커뮤니티 가입 이벤트입니다. 다양한 혜택을 받아보세요!",
    type: "promotion",
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    participants: 1250,
    maxParticipants: 5000,
    prize: "포인트 10,000점",
    rules: "1. OEN TEST 커뮤니티 가입 필수\n2. 이벤트 기간 내 참여\n3. 중복 참여 불가",
    createdAt: new Date()
  },
  {
    id: 2,
    title: "복권 이벤트",
    description: "매주 추첨하는 복권 이벤트입니다. 행운을 잡아보세요!",
    type: "lottery",
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    participants: 890,
    maxParticipants: 1000,
    prize: "현금 100만원",
    rules: "1. 매주 일요일 추첨\n2. 참여자 중 무작위 선정\n3. 연락처 필수 등록",
    createdAt: new Date()
  },
  {
    id: 3,
    title: "테스트 이벤트",
    description: "새로운 기능 테스트 이벤트입니다. 피드백을 주시면 포인트를 드립니다!",
    type: "test",
    status: "upcoming",
    startDate: "2024-02-01",
    endDate: "2024-02-28",
    participants: 0,
    maxParticipants: 500,
    prize: "포인트 5,000점",
    rules: "1. 새로운 기능 테스트 참여\n2. 피드백 작성 필수\n3. 상세한 의견 우대",
    createdAt: new Date()
  }
];

app.get('/api/admin/events', checkIPWhitelist, authenticateToken, requireAdmin, (req, res) => {
  res.json(events);
});

app.post('/api/admin/events', checkIPWhitelist, authenticateToken, requireAdmin, [
  body('title').notEmpty().withMessage('제목을 입력해주세요.'),
  body('description').notEmpty().withMessage('설명을 입력해주세요.'),
  body('type').isIn(['promotion', 'lottery', 'test']).withMessage('유효한 이벤트 타입을 선택해주세요.'),
  body('status').isIn(['active', 'upcoming', 'ended']).withMessage('유효한 상태를 선택해주세요.'),
  body('startDate').notEmpty().withMessage('시작일을 입력해주세요.'),
  body('endDate').notEmpty().withMessage('종료일을 입력해주세요.')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, type, status, startDate, endDate, participants, maxParticipants, prize, rules } = req.body;
  const newEvent = {
    id: events.length + 1,
    title,
    description,
    type,
    status,
    startDate,
    endDate,
    participants: participants || 0,
    maxParticipants: maxParticipants || 1000,
    prize: prize || '',
    rules: rules || '',
    createdAt: new Date()
  };

  events.push(newEvent);
  res.status(201).json(newEvent);
});

app.put('/api/admin/events/:id', checkIPWhitelist, authenticateToken, requireAdmin, [
  body('title').notEmpty().withMessage('제목을 입력해주세요.'),
  body('description').notEmpty().withMessage('설명을 입력해주세요.'),
  body('type').isIn(['promotion', 'lottery', 'test']).withMessage('유효한 이벤트 타입을 선택해주세요.'),
  body('status').isIn(['active', 'upcoming', 'ended']).withMessage('유효한 상태를 선택해주세요.'),
  body('startDate').notEmpty().withMessage('시작일을 입력해주세요.'),
  body('endDate').notEmpty().withMessage('종료일을 입력해주세요.')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { title, description, type, status, startDate, endDate, participants, maxParticipants, prize, rules } = req.body;

  const eventIndex = events.findIndex(e => e.id === parseInt(id));
  if (eventIndex === -1) {
    return res.status(404).json({ message: '이벤트를 찾을 수 없습니다.' });
  }

  events[eventIndex] = {
    ...events[eventIndex],
    title,
    description,
    type,
    status,
    startDate,
    endDate,
    participants: participants || events[eventIndex].participants,
    maxParticipants: maxParticipants || events[eventIndex].maxParticipants,
    prize: prize || events[eventIndex].prize,
    rules: rules || events[eventIndex].rules
  };

  res.json({ message: '이벤트가 업데이트되었습니다.' });
});

app.delete('/api/admin/events/:id', checkIPWhitelist, authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const eventIndex = events.findIndex(e => e.id === parseInt(id));
  
  if (eventIndex === -1) {
    return res.status(404).json({ message: '이벤트를 찾을 수 없습니다.' });
  }

  events.splice(eventIndex, 1);
  res.json({ message: '이벤트가 삭제되었습니다.' });
});

// 일반 사용자를 위한 이벤트 API
app.get('/api/events', (req, res) => {
  const activeEvents = events.filter(event => event.status === 'active' || event.status === 'upcoming');
  res.json(activeEvents);
});

// 8. 통계 API
app.get('/api/admin/analytics', checkIPWhitelist, authenticateToken, requireAdmin, (req, res) => {
  const { range = '7d' } = req.query;
  
  // 임시 통계 데이터 (실제 환경에서는 데이터베이스에서 계산)
  const analytics = {
    totalUsers: users.length,
    totalPosts: posts.length,
    totalViews: 15420,
    avgEngagement: 23.5,
    userChange: 12.5,
    postChange: 8.3,
    viewChange: 15.7,
    engagementChange: 5.2,
    userGrowth: [120, 135, 142, 158, 165, 178, 185],
    postGrowth: [45, 52, 48, 61, 67, 73, 78],
    viewGrowth: [1200, 1350, 1420, 1580, 1650, 1780, 1850],
    engagementGrowth: [18, 20, 22, 25, 23, 26, 28],
    topPosts: [
      { id: 1, title: "인기 게시물 1", author: "사용자1", views: 1250 },
      { id: 2, title: "인기 게시물 2", author: "사용자2", views: 980 },
      { id: 3, title: "인기 게시물 3", author: "사용자3", views: 750 },
      { id: 4, title: "인기 게시물 4", author: "사용자4", views: 620 },
      { id: 5, title: "인기 게시물 5", author: "사용자5", views: 580 }
    ],
    topUsers: [
      { id: 1, username: "활성사용자1", posts: 25, comments: 150, activity: 175 },
      { id: 2, username: "활성사용자2", posts: 18, comments: 120, activity: 138 },
      { id: 3, username: "활성사용자3", posts: 15, comments: 95, activity: 110 },
      { id: 4, username: "활성사용자4", posts: 12, comments: 80, activity: 92 },
      { id: 5, username: "활성사용자5", posts: 10, comments: 65, activity: 75 }
    ],
    recentActivity: [
      { description: "새로운 사용자가 가입했습니다", timestamp: new Date() },
      { description: "새로운 게시물이 작성되었습니다", timestamp: new Date(Date.now() - 1000 * 60 * 30) },
      { description: "이벤트 참여자가 증가했습니다", timestamp: new Date(Date.now() - 1000 * 60 * 60) },
      { description: "신고가 접수되었습니다", timestamp: new Date(Date.now() - 1000 * 60 * 90) },
      { description: "보증사이트가 추가되었습니다", timestamp: new Date(Date.now() - 1000 * 60 * 120) }
    ]
  };

  res.json(analytics);
});

// 6. 일반 API (게시글 CRUD)
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

app.get('/api/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
  }
  res.json(post);
});

app.post('/api/posts', authenticateToken, [
  body('title').notEmpty().withMessage('제목을 입력해주세요.'),
  body('content').notEmpty().withMessage('내용을 입력해주세요.'),
  body('category').notEmpty().withMessage('카테고리를 선택해주세요.')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content, category } = req.body;
  const newPost = {
    id: posts.length + 1,
    title,
    content,
    category,
    authorId: req.user.id,
    authorName: users.find(u => u.id === req.user.id)?.username || 'Unknown',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  posts.push(newPost);
  res.status(201).json(newPost);
});

app.post('/api/posts/:id/report', authenticateToken, [
  body('reason').notEmpty().withMessage('신고 사유를 입력해주세요.')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { reason } = req.body;

  const post = posts.find(p => p.id === parseInt(id));
  if (!post) {
    return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
  }

  const newReport = {
    id: reports.length + 1,
    postId: parseInt(id),
    reporterId: req.user.id,
    reporterName: users.find(u => u.id === req.user.id)?.username || 'Unknown',
    reason,
    status: 'pending',
    createdAt: new Date()
  };

  reports.push(newReport);
  res.status(201).json(newReport);
});

// 서버 시작
async function startServer() {
  try {
    // 데이터베이스 연결 초기화
    await dbManager.initialize();
    
    // 서비스 인스턴스 생성
    userService = new UserService();
    adminService = new AdminService();
    
    app.listen(PORT, () => {
      console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
      console.log(`📊 운영 DB: ${process.env.MAIN_DB_NAME || 'main_app_db'}`);
      console.log(`🔐 관리자 DB: ${process.env.ADMIN_DB_NAME || 'admin_panel_db'}`);
      console.log(`👤 관리자 계정: admin@example.com / Admin123!@#`);
    });
  } catch (error) {
    console.error('❌ 서버 시작 실패:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 서버를 종료하는 중...');
  await dbManager.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 서버를 종료하는 중...');
  await dbManager.close();
  process.exit(0);
});

startServer(); 