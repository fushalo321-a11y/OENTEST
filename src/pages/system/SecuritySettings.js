import React, { useState } from 'react';
import {
  ShieldCheckIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const SecuritySettings = () => {
  const [settings, setSettings] = useState({
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      maxAge: 90
    },
    loginSecurity: {
      maxFailedAttempts: 5,
      lockoutDuration: 30,
      sessionTimeout: 120,
      forcePasswordChange: false,
      twoFactorAuth: false
    },
    ipWhitelist: {
      enabled: false,
      addresses: ['192.168.1.0/24', '10.0.0.0/8']
    },
    auditLog: {
      enabled: true,
      retentionDays: 90,
      logLevel: 'info'
    }
  });

  const [showPasswords, setShowPasswords] = useState(false);
  const [newIpAddress, setNewIpAddress] = useState('');

  const handleSettingChange = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const addIpAddress = () => {
    if (newIpAddress.trim()) {
      setSettings(prev => ({
        ...prev,
        ipWhitelist: {
          ...prev.ipWhitelist,
          addresses: [...prev.ipWhitelist.addresses, newIpAddress.trim()]
        }
      }));
      setNewIpAddress('');
    }
  };

  const removeIpAddress = (index) => {
    setSettings(prev => ({
      ...prev,
      ipWhitelist: {
        ...prev.ipWhitelist,
        addresses: prev.ipWhitelist.addresses.filter((_, i) => i !== index)
      }
    }));
  };

  const saveSettings = () => {
    // API 호출 로직
    console.log('보안 설정 저장:', settings);
    alert('보안 설정이 저장되었습니다.');
  };

  const resetToDefaults = () => {
    if (window.confirm('기본값으로 초기화하시겠습니까?')) {
      setSettings({
        passwordPolicy: {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: true,
          maxAge: 90
        },
        loginSecurity: {
          maxFailedAttempts: 5,
          lockoutDuration: 30,
          sessionTimeout: 120,
          forcePasswordChange: false,
          twoFactorAuth: false
        },
        ipWhitelist: {
          enabled: false,
          addresses: ['192.168.1.0/24', '10.0.0.0/8']
        },
        auditLog: {
          enabled: true,
          retentionDays: 90,
          logLevel: 'info'
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">보안 설정</h1>
          <p className="mt-2 text-sm text-gray-600">시스템의 보안 정책을 설정합니다.</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            기본값 복원
          </button>
          <button
            onClick={saveSettings}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            설정 저장
          </button>
        </div>
      </div>

      {/* 비밀번호 정책 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <KeyIcon className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">비밀번호 정책</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                최소 길이
              </label>
              <input
                type="number"
                min="6"
                max="20"
                value={settings.passwordPolicy.minLength}
                onChange={(e) => handleSettingChange('passwordPolicy', 'minLength', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 만료일 (일)
              </label>
              <input
                type="number"
                min="30"
                max="365"
                value={settings.passwordPolicy.maxAge}
                onChange={(e) => handleSettingChange('passwordPolicy', 'maxAge', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <h4 className="text-sm font-medium text-gray-900">필수 포함 문자</h4>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.passwordPolicy.requireUppercase}
                  onChange={(e) => handleSettingChange('passwordPolicy', 'requireUppercase', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">대문자</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.passwordPolicy.requireLowercase}
                  onChange={(e) => handleSettingChange('passwordPolicy', 'requireLowercase', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">소문자</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.passwordPolicy.requireNumbers}
                  onChange={(e) => handleSettingChange('passwordPolicy', 'requireNumbers', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">숫자</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.passwordPolicy.requireSpecialChars}
                  onChange={(e) => handleSettingChange('passwordPolicy', 'requireSpecialChars', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">특수문자</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 로그인 보안 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">로그인 보안</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                최대 실패 횟수
              </label>
              <input
                type="number"
                min="3"
                max="10"
                value={settings.loginSecurity.maxFailedAttempts}
                onChange={(e) => handleSettingChange('loginSecurity', 'maxFailedAttempts', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                계정 잠금 시간 (분)
              </label>
              <input
                type="number"
                min="5"
                max="1440"
                value={settings.loginSecurity.lockoutDuration}
                onChange={(e) => handleSettingChange('loginSecurity', 'lockoutDuration', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                세션 타임아웃 (분)
              </label>
              <input
                type="number"
                min="30"
                max="480"
                value={settings.loginSecurity.sessionTimeout}
                onChange={(e) => handleSettingChange('loginSecurity', 'sessionTimeout', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.loginSecurity.forcePasswordChange}
                onChange={(e) => handleSettingChange('loginSecurity', 'forcePasswordChange', e.target.checked)}
                className="rounded border-gray-300 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700">첫 로그인 시 비밀번호 변경 강제</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.loginSecurity.twoFactorAuth}
                onChange={(e) => handleSettingChange('loginSecurity', 'twoFactorAuth', e.target.checked)}
                className="rounded border-gray-300 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700">2단계 인증 활성화</span>
            </label>
          </div>
        </div>
      </div>

      {/* IP 화이트리스트 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">IP 화이트리스트</h3>
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.ipWhitelist.enabled}
                onChange={(e) => handleSettingChange('ipWhitelist', 'enabled', e.target.checked)}
                className="rounded border-gray-300 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700">활성화</span>
            </label>
          </div>
        </div>
        <div className="p-6">
          {settings.ipWhitelist.enabled && (
            <>
              <div className="mb-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="IP 주소 또는 CIDR (예: 192.168.1.0/24)"
                    value={newIpAddress}
                    onChange={(e) => setNewIpAddress(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && addIpAddress()}
                  />
                  <button
                    onClick={addIpAddress}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    추가
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                {settings.ipWhitelist.addresses.map((ip, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-mono text-gray-900">{ip}</span>
                    <button
                      onClick={() => removeIpAddress(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <span className="sr-only">삭제</span>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>주의:</strong> IP 화이트리스트를 활성화하면 지정된 IP에서만 접근할 수 있습니다.
                  현재 IP를 반드시 포함시키세요.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 감사 로그 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <ClockIcon className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">감사 로그</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                로그 보관 기간 (일)
              </label>
              <input
                type="number"
                min="30"
                max="365"
                value={settings.auditLog.retentionDays}
                onChange={(e) => handleSettingChange('auditLog', 'retentionDays', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                로그 레벨
              </label>
              <select
                value={settings.auditLog.logLevel}
                onChange={(e) => handleSettingChange('auditLog', 'logLevel', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="error">오류만</option>
                <option value="warn">경고 이상</option>
                <option value="info">정보 이상</option>
                <option value="debug">전체</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.auditLog.enabled}
                onChange={(e) => handleSettingChange('auditLog', 'enabled', e.target.checked)}
                className="rounded border-gray-300 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700">감사 로그 활성화</span>
            </label>
          </div>
        </div>
      </div>

      {/* 현재 보안 상태 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">현재 보안 상태</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <CheckCircleIcon className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <div className="text-sm font-medium text-green-900">SSL 인증서</div>
                <div className="text-sm text-green-700">정상</div>
              </div>
            </div>
            <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <div className="text-sm font-medium text-yellow-900">방화벽</div>
                <div className="text-sm text-yellow-700">일부 설정 필요</div>
              </div>
            </div>
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <CheckCircleIcon className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <div className="text-sm font-medium text-green-900">데이터베이스</div>
                <div className="text-sm text-green-700">암호화됨</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;