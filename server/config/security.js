const crypto = require('crypto');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// 보안 설정
const securityConfig = {
  // IP 화이트리스트
  adminIPWhitelist: process.env.ADMIN_IP_WHITELIST?.split(',') || ['127.0.0.1', '::1'],
  
  // 2단계 인증 설정
  mfaEnabled: process.env.ADMIN_MFA_ENABLED === 'true',
  mfaIssuer: process.env.MFA_ISSUER || 'OEN TEST Admin',
  mfaAlgorithm: process.env.MFA_ALGORITHM || 'SHA1',
  mfaDigits: parseInt(process.env.MFA_DIGITS) || 6,
  mfaPeriod: parseInt(process.env.MFA_PERIOD) || 30,
  
  // 비밀번호 정책
  passwordPolicy: {
    minLength: parseInt(process.env.ADMIN_PASSWORD_POLICY_MIN_LENGTH) || 12,
    requireUppercase: process.env.ADMIN_PASSWORD_POLICY_REQUIRE_UPPERCASE === 'true',
    requireLowercase: process.env.ADMIN_PASSWORD_POLICY_REQUIRE_LOWERCASE === 'true',
    requireNumbers: process.env.ADMIN_PASSWORD_POLICY_REQUIRE_NUMBERS === 'true',
    requireSpecialChars: process.env.ADMIN_PASSWORD_POLICY_REQUIRE_SPECIAL_CHARS === 'true',
  },
  
  // 계정 잠금 설정
  maxLoginAttempts: parseInt(process.env.ADMIN_MAX_LOGIN_ATTEMPTS) || 5,
  accountLockoutDuration: parseInt(process.env.ADMIN_ACCOUNT_LOCKOUT_DURATION) || 30, // 분 단위
};

// IP 화이트리스트 검증
const isIPAllowed = (ip) => {
  return securityConfig.adminIPWhitelist.includes(ip) || 
         securityConfig.adminIPWhitelist.some(allowedIP => {
           // CIDR 표기법 지원 (예: 192.168.1.0/24)
           if (allowedIP.includes('/')) {
             const [network, bits] = allowedIP.split('/');
             const mask = ~((1 << (32 - bits)) - 1);
             const ipNum = ipToNumber(ip);
             const networkNum = ipToNumber(network);
             return (ipNum & mask) === (networkNum & mask);
           }
           return allowedIP === ip;
         });
};

// IP 주소를 숫자로 변환
const ipToNumber = (ip) => {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
};

// 비밀번호 정책 검증
const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < securityConfig.passwordPolicy.minLength) {
    errors.push(`비밀번호는 최소 ${securityConfig.passwordPolicy.minLength}자 이상이어야 합니다.`);
  }
  
  if (securityConfig.passwordPolicy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('비밀번호는 대문자를 포함해야 합니다.');
  }
  
  if (securityConfig.passwordPolicy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('비밀번호는 소문자를 포함해야 합니다.');
  }
  
  if (securityConfig.passwordPolicy.requireNumbers && !/\d/.test(password)) {
    errors.push('비밀번호는 숫자를 포함해야 합니다.');
  }
  
  if (securityConfig.passwordPolicy.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('비밀번호는 특수문자를 포함해야 합니다.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// 2단계 인증 시크릿 생성
const generateMFASecret = (username) => {
  const secret = speakeasy.generateSecret({
    name: `${securityConfig.mfaIssuer}:${username}`,
    issuer: securityConfig.mfaIssuer,
    algorithm: securityConfig.mfaAlgorithm,
    digits: securityConfig.mfaDigits,
    period: securityConfig.mfaPeriod
  });
  
  return secret;
};

// QR 코드 생성
const generateMFACode = async (secret) => {
  try {
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);
    return qrCode;
  } catch (error) {
    throw new Error('QR 코드 생성에 실패했습니다.');
  }
};

// OTP 검증
const verifyOTP = (secret, token) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 2, // 2분 전후 허용
    algorithm: securityConfig.mfaAlgorithm,
    digits: securityConfig.mfaDigits,
    period: securityConfig.mfaPeriod
  });
};

// 로그인 시도 추적
const loginAttempts = new Map();

// 로그인 시도 기록
const recordLoginAttempt = (ip, success = false) => {
  if (!loginAttempts.has(ip)) {
    loginAttempts.set(ip, {
      attempts: 0,
      lastAttempt: Date.now(),
      lockedUntil: null
    });
  }
  
  const record = loginAttempts.get(ip);
  
  if (success) {
    // 성공 시 초기화
    record.attempts = 0;
    record.lockedUntil = null;
  } else {
    // 실패 시 카운트 증가
    record.attempts++;
    record.lastAttempt = Date.now();
    
    // 최대 시도 횟수 초과 시 잠금
    if (record.attempts >= securityConfig.maxLoginAttempts) {
      record.lockedUntil = Date.now() + (securityConfig.accountLockoutDuration * 60 * 1000);
    }
  }
  
  loginAttempts.set(ip, record);
};

// IP 잠금 상태 확인
const isIPLocked = (ip) => {
  const record = loginAttempts.get(ip);
  if (!record) return false;
  
  if (record.lockedUntil && Date.now() < record.lockedUntil) {
    return true;
  }
  
  // 잠금 시간이 지났으면 초기화
  if (record.lockedUntil && Date.now() >= record.lockedUntil) {
    record.attempts = 0;
    record.lockedUntil = null;
    loginAttempts.set(ip, record);
  }
  
  return false;
};

// 남은 잠금 시간 계산 (분 단위)
const getRemainingLockoutTime = (ip) => {
  const record = loginAttempts.get(ip);
  if (!record || !record.lockedUntil) return 0;
  
  const remaining = Math.ceil((record.lockedUntil - Date.now()) / (60 * 1000));
  return Math.max(0, remaining);
};

// 남은 로그인 시도 횟수
const getRemainingAttempts = (ip) => {
  const record = loginAttempts.get(ip);
  if (!record) return securityConfig.maxLoginAttempts;
  
  return Math.max(0, securityConfig.maxLoginAttempts - record.attempts);
};

module.exports = {
  securityConfig,
  isIPAllowed,
  validatePassword,
  generateMFASecret,
  generateMFACode,
  verifyOTP,
  recordLoginAttempt,
  isIPLocked,
  getRemainingLockoutTime,
  getRemainingAttempts
}; 