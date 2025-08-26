import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Bell,
  Search,
  Calendar,
  User,
  Eye,
  MessageSquare,
  AlertCircle,
  Info,
  CheckCircle
} from 'lucide-react';
import InlineLogin from '../components/InlineLogin';
import NoticeSidebar from '../components/NoticeSidebar';
import BannerPopup from '../components/BannerPopup';

const Notices = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 팝업 상태 관리
  const [popupState, setPopupState] = useState({
    isOpen: false,
    bannerData: null
  });

  // URL 파라미터가 있으면 해당 공지사항을 찾아서 모달로 표시
  useEffect(() => {
    if (id) {
      const notice = notices.find(n => n.id === parseInt(id));
      if (notice) {
        setSelectedNotice(notice);
        setShowModal(true);
      } else {
        // 공지사항을 찾을 수 없으면 목록으로 리다이렉트
        navigate('/notices');
      }
    }
  }, [id, navigate]);

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

  // 공지사항 데이터 (실제로는 API에서 가져와야 함)
  const notices = [
    {
      id: 1,
      title: '사이트ID가 포함된 사칭사이트 주의 안내',
      category: 'important',
      content: '최근 사이트ID가 포함된 사칭사이트가 발견되었습니다. 정확한 URL을 확인하시고 접속하시기 바랍니다.',
      author: '관리자',
      date: '2024-07-12',
      views: 1250,
      important: true
    },
    {
      id: 2,
      title: '(중요) 타업체와 동일한 사칭사이트 주의 안내',
      category: 'important',
      content: '타업체와 동일한 사칭사이트가 발견되었습니다. 정확한 사이트를 확인하시고 접속하시기 바랍니다.',
      author: '관리자',
      date: '2024-07-12',
      views: 980,
      important: true
    },
    {
      id: 3,
      title: '사칭 절대 주의 안내',
      category: 'warning',
      content: '사칭사이트에 대한 주의 안내입니다. 정확한 사이트를 확인하시고 접속하시기 바랍니다.',
      author: '관리자',
      date: '2024-05-08',
      views: 2100,
      important: true
    },
    {
      id: 4,
      title: '접속장애시 크롬 & 엣지 브라우저 사용 권장',
      category: 'info',
      content: '접속 장애가 발생할 경우 크롬 또는 엣지 브라우저를 사용하시기 바랍니다.',
      author: '관리자',
      date: '2024-02-07',
      views: 750,
      important: false
    },
    {
      id: 5,
      title: '메가게임즈 제휴 종료 안내',
      category: 'notice',
      content: '메가게임즈와의 제휴가 종료되었습니다. 이용에 참고하시기 바랍니다.',
      author: '관리자',
      date: '2024-03-30',
      views: 650,
      important: false
    },
    {
      id: 6,
      title: '시스템 점검 안내',
      category: 'maintenance',
      content: '정기 시스템 점검이 예정되어 있습니다. 점검 시간 동안 서비스 이용이 제한될 수 있습니다.',
      author: '관리자',
      date: '2024-06-15',
      views: 420,
      important: false
    },
    {
      id: 7,
      title: '신규 회원 혜택 안내',
      category: 'event',
      content: '신규 회원 가입 시 다양한 혜택을 제공합니다. 자세한 내용은 이벤트 페이지를 확인하세요.',
      author: '관리자',
      date: '2024-06-20',
      views: 380,
      important: false
    },
    {
      id: 8,
      title: '개인정보 처리방침 개정 안내',
      category: 'policy',
      content: '개인정보 처리방침이 개정되었습니다. 변경된 내용을 확인하시기 바랍니다.',
      author: '관리자',
      date: '2024-05-25',
      views: 320,
      important: false
    }
  ];

  const categories = [
    { id: 'all', name: '전체', icon: Bell },
    { id: 'important', name: '중요', icon: AlertCircle },
    { id: 'warning', name: '주의', icon: AlertCircle },
    { id: 'notice', name: '공지', icon: Info },
    { id: 'event', name: '이벤트', icon: CheckCircle },
    { id: 'maintenance', name: '점검', icon: CheckCircle },
    { id: 'policy', name: '정책', icon: Info }
  ];

  const filteredNotices = notices.filter(notice => {
    const matchesCategory = selectedCategory === 'all' || notice.category === selectedCategory;
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
    setShowModal(true);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'important': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-orange-600 bg-orange-100';
      case 'notice': return 'text-blue-600 bg-blue-100';
      case 'event': return 'text-green-600 bg-green-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      case 'policy': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryName = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.name : '기타';
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
          {/* 왼쪽 사이드바 */}
          <div className="lg:col-span-1 order-1 lg:order-1">
            <div className="lg:sticky lg:top-24 lg:pr-3 space-y-6">
              <InlineLogin />
              
              <NoticeSidebar />
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-3 order-2 lg:order-2">
            <div className="bg-white rounded-lg shadow-sm border-2" style={{ borderColor: '#F5F5DC' }}>
              <div className="p-6">
                {/* 검색 및 필터 */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="공지사항 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                {/* 카테고리 필터 */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedCategory === category.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {category.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 공지사항 목록 */}
                <div className="space-y-4">
                  {filteredNotices.map((notice) => (
                    <div
                      key={notice.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleNoticeClick(notice)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {notice.important && (
                              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                중요
                              </span>
                            )}
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(notice.category)}`}>
                              {getCategoryName(notice.category)}
                            </span>
                          </div>
                          
                          <h3 className={`text-lg font-medium text-gray-900 mb-2 ${notice.important ? 'font-semibold' : ''}`}>
                            {notice.title}
                          </h3>
                          
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {notice.content}
                          </p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                {notice.author}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {notice.date}
                              </span>
                              <span className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                조회 {notice.views}
                              </span>
                            </div>
                            <div className="flex items-center text-blue-600 hover:text-blue-700">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              자세히 보기
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 공지사항이 없을 때 */}
                {filteredNotices.length === 0 && (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">공지사항이 없습니다</h3>
                    <p className="text-gray-600">검색 조건을 변경해보세요.</p>
                  </div>
                )}

                {/* 공지사항 안내 */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Info className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <h3 className="font-medium text-blue-800">공지사항 안내</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        • 중요한 공지사항은 상단에 고정됩니다.<br/>
                        • 공지사항은 최신순으로 정렬됩니다.<br/>
                        • 문의사항이 있으시면 고객센터로 연락주세요.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 공지사항 상세 모달 */}
      {showModal && selectedNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">공지사항</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center space-x-3 mb-3">
                {selectedNotice.important && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    중요
                  </span>
                )}
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(selectedNotice.category)}`}>
                  {getCategoryName(selectedNotice.category)}
                </span>
              </div>
              
              <h4 className={`text-lg font-medium text-gray-900 mb-3 ${selectedNotice.important ? 'font-semibold' : ''}`}>
                {selectedNotice.title}
              </h4>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  {selectedNotice.author}
                </span>
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {selectedNotice.date}
                </span>
                <span className="flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  조회 {selectedNotice.views}
                </span>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedNotice.content}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notices; 