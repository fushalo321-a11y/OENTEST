import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Trophy,
  Crown,
  Medal,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Star
} from 'lucide-react';
import InlineLogin from '../components/InlineLogin';
import NoticeSidebar from '../components/NoticeSidebar';
import BannerPopup from '../components/BannerPopup';

const PointRanking = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overall');
  const [timeFilter, setTimeFilter] = useState('all');

  // 팝업 상태 관리
  const [popupState, setPopupState] = useState({
    isOpen: false,
    bannerData: null
  });

  // 배너 클릭 핸들러
  const handleBannerClick = (bannerType) => {
    setPopupState({
      isOpen: true,
      bannerData: { type: bannerType }
    });
  };

  // 팝업 닫기 핸들러
  const handleClosePopup = () => {
    setPopupState({
      isOpen: false,
      bannerData: null
    });
  };

  // 랭킹 데이터 (실제로는 API에서 가져와야 함)
  const rankingData = {
    overall: [
      { rank: 1, username: '포인트킹', points: 1250000, change: '+2', level: 'VIP', avatar: '👑' },
      { rank: 2, username: '게임마스터', points: 980000, change: '-1', level: 'VIP', avatar: '🎮' },
      { rank: 3, username: '럭키스타', points: 850000, change: '+5', level: 'Gold', avatar: '⭐' },
      { rank: 4, username: '포인트헌터', points: 720000, change: '-2', level: 'Gold', avatar: '🎯' },
      { rank: 5, username: '게임러버', points: 680000, change: '+1', level: 'Silver', avatar: '🎲' },
      { rank: 6, username: '포인트수집가', points: 620000, change: '+3', level: 'Silver', avatar: '💰' },
      { rank: 7, username: '게임신인', points: 580000, change: '-1', level: 'Bronze', avatar: '🎪' },
      { rank: 8, username: '포인트러버', points: 540000, change: '+4', level: 'Bronze', avatar: '💎' },
      { rank: 9, username: '게임초보', points: 510000, change: '-3', level: 'Bronze', avatar: '🎨' },
      { rank: 10, username: '포인트팬', points: 480000, change: '+1', level: 'Bronze', avatar: '🎭' }
    ],
    monthly: [
      { rank: 1, username: '월간킹', points: 150000, change: '+1', level: 'VIP', avatar: '👑' },
      { rank: 2, username: '월간스타', points: 120000, change: '+3', level: 'Gold', avatar: '⭐' },
      { rank: 3, username: '월간러버', points: 98000, change: '-2', level: 'Silver', avatar: '🎲' },
      { rank: 4, username: '월간헌터', points: 85000, change: '+5', level: 'Silver', avatar: '🎯' },
      { rank: 5, username: '월간수집가', points: 72000, change: '+2', level: 'Bronze', avatar: '💰' }
    ],
    weekly: [
      { rank: 1, username: '주간킹', points: 35000, change: '+2', level: 'VIP', avatar: '👑' },
      { rank: 2, username: '주간스타', points: 28000, change: '-1', level: 'Gold', avatar: '⭐' },
      { rank: 3, username: '주간러버', points: 22000, change: '+4', level: 'Silver', avatar: '🎲' },
      { rank: 4, username: '주간헌터', points: 18000, change: '+1', level: 'Silver', avatar: '🎯' },
      { rank: 5, username: '주간수집가', points: 15000, change: '-2', level: 'Bronze', avatar: '💰' }
    ]
  };

  const timeFilters = [
    { id: 'all', name: '전체', icon: Calendar },
    { id: 'monthly', name: '월간', icon: Calendar },
    { id: 'weekly', name: '주간', icon: Calendar }
  ];

  const getLevelColor = (level) => {
    switch (level) {
      case 'VIP': return 'text-purple-600 bg-purple-100';
      case 'Gold': return 'text-yellow-600 bg-yellow-100';
      case 'Silver': return 'text-gray-600 bg-gray-100';
      case 'Bronze': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getChangeIcon = (change) => {
    if (change.startsWith('+')) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (change.startsWith('-')) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    } else {
      return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getChangeColor = (change) => {
    if (change.startsWith('+')) {
      return 'text-green-600';
    } else if (change.startsWith('-')) {
      return 'text-red-600';
    } else {
      return 'text-gray-600';
    }
  };

  const currentRanking = rankingData[activeTab] || rankingData.overall;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* 배너 팝업 */}
      <BannerPopup 
        isOpen={popupState.isOpen}
        onClose={handleClosePopup}
        bannerData={popupState.bannerData}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10">
          {/* 왼쪽 사이드바 */}
          <div className="lg:col-span-1 order-1 lg:order-1">
            <div className="lg:sticky lg:top-24 lg:pr-3 space-y-6">
              <InlineLogin />
              
              <NoticeSidebar />

              {/* 이벤트 박스 */}
              <div className="bg-white rounded-lg shadow-sm border-2" style={{ borderColor: '#F5F5DC' }}>
                <div className="p-2 rounded-t-lg" style={{ backgroundColor: '#F5F5DC' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center space-x-2 flex-1">
                      <div className="w-5 h-5 bg-gradient-to-br from-red-500 to-blue-600 rounded-full flex items-center justify-center relative">
                        <div className="w-2.5 h-2.5 bg-white rounded-sm flex items-center justify-center">
                          <span className="text-red-600 font-bold text-xs">♠</span>
                        </div>
                        <div className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-yellow-400 rounded-full"></div>
                        <div className="absolute -bottom-0.5 -left-0.5 w-0.5 h-0.5 bg-yellow-400 rounded-full"></div>
                      </div>
                      <h3 className="text-gray-900 text-xs font-semibold">OENTEST EVENT</h3>
                    </div>
                    <button 
                      className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                      onClick={() => window.location.href = '/oen-test-event'}
                    >
                      <span className="text-xs">+</span>
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <div className="space-y-2">
                    {[
                      { title: "OEN 이벤트", points: "+12", date: "25.07.25" },
                      { title: "OEN 이벤트", points: "+31", date: "25.07.03" },
                      { title: "OEN 이벤트", points: "+36", date: "25.06.23" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors" onClick={() => window.location.href = '/oen-test-event'}>
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-900 text-sm truncate">
                            {item.title}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <span className="text-green-500 text-xs font-semibold">{item.points}</span>
                          <span className="text-gray-400 text-xs whitespace-nowrap">{item.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 배너 1 - 배너준비중 */}
              <div 
                className="bg-green-600 rounded-lg p-4 relative overflow-hidden mb-4 cursor-pointer hover:bg-green-700 transition-colors transform hover:scale-105"
                onClick={() => handleBannerClick('banner1')}
              >
                <div className="flex items-center justify-center">
                  <div className="text-white text-lg font-bold text-center">배너준비중</div>
                </div>
              </div>

              {/* 배너 2 - 배너준비중 */}
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-4 relative overflow-hidden mb-4 cursor-pointer hover:from-blue-700 hover:to-purple-800 transition-all transform hover:scale-105"
                onClick={() => handleBannerClick('banner2')}
              >
                <div className="flex items-center justify-center">
                  <div className="text-white text-lg font-bold text-center">배너준비중</div>
                </div>
              </div>

              {/* 배너 3 - 배너준비중 */}
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-4 relative overflow-hidden mb-4 cursor-pointer hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-105"
                onClick={() => handleBannerClick('banner3')}
              >
                <div className="flex items-center justify-center">
                  <div className="text-white text-lg font-bold text-center">배너준비중</div>
                </div>
              </div>

              {/* 배너 4 - 배너준비중 */}
              <div 
                className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-4 relative overflow-hidden cursor-pointer hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105"
                onClick={() => handleBannerClick('banner4')}
              >
                <div className="flex items-center justify-center">
                  <div className="text-white text-lg font-bold text-center">배너준비중</div>
                </div>
              </div>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-3 order-2 lg:order-2">
            <div className="bg-white rounded-lg shadow-sm border-2" style={{ borderColor: '#F5F5DC' }}>
              <div className="p-6">
                {/* 탭 네비게이션 */}
                <div className="mb-6">
                  <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => setActiveTab('overall')}
                      className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                        activeTab === 'overall'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      전체 랭킹
                    </button>
                    <button
                      onClick={() => setActiveTab('monthly')}
                      className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                        activeTab === 'monthly'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      월간 랭킹
                    </button>
                    <button
                      onClick={() => setActiveTab('weekly')}
                      className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                        activeTab === 'weekly'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      주간 랭킹
                    </button>
                  </div>
                </div>

                {/* 시간 필터 */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {timeFilters.map(filter => {
                      const Icon = filter.icon;
                      return (
                        <button
                          key={filter.id}
                          onClick={() => setTimeFilter(filter.id)}
                          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            timeFilter === filter.id
                              ? 'bg-yellow-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {filter.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 랭킹 테이블 */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          순위
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          사용자
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          포인트
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          변동
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          레벨
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentRanking.map((user, index) => (
                        <tr key={user.rank} className={`hover:bg-gray-50 ${index < 3 ? 'bg-yellow-50' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {user.rank === 1 && <Crown className="h-5 w-5 text-yellow-500 mr-2" />}
                              {user.rank === 2 && <Medal className="h-5 w-5 text-gray-400 mr-2" />}
                              {user.rank === 3 && <Medal className="h-5 w-5 text-orange-500 mr-2" />}
                              <span className={`font-bold ${index < 3 ? 'text-lg' : 'text-base'}`}>
                                {user.rank}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg">
                                  {user.avatar}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.username}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              {user.points.toLocaleString()}P
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getChangeIcon(user.change)}
                              <span className={`ml-1 text-sm font-medium ${getChangeColor(user.change)}`}>
                                {user.change}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(user.level)}`}>
                              {user.level}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 내 순위 정보 */}
                <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">내 순위</h3>
                      <p className="text-2xl font-bold">156위</p>
                      <p className="text-sm opacity-90">포인트: 45,000P</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-90">이번 달 목표</p>
                      <p className="text-lg font-semibold">100위 진입</p>
                    </div>
                  </div>
                </div>

                {/* 랭킹 안내 */}
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-600 mr-2" />
                    <div>
                      <h3 className="font-medium text-yellow-800">랭킹 안내</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        • 랭킹은 매일 자정에 업데이트됩니다.<br/>
                        • 상위 랭커는 특별한 혜택을 받을 수 있습니다.<br/>
                        • 부정한 방법으로 포인트를 획득하면 제재를 받을 수 있습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointRanking; 