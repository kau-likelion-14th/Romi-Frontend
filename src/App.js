import React from 'react';
import './App.css';
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import MainPage from './pages/Mainpage/MainPage.js';
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
    <div>
      <Header />

      <Routes>
        <Route path="/" element= {<MainPage />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;