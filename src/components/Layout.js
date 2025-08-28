import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeIcon,
  UsersIcon,
  BanknotesIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { 
      name: '대시보드', 
      href: '/dashboard', 
      icon: HomeIcon,
      subItems: [
        { name: '회원 통계', href: '/dashboard/user-stats' },
        { name: '게시글 통계', href: '/dashboard/post-stats' },
        { name: '이상 행동 알림', href: '/dashboard/alerts' }
      ]
    },
    { 
      name: '회원 관리', 
      href: '/users', 
      icon: UsersIcon,
      subItems: [
        { name: '회원조회', href: '/users/list' },
        { name: '회원생성', href: '/users/create' },
        { name: '포인트 지급', href: '/users/points/give' },
        { name: '포인트 차감', href: '/users/points/deduct' },
        { name: '포인트 내역', href: '/users/points/history' },
        { name: '쿠폰함 지급', href: '/users/coupons/give' },
        { name: '쿠폰함 회수', href: '/users/coupons/revoke' },
        { name: '쿠폰함 내역', href: '/users/coupons/history' },
        { name: '회원일괄업로드', href: '/users/bulk-upload' }
      ]
    },
    { 
      name: '입출금관리', 
      href: '/finance', 
      icon: BanknotesIcon,
      subItems: [
        { name: '입금', href: '/finance/deposits' },
        { name: '출금', href: '/finance/withdrawals' },
        { name: '포인트 입금(전환)', href: '/finance/point-deposits' },
        { name: '포인트 출금(전환)', href: '/finance/point-withdrawals' },
        { name: '입금계좌관리', href: '/finance/accounts' }
      ]
    },
    { 
      name: '고객 만족 센터', 
      href: '/customer', 
      icon: ChatBubbleLeftRightIcon,
      subItems: [
        { name: '게시글 관리', href: '/customer/posts' },
        { name: '샘플답변', href: '/customer/sample-replies' },
        { name: '쪽지 보내기', href: '/customer/send-message' },
        { name: '쪽지함 조회', href: '/customer/messages' },
        { name: '자동인사말 설정', href: '/customer/auto-greetings' },
        { name: '고객 만족 센터', href: '/customer/satisfaction' },
        { name: '고객센터 이전 문의 조회', href: '/customer/old-inquiries' }
      ]
    },
    { 
      name: '이벤트관리', 
      href: '/events', 
      icon: SparklesIcon,
      subItems: [
        { name: '이벤트 공지', href: '/events/notices' },
        { name: '팝업', href: '/events/popups' },
        { name: '배너', href: '/events/banners' },
        { name: 'IP 관리', href: '/events/ip-management' },
        { name: '라벨 등록', href: '/events/labels' },
        { name: '회원 레벨 관리', href: '/events/user-levels' },
        { name: '복권이벤트 설정', href: '/events/lottery/settings' },
        { name: '복권이벤트 내역', href: '/events/lottery/history' },
        { name: '출석이벤트 설정', href: '/events/attendance/settings' },
        { name: '출석이벤트 내역', href: '/events/attendance/history' },
        { name: '쿠폰 지급 내역', href: '/events/coupon-history' }
      ]
    },
    { 
      name: '시스템셋팅', 
      href: '/system', 
      icon: CogIcon,
      subItems: [
        { name: '보안설정', href: '/system/security' },
        { name: '공지사항', href: '/system/notices' },
        { name: '사이트명 관리', href: '/system/site-name' },
        { name: '회원로그인기록', href: '/system/login-logs' },
        { name: '유저페이지 설정', href: '/system/user-page' },
        { name: '관리자계정 설정', href: '/system/admin-accounts' }
      ]
    }
  ];

  const toggleMenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const isMenuActive = (item) => {
    if (item.href === location.pathname) return true;
    if (item.subItems) {
      return item.subItems.some(subItem => location.pathname === subItem.href);
    }
    return false;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold text-gray-900">Master System</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = isMenuActive(item);
              const isExpanded = expandedMenus[item.name];
              
              return (
                <div key={item.name}>
                  {item.subItems ? (
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={`w-full group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </div>
                      {isExpanded ? (
                        <ChevronDownIcon className="h-4 w-4" />
                      ) : (
                        <ChevronRightIcon className="h-4 w-4" />
                      )}
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  )}
                  
                  {item.subItems && isExpanded && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.subItems.map((subItem) => {
                        const isSubActive = location.pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={`block px-2 py-1 text-sm rounded-md ${
                              isSubActive
                                ? 'bg-blue-50 text-blue-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                            onClick={() => setSidebarOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.name?.charAt(0) || 'M'}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 w-full flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-xl font-bold text-gray-900">Master System</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = isMenuActive(item);
              const isExpanded = expandedMenus[item.name];
              
              return (
                <div key={item.name}>
                  {item.subItems ? (
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={`w-full group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </div>
                      {isExpanded ? (
                        <ChevronDownIcon className="h-4 w-4" />
                      ) : (
                        <ChevronRightIcon className="h-4 w-4" />
                      )}
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  )}
                  
                  {item.subItems && isExpanded && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.subItems.map((subItem) => {
                        const isSubActive = location.pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={`block px-2 py-1 text-sm rounded-md ${
                              isSubActive
                                ? 'bg-blue-50 text-blue-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.name?.charAt(0) || 'M'}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 w-full flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;