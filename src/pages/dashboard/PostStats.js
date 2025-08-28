import React, { useState, useEffect } from 'react';
import {
  DocumentTextIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const PostStats = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    todayPosts: 0,
    pendingPosts: 0,
    approvedPosts: 0,
    rejectedPosts: 0,
    totalViews: 0,
    totalComments: 0,
    totalLikes: 0,
    dailyPosts: [],
    categoryStats: {},
    popularPosts: []
  });

  const [dateRange, setDateRange] = useState('7days');

  useEffect(() => {
    // 목업 데이터
    setStats({
      totalPosts: 8456,
      todayPosts: 127,
      pendingPosts: 23,
      approvedPosts: 8201,
      rejectedPosts: 232,
      totalViews: 145230,
      totalComments: 12450,
      totalLikes: 18920,
      dailyPosts: [
        { date: '2024-01-14', count: 85, views: 1420 },
        { date: '2024-01-15', count: 92, views: 1580 },
        { date: '2024-01-16', count: 78, views: 1340 },
        { date: '2024-01-17', count: 105, views: 1750 },
        { date: '2024-01-18', count: 88, views: 1620 },
        { date: '2024-01-19', count: 110, views: 1890 },
        { date: '2024-01-20', count: 95, views: 1560 }
      ],
      categoryStats: {
        '자유게시판': { posts: 2850, views: 45620 },
        '공지사항': { posts: 156, views: 89450 },
        '이벤트': { posts: 245, views: 12580 },
        '질문답변': { posts: 1580, views: 28940 },
        '후기': { posts: 1290, views: 15680 },
        '기타': { posts: 2335, views: 18960 }
      },
      popularPosts: [
        { id: 1, title: '신년 이벤트 안내', views: 4520, comments: 89, likes: 156 },
        { id: 2, title: '시스템 업데이트 공지', views: 3840, comments: 67, likes: 134 },
        { id: 3, title: '포인트 적립 방법 안내', views: 3210, comments: 78, likes: 112 },
        { id: 4, title: '회원 등급 혜택 정리', views: 2950, comments: 56, likes: 98 },
        { id: 5, title: '자주 묻는 질문 모음', views: 2680, comments: 45, likes: 87 }
      ]
    });
  }, [dateRange]);

  const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900">{value.toLocaleString()}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">게시글 통계</h1>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">최근 7일</option>
            <option value="30days">최근 30일</option>
            <option value="3months">최근 3개월</option>
            <option value="1year">최근 1년</option>
          </select>
        </div>
      </div>

      {/* 주요 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="총 게시글"
          value={stats.totalPosts}
          subtitle="전체 게시글 수"
          icon={DocumentTextIcon}
          color="blue"
        />
        <StatCard
          title="오늘 게시글"
          value={stats.todayPosts}
          subtitle="금일 작성된 글"
          icon={ClockIcon}
          color="green"
        />
        <StatCard
          title="승인 대기"
          value={stats.pendingPosts}
          subtitle="검토 필요"
          icon={ExclamationTriangleIcon}
          color="yellow"
        />
        <StatCard
          title="총 조회수"
          value={stats.totalViews}
          subtitle="누적 조회수"
          icon={EyeIcon}
          color="purple"
        />
      </div>

      {/* 게시글 상태 현황 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">게시글 상태 현황</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">{stats.approvedPosts.toLocaleString()}</h4>
              <p className="text-sm text-gray-500">승인된 게시글</p>
              <p className="text-xs text-green-600">
                {((stats.approvedPosts / stats.totalPosts) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">{stats.pendingPosts.toLocaleString()}</h4>
              <p className="text-sm text-gray-500">승인 대기</p>
              <p className="text-xs text-yellow-600">
                {((stats.pendingPosts / stats.totalPosts) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">{stats.rejectedPosts.toLocaleString()}</h4>
              <p className="text-sm text-gray-500">거부된 게시글</p>
              <p className="text-xs text-red-600">
                {((stats.rejectedPosts / stats.totalPosts) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 일별 게시글 작성 추이 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">일별 게시글 작성 추이</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {stats.dailyPosts.map((day, index) => (
              <div key={day.date} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-900">{day.date}</span>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">게시글 {day.count}개</p>
                    <p className="text-xs text-gray-500">조회 {day.views.toLocaleString()}</p>
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(day.count / 120) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 카테고리별 게시글 통계 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">카테고리별 게시글 통계</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {Object.entries(stats.categoryStats).map(([category, data]) => (
              <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{category}</h4>
                  <p className="text-xs text-gray-500">게시글 {data.posts.toLocaleString()}개</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{data.views.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">총 조회수</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 인기 게시글 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">인기 게시글 TOP 5</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {stats.popularPosts.map((post, index) => (
              <div key={post.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    index === 2 ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{post.title}</h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center text-xs text-gray-500">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        {post.views.toLocaleString()}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                        {post.comments}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <HeartIcon className="h-4 w-4 mr-1" />
                        {post.likes}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostStats;