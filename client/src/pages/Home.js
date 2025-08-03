import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowRight
} from 'lucide-react';
import InlineLogin from '../components/InlineLogin';

const Home = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    page: parseInt(searchParams.get('page')) || 1,
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'createdAt'
  });

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

  // 뉴스 데이터 (임시) - 최대 5개로 제한
  const newsData = [
    { id: 1, title: "[뉴스] 대학 입시 제도 대폭 개편... 수시 폐지 검토", time: "1시간전" },
    { id: 2, title: "[뉴스] 연예인 A씨, 마약 혐의로 조사", time: "2시간전" },
    { id: 3, title: "[뉴스] 대기업 B사, 부정부패 의혹으로 수사", time: "3시간전" },
    { id: 4, title: "[뉴스] 스포츠 스타 C선수, 도박 혐의로 제명", time: "4시간전" },
    { id: 5, title: "[뉴스] 게임회사 D사, 중국 기업에 인수", time: "5시간전" }
  ];

  // 갤러리 데이터 (실제 여행 이미지)
  const galleryData = [
    { id: 1, title: "파리 에펠탑", image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=150&h=150&fit=crop" },
    { id: 2, title: "로마 콜로세움", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=150&h=150&fit=crop" },
    { id: 3, title: "도쿄 스카이트리", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=150&h=150&fit=crop" },
    { id: 4, title: "뉴욕 자유의 여신상", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=150&h=150&fit=crop" },
    { id: 5, title: "런던 빅벤", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=150&h=150&fit=crop" },
    { id: 6, title: "시드니 오페라하우스", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=150&h=150&fit=crop" }
  ];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* 왼쪽 사이드바 - 로그인 창 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 pr-3">
              <InlineLogin />
            </div>
          </div>

          {/* 오른쪽 메인 콘텐츠 */}
          <div className="lg:col-span-3">
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* 왼쪽 사이드바 - 로그인 창 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 pr-3">
              <InlineLogin />
            </div>
          </div>

          {/* 오른쪽 메인 콘텐츠 */}
          <div className="lg:col-span-3">
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* 왼쪽 사이드바 - 로그인 창 */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 pr-3 space-y-6">
            <InlineLogin />
            
            {/* 공지사항 박스 */}
            <div className="bg-white rounded-lg shadow-sm border-2" style={{ borderColor: '#F5F5DC' }}>
              <div className="p-2 border-b border-gray-200" style={{ backgroundColor: '#F5F5DC' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-center space-x-2 flex-1">
                    <div className="w-5 h-5 bg-gradient-to-br from-red-500 to-blue-600 rounded-full flex items-center justify-center relative">
                      <div className="w-2.5 h-2.5 bg-white rounded-sm flex items-center justify-center">
                        <span className="text-red-600 font-bold text-xs">♠</span>
                      </div>
                      <div className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-yellow-400 rounded-full"></div>
                      <div className="absolute -bottom-0.5 -left-0.5 w-0.5 h-0.5 bg-yellow-400 rounded-full"></div>
                    </div>
                    <h3 className="text-xs font-semibold text-gray-900">공지사항</h3>
                  </div>
                  <button className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                    <span className="text-xs">+</span>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                                       {[
                       { title: "사이트ID가 포함된 ...", date: "07-12" },
                       { title: "(중요) 타업체와 동...", date: "07-12" },
                       { title: "사칭 절대 주의 안내", date: "05-08", important: true },
                       { title: "접속장애시 크롬 &...", date: "02-07" },
                       { title: "메가게임즈 제휴 종...", date: "03-30" }
                     ].map((item, index) => (
                       <div key={index} className="flex items-center justify-between">
                         <div className="flex items-center space-x-2 flex-1 min-w-0">
                           <span className={`text-gray-900 text-sm truncate ${item.important ? 'font-semibold' : ''}`}>
                             {item.title}
                           </span>
                         </div>
                         <div className="flex items-center space-x-2 flex-shrink-0">
                           <span className="w-4 h-4 bg-red-500 text-white text-xs rounded flex items-center justify-center">H</span>
                           <span className="text-gray-400 text-xs whitespace-nowrap">{item.date}</span>
                         </div>
                       </div>
                     ))}
                </div>
              </div>
            </div>

            {/* 이벤트 박스 */}
            <div className="bg-white rounded-lg shadow-sm border-2" style={{ borderColor: '#F5F5DC' }}>
              <div className="p-2 rounded-t-lg" style={{ backgroundColor: '#F5F5DC' }}>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 bg-gradient-to-br from-red-500 to-blue-600 rounded-full flex items-center justify-center relative">
                    <div className="w-2.5 h-2.5 bg-white rounded-sm flex items-center justify-center">
                      <span className="text-red-600 font-bold text-xs">♠</span>
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-yellow-400 rounded-full"></div>
                    <div className="absolute -bottom-0.5 -left-0.5 w-0.5 h-0.5 bg-yellow-400 rounded-full"></div>
                  </div>
                  <h3 className="text-gray-900 text-xs font-semibold">OENTEST EVENT</h3>
                </div>
              </div>
              <div className="p-3">
                <div className="space-y-2">
                                     {[
                     { title: "점핑 이벤트!", points: "+12", date: "25.07.25" },
                     { title: "신규회원 체험머니 이벤트!", points: "+31", date: "25.07.03" },
                     { title: "연속 출석 이벤트", points: "+36", date: "25.06.23" },
                     { title: "일일미션 이벤트", points: "+28", date: "25.06.08" },
                     { title: "후기 이벤트", points: "+26", date: "25.06.08" }
                   ].map((item, index) => (
                     <div key={index} className="flex items-center justify-between">
                       <div className="flex items-center space-x-2 flex-1 min-w-0">
                         <span className="bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">이벤트</span>
                         <span className="text-gray-900 text-sm truncate">{item.title}</span>
                       </div>
                       <div className="flex items-center space-x-2 flex-shrink-0">
                         <span className="text-red-500 text-sm font-semibold whitespace-nowrap">{item.points}</span>
                         <span className="text-gray-400 text-xs whitespace-nowrap">{item.date}</span>
                       </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>

                        {/* 배너 1 - 배너준비중 */}
            <div className="bg-green-600 rounded-lg p-4 relative overflow-hidden">
              <div className="flex items-center justify-center">
                <div className="text-white text-lg font-bold">배너준비중</div>
              </div>
            </div>

            {/* 배너 2 - 배너준비중 */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-4 relative overflow-hidden">
              <div className="flex items-center justify-center">
                <div className="text-white text-lg font-bold">배너준비중</div>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 메인 콘텐츠 */}
        <div className="lg:col-span-3">
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
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                  확인하기
                </button>
              </div>
            </div>

            {/* 오른쪽 블록 - 네이버 게임 */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg p-6 relative overflow-hidden">
              <div className="absolute top-2 left-2">
                <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">무료</span>
              </div>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-8 h-8 bg-green-400 rounded-full"></div>
                <div className="absolute top-8 right-8 w-6 h-6 bg-blue-300 rounded-full"></div>
                <div className="absolute bottom-4 left-8 w-4 h-4 bg-white rounded-full"></div>
              </div>
              <div className="text-center">
                <h3 className="text-white text-xl font-bold mb-4">네이버 게임과 함께해요</h3>
                <button className="bg-purple-800 hover:bg-purple-900 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-center mx-auto">
                  제휴 제안 바로가기
                  <ArrowRight className="ml-2 h-4 w-4" />
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
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                  쇼핑하기
                </button>
              </div>
            </div>

            {/* 오른쪽 블록 - 플레이스테이션 */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-6 relative overflow-hidden">
              <div className="absolute top-2 left-2">
                <span className="bg-white text-blue-600 text-xs px-2 py-1 rounded-full">신규</span>
              </div>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 bg-blue-300 rounded-full"></div>
                <div className="absolute top-8 left-8 w-3 h-3 bg-yellow-400 rounded-full"></div>
              </div>
              <div className="text-center">
                <h3 className="text-white text-xl font-bold mb-4">PS5 독점 게임 출시</h3>
                <button className="bg-white hover:bg-gray-100 text-blue-600 px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-center mx-auto">
                  자세히 보기
                  <ArrowRight className="ml-2 h-4 w-4" />
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
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                  예약하기
                </button>
              </div>
            </div>

            {/* 오른쪽 블록 - 엑스박스 */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg p-6 relative overflow-hidden">
              <div className="absolute top-2 left-2">
                <span className="bg-green-400 text-green-900 text-xs px-2 py-1 rounded-full">무료</span>
              </div>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-8 h-8 bg-green-300 rounded-full"></div>
                <div className="absolute top-8 right-8 w-5 h-5 bg-white rounded-full"></div>
                <div className="absolute bottom-4 left-8 w-3 h-3 bg-yellow-300 rounded-full"></div>
              </div>
              <div className="text-center">
                <h3 className="text-white text-xl font-bold mb-4">Xbox Game Pass</h3>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-center mx-auto">
                  구독하기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 뉴스 배너 */}
          <div className="bg-gray-100 rounded-lg p-3 mb-6">
            <div className="flex items-center">
              <span className="text-gray-600 text-sm font-medium">[뉴스]</span>
              <span className="text-gray-800 text-sm ml-2">대학 입시 제도 대폭 개편... 수시 폐지 검토</span>
            </div>
          </div>

          {/* 메인 콘텐츠 - 자유게시판 + 갤러리 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 자유게시판 */}
            <div className="bg-white rounded-lg shadow-sm border-2" style={{ borderColor: '#F5F5DC' }}>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-gray-700 transition-colors px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
                      자유게시판
                    </h2>
                    <button 
                      onClick={() => console.log('코인 버튼 클릭')}
                      className="px-3 py-1 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      코인
                    </button>
                    <button 
                      onClick={() => console.log('증시 버튼 클릭')}
                      className="px-3 py-1 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      증시
                    </button>
                  </div>
                  <Link 
                    to="/posts" 
                    className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
                  >
                    더보기
                  </Link>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {newsData.map((item, index) => (
                    <div key={item.id} className="text-left">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-gray-400 text-xs">뉴스</span>
                        <span className="text-gray-900 text-sm">{item.title}</span>
                        {index < 3 && (
                          <span className="bg-red-500 text-white text-xs px-1 rounded">N</span>
                        )}
                      </div>
                      <div className="text-gray-400 text-xs">{item.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 갤러리 */}
            <div className="bg-white rounded-lg shadow-sm border-2" style={{ borderColor: '#F5F5DC' }}>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-900 text-center flex-1">갤러리</h2>
                  <Link 
                    to="/gallery" 
                    className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
                  >
                    더보기
                  </Link>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-3 gap-4">
                  {galleryData.map((item) => (
                    <div key={item.id} className="text-center">
                      <div className="w-full aspect-square bg-gray-200 rounded-lg mb-2 overflow-hidden shadow-sm">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="text-xs text-gray-600 truncate px-1 text-center">{item.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 