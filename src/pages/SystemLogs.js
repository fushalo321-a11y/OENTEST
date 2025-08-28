import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import { useAuth } from '../contexts/AuthContext';
import { Activity, AlertTriangle, Info, XCircle, Download } from 'lucide-react';
import { PERMISSIONS } from '../utils/permissions';

const SystemLogs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [logLevel, setLogLevel] = useState('all');
  const [logType, setLogType] = useState('system');
  const { hasPermission } = useAuth();

  const { data: systemLogs, isLoading: systemLoading } = useQuery({
    queryKey: ['system-logs', currentPage, logLevel],
    queryFn: () => adminService.getSystemLogs(currentPage, 50, logLevel),
  });

  const { data: loginLogs, isLoading: loginLoading } = useQuery({
    queryKey: ['login-logs', currentPage],
    queryFn: () => adminService.getLoginLogs(currentPage, 50),
  });

  const { data: adminLogs, isLoading: adminLoading } = useQuery({
    queryKey: ['admin-logs', currentPage],
    queryFn: () => adminService.getAdminLogs(currentPage, 50),
  });

  const getLogIcon = (level) => {
    switch (level) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warn':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getLogColor = (level) => {
    switch (level) {
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warn':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const renderLogs = (logs, loading) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!logs?.length) {
      return (
        <div className="text-center py-8 text-gray-500">
          로그가 없습니다.
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {logs.map((log, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getLogColor(log.level)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getLogIcon(log.level)}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {log.message}
                    </span>
                    <span className="text-xs text-gray-500">
                      {log.level.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {log.details}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {log.user && `사용자: ${log.user} • `}
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">시스템 로그</h1>
        <p className="mt-1 text-sm text-gray-600">
          시스템 활동과 보안 이벤트를 모니터링하세요
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="logType"
                value="system"
                checked={logType === 'system'}
                onChange={(e) => setLogType(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">시스템 로그</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="logType"
                value="login"
                checked={logType === 'login'}
                onChange={(e) => setLogType(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">로그인 로그</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="logType"
                value="admin"
                checked={logType === 'admin'}
                onChange={(e) => setLogType(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">관리자 로그</span>
            </label>
          </div>
          {logType === 'system' && (
            <select
              value={logLevel}
              onChange={(e) => setLogLevel(e.target.value)}
              className="input-field"
            >
              <option value="all">전체 레벨</option>
              <option value="error">에러</option>
              <option value="warn">경고</option>
              <option value="info">정보</option>
              <option value="debug">디버그</option>
            </select>
          )}
                     {hasPermission(PERMISSIONS.LOG_VIEW) && (
             <button className="btn-secondary flex items-center">
               <Download className="h-4 w-4 mr-2" />
               로그 다운로드
             </button>
           )}
        </div>
      </div>

      {/* Logs Display */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {logType === 'system' && '시스템 로그'}
            {logType === 'login' && '로그인 로그'}
            {logType === 'admin' && '관리자 로그'}
          </h3>
        </div>
        <div className="p-6">
          {logType === 'system' && renderLogs(systemLogs, systemLoading)}
          {logType === 'login' && renderLogs(loginLogs, loginLoading)}
          {logType === 'admin' && renderLogs(adminLogs, adminLoading)}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          페이지 {currentPage}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="btn-secondary disabled:opacity-50"
          >
            이전
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="btn-secondary"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemLogs; 