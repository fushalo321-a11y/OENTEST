import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { hasPermission, logPermissionAttempt, filterSensitiveData } from '../utils/permissions';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 개발용 테스트 마스터 계정
const TEST_MASTER_ACCOUNT = {
  username: 'master',
  password: 'Master123!@#',
  role: 'super_admin',
  id: 1,
  name: 'Master Administrator',
  email: 'master@oentest.com',
  mfaEnabled: false, // 개발 환경에서는 MFA 비활성화
  lastLogin: new Date().toISOString(),
  permissions: ['*'] // 모든 권한
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(null);
  const [requiresMFA, setRequiresMFA] = useState(false);
  const [tempCredentials, setTempCredentials] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (token) {
        // 개발 환경에서는 토큰이 있으면 바로 인증된 것으로 처리
        setUser(TEST_MASTER_ACCOUNT);
        setIsAuthenticated(true);
      }
    } catch (error) {
      localStorage.removeItem('adminToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password, totpCode = null) => {
    try {
      // Check lockout status
      if (lockoutUntil && new Date() < lockoutUntil) {
        const remainingTime = Math.ceil((lockoutUntil - new Date()) / 1000 / 60);
        toast.error(`계정이 잠겨있습니다. ${remainingTime}분 후에 다시 시도해주세요.`);
        return false;
      }

      // 개발용 테스트 계정 로그인 처리
      if (username === TEST_MASTER_ACCOUNT.username && password === TEST_MASTER_ACCOUNT.password) {
        // MFA가 활성화되어 있고 TOTP 코드가 제공되지 않은 경우
        if (TEST_MASTER_ACCOUNT.mfaEnabled && !totpCode) {
          setRequiresMFA(true);
          setTempCredentials({ username, password });
          setLoginAttempts(0);
          setLockoutUntil(null);
          toast.info('2단계 인증 코드를 입력해주세요.');
          return { requiresMFA: true };
        }

        // 로그인 성공
        setUser(TEST_MASTER_ACCOUNT);
        setIsAuthenticated(true);
        setLoginAttempts(0);
        setLockoutUntil(null);
        setRequiresMFA(false);
        setTempCredentials(null);
        localStorage.setItem('adminToken', 'test-master-token');
        toast.success('마스터 계정으로 로그인되었습니다!');
        return true;
      } else {
        // 로그인 실패
        handleLoginFailure();
        toast.error('잘못된 계정 정보입니다.');
        return false;
      }
    } catch (error) {
      handleLoginFailure();
      toast.error(error.message || '로그인에 실패했습니다.');
      return false;
    }
  };

  const handleLoginFailure = () => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    
    if (newAttempts >= 5) {
      const lockoutTime = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      setLockoutUntil(lockoutTime);
      toast.error('로그인 실패 5회 초과로 계정이 30분간 잠깁니다.');
    } else {
      const remainingAttempts = 5 - newAttempts;
      toast.error(`로그인 실패. ${remainingAttempts}회 남았습니다.`);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setLoginAttempts(0);
    setLockoutUntil(null);
    setRequiresMFA(false);
    setTempCredentials(null);
    localStorage.removeItem('adminToken');
    toast.success('로그아웃되었습니다.');
  };

  const setupMFA = async () => {
    try {
      // 개발용 MFA 설정 시뮬레이션
      const response = {
        success: true,
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        secret: 'TESTMFA123456789'
      };
      return response;
    } catch (error) {
      toast.error('MFA 설정에 실패했습니다.');
      throw error;
    }
  };

  const verifyMFA = async (totpCode) => {
    try {
      // 개발용 MFA 인증 시뮬레이션 (123456으로 테스트)
      const response = {
        success: totpCode === '123456',
        message: totpCode === '123456' ? 'MFA 인증이 완료되었습니다.' : '잘못된 인증 코드입니다.'
      };
      
      if (response.success) {
        toast.success('MFA 인증이 완료되었습니다.');
      } else {
        toast.error('잘못된 인증 코드입니다.');
      }
      return response;
    } catch (error) {
      toast.error('MFA 인증에 실패했습니다.');
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    loginAttempts,
    lockoutUntil,
    requiresMFA,
    tempCredentials,
    login,
    logout,
    setupMFA,
    verifyMFA,
    hasPermission: (permission) => hasPermission(user?.role, permission),
    filterSensitiveData: (data) => filterSensitiveData(data, user?.role),
    logPermissionAttempt: (action, success, details) => 
      logPermissionAttempt(user?.id, user?.role, action, success, details),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 