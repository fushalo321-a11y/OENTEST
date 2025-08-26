import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import InlineLogin from '../components/InlineLogin';
import NoticeSidebar from '../components/NoticeSidebar';
import BannerPopup from '../components/BannerPopup';

const CustomerCenter = () => {
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
          <Link to="/customer-center" className="text-gray-900 font-medium">고객센터/공지</Link>
          <span>•</span>
          <span className="text-gray-900 font-medium">공지사항</span>
        </nav>

        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">공지사항</h1>
          <p className="text-gray-600">중요한 공지사항을 확인하세요.</p>
        </div>

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
                      { title: "OEN 이벤트", points: "+36", date: "25.06.23" },
                      { title: "OEN 이벤트", points: "+28", date: "25.06.08" },
                      { title: "OEN 이벤트", points: "+26", date: "25.06.08" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors" onClick={() => window.location.href = '/oen-test-event'}>
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-900 text-sm truncate">{item.title}</span>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
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
            {/* 공지사항 목록 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">공지사항 목록</h2>
              <div className="space-y-4">
                {[
                  { title: "사이트ID가 포함된 사칭 사이트 주의 안내", date: "07-12", important: true },
                  { title: "(중요) 타업체와 동일한 사칭 사이트 주의 안내", date: "07-12", important: true },
                  { title: "사칭 절대 주의 안내", date: "05-08", important: true },
                  { title: "접속장애시 크롬 & 엣지 브라우저 사용 권장", date: "02-07" },
                  { title: "메가게임즈 제휴 종료 안내", date: "03-30" }
                ].map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="w-4 h-4 bg-red-500 text-white text-xs rounded flex items-center justify-center">H</span>
                          <h3 className={`text-lg font-semibold ${item.important ? 'text-red-600' : 'text-gray-900'}`}>
                            {item.title}
                          </h3>
                        </div>
                        <div className="text-sm text-gray-500">
                          등록일: {item.date}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">자주 묻는 질문</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium text-gray-900">회원가입은 어떻게 하나요?</h3>
                  <p className="text-gray-600 mt-1">홈페이지 상단의 회원가입 버튼을 클릭하여 가입하실 수 있습니다.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-medium text-gray-900">비밀번호를 잊어버렸어요</h3>
                  <p className="text-gray-600 mt-1">로그인 페이지에서 '정보찾기' 버튼을 클릭하여 비밀번호를 재설정하세요.</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-medium text-gray-900">게시글 작성은 어떻게 하나요?</h3>
                  <p className="text-gray-600 mt-1">로그인 후 상단 메뉴의 '글쓰기' 버튼을 클릭하여 게시글을 작성하실 수 있습니다.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">문의하기</h2>
              <p className="text-gray-600 mb-4">
                추가적인 문의사항이 있으시면 아래 양식을 통해 문의해주세요.
              </p>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="이름을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="이메일을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">문의 내용</label>
                  <textarea
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="문의사항을 입력하세요"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  문의하기
                </button>
              </form>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1 order-3 lg:order-3">
            <div className="lg:sticky lg:top-24 lg:pl-3 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">연락처</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-2">이메일:</span>
                    <span className="font-medium">support@oentest.com</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-2">전화:</span>
                    <span className="font-medium">02-1234-5678</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-2">운영시간:</span>
                    <span className="font-medium">09:00 - 18:00</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 링크</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">이용약관</a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">개인정보처리방침</a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">공지사항</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCenter; 