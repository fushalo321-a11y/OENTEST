import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import InlineLogin from '../components/InlineLogin';
import NoticeSidebar from '../components/NoticeSidebar';
import BannerPopup from '../components/BannerPopup';

const Category2 = () => {
  const [activeTab, setActiveTab] = useState('daily');
  
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

  // 인기글 데이터
  const popularPosts = {
    daily: [
      { rank: 1, title: "삼성전자 실적 발표 후 급등세...", badge: "N", value: "+156" },
      { rank: 2, title: "비트코인 7만 달러 돌파! 다음 목표는?", badge: "N", value: "+203" },
      { rank: 3, title: "손흥민 EPL 득점왕 경쟁 치열...", badge: "N", value: "+89" },
      { rank: 4, title: "테슬라 주가 급락, 매수 타이밍인가?", badge: "N", value: "+134" },
      { rank: 5, title: "이더리움 ETF 승인 임박, 코인시장 들썩", badge: "N", value: "+167" },
      { rank: 6, title: "SK하이닉스 메모리 반도체 수요 증가", badge: "N", value: "+78" },
      { rank: 7, title: "김민재 바이에른 뮌헨 활약상 화제", badge: "N", value: "+92" },
      { rank: 8, title: "도지코인 밈코인 열풍 재점화", badge: "N", value: "+145" },
      { rank: 9, title: "월드컵 예선 한국 vs 중국 경기 분석", badge: "N", value: "+112" },
      { rank: 10, title: "삼성바이오로직스 신약 개발 성과", badge: "N", value: "+156" }
    ],
    weekly: [
      { rank: 1, title: "한국 주식시장 외국인 매수세 지속", badge: "N", value: "+189", time: "2시간 전" },
      { rank: 2, title: "솔라나 생태계 확장, SOL 코인 상승세", badge: "N", value: "+234", time: "5시간 전" },
      { rank: 3, title: "김연아 피겨 스케이팅 은퇴 선언", badge: "N", value: "+156", time: "1일 전" },
      { rank: 4, title: "엔비디아 AI 반도체 수요 폭증", badge: "N", value: "+298", time: "2일 전" },
      { rank: 5, title: "카르다노 ADA 코인 기술적 돌파", badge: "N", value: "+167", time: "3일 전" },
      { rank: 6, title: "박지성 맨유 시절 추억 영상 화제", badge: "N", value: "+145", time: "4일 전" },
      { rank: 7, title: "LG에너지솔루션 배터리 시장 점유율 확대", badge: "N", value: "+223", time: "5일 전" },
      { rank: 8, title: "손흥민 토트넘 주장 임명 소식", badge: "N", value: "+178", time: "1주 전" },
      { rank: 9, title: "현대차 전기차 판매량 급증", badge: "N", value: "+201", time: "1주 전" },
      { rank: 10, title: "테슬라 사이버트럭 출시 임박", badge: "N", value: "+267", time: "1주 전" }
    ],
    monthly: [
      { rank: 1, title: "2024년 주식시장 전망 및 투자 전략", badge: "N", value: "+456", time: "1주 전" },
      { rank: 2, title: "비트코인 반감기 효과, 시장 영향 분석", badge: "N", value: "+389", time: "2주 전" },
      { rank: 3, title: "카타르 월드컵 2026 준비 현황", badge: "N", value: "+234", time: "3주 전" },
      { rank: 4, title: "AI 반도체 삼성 vs 엔비디아 경쟁 구도", badge: "N", value: "+312", time: "4주 전" },
      { rank: 5, title: "이더리움 2.0 업그레이드 완료 소식", badge: "N", value: "+278", time: "1개월 전" },
      { rank: 6, title: "한국 축구 국가대표팀 새로운 유니폼 공개", badge: "N", value: "+198", time: "1개월 전" },
      { rank: 7, title: "테슬라 사이버트럭 출시 임박", badge: "N", value: "+267", time: "1개월 전" },
      { rank: 8, title: "손흥민 아시아 최고 선수상 수상", badge: "N", value: "+345", time: "1개월 전" },
      { rank: 9, title: "삼성바이오로직스 신약 개발 성과", badge: "N", value: "+156", time: "1개월 전" },
      { rank: 10, title: "비트코인 ETF 승인 소식", badge: "N", value: "+234", time: "1개월 전" }
    ]
  };

  // 자유게시판 데이터
  const freeBoardPosts = [
    // 알림 게시글
    { 
      id: "알림", 
      title: "LV2~LV8 혜택 상향안내", 
      author: "OENTEST 관리자", 
      views: 3013, 
      date: "2024-08-15", 
      isAlert: true,
      heartValue: "+115"
    },
    { 
      id: "알림", 
      title: "8월 해외 크리에이티브 안내", 
      author: "OENTEST 관리자", 
      views: 931, 
      date: "2024-08-14", 
      isAlert: true,
      heartValue: "+89"
    },
    { 
      id: "알림", 
      title: "9레벨 혜택 상향안내", 
      author: "OENTEST 관리자", 
      views: 3361, 
      date: "2024-08-13", 
      isAlert: true,
      heartValue: "+203"
    },
    // 일반 게시글
    { id: 2989361, title: "잊고잇던 리베", author: "아멘", views: 45, date: "2024-08-15", badge: "N", value: "+2" },
    { id: 2989360, title: "댓글도 잠기는게 있네요ㅋㅋ", author: "블랙양키즈", views: 67, date: "2024-08-15", badge: "N", value: "+4" },
    { id: 2989359, title: "마우스 없어서 불편하네", author: "애널", views: 23, date: "2024-08-15", badge: "N", value: "+1" },
    { id: 2989358, title: "돈없어서 굶네요 써글", author: "탄지로", views: 89, date: "2024-08-15", badge: "N", value: "+7" },
    { id: 2989357, title: "아오 비오네요 ㅠㅠ", author: "더킹카지노먹튀", views: 34, date: "2024-08-15", badge: "N", value: "+3" },
    { id: 2989356, title: "오늘 점심 뭐 먹을까요?", author: "행복한하루", views: 56, date: "2024-08-15", badge: "N", value: "+5" },
    { id: 2989355, title: "주식 투자 조언 부탁드려요", author: "투자왕", views: 123, date: "2024-08-15", badge: "N", value: "+12" },
    { id: 2989354, title: "게임 추천해주세요", author: "게이머", views: 78, date: "2024-08-15", badge: "N", value: "+6" },
    { id: 2989353, title: "날씨가 너무 덥네요", author: "더위탈출", views: 42, date: "2024-08-15", badge: "N", value: "+2" },
    { id: 2989352, title: "새로운 영화 추천", author: "영화광", views: 95, date: "2024-08-15", badge: "N", value: "+8" },
    { id: 2989351, title: "운동하는 분들 계신가요?", author: "피트니스", views: 67, date: "2024-08-15", badge: "N", value: "+4" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* 배너 팝업 */}
      <BannerPopup 
        isOpen={popupState.isOpen}
        onClose={handleClosePopup}
        bannerData={popupState.bannerData}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 브레드크럼 네비게이션 */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-gray-700">홈</Link>
          <span>•</span>
          <span className="text-gray-900 font-medium">자유게시판</span>
        </nav>

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

              {/* 배너들 */}
              <div 
                className="bg-green-600 rounded-lg p-4 relative overflow-hidden mb-4 cursor-pointer hover:bg-green-700 transition-colors transform hover:scale-105"
                onClick={() => handleBannerClick('banner1')}
              >
                <div className="flex items-center justify-center">
                  <div className="text-white text-lg font-bold text-center">배너준비중</div>
                </div>
              </div>

              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-4 relative overflow-hidden mb-4 cursor-pointer hover:from-blue-700 hover:to-purple-800 transition-all transform hover:scale-105"
                onClick={() => handleBannerClick('banner2')}
              >
                <div className="flex items-center justify-center">
                  <div className="text-white text-lg font-bold text-center">배너준비중</div>
                </div>
              </div>

              <div 
                className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-4 relative overflow-hidden mb-4 cursor-pointer hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-105"
                onClick={() => handleBannerClick('banner3')}
              >
                <div className="flex items-center justify-center">
                  <div className="text-white text-lg font-bold text-center">배너준비중</div>
                </div>
              </div>

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
            {/* 인기글 섹션 */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              {/* 탭 버튼들 */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('daily')}
                  className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'daily'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 bg-blue-50 hover:bg-blue-100'
                  }`}
                >
                  일간인기글
                </button>
                <button
                  onClick={() => setActiveTab('weekly')}
                  className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'weekly'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 bg-blue-50 hover:bg-blue-100'
                  }`}
                >
                  주간인기글
                </button>
                <button
                  onClick={() => setActiveTab('monthly')}
                  className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'monthly'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 bg-blue-50 hover:bg-blue-100'
                  }`}
                >
                  월간인기글
                </button>
              </div>
              
              {/* 인기글 목록 */}
              <div className="p-4">
                <div className="grid grid-cols-2 gap-6">
                  {/* 왼쪽 열 (1~5번) - 50% 너비 */}
                  <div className="w-full space-y-3">
                    {popularPosts[activeTab].slice(0, 5).map((post, index) => (
                      <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors w-full">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <span className="text-sm font-medium text-gray-600 min-w-[20px] flex-shrink-0">
                            {post.rank === 1 ? '1️⃣' : 
                             post.rank === 2 ? '2️⃣' : 
                             post.rank === 3 ? '3️⃣' : 
                             post.rank === 4 ? '4️⃣' : 
                             post.rank === 5 ? '5️⃣' : 
                             post.rank === 6 ? '6️⃣' : 
                             post.rank === 7 ? '7️⃣' : 
                             post.rank === 8 ? '8️⃣' : 
                             post.rank === 9 ? '9️⃣' : 
                             post.rank === 10 ? '🔟' : post.rank}
                          </span>
                          <span className="text-sm text-gray-900 truncate flex-1">{post.title}</span>
                          {post.badge && (
                            <span className="bg-amber-300 text-amber-800 text-[10px] px-1 py-0.5 rounded flex-shrink-0">N</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          {post.value && (
                            <span className="text-sm font-medium text-blue-600">{post.value}</span>
                          )}
                          {post.time && (
                            <span className="text-sm text-gray-500">{post.time}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 오른쪽 열 (6~10번) - 50% 너비 */}
                  <div className="w-full space-y-3">
                    {popularPosts[activeTab].slice(5, 10).map((post, index) => (
                      <div key={index + 5} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors w-full">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <span className="text-sm font-medium text-gray-600 min-w-[20px] flex-shrink-0">
                            {post.rank === 1 ? '1️⃣' : 
                             post.rank === 2 ? '2️⃣' : 
                             post.rank === 3 ? '3️⃣' : 
                             post.rank === 4 ? '4️⃣' : 
                             post.rank === 5 ? '5️⃣' : 
                             post.rank === 6 ? '6️⃣' : 
                             post.rank === 7 ? '7️⃣' : 
                             post.rank === 8 ? '8️⃣' : 
                             post.rank === 9 ? '9️⃣' : 
                             post.rank === 10 ? '🔟' : post.rank}
                          </span>
                          <span className="text-sm text-gray-900 truncate flex-1">{post.title}</span>
                          {post.badge && (
                            <span className="bg-amber-300 text-amber-800 text-[10px] px-1 py-0.5 rounded flex-shrink-0">N</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          {post.value && (
                            <span className="text-sm font-medium text-blue-600">{post.value}</span>
                          )}
                          {post.time && (
                            <span className="text-sm text-gray-500">{post.time}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 자유게시판 섹션 */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 whitespace-nowrap">자유게시판</h2>
                <Link
                  to="/create-post"
                  className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors"
                >
                  글쓰기
                </Link>
              </div>
              
              {/* 게시판 헤더 */}
              <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
                <div className="col-span-1">번호</div>
                <div className="col-span-6">제목</div>
                <div className="col-span-2">글쓴이</div>
                <div className="col-span-1">조회</div>
                <div className="col-span-2">날짜</div>
              </div>
              
              {/* 게시글 목록 */}
              <div className="divide-y divide-gray-200">
                {freeBoardPosts.map((post, index) => (
                  <div key={index} className={`grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    post.isAlert ? 'bg-red-50' : ''
                  }`}>
                    <div className="col-span-1 text-sm text-gray-600">
                      {post.isAlert ? '알림' : post.id}
                    </div>
                    <div className="col-span-6">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${post.isAlert ? 'font-semibold text-red-600' : 'text-gray-900'}`}>
                          {post.title}
                        </span>
                        {post.badge && (
                          <span className="bg-amber-300 text-amber-800 text-[10px] px-1 py-0.5 rounded">N</span>
                        )}
                        {post.value && (
                          <span className="text-sm font-medium text-blue-600">{post.value}</span>
                        )}
                        {post.isAlert && post.heartValue && (
                          <div className="flex items-center space-x-1">
                            <span className="text-red-500">❤</span>
                            <span className="text-sm font-medium text-red-600">{post.heartValue}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                          <span>8</span>
                        </div>
                        <span className="text-sm text-gray-900 truncate whitespace-nowrap">{post.author}</span>
                      </div>
                    </div>
                    <div className="col-span-1 text-sm text-gray-600">
                      {post.views.toLocaleString()}
                    </div>
                    <div className="col-span-2 text-sm text-gray-600">
                      {post.date}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 페이지네이션 */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                      이전
                    </button>
                    <button className="px-3 py-2 text-sm bg-blue-500 text-white rounded">1</button>
                    <button className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">2</button>
                    <button className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">3</button>
                    <button className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">다음</button>
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

export default Category2;