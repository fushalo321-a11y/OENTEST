import React from 'react';
import { Link } from 'react-router-dom';

const NoticeSidebar = () => {
  // 공지사항 데이터 (실제로는 API에서 가져와야 함)
  const notices = [
    {
      id: 1,
      title: "사이트ID가 포함된 사칭사이트 주의 안내",
      date: "07-12"
    },
    {
      id: 2,
      title: "(중요) 타업체와 동일한 사칭사이트 주의 안내",
      date: "07-12"
    },
    {
      id: 3,
      title: "사칭 절대 주의 안내",
      date: "05-08"
    },
    {
      id: 4,
      title: "접속장애시 크롬 & 엣지 브라우저 사용 권장",
      date: "02-07"
    },
    {
      id: 5,
      title: "메가게임즈 제휴 종료 안내",
      date: "03-30"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border-2" style={{ borderColor: '#F5F5DC' }}>
      <div className="p-2 border-b border-gray-200" style={{ backgroundColor: '#F5F5DC' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center space-x-2 flex-1">
            <div className="w-5 h-5 bg-gradient-to-br from-red-500 to-blue-600 rounded-full flex items-center justify-center relative">
              <div className="w-2.5 h-2.5 bg-white rounded-sm flex items-center justify-center">
                <span className="text-red-600 font-bold text-xs">♠</span>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-yellow-400 rounded-full"></div>
              <div className="absolute -bottom-0.5 -left-0.5 w-0.5 h-0.5 bg-yellow-400 rounded-full"></div>
            </div>
            <h3 className="text-sm font-semibold text-gray-900">공지사항</h3>
          </div>
          <Link 
            to="/notices" 
            className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <span className="text-xs">+</span>
          </Link>
        </div>
      </div>
      <div className="p-4">
        <div className="space-y-3">
          {notices.map((notice) => (
            <Link 
              key={notice.id} 
              to={`/notices/${notice.id}`}
              className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-yellow-800 text-sm font-bold">!</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 truncate">{notice.title}</p>
              </div>
              <div className="flex items-center space-x-1 flex-shrink-0">
                <div className="w-3 h-3 bg-gray-300 rounded flex items-center justify-center">
                  <span className="text-white text-xs">H</span>
                </div>
                <span className="text-xs text-gray-500">{notice.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoticeSidebar; 