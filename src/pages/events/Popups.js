import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  PlayIcon,
  PauseIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

const Popups = () => {
  const [popups, setPopups] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPopup, setEditingPopup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'notice',
    position: 'center',
    width: 400,
    height: 300,
    showCloseButton: true,
    autoClose: false,
    autoCloseDelay: 5,
    startDate: '',
    endDate: '',
    targetUsers: 'all',
    priority: 'normal',
    isActive: true
  });

  useEffect(() => {
    // 목업 데이터
    setPopups([
      {
        id: 1,
        title: '이벤트 안내',
        content: '신규 회원 포인트 적립 이벤트가 시작되었습니다!',
        type: 'event',
        position: 'center',
        width: 500,
        height: 400,
        showCloseButton: true,
        autoClose: false,
        startDate: '2024-01-20',
        endDate: '2024-01-31',
        targetUsers: 'all',
        priority: 'high',
        isActive: true,
        views: 1250,
        clicks: 85,
        createdAt: '2024-01-20 09:00:00'
      },
      {
        id: 2,
        title: '시스템 점검 공지',
        content: '2024년 1월 25일 새벽 2시부터 6시까지 시스템 점검이 있습니다.',
        type: 'notice',
        position: 'top',
        width: 600,
        height: 200,
        showCloseButton: true,
        autoClose: true,
        autoCloseDelay: 10,
        startDate: '2024-01-20',
        endDate: '2024-01-25',
        targetUsers: 'all',
        priority: 'normal',
        isActive: true,
        views: 2100,
        clicks: 320,
        createdAt: '2024-01-19 14:00:00'
      }
    ]);
  }, []);

  const popupTypes = {
    notice: { name: '공지', color: 'blue' },
    event: { name: '이벤트', color: 'green' },
    promotion: { name: '프로모션', color: 'purple' },
    warning: { name: '경고', color: 'red' }
  };

  const positions = {
    center: '중앙',
    top: '상단',
    bottom: '하단',
    'top-left': '좌상단',
    'top-right': '우상단',
    'bottom-left': '좌하단',
    'bottom-right': '우하단'
  };

  const TypeBadge = ({ type }) => {
    const config = popupTypes[type];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        {config.name}
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
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 입력하세요.');
      return;
    }

    if (editingPopup) {
      setPopups(prev => prev.map(popup => 
        popup.id === editingPopup.id 
          ? { ...popup, ...formData, updatedAt: new Date().toISOString() }
          : popup
      ));
      setEditingPopup(null);
    } else {
      const newPopup = {
        ...formData,
        id: Date.now(),
        views: 0,
        clicks: 0,
        createdAt: new Date().toISOString()
      };
      setPopups(prev => [newPopup, ...prev]);
    }

    setFormData({
      title: '',
      content: '',
      type: 'notice',
      position: 'center',
      width: 400,
      height: 300,
      showCloseButton: true,
      autoClose: false,
      autoCloseDelay: 5,
      startDate: '',
      endDate: '',
      targetUsers: 'all',
      priority: 'normal',
      isActive: true
    });
    setShowForm(false);
  };

  const handleEdit = (popup) => {
    setFormData({ ...popup });
    setEditingPopup(popup);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setPopups(prev => prev.filter(popup => popup.id !== id));
    }
  };

  const toggleActive = (id) => {
    setPopups(prev => prev.map(popup => 
      popup.id === id 
        ? { ...popup, isActive: !popup.isActive }
        : popup
    ));
  };

  const filteredPopups = popups.filter(popup => {
    const matchesSearch = popup.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && popup.isActive) ||
                         (statusFilter === 'inactive' && !popup.isActive);
    return matchesSearch && matchesStatus;
  });

  const getStats = () => {
    return {
      total: popups.length,
      active: popups.filter(p => p.isActive).length,
      totalViews: popups.reduce((sum, p) => sum + p.views, 0),
      totalClicks: popups.reduce((sum, p) => sum + p.clicks, 0)
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">팝업 관리</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingPopup(null);
            setFormData({
              title: '',
              content: '',
              type: 'notice',
              position: 'center',
              width: 400,
              height: 300,
              showCloseButton: true,
              autoClose: false,
              autoCloseDelay: 5,
              startDate: '',
              endDate: '',
              targetUsers: 'all',
              priority: 'normal',
              isActive: true
            });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          팝업 추가
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <ComputerDesktopIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">전체 팝업</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <PlayIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">활성 팝업</p>
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
            <PhotoIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">총 클릭수</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalClicks.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 팝업 작성/수정 폼 */}
      {showForm && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {editingPopup ? '팝업 수정' : '새 팝업 생성'}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="팝업 제목을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">유형</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="notice">공지</option>
                  <option value="event">이벤트</option>
                  <option value="promotion">프로모션</option>
                  <option value="warning">경고</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">위치</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="center">중앙</option>
                  <option value="top">상단</option>
                  <option value="bottom">하단</option>
                  <option value="top-left">좌상단</option>
                  <option value="top-right">우상단</option>
                  <option value="bottom-left">좌하단</option>
                  <option value="bottom-right">우하단</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">너비 (px)</label>
                <input
                  type="number"
                  name="width"
                  value={formData.width}
                  onChange={handleInputChange}
                  min="200"
                  max="800"
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
                  min="150"
                  max="600"
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="팝업 내용을 입력하세요"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="showCloseButton"
                    checked={formData.showCloseButton}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">닫기 버튼 표시</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="autoClose"
                    checked={formData.autoClose}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">자동 닫기</span>
                </label>
                {formData.autoClose && (
                  <div className="ml-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      자동 닫기 시간 (초)
                    </label>
                    <input
                      type="number"
                      name="autoCloseDelay"
                      value={formData.autoCloseDelay}
                      onChange={handleInputChange}
                      min="1"
                      max="60"
                      className="w-32 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
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
                {editingPopup ? '수정' : '생성'}
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
              placeholder="팝업 제목 검색"
              className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">전체 상태</option>
            <option value="active">활성</option>
            <option value="inactive">비활성</option>
          </select>
          <div className="text-sm text-gray-500 flex items-center">
            총 {filteredPopups.length}개의 팝업
          </div>
        </div>
      </div>

      {/* 팝업 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">유형</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">위치/크기</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">기간</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">조회/클릭</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">액션</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPopups.map((popup) => (
                <tr key={popup.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{popup.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{popup.content}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <TypeBadge type={popup.type} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{positions[popup.position]}</div>
                    <div>{popup.width} × {popup.height}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{popup.startDate}</div>
                    <div>~ {popup.endDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      {popup.views.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <PhotoIcon className="h-4 w-4 mr-1" />
                      {popup.clicks.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleActive(popup.id)}
                      className="flex items-center"
                    >
                      <StatusBadge isActive={popup.isActive} />
                      {popup.isActive ? (
                        <PauseIcon className="h-4 w-4 ml-2 text-gray-400" />
                      ) : (
                        <PlayIcon className="h-4 w-4 ml-2 text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleEdit(popup)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(popup.id)}
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

export default Popups;