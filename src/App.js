import React from 'react';
import './App.css';
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import MainPage from './pages/Mainpage/MainPage.js';
import LoginPage from './pages/LoginPage/LoginPage.js';
import MyPage from "./pages/MyPage/MyPage.js";
import { Routes, Route, useLocation } from 'react-router-dom';


function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div>
      {!isLoginPage && <Header />}

      <Routes>
        <Route path="/" element= {<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
      {!isLoginPage && <Footer />}
    </div>
  );
}

export default App;