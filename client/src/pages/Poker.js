import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InlineLogin from '../components/InlineLogin';
import BannerPopup from '../components/BannerPopup';
import NoticeSidebar from '../components/NoticeSidebar';

const Poker = () => {
  // 팝업 상태 관리
  const [popupState, setPopupState] = useState({
    isOpen: false,
    bannerData: null
  });

  // 영상 관련 상태
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

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

  // 영상 데이터 로드 (API 연동 준비)
  useEffect(() => {
    // 실제 API 호출 시 이 부분을 수정
    const loadVideos = async () => {
      try {
        // 임시 데이터 (실제로는 API에서 가져올 데이터)
        const mockVideos = [
          {
            id: 1,
            title: "포커 기본 전략",
            description: "포커 게임의 기본적인 전략과 규칙을 배워보세요.",
            thumbnail: "https://picsum.photos/300/200?random=1",
            videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            duration: "15:30",
            views: 1250,
            uploadDate: "2024-01-15"
          },
          {
            id: 2,
            title: "포커 고급 테크닉",
            description: "포커 고수들의 고급 테크닉과 심리전을 알아보세요.",
            thumbnail: "https://picsum.photos/300/200?random=2",
            videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            duration: "22:15",
            views: 890,
            uploadDate: "2024-01-20"
          },
          {
            id: 3,
            title: "포커 토너먼트 전략",
            description: "토너먼트에서 승리하기 위한 특별한 전략을 배워보세요.",
            thumbnail: "https://picsum.photos/300/200?random=3",
            videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            duration: "18:45",
            views: 567,
            uploadDate: "2024-01-25"
          }
        ];
        
        setVideos(mockVideos);
        setLoading(false);
      } catch (error) {
        console.error('영상 로드 실패:', error);
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  // 영상 선택 핸들러
  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
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
          <span className="text-gray-900 font-medium">포커</span>
        </nav>

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
                      <h3 className="text-gray-900 text-xs font-semibold">포커 이벤트</h3>
                    </div>
                    <button className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                      <span className="text-xs">+</span>
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <div className="space-y-2">
                    {[
                      { title: "포커 토너먼트", points: "+100", date: "25.07.25" },
                      { title: "포커 챔피언십", points: "+200", date: "25.07.03" },
                      { title: "포커 리그", points: "+150", date: "25.06.23" },
                      { title: "포커 배틀", points: "+80", date: "25.06.08" },
                      { title: "포커 챌린지", points: "+120", date: "25.06.08" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors" onClick={() => window.location.href = '/event'}>
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
            {/* 선택된 영상 플레이어 */}
            {selectedVideo && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="mb-4">
                  <button 
                    onClick={() => setSelectedVideo(null)}
                    className="text-gray-500 hover:text-gray-700 mb-2"
                  >
                    ← 목록으로 돌아가기
                  </button>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedVideo.title}</h2>
                  <p className="text-gray-600 mt-1">{selectedVideo.description}</p>
                </div>
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                  <video 
                    controls 
                    className="w-full h-full rounded-lg"
                    poster={selectedVideo.thumbnail}
                  >
                    <source src={selectedVideo.videoUrl} type="video/mp4" />
                    브라우저가 비디오를 지원하지 않습니다.
                  </video>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>조회수: {selectedVideo.views.toLocaleString()}</span>
                  <span>업로드: {selectedVideo.uploadDate}</span>
                  <span>재생시간: {selectedVideo.duration}</span>
                </div>
              </div>
            )}

            {/* 영상 목록 */}
            {!selectedVideo && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">포커 영상 가이드</h2>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">영상을 불러오는 중...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video) => (
                      <div 
                        key={video.id} 
                        className="bg-gray-50 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleVideoSelect(video)}
                      >
                        <div className="relative">
                          <img 
                            src={video.thumbnail} 
                            alt={video.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                            {video.duration}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>조회수 {video.views.toLocaleString()}</span>
                            <span>{video.uploadDate}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 포커 정보 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">포커 게임 정보</h2>
              <p className="text-gray-600 mb-4">
                포커는 전략과 심리전이 중요한 카드 게임입니다. 
                기본 규칙부터 고급 전략까지 다양한 영상을 통해 포커 실력을 향상시켜보세요.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">포커 기본 규칙</h4>
                  <p className="text-sm text-gray-600">텍사스 홀덤, 오마하 등 다양한 포커 게임의 기본 규칙을 배워보세요.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">포커 전략</h4>
                  <p className="text-sm text-gray-600">베팅 전략, 블러프, 포지션 플레이 등 고급 전략을 익혀보세요.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Poker; 