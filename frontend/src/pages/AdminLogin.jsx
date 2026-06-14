import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/admin/login', { username, password });
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0D0507 0%, #1A0810 50%, #0D0507 100%)' }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-wc-crimson/15 blur-3xl rounded-full" />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120 }}
        className="glass-card rounded-3xl p-8 sm:p-12 w-full max-w-md relative z-10"
        style={{ border: '1px solid rgba(244,197,66,0.25)' }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4 animate-float">🔐</div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Admin Portal</h2>
          <p className="text-gray-400 text-sm mt-1">FIFA World Cup 2026 Predictor</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 px-4 py-3 rounded-xl text-sm font-medium text-red-300 text-center"
            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' }}
          >
            ⚠️ {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all text-sm"
              style={{
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              placeholder="Enter username"
              onFocus={e => { e.target.style.borderColor = 'rgba(244,197,66,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(244,197,66,0.08)'; }}
              onBlur={e  => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all text-sm"
              style={{
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              placeholder="Enter password"
              onFocus={e => { e.target.style.borderColor = 'rgba(244,197,66,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(244,197,66,0.08)'; }}
              onBlur={e  => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-black text-base transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 mt-2"
            style={{
              background: 'linear-gradient(135deg,#F9E2AE,#F4C542,#c9920a)',
              color: '#1A0810',
              boxShadow: '0 0 30px rgba(244,197,66,0.4)',
            }}
          >
            {loading ? '⏳ Logging in...' : '🔑 Login to Dashboard'}
          </button>
        </form>

        <button
          onClick={() => navigate('/')}
          className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          ← Back to Predictions
        </button>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
