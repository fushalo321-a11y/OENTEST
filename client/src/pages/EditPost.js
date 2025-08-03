import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import {
  ArrowLeft,
  Save,
  X,
  Hash,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  // 게시물 조회
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const response = await api.get(`/api/posts/${id}`);
      return response.data;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  const content = watch('content');

  // 게시물 수정
  const updatePostMutation = useMutation({
    mutationFn: async (data) => {
      const postData = {
        ...data,
        tags: tags,
      };
      const response = await api.put(`/api/posts/${id}`, postData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('게시물이 수정되었습니다!');
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigate(`/post/${id}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || '게시물 수정에 실패했습니다.');
    },
  });

  // 초기 데이터 설정
  useEffect(() => {
    if (post) {
      setValue('title', post.title);
      setValue('content', post.content);
      setValue('category', post.category || '');
      setTags(post.tags || []);
    }
  }, [post, setValue]);

  const onSubmit = async (data) => {
    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    if (!data.content.trim()) {
      toast.error('게시물 내용을 입력해주세요.');
      return;
    }

    updatePostMutation.mutate(data);
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const categories = [
    '일반',
    '질문',
    '정보',
    '후기',
    '공지',
    '자유',
  ];

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

  if (!post) return null;

  // 권한 확인
  if (user && user.id !== post.author._id && user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">수정 권한이 없습니다</h2>
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

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* 헤더 */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">게시물 수정</h1>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* 제목 */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                제목
              </label>
              <input
                id="title"
                type="text"
                className={`w-full px-3 py-2 border ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="게시물 제목을 입력하세요"
                {...register('title', {
                  required: '제목은 필수입니다.',
                  minLength: {
                    value: 2,
                    message: '제목은 최소 2자 이상이어야 합니다.',
                  },
                  maxLength: {
                    value: 100,
                    message: '제목은 최대 100자까지 가능합니다.',
                  },
                })}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* 카테고리 */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                카테고리
              </label>
              <select
                id="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                {...register('category')}
              >
                <option value="">카테고리 선택</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* 태그 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                태그
              </label>
              <div className="space-y-3">
                <div className="flex">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="태그를 입력하세요 (최대 5개)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag(e);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    disabled={!tagInput.trim() || tags.length >= 5}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    추가
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                      >
                        <Hash className="h-3 w-3 mr-1" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-indigo-600 hover:text-indigo-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-500">
                  태그는 최대 5개까지 추가할 수 있습니다.
                </p>
              </div>
            </div>

            {/* 내용 */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                내용
              </label>
              <div className="relative">
                <textarea
                  id="content"
                  rows="15"
                  className={`w-full px-3 py-2 border ${
                    errors.content ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="게시물 내용을 입력하세요. 마크다운을 지원합니다."
                  {...register('content', {
                    required: '내용은 필수입니다.',
                    minLength: {
                      value: 10,
                      message: '내용은 최소 10자 이상이어야 합니다.',
                    },
                  })}
                />
                <div className="absolute top-2 right-2 text-xs text-gray-400">
                  {content?.length || 0}자
                </div>
              </div>
              {errors.content && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.content.message}
                </p>
              )}
              <div className="mt-2 text-sm text-gray-500">
                <p>마크다운 문법을 사용할 수 있습니다:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li><strong>**굵게**</strong> - 굵은 글씨</li>
                  <li><em>*기울임*</em> - 기울임 글씨</li>
                  <li><code>`코드`</code> - 인라인 코드</li>
                  <li><code>```코드 블록```</code> - 코드 블록</li>
                  <li><code>[링크](URL)</code> - 링크</li>
                  <li><code>![이미지](URL)</code> - 이미지</li>
                </ul>
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={updatePostMutation.isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updatePostMutation.isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    수정 중...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    게시물 수정
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost; 