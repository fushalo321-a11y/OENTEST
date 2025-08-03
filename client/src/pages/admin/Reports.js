import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';
import {
  Flag,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  User,
  Calendar,
  FileText,
  MessageCircle,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

const Reports = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // 신고 목록 조회
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['adminReports', searchTerm, statusFilter, typeFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (typeFilter !== 'all') params.append('type', typeFilter);
      
      const response = await api.get(`/api/admin/reports?${params.toString()}`);
      return response.data;
    },
  });

  // 신고 상태 변경
  const updateReportStatusMutation = useMutation({
    mutationFn: async ({ reportId, status }) => {
      await api.patch(`/api/admin/reports/${reportId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminReports']);
      toast.success('신고 상태가 변경되었습니다.');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || '신고 상태 변경에 실패했습니다.');
    },
  });

  // 콘텐츠 삭제
  const deleteContentMutation = useMutation({
    mutationFn: async ({ contentType, contentId }) => {
      if (contentType === 'post') {
        await api.delete(`/api/posts/${contentId}`);
      } else {
        await api.delete(`/api/comments/${contentId}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminReports']);
      toast.success('콘텐츠가 삭제되었습니다.');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || '콘텐츠 삭제에 실패했습니다.');
    },
  });

  const handleStatusChange = (reportId, newStatus) => {
    updateReportStatusMutation.mutate({ reportId, status: newStatus });
  };

  const handleDeleteContent = (contentType, contentId) => {
    if (window.confirm('정말로 이 콘텐츠를 삭제하시겠습니까?')) {
      deleteContentMutation.mutate({ contentType, contentId });
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">신고 처리</h1>
          <p className="text-gray-600 mt-2">신고된 콘텐츠를 검토하고 처리하세요</p>
        </div>

        {/* 필터 및 검색 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="신고 내용으로 검색..."
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
              <option value="pending">대기 중</option>
              <option value="resolved">처리됨</option>
              <option value="dismissed">기각됨</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">모든 유형</option>
              <option value="post">게시물</option>
              <option value="comment">댓글</option>
            </select>
          </div>
        </div>

        {/* 신고 목록 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              신고 목록 ({reports.length}건)
            </h2>
          </div>
          
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : reports.length === 0 ? (
            <div className="p-6 text-center">
              <Flag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">신고된 콘텐츠가 없습니다.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {reports.map((report) => (
                <div key={report._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2">
                          {report.type === 'post' ? (
                            <FileText className="h-4 w-4 text-blue-600" />
                          ) : (
                            <MessageCircle className="h-4 w-4 text-purple-600" />
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {report.type === 'post' ? '게시물' : '댓글'} 신고
                          </span>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {report.status === 'pending' ? '대기 중' :
                           report.status === 'resolved' ? '처리됨' : '기각됨'}
                        </span>
                      </div>

                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          신고 사유: {report.reason}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {report.description}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {report.reportedContent.author.username}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(report.reportedContent.createdAt), { addSuffix: true, locale: ko })}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700">
                          {report.type === 'post' ? (
                            <div>
                              <div className="font-medium mb-1">{report.reportedContent.title}</div>
                              <div className="text-gray-600 line-clamp-3">
                                {report.reportedContent.content}
                              </div>
                        </div>
                          ) : (
                            <div className="text-gray-600">
                              {report.reportedContent.content}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          신고자: {report.reporter.username}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true, locale: ko })}
                        </div>
                      </div>
                    </div>

                    <div className="ml-6 flex flex-col space-y-2">
                      {report.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(report._id, 'resolved')}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            승인
                          </button>
                          <button
                            onClick={() => handleStatusChange(report._id, 'dismissed')}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            기각
                          </button>
                          <button
                            onClick={() => handleDeleteContent(report.type, report.reportedContent._id)}
                            className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                          >
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            삭제
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => window.open(`/${report.type}/${report.reportedContent._id}`, '_blank')}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        보기
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports; 