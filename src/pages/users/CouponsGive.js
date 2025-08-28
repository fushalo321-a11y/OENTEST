import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  TicketIcon,
  GiftIcon
} from '@heroicons/react/24/outline';

const CouponsGive = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [couponType, setCouponType] = useState('');
  const [couponValue, setCouponValue] = useState('');
  const [expiryDays, setExpiryDays] = useState('30');
  const [reason, setReason] = useState('');

  const users = [
    { id: 1, username: 'user001', name: '김철수', level: 'VIP' },
    { id: 2, username: 'user002', name: '이영희', level: 'GOLD' },
    { id: 3, username: 'user003', name: '박민수', level: 'SILVER' }
  ];

  const couponTypes = [
    { value: 'point', label: '포인트 쿠폰', description: '지정된 포인트 지급' },
    { value: 'discount', label: '할인 쿠폰', description: '결제 시 할인 적용' },
    { value: 'cashback', label: '캐시백 쿠폰', description: '사용 후 포인트 환급' },
    { value: 'free_shipping', label: '무료배송 쿠폰', description: '배송비 무료' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      selectedUsers,
      couponType,
      couponValue,
      expiryDays,
      reason
    });
    alert('쿠폰이 성공적으로 지급되었습니다.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">쿠폰함 지급</h1>
        <p className="mt-2 text-sm text-gray-600">선택한 회원들에게 쿠폰을 일괄 지급할 수 있습니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 회원 선택 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">회원 선택</h3>
          </div>
          <div className="p-6">
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
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {users.map(user => (
                <div key={user.id} className="p-3 border rounded-lg hover:border-gray-300">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id]);
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.username}</div>
                        </div>
                        <div className="text-sm text-gray-500">{user.level}</div>
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 쿠폰 정보 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">쿠폰 정보</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                쿠폰 종류 <span className="text-red-500">*</span>
              </label>
              <select
                value={couponType}
                onChange={(e) => setCouponType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">쿠폰 종류를 선택하세요</option>
                {couponTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {couponType && (
                <p className="mt-1 text-sm text-gray-500">
                  {couponTypes.find(t => t.value === couponType)?.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                쿠폰 값 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                placeholder={couponType === 'discount' ? '할인율 (%)' : '포인트 또는 금액'}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={couponValue}
                onChange={(e) => setCouponValue(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                유효기간 (일) <span className="text-red-500">*</span>
              </label>
              <select
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="7">7일</option>
                <option value="14">14일</option>
                <option value="30">30일</option>
                <option value="60">60일</option>
                <option value="90">90일</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                지급 사유 <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="3"
                placeholder="쿠폰 지급 사유를 입력하세요"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            {selectedUsers.length > 0 && couponType && couponValue && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <GiftIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <h4 className="text-sm font-medium text-blue-900">지급 요약</h4>
                </div>
                <div className="text-sm text-blue-800 space-y-1">
                  <div>선택된 회원: {selectedUsers.length}명</div>
                  <div>쿠폰 종류: {couponTypes.find(t => t.value === couponType)?.label}</div>
                  <div>쿠폰 값: {couponValue}{couponType === 'discount' ? '%' : ''}</div>
                  <div>유효기간: {expiryDays}일</div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={selectedUsers.length === 0 || !couponType || !couponValue || !reason.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <TicketIcon className="h-5 w-5 mr-2" />
              쿠폰 지급
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CouponsGive;