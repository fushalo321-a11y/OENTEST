const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT 토큰 생성
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// 인증 미들웨어
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        message: '접근 토큰이 필요합니다.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ 
        message: '유효하지 않은 토큰입니다.' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        message: '비활성화된 계정입니다.' 
      });
    }

    if (user.isLocked()) {
      return res.status(401).json({ 
        message: '계정이 잠겨있습니다. 잠시 후 다시 시도해주세요.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: '유효하지 않은 토큰입니다.' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: '토큰이 만료되었습니다.' 
      });
    }
    return res.status(500).json({ 
      message: '인증 처리 중 오류가 발생했습니다.' 
    });
  }
};

// 역할 기반 권한 확인
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: '인증이 필요합니다.' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: '이 작업을 수행할 권한이 없습니다.' 
      });
    }

    next();
  };
};

// 관리자 권한 확인
const requireAdmin = authorize('admin');

// 관리자 또는 중재자 권한 확인
const requireModerator = authorize('admin', 'moderator');

// 선택적 인증 (로그인하지 않은 사용자도 접근 가능하지만, 로그인한 경우 사용자 정보 제공)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive && !user.isLocked()) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // 토큰 오류는 무시하고 계속 진행
    next();
  }
};

// Rate limiting을 위한 사용자별 추적
const userRateLimit = new Map();

const userRateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const userId = req.user ? req.user._id.toString() : req.ip;
    const now = Date.now();
    
    if (!userRateLimit.has(userId)) {
      userRateLimit.set(userId, { count: 1, resetTime: now + windowMs });
    } else {
      const userLimit = userRateLimit.get(userId);
      
      if (now > userLimit.resetTime) {
        userLimit.count = 1;
        userLimit.resetTime = now + windowMs;
      } else {
        userLimit.count++;
      }
      
      if (userLimit.count > maxRequests) {
        return res.status(429).json({
          message: '요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.'
        });
      }
    }
    
    next();
  };
};

module.exports = {
  generateToken,
  authenticateToken,
  authorize,
  requireAdmin,
  requireModerator,
  optionalAuth,
  userRateLimiter
}; 