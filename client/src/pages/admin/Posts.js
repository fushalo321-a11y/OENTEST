import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';
import {
  FileText,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Pin,
  Lock,
  Eye,
  Edit,
  Trash2,
  User,
  Calendar,
  MessageCircle,
  ThumbsUp,
  Eye as EyeIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

const Posts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // 게시물 목록 조회
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['adminPosts', searchTerm, statusFilter, categoryFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      
      const response = await api.get(`/api/admin/posts?${params.toString()}`);
      return response.data;
    },
  });

  // 게시물 상태 변경
  const updatePostStatusMutation = useMutation({
    mutationFn: async ({ postId, status }) => {
      await api.patch(`/api/admin/posts/${postId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPosts'] });
      toast.success('게시물 상태가 변경되었습니다.');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || '게시물 상태 변경에 실패했습니다.');
    },
  });

  // 게시물 고정/해제
  const togglePinMutation = useMutation({
    mutationFn: async ({ postId, isPinned }) => {
      await api.patch(`/api/admin/posts/${postId}/pin`, { isPinned });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPosts'] });
      toast.success('게시물 고정 상태가 변경되었습니다.');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || '게시물 고정 상태 변경에 실패했습니다.');
    },
  });

  // 게시물 잠금/해제
  const toggleLockMutation = useMutation({
    mutationFn: async ({ postId, isLocked }) => {
      await api.patch(`/api/admin/posts/${postId}/lock`, { isLocked });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPosts'] });
      toast.success('게시물 잠금 상태가 변경되었습니다.');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || '게시물 잠금 상태 변경에 실패했습니다.');
    },
  });

  const handleStatusChange = (postId, newStatus) => {
    updatePostStatusMutation.mutate({ postId, status: newStatus });
  };

  const handlePinToggle = (postId, currentPinStatus) => {
    togglePinMutation.mutate({ postId, isPinned: !currentPinStatus });
  };

  const handleLockToggle = (postId, currentLockStatus) => {
    toggleLockMutation.mutate({ postId, isLocked: !currentLockStatus });
  };

  const categories = [
    '일반',
    '질문',
    '정보',
    '후기',
    '공지',
    '자유',
  ];

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">접근 권한이 없습니다</h2>
          <p className="text-gray-600">관리자만 접근할 수 있는 페이지입니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">게시물 관리</h1>
          <p className="text-gray-600 mt-2">커뮤니티 게시물들을 관리하세요</p>
        </div>

        {/* 필터 및 검색 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="제목 또는 내용으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">모든 상태</option>
              <option value="approved">승인됨</option>
              <option value="pending">대기 중</option>
              <option value="rejected">거부됨</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">모든 카테고리</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 게시물 목록 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              게시물 목록 ({posts.length}개)
            </h2>
          </div>
          
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="p-6 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      게시물
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작성자
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      카테고리
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작성일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      통계
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <FileText className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 line-clamp-2">
                              {post.title}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {post.content.substring(0, 100)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{post.author.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.status === 'approved' ? 'bg-green-100 text-green-800' :
                          post.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {post.status === 'approved' ? '승인됨' :
                           post.status === 'pending' ? '대기 중' : '거부됨'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {post.category && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {post.category}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <EyeIcon className="h-3 w-3 mr-1" />
                            {post.viewCount || 0}
                          </div>
                          <div className="flex items-center">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            {post.likes || 0}
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            {post.commentCount || 0}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {post.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(post._id, 'approved')}
                                className="p-1 rounded text-green-600 hover:bg-green-50"
                                title="승인"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleStatusChange(post._id, 'rejected')}
                                className="p-1 rounded text-red-600 hover:bg-red-50"
                                title="거부"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handlePinToggle(post._id, post.isPinned)}
                            className={`p-1 rounded ${
                              post.isPinned ? 'text-yellow-600 hover:bg-yellow-50' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                            title={post.isPinned ? '고정 해제' : '고정'}
                          >
                            <Pin className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleLockToggle(post._id, post.isLocked)}
                            className={`p-1 rounded ${
                              post.isLocked ? 'text-red-600 hover:bg-red-50' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                            title={post.isLocked ? '잠금 해제' : '잠금'}
                          >
                            <Lock className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Posts; 