import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Ticket, 
  Coins, 
  Gift, 
  Star, 
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import InlineLogin from '../components/InlineLogin';
import BannerPopup from '../components/BannerPopup';
import NoticeSidebar from '../components/NoticeSidebar';

const LotteryEvent = () => {
  const { user } = useAuth();
  const [userPoints, setUserPoints] = useState(user?.points || 15000);
  const [isScratching, setIsScratching] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [ticketHistory, setTicketHistory] = useState([]);
  const [selectedTicketType, setSelectedTicketType] = useState('normal');

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

  // 복권 종류
  const ticketTypes = [
    {
      id: 'normal',
      name: '일반 복권',
      cost: 1000,
      description: '1,000P로 복권 한 장',
      color: 'bg-blue-500',
      prizes: [
        { amount: 5000, probability: 0.1, color: 'bg-green-500' },
        { amount: 10000, probability: 0.05, color: 'bg-yellow-500' },
        { amount: 50000, probability: 0.01, color: 'bg-red-500' },
        { amount: 100000, probability: 0.005, color: 'bg-purple-500' },
        { amount: 0, probability: 0.835, color: 'bg-gray-500' } // 꽝
      ]
    },
    {
      id: 'premium',
      name: '프리미엄 복권',
      cost: 5000,
      description: '5,000P로 복권 한 장 (당첨 확률 2배)',
      color: 'bg-purple-500',
      prizes: [
        { amount: 10000, probability: 0.2, color: 'bg-green-500' },
        { amount: 20000, probability: 0.1, color: 'bg-yellow-500' },
        { amount: 100000, probability: 0.02, color: 'bg-red-500' },
        { amount: 200000, probability: 0.01, color: 'bg-purple-500' },
        { amount: 0, probability: 0.67, color: 'bg-gray-500' } // 꽝
      ]
    }
  ];

  const selectedTicket = ticketTypes.find(ticket => ticket.id === selectedTicketType);

  // 복권 긁기 함수
  const scratchTicket = () => {
    if (userPoints < selectedTicket.cost) {
      alert('포인트가 부족합니다!');
      return;
    }

    setIsScratching(true);
    setShowResult(false);

    // 복권 긁기 애니메이션 시뮬레이션
    setTimeout(() => {
      const result = generateResult();
      setCurrentTicket(result);
      setShowResult(true);
      setIsScratching(false);

      // 포인트 차감 및 당첨금 지급
      setUserPoints(prev => prev - selectedTicket.cost + result.amount);

      // 히스토리에 추가
      const newHistory = {
        id: Date.now(),
        type: selectedTicket.name,
        cost: selectedTicket.cost,
        result: result,
        date: new Date().toLocaleString()
      };
      setTicketHistory([newHistory, ...ticketHistory]);

      // 당첨 메시지
      if (result.amount > 0) {
        alert(`🎉 축하합니다! ${result.amount.toLocaleString()}P 당첨!`);
      } else {
        alert('아쉽게도 꽝입니다. 다음 기회에 도전해보세요!');
      }
    }, 2000);
  };

  // 당첨 결과 생성
  const generateResult = () => {
    const random = Math.random();
    let cumulativeProbability = 0;

    for (const prize of selectedTicket.prizes) {
      cumulativeProbability += prize.probability;
      if (random <= cumulativeProbability) {
        return {
          amount: prize.amount,
          color: prize.color,
          isWin: prize.amount > 0
        };
      }
    }

    // 기본값 (꽝)
    return {
      amount: 0,
      color: 'bg-gray-500',
      isWin: false
    };
  };

  // 복권 다시 구매
  const buyAnotherTicket = () => {
    setShowResult(false);
    setCurrentTicket(null);
  };

  const getPrizeText = (amount) => {
    if (amount === 0) return '꽝';
    return `${amount.toLocaleString()}P`;
  };

  const getPrizeColor = (amount) => {
    if (amount === 0) return 'text-gray-500';
    if (amount >= 100000) return 'text-purple-600';
    if (amount >= 50000) return 'text-red-600';
    if (amount >= 10000) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
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
            {/* 내 포인트 정보 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">내 포인트</h2>
                  <p className="text-3xl font-bold text-purple-600">{userPoints.toLocaleString()}P</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">오늘 구매한 복권</p>
                  <p className="text-lg font-semibold text-gray-900">{ticketHistory.filter(t => 
                    new Date(t.date).toDateString() === new Date().toDateString()
                  ).length}장</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 복권 구매 및 긁기 */}
              <div className="space-y-6">
                {/* 복권 종류 선택 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">복권 종류 선택</h3>
                  <div className="space-y-3">
                    {ticketTypes.map((ticket) => (
                      <button
                        key={ticket.id}
                        onClick={() => setSelectedTicketType(ticket.id)}
                        className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                          selectedTicketType === ticket.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{ticket.name}</h4>
                            <p className="text-sm text-gray-600">{ticket.description}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${ticket.color}`}>
                            {ticket.cost.toLocaleString()}P
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 복권 긁기 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">복권 긁기</h3>
                  
                  {!showResult ? (
                    <div className="text-center">
                      <div className="mb-4">
                        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                          <Ticket className="h-16 w-16 text-white" />
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {selectedTicket.name}을 {selectedTicket.cost.toLocaleString()}P로 구매하시겠습니까?
                      </p>
                      <button
                        onClick={scratchTicket}
                        disabled={isScratching || userPoints < selectedTicket.cost}
                        className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center mx-auto"
                      >
                        {isScratching ? (
                          <>
                            <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                            긁는 중...
                          </>
                        ) : (
                          <>
                            <Ticket className="h-5 w-5 mr-2" />
                            복권 구매하기
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="mb-4">
                        <div className={`w-32 h-32 mx-auto rounded-lg flex items-center justify-center ${currentTicket.color}`}>
                          {currentTicket.isWin ? (
                            <Gift className="h-16 w-16 text-white" />
                          ) : (
                            <XCircle className="h-16 w-16 text-white" />
                          )}
                        </div>
                      </div>
                      <div className="mb-4">
                        <h4 className={`text-2xl font-bold ${getPrizeColor(currentTicket.amount)}`}>
                          {getPrizeText(currentTicket.amount)}
                        </h4>
                        {currentTicket.isWin && (
                          <p className="text-green-600 font-medium">🎉 축하합니다!</p>
                        )}
                      </div>
                      <button
                        onClick={buyAnotherTicket}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        또 구매하기
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 당첨 확률 및 히스토리 */}
              <div className="space-y-6">
                {/* 당첨 확률 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">당첨 확률</h3>
                  <div className="space-y-3">
                    {selectedTicket.prizes.map((prize, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full mr-3 ${prize.color}`}></div>
                          <span className="font-medium">
                            {prize.amount === 0 ? '꽝' : `${prize.amount.toLocaleString()}P`}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {(prize.probability * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 구매 히스토리 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">구매 히스토리</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {ticketHistory.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">아직 구매한 복권이 없습니다.</p>
                    ) : (
                      ticketHistory.slice(0, 10).map((ticket) => (
                        <div key={ticket.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{ticket.type}</p>
                            <p className="text-sm text-gray-500">{ticket.date}</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${getPrizeColor(ticket.result.amount)}`}>
                              {getPrizeText(ticket.result.amount)}
                            </p>
                            <p className="text-sm text-gray-500">-{ticket.cost.toLocaleString()}P</p>
                          </div>
                        </div>
                      ))
                    )}
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

export default LotteryEvent; 