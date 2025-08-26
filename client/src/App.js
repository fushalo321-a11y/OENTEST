import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';

// Category Pages
import Category1 from './pages/Category1';
import Category2 from './pages/Category2';
import Category3 from './pages/Category3';
import Category4 from './pages/Category4';
import Category5 from './pages/Category5';
import Category6 from './pages/Category6';
import CustomerCenter from './pages/CustomerCenter';
import Event from './pages/Event';
import WarrantySites from './pages/WarrantySites';
import ScamVerification from './pages/ScamVerification';
import Gallery from './pages/Gallery';
import GalleryDetail from './pages/GalleryDetail';
import OfflineCasino from './pages/OfflineCasino';
import Poker from './pages/Poker';
import Baccarat from './pages/Baccarat';
import DragonTiger from './pages/DragonTiger';

// Point Pages
import PointExchange from './pages/PointExchange';
import PointTrading from './pages/PointTrading';
import PointRanking from './pages/PointRanking';
import GiftcardExchange from './pages/GiftcardExchange';

// Event Pages
import LotteryEvent from './pages/LotteryEvent';
import OenTestEvent from './pages/OenTestEvent';

// Customer Center Pages
import Inquiry from './pages/Inquiry';
import Notices from './pages/Notices';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Styles
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Admin 경로 차단 컴포넌트
const AdminBlocker = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // admin 경로 차단
    if (location.pathname.startsWith('/admin')) {
      console.log('Admin access blocked by React component');
      window.location.replace('/');
      return;
    }
  }, [location.pathname, navigate]);

  // 추가 보안: 주기적으로 확인
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.location.pathname.startsWith('/admin')) {
        console.log('Admin access blocked by periodic check');
        window.location.replace('/');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // admin 경로에 직접 접근 시 즉시 차단
  if (location.pathname.startsWith('/admin')) {
    console.log('Admin access blocked immediately');
    window.location.replace('/');
    return null;
  }

  return null;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AdminBlocker />
          <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF9F6' }}>
            <Navbar />
            <main className="flex-1">
              <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/posts/:id" element={<PostDetail />} />
                  <Route path="/user/:username" element={<UserProfile />} />
                  <Route path="/warranty-sites" element={<WarrantySites />} />
                  <Route path="/scam-verification" element={<ScamVerification />} />
                  
                  {/* Category Routes */}
                  <Route path="/category-1" element={<Category1 />} />
                  <Route path="/category-2" element={<Category2 />} />
                  <Route path="/category-3" element={<Category3 />} />
                  <Route path="/category-4" element={<Category4 />} />
                  <Route path="/category-5" element={<Category5 />} />
                  <Route path="/category-6" element={<Category6 />} />
                  <Route path="/customer-center" element={<CustomerCenter />} />
                  <Route path="/event" element={<Event />} />
                  
                  {/* Community Menu Routes */}
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/gallery/:id" element={<GalleryDetail />} />
                  <Route path="/free-board" element={<Category2 />} />
                  <Route path="/stock-board" element={<Category3 />} />
                  <Route path="/coin-board" element={<Category4 />} />
                  <Route path="/sports-news" element={<Category5 />} />
                  <Route path="/online-casino" element={<Category6 />} />
                  <Route path="/offline-casino" element={<OfflineCasino />} />
                  
                  {/* Game Zone Menu Routes */}
                  <Route path="/poker" element={<Poker />} />
                  <Route path="/baccarat" element={<Baccarat />} />
                  <Route path="/dragon-tiger" element={<DragonTiger />} />
                  
                  {/* Points Menu Routes */}
                  <Route path="/point-exchange" element={<PointExchange />} />
                  <Route path="/point-trading" element={<PointTrading />} />
                  <Route path="/point-ranking" element={<PointRanking />} />
                  <Route path="/giftcard-exchange" element={<GiftcardExchange />} />
                  
                  {/* Event Menu Routes */}
                  <Route path="/lottery-event" element={<LotteryEvent />} />
                  <Route path="/oen-test-event" element={<OenTestEvent />} />
                  
                  {/* Customer Center Menu Routes */}
                  <Route path="/inquiry" element={<Inquiry />} />
                  <Route path="/notices" element={<Notices />} />
                  <Route path="/notices/:id" element={<Notices />} />
                  
                  {/* Protected Routes */}
                  <Route path="/create-post" element={
                    <PrivateRoute>
                      <CreatePost />
                    </PrivateRoute>
                  } />
                  <Route path="/edit-post/:id" element={
                    <PrivateRoute>
                      <EditPost />
                    </PrivateRoute>
                  } />
                  <Route path="/profile" element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  } />
                  

                </Routes>
              </main>
              <Footer />
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    );
  }

export default App; 