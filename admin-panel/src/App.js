import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import PostManagement from './pages/PostManagement';
import SecuritySettings from './pages/SecuritySettings';
import SystemLogs from './pages/SystemLogs';
import ProtectedRoute from './components/ProtectedRoute';

// User Management Pages
import UserList from './pages/users/UserList';
import UserCreate from './pages/users/UserCreate';
import PointsGive from './pages/users/PointsGive';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users" 
          element={
            <ProtectedRoute>
              <Layout>
                <UserManagement />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/posts" 
          element={
            <ProtectedRoute>
              <Layout>
                <PostManagement />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/security" 
          element={
            <ProtectedRoute>
              <Layout>
                <SecuritySettings />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/logs" 
          element={
            <ProtectedRoute>
              <Layout>
                <SystemLogs />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        {/* User Management Routes */}
        <Route 
          path="/users/list" 
          element={
            <ProtectedRoute>
              <Layout>
                <UserList />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users/create" 
          element={
            <ProtectedRoute>
              <Layout>
                <UserCreate />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users/points/give" 
          element={
            <ProtectedRoute>
              <Layout>
                <PointsGive />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App; 