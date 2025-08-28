import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './utils/permissions';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import PostManagement from './pages/PostManagement';

import SystemLogs from './pages/SystemLogs';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import { PERMISSIONS } from './utils/permissions';

// Dashboard Pages
import UserStats from './pages/dashboard/UserStats';
import PostStats from './pages/dashboard/PostStats';
import Alerts from './pages/dashboard/Alerts';

// User Management Pages
import UserList from './pages/users/UserList';
import UserCreate from './pages/users/UserCreate';
import PointsGive from './pages/users/PointsGive';
import PointsDeduct from './pages/users/PointsDeduct';
import PointsHistory from './pages/users/PointsHistory';
import CouponsGive from './pages/users/CouponsGive';

// Finance Pages
import Deposits from './pages/finance/Deposits';
import Withdrawals from './pages/finance/Withdrawals';
import PointDeposits from './pages/finance/PointDeposits';

// Customer Service Pages
import CustomerPosts from './pages/customer/Posts';
import SendMessage from './pages/customer/SendMessage';

// Event Pages
import EventNotices from './pages/events/EventNotices';
import Popups from './pages/events/Popups';
import Banners from './pages/events/Banners';

// System Pages
import SecuritySettings from './pages/system/SecuritySettings';
import SystemNotices from './pages/system/SystemNotices';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.SYSTEM_VIEW}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.USER_VIEW}>
              <UserManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/posts" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.POST_VIEW}>
              <PostManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/security" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.SECURITY_VIEW}>
              <SecuritySettings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/logs" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.LOG_VIEW}>
              <SystemLogs />
            </ProtectedRoute>
          } 
        />
        
        {/* Dashboard Sub-pages */}
        <Route 
          path="/dashboard/user-stats" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.SYSTEM_VIEW}>
              <UserStats />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/post-stats" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.SYSTEM_VIEW}>
              <PostStats />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/alerts" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.SYSTEM_VIEW}>
              <Alerts />
            </ProtectedRoute>
          } 
        />

        {/* User Management Sub-pages */}
        <Route 
          path="/users/list" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.USER_VIEW}>
              <UserList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users/create" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.USER_CREATE}>
              <UserCreate />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users/points/give" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.USER_EDIT}>
              <PointsGive />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users/points/deduct" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.USER_EDIT}>
              <PointsDeduct />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users/points/history" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.USER_VIEW}>
              <PointsHistory />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users/coupons/give" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.USER_EDIT}>
              <CouponsGive />
            </ProtectedRoute>
          } 
        />

        {/* Finance Pages */}
        <Route 
          path="/finance/deposits" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.USER_VIEW}>
              <Deposits />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/finance/withdrawals" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.USER_VIEW}>
              <Withdrawals />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/finance/point-deposits" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.USER_VIEW}>
              <PointDeposits />
            </ProtectedRoute>
          } 
        />

        {/* Customer Service Pages */}
        <Route 
          path="/customer/posts" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.POST_VIEW}>
              <CustomerPosts />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/customer/send-message" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.POST_CREATE}>
              <SendMessage />
            </ProtectedRoute>
          } 
        />

        {/* Event Pages */}
        <Route 
          path="/events/notices" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.POST_CREATE}>
              <EventNotices />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/events/popups" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.POST_CREATE}>
              <Popups />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/events/banners" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.POST_CREATE}>
              <Banners />
            </ProtectedRoute>
          } 
        />

        {/* System Pages */}
        <Route 
          path="/system/security" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.SYSTEM_MANAGE}>
              <SecuritySettings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/system/notices" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.POST_CREATE}>
              <SystemNotices />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

export default App; 