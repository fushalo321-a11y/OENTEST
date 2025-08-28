import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MegaphoneIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const SystemNotices = () => {
  const [notices, setNotices] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'info',
    priority: 'normal',
    startDate: '',
    endDate: '',
    isActive: true,
    showOnLogin: false,
    targetUsers: 'all'
  });

  useEffect(() => {
    // 목업 데이터
    setNotices([
      {
        id: 1,
        title: '시스템 점검 안내',
        content: '2024년 1월 25일 새벽 2시부터 6시까지 시스템 점검이 진행됩니다.',
        type: 'warning',
        priority: 'high',
        startDate: '2024-01-20',
        endDate: '2024-01-25',
        isActive: true,
        showOnLogin: true,
        targetUsers: 'all',
        views: 1250,
        createdAt: '2024-01-20 09:00:00',
        updatedAt: '2024-01-20 09:00:00'
      },
      {
        id: 2,
        title: '신규 이벤트 출시',
        content: '새로운 포인트 적립 이벤트가 시작되었습니다. 많은 참여 부탁드립니다.',
        type: 'info',
        priority: 'normal',
        startDate: '2024-01-20',
        endDate: '2024-01-31',
        isActive: true,
        showOnLogin: false,
        targetUsers: 'all',
        views: 890,
        createdAt: '2024-01-20 10:30:00',
        updatedAt: '2024-01-20 10:30:00'
      },
      {
        id: 3,
        title: '보안 정책 업데이트',
        content: '회원 보안 강화를 위해 비밀번호 정책이 변경되었습니다.',
        type: 'error',
        priority: 'high',
        startDate: '2024-01-19',
        endDate: '2024-01-30',
        isActive: true,
        showOnLogin: true,
        targetUsers: 'all',
        views: 2100,
        createdAt: '2024-01-19 14:15:00',
        updatedAt: '2024-01-19 14:15:00'
      }
    ]);
  }, []);

  const noticeTypes = {
    info: { name: '일반', icon: InformationCircleIcon, color: 'blue' },
    warning: { name: '경고', icon: ExclamationTriangleIcon, color: 'yellow' },
    error: { name: '중요', icon: ExclamationTriangleIcon, color: 'red' },
    success: { name: '성공', icon: CheckCircleIcon, color: 'green' }
  };

  const TypeBadge = ({ type }) => {
    const config = noticeTypes[type];
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.name}
      </span>
    );
  };

  const PriorityBadge = ({ priority }) => {
    const priorityConfig = {
      low: { color: 'bg-gray-100 text-gray-800', text: '낮음' },
      normal: { color: 'bg-blue-100 text-blue-800', text: '보통' },
      high: { color: 'bg-red-100 text-red-800', text: '높음' }
    };
    const config = priorityConfig[priority];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
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

    if (editingNotice) {
      // 수정
      setNotices(prev => prev.map(notice => 
        notice.id === editingNotice.id 
          ? { ...notice, ...formData, updatedAt: new Date().toISOString() }
          : notice
      ));
      setEditingNotice(null);
    } else {
      // 생성
      const newNotice = {
        ...formData,
        id: Date.now(),
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setNotices(prev => [newNotice, ...prev]);
    }

    // 폼 초기화
    setFormData({
      title: '',
      content: '',
      type: 'info',
      priority: 'normal',
      startDate: '',
      endDate: '',
      isActive: true,
      showOnLogin: false,
      targetUsers: 'all'
    });
    setShowCreateForm(false);
  };

  const handleEdit = (notice) => {
    setFormData({ ...notice });
    setEditingNotice(notice);
    setShowCreateForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setNotices(prev => prev.filter(notice => notice.id !== id));
    }
  };

  const toggleActive = (id) => {
    setNotices(prev => prev.map(notice => 
      notice.id === id 
        ? { ...notice, isActive: !notice.isActive }
        : notice
    ));
  };

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || notice.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getStats = () => {
    return {
      total: notices.length,
      active: notices.filter(n => n.isActive).length,
      high: notices.filter(n => n.priority === 'high').length,
      loginNotices: notices.filter(n => n.showOnLogin).length
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">시스템 공지사항</h1>
        <button
          onClick={() => {
            setShowCreateForm(true);
            setEditingNotice(null);
            setFormData({
              title: '',
              content: '',
              type: 'info',
              priority: 'normal',
              startDate: '',
              endDate: '',
              isActive: true,
              showOnLogin: false,
              targetUsers: 'all'
            });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          공지사항 추가
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <MegaphoneIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">전체 공지</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">활성화</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">높은 우선순위</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.high}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <InformationCircleIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">로그인 시 표시</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.loginNotices}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 공지사항 작성/수정 폼 */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {editingNotice ? '공지사항 수정' : '새 공지사항 작성'}
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
                  placeholder="공지사항 제목을 입력하세요"
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
                  <option value="info">일반</option>
                  <option value="warning">경고</option>
                  <option value="error">중요</option>
                  <option value="success">성공</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">우선순위</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">낮음</option>
                  <option value="normal">보통</option>
                  <option value="high">높음</option>
                </select>
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
                  rows="5"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="공지사항 내용을 입력하세요"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
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
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="showOnLogin"
                    checked={formData.showOnLogin}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">로그인 시 표시</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {editingNotice ? '수정' : '등록'}
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
              placeholder="제목, 내용 검색"
              className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">전체 유형</option>
            <option value="info">일반</option>
            <option value="warning">경고</option>
            <option value="error">중요</option>
            <option value="success">성공</option>
          </select>
          <div className="text-sm text-gray-500 flex items-center">
            총 {filteredNotices.length}개의 공지사항
          </div>
        </div>
      </div>

      {/* 공지사항 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">유형</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">우선순위</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">기간</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">조회수</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">액션</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredNotices.map((notice) => (
                <tr key={notice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{notice.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{notice.content}</div>
                    {notice.showOnLogin && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                        로그인 표시
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <TypeBadge type={notice.type} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PriorityBadge priority={notice.priority} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{notice.startDate}</div>
                    <div>~ {notice.endDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {notice.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleActive(notice.id)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        notice.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {notice.isActive ? '활성' : '비활성'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleEdit(notice)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(notice.id)}
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

export default SystemNotices;