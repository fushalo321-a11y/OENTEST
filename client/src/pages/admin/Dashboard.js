import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';
import {
  Users,
  FileText,
  MessageCircle,
  Flag,
  TrendingUp,
  Eye,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

const Dashboard = () => {
  const { user } = useAuth();

  // 대시보드 통계 조회
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: async () => {
      const response = await api.get('/api/admin/dashboard');
      return response.data;
    },
  });

  // 최근 활동 조회
  const { data: recentActivity = [] } = useQuery({
    queryKey: ['adminRecentActivity'],
    queryFn: async () => {
      const response = await api.get('/api/admin/recent-activity');
      return response.data;
    },
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">접근 권한이 없습니다</h2>
          <p className="text-gray-600">관리자만 접근할 수 있는 페이지입니다.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: '전체 사용자',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: stats?.newUsersThisWeek || 0,
      changeText: '이번 주 신규',
    },
    {
      title: '전체 게시물',
      value: stats?.totalPosts || 0,
      icon: FileText,
      color: 'bg-green-500',
      change: stats?.newPostsThisWeek || 0,
      changeText: '이번 주 신규',
    },
    {
      title: '전체 댓글',
      value: stats?.totalComments || 0,
      icon: MessageCircle,
      color: 'bg-purple-500',
      change: stats?.newCommentsThisWeek || 0,
      changeText: '이번 주 신규',
    },
    {
      title: '신고된 콘텐츠',
      value: stats?.totalReports || 0,
      icon: Flag,
      color: 'bg-red-500',
      change: stats?.newReportsThisWeek || 0,
      changeText: '이번 주 신규',
    },
  ];

  const activityIcons = {
    post: FileText,
    comment: MessageCircle,
    user: Users,
    report: Flag,
  };

  const activityColors = {
    post: 'text-green-600',
    comment: 'text-purple-600',
    user: 'text-blue-600',
    report: 'text-red-600',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="text-gray-600 mt-2">커뮤니티 현황을 한눈에 확인하세요</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                  {stat.change > 0 && (
                    <p className="text-sm text-green-600">
                      +{stat.change} {stat.changeText}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 상세 통계 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">상세 통계</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">활성 사용자</span>
                <span className="font-medium">{stats?.activeUsers || 0}명</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">오늘 조회수</span>
                <span className="font-medium">{stats?.todayViews || 0}회</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">평균 좋아요</span>
                <span className="font-medium">{stats?.avgLikes || 0}개</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">대기 중인 신고</span>
                <span className="font-medium text-red-600">{stats?.pendingReports || 0}건</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">승인 대기 게시물</span>
                <span className="font-medium text-yellow-600">{stats?.pendingPosts || 0}건</span>
              </div>
            </div>
          </div>

          {/* 최근 활동 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">최근 활동</h2>
            </div>
            <div className="p-6">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">최근 활동이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.slice(0, 5).map((activity, index) => {
                    const Icon = activityIcons[activity.type] || Clock;
                    const color = activityColors[activity.type] || 'text-gray-600';
                    
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full bg-gray-100`}>
                          <Icon className={`h-4 w-4 ${color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true, locale: ko })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 빠른 액션 */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">빠른 액션</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Flag className="h-4 w-4 mr-2" />
                신고 처리하기
              </button>
              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Users className="h-4 w-4 mr-2" />
                사용자 관리
              </button>
              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <FileText className="h-4 w-4 mr-2" />
                게시물 관리
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 