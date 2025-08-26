import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 mt-auto" style={{ backgroundColor: '#FAF9F6' }}>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            {/* Logo Icon - 네비게이션 바와 동일 */}
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-blue-600 rounded-full flex items-center justify-center relative">
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <span className="text-red-600 font-bold text-xs">O</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full"></div>
            </div>
            
            {/* Logo Text - 네비게이션 바와 동일 */}
            <div className="flex flex-col">
              <span className="text-lg font-bold text-amber-600" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
                OEN TEST 커뮤니티
              </span>
            </div>
          </div>

          {/* Support Links */}
          <div className="flex space-x-6 mb-4 md:mb-0">
            <button className="text-gray-400 hover:text-gray-300 transition-colors">
              이용약관
            </button>
            <button className="text-gray-400 hover:text-gray-300 transition-colors">
              개인정보처리방침
            </button>
            <button className="text-gray-400 hover:text-gray-300 transition-colors">
              커뮤니티 가이드라인
            </button>
            <button className="text-gray-400 hover:text-gray-300 transition-colors">
              공식 텔레그램채널
            </button>
          </div>

          {/* Copyright */}
          <p className="text-gray-500 text-sm">
            © {currentYear} OEN TEST. 모든 권리 보유.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 