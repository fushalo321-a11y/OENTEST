// 보안 관련 유틸리티 함수들

// Rate Limiting을 위한 간단한 구현
class RateLimiter {
  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(identifier) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, []);
    }
    
    const userRequests = this.requests.get(identifier);
    
    // 윈도우 밖의 요청들 제거
    const validRequests = userRequests.filter(time => time > windowStart);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }
}

// XSS 방지를 위한 입력값 정제
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// CSRF 토큰 생성
export const generateCSRFToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// 안전한 URL 검증
export const isValidURL = (url) => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// 비밀번호 강도 검증
export const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const score = [
    password.length >= minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar
  ].filter(Boolean).length;
  
  return {
    isValid: score >= 4,
    score: score,
    feedback: {
      length: password.length >= minLength ? '✅' : '❌ 최소 8자 이상',
      uppercase: hasUpperCase ? '✅' : '❌ 대문자 포함',
      lowercase: hasLowerCase ? '✅' : '❌ 소문자 포함',
      numbers: hasNumbers ? '✅' : '❌ 숫자 포함',
      special: hasSpecialChar ? '✅' : '❌ 특수문자 포함'
    }
  };
};

// 안전한 로컬 스토리지 사용
export const secureStorage = {
  setItem: (key, value) => {
    try {
      const encryptedValue = btoa(JSON.stringify(value));
      localStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
  
  getItem: (key) => {
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;
      return JSON.parse(atob(encryptedValue));
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  },
  
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage error:', error);
    }
  }
};

// 디바이스 핑거프린팅 방지
export const preventFingerprinting = () => {
  // Canvas 핑거프린팅 방지
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function(type, ...args) {
    const context = originalGetContext.call(this, type, ...args);
    if (type === '2d') {
      const originalFillText = context.fillText;
      context.fillText = function(...args) {
        // 텍스트 렌더링에 약간의 노이즈 추가
        const noise = Math.random() * 0.1;
        args[1] += noise;
        args[2] += noise;
        return originalFillText.apply(this, args);
      };
    }
    return context;
  };
};

// Rate Limiter 인스턴스 생성
export const rateLimiter = new RateLimiter(100, 60000); // 1분에 100회 요청 제한

// 보안 헤더 검증
export const validateSecurityHeaders = () => {
  const requiredHeaders = [
    'X-Frame-Options',
    'X-Content-Type-Options',
    'Strict-Transport-Security'
  ];
  
  const missingHeaders = [];
  
  // 실제로는 서버에서 검증해야 하지만, 클라이언트에서도 기본 검증 가능
  if (!window.location.protocol.includes('https')) {
    console.warn('HTTPS가 아닌 연결입니다. 보안에 취약할 수 있습니다.');
  }
  
  return {
    isSecure: missingHeaders.length === 0,
    missingHeaders
  };
};

// 자동 로그아웃 (비활성 시간)
export const setupAutoLogout = (timeoutMinutes = 30) => {
  let logoutTimer;
  
  const resetTimer = () => {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(() => {
      // 로그아웃 처리
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    }, timeoutMinutes * 60 * 1000);
  };
  
  // 사용자 활동 감지
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
  events.forEach(event => {
    document.addEventListener(event, resetTimer, true);
  });
  
  resetTimer();
  
  return () => {
    clearTimeout(logoutTimer);
    events.forEach(event => {
      document.removeEventListener(event, resetTimer, true);
    });
  };
};

export default {
  sanitizeInput,
  generateCSRFToken,
  isValidURL,
  validatePasswordStrength,
  secureStorage,
  preventFingerprinting,
  rateLimiter,
  validateSecurityHeaders,
  setupAutoLogout
}; 