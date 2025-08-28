import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  ArrowRightIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const PointDeposits = () => {
  const [conversions, setConversions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setConversions([
      {
        id: 1,
        userId: 'user001',
        userName: '김철수',
        cashAmount: 100000,
        pointAmount: 110000,
        exchangeRate: 1.1,
        status: 'completed',
        requestTime: '2024-01-20 14:30:22',
        processTime: '2024-01-20 14:35:10',
        transactionId: 'PD202401200001'
      },
      {
        id: 2,
        userId: 'user002',
        userName: '이영희',
        cashAmount: 50000,
        pointAmount: 55000,
        exchangeRate: 1.1,
        status: 'pending',
        requestTime: '2024-01-20 13:15:10',
        processTime: null,
        transactionId: 'PD202401200002'
      }
    ]);
  }, []);

  const getStats = () => {
    const today = new Date().toDateString();
    const todayConversions = conversions.filter(c => 
      new Date(c.requestTime).toDateString() === today
    );
    
    return {
      todayCash: todayConversions.reduce((sum, c) => sum + c.cashAmount, 0),
      todayPoints: todayConversions.reduce((sum, c) => sum + c.pointAmount, 0),
      pending: conversions.filter(c => c.status === 'pending').length,
      completed: conversions.filter(c => c.status === 'completed').length
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">포인트 입금(전환)</h1>
        <div className="text-sm text-gray-600">
          현재 환율: 1원 = 1.1포인트
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">금일 현금 입금</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.todayCash.toLocaleString()}원</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <ArrowRightIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">금일 포인트 전환</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.todayPoints.toLocaleString()}P</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">처리 대기</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">완료</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
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
              placeholder="회원명, ID 검색"
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
            <option value="pending">처리 대기</option>
            <option value="completed">완료</option>
          </select>
        </div>
      </div>

      {/* 전환 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">포인트 전환 내역</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">거래번호</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">회원정보</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">전환 내용</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">환율</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">요청시간</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">액션</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {conversions.map((conversion) => (
                <tr key={conversion.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {conversion.transactionId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{conversion.userName}</div>
                    <div className="text-sm text-gray-500">{conversion.userId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="text-sm">
                        <span className="font-medium text-blue-600">
                          {conversion.cashAmount.toLocaleString()}원
                        </span>
                      </div>
                      <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                      <div className="text-sm">
                        <span className="font-medium text-green-600">
                          {conversion.pointAmount.toLocaleString()}P
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    1:{conversion.exchangeRate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{conversion.requestTime}</div>
                    {conversion.processTime && (
                      <div className="text-xs">처리: {conversion.processTime}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      conversion.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {conversion.status === 'completed' ? '완료' : '대기'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 환율 설정 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">환율 설정</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                현재 환율 (1원 당 포인트)
              </label>
              <input
                type="number"
                step="0.1"
                defaultValue="1.1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                환율 업데이트
              </button>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">환율 변경 시 주의사항</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 환율 변경은 새로운 전환 요청부터 적용됩니다.</li>
              <li>• 이미 처리 중인 요청은 기존 환율이 적용됩니다.</li>
              <li>• 환율 변경 내역은 자동으로 로그에 기록됩니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointDeposits;