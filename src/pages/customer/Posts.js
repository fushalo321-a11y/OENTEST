import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

const CustomerPosts = () => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setPosts([
      {
        id: 1,
        title: '포인트 적립이 안되요',
        content: '어제부터 포인트가 적립되지 않고 있습니다. 확인 부탁드려요.',
        author: '김철수',
        authorId: 'user001',
        category: '포인트 문의',
        status: 'pending',
        priority: 'normal',
        createdAt: '2024-01-20 14:30:22',
        views: 0,
        replies: 0,
        lastReply: null
      },
      {
        id: 2,
        title: '회원등급 변경 문의',
        content: 'VIP 등급 조건을 만족했는데 등급이 변경되지 않았습니다.',
        author: '이영희',
        authorId: 'user002',
        category: '회원 문의',
        status: 'answered',
        priority: 'high',
        createdAt: '2024-01-20 13:15:10',
        views: 5,
        replies: 2,
        lastReply: '2024-01-20 15:30:00'
      },
      {
        id: 3,
        title: '출금 지연 문의',
        content: '3일 전에 출금 신청했는데 아직 처리되지 않았습니다.',
        author: '박민수',
        authorId: 'user003',
        category: '입출금 문의',
        status: 'closed',
        priority: 'high',
        createdAt: '2024-01-19 10:22:33',
        views: 12,
        replies: 4,
        lastReply: '2024-01-20 09:15:00'
      }
    ]);
  }, []);

  const handleStatusChange = (postId, newStatus) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, status: newStatus } : post
    ));
  };

  const handleDelete = (postId) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setPosts(posts.filter(post => post.id !== postId));
    }
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: '답변대기', icon: ClockIcon },
      answered: { color: 'bg-blue-100 text-blue-800', text: '답변완료', icon: ChatBubbleLeftIcon },
      closed: { color: 'bg-gray-100 text-gray-800', text: '종료', icon: CheckCircleIcon }
    };
    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const PriorityBadge = ({ priority }) => {
    const priorityConfig = {
      high: { color: 'bg-red-100 text-red-800', text: '긴급' },
      normal: { color: 'bg-green-100 text-green-800', text: '보통' },
      low: { color: 'bg-gray-100 text-gray-800', text: '낮음' }
    };
    const config = priorityConfig[priority];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || post.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStats = () => {
    return {
      total: posts.length,
      pending: posts.filter(p => p.status === 'pending').length,
      answered: posts.filter(p => p.status === 'answered').length,
      closed: posts.filter(p => p.status === 'closed').length
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">고객센터 게시글 관리</h1>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <ChatBubbleLeftIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">전체 문의</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">답변 대기</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <ChatBubbleLeftIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">답변 완료</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.answered}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-gray-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">종료</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.closed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="제목, 작성자, 내용 검색"
              className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">전체 상태</option>
            <option value="pending">답변 대기</option>
            <option value="answered">답변 완료</option>
            <option value="closed">종료</option>
          </select>
          <div className="text-sm text-gray-500 flex items-center">
            총 {filteredPosts.length}건의 문의
          </div>
        </div>
      </div>

      {/* 게시글 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">문의 목록</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작성자</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">카테고리</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">우선순위</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작성일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">조회/답글</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">액션</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{post.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{post.content}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{post.author}</div>
                    <div className="text-sm text-gray-500">{post.authorId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PriorityBadge priority={post.priority} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={post.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{post.createdAt}</div>
                    {post.lastReply && (
                      <div className="text-xs">최근답글: {post.lastReply}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        {post.views}
                      </div>
                      <div className="flex items-center">
                        <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                        {post.replies}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      {post.status === 'pending' && (
                        <button 
                          onClick={() => handleStatusChange(post.id, 'answered')}
                          className="text-green-600 hover:text-green-900"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(post.id)}
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

      {/* 빠른 답변 템플릿 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">빠른 답변 템플릿</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
              <h4 className="font-medium text-gray-900">포인트 적립 지연</h4>
              <p className="text-sm text-gray-500 mt-1">포인트 적립은 보통 24시간 이내에 처리됩니다...</p>
            </button>
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
              <h4 className="font-medium text-gray-900">출금 처리 안내</h4>
              <p className="text-sm text-gray-500 mt-1">출금 요청은 영업일 기준 1-3일 소요됩니다...</p>
            </button>
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
              <h4 className="font-medium text-gray-900">등급 변경 안내</h4>
              <p className="text-sm text-gray-500 mt-1">회원 등급은 매월 1일에 일괄 업데이트됩니다...</p>
            </button>
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
              <h4 className="font-medium text-gray-900">일반 문의 답변</h4>
              <p className="text-sm text-gray-500 mt-1">안녕하세요. 문의해 주셔서 감사합니다...</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPosts;