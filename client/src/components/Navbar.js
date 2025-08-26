import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <>
      <nav className="shadow-sm border-b border-gray-200 sticky top-0 z-50" style={{ backgroundColor: '#F5F5DC' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and main navigation */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                {/* Logo Icon */}
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-blue-600 rounded-full flex items-center justify-center relative">
                  <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                    <span className="text-red-600 font-bold text-xs">O</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full"></div>
                </div>
                
                {/* Logo Text */}
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-800" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    OEN TEST
                  </span>
                  <span className="text-xs text-black">
                    검증커뮤니티 OEN TEST
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop navigation menu */}
            <div className="hidden lg:flex items-center space-x-6">
              <Link
                to="/warranty-sites"
                className="hover:text-amber-700 transition-colors font-medium text-center"
                style={{ color: '#1B263B', whiteSpace: 'nowrap' }}
              >
                보증사이트
              </Link>
              
              <Link
                to="/scam-verification"
                className="hover:text-amber-700 transition-colors font-medium text-center"
                style={{ color: '#1B263B', whiteSpace: 'nowrap' }}
              >
                먹튀검증
              </Link>
              
              <div className="relative group">
                <button className="hover:text-amber-700 transition-colors font-medium flex items-center text-center" style={{ color: '#1B263B', whiteSpace: 'nowrap' }}>
                  커뮤니티
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md py-2 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 mt-2 ">
                  <Link to="/gallery" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center" style={{ whiteSpace: 'nowrap' }}>갤러리</Link>
                  <Link to="/free-board" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center" style={{ whiteSpace: 'nowrap' }}>자유게시판</Link>
                  <Link to="/stock-board" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center" style={{ whiteSpace: 'nowrap' }}>증시판</Link>
                  <Link to="/coin-board" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center" style={{ whiteSpace: 'nowrap' }}>코인판</Link>
                  <Link to="/sports-news" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center" style={{ whiteSpace: 'nowrap' }}>스포츠뉴스</Link>
                  <Link to="/online-casino" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center" style={{ whiteSpace: 'nowrap' }}>온라인카지노</Link>
                  <Link to="/offline-casino" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center" style={{ whiteSpace: 'nowrap' }}>오프라인카지노</Link>
                </div>
              </div>
              
              <div className="relative group">
                <button className="hover:text-amber-700 transition-colors font-medium flex items-center text-center" style={{ color: '#1B263B', whiteSpace: 'nowrap' }}>
                  게임존
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md py-2 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 mt-2 ">
                  <Link to="/poker" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center" style={{ whiteSpace: 'nowrap' }}>포커</Link>
                  <Link to="/baccarat" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center" style={{ whiteSpace: 'nowrap' }}>바카라</Link>
                  <Link to="/dragon-tiger" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center" style={{ whiteSpace: 'nowrap' }}>드래곤타이거</Link>
                </div>
              </div>
              
              <div className="relative group">
                <button className="hover:text-amber-700 transition-colors font-medium flex items-center text-center" style={{ color: '#1B263B', whiteSpace: 'nowrap' }}>
                  포인트
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md py-2 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 mt-2 ">
                  <Link to="/point-exchange" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center" style={{ whiteSpace: 'nowrap' }}>포인트전환</Link>
                  <Link to="/point-trading" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center" style={{ whiteSpace: 'nowrap' }}>포인트거래</Link>
                  <Link to="/point-ranking" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center" style={{ whiteSpace: 'nowrap' }}>포인트랭킹</Link>
                  <Link to="/giftcard-exchange" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center" style={{ whiteSpace: 'nowrap' }}>기프티콘전환</Link>
                </div>
              </div>
              
              <div className="relative group">
                <button className="hover:text-amber-700 transition-colors font-medium flex items-center text-center" style={{ color: '#1B263B', whiteSpace: 'nowrap' }}>
                  이벤트
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md py-2 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 mt-2 ">
                  <Link to="/lottery-event" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center" style={{ whiteSpace: 'nowrap' }}>복권이벤트</Link>
                  <Link to="/oen-test-event" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center" style={{ whiteSpace: 'nowrap' }}>OEN TEST 이벤트</Link>
                </div>
              </div>
              
              <div className="relative group">
                <button className="hover:text-amber-700 transition-colors font-medium flex items-center text-center" style={{ color: '#1B263B', whiteSpace: 'nowrap' }}>
                  고객센터/공지
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md py-2 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 mt-2 ">
                  <Link to="/inquiry" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center" style={{ whiteSpace: 'nowrap' }}>1:1문의</Link>
                  <Link to="/notices" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center" style={{ whiteSpace: 'nowrap' }}>공지사항</Link>
                </div>
              </div>
            </div>

            {/* User menu */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-md text-sm font-medium text-black hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <span>{user?.username}</span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-center"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        프로필
                      </Link>
                      

                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {/* 로그인버튼 제거 */}
                </div>
              )}

              {/* Mobile menu button */}
              <div className="lg:hidden flex items-center">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-md text-black hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
              <div className="px-4 py-3 space-y-2">
                <Link
                  to="/warranty-sites"
                  className="block py-3 text-base font-medium text-gray-800 hover:text-amber-700 border-b border-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  보증사이트
                </Link>
                
                <Link
                  to="/scam-verification"
                  className="block py-3 text-base font-medium text-gray-800 hover:text-amber-700 border-b border-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  먹튀검증
                </Link>
                
                <Link
                  to="/free-board"
                  className="block py-3 text-base font-medium text-gray-800 hover:text-amber-700 border-b border-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  커뮤니티
                </Link>
                
                <Link
                  to="/poker"
                  className="block py-3 text-base font-medium text-gray-800 hover:text-amber-700 border-b border-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  게임존
                </Link>
                
                <Link
                  to="/point-exchange"
                  className="block py-3 text-base font-medium text-gray-800 hover:text-amber-700 border-b border-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  포인트
                </Link>
                
                <Link
                  to="/lottery-event"
                  className="block py-3 text-base font-medium text-gray-800 hover:text-amber-700 border-b border-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  이벤트
                </Link>
                
                <Link
                  to="/customer-center"
                  className="block py-3 text-base font-medium text-gray-800 hover:text-amber-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  고객센터
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;






