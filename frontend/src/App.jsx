import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import IntroSequence from './components/IntroSequence';

function App() {
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-premium-dark text-white font-sans overflow-x-hidden">
        <Routes>
          <Route path="/" element={
            !introFinished ? (
              <IntroSequence onFinish={() => setIntroFinished(true)} />
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
