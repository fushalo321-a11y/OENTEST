import React, { useState } from 'react';
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const SendMessage = () => {

  const [messageType, setMessageType] = useState('individual');
  const [searchTerm, setSearchTerm] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  // 목업 사용자 데이터
  const users = [
    { id: 1, username: 'user001', name: '김철수', level: 'VIP', lastLogin: '2024-01-20 14:30' },
    { id: 2, username: 'user002', name: '이영희', level: 'GOLD', lastLogin: '2024-01-20 13:15' },
    { id: 3, username: 'user003', name: '박민수', level: 'SILVER', lastLogin: '2024-01-19 16:45' },
    { id: 4, username: 'user004', name: '정수진', level: 'BRONZE', lastLogin: '2024-01-19 12:30' },
    { id: 5, username: 'user005', name: '최민호', level: 'VIP', lastLogin: '2024-01-20 10:15' }
  ];

  const messageTemplates = [
    {
      id: 1,
      name: '이벤트 알림',
      subject: '[이벤트] 특별 혜택 안내',
      content: '안녕하세요. 회원님을 위한 특별한 이벤트를 준비했습니다.\n\n이벤트 기간: 2024년 1월 20일 ~ 1월 31일\n혜택 내용: 포인트 2배 적립\n\n자세한 내용은 사이트에서 확인해주세요.\n\n감사합니다.'
    },
    {
      id: 2,
      name: '시스템 점검 안내',
      subject: '[공지] 시스템 점검 안내',
      content: '안녕하세요.\n\n시스템 점검으로 인한 서비스 일시 중단을 안내드립니다.\n\n점검 일시: 2024년 1월 21일 02:00 ~ 06:00\n점검 내용: 서버 업그레이드 및 보안 강화\n\n점검 시간 동안 서비스 이용이 제한될 수 있습니다.\n\n양해 부탁드립니다.'
    },
    {
      id: 3,
      name: '등급 승급 축하',
      subject: '[축하] 회원 등급 승급 안내',
      content: '축하드립니다!\n\n회원님의 등급이 승급되었습니다.\n\n새로운 등급의 혜택을 확인해보세요:\n- 포인트 적립률 증가\n- 전용 이벤트 참여 가능\n- 우선 고객 지원\n\n앞으로도 많은 이용 부탁드립니다.'
    }
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

  const handleTemplateSelect = (template) => {
    setSubject(template.subject);
    setContent(template.content);
  };

  const handleSendMessage = () => {
    if (!subject.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    if (messageType === 'individual' && selectedUsers.length === 0) {
      alert('받는 사람을 선택해주세요.');
      return;
    }

    const recipientCount = messageType === 'all' ? users.length : selectedUsers.length;
    const confirmMessage = `${recipientCount}명에게 쪽지를 발송하시겠습니까?`;

    if (window.confirm(confirmMessage)) {
      // API 호출 로직
      console.log({
        messageType,
        recipients: messageType === 'all' ? 'all' : selectedUsers,
        subject,
        content
      });

      alert('쪽지가 성공적으로 발송되었습니다.');
      
      // 폼 초기화
      setSelectedUsers([]);
      setSubject('');
      setContent('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">쪽지 보내기</h1>
        <p className="mt-2 text-sm text-gray-600">회원들에게 개별 또는 일괄로 쪽지를 발송할 수 있습니다.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 받는 사람 선택 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">받는 사람</h3>
            </div>
            <div className="p-6">
              {/* 발송 방식 선택 */}
              <div className="mb-4">
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="messageType"
                      value="individual"
                      checked={messageType === 'individual'}
                      onChange={(e) => setMessageType(e.target.value)}
                      className="text-blue-600"
                    />
                    <UserIcon className="h-4 w-4 ml-2 mr-1" />
                    <span className="text-sm">개별 선택</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="messageType"
                      value="all"
                      checked={messageType === 'all'}
                      onChange={(e) => setMessageType(e.target.value)}
                      className="text-blue-600"
                    />
                    <UserGroupIcon className="h-4 w-4 ml-2 mr-1" />
                    <span className="text-sm">전체 발송</span>
                  </label>
                </div>
              </div>

              {messageType === 'individual' && (
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
                                <div className="text-xs text-gray-500">{user.level}</div>
                                <div className="text-xs text-gray-400">{user.lastLogin}</div>
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

              {messageType === 'all' && (
                <div className="text-center py-8">
                  <UserGroupIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">전체 회원 {users.length}명에게 발송됩니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 메시지 작성 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">메시지 작성</h3>
            </div>
            <div className="p-6">
              {/* 템플릿 선택 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  템플릿 선택 (선택사항)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {messageTemplates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300"
                    >
                      <div className="text-sm font-medium text-gray-900">{template.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{template.subject}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 제목 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="메시지 제목을 입력하세요"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              {/* 내용 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="10"
                  placeholder="메시지 내용을 입력하세요"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <div className="mt-1 text-sm text-gray-500">
                  {content.length}/1000자
                </div>
              </div>

              {/* 발송 정보 요약 */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">발송 정보</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <div>
                    받는 사람: {messageType === 'all' ? `전체 회원 ${users.length}명` : `선택된 회원 ${selectedUsers.length}명`}
                  </div>
                  <div>제목: {subject || '(제목 없음)'}</div>
                  <div>내용 길이: {content.length}자</div>
                </div>
              </div>

              {/* 발송 버튼 */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  임시저장
                </button>
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                  발송하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMessage;