import React, { useState, useEffect } from 'react';
import {
  UsersIcon,
  UserPlusIcon,
  UserMinusIcon,
  ChartBarIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const UserStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    dailySignups: [],
    usersByLevel: {}
  });

  const [dateRange, setDateRange] = useState('7days');

  useEffect(() => {
    // 목업 데이터
    setStats({
      totalUsers: 15420,
      newUsers: 245,
      activeUsers: 12850,
      inactiveUsers: 2570,
      dailySignups: [
        { date: '2024-01-14', count: 35 },
        { date: '2024-01-15', count: 42 },
        { date: '2024-01-16', count: 28 },
        { date: '2024-01-17', count: 51 },
        { date: '2024-01-18', count: 38 },
        { date: '2024-01-19', count: 45 },
        { date: '2024-01-20', count: 32 }
      ],
      usersByLevel: {
        'VIP': 856,
        'GOLD': 2340,
        'SILVER': 4580,
        'BRONZE': 7644
      }
    });
  }, [dateRange]);

  const StatCard = ({ title, value, change, icon: Icon, trend = 'up' }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-lg bg-blue-100">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value.toLocaleString()}</p>
            {change && (
              <span className={`ml-2 flex items-center text-sm ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend === 'up' ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                )}
                {change}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">회원 통계</h1>
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
          title="총 회원수"
          value={stats.totalUsers}
          change={8.2}
          icon={UsersIcon}
          trend="up"
        />
        <StatCard
          title="신규 가입"
          value={stats.newUsers}
          change={12.5}
          icon={UserPlusIcon}
          trend="up"
        />
        <StatCard
          title="활성 회원"
          value={stats.activeUsers}
          change={-2.1}
          icon={ChartBarIcon}
          trend="down"
        />
        <StatCard
          title="비활성 회원"
          value={stats.inactiveUsers}
          change={15.3}
          icon={UserMinusIcon}
          trend="up"
        />
      </div>

      {/* 일별 가입 추이 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">일별 신규 가입 추이</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {stats.dailySignups.map((day, index) => (
              <div key={day.date} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-900">{day.date}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(day.count / 60) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{day.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 회원 등급별 분포 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">회원 등급별 분포</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.usersByLevel).map(([level, count]) => {
              const colors = {
                'VIP': 'bg-purple-100 text-purple-800',
                'GOLD': 'bg-yellow-100 text-yellow-800',
                'SILVER': 'bg-gray-100 text-gray-800',
                'BRONZE': 'bg-orange-100 text-orange-800'
              };
              
              return (
                <div key={level} className="text-center">
                  <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${colors[level]} mb-2`}>
                    <span className="text-xl font-bold">{level.charAt(0)}</span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-900">{level}</h4>
                  <p className="text-2xl font-bold text-gray-900">{count.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">
                    {((count / stats.totalUsers) * 100).toFixed(1)}%
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 상세 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">가입 경로 분석</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">직접 방문</span>
                <span className="text-sm font-medium">45.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">검색 엔진</span>
                <span className="text-sm font-medium">28.7%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">소셜 미디어</span>
                <span className="text-sm font-medium">15.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">추천</span>
                <span className="text-sm font-medium">10.3%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">연령대별 분포</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">20-29세</span>
                <span className="text-sm font-medium">32.4%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">30-39세</span>
                <span className="text-sm font-medium">28.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">40-49세</span>
                <span className="text-sm font-medium">22.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">50세 이상</span>
                <span className="text-sm font-medium">16.6%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;