import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  BanknotesIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Withdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setWithdrawals([
      {
        id: 1,
        userId: 'user001',
        userName: '김철수',
        amount: 500000,
        method: '계좌이체',
        bankName: '국민은행',
        accountNumber: '123-456-789012',
        accountHolder: '김철수',
        status: 'pending',
        requestTime: '2024-01-20 14:30:22',
        processTime: null,
        currentBalance: 1500000,
        transactionId: 'WD202401200001',
        reason: '생활비 출금'
      },
      {
        id: 2,
        userId: 'user002',
        userName: '이영희',
        amount: 200000,
        method: '계좌이체',
        bankName: '신한은행',
        accountNumber: '987-654-321098',
        accountHolder: '이영희',
        status: 'approved',
        requestTime: '2024-01-20 13:15:10',
        processTime: '2024-01-20 13:25:05',
        currentBalance: 800000,
        transactionId: 'WD202401200002',
        reason: '급여 이체'
      },
      {
        id: 3,
        userId: 'user003',
        userName: '박민수',
        amount: 1000000,
        method: '계좌이체',
        bankName: '우리은행',
        accountNumber: '555-777-888999',
        accountHolder: '박민수',
        status: 'rejected',
        requestTime: '2024-01-20 12:45:33',
        processTime: '2024-01-20 12:50:15',
        currentBalance: 300000,
        transactionId: 'WD202401200003',
        reason: '투자금 출금',
        rejectReason: '잔액 부족'
      }
    ]);
  }, []);

  const handleApprove = (id) => {
    if (window.confirm('출금을 승인하시겠습니까?')) {
      setWithdrawals(withdrawals.map(w => 
        w.id === id 
          ? { ...w, status: 'approved', processTime: new Date().toISOString() }
          : w
      ));
    }
  };

  const handleReject = (id) => {
    const reason = prompt('거부 사유를 입력하세요:');
    if (reason) {
      setWithdrawals(withdrawals.map(w => 
        w.id === id 
          ? { ...w, status: 'rejected', processTime: new Date().toISOString(), rejectReason: reason }
          : w
      ));
    }
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: '승인대기', icon: ClockIcon },
      approved: { color: 'bg-green-100 text-green-800', text: '승인완료', icon: CheckCircleIcon },
      rejected: { color: 'bg-red-100 text-red-800', text: '거부됨', icon: XCircleIcon }
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

  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    const matchesSearch = 
      withdrawal.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || withdrawal.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStats = () => {
    const today = new Date().toDateString();
    const todayWithdrawals = withdrawals.filter(w => 
      new Date(w.requestTime).toDateString() === today
    );
    
    return {
      todayAmount: todayWithdrawals.reduce((sum, w) => sum + w.amount, 0),
      pending: withdrawals.filter(w => w.status === 'pending').length,
      approved: withdrawals.filter(w => w.status === 'approved').length,
      rejected: withdrawals.filter(w => w.status === 'rejected').length
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">출금 관리</h1>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <BanknotesIcon className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">금일 출금</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.todayAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">승인 대기</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">승인 완료</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.approved}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <XCircleIcon className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">거부됨</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.rejected}</p>
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
              placeholder="회원명, ID, 거래번호 검색"
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
            <option value="pending">승인 대기</option>
            <option value="approved">승인 완료</option>
            <option value="rejected">거부됨</option>
          </select>
          <div className="text-sm text-gray-500 flex items-center">
            총 {filteredWithdrawals.length}건의 출금 요청
          </div>
        </div>
      </div>

      {/* 출금 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">출금 요청 목록</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">거래번호</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">회원정보</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">출금액</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">계좌정보</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">요청시간</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">액션</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWithdrawals.map((withdrawal) => {
                const isInsufficientBalance = withdrawal.amount > withdrawal.currentBalance;
                
                return (
                  <tr key={withdrawal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {withdrawal.transactionId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{withdrawal.userName}</div>
                      <div className="text-sm text-gray-500">{withdrawal.userId}</div>
                      <div className="text-xs text-gray-400">
                        잔액: {withdrawal.currentBalance.toLocaleString()}원
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${isInsufficientBalance ? 'text-red-600' : 'text-gray-900'}`}>
                        {withdrawal.amount.toLocaleString()}원
                      </div>
                      {isInsufficientBalance && (
                        <div className="flex items-center text-xs text-red-600">
                          <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                          잔액 부족
                        </div>
                      )}
                      <div className="text-xs text-gray-500">{withdrawal.reason}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{withdrawal.bankName}</div>
                      <div className="text-xs text-gray-500">{withdrawal.accountNumber}</div>
                      <div className="text-xs text-gray-500">{withdrawal.accountHolder}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{withdrawal.requestTime}</div>
                      {withdrawal.processTime && (
                        <div className="text-xs">처리: {withdrawal.processTime}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={withdrawal.status} />
                      {withdrawal.status === 'rejected' && withdrawal.rejectReason && (
                        <div className="text-xs text-red-600 mt-1">{withdrawal.rejectReason}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        {withdrawal.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleApprove(withdrawal.id)}
                              className="text-green-600 hover:text-green-900"
                              disabled={isInsufficientBalance}
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={() => handleReject(withdrawal.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <XCircleIcon className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 주의사항 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
          <h4 className="text-sm font-medium text-yellow-900">출금 승인 주의사항</h4>
        </div>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• 출금 승인 전 회원의 잔액을 반드시 확인하세요.</li>
          <li>• 계좌 정보와 예금주명이 일치하는지 확인하세요.</li>
          <li>• 승인된 출금은 취소할 수 없습니다.</li>
          <li>• 의심스러운 출금 요청은 추가 확인 후 처리하세요.</li>
        </ul>
      </div>
    </div>
  );
};

export default Withdrawals;