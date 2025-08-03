import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Shield,
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
                     <span className="text-red-600 font-bold text-xs">♠</span>
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
                  to="/category-1"
                  className="hover:text-amber-700 transition-colors font-medium"
                  style={{ color: '#1B263B' }}
                >
                  카테고리 1
                </Link>
                
                <Link
                  to="/category-2"
                  className="hover:text-amber-700 transition-colors font-medium"
                  style={{ color: '#1B263B' }}
                >
                  카테고리 2
                </Link>
                
                <div className="relative group">
                  <button className="hover:text-amber-700 transition-colors font-medium flex items-center" style={{ color: '#1B263B' }}>
                    카테고리 3
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </button>
                  <div className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link to="/category-3" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">카테고리 3</Link>
                    <Link to="/subcategory-3" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">서브카테고리</Link>
                  </div>
                </div>
                
                <div className="relative group">
                  <button className="hover:text-amber-700 transition-colors font-medium flex items-center" style={{ color: '#1B263B' }}>
                    카테고리 4
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </button>
                  <div className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link to="/category-4" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">카테고리 4</Link>
                    <Link to="/subcategory-4" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">서브카테고리</Link>
                  </div>
                </div>
                
                <div className="relative group">
                  <button className="hover:text-amber-700 transition-colors font-medium flex items-center" style={{ color: '#1B263B' }}>
                    카테고리 5
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </button>
                  <div className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link to="/category-5" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">카테고리 5</Link>
                    <Link to="/subcategory-5" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">서브카테고리</Link>
                  </div>
                </div>
                
                              <div className="relative group">
                   <button className="hover:text-amber-700 transition-colors font-medium flex items-center" style={{ color: '#1B263B' }}>
                     카테고리 6
                     <ChevronDown className="h-4 w-4 ml-1" />
                   </button>
                   <div className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                     <Link to="/category-6" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">카테고리 6</Link>
                     <Link to="/subcategory-6" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">서브카테고리</Link>
                   </div>
                 </div>
                 
                 <Link
                   to="/customer-center"
                   className="hover:text-amber-700 transition-colors font-medium"
                   style={{ color: '#1B263B' }}
                 >
                   고객센터
                 </Link>
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
                         className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                         onClick={() => setIsUserMenuOpen(false)}
                       >
                         <User className="h-4 w-4 mr-2" />
                         프로필
                       </Link>
                       
                       {user?.role === 'admin' && (
                         <Link
                           to="/admin"
                           className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                           onClick={() => setIsUserMenuOpen(false)}
                         >
                           <Shield className="h-4 w-4 mr-2" />
                           관리자
                         </Link>
                       )}
                       
                       <button
                         onClick={handleLogout}
                         className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                       >
                         <LogOut className="h-4 w-4 mr-2" />
                         로그아웃
                       </button>
                     </div>
                   )}
                 </div>
                                                                                                                     ) : (
                    <div className="flex items-center space-x-2">
                      {/* 로그인 버튼 제거 */}
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
              <div className="lg:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
                  <Link
                    to="/category-1"
                    className="block px-3 py-2 rounded-md text-base font-medium text-black hover:text-amber-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    카테고리 1
                  </Link>
                  
                  <Link
                    to="/category-2"
                    className="block px-3 py-2 rounded-md text-base font-medium text-black hover:text-amber-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    카테고리 2
                  </Link>
                  
                  <Link
                    to="/category-3"
                    className="block px-3 py-2 rounded-md text-base font-medium text-black hover:text-amber-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    카테고리 3
                  </Link>
                  
                  <Link
                    to="/category-4"
                    className="block px-3 py-2 rounded-md text-base font-medium text-black hover:text-amber-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    카테고리 4
                  </Link>
                  
                  <Link
                    to="/category-5"
                    className="block px-3 py-2 rounded-md text-base font-medium text-black hover:text-amber-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    카테고리 5
                  </Link>
                  
                                  <Link
                     to="/category-6"
                     className="block px-3 py-2 rounded-md text-base font-medium text-black hover:text-amber-700"
                     onClick={() => setIsMenuOpen(false)}
                   >
                     카테고리 6
                   </Link>
                   
                   <Link
                     to="/customer-center"
                     className="block px-3 py-2 rounded-md text-base font-medium text-black hover:text-amber-700"
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