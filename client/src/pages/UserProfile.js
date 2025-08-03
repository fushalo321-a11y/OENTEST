import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  User,
  Calendar,
  MessageCircle,
  ThumbsUp,
  Eye,
  Clock,
  Calendar as CalendarIcon,
  MessageSquare,
  Heart,
  Flag,
  MoreHorizontal,
  Bookmark,
  Share,
  Mail,
  FileText,
  Hash,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { api } from '../utils/api';

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');

  // 사용자 정보 조회
  const { data: profileUser, isLoading, error } = useQuery({
    queryKey: ['user', username],
    queryFn: async () => {
      const response = await api.get(`/api/users/${username}`);
      return response.data;
    },
  });

  // 사용자 게시물 조회
  const { data: posts = [] } = useQuery({
    queryKey: ['userPosts', username],
    queryFn: async () => {
      const response = await api.get(`/api/users/${username}/posts`);
      return response.data;
    },
    enabled: !!profileUser && activeTab === 'posts',
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">사용자를 찾을 수 없습니다</h2>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로가기
          </button>
        </div>
      </div>
    );
  }

  if (!profileUser) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로가기
          </button>
        </div>

        {/* 프로필 카드 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center space-x-6">
              {/* 프로필 이미지 */}
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-indigo-600" />
              </div>

              {/* 프로필 정보 */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{profileUser.username}</h1>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    profileUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {profileUser.isActive ? '활성' : '비활성'}
                  </span>
                  {profileUser.role === 'admin' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      관리자
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {profileUser.email}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDistanceToNow(new Date(profileUser.createdAt), { addSuffix: true, locale: ko })} 가입
                  </div>
                </div>

                {/* 통계 */}
                <div className="flex items-center space-x-6 mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="h-4 w-4 mr-1" />
                    게시물 {profileUser.postCount || 0}개
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    댓글 {profileUser.commentCount || 0}개
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    받은 좋아요 {profileUser.totalLikes || 0}개
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('posts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'posts'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                게시물
              </button>
            </nav>
          </div>

          {/* 탭 콘텐츠 */}
          <div className="p-6">
            {activeTab === 'posts' && (
              <div className="space-y-4">
                {posts.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">게시물이 없습니다</h3>
                    <p className="text-gray-500">아직 작성한 게시물이 없습니다.</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <div key={post._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Link
                            to={`/post/${post._id}`}
                            className="text-lg font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                          >
                            {post.title}
                          </Link>
                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko })}
                            </div>
                            <div className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              조회수 {post.viewCount || 0}
                            </div>
                            <div className="flex items-center">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              좋아요 {post.likes || 0}
                            </div>
                            <div className="flex items-center">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              댓글 {post.commentCount || 0}
                            </div>
                          </div>
                          {post.category && (
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {post.category}
                              </span>
                            </div>
                          )}
                          {post.tags && post.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {post.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  <Hash className="h-3 w-3 mr-1" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {post.isPinned && (
                          <div className="ml-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              고정
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 