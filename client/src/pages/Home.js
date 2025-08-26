import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import InlineLogin from '../components/InlineLogin';
import BannerPopup from '../components/BannerPopup';
import HomeStartPopup from '../components/HomeStartPopup';
import NoticeSidebar from '../components/NoticeSidebar';
import { getHomeGalleryData } from '../data/galleryData';

const Home = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    page: parseInt(searchParams.get('page')) || 1,
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'createdAt'
  });
  
  // 배너 팝업 상태 관리
  const [popupState, setPopupState] = useState({
    isOpen: false,
    bannerData: null
  });

  // 홈화면 시작 시 팝업 상태 관리
  const [homeStartPopupState, setHomeStartPopupState] = useState({
    isOpen: false,
    popupData: null
  });

  // 배너 팝업 닫기 핸들러
  const handleClosePopup = () => {
    setPopupState({
      isOpen: false,
      bannerData: null
    });
  };

  // 홈화면 시작 팝업 닫기 핸들러
  const handleCloseHomeStartPopup = () => {
    setHomeStartPopupState({
      isOpen: false,
      popupData: null
    });
  };

  // URL 파라미터가 변경될 때 필터 업데이트
  useEffect(() => {
    const newFilters = {
      page: parseInt(searchParams.get('page')) || 1,
      category: searchParams.get('category') || '',
      search: searchParams.get('search') || '',
      sort: searchParams.get('sort') || 'createdAt'
    };
    setFilters(newFilters);
  }, [searchParams]);

  // 홈화면 로드 시 자동으로 팝업 열기 (한 번만)
  useEffect(() => {
    // localStorage에서 숨겨진 홈화면 시작 팝업 정보 확인 및 정리
    const hiddenHomeStartPopups = JSON.parse(localStorage.getItem('hiddenHomeStartPopups') || '{}');
    const now = new Date().getTime();
    let hasChanges = false;
    
    // 숨김 기간이 지난 홈화면 시작 팝업은 localStorage에서 제거
    Object.keys(hiddenHomeStartPopups).forEach(popupIndex => {
      if (hiddenHomeStartPopups[popupIndex] <= now) {
        delete hiddenHomeStartPopups[popupIndex];
        hasChanges = true;
      }
    });
    
    // 변경사항이 있으면 localStorage 업데이트
    if (hasChanges) {
      localStorage.setItem('hiddenHomeStartPopups', JSON.stringify(hiddenHomeStartPopups));
    }
    
    // 숨겨진 홈화면 시작 팝업이 모두인지 확인
    const hiddenIndexes = Object.keys(hiddenHomeStartPopups).map(Number);
    const allHidden = [0, 1, 2].every(index => hiddenIndexes.includes(index));
    
    // 모든 홈화면 시작 팝업이 숨겨져 있지 않으면 팝업 열기
    if (!allHidden) {
      setHomeStartPopupState({
        isOpen: true,
        popupData: { type: 'homeStart' }
      });
    }
  }, []); // 빈 의존성 배열로 한 번만 실행

  // 홈화면 클릭 시 3개 이벤트 팝업 열기 핸들러 (현재 사용하지 않음)
  // const handleHomeClick = () => {
  //   // 기존 3개 팝업 열기 (multi 타입)
  //   setPopupState({
  //     isOpen: true,
  //     bannerData: { type: 'multi' }
  //   });
  // };

  // 게시물 목록 조회 (임시로 더미 데이터 사용)
  const { isLoading, error } = useQuery({
    queryKey: ['posts', filters],
    queryFn: async () => {
      // 백엔드 서버가 없을 때를 위한 임시 데이터
      return {
        posts: [
          {
            _id: '1',
            title: '첫 번째 게시물입니다',
            content: '안녕하세요! 이것은 첫 번째 게시물입니다. 커뮤니티에 오신 것을 환영합니다.',
            author: { username: '관리자', avatar: '/default-avatar.png' },
            category: '일반',
            views: 15,
            likes: [],
            commentCount: 2,
            createdAt: new Date().toISOString(),
            isPinned: true
          },
          {
            _id: '2',
            title: '커뮤니티 이용 가이드',
            content: '커뮤니티를 더 잘 이용하기 위한 가이드입니다. 다양한 기능들을 확인해보세요.',
            author: { username: '가이드', avatar: '/default-avatar.png' },
            category: '정보',
            views: 8,
            likes: [],
            commentCount: 1,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            isPinned: false
          }
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalPosts: 2,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    },
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000, // 5분
  });

  // 뉴스 데이터 (10개로 확장) - 실시간 애니메이션용
  const newsData = [
    { id: 1, title: "[뉴스] 대학 입시 제도 대폭 개편... 수시 폐지 검토", time: "1분전" },
    { id: 2, title: "[뉴스] 연예인 A씨, 마약 혐의로 조사", time: "2분전" },
    { id: 3, title: "[뉴스] 대기업 B사, 부정부패 의혹으로 수사", time: "3분전" },
    { id: 4, title: "[뉴스] 스포츠 스타 C선수, 도박 혐의로 제명", time: "4분전" },
    { id: 5, title: "[뉴스] 게임회사 D사, 중국 기업에 인수", time: "5분전" },
    { id: 6, title: "[뉴스] 새로운 AI 기술 개발 성공", time: "6분전" },
    { id: 7, title: "[뉴스] 글로벌 경제 위기 심화", time: "7분전" },
    { id: 8, title: "[뉴스] 환경 보호 정책 강화", time: "8분전" },
    { id: 9, title: "[뉴스] 새로운 의료 기술 혁신", time: "9분전" },
    { id: 10, title: "[뉴스] 교육 시스템 디지털 전환", time: "10분전" }
  ];

  // 뉴스 애니메이션 상태 관리
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  // 뉴스 자동 스크롤 효과
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % newsData.length);
    }, 3000); // 3초마다 다음 뉴스로

    return () => clearInterval(interval);
  }, [newsData.length]);

  // 갤러리 데이터 - 갤러리 페이지와 동기화
  const galleryData = getHomeGalleryData();

  // 배너 클릭 핸들러
  const handleBannerClick = (bannerType) => {
    console.log('배너 클릭됨:', bannerType);
    
    // 배너 1-4는 팝업으로 열기
    if (bannerType === 'banner1' || bannerType === 'banner2' || bannerType === 'banner3' || bannerType === 'banner4') {
      setPopupState({
        isOpen: true,
        bannerData: { type: bannerType }
      });
      return;
    }
    
    // 게임 배너들은 보증사이트 페이지로 이동
    let cardId = 1; // 기본값
    
    if (bannerType === 'epic-games' || bannerType === 'epic-games-2') {
      cardId = 2; // OO카지노 1억원
    } else if (bannerType === 'steam-sale' || bannerType === 'steam-sale-2') {
      cardId = 3; // OO카지노 2억원
    } else if (bannerType === 'nintendo-switch' || bannerType === 'nintendo-switch-2') {
      cardId = 4; // OO카지노 3억원
    }
    
    // 보증사이트 페이지로 이동 (카드 ID와 함께)
    window.location.href = `/warranty-sites?card=${cardId}`;
  };

  // 게시판 탭 상태 관리
  const [activeTab, setActiveTab] = useState('free');

  // 자유게시판 데이터 (예시)
  const freeBoardData = [
    { id: 1, title: "오늘 날씨가 정말 좋네요!", author: "날씨맨", time: "5분전", views: 12 },
    { id: 2, title: "새로운 게임 추천해주세요", author: "게이머", time: "10분전", views: 8 },
    { id: 3, title: "맛집 정보 공유합니다", author: "맛집탐험가", time: "15분전", views: 25 },
    { id: 4, title: "운동하는 분들 계신가요?", author: "헬스러버", time: "20분전", views: 18 },
    { id: 5, title: "영화 추천 부탁드려요", author: "영화팬", time: "25분전", views: 14 },
    { id: 6, title: "주식 투자 조언 구합니다", author: "투자자", time: "30분전", views: 32 },
    { id: 7, title: "여행 계획 세우는 중입니다", author: "여행자", time: "35분전", views: 21 },
    { id: 8, title: "책 추천해주세요", author: "독서광", time: "40분전", views: 16 }
  ];

  // 코인게시판 데이터 (예시)
  const coinBoardData = [
    { id: 1, title: "비트코인 상승세 지속될까요?", author: "코인마스터", time: "3분전", views: 45 },
    { id: 2, title: "이더리움 2.0 업그레이드 소식", author: "블록체인러버", time: "8분전", views: 32 },
    { id: 3, title: "새로운 알트코인 추천해주세요", author: "알트코인팬", time: "12분전", views: 28 },
    { id: 4, title: "디파이 프로젝트 분석", author: "디파이전문가", time: "18분전", views: 19 },
    { id: 5, title: "NFT 시장 동향 어떻게 되나요?", author: "NFT컬렉터", time: "25분전", views: 36 },
    { id: 6, title: "스테이킹 수익률 비교", author: "스테이킹마스터", time: "30분전", views: 22 },
    { id: 7, title: "암호화폐 지갑 추천", author: "보안전문가", time: "35분전", views: 41 },
    { id: 8, title: "ICO 투자 경험 공유", author: "투자고수", time: "42분전", views: 15 }
  ];

  // 증시게시판 데이터 (예시)
  const stockBoardData = [
    { id: 1, title: "삼성전자 실적 발표 예상", author: "주식고수", time: "2분전", views: 67 },
    { id: 2, title: "SK하이닉스 반도체 시장 전망", author: "반도체전문가", time: "7분전", views: 43 },
    { id: 3, title: "네이버 신규 서비스 출시", author: "IT분석가", time: "11분전", views: 38 },
    { id: 4, title: "카카오 게임사업 확장", author: "게임주식러버", time: "16분전", views: 29 },
    { id: 5, title: "LG에너지솔루션 배터리 시장", author: "배터리전문가", time: "22분전", views: 51 },
    { id: 6, title: "현대차 전기차 판매 실적", author: "자동차분석가", time: "28분전", views: 34 },
    { id: 7, title: "포스코홀딩스 철강 가격 동향", author: "철강전문가", time: "33분전", views: 26 },
    { id: 8, title: "신한은행 금리 정책 영향", author: "금융전문가", time: "40분전", views: 31 }
  ];

  // 스포츠게시판 데이터 (예시)
  const sportsBoardData = [
    { id: 1, title: "손흥민 프리미어리그 득점왕 경쟁", author: "축구팬", time: "1분전", views: 89 },
    { id: 2, title: "김민재 바이에른 뮌헨 활약", author: "축구전문가", time: "5분전", views: 67 },
    { id: 3, title: "류현진 MLB 복귀 소식", author: "야구팬", time: "9분전", views: 73 },
    { id: 4, title: "오타니 투타겸업 기록", author: "야구전문가", time: "14분전", views: 58 },
    { id: 5, title: "김연아 피겨 은퇴 후 근황", author: "피겨팬", time: "19분전", views: 42 },
    { id: 6, title: "박지성 축구 해설 데뷔", author: "축구러버", time: "24분전", views: 51 },
    { id: 7, title: "이강인 PSG 이적 소식", author: "축구전문가", time: "29분전", views: 76 },
    { id: 8, title: "박세리 골프 대회 우승", author: "골프팬", time: "35분전", views: 38 }
  ];

  // 현재 활성 탭에 따른 데이터 반환
  const getCurrentBoardData = () => {
    switch (activeTab) {
      case 'coin':
        return coinBoardData;
      case 'stock':
        return stockBoardData;
      case 'sports':
        return sportsBoardData;
      default:
        return freeBoardData;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10">
          {/* 왼쪽 사이드바 - 로그인 창 (모바일에서는 상단에 표시) */}
          <div className="lg:col-span-1 order-1 lg:order-1">
            <div className="lg:sticky lg:top-24 lg:pr-3">
              <InlineLogin />
            </div>
          </div>

          {/* 오른쪽 메인 콘텐츠 */}
          <div className="lg:col-span-3 order-2 lg:order-2">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10">
          {/* 왼쪽 사이드바 - 로그인 창 (모바일에서는 상단에 표시) */}
          <div className="lg:col-span-1 order-1 lg:order-1">
            <div className="lg:sticky lg:top-24 lg:pr-3">
              <InlineLogin />
            </div>
          </div>

          {/* 오른쪽 메인 콘텐츠 */}
          <div className="lg:col-span-3 order-2 lg:order-2">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">오류가 발생했습니다</h2>
              <p className="text-gray-600 mb-4">게시물을 불러오는 중 문제가 발생했습니다.</p>
              <button 
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 배너 팝업 */}
      <BannerPopup 
        isOpen={popupState.isOpen}
        onClose={handleClosePopup}
        bannerData={popupState.bannerData}
      />
      
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

        {/* 오른쪽 메인 콘텐츠 */}
        <div className="lg:col-span-3 order-2 lg:order-2">
          {/* 게임 카드 섹션 - 전체 테두리 */}
          <div className="border border-gray-300 rounded-lg p-2 relative mb-2">
            {/* 보증사이트 라벨 */}
            <div className="absolute top-0 left-0 bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-br-lg z-10">
              보증사이트
            </div>
            
            {/* 상단 헤더 섹션 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* 왼쪽 블록 - 에픽게임즈 스토어 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">무료</span>
              </div>
              <div className="text-center">
                <h3 className="text-white text-sm mb-2">이번 주 에픽게임즈 스토어 무료 게임은?</h3>
                <div className="text-white text-2xl font-bold mb-4">EPIC GAMES STORE</div>
                <button 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                  onClick={() => handleBannerClick('epic-games')}
                >
                  제휴 바로가기
                </button>
              </div>
            </div>

            {/* 오른쪽 블록 - 에픽게임즈 스토어 복사 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">무료</span>
              </div>
              <div className="text-center">
                <h3 className="text-white text-sm mb-2">이번 주 에픽게임즈 스토어 무료 게임은?</h3>
                <div className="text-white text-2xl font-bold mb-4">EPIC GAMES STORE</div>
                <button 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                  onClick={() => handleBannerClick('epic-games-2')}
                >
                  제휴 바로가기
                </button>
              </div>
            </div>
          </div>

          {/* 두 번째 헤더 섹션 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* 왼쪽 블록 - 스팀 게임 */}
            <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-lg p-6 relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">할인</span>
              </div>
              <div className="text-center">
                <h3 className="text-white text-sm mb-2">스팀 여름 세일이 시작되었습니다!</h3>
                <div className="text-white text-2xl font-bold mb-4">STEAM SUMMER SALE</div>
                <button 
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                  onClick={() => handleBannerClick('steam-sale')}
                >
                  제휴 바로가기
                </button>
              </div>
            </div>

            {/* 오른쪽 블록 - 스팀 게임 복사 */}
            <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-lg p-6 relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">할인</span>
              </div>
              <div className="text-center">
                <h3 className="text-white text-sm mb-2">스팀 여름 세일이 시작되었습니다!</h3>
                <div className="text-white text-2xl font-bold mb-4">STEAM SUMMER SALE</div>
                <button 
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                  onClick={() => handleBannerClick('steam-sale-2')}
                >
                  제휴 바로가기
                </button>
              </div>
            </div>
          </div>

          {/* 세 번째 헤더 섹션 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* 왼쪽 블록 - 닌텐도 */}
            <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-lg p-6 relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <span className="bg-white text-red-600 text-xs px-2 py-1 rounded-full">인기</span>
              </div>
              <div className="text-center">
                <h3 className="text-white text-sm mb-2">닌텐도 스위치 신작 게임</h3>
                <div className="text-white text-2xl font-bold mb-4">NINTENDO SWITCH</div>
                <button 
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                  onClick={() => handleBannerClick('nintendo-switch')}
                >
                  제휴 바로가기
                </button>
              </div>
            </div>

            {/* 오른쪽 블록 - 닌텐도 복사 */}
            <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-lg p-6 relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <span className="bg-white text-red-600 text-xs px-2 py-1 rounded-full">인기</span>
              </div>
              <div className="text-center">
                <h3 className="text-white text-sm mb-2">닌텐도 스위치 신작 게임</h3>
                <div className="text-white text-2xl font-bold mb-4">NINTENDO SWITCH</div>
                <button 
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                  onClick={() => handleBannerClick('nintendo-switch-2')}
                >
                  제휴 바로가기
                </button>
              </div>
            </div>
          </div>
          </div>

          {/* 뉴스 배너 */}
          <div className="bg-gray-100 rounded-lg p-3 mb-6 overflow-hidden">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 2h6v4H5V7zm6 6h4v2h-4v-2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-2 overflow-hidden h-6 flex-1 min-w-0">
                <div 
                  className="text-gray-800 text-sm transition-transform duration-500 ease-in-out"
                  style={{ 
                    transform: `translateY(-${currentNewsIndex * 24}px)`,
                    lineHeight: '24px'
                  }}
                >
                  {newsData.map((item, index) => (
                    <div key={item.id} className="flex items-center">
                      <span className="truncate w-full">{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 메인 콘텐츠 - 자유게시판 + 갤러리 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 자유게시판 */}
            <div className="bg-white rounded-lg shadow-sm border-2" style={{ borderColor: '#F5F5DC' }}>
              <div className="p-4 border-b border-gray-200">
                <div className="grid grid-cols-4 gap-1">
                  <button 
                    onClick={() => setActiveTab('free')}
                    className={`px-1 py-2 text-xs font-semibold transition-colors rounded-md border whitespace-nowrap w-full ${
                      activeTab === 'free' 
                        ? 'text-gray-900 bg-blue-50 border-blue-200' 
                        : 'text-gray-600 bg-blue-25 border-blue-100 hover:bg-blue-50'
                    }`}
                    style={{ backgroundColor: activeTab === 'free' ? '#eff6ff' : '#f8fafc' }}
                  >
                    자유게시판
                  </button>
                  <button 
                    onClick={() => setActiveTab('sports')}
                    className={`px-1 py-2 text-xs font-semibold transition-colors rounded-md border whitespace-nowrap w-full ${
                      activeTab === 'sports' 
                        ? 'text-gray-900 bg-orange-50 border-orange-200' 
                        : 'text-gray-600 bg-orange-25 border-orange-100 hover:bg-orange-50'
                    }`}
                    style={{ backgroundColor: activeTab === 'sports' ? '#fff7ed' : '#fefcf8' }}
                  >
                    스포츠
                  </button>
                  <button 
                    onClick={() => setActiveTab('stock')}
                    className={`px-1 py-2 text-xs font-semibold transition-colors rounded-md border whitespace-nowrap w-full ${
                      activeTab === 'stock' 
                        ? 'text-gray-900 bg-green-50 border-green-200' 
                        : 'text-gray-600 bg-green-25 border-green-100 hover:bg-green-50'
                    }`}
                    style={{ backgroundColor: activeTab === 'stock' ? '#f0fdf4' : '#f9fef9' }}
                  >
                    증시
                  </button>
                  <button 
                    onClick={() => setActiveTab('coin')}
                    className={`px-1 py-2 text-xs font-semibold transition-colors rounded-md border whitespace-nowrap w-full ${
                      activeTab === 'coin' 
                        ? 'text-gray-900 bg-yellow-50 border-yellow-200' 
                        : 'text-gray-600 bg-yellow-25 border-yellow-100 hover:bg-yellow-50'
                    }`}
                    style={{ backgroundColor: activeTab === 'coin' ? '#fefce8' : '#fefef8' }}
                  >
                    코인
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {getCurrentBoardData().map((item) => (
                    <div 
                      key={item.id} 
                      className="border-b border-gray-200 pb-3 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        switch(activeTab) {
                          case 'free':
                            window.location.href = '/free-board';
                            break;
                          case 'sports':
                            window.location.href = '/sports-news';
                            break;
                          case 'stock':
                            window.location.href = '/stock-board';
                            break;
                          case 'coin':
                            window.location.href = '/coin-board';
                            break;
                          default:
                            window.location.href = '/free-board';
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            {activeTab === 'free' && (
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                            {activeTab === 'sports' && (
                              <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                            {activeTab === 'stock' && (
                              <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                            {activeTab === 'coin' && (
                              <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {item.title}
                            </h3>
                          </div>
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <span>{item.author}</span>
                            <span>•</span>
                            <span>{item.time}</span>
                            <span>•</span>
                            <span>조회 {item.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 갤러리 */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">갤러리</h2>
                <Link to="/gallery" className="text-blue-600 text-sm hover:underline">더보기</Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {galleryData.map((item) => (
                  <div 
                    key={item.id} 
                    className="group cursor-pointer"
                    onClick={() => window.location.href = `/gallery/${item.id}`}
                  >
                    <div className="relative overflow-hidden rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-200"></div>
                      
                      {/* 하단 정보 */}
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                        <h3 className="text-white text-sm font-medium truncate mb-1">{item.title}</h3>
                        <div className="flex items-center justify-between text-white text-xs opacity-80">
                          <span>조회 {item.views}</span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 배너 팝업 */}
      <BannerPopup 
        isOpen={popupState.isOpen} 
        bannerData={popupState.bannerData} 
        onClose={handleClosePopup} 
      />

      {/* 홈화면 시작 팝업 */}
      <HomeStartPopup 
        isOpen={homeStartPopupState.isOpen} 
        onClose={handleCloseHomeStartPopup} 
      />
    </div>
  );
};

export default Home; 