import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Gift,
  ShoppingCart,
  Star,
  Search,
  Filter,
  Heart,
  Eye,
  CheckCircle,
  AlertCircle,
  Coffee,
  Play,
  Smartphone,
  ShoppingBag,
  Utensils
} from 'lucide-react';
import InlineLogin from '../components/InlineLogin';
import BannerPopup from '../components/BannerPopup';
import NoticeSidebar from '../components/NoticeSidebar';

const GiftcardExchange = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGiftcard, setSelectedGiftcard] = useState(null);
  const [exchangeAmount, setExchangeAmount] = useState('');
  const [showExchangeModal, setShowExchangeModal] = useState(false);

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

  // 기프트카드 데이터 (실제로는 API에서 가져와야 함)
  const giftcards = [
    {
      id: 1,
      name: '스타벅스 기프트카드',
      category: 'coffee',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=200&fit=crop&crop=center',
      exchangeRate: 0.85,
      minAmount: 5000,
      maxAmount: 100000,
      description: '스타벅스에서 사용 가능한 기프트카드입니다.',
      popularity: 95
    },
    {
      id: 2,
      name: '넷플릭스 기프트카드',
      category: 'entertainment',
      image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=200&fit=crop&crop=center',
      exchangeRate: 0.90,
      minAmount: 10000,
      maxAmount: 200000,
      description: '넷플릭스 구독료 결제에 사용 가능합니다.',
      popularity: 88
    },
    {
      id: 3,
      name: '구글플레이 기프트카드',
      category: 'digital',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop&crop=center',
      exchangeRate: 0.80,
      minAmount: 3000,
      maxAmount: 50000,
      description: '구글플레이에서 앱, 게임, 영화 등을 구매할 수 있습니다.',
      popularity: 92
    },
    {
      id: 4,
      name: '아마존 기프트카드',
      category: 'shopping',
      image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=200&fit=crop&crop=center',
      exchangeRate: 0.88,
      minAmount: 10000,
      maxAmount: 300000,
      description: '아마존에서 다양한 상품을 구매할 수 있습니다.',
      popularity: 85
    },
    {
      id: 5,
      name: '쿠팡 기프트카드',
      category: 'shopping',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop&crop=center',
      exchangeRate: 0.82,
      minAmount: 5000,
      maxAmount: 100000,
      description: '쿠팡에서 다양한 상품을 구매할 수 있습니다.',
      popularity: 90
    },
    {
      id: 6,
      name: '배달의민족 기프트카드',
      category: 'food',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop&crop=center',
      exchangeRate: 0.85,
      minAmount: 3000,
      maxAmount: 50000,
      description: '배달의민족에서 음식 배달 서비스를 이용할 수 있습니다.',
      popularity: 87
    },
    {
      id: 7,
      name: '디즈니플러스 기프트카드',
      category: 'entertainment',
      image: 'https://images.unsplash.com/photo-1489599835382-957593cb2371?w=400&h=200&fit=crop&crop=center',
      exchangeRate: 0.92,
      minAmount: 15000,
      maxAmount: 250000,
      description: '디즈니플러스에서 영화와 드라마를 시청할 수 있습니다.',
      popularity: 93
    },
    {
      id: 8,
      name: '애플 앱스토어 기프트카드',
      category: 'digital',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop&crop=center',
      exchangeRate: 0.78,
      minAmount: 5000,
      maxAmount: 100000,
      description: '애플 앱스토어에서 앱과 게임을 구매할 수 있습니다.',
      popularity: 89
    },
    {
      id: 9,
      name: '올리브영 기프트카드',
      category: 'shopping',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop&crop=center',
      exchangeRate: 0.83,
      minAmount: 3000,
      maxAmount: 50000,
      description: '올리브영에서 뷰티 제품을 구매할 수 있습니다.',
      popularity: 91
    },
    {
      id: 10,
      name: '요기요 기프트카드',
      category: 'food',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop&crop=center',
      exchangeRate: 0.87,
      minAmount: 5000,
      maxAmount: 100000,
      description: '요기요에서 음식 배달 서비스를 이용할 수 있습니다.',
      popularity: 86
    },
    {
      id: 11,
      name: '투썸플레이스 기프트카드',
      category: 'coffee',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=200&fit=crop&crop=center',
      exchangeRate: 0.84,
      minAmount: 3000,
      maxAmount: 50000,
      description: '투썸플레이스에서 커피와 디저트를 즐길 수 있습니다.',
      popularity: 88
    },
    {
      id: 12,
      name: '스팀 기프트카드',
      category: 'entertainment',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop&crop=center',
      exchangeRate: 0.79,
      minAmount: 10000,
      maxAmount: 200000,
      description: '스팀에서 게임을 구매하고 플레이할 수 있습니다.',
      popularity: 94
    }
  ];

  const categories = [
    { id: 'all', name: '전체', icon: Gift },
    { id: 'coffee', name: '커피/음료', icon: Coffee },
    { id: 'entertainment', name: '엔터테인먼트', icon: Play },
    { id: 'digital', name: '디지털', icon: Smartphone },
    { id: 'shopping', name: '쇼핑', icon: ShoppingBag },
    { id: 'food', name: '음식/배달', icon: Utensils }
  ];

  const filteredGiftcards = giftcards.filter(card => {
    const matchesCategory = selectedCategory === 'all' || card.category === selectedCategory;
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleExchange = (giftcard) => {
    setSelectedGiftcard(giftcard);
    setShowExchangeModal(true);
  };

  const confirmExchange = () => {
    // 실제 교환 로직
    alert('기프트카드 교환이 완료되었습니다!');
    setShowExchangeModal(false);
    setExchangeAmount('');
    setSelectedGiftcard(null);
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
                {/* 검색 및 필터 */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="기프트카드 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm hover:shadow-md transition-shadow"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm hover:shadow-md transition-shadow bg-white"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                {/* 카테고리 필터 */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-3">
                    {categories.map(category => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`flex items-center px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            selectedCategory === category.id
                              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg transform scale-105'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-purple-300 hover:shadow-md'
                          }`}
                        >
                          <Icon className={`h-5 w-5 mr-2 ${selectedCategory === category.id ? 'text-white' : 'text-purple-600'}`} />
                          {category.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 기프트카드 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGiftcards.map((giftcard) => (
                    <div key={giftcard.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="relative">
                        <img
                          src={giftcard.image}
                          alt={giftcard.name}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        <div className="absolute top-3 right-3">
                          <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                            <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
                            <span className="text-sm font-semibold text-gray-800">{giftcard.popularity}%</span>
                          </div>
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {(giftcard.exchangeRate * 100).toFixed(0)}% 교환
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{giftcard.name}</h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{giftcard.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">최소 금액:</span>
                            <span className="font-semibold text-gray-900">{giftcard.minAmount.toLocaleString()}원</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">최대 금액:</span>
                            <span className="font-semibold text-gray-900">{giftcard.maxAmount.toLocaleString()}원</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleExchange(giftcard)}
                          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
                        >
                          <Gift className="h-5 w-5 mr-2" />
                          교환하기
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 교환 안내 */}
                <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">교환 안내</h3>
                      <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                          <span>교환된 기프트카드는 즉시 발송됩니다.</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                          <span>교환 비율은 카드사별로 다릅니다.</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                          <span>교환 후 환불이 불가능합니다.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 교환 모달 */}
      {showExchangeModal && selectedGiftcard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">기프트카드 교환</h3>
            
            <div className="mb-4">
              <img
                src={selectedGiftcard.image}
                alt={selectedGiftcard.name}
                className="w-full h-24 object-cover rounded-lg mb-3"
              />
              <h4 className="font-medium text-gray-900">{selectedGiftcard.name}</h4>
              <p className="text-sm text-gray-600">{selectedGiftcard.description}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                교환 금액 (원)
              </label>
              <input
                type="number"
                value={exchangeAmount}
                onChange={(e) => setExchangeAmount(e.target.value)}
                placeholder="교환할 금액을 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min={selectedGiftcard.minAmount}
                max={selectedGiftcard.maxAmount}
              />
              <p className="text-xs text-gray-500 mt-1">
                최소: {selectedGiftcard.minAmount.toLocaleString()}원 ~ 최대: {selectedGiftcard.maxAmount.toLocaleString()}원
              </p>
            </div>
            
            {exchangeAmount && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">필요 포인트:</span>
                  <span className="font-medium text-purple-600">
                    {Math.ceil(exchangeAmount / selectedGiftcard.exchangeRate).toLocaleString()}P
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowExchangeModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={confirmExchange}
                disabled={!exchangeAmount || exchangeAmount < selectedGiftcard.minAmount || exchangeAmount > selectedGiftcard.maxAmount}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                교환하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftcardExchange; 