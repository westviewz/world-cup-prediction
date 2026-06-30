import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import IntroSequence from './components/IntroSequence';
import { clarity } from 'react-microsoft-clarity';

function App() {
  const [introFinished, setIntroFinished] = useState(() => {
    return localStorage.getItem('introFinished') === 'true';
  });

  useEffect(() => {
    clarity.init('xf5ii8acbi');
  }, []);

  const handleIntroFinish = () => {
    localStorage.setItem('introFinished', 'true');
    setIntroFinished(true);
  };

  return (
    <Router>
      <div className="min-h-screen text-white font-sans overflow-x-hidden" style={{ background: '#0D0507' }}>
        <Routes>
          <Route path="/" element={
            !introFinished ? (
              <IntroSequence onFinish={handleIntroFinish} />
            ) : (
              <Home />
            )
          } />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
