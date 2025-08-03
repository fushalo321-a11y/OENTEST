import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Users, MessageCircle } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 mt-auto" style={{ backgroundColor: '#FAF9F6' }}>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900">커뮤니티</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              안전하고 활발한 커뮤니티를 만들어가는 공간입니다. 
              다양한 주제로 소통하고 지식을 나누어보세요.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <Shield className="h-4 w-4 mr-1" />
                보안 강화
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-1" />
                활발한 소통
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MessageCircle className="h-4 w-4 mr-1" />
                실시간 채팅
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              빠른 링크
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors">
                  홈
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 transition-colors">
                  로그인
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-600 hover:text-primary-600 transition-colors">
                  회원가입
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              지원
            </h3>
            <div className="flex space-x-6">
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
                문의하기
              </button>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {currentYear} 커뮤니티. 모든 권리 보유.
            </p>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="text-gray-500 text-sm mr-2">Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-gray-500 text-sm ml-2">for the community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 