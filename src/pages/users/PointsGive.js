import React, { useState } from 'react';
import {
  MagnifyingGlassIcon,
  GiftIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const PointsGive = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [pointAmount, setPointAmount] = useState('');
  const [reason, setReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [giveType, setGiveType] = useState('individual'); // individual, bulk, all

  // 목업 사용자 데이터
  const users = [
    { id: 1, username: 'user001', name: '김철수', level: 'VIP', currentPoints: 150000 },
    { id: 2, username: 'user002', name: '이영희', level: 'GOLD', currentPoints: 89000 },
    { id: 3, username: 'user003', name: '박민수', level: 'SILVER', currentPoints: 25000 },
    { id: 4, username: 'user004', name: '정수진', level: 'BRONZE', currentPoints: 12000 },
    { id: 5, username: 'user005', name: '최민호', level: 'VIP', currentPoints: 200000 }
  ];

  const reasonPresets = [
    '이벤트 참여 보상',
    '신규 가입 축하금',
    '추천인 보상',
    '버그 신고 보상',
    '충성 고객 보상',
    '생일 축하금',
    '등급 승급 보상',
    '기타'
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
    const allUserIds = filteredUsers.map(user => user.id);
    setSelectedUsers(allUserIds);
  };

  const handleSelectByLevel = (level) => {
    const levelUserIds = users.filter(user => user.level === level).map(user => user.id);
    setSelectedUsers(prev => [...new Set([...prev, ...levelUserIds])]);
  };

  const handleGivePoints = () => {
    if (!pointAmount || pointAmount <= 0) {
      alert('지급할 포인트를 입력하세요.');
      return;
    }

    if (!reason.trim()) {
      alert('지급 사유를 입력하세요.');
      return;
    }

    let targetCount = 0;
    let targetUsers = [];

    if (giveType === 'all') {
      targetCount = users.length;
      targetUsers = users;
    } else {
      if (selectedUsers.length === 0) {
        alert('포인트를 지급받을 회원을 선택하세요.');
        return;
      }
      targetCount = selectedUsers.length;
      targetUsers = users.filter(user => selectedUsers.includes(user.id));
    }

    const totalPoints = targetCount * parseInt(pointAmount);
    const confirmMessage = `${targetCount}명에게 각각 ${parseInt(pointAmount).toLocaleString()}P (총 ${totalPoints.toLocaleString()}P)를 지급하시겠습니까?`;

    if (window.confirm(confirmMessage)) {
      // API 호출 로직
      console.log({
        type: giveType,
        targets: targetUsers,
        amount: parseInt(pointAmount),
        reason,
        totalAmount: totalPoints
      });

      alert('포인트가 성공적으로 지급되었습니다.');
      
      // 폼 초기화
      setSelectedUsers([]);
      setPointAmount('');
      setReason('');
    }
  };

  const LevelBadge = ({ level }) => {
    const levelConfig = {
      VIP: 'bg-purple-100 text-purple-800',
      GOLD: 'bg-yellow-100 text-yellow-800',
      SILVER: 'bg-gray-100 text-gray-800',
      BRONZE: 'bg-orange-100 text-orange-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${levelConfig[level]}`}>
        {level}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">포인트 지급</h1>
        <p className="mt-2 text-sm text-gray-600">회원들에게 포인트를 지급할 수 있습니다.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 대상 선택 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">지급 대상 선택</h3>
            </div>
            <div className="p-6">
              {/* 지급 방식 선택 */}
              <div className="mb-4">
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="giveType"
                      value="individual"
                      checked={giveType === 'individual'}
                      onChange={(e) => setGiveType(e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="ml-2 text-sm">개별 선택</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="giveType"
                      value="all"
                      checked={giveType === 'all'}
                      onChange={(e) => setGiveType(e.target.value)}
                      className="text-blue-600"
                    />
                    <UsersIcon className="h-4 w-4 ml-2 mr-1" />
                    <span className="text-sm">전체 지급</span>
                  </label>
                </div>
              </div>

              {giveType === 'individual' && (
                <>
                  {/* 검색 */}
                  <div className="mb-4">
                    <div className="relative">
                      <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="이름 또는 아이디 검색"
                        className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* 빠른 선택 */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">빠른 선택</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={handleSelectAll}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
                      >
                        전체 선택
                      </button>
                      <button
                        onClick={() => handleSelectByLevel('VIP')}
                        className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200"
                      >
                        VIP만
                      </button>
                      <button
                        onClick={() => handleSelectByLevel('GOLD')}
                        className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200"
                      >
                        GOLD만
                      </button>
                      <button
                        onClick={() => setSelectedUsers([])}
                        className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                      >
                        선택 해제
                      </button>
                    </div>
                  </div>

                  {/* 사용자 목록 */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredUsers.map(user => (
                      <div
                        key={user.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedUsers.includes(user.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleUserSelect(user.id)}
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleUserSelect(user.id)}
                            className="rounded border-gray-300 text-blue-600"
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.username}</div>
                              </div>
                              <div className="text-right">
                                <LevelBadge level={user.level} />
                                <div className="text-xs text-gray-500 mt-1">
                                  {user.currentPoints.toLocaleString()}P
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-sm text-gray-600">
                    선택된 회원: {selectedUsers.length}명
                  </div>
                </>
              )}

              {giveType === 'all' && (
                <div className="text-center py-8">
                  <UsersIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">전체 회원 {users.length}명에게 지급됩니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 포인트 지급 정보 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">지급 정보</h3>
            </div>
            <div className="p-6 space-y-4">
              {/* 포인트 금액 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  지급 포인트 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <GiftIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    placeholder="지급할 포인트"
                    className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={pointAmount}
                    onChange={(e) => setPointAmount(e.target.value)}
                  />
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  1인당 지급될 포인트
                </div>
              </div>

              {/* 지급 사유 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  지급 사유 <span className="text-red-500">*</span>
                </label>
                <div className="mb-2">
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">사유 선택</option>
                    {reasonPresets.map(preset => (
                      <option key={preset} value={preset}>{preset}</option>
                    ))}
                  </select>
                </div>
                <textarea
                  rows="3"
                  placeholder="직접 입력하거나 위에서 선택"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              {/* 지급 요약 */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">지급 요약</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>대상:</span>
                    <span>
                      {giveType === 'all' 
                        ? `전체 ${users.length}명`
                        : `선택된 ${selectedUsers.length}명`
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>1인당:</span>
                    <span>{pointAmount ? parseInt(pointAmount).toLocaleString() : 0}P</span>
                  </div>
                  <div className="flex justify-between font-medium text-gray-900 pt-2 border-t">
                    <span>총 지급:</span>
                    <span>
                      {pointAmount ? 
                        ((giveType === 'all' ? users.length : selectedUsers.length) * parseInt(pointAmount || 0)).toLocaleString()
                        : 0
                      }P
                    </span>
                  </div>
                </div>
              </div>

              {/* 지급 버튼 */}
              <button
                onClick={handleGivePoints}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center"
              >
                <GiftIcon className="h-5 w-5 mr-2" />
                포인트 지급
              </button>
            </div>
          </div>

          {/* 주의사항 */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-900 mb-2">주의사항</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• 지급된 포인트는 취소할 수 없습니다.</li>
              <li>• 지급 내역은 자동으로 기록됩니다.</li>
              <li>• 대량 지급 시 처리 시간이 소요될 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsGive;