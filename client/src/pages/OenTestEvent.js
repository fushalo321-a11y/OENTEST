import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Gift, 
  Star, 
  Users, 
  Calendar, 
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Heart,
  Zap,
  Target
} from 'lucide-react';
import InlineLogin from '../components/InlineLogin';
import BannerPopup from '../components/BannerPopup';
import NoticeSidebar from '../components/NoticeSidebar';

const OenTestEvent = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('ongoing');
  const [participatedEvents, setParticipatedEvents] = useState([]);

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

  // 이벤트 데이터
  const events = {
    ongoing: [
      {
        id: 1,
        title: '신규 가입 이벤트',
        description: '새로 가입하신 분들을 위한 특별 혜택!',
        reward: '5,000P + VIP 등급 1개월',
        participants: 1250,
        endDate: '2024-12-31',
        status: 'ongoing',
        type: 'signup',
        icon: '🎉',
        color: 'bg-gradient-to-r from-green-400 to-blue-500',
        requirements: ['신규 가입자', '프로필 완성']
      },
      {
        id: 2,
        title: '첫 게시글 작성 이벤트',
        description: '첫 게시글을 작성하고 포인트를 받아가세요!',
        reward: '3,000P',
        participants: 890,
        endDate: '2024-12-31',
        status: 'ongoing',
        type: 'post',
        icon: '✍️',
        color: 'bg-gradient-to-r from-purple-400 to-pink-500',
        requirements: ['첫 게시글 작성', '내용 100자 이상']
      },
      {
        id: 3,
        title: '포인트 적립 챌린지',
        description: '일주일 동안 포인트를 모아보세요!',
        reward: '최대 50,000P',
        participants: 567,
        endDate: '2024-12-25',
        status: 'ongoing',
        type: 'challenge',
        icon: '🏆',
        color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
        requirements: ['일주일 연속 로그인', '포인트 적립']
      },
      {
        id: 4,
        title: '커뮤니티 활동 이벤트',
        description: '댓글과 좋아요로 포인트를 받아가세요!',
        reward: '댓글당 100P, 좋아요당 50P',
        participants: 2340,
        endDate: '2024-12-31',
        status: 'ongoing',
        type: 'activity',
        icon: '💬',
        color: 'bg-gradient-to-r from-blue-400 to-indigo-500',
        requirements: ['댓글 작성', '좋아요 누르기']
      }
    ],
    upcoming: [
      {
        id: 5,
        title: '연말 대박 이벤트',
        description: '연말을 맞아 특별한 혜택을 준비했습니다!',
        reward: '최대 100,000P + 특별 상품',
        participants: 0,
        startDate: '2024-12-26',
        endDate: '2024-12-31',
        status: 'upcoming',
        type: 'special',
        icon: '🎊',
        color: 'bg-gradient-to-r from-red-400 to-pink-500',
        requirements: ['이벤트 참여', '미정']
      },
      {
        id: 6,
        title: '2025년 새해 이벤트',
        description: '새해 복 많이 받으세요!',
        reward: '새해 특별 포인트',
        participants: 0,
        startDate: '2025-01-01',
        endDate: '2025-01-07',
        status: 'upcoming',
        type: 'newyear',
        icon: '🎆',
        color: 'bg-gradient-to-r from-indigo-400 to-purple-500',
        requirements: ['새해 인사', '미정']
      }
    ],
    ended: [
      {
        id: 7,
        title: '가을 감사 이벤트',
        description: '가을을 맞아 감사한 마음을 담아',
        reward: '10,000P',
        participants: 1234,
        endDate: '2024-11-30',
        status: 'ended',
        type: 'thanks',
        icon: '🍂',
        color: 'bg-gradient-to-r from-orange-400 to-red-500',
        requirements: ['참여 완료']
      }
    ]
  };

  const currentEvents = events[activeTab];

  const participateInEvent = (eventId) => {
    const event = currentEvents.find(e => e.id === eventId);
    if (event) {
      setParticipatedEvents([...participatedEvents, eventId]);
      alert(`${event.title} 이벤트에 참여하셨습니다!`);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ongoing':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">진행중</span>;
      case 'upcoming':
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">예정</span>;
      case 'ended':
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">종료</span>;
      default:
        return null;
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'signup': return <Users className="h-6 w-6" />;
      case 'post': return <Star className="h-6 w-6" />;
      case 'challenge': return <Target className="h-6 w-6" />;
      case 'activity': return <Heart className="h-6 w-6" />;
      case 'special': return <Gift className="h-6 w-6" />;
      case 'newyear': return <Award className="h-6 w-6" />;
      default: return <Gift className="h-6 w-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      {/* 배너 팝업 */}
      <BannerPopup 
        isOpen={popupState.isOpen}
        onClose={handleClosePopup}
        bannerData={popupState.bannerData}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10">
          {/* 왼쪽 사이드바 - 로그인 창 (모바일에서는 상단에 표시) */}
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
            {/* 이벤트 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">4</h3>
                <p className="text-gray-600">진행중인 이벤트</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">5,047</h3>
                <p className="text-gray-600">총 참여자</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">2</h3>
                <p className="text-gray-600">예정된 이벤트</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{participatedEvents.length}</h3>
                <p className="text-gray-600">내 참여 이벤트</p>
              </div>
            </div>

            {/* 탭 네비게이션 */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('ongoing')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'ongoing'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    진행중인 이벤트
                  </button>
                  <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'upcoming'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    예정된 이벤트
                  </button>
                  <button
                    onClick={() => setActiveTab('ended')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'ended'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    종료된 이벤트
                  </button>
                </nav>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentEvents.map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      {/* 이벤트 헤더 */}
                      <div className={`${event.color} p-4 text-white`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{event.icon}</span>
                            <div>
                              <h3 className="font-semibold text-lg">{event.title}</h3>
                              <p className="text-sm opacity-90">{event.description}</p>
                            </div>
                          </div>
                          {getStatusBadge(event.status)}
                        </div>
                      </div>

                      {/* 이벤트 내용 */}
                      <div className="p-4 bg-white">
                        <div className="space-y-3">
                          {/* 보상 */}
                          <div className="flex items-center">
                            <Gift className="h-5 w-5 text-yellow-600 mr-2" />
                            <span className="font-medium text-gray-900">보상: {event.reward}</span>
                          </div>

                          {/* 참여자 수 */}
                          <div className="flex items-center">
                            <Users className="h-5 w-5 text-blue-600 mr-2" />
                            <span className="text-gray-600">{event.participants.toLocaleString()}명 참여</span>
                          </div>

                          {/* 기간 */}
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-green-600 mr-2" />
                            <span className="text-gray-600">
                              {event.startDate ? `${event.startDate} ~ ` : ''}{event.endDate}
                            </span>
                          </div>

                          {/* 참여 조건 */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">참여 조건:</h4>
                            <ul className="space-y-1">
                              {event.requirements.map((req, index) => (
                                <li key={index} className="flex items-center text-sm text-gray-600">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* 참여 버튼 */}
                          {event.status === 'ongoing' && !participatedEvents.includes(event.id) && (
                            <button
                              onClick={() => participateInEvent(event.id)}
                              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                            >
                              <Zap className="h-4 w-4 mr-2" />
                              이벤트 참여하기
                            </button>
                          )}

                          {event.status === 'ongoing' && participatedEvents.includes(event.id) && (
                            <div className="w-full bg-green-100 text-green-800 py-2 px-4 rounded-lg flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              참여 완료
                            </div>
                          )}

                          {event.status === 'upcoming' && (
                            <div className="w-full bg-blue-100 text-blue-800 py-2 px-4 rounded-lg flex items-center justify-center">
                              <Clock className="h-4 w-4 mr-2" />
                              예정된 이벤트
                            </div>
                          )}

                          {event.status === 'ended' && (
                            <div className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-lg flex items-center justify-center">
                              종료된 이벤트
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 이벤트 안내 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-start">
                  <AlertCircle className="h-6 w-6 text-yellow-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium text-yellow-800 mb-2">이벤트 참여 안내</h3>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• 이벤트 참여는 한 번만 가능합니다.</li>
                      <li>• 보상은 이벤트 종료 후 지급됩니다.</li>
                      <li>• 부정 참여 시 보상이 취소될 수 있습니다.</li>
                      <li>• 이벤트 규칙은 사전 고지 없이 변경될 수 있습니다.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start">
                  <Star className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium text-blue-800 mb-2">특별 혜택</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• VIP 회원은 추가 혜택을 받을 수 있습니다.</li>
                      <li>• 연속 참여 시 보너스 포인트 지급</li>
                      <li>• 이벤트 우승자 특별 상품 증정</li>
                      <li>• 추천인 이벤트 추가 혜택</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 이벤트 랭킹 */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">이벤트 참여 랭킹</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl mb-2">🥇</div>
                  <h4 className="font-medium text-gray-900">1위</h4>
                  <p className="text-sm text-gray-600">user123</p>
                  <p className="text-sm text-yellow-600 font-medium">15개 이벤트 참여</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">🥈</div>
                  <h4 className="font-medium text-gray-900">2위</h4>
                  <p className="text-sm text-gray-600">event_lover</p>
                  <p className="text-sm text-gray-600 font-medium">12개 이벤트 참여</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl mb-2">🥉</div>
                  <h4 className="font-medium text-gray-900">3위</h4>
                  <p className="text-sm text-gray-600">lucky_user</p>
                  <p className="text-sm text-orange-600 font-medium">10개 이벤트 참여</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OenTestEvent; 