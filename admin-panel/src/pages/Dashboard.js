import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">대시보드</h1>
      <div className="mt-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">환영합니다, {user?.name}님!</h2>
          <p className="text-gray-600">Master System에 로그인하셨습니다.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 