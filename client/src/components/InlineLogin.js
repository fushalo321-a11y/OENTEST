import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';

const InlineLogin = () => {
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

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md border-2" style={{ borderColor: '#F5F5DC' }}>
      <style jsx>{`
        input:focus {
          outline: none;
          border-color: #F5F5DC !important;
          box-shadow: 0 0 0 2px #F5F5DC !important;
        }
      `}</style>
      {/* 로그인 폼 */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* 아이디 입력 필드 */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-gray-400" />
            </div>
                         <input
               type="text"
               name="username"
               value={formData.username}
               onChange={handleChange}
               placeholder="아이디"
               className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-sm"
             />
          </div>
          
          {/* 비밀번호 입력 필드 */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
                         <input
               type="password"
               name="password"
               value={formData.password}
               onChange={handleChange}
               placeholder="비밀번호"
               className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-sm"
             />
          </div>
          
                     {/* 로그인 버튼 */}
           <button
             type="submit"
             className="w-full text-gray-800 py-2 rounded-md transition-colors font-medium text-sm"
             style={{ backgroundColor: '#F5F5DC' }}
           >
             로그인
           </button>
          
          {/* 추가 옵션 */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
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
                <span className="ml-2 text-gray-600">자동 로그인</span>
              </label>
            </div>
            
            <div className="flex items-center space-x-1 text-gray-600">
              <button className="hover:text-purple-600">정보찾기</button>
              <span>·</span>
              <button className="hover:text-purple-600">회원가입</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InlineLogin; 