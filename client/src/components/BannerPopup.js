import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const BannerPopup = ({ isOpen, onClose, bannerData }) => {
  console.log('BannerPopup 렌더링:', { isOpen, bannerData });
  
  const [visiblePopups, setVisiblePopups] = useState([0, 1, 2]); // 초기값은 모든 팝업
  
  // 컴포넌트가 마운트될 때와 isOpen이 변경될 때 숨김 정보 확인
  useEffect(() => {
    if (isOpen && bannerData && bannerData.type === 'multi') {
      // multi 타입일 때만 localStorage에서 숨겨진 팝업 정보 확인
      const hiddenPopups = JSON.parse(localStorage.getItem('hiddenPopups') || '{}');
      const now = new Date().getTime();
      
      // 숨김 기간이 지나지 않은 팝업만 제외
      const hiddenIndexes = Object.keys(hiddenPopups).filter(popupIndex => 
        hiddenPopups[popupIndex] > now
      ).map(Number);
      
      const availablePopups = [0, 1, 2].filter(index => !hiddenIndexes.includes(index));
      setVisiblePopups(availablePopups);
      
      // 표시할 팝업이 없으면 즉시 종료
      if (availablePopups.length === 0) {
        onClose();
      }
    } else if (isOpen && bannerData && (bannerData.type === 'banner1' || bannerData.type === 'banner2' || bannerData.type === 'banner3' || bannerData.type === 'banner4')) {
      // 배너 팝업은 바로 표시 (localStorage 확인 안함)
      console.log('배너 팝업 표시:', bannerData.type);
    }
  }, [isOpen, onClose, bannerData]);
  
  if (!isOpen) return null;

  const handleCloseSingle = (popupIndex) => {
    // 해당 팝업만 바로 닫기 (localStorage 저장 안함)
    const newVisiblePopups = visiblePopups.filter(index => index !== popupIndex);
    setVisiblePopups(newVisiblePopups);
    
    // 모든 팝업이 닫히면 완전히 종료
    if (newVisiblePopups.length === 0) {
      onClose();
    }
  };

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      // 배너 팝업일 때는 배경 클릭 시 바로 닫기
      if (bannerData && (bannerData.type === 'banner1' || bannerData.type === 'banner2' || bannerData.type === 'banner3' || bannerData.type === 'banner4')) {
        onClose();
        return;
      }
      
      // multi 타입일 때는 팝업창 외부 클릭 시 순서대로 하나씩 닫기
      if (visiblePopups.length > 0) {
        // 첫 번째 팝업부터 순서대로 닫기
        const firstPopupIndex = visiblePopups[0];
        const newVisiblePopups = visiblePopups.filter(index => index !== firstPopupIndex);
        setVisiblePopups(newVisiblePopups);
        
        // 모든 팝업이 닫히면 완전히 종료
        if (newVisiblePopups.length === 0) {
          onClose();
        }
      }
    }
  };

  const handlePopupClick = (e) => {
    // 팝업 내부 클릭 시 이벤트 전파 방지
    e.stopPropagation();
  };

  const handleHideForToday = (popupIndex) => {
    // 현재 시간을 기준으로 다음날 00:00:00까지의 시간을 계산
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    // localStorage에 숨김 정보 저장
    const hiddenPopups = JSON.parse(localStorage.getItem('hiddenPopups') || '{}');
    hiddenPopups[popupIndex] = tomorrow.getTime();
    localStorage.setItem('hiddenPopups', JSON.stringify(hiddenPopups));
    
    // 해당 팝업만 숨기기
    const newVisiblePopups = visiblePopups.filter(index => index !== popupIndex);
    setVisiblePopups(newVisiblePopups);
    
    // 모든 팝업이 숨겨지면 완전히 종료
    if (newVisiblePopups.length === 0) {
      onClose();
    }
  };

  const renderBannerPopup = (bannerType) => {
    const bannerConfigs = {
      banner1: {
        title: "🎯 첫 번째 배너 상세 정보",
        color: "green",
        icon: "🎯",
        description: "첫 번째 배너의 상세 정보입니다",
        content: "이 배너는 곧 새로운 이벤트와 함께 공개될 예정입니다. 많은 관심 부탁드립니다! 특별한 혜택과 함께 찾아올 첫 번째 배너를 기대해주세요. 놀라운 이벤트가 담긴 첫 번째 배너가 곧 공개됩니다!"
      },
      banner2: {
        title: "🌟 두 번째 배너 상세 정보", 
        color: "blue",
        icon: "🌟",
        description: "두 번째 배너의 상세 정보입니다",
        content: "특별한 혜택과 함께 찾아올 두 번째 배너를 기대해주세요! 이 배너는 곧 새로운 이벤트와 함께 공개될 예정입니다. 많은 관심 부탁드립니다. 놀라운 이벤트가 담긴 두 번째 배너가 곧 공개됩니다!"
      },
      banner3: {
        title: "🔥 세 번째 배너 상세 정보",
        color: "orange", 
        icon: "🔥",
        description: "세 번째 배너의 상세 정보입니다",
        content: "놀라운 이벤트가 담긴 세 번째 배너가 곧 공개됩니다! 이 배너는 곧 새로운 이벤트와 함께 공개될 예정입니다. 많은 관심 부탁드립니다. 특별한 혜택과 함께 찾아올 세 번째 배너를 기대해주세요!"
      },
      banner4: {
        title: "💎 네 번째 배너 상세 정보",
        color: "purple",
        icon: "💎", 
        description: "네 번째 배너의 상세 정보입니다",
        content: "최고급 혜택이 담긴 네 번째 배너를 기대해주세요! 이 배너는 곧 새로운 이벤트와 함께 공개될 예정입니다. 많은 관심 부탁드립니다. 특별한 혜택과 함께 찾아올 네 번째 배너를 기대해주세요!"
      }
    };

    const config = bannerConfigs[bannerType] || bannerConfigs.banner1;
    
    // 각 배너별 색상 클래스 정의
    const getColorClasses = (color) => {
      switch (color) {
        case 'green':
          return {
            container: 'bg-gradient-to-br from-green-50 to-green-100',
            header: 'bg-gradient-to-r from-green-200 to-green-300 border-green-200',
            content: 'bg-green-50',
            inner: 'bg-gradient-to-br from-green-100 to-green-200',
            icon: 'bg-green-500',
            button: 'bg-green-200 hover:bg-green-300',
            button2: 'bg-green-300 hover:bg-green-400',
            border: 'border-green-200'
          };
        case 'blue':
          return {
            container: 'bg-gradient-to-br from-blue-50 to-blue-100',
            header: 'bg-gradient-to-r from-blue-200 to-blue-300 border-blue-200',
            content: 'bg-blue-50',
            inner: 'bg-gradient-to-br from-blue-100 to-blue-200',
            icon: 'bg-blue-500',
            button: 'bg-blue-200 hover:bg-blue-300',
            button2: 'bg-blue-300 hover:bg-blue-400',
            border: 'border-blue-200'
          };
        case 'orange':
          return {
            container: 'bg-gradient-to-br from-orange-50 to-orange-100',
            header: 'bg-gradient-to-r from-orange-200 to-orange-300 border-orange-200',
            content: 'bg-orange-50',
            inner: 'bg-gradient-to-br from-orange-100 to-orange-200',
            icon: 'bg-orange-500',
            button: 'bg-orange-200 hover:bg-orange-300',
            button2: 'bg-orange-300 hover:bg-orange-400',
            border: 'border-orange-200'
          };
        case 'purple':
          return {
            container: 'bg-gradient-to-br from-purple-50 to-purple-100',
            header: 'bg-gradient-to-r from-purple-200 to-purple-300 border-purple-200',
            content: 'bg-purple-50',
            inner: 'bg-gradient-to-br from-purple-100 to-purple-200',
            icon: 'bg-purple-500',
            button: 'bg-purple-200 hover:bg-purple-300',
            button2: 'bg-purple-300 hover:bg-purple-400',
            border: 'border-purple-200'
          };
        default:
          return {
            container: 'bg-gradient-to-br from-gray-50 to-gray-100',
            header: 'bg-gradient-to-r from-gray-200 to-gray-300 border-gray-200',
            content: 'bg-gray-50',
            inner: 'bg-gradient-to-br from-gray-100 to-gray-200',
            icon: 'bg-gray-500',
            button: 'bg-gray-200 hover:bg-gray-300',
            button2: 'bg-gray-300 hover:bg-gray-400',
            border: 'border-gray-200'
          };
      }
    };

    const colors = getColorClasses(config.color);

    return (
      <div 
        className={`${colors.container} rounded-lg shadow-2xl w-[700px] h-[900px] flex flex-col`}
        onClick={handlePopupClick}
      >
        {/* 헤더 */}
        <div className={`flex items-center justify-between p-6 border-b ${colors.header}`}>
          <div className={`w-12 h-12 ${colors.icon} rounded-lg flex items-center justify-center`}>
            <span className="text-white font-bold text-xl">{config.icon}</span>
          </div>
          <span className="text-gray-800 font-semibold text-center flex-1 text-xl">{config.title}</span>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition-colors w-10 h-10 flex items-center justify-center"
          >
            <X className="h-7 w-7" />
          </button>
        </div>

        {/* 이미지 섹션 */}
        <div className={`flex-1 p-6 ${colors.content}`}>
          <div className={`w-full h-full ${colors.inner} rounded-lg flex flex-col items-center justify-center relative overflow-hidden p-8`}>
            {/* 배경 패턴 */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 left-4 w-8 h-8 bg-white rounded-full"></div>
              <div className="absolute top-12 right-8 w-6 h-6 bg-white rounded-full"></div>
              <div className="absolute bottom-8 left-8 w-4 h-4 bg-white rounded-full"></div>
              <div className="absolute bottom-16 right-4 w-10 h-10 bg-white rounded-full"></div>
            </div>
            
            {/* 중앙 콘텐츠 */}
            <div className="text-center relative z-10 max-w-lg">
              <div className="text-gray-700 text-8xl font-bold mb-6">{config.icon}</div>
              <div className="text-gray-700 text-2xl font-semibold mb-4">{config.title}</div>
              <div className="text-gray-500 text-lg mb-8">{config.description}</div>
              <div className="text-gray-700 text-lg leading-relaxed bg-white bg-opacity-60 rounded-lg p-6 shadow-lg">
                {config.content}
              </div>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className={`p-6 border-t ${colors.border} ${colors.content}`}>
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className={`flex-1 ${colors.button} text-gray-800 py-4 px-6 rounded-lg transition-colors text-base font-medium`}
            >
              확인
            </button>
            <button
              onClick={onClose}
              className={`flex-1 ${colors.button2} text-gray-800 py-4 px-6 rounded-lg transition-colors text-base font-medium`}
            >
              나중에 보기
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderEventPopup = () => (
    <div 
      className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-2xl w-[500px] h-[711px] flex flex-col"
      onClick={handlePopupClick}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-yellow-200 bg-gradient-to-r from-yellow-200 to-yellow-300">
        <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
          <span className="text-black font-bold text-sm">OT</span>
        </div>
        <span className="text-gray-800 font-semibold text-center flex-1">OEN TEST</span>
        <button
          onClick={() => handleCloseSingle(0)}
          className="text-gray-600 hover:text-gray-800 transition-colors w-8 h-8 flex items-center justify-center"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* 이미지 섹션 */}
      <div className="flex-1 p-4 bg-yellow-50">
        <div className="w-full h-full bg-gradient-to-br from-ivory-100 to-ivory-200 rounded-lg flex items-center justify-center relative overflow-hidden">
          {/* 배경 패턴 */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-4 w-8 h-8 bg-white rounded-full"></div>
            <div className="absolute top-12 right-8 w-6 h-6 bg-yellow-400 rounded-full"></div>
            <div className="absolute bottom-8 left-8 w-4 h-4 bg-red-400 rounded-full"></div>
            <div className="absolute bottom-16 right-4 w-10 h-10 bg-green-400 rounded-full"></div>
          </div>
          
          {/* 중앙 콘텐츠 */}
          <div className="text-center relative z-10">
            <div className="text-gray-700 text-4xl font-bold mb-2">🎮</div>
            <div className="text-gray-700 text-lg font-semibold mb-2">이벤트 이미지</div>
            <div className="text-gray-500 text-sm">이미지 준비중</div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="p-4 border-t border-yellow-200 bg-yellow-50">
        <button
          onClick={() => handleHideForToday(0)}
          className="w-full bg-yellow-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-yellow-300 transition-colors text-sm font-medium"
        >
          오늘 하루 열지 않기
        </button>
      </div>
    </div>
  );

  const renderPasswordPopup = () => (
    <div 
      className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-2xl w-[500px] h-[711px] flex flex-col"
      onClick={handlePopupClick}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-yellow-200 bg-gradient-to-r from-yellow-200 to-yellow-300">
        <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
          <span className="text-black font-bold text-sm">OT</span>
        </div>
        <span className="text-gray-800 font-semibold text-center flex-1">OEN TEST</span>
        <button
          onClick={() => handleCloseSingle(1)}
          className="text-gray-600 hover:text-gray-800 transition-colors w-8 h-8 flex items-center justify-center"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* 이미지 섹션 */}
      <div className="flex-1 p-4 bg-yellow-50">
        <div className="w-full h-full bg-gradient-to-br from-ivory-100 to-ivory-200 rounded-lg flex items-center justify-center relative overflow-hidden">
          {/* 배경 패턴 */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-6 left-6 w-6 h-6 bg-white rounded-full"></div>
            <div className="absolute top-16 right-6 w-8 h-8 bg-yellow-400 rounded-full"></div>
            <div className="absolute bottom-6 left-12 w-4 h-4 bg-blue-400 rounded-full"></div>
            <div className="absolute bottom-20 right-8 w-6 h-6 bg-red-400 rounded-full"></div>
          </div>
          
          {/* 중앙 콘텐츠 */}
          <div className="text-center relative z-10">
            <div className="text-gray-700 text-4xl font-bold mb-2">🔐</div>
            <div className="text-gray-700 text-lg font-semibold mb-2">보안 이미지</div>
            <div className="text-gray-500 text-sm">이미지 준비중</div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="p-4 border-t border-yellow-200 bg-yellow-50">
        <button
          onClick={() => handleHideForToday(1)}
          className="w-full bg-yellow-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-yellow-300 transition-colors text-sm font-medium"
        >
          오늘 하루 열지 않기
        </button>
      </div>
    </div>
  );

  const renderDomainPopup = () => (
    <div 
      className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-2xl w-[500px] h-[711px] flex flex-col"
      onClick={handlePopupClick}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-yellow-200 bg-gradient-to-r from-yellow-200 to-yellow-300">
        <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
          <span className="text-black font-bold text-sm">OT</span>
        </div>
        <span className="text-gray-800 font-semibold text-center flex-1">OEN TEST</span>
        <button
          onClick={() => handleCloseSingle(2)}
          className="text-gray-600 hover:text-gray-800 transition-colors w-8 h-8 flex items-center justify-center"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* 이미지 섹션 */}
      <div className="flex-1 p-4 bg-yellow-50">
        <div className="w-full h-full bg-gradient-to-br from-ivory-100 to-ivory-200 rounded-lg flex items-center justify-center relative overflow-hidden">
          {/* 배경 패턴 */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-8 left-8 w-8 h-8 bg-white rounded-full"></div>
            <div className="absolute top-20 right-4 w-6 h-6 bg-yellow-400 rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-10 h-10 bg-blue-400 rounded-full"></div>
            <div className="absolute bottom-16 right-12 w-4 h-4 bg-green-400 rounded-full"></div>
          </div>
          
          {/* 중앙 콘텐츠 */}
          <div className="text-center relative z-10">
            <div className="text-gray-700 text-4xl font-bold mb-2">🌐</div>
            <div className="text-gray-700 text-lg font-semibold mb-2">도메인 이미지</div>
            <div className="text-gray-500 text-sm">이미지 준비중</div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="p-4 border-t border-yellow-200 bg-yellow-50">
        <button
          onClick={() => handleHideForToday(2)}
          className="w-full bg-yellow-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-yellow-300 transition-colors text-sm font-medium"
        >
          오늘 하루 열지 않기
        </button>
      </div>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleBackgroundClick}
    >
      <div className="flex space-x-4 max-w-7xl w-full justify-center">
        {/* 배너 팝업 (banner1-4) */}
        {bannerData && (bannerData.type === 'banner1' || bannerData.type === 'banner2' || bannerData.type === 'banner3' || bannerData.type === 'banner4') && 
          renderBannerPopup(bannerData.type)
        }
        
        {/* 기존 팝업들 (multi 타입) */}
        {bannerData && bannerData.type === 'multi' && (
          <>
            {/* 좌측 팝업 - 이벤트 */}
            {visiblePopups.includes(0) && renderEventPopup()}
            
            {/* 중앙 팝업 - 비밀번호 */}
            {visiblePopups.includes(1) && renderPasswordPopup()}
            
            {/* 우측 팝업 - 도메인 */}
            {visiblePopups.includes(2) && renderDomainPopup()}
          </>
        )}
      </div>
    </div>
  );
};

export default BannerPopup; 