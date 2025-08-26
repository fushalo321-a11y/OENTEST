import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const HomeStartPopup = ({ isOpen, onClose }) => {
  const [visiblePopups, setVisiblePopups] = useState([0, 1, 2]); // 초기값은 모든 팝업

  // 컴포넌트가 마운트될 때만 숨김 정보 확인
  useEffect(() => {
    if (isOpen) {
      // localStorage에서 숨겨진 팝업 정보 확인
      const hiddenPopups = JSON.parse(localStorage.getItem('hiddenHomeStartPopups') || '{}');
      const now = new Date().getTime();
      
      console.log('HomeStartPopup - localStorage 확인:', { hiddenPopups, now });
      
      // 숨김 기간이 지나지 않은 팝업만 제외
      const hiddenIndexes = Object.keys(hiddenPopups).filter(popupIndex => 
        hiddenPopups[popupIndex] > now
      ).map(Number);
      
      console.log('HomeStartPopup - 숨겨진 팝업 인덱스:', hiddenIndexes);
      
      const availablePopups = [0, 1, 2].filter(index => !hiddenIndexes.includes(index));
      console.log('HomeStartPopup - 표시할 팝업:', availablePopups);
      
      setVisiblePopups(availablePopups);
      
      // 표시할 팝업이 없으면 즉시 종료
      if (availablePopups.length === 0) {
        onClose();
      }
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleHideForToday = (popupIndex) => {
    const hiddenPopups = JSON.parse(localStorage.getItem('hiddenHomeStartPopups') || '{}');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    hiddenPopups[popupIndex] = tomorrow.getTime();
    localStorage.setItem('hiddenHomeStartPopups', JSON.stringify(hiddenPopups));
    
    // 해당 팝업만 숨기기
    const newVisiblePopups = visiblePopups.filter(index => index !== popupIndex);
    setVisiblePopups(newVisiblePopups);
    
    // 모든 팝업이 숨겨지면 완전히 종료
    if (newVisiblePopups.length === 0) {
      onClose();
    }
  };

  const handleCloseSingle = (popupIndex) => {
    // 해당 팝업만 닫기 (localStorage 저장 안함)
    const newVisiblePopups = visiblePopups.filter(index => index !== popupIndex);
    setVisiblePopups(newVisiblePopups);
    
    // 모든 팝업이 닫히면 완전히 종료
    if (newVisiblePopups.length === 0) {
      onClose();
    }
  };

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      // 팝업창 외부 클릭 시 순서대로 하나씩 닫기
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

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleBackgroundClick}
    >
      <div className="flex space-x-4 max-w-7xl w-full justify-center">
                {/* 왼쪽 팝업 - 이벤트 */}
        {visiblePopups.includes(0) && (
          <div 
            className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-2xl w-[400px] h-[600px] flex flex-col"
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
         )}

                {/* 중앙 팝업 - 보안 */}
        {visiblePopups.includes(1) && (
          <div 
            className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-2xl w-[400px] h-[600px] flex flex-col"
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
         )}

                {/* 오른쪽 팝업 - 도메인 */}
        {visiblePopups.includes(2) && (
          <div 
            className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-2xl w-[400px] h-[600px] flex flex-col"
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
         )}
      </div>
    </div>
  );
};

export default HomeStartPopup; 