import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import { useAuth } from '../contexts/AuthContext';
import {
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Clock,
  Activity,
} from 'lucide-react';
import { PERMISSIONS } from '../utils/permissions';

const Dashboard = () => {
  const { hasPermission } = useAuth();
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: adminService.getDashboardStats,
    refetchInterval: 30000, // 30초마다 새로고침
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: adminService.getRecentActivity,
    refetchInterval: 60000, // 1분마다 새로고침
  });

  const StatCard = ({ title, value, icon: Icon, color = 'blue', change }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% from last week
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => (
    <div className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex-shrink-0">
        {activity.type === 'login' && <Activity className="h-5 w-5 text-blue-500" />}
        {activity.type === 'post' && <FileText className="h-5 w-5 text-green-500" />}
        {activity.type === 'user' && <Users className="h-5 w-5 text-purple-500" />}
        {activity.type === 'error' && <AlertTriangle className="h-5 w-5 text-red-500" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
        <p className="text-sm text-gray-500">{activity.user}</p>
      </div>
      <div className="flex-shrink-0">
        <p className="text-sm text-gray-500">{activity.time}</p>
      </div>
    </div>
  );

  if (statsLoading || activityLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="mt-1 text-sm text-gray-600">
          OEN TEST 커뮤니티 현황을 한눈에 확인하세요
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="총 사용자"
          value={stats?.totalUsers || 0}
          icon={Users}
          color="blue"
          change={stats?.userGrowth || 0}
        />
        <StatCard
          title="총 게시글"
          value={stats?.totalPosts || 0}
          icon={FileText}
          color="green"
          change={stats?.postGrowth || 0}
        />
        <StatCard
          title="대기 중인 게시글"
          value={stats?.pendingPosts || 0}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="활성 사용자"
          value={stats?.activeUsers || 0}
          icon={TrendingUp}
          color="purple"
          change={stats?.activeUserGrowth || 0}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">최근 활동</h3>
          </div>
          <div className="p-6">
            {recentActivity?.length > 0 ? (
              <div className="space-y-2">
                {recentActivity.slice(0, 10).map((activity, index) => (
                  <ActivityItem key={index} activity={activity} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">최근 활동이 없습니다.</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">빠른 작업</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {hasPermission(PERMISSIONS.POST_APPROVE) && (
                <button className="w-full btn-primary">
                  새 게시글 승인
                </button>
              )}
              {hasPermission(PERMISSIONS.USER_VIEW) && (
                <button className="w-full btn-secondary">
                  사용자 관리
                </button>
              )}
              {hasPermission(PERMISSIONS.SECURITY_VIEW) && (
                <button className="w-full btn-secondary">
                  보안 설정
                </button>
              )}
              {hasPermission(PERMISSIONS.LOG_VIEW) && (
                <button className="w-full btn-secondary">
                  시스템 로그 확인
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">시스템 상태</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-700">데이터베이스 연결</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-700">API 서버</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-700">보안 시스템</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 