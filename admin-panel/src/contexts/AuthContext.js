import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// 테스트용 마스터 계정 (개발 환경)
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [requiresMFA, setRequiresMFA] = useState(false);
  const [tempCredentials, setTempCredentials] = useState(null);

  // 토큰 검증 (개발 환경에서는 테스트 계정 사용)
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (token) {
          // 개발 환경에서는 토큰이 있으면 바로 마스터 계정으로 설정
          setUser(TEST_MASTER_ACCOUNT);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // 약간의 지연을 두어 로딩 상태를 확인할 수 있도록 함
    setTimeout(checkAuth, 500);
  }, []);

  const login = async (username, password) => {
    try {
      // 개발 환경에서는 마스터 계정만 허용
      if (username === TEST_MASTER_ACCOUNT.username && password === TEST_MASTER_ACCOUNT.password) {
        const token = 'test-token-' + Date.now();
        localStorage.setItem('adminToken', token);
        setUser(TEST_MASTER_ACCOUNT);
        setIsAuthenticated(true);
        setRequiresMFA(false);
        setTempCredentials(null);
        return { success: true };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
    setIsAuthenticated(false);
    setRequiresMFA(false);
    setTempCredentials(null);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    requiresMFA,
    tempCredentials,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 