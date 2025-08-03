import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Edit,
  Trash2,
  Flag,
  ThumbsUp,
  ThumbsDown,
  User,
  Clock,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [replyTo, setReplyTo] = useState(null);

  // 게시물 조회
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const response = await api.get(`/api/posts/${id}`);
      return response.data;
    },
  });

  // 댓글 목록 조회
  const { data: comments = [] } = useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      const response = await api.get(`/api/comments/post/${id}`);
      return response.data;
    },
    enabled: !!post,
  });

  // 게시물 삭제
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/api/posts/${id}`);
    },
    onSuccess: () => {
      toast.success('게시물이 삭제되었습니다.');
      navigate('/');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || '게시물 삭제에 실패했습니다.');
    },
  });

  // 좋아요/싫어요
  const likeMutation = useMutation({
    mutationFn: async (type) => {
      await api.post(`/api/posts/${id}/${type}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
    },
  });

  // 댓글 작성
  const commentMutation = useMutation({
    mutationFn: async (data) => {
      await api.post('/api/comments', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      setCommentContent('');
      setReplyTo(null);
      setShowCommentForm(false);
      toast.success('댓글이 작성되었습니다.');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || '댓글 작성에 실패했습니다.');
    },
  });

  // 댓글 좋아요/싫어요
  const commentLikeMutation = useMutation({
    mutationFn: async ({ commentId, type }) => {
      await api.post(`/api/comments/${commentId}/${type}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
    },
  });

  const handleDelete = () => {
    if (window.confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
      deleteMutation.mutate();
    }
  };

  const handleLike = (type) => {
    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }
    likeMutation.mutate(type);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentContent.trim()) {
      toast.error('댓글 내용을 입력해주세요.');
      return;
    }

    const data = {
      content: commentContent,
      postId: id,
    };

    if (replyTo) {
      data.parentId = replyTo.id;
    }

    commentMutation.mutate(data);
  };

  const handleCommentLike = (commentId, type) => {
    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }
    commentLikeMutation.mutate({ commentId, type });
  };

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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">게시물을 찾을 수 없습니다</h2>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로가기
          </button>
        </div>

        {/* 게시물 카드 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* 게시물 헤더 */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{post.author.username}</div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko })}
                  </div>
                </div>
              </div>
              {user && (user.id === post.author._id || user.role === 'admin') && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/edit-post/${id}`)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button onClick={handleDelete} className="p-2 text-gray-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 게시물 내용 */}
          <div className="px-6 py-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
            
            {/* 카테고리 및 태그 */}
            <div className="flex items-center space-x-4 mb-6">
              {post.category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {post.category}
                </span>
              )}
              {post.tags && post.tags.length > 0 && (
                <div className="flex space-x-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 조회수 */}
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <Eye className="h-4 w-4 mr-1" />
              조회수 {post.viewCount || 0}
            </div>

            {/* 게시물 본문 */}
            <div className="prose max-w-none mb-6">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* 상호작용 버튼 */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLike('like')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                    post.userLiked ? 'text-red-600 bg-red-50' : 'text-gray-500 hover:text-red-600'
                  }`}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{post.likes || 0}</span>
                </button>
                <button
                  onClick={() => handleLike('dislike')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                    post.userDisliked ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-blue-600'
                  }`}
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span>{post.dislikes || 0}</span>
                </button>
                <button
                  onClick={() => setShowCommentForm(!showCommentForm)}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-500 hover:text-gray-700"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>댓글</span>
                </button>
              </div>
              <button className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-500 hover:text-gray-700">
                <Share2 className="h-4 w-4" />
                <span>공유</span>
              </button>
            </div>
          </div>
        </div>

        {/* 댓글 작성 폼 */}
        {showCommentForm && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleCommentSubmit}>
              <div className="mb-4">
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder={replyTo ? `${replyTo.author.username}님에게 답글 작성...` : '댓글을 작성하세요...'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows="3"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {replyTo && (
                    <button
                      type="button"
                      onClick={() => setReplyTo(null)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      답글 취소
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={commentMutation.isLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {commentMutation.isLoading ? '작성 중...' : '댓글 작성'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 댓글 목록 */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            댓글 ({comments.length})
          </h3>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">{comment.author.username}</span>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ko })}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{comment.content}</p>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleCommentLike(comment._id, 'like')}
                        className={`flex items-center space-x-1 text-sm ${
                          comment.userLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                        }`}
                      >
                        <ThumbsUp className="h-3 w-3" />
                        <span>{comment.likes || 0}</span>
                      </button>
                      <button
                        onClick={() => handleCommentLike(comment._id, 'dislike')}
                        className={`flex items-center space-x-1 text-sm ${
                          comment.userDisliked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                        }`}
                      >
                        <ThumbsDown className="h-3 w-3" />
                        <span>{comment.dislikes || 0}</span>
                      </button>
                      <button
                        onClick={() => setReplyTo(comment)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        답글
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail; 