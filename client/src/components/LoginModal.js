import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';

const LoginModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    autoLogin: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // 로그인 로직 구현
    console.log('Login attempt:', formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-96 max-w-sm" onClick={(e) => e.stopPropagation()}>
        {/* 상단 빨간색 영역 */}
        <div className="bg-red-600 h-16 rounded-t-lg"></div>
        
        {/* 구분선 */}
        <div className="h-px bg-purple-300"></div>
        
        {/* 로그인 폼 */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 아이디 입력 필드 */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="아이디"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            {/* 비밀번호 입력 필드 */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            {/* 로그인 버튼 */}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition-colors font-medium"
            >
              로그인
            </button>
            
            {/* 추가 옵션 */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-1">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="autoLogin"
                    checked={formData.autoLogin}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="w-5 h-3 bg-gray-300 rounded-full relative">
                    <div className={`w-2 h-2 bg-white rounded-full absolute top-0.5 transition-transform ${formData.autoLogin ? 'translate-x-2' : 'translate-x-0.5'}`}></div>
                  </div>
                  <span className="ml-1 text-gray-600 whitespace-nowrap text-sm">자동로그인</span>
                </label>
              </div>
              
              <div className="flex items-center space-x-0.5 text-gray-600">
                <a href="#" className="hover:text-purple-600 whitespace-nowrap text-sm">정보찾기</a>
                <span className="text-sm">·</span>
                <a href="#" className="hover:text-purple-600 whitespace-nowrap text-sm">회원가입</a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal; 