import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Lock, Globe, Save, AlertTriangle } from 'lucide-react';
import { PERMISSIONS } from '../utils/permissions';
import toast from 'react-hot-toast';

const SecuritySettings = () => {
  const [settings, setSettings] = useState({});
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();

  const { data: securitySettings, isLoading } = useQuery({
    queryKey: ['security-settings'],
    queryFn: adminService.getSecuritySettings,
  });

  const { data: ipWhitelist } = useQuery({
    queryKey: ['ip-whitelist'],
    queryFn: adminService.getIPWhitelist,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: adminService.updateSecuritySettings,
    onSuccess: () => {
      toast.success('보안 설정이 업데이트되었습니다.');
      queryClient.invalidateQueries(['security-settings']);
    },
    onError: (error) => {
      toast.error('설정 업데이트에 실패했습니다.');
    },
  });

  const addIPMutation = useMutation({
    mutationFn: adminService.addIPToWhitelist,
    onSuccess: () => {
      toast.success('IP가 화이트리스트에 추가되었습니다.');
      queryClient.invalidateQueries(['ip-whitelist']);
    },
  });

  const removeIPMutation = useMutation({
    mutationFn: adminService.removeIPFromWhitelist,
    onSuccess: () => {
      toast.success('IP가 화이트리스트에서 제거되었습니다.');
      queryClient.invalidateQueries(['ip-whitelist']);
    },
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate(settings);
  };

  const handleAddIP = (ip) => {
    if (ip) {
      addIPMutation.mutate(ip);
    }
  };

  const handleRemoveIP = (ip) => {
    removeIPMutation.mutate(ip);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">보안 설정</h1>
        <p className="mt-1 text-sm text-gray-600">
          관리자 패널의 보안 설정을 구성하세요
        </p>
      </div>

      {/* Password Policy */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Lock className="h-5 w-5 mr-2" />
            비밀번호 정책
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                최소 비밀번호 길이
              </label>
              <input
                type="number"
                min="8"
                max="50"
                value={settings.minPasswordLength || securitySettings?.minPasswordLength || 12}
                onChange={(e) => handleSettingChange('minPasswordLength', parseInt(e.target.value))}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                로그인 실패 제한
              </label>
              <input
                type="number"
                min="3"
                max="10"
                value={settings.maxLoginAttempts || securitySettings?.maxLoginAttempts || 5}
                onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                className="input-field"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.requireUppercase ?? securitySettings?.requireUppercase ?? true}
                onChange={(e) => handleSettingChange('requireUppercase', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">대문자 포함 필수</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.requireLowercase ?? securitySettings?.requireLowercase ?? true}
                onChange={(e) => handleSettingChange('requireLowercase', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">소문자 포함 필수</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.requireNumbers ?? securitySettings?.requireNumbers ?? true}
                onChange={(e) => handleSettingChange('requireNumbers', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">숫자 포함 필수</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.requireSpecialChars ?? securitySettings?.requireSpecialChars ?? true}
                onChange={(e) => handleSettingChange('requireSpecialChars', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">특수문자 포함 필수</span>
            </label>
          </div>
        </div>
      </div>

      {/* MFA Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            2단계 인증 (MFA)
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.enableMFA ?? securitySettings?.enableMFA ?? true}
              onChange={(e) => handleSettingChange('enableMFA', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">2단계 인증 활성화</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.disableMFAInDev ?? securitySettings?.disableMFAInDev ?? true}
              onChange={(e) => handleSettingChange('disableMFAInDev', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">개발 환경에서 MFA 비활성화</span>
          </label>
        </div>
      </div>

      {/* IP Whitelist */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            IP 화이트리스트
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.enableIPWhitelist ?? securitySettings?.enableIPWhitelist ?? true}
              onChange={(e) => handleSettingChange('enableIPWhitelist', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">IP 화이트리스트 활성화</span>
          </label>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              허용된 IP 주소
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="IP 주소 입력 (예: 192.168.1.1)"
                className="input-field flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddIP(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = e.target.previousElementSibling;
                  handleAddIP(input.value);
                  input.value = '';
                }}
                className="btn-primary"
              >
                추가
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {ipWhitelist?.length > 0 ? (
              ipWhitelist.map((ip, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{ip}</span>
                  <button
                    onClick={() => handleRemoveIP(ip)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    제거
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">등록된 IP가 없습니다.</p>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        {hasPermission(PERMISSIONS.SECURITY_UPDATE) ? (
          <button
            onClick={handleSaveSettings}
            disabled={updateSettingsMutation.isLoading}
            className="btn-primary flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {updateSettingsMutation.isLoading ? '저장 중...' : '설정 저장'}
          </button>
        ) : (
          <div className="flex items-center text-yellow-600">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span>설정을 변경할 권한이 없습니다.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecuritySettings; 