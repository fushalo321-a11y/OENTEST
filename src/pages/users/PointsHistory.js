import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  FunnelIcon,
  EyeIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

const PointsHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('7days');
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(15);

  useEffect(() => {
    // 목업 데이터
    const mockTransactions = [
      {
        id: 1,
        userId: 'user001',
        userName: '김철수',
        type: 'earn',
        amount: 5000,
        reason: '출석 이벤트 보상',
        adminName: 'system',
        timestamp: '2024-01-20 14:30:22',
        beforeBalance: 145000,
        afterBalance: 150000
      },
      {
        id: 2,
        userId: 'user002',
        userName: '이영희',
        type: 'deduct',
        amount: -2000,
        reason: '부정 행위 패널티',
        adminName: 'admin01',
        timestamp: '2024-01-20 13:15:10',
        beforeBalance: 77000,
        afterBalance: 75000
      },
      {
        id: 3,
        userId: 'user003',
        userName: '박민수',
        type: 'earn',
        amount: 10000,
        reason: '이벤트 참여 보상',
        adminName: 'admin02',
        timestamp: '2024-01-20 12:45:33',
        beforeBalance: 15000,
        afterBalance: 25000
      },
      {
        id: 4,
        userId: 'user001',
        userName: '김철수',
        type: 'deduct',
        amount: -50000,
        reason: '현금 전환',
        adminName: 'system',
        timestamp: '2024-01-20 11:20:15',
        beforeBalance: 195000,
        afterBalance: 145000
      },
      {
        id: 5,
        userId: 'user004',
        userName: '정수진',
        type: 'earn',
        amount: 25000,
        reason: '신규 가입 보너스',
        adminName: 'system',
        timestamp: '2024-01-20 10:30:44',
        beforeBalance: 0,
        afterBalance: 25000
      },
      {
        id: 6,
        userId: 'user005',
        userName: '최민호',
        type: 'earn',
        amount: 15000,
        reason: '추천인 보상',
        adminName: 'admin01',
        timestamp: '2024-01-19 16:22:18',
        beforeBalance: 35000,
        afterBalance: 50000
      },
      {
        id: 7,
        userId: 'user002',
        userName: '이영희',
        type: 'deduct',
        amount: -8000,
        reason: '쿠폰 사용',
        adminName: 'system',
        timestamp: '2024-01-19 15:45:30',
        beforeBalance: 85000,
        afterBalance: 77000
      },
      {
        id: 8,
        userId: 'user006',
        userName: '윤상혁',
        type: 'earn',
        amount: 7500,
        reason: '게임 이벤트 보상',
        adminName: 'admin02',
        timestamp: '2024-01-19 14:12:55',
        beforeBalance: 12500,
        afterBalance: 20000
      }
    ];
    setTransactions(mockTransactions);
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || transaction.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  const getTotalStats = () => {
    const earned = transactions
      .filter(t => t.type === 'earn')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const deducted = transactions
      .filter(t => t.type === 'deduct')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return { earned, deducted, net: earned - deducted };
  };

  const stats = getTotalStats();

  const exportToCSV = () => {
    const headers = ['날짜시간', '회원ID', '회원명', '구분', '금액', '사유', '처리자', '이전잔액', '이후잔액'];
    const csvData = filteredTransactions.map(t => [
      t.timestamp,
      t.userId,
      t.userName,
      t.type === 'earn' ? '지급' : '차감',
      t.amount.toLocaleString(),
      t.reason,
      t.adminName,
      t.beforeBalance.toLocaleString(),
      t.afterBalance.toLocaleString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `포인트내역_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">포인트 내역</h1>
        <button
          onClick={exportToCSV}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
        >
          <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
          CSV 다운로드
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <ArrowUpIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">총 지급</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.earned.toLocaleString()}P</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-100">
              <ArrowDownIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">총 차감</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.deducted.toLocaleString()}P</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">순 증감</h3>
              <p className={`text-2xl font-semibold ${stats.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.net >= 0 ? '+' : ''}{stats.net.toLocaleString()}P
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="회원명, ID, 사유 검색"
              className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <FunnelIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <select
              className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">전체 유형</option>
              <option value="earn">지급</option>
              <option value="deduct">차감</option>
            </select>
          </div>
          <div className="relative">
            <CalendarIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <select
              className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
            >
              <option value="7days">최근 7일</option>
              <option value="30days">최근 30일</option>
              <option value="3months">최근 3개월</option>
              <option value="1year">최근 1년</option>
            </select>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            총 {filteredTransactions.length}건의 내역
          </div>
        </div>
      </div>

      {/* 포인트 내역 테이블 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">포인트 거래 내역</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  날짜시간
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  회원정보
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  구분
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  금액
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  사유
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  처리자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  잔액변화
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{transaction.userName}</div>
                      <div className="text-sm text-gray-500">{transaction.userId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.type === 'earn' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'earn' ? (
                        <>
                          <ArrowUpIcon className="h-3 w-3 mr-1" />
                          지급
                        </>
                      ) : (
                        <>
                          <ArrowDownIcon className="h-3 w-3 mr-1" />
                          차감
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      transaction.type === 'earn' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'earn' ? '+' : ''}{transaction.amount.toLocaleString()}P
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.adminName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="text-xs text-gray-500">
                        이전: {transaction.beforeBalance.toLocaleString()}P
                      </div>
                      <div className="text-xs text-gray-900">
                        이후: {transaction.afterBalance.toLocaleString()}P
                      </div>
                    </div>
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

        {/* 페이지네이션 */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              이전
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              다음
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                총 <span className="font-medium">{filteredTransactions.length}</span>건 중{' '}
                <span className="font-medium">{indexOfFirstTransaction + 1}</span>-
                <span className="font-medium">{Math.min(indexOfLastTransaction, filteredTransactions.length)}</span>건 표시
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsHistory;