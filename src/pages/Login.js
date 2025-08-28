import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Eye, EyeOff, Lock, User, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showTOTP, setShowTOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [securityWarnings, setSecurityWarnings] = useState([]);
  const { login, loginAttempts, lockoutUntil, requiresMFA, tempCredentials } = useAuth();

  // 2단계 인증이 필요한 경우 tempCredentials에서 사용자 정보 가져오기
  useEffect(() => {
    if (requiresMFA && tempCredentials) {
      setUsername(tempCredentials.username);
      setPassword(tempCredentials.password);
    }
  }, [requiresMFA, tempCredentials]);

  // 보안 경고 체크
  useEffect(() => {
    const warnings = [];
    
    // HTTPS 체크
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      warnings.push('보안 연결(HTTPS)을 사용하는 것을 권장합니다.');
    }
    
    // 개발자 도구 체크 (기본적인 수준)
    if (window.outerHeight - window.innerHeight > 200) {
      warnings.push('개발자 도구가 감지되었습니다. 보안을 위해 닫아주세요.');
    }
    
    setSecurityWarnings(warnings);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('사용자명과 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(username, password, totpCode || null);
      if (result === true) {
        // Login successful, redirect will be handled by App.js
      } else if (result && result.requiresMFA) {
        // 2단계 인증이 필요한 경우, TOTP 입력 필드 표시
        setShowTOTP(true);
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isLockedOut = lockoutUntil && new Date() < lockoutUntil;
  const remainingTime = lockoutUntil ? Math.ceil((lockoutUntil - new Date()) / 1000 / 60) : 0;

  return (
    <div className="min-h-screen bg-[#fcfcf0] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Master System
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {isLockedOut ? (
            <div className="text-center">
              <Lock className="mx-auto h-12 w-12 text-red-500 mb-4" />
                             <h3 className="text-lg font-semibold text-gray-900 mb-2">
                 계정이 잠겨있습니다
               </h3>
                             <p className="text-sm font-semibold text-gray-900">
                 {remainingTime}분 후에 다시 시도해주세요.
               </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
                             <div>
                 <label htmlFor="username" className="block text-sm font-semibold text-gray-900 mb-2">
                   계정
                 </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field pl-10"
                    placeholder="관리자 사용자명"
                    disabled={isLoading || requiresMFA}
                  />
                </div>
              </div>

                             <div>
                 <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                   비밀번호
                 </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10 pr-10"
                    placeholder="비밀번호"
                    disabled={isLoading || requiresMFA}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={requiresMFA}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

                             {(showTOTP || requiresMFA) && (
                 <div>
                   <label htmlFor="totp" className="block text-sm font-semibold text-gray-900 mb-2">
                     2단계 인증 코드
                   </label>
                  <input
                    id="totp"
                    type="text"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value)}
                    className="input-field"
                    placeholder="6자리 인증 코드"
                    maxLength={6}
                    disabled={isLoading}
                    autoFocus
                  />
                                     <p className="mt-1 text-sm font-semibold text-gray-900">
                     인증 앱에서 생성된 6자리 코드를 입력해주세요.
                   </p>
                </div>
              )}

              {loginAttempts > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                     <p className="text-sm font-semibold text-yellow-900">
                     로그인 실패: {loginAttempts}/5회
                   </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '로그인 중...' : (requiresMFA ? '2단계 인증 확인' : '로그인')}
              </button>

              
            </form>
          )}
        </div>

        {securityWarnings.length > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                             <span className="text-sm font-semibold text-yellow-900">보안 경고</span>
            </div>
                         <ul className="text-xs font-semibold text-yellow-900 space-y-1">
               {securityWarnings.map((warning, index) => (
                 <li key={index}>• {warning}</li>
               ))}
             </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login; 