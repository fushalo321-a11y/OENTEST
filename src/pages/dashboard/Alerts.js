import React, { useState, useEffect } from 'react';
import {
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  UserIcon,
  ClockIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  BellIcon,
  ComputerDesktopIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedAlerts, setSelectedAlerts] = useState([]);

  useEffect(() => {
    // 목업 데이터
    setAlerts([
      {
        id: 1,
        type: 'security',
        severity: 'high',
        title: '의심스러운 로그인 시도',
        message: '동일 IP(192.168.1.100)에서 30분간 50회 로그인 시도가 감지되었습니다.',
        user: 'user123',
        timestamp: '2024-01-20 14:35:22',
        status: 'unread',
        details: {
          ip: '192.168.1.100',
          attempts: 50,
          timeframe: '30분'
        }
      },
      {
        id: 2,
        type: 'financial',
        severity: 'medium',
        title: '대량 포인트 전환 요청',
        message: '사용자가 500만 포인트를 현금으로 전환 요청했습니다.',
        user: 'vip_user456',
        timestamp: '2024-01-20 13:22:15',
        status: 'unread',
        details: {
          amount: 5000000,
          type: '포인트 → 현금'
        }
      },
      {
        id: 3,
        type: 'system',
        severity: 'high',
        title: '시스템 오류 발생',
        message: '결제 모듈에서 일시적 오류가 발생했습니다.',
        user: 'system',
        timestamp: '2024-01-20 12:45:33',
        status: 'read',
        details: {
          module: '결제 시스템',
          error_code: 'PAY_500'
        }
      },
      {
        id: 4,
        type: 'user',
        severity: 'medium',
        title: '비정상적인 사용 패턴',
        message: '짧은 시간 내 다수 계정에서 동일한 행동 패턴이 감지되었습니다.',
        user: 'multiple',
        timestamp: '2024-01-20 11:18:44',
        status: 'unread',
        details: {
          accounts: 15,
          pattern: '동일 행동 반복'
        }
      },
      {
        id: 5,
        type: 'security',
        severity: 'low',
        title: '새로운 디바이스 로그인',
        message: '사용자가 새로운 디바이스에서 로그인했습니다.',
        user: 'regular_user789',
        timestamp: '2024-01-20 10:05:12',
        status: 'read',
        details: {
          device: 'iPhone 15 Pro',
          location: '서울, 대한민국'
        }
      }
    ]);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'security': return ShieldExclamationIcon;
      case 'financial': return CreditCardIcon;
      case 'system': return ComputerDesktopIcon;
      case 'user': return UserIcon;
      default: return BellIcon;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'unread') return alert.status === 'unread';
    if (filter === 'high') return alert.severity === 'high';
    return alert.type === filter;
  });

  const markAsRead = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, status: 'read' } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, status: 'read' })));
  };

  const deleteAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const handleSelectAlert = (alertId) => {
    setSelectedAlerts(prev => 
      prev.includes(alertId) 
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };

  const handleBulkAction = (action) => {
    if (action === 'read') {
      setAlerts(alerts.map(alert => 
        selectedAlerts.includes(alert.id) ? { ...alert, status: 'read' } : alert
      ));
    } else if (action === 'delete') {
      setAlerts(alerts.filter(alert => !selectedAlerts.includes(alert.id)));
    }
    setSelectedAlerts([]);
  };

  const unreadCount = alerts.filter(alert => alert.status === 'unread').length;
  const highSeverityCount = alerts.filter(alert => alert.severity === 'high').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">이상 행동 알림</h1>
          <p className="mt-1 text-sm text-gray-600">
            시스템에서 감지된 이상 행동 및 보안 알림을 확인하세요.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              긴급 {highSeverityCount}건
            </span>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              미확인 {unreadCount}건
            </span>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">긴급 알림</p>
              <p className="text-2xl font-semibold text-gray-900">{highSeverityCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <BellIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">미확인</p>
              <p className="text-2xl font-semibold text-gray-900">{unreadCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <CheckIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">확인됨</p>
              <p className="text-2xl font-semibold text-gray-900">{alerts.length - unreadCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-gray-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">전체</p>
              <p className="text-2xl font-semibold text-gray-900">{alerts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 필터 및 액션 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">전체 알림</option>
                <option value="unread">미확인만</option>
                <option value="high">긴급만</option>
                <option value="security">보안</option>
                <option value="financial">금융</option>
                <option value="system">시스템</option>
                <option value="user">사용자</option>
              </select>
              {selectedAlerts.length > 0 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBulkAction('read')}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                  >
                    읽음 처리
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="text-sm bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              모두 읽음 처리
            </button>
          </div>
        </div>

        {/* 알림 목록 */}
        <div className="divide-y divide-gray-200">
          {filteredAlerts.map((alert) => {
            const IconComponent = getTypeIcon(alert.type);
            return (
              <div
                key={alert.id}
                className={`p-6 hover:bg-gray-50 ${alert.status === 'unread' ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedAlerts.includes(alert.id)}
                    onChange={() => handleSelectAlert(alert.id)}
                    className="mt-1 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <div className="flex-shrink-0">
                    <IconComponent className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900">{alert.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(alert.severity)}`}>
                          {alert.severity === 'high' ? '긴급' : alert.severity === 'medium' ? '보통' : '낮음'}
                        </span>
                        {alert.status === 'unread' && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => markAsRead(alert.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteAlert(alert.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{alert.message}</p>
                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                      <span>사용자: {alert.user}</span>
                      <span>•</span>
                      <span>{alert.timestamp}</span>
                    </div>
                    
                    {/* 상세 정보 */}
                    <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                      <h4 className="text-xs font-medium text-gray-700 mb-2">상세 정보</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        {Object.entries(alert.details).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium">{key}:</span> {value}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="p-6 text-center">
            <BellIcon className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">알림이 없습니다</h3>
            <p className="mt-1 text-sm text-gray-500">현재 표시할 알림이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;