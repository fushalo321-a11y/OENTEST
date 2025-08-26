import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  CheckCircle, 
  AlertTriangle, 
  Search,
  X,
  Shield,
  Clock
} from 'lucide-react';
import InlineLogin from '../components/InlineLogin';
import NoticeSidebar from '../components/NoticeSidebar';
import BannerPopup from '../components/BannerPopup';

const WarrantySites = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'warranty', 'verified'
  
  // URL 파라미터에서 카드 ID 읽기
  useEffect(() => {
    const cardId = searchParams.get('card');
    if (cardId) {
      // 페이지 로드 후 해당 카드로 스크롤
      setTimeout(() => {
        const element = document.getElementById(`card-${cardId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }
  }, [searchParams]);
  
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

  // 보증사이트 데이터
  const warrantySites = [
    {
      id: 1,
      title: "보증사이트 보상관련안내",
      date: "11-30",
      views: "23-4",
      description: "안녕하세요. OEN TEST 대표입니다. 보증커뮤니티 통하여 이용하시는 사이트에서 먹튀를 당하셨다면 저희측에서 사이트와 확인 후 실제 먹튀를 한 내용이 확인이 된다면 전액 보상해드리고 있습니다. 또한 현재 피싱이나 협박범들이 많아 항상 이용하시는데 유의하시어 이용 부탁 드리며 언제든지 문제가 있으신 부분은 고객센터 1:1 문의하기로 연락 주시면 최대한 빠르게 답변 드리도록 하겠습니다. 보상가능한 총 예치금 : 30억원",
      status: "verified"
    },
    {
      id: 2,
      title: "OO카지노 보증금 1억원",
      date: "07-12",
      views: "98-11",
      description: "보증금 1억원 주소: http://OEN Test.com 자동코드등록 출금 롤링 모든롤링 100% [게임 안내] 1. 라이브 카지노 (10개 게임사) 영상 제공 ASTAR카지노 / 에볼루션 / 아시아게임 / 프래그마틱 / 마이크로/더블유엠/드림게이밍 / 오리엔탈/올벳/빅게이밍 / BB 카지노 / 섹시 카지노/게임 플레이 2. 슬롯게임 (50개 게임사)",
      status: "verified"
    },
    {
      id: 3,
      title: "OO카지노 보증금 2억원",
      date: "12-15",
      views: "124-8",
      description: "보증금 2억원 주소: http://OEN Test.com 자동코드등록 출금 롤링 모든롤링 100% [게임 안내] 1. 라이브 카지노 (10개 게임사) 영상 제공 ASTAR카지노 / 에볼루션 / 아시아게임 / 프래그마틱 / 마이크로/더블유엠/드림게이밍 / 오리엔탈/올벳/빅게이밍 / BB 카지노 / 섹시 카지노/게임 플레이 2. 슬롯게임 (50개 게임사)",
      status: "verified"
    },
    {
      id: 4,
      title: "OO카지노 보증금 3억원",
      date: "01-20",
      views: "156-23",
      description: "보증금 3억원 주소: http://OEN Test.com 자동코드등록 출금 롤링 모든롤링 100% [게임 안내] 1. 라이브 카지노 (15개 게임사) 영상 제공 ASTAR카지노 / 에볼루션 / 아시아게임 / 프래그마틱 / 마이크로/더블유엠/드림게이밍 / 오리엔탈/올벳/빅게이밍 / BB 카지노 / 섹시 카지노/게임 플레이 2. 슬롯게임 (60개 게임사)",
      status: "verified"
    },
    {
      id: 5,
      title: "OO카지노 보증금 5억원",
      date: "02-08",
      views: "203-45",
      description: "보증금 5억원 주소: http://OEN Test.com 자동코드등록 출금 롤링 모든롤링 100% [게임 안내] 1. 라이브 카지노 (20개 게임사) 영상 제공 ASTAR카지노 / 에볼루션 / 아시아게임 / 프래그마틱 / 마이크로/더블유엠/드림게이밍 / 오리엔탈/올벳/빅게이밍 / BB 카지노 / 섹시 카지노/게임 플레이 2. 슬롯게임 (80개 게임사)",
      status: "verified"
    },
    {
      id: 6,
      title: "OO카지노 보증금 10억원",
      date: "03-15",
      views: "342-67",
      description: "보증금 10억원 주소: http://OEN Test.com 자동코드등록 출금 롤링 모든롤링 100% [게임 안내] 1. 라이브 카지노 (25개 게임사) 영상 제공 ASTAR카지노 / 에볼루션 / 아시아게임 / 프래그마틱 / 마이크로/더블유엠/드림게이밍 / 오리엔탈/올벳/빅게이밍 / BB 카지노 / 섹시 카지노/게임 플레이 2. 슬롯게임 (100개 게임사)",
      status: "verified"
    }
  ];

  // 필터링된 사이트 목록
  const filteredSites = warrantySites.filter(site => {
    const matchesSearch = site.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || site.status === filterType;
    return matchesSearch && matchesFilter;
  });



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
          <span className="text-gray-900 font-medium">보증사이트</span>
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
            {/* 검색 및 필터 영역 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* 검색 입력 필드 */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="사이트명 또는 키워드로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                {/* 필터 버튼들 */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                      filterType === 'all'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    전체
                  </button>

                  <button
                    onClick={() => setFilterType('verified')}
                    className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                      filterType === 'verified'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    검증완료
                  </button>
                </div>
              </div>
            </div>



            {/* 사이트 목록 */}
            <div className="space-y-6">
              {filteredSites.map((site) => (
                <div key={site.id} id={`card-${site.id}`} className="bg-white rounded-lg border border-gray-300 overflow-hidden hover:shadow-sm transition-shadow relative">
                  {/* 보증사이트 라벨 */}
                  <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-br-lg z-10">
                    보증사이트
                  </div>
                  <div className="flex flex-col lg:flex-row">
                    {/* 이미지 영역 */}
                    <div className="lg:w-1/3">
                      <div 
                        className="w-full h-48 lg:h-full flex items-center justify-center text-white font-bold text-lg"
                        style={{
                          background: site.status === 'warranty' 
                            ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                            : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        <div className="text-center z-10">
                          <div className="text-2xl mb-2">
                            {site.status === 'warranty' ? '🎰' : '✅'}
                          </div>
                          <div className="text-sm opacity-90">
                            {site.title.split(' ')[0]}
                          </div>
                        </div>
                        <div 
                          className="absolute inset-0 opacity-10"
                          style={{
                            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)'
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* 내용 영역 */}
                    <div className="lg:w-2/3 p-6">
                                             <div className="flex items-start justify-between mb-4">
                         <h3 className="text-xl font-bold text-gray-900 pr-4 whitespace-nowrap">{site.title}</h3>
                         <div className="flex items-center space-x-2 text-sm text-gray-500 flex-shrink-0">
                           <Clock className="h-4 w-4" />
                           <span className="whitespace-nowrap">{site.date}</span>
                           <span>•</span>
                           <span className="whitespace-nowrap">{site.views}</span>
                         </div>
                       </div>
                       
                       <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                         {site.description}
                       </p>
                      
                      {/* 상태 태그 */}
                      <div className="mt-4">
                        <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                          site.status === 'warranty'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {site.status === 'warranty' ? (
                            <>
                              <X className="h-3 w-3" />
                              <span className="whitespace-nowrap">보증사이트</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-3 w-3" />
                              <span>검증완료</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 사이트가 없을 때 */}
            {filteredSites.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">검색 결과가 없습니다</h3>
                <p className="text-gray-600">다른 검색어나 필터를 시도해보세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarrantySites; 