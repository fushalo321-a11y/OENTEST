import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  LogOut,
  Settings,
  Shield,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  const newPassword = watch('newPassword');

  // 프로필 업데이트
  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.put('/api/users/profile', data);
      return response.data;
    },
    onSuccess: (data) => {
      updateProfile(data);
      toast.success('프로필이 업데이트되었습니다!');
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || '프로필 업데이트에 실패했습니다.');
    },
  });

  // 비밀번호 변경
  const changePasswordMutation = useMutation({
    mutationFn: async (data) => {
      await api.put('/api/users/change-password', data);
    },
    onSuccess: () => {
      toast.success('비밀번호가 변경되었습니다!');
      setValue('currentPassword', '');
      setValue('newPassword', '');
      setValue('confirmPassword', '');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || '비밀번호 변경에 실패했습니다.');
    },
  });

  // 계정 비활성화
  const deactivateAccountMutation = useMutation({
    mutationFn: async () => {
      await api.delete('/api/users/deactivate');
    },
    onSuccess: () => {
      toast.success('계정이 비활성화되었습니다.');
      logout();
      navigate('/');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || '계정 비활성화에 실패했습니다.');
    },
  });

  const onSubmitProfile = async (data) => {
    setIsLoading(true);
    try {
      await updateProfileMutation.mutateAsync(data);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitPassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);
    try {
      await changePasswordMutation.mutateAsync(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivateAccount = () => {
    if (window.confirm('정말로 계정을 비활성화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      deactivateAccountMutation.mutate();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('로그아웃되었습니다.');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">로그인이 필요합니다</h2>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">프로필 설정</h1>
          <p className="text-gray-600 mt-2">계정 정보를 관리하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 프로필 정보 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2" />
                기본 정보
              </h2>
            </div>
            <form onSubmit={handleSubmit(onSubmitProfile)} className="p-6 space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  사용자명
                </label>
                <input
                  id="username"
                  type="text"
                  defaultValue={user.username}
                  className={`w-full px-3 py-2 border ${
                    errors.username ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  {...register('username', {
                    required: '사용자명은 필수입니다.',
                    minLength: {
                      value: 2,
                      message: '사용자명은 최소 2자 이상이어야 합니다.',
                    },
                    maxLength: {
                      value: 20,
                      message: '사용자명은 최대 20자까지 가능합니다.',
                    },
                  })}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <input
                  id="email"
                  type="email"
                  defaultValue={user.email}
                  className={`w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  {...register('email', {
                    required: '이메일은 필수입니다.',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: '유효한 이메일 주소를 입력해주세요.',
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      저장 중...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      프로필 저장
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* 비밀번호 변경 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                비밀번호 변경
              </h2>
            </div>
            <form onSubmit={handleSubmit(onSubmitPassword)} className="p-6 space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  현재 비밀번호
                </label>
                <div className="relative">
                  <input
                    id="currentPassword"
                    type={showPassword ? 'text' : 'password'}
                    className={`w-full px-3 py-2 pr-10 border ${
                      errors.currentPassword ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    {...register('currentPassword', {
                      required: '현재 비밀번호는 필수입니다.',
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  새 비밀번호
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    className={`w-full px-3 py-2 pr-10 border ${
                      errors.newPassword ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    {...register('newPassword', {
                      required: '새 비밀번호는 필수입니다.',
                      minLength: {
                        value: 8,
                        message: '비밀번호는 최소 8자 이상이어야 합니다.',
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                        message: '비밀번호는 영문 대소문자, 숫자, 특수문자를 포함해야 합니다.',
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  새 비밀번호 확인
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`w-full px-3 py-2 pr-10 border ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    {...register('confirmPassword', {
                      required: '비밀번호 확인은 필수입니다.',
                      validate: (value) =>
                        value === newPassword || '비밀번호가 일치하지 않습니다.',
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      변경 중...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      비밀번호 변경
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 계정 관리 */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              계정 관리
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">계정 상태</h3>
                <p className="text-sm text-gray-500">
                  현재 계정은 {user.isActive ? '활성' : '비활성'} 상태입니다.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? '활성' : '비활성'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">역할</h3>
                <p className="text-sm text-gray-500">
                  현재 역할: {user.role === 'admin' ? '관리자' : '일반 사용자'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role === 'admin' ? '관리자' : '사용자'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                로그아웃
              </button>
              <button
                onClick={handleDeactivateAccount}
                className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
              >
                <Shield className="h-4 w-4 mr-2" />
                계정 비활성화
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 