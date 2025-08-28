import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    position: 'main-top',
    order: 1,
    width: 1200,
    height: 300,
    startDate: '',
    endDate: '',
    targetUsers: 'all',
    newWindow: false,
    isActive: true
  });

  useEffect(() => {
    // 목업 데이터
    setBanners([
      {
        id: 1,
        title: '신규 회원 이벤트',
        description: '신규 가입자를 위한 특별 혜택',
        imageUrl: '/images/banner1.jpg',
        linkUrl: '/events/new-member',
        position: 'main-top',
        order: 1,
        width: 1200,
        height: 300,
        startDate: '2024-01-20',
        endDate: '2024-01-31',
        targetUsers: 'all',
        newWindow: false,
        isActive: true,
        views: 15420,
        clicks: 892,
        createdAt: '2024-01-20 09:00:00'
      },
      {
        id: 2,
        title: 'VIP 전용 혜택',
        description: 'VIP 회원만을 위한 특별 혜택',
        imageUrl: '/images/banner2.jpg',
        linkUrl: '/events/vip-special',
        position: 'main-middle',
        order: 1,
        width: 1200,
        height: 250,
        startDate: '2024-01-15',
        endDate: '2024-02-15',
        targetUsers: 'vip',
        newWindow: true,
        isActive: true,
        views: 8750,
        clicks: 445,
        createdAt: '2024-01-15 10:30:00'
      },
      {
        id: 3,
        title: '포인트 적립 이벤트',
        description: '포인트 2배 적립 이벤트',
        imageUrl: '/images/banner3.jpg',
        linkUrl: '/events/point-double',
        position: 'sidebar',
        order: 2,
        width: 300,
        height: 400,
        startDate: '2024-01-18',
        endDate: '2024-01-28',
        targetUsers: 'all',
        newWindow: false,
        isActive: false,
        views: 5230,
        clicks: 156,
        createdAt: '2024-01-18 14:15:00'
      }
    ]);
  }, []);

  const positions = {
    'main-top': '메인 상단',
    'main-middle': '메인 중단',
    'main-bottom': '메인 하단',
    'sidebar': '사이드바',
    'footer': '푸터',
    'popup': '팝업형'
  };

  const targetUserOptions = {
    'all': '전체 회원',
    'new': '신규 회원',
    'vip': 'VIP 회원',
    'gold': 'GOLD 회원',
    'silver': 'SILVER 회원',
    'bronze': 'BRONZE 회원'
  };

  const PositionBadge = ({ position }) => {
    const positionColors = {
      'main-top': 'bg-red-100 text-red-800',
      'main-middle': 'bg-blue-100 text-blue-800',
      'main-bottom': 'bg-green-100 text-green-800',
      'sidebar': 'bg-purple-100 text-purple-800',
      'footer': 'bg-gray-100 text-gray-800',
      'popup': 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${positionColors[position]}`}>
        {positions[position]}
      </span>
    );
  };

  const StatusBadge = ({ isActive }) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {isActive ? '활성' : '비활성'}
      </span>
    );
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.imageUrl.trim()) {
      alert('제목과 이미지 URL을 입력하세요.');
      return;
    }

    if (editingBanner) {
      setBanners(prev => prev.map(banner => 
        banner.id === editingBanner.id 
          ? { ...banner, ...formData, updatedAt: new Date().toISOString() }
          : banner
      ));
      setEditingBanner(null);
    } else {
      const newBanner = {
        ...formData,
        id: Date.now(),
        views: 0,
        clicks: 0,
        createdAt: new Date().toISOString()
      };
      setBanners(prev => [newBanner, ...prev]);
    }

    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      position: 'main-top',
      order: 1,
      width: 1200,
      height: 300,
      startDate: '',
      endDate: '',
      targetUsers: 'all',
      newWindow: false,
      isActive: true
    });
    setShowForm(false);
  };

  const handleEdit = (banner) => {
    setFormData({ ...banner });
    setEditingBanner(banner);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setBanners(prev => prev.filter(banner => banner.id !== id));
    }
  };

  const moveOrder = (id, direction) => {
    setBanners(prev => {
      const banner = prev.find(b => b.id === id);
      const samePositionBanners = prev.filter(b => b.position === banner.position && b.id !== id);
      const newOrder = direction === 'up' ? banner.order - 1 : banner.order + 1;
      
      const targetBanner = samePositionBanners.find(b => b.order === newOrder);
      
      if (targetBanner) {
        return prev.map(b => {
          if (b.id === id) return { ...b, order: newOrder };
          if (b.id === targetBanner.id) return { ...b, order: banner.order };
          return b;
        });
      }
      return prev;
    });
  };

  const toggleActive = (id) => {
    setBanners(prev => prev.map(banner => 
      banner.id === id 
        ? { ...banner, isActive: !banner.isActive }
        : banner
    ));
  };

  const filteredBanners = banners.filter(banner => {
    const matchesSearch = banner.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = positionFilter === 'all' || banner.position === positionFilter;
    return matchesSearch && matchesPosition;
  }).sort((a, b) => {
    if (a.position === b.position) {
      return a.order - b.order;
    }
    return a.position.localeCompare(b.position);
  });

  const getStats = () => {
    return {
      total: banners.length,
      active: banners.filter(b => b.isActive).length,
      totalViews: banners.reduce((sum, b) => sum + b.views, 0),
      totalClicks: banners.reduce((sum, b) => sum + b.clicks, 0)
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">배너 관리</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingBanner(null);
            setFormData({
              title: '',
              description: '',
              imageUrl: '',
              linkUrl: '',
              position: 'main-top',
              order: 1,
              width: 1200,
              height: 300,
              startDate: '',
              endDate: '',
              targetUsers: 'all',
              newWindow: false,
              isActive: true
            });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          배너 추가
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <PhotoIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">전체 배너</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <PhotoIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">활성 배너</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <EyeIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">총 조회수</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalViews.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <LinkIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">총 클릭수</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalClicks.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 배너 작성/수정 폼 */}
      {showForm && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {editingBanner ? '배너 수정' : '새 배너 생성'}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="배너 제목을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="배너 설명을 입력하세요"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이미지 URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/banner-image.jpg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">링크 URL</label>
                <input
                  type="url"
                  name="linkUrl"
                  value={formData.linkUrl}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="클릭 시 이동할 URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">위치</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="main-top">메인 상단</option>
                  <option value="main-middle">메인 중단</option>
                  <option value="main-bottom">메인 하단</option>
                  <option value="sidebar">사이드바</option>
                  <option value="footer">푸터</option>
                  <option value="popup">팝업형</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">순서</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">너비 (px)</label>
                <input
                  type="number"
                  name="width"
                  value={formData.width}
                  onChange={handleInputChange}
                  min="100"
                  max="1920"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">높이 (px)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  min="50"
                  max="800"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">시작일</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">종료일</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">대상 회원</label>
                <select
                  name="targetUsers"
                  value={formData.targetUsers}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">전체 회원</option>
                  <option value="new">신규 회원</option>
                  <option value="vip">VIP 회원</option>
                  <option value="gold">GOLD 회원</option>
                  <option value="silver">SILVER 회원</option>
                  <option value="bronze">BRONZE 회원</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="newWindow"
                    checked={formData.newWindow}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">새 창으로 열기</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">활성화</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {editingBanner ? '수정' : '생성'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 검색 및 필터 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="배너 제목 검색"
              className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">전체 위치</option>
            <option value="main-top">메인 상단</option>
            <option value="main-middle">메인 중단</option>
            <option value="main-bottom">메인 하단</option>
            <option value="sidebar">사이드바</option>
            <option value="footer">푸터</option>
            <option value="popup">팝업형</option>
          </select>
          <div className="text-sm text-gray-500 flex items-center">
            총 {filteredBanners.length}개의 배너
          </div>
        </div>
      </div>

      {/* 배너 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">배너</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">위치/순서</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">크기</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">대상</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">기간</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">성과</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">액션</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBanners.map((banner) => (
                <tr key={banner.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="h-12 w-20 object-cover rounded border"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="48" viewBox="0 0 80 48"><rect width="80" height="48" fill="%23f3f4f6"/><text x="40" y="24" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="10" fill="%236b7280">이미지 없음</text></svg>';
                        }}
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{banner.title}</div>
                        <div className="text-sm text-gray-500">{banner.description}</div>
                        {banner.linkUrl && (
                          <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                            {banner.linkUrl}
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PositionBadge position={banner.position} />
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-500">순서: {banner.order}</span>
                      <div className="ml-2 flex space-x-1">
                        <button
                          onClick={() => moveOrder(banner.id, 'up')}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <ArrowUpIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveOrder(banner.id, 'down')}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <ArrowDownIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {banner.width} × {banner.height}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {targetUserOptions[banner.targetUsers]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{banner.startDate}</div>
                    <div>~ {banner.endDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      {banner.views.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <LinkIcon className="h-4 w-4 mr-1" />
                      {banner.clicks.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">
                      CTR: {banner.views > 0 ? ((banner.clicks / banner.views) * 100).toFixed(2) : 0}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleActive(banner.id)}
                    >
                      <StatusBadge isActive={banner.isActive} />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleEdit(banner)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(banner.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Banners;