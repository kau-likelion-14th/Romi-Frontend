import React from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import MainPage from './pages/Mainpage/MainPage';
import LoginPage from './pages/LoginPage/LoginPage';
import FriendPage from './pages/FriendPage/FriendPage';
import FriendDetailPage from './pages/FriendPage/FriendDetailPage';
import { Routes, Route, useLocation } from 'react-router-dom';

function App() {
  const location = useLocation(); // 현재 URL 경로 확인용

  // 로그인 페이지에서는 Header·Footer 숨김
  const isLoginPage = location.pathname === '/login';

  return (
    <div>
      {!isLoginPage && <Header />}

      {/* URL 경로에 따라 해당 페이지 컴포넌트 렌더링 */}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/friends" element={<FriendPage />} />
        <Route path="/friends/:id" element={<FriendDetailPage />} />
      </Routes>

      {!isLoginPage && <Footer />}
    </div>
  );
}

export default App;