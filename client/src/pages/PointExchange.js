import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Coins,
  Banknote,
  Bitcoin,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import InlineLogin from '../components/InlineLogin';
import BannerPopup from '../components/BannerPopup';
import NoticeSidebar from '../components/NoticeSidebar';

const PointExchange = () => {
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState('bank');
  const [exchangeAmount, setExchangeAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  // 교환 방법 데이터
  const exchangeMethods = [
    {
      id: 'bank',
      name: '계좌이체',
      icon: Banknote,
      description: '실시간 계좌이체로 즉시 포인트 충전',
      fee: 0,
      processingTime: '즉시',
      minAmount: 10000,
      maxAmount: 1000000,
      color: 'blue'
    },
    {
      id: 'coin',
      name: '코인 교환',
      icon: Bitcoin,
      description: '암호화폐로 안전하게 포인트 교환',
      fee: 0,
      processingTime: '즉시',
      minAmount: 5000,
      maxAmount: 500000,
      color: 'orange'
    }
  ];

  const selectedMethodData = exchangeMethods.find(method => method.id === selectedMethod);

  const handleExchange = async () => {
    if (!exchangeAmount || exchangeAmount < selectedMethodData.minAmount || exchangeAmount > selectedMethodData.maxAmount) {
      alert('올바른 금액을 입력해주세요.');
      return;
    }

    setIsProcessing(true);
    
    // 실제로는 API 호출
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      setExchangeAmount('');
    }, 2000);
  };

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
            <div className="bg-white rounded-lg shadow-sm border-2" style={{ borderColor: '#F5F5DC' }}>
              <div className="p-6">
                {/* 내 포인트 정보 */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">내 포인트</h2>
                      <p className="text-3xl font-bold">{user?.points?.toLocaleString() || '0'}P</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-90">이번 달 교환 횟수</p>
                      <p className="text-lg font-semibold">3회</p>
                    </div>
                  </div>
                </div>

                {/* 교환 방법 선택 */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">교환 방법 선택</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {exchangeMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <button
                          key={method.id}
                          onClick={() => setSelectedMethod(method.id)}
                          className={`p-4 border-2 rounded-lg text-left transition-all ${
                            selectedMethod === method.id
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center mb-3">
                            <Icon className={`h-6 w-6 mr-2 ${
                              selectedMethod === method.id ? 'text-green-600' : 'text-gray-600'
                            }`} />
                            <span className={`font-medium ${
                              selectedMethod === method.id ? 'text-green-700' : 'text-gray-900'
                            }`}>
                              {method.name}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>수수료: {method.fee}원</span>
                            <span>처리시간: {method.processingTime}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 교환 금액 입력 */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">교환 금액</h3>
                  <div className="max-w-md">
                    <div className="relative">
                      <input
                        type="number"
                        value={exchangeAmount}
                        onChange={(e) => setExchangeAmount(e.target.value)}
                        placeholder="교환할 포인트를 입력하세요"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                        min={selectedMethodData?.minAmount}
                        max={selectedMethodData?.maxAmount}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">P</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      최소: {selectedMethodData?.minAmount?.toLocaleString()}P ~ 최대: {selectedMethodData?.maxAmount?.toLocaleString()}P
                    </p>
                  </div>
                </div>

                {/* 교환 정보 */}
                {exchangeAmount && selectedMethodData && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">교환 정보</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">교환 포인트:</span>
                          <span className="font-medium">{parseInt(exchangeAmount).toLocaleString()}P</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">수수료:</span>
                          <span className="font-medium">{selectedMethodData.fee}원</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">실수령액:</span>
                          <span className="font-medium text-green-600">
                            {(parseInt(exchangeAmount) - selectedMethodData.fee).toLocaleString()}원
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">처리시간:</span>
                          <span className="font-medium">{selectedMethodData.processingTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 교환 버튼 */}
                <div className="mb-6">
                  <button
                    onClick={handleExchange}
                    disabled={!exchangeAmount || isProcessing || 
                             exchangeAmount < selectedMethodData?.minAmount || 
                             exchangeAmount > selectedMethodData?.maxAmount}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        처리 중...
                      </>
                    ) : (
                      <>
                        <Coins className="h-5 w-5 mr-2" />
                        교환하기
                      </>
                    )}
                  </button>
                </div>

                {/* 교환 안내 */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    <div>
                      <h3 className="font-medium text-yellow-800">교환 안내</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        • 교환은 최소 10,000P부터 가능합니다.<br/>
                        • 수수료는 교환 방법에 따라 다릅니다.<br/>
                        • 교환 신청 후 취소가 불가능합니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 성공 모달 */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">교환 신청 완료</h3>
            <p className="text-gray-600 mb-6">
              포인트 교환이 성공적으로 신청되었습니다.<br/>
              처리 완료까지 잠시만 기다려주세요.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointExchange; 