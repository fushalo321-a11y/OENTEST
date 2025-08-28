import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  UsersIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  BanknotesIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: {
      total: 0,
      new: 0,
      active: 0,
      growth: 0
    },
    posts: {
      total: 0,
      today: 0,
      pending: 0,
      growth: 0
    },
    finance: {
      deposits: 0,
      withdrawals: 0,
      points: 0
    }
  });
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // 실제 API 호출 대신 목업 데이터 사용
    setStats({
      users: {
        total: 1245,
        new: 23,
        active: 892,
        growth: 12.5
      },
      posts: {
        total: 3456,
        today: 45,
        pending: 12,
        growth: 8.3
      },
      finance: {
        deposits: 2500000,
        withdrawals: 1800000,
        points: 45000000
      }
    });

    setAlerts([
      {
        id: 1,
        type: 'warning',
        title: '의심스러운 로그인 시도',
        message: '동일 IP에서 30분간 50회 로그인 시도',
        time: '5분 전',
        severity: 'high'
      },
      {
        id: 2,
        type: 'info',
        title: '대량 포인트 전환',
        message: '사용자 ID: user123이 500만 포인트 전환 요청',
        time: '15분 전',
        severity: 'medium'
      },
      {
        id: 3,
        type: 'error',
        title: '시스템 오류',
        message: '결제 모듈에서 일시적 오류 발생',
        time: '1시간 전',
        severity: 'high'
      }
    ]);
  }, []);

  const StatCard = ({ title, value, subtitle, growth, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value.toLocaleString()}</p>
            {growth !== undefined && (
              <span className={`ml-2 flex items-center text-sm ${
                growth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {growth >= 0 ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                {Math.abs(growth)}%
              </span>
            )}
          </div>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const AlertItem = ({ alert }) => {
    const severityColors = {
      high: 'border-red-200 bg-red-50',
      medium: 'border-yellow-200 bg-yellow-50',
      low: 'border-blue-200 bg-blue-50'
    };

    const iconColors = {
      warning: 'text-yellow-500',
      error: 'text-red-500',
      info: 'text-blue-500'
    };

    return (
      <div className={`p-4 border rounded-lg ${severityColors[alert.severity]}`}>
        <div className="flex items-start">
          <ExclamationTriangleIcon className={`h-5 w-5 mt-0.5 ${iconColors[alert.type]}`} />
          <div className="ml-3 flex-1">
            <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <ClockIcon className="h-4 w-4 mr-1" />
              {alert.time}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">대시보드</h1>
        <div className="text-sm text-gray-500">
          마지막 업데이트: {new Date().toLocaleString('ko-KR')}
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-xl font-semibold mb-2">환영합니다, {user?.name}님!</h2>
        <p className="text-blue-100">Master System 관리자 패널에 로그인하셨습니다.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="전체 회원"
          value={stats.users.total}
          subtitle={`신규 가입: ${stats.users.new}명`}
          growth={stats.users.growth}
          icon={UsersIcon}
          color="blue"
        />
        <StatCard
          title="활성 회원"
          value={stats.users.active}
          subtitle="최근 7일 활동"
          icon={EyeIcon}
          color="green"
        />
        <StatCard
          title="전체 게시글"
          value={stats.posts.total}
          subtitle={`오늘: ${stats.posts.today}개`}
          growth={stats.posts.growth}
          icon={DocumentTextIcon}
          color="purple"
        />
        <StatCard
          title="대기 중인 게시글"
          value={stats.posts.pending}
          subtitle="검토 필요"
          icon={ExclamationTriangleIcon}
          color="yellow"
        />
      </div>

      {/* Finance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatCard
          title="금일 입금"
          value={stats.finance.deposits}
          subtitle="원"
          icon={BanknotesIcon}
          color="green"
        />
        <StatCard
          title="금일 출금"
          value={stats.finance.withdrawals}
          subtitle="원"
          icon={BanknotesIcon}
          color="red"
        />
        <StatCard
          title="총 포인트"
          value={stats.finance.points}
          subtitle="포인트"
          icon={BanknotesIcon}
          color="indigo"
        />
      </div>

      {/* Alerts Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">이상 행동 알림</h3>
        </div>
        <div className="p-6">
          {alerts.length > 0 ? (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <ExclamationTriangleIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">현재 알림이 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">빠른 실행</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <UsersIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium">회원 관리</span>
            </button>
            <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <DocumentTextIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium">게시글 관리</span>
            </button>
            <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <BanknotesIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium">입출금 관리</span>
            </button>
            <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <span className="text-sm font-medium">보안 설정</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 