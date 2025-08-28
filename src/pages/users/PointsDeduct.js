import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  MinusCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const PointsDeduct = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pointAmount, setPointAmount] = useState('');
  const [reason, setReason] = useState('');
  const [isAllSelected, setIsAllSelected] = useState(false);

  // 목업 데이터
  const users = [
    { id: 1, username: 'user001', name: '김철수', points: 150000, level: 'VIP' },
    { id: 2, username: 'user002', name: '이영희', points: 75000, level: 'GOLD' },
    { id: 3, username: 'user003', name: '박민수', points: 25000, level: 'SILVER' }
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
    setIsAllSelected(!isAllSelected);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedUsers.length === 0) {
      alert('포인트를 차감할 회원을 선택해주세요.');
      return;
    }

    if (!pointAmount || parseInt(pointAmount) <= 0) {
      alert('올바른 포인트 금액을 입력해주세요.');
      return;
    }

    if (!reason.trim()) {
      alert('차감 사유를 입력해주세요.');
      return;
    }

    // 잔액 부족 검사
    const insufficientUsers = users
      .filter(user => selectedUsers.includes(user.id))
      .filter(user => user.points < parseInt(pointAmount));

    if (insufficientUsers.length > 0) {
      const userNames = insufficientUsers.map(user => user.name).join(', ');
      alert(`다음 회원들의 포인트가 부족합니다: ${userNames}`);
      return;
    }

    const selectedUserNames = users
      .filter(user => selectedUsers.includes(user.id))
      .map(user => user.name)
      .join(', ');

    const confirmMessage = `${selectedUserNames}에게서 ${parseInt(pointAmount).toLocaleString()}P를 차감하시겠습니까?`;
    
    if (window.confirm(confirmMessage)) {
      // API 호출
      console.log({
        userIds: selectedUsers,
        amount: parseInt(pointAmount),
        reason: reason
      });
      
      alert('포인트가 성공적으로 차감되었습니다.');
      
      // 폼 초기화
      setSelectedUsers([]);
      setPointAmount('');
      setReason('');
      setIsAllSelected(false);
    }
  };

  const totalAmount = selectedUsers.length * parseInt(pointAmount || 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">포인트 차감</h1>
        <p className="mt-2 text-sm text-gray-600">선택한 회원들의 포인트를 일괄 차감할 수 있습니다.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 회원 선택 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">회원 선택</h3>
          </div>
          
          <div className="p-6">
            {/* 검색 */}
            <div className="mb-4">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="이름 또는 아이디로 검색"
                  className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* 전체 선택 */}
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-900">전체 선택</span>
              </label>
            </div>

            {/* 회원 목록 */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredUsers.map(user => {
                const isSelected = selectedUsers.includes(user.id);
                const wouldBeInsufficient = pointAmount && user.points < parseInt(pointAmount);
                
                return (
                  <div
                    key={user.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : wouldBeInsufficient
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleUserSelect(user.id)}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleUserSelect(user.id)}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.username}</div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-medium ${
                              wouldBeInsufficient ? 'text-red-600' : 'text-gray-900'
                            }`}>
                              {user.points.toLocaleString()}P
                            </div>
                            <div className="text-sm text-gray-500">{user.level}</div>
                          </div>
                        </div>
                        {wouldBeInsufficient && (
                          <div className="mt-1 text-xs text-red-600 flex items-center">
                            <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                            잔액 부족
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 text-sm text-gray-600">
              선택된 회원: {selectedUsers.length}명
            </div>
          </div>
        </div>

        {/* 포인트 차감 정보 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">차감 정보</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  차감 포인트 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="차감할 포인트를 입력하세요"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={pointAmount}
                  onChange={(e) => setPointAmount(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  차감 사유 <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="3"
                  placeholder="포인트 차감 사유를 입력하세요"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              {/* 차감 요약 */}
              {selectedUsers.length > 0 && pointAmount && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <MinusCircleIcon className="h-5 w-5 text-red-600 mr-2" />
                    <h4 className="text-sm font-medium text-red-900">차감 요약</h4>
                  </div>
                  <div className="text-sm text-red-800 space-y-1">
                    <div>선택된 회원: {selectedUsers.length}명</div>
                    <div>개별 차감액: {parseInt(pointAmount || 0).toLocaleString()}P</div>
                    <div className="font-medium">총 차감액: {totalAmount.toLocaleString()}P</div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={selectedUsers.length === 0 || !pointAmount || !reason.trim()}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <MinusCircleIcon className="h-5 w-5 mr-2" />
                포인트 차감
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 주의사항 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
          <h4 className="text-sm font-medium text-yellow-900">주의사항</h4>
        </div>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• 포인트 차감은 즉시 반영되며, 취소할 수 없습니다.</li>
          <li>• 회원의 보유 포인트보다 많은 포인트는 차감할 수 없습니다.</li>
          <li>• 차감 내역은 포인트 내역에서 확인할 수 있습니다.</li>
          <li>• 차감 사유는 회원에게도 표시됩니다.</li>
          <li>• 대량 차감 시 시스템 처리에 시간이 걸릴 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
};

export default PointsDeduct;