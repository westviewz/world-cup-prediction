import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Users, TrendingUp, Settings as SettingsIcon, LogOut, Trophy, Search } from 'lucide-react';
import api from '../api';
import { teamCodes } from '../utils/teams';
import { qualifiedTeams } from '../utils/bracketData';
import LuckyDraw from '../components/LuckyDraw';

const Flag = ({ team, className = 'w-5 h-auto' }) => {
  const code = teamCodes[team];
  return code
    ? <img src={`https://flagcdn.com/w80/${code}.png`} alt={team} className={`inline-block object-cover rounded shadow-sm ${className}`} />
    : null;
};

// ── Stat Card ──────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, accentColor }) => (
  <div
    className="flex items-center gap-4 p-4 rounded-2xl"
    style={{
      background: 'rgba(26,8,16,0.7)',
      border: `1px solid ${accentColor}33`,
      borderLeft: `4px solid ${accentColor}`,
    }}
  >
    <div className="shrink-0 p-3 rounded-xl" style={{ background: `${accentColor}22` }}>
      <Icon size={24} style={{ color: accentColor }} />
    </div>
    <div className="min-w-0">
      <p className="text-gray-400 text-xs uppercase tracking-wide font-medium">{label}</p>
      <p className="font-bold text-white text-lg leading-tight truncate">{value}</p>
    </div>
  </div>
);

// ── Input ──────────────────────────────────────────────────────
const Input = ({ label, ...props }) => (
  <div>
    {label && <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">{label}</label>}
    <input
      {...props}
      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-wc-gold transition-colors"
    />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div>
    {label && <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">{label}</label>}
    <select
      {...props}
      className="w-full bg-black/70 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-wc-gold transition-colors appearance-none"
    >
      {children}
    </select>
  </div>
);

// ──────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPredictions: 0,
    mostPredictedWinner: 'N/A',
    mostPredictedRunnerUp: 'N/A',
    mostPredictedScore: 'N/A',
  });
  const [predictions, setPredictions] = useState([]);
  const [settings, setSettings] = useState({
    predictionsOpen: true,
    leaderboardUnlocked: false,
    actualWinner: '',
    actualRunnerUp: '',
    actualWinnerGoals: null,
    actualRunnerUpGoals: null,
  });
  const [search,  setSearch]  = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('submissions'); // 'submissions' | 'settings' | 'lucky-draw'
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      const statsRes    = await api.get('/admin/dashboard');
      setStats(statsRes.data);
      const settingsRes = await api.get('/admin/settings');
      if (settingsRes.data) setSettings(prev => ({ ...prev, ...settingsRes.data }));
      fetchPredictions('');
    } catch (err) {
      if (err.response?.status === 401) navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const fetchPredictions = async (q) => {
    try {
      const res = await api.get(`/admin/predictions?search=${q}`);
      setPredictions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchPredictions(e.target.value);
  };

  const handleExportCSV = async () => {
    try {
      const res  = await api.get('/admin/export', { responseType: 'blob' });
      const url  = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href  = url;
      link.setAttribute('download', 'predictions.csv');
      document.body.appendChild(link);
      link.click();
    } catch {
      alert('Error exporting CSV');
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    try {
      await api.put('/admin/settings', settings);
      alert('Settings updated successfully!');
      fetchPredictions(search);
    } catch {
      alert('Error updating settings');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D0507' }}>
        <div className="text-center">
          <div className="text-4xl mb-4 animate-float">⚙️</div>
          <p className="text-gray-400 font-medium">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-white"
      style={{ background: 'linear-gradient(180deg,#0D0507 0%,#1A0810 50%,#0D0507 100%)' }}
    >
      {/* ── Top Nav ── */}
      <div
        className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between gap-3"
        style={{
          background: 'rgba(13,5,7,0.9)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(244,197,66,0.12)',
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl shrink-0">⚙️</span>
          <div className="min-w-0">
            <h1 className="font-black text-base sm:text-lg leading-tight" style={{ color: '#F4C542' }}>
              Admin Dashboard
            </h1>
            <p className="text-gray-500 text-xs hidden sm:block">FIFA World Cup 2026 Predictor</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
          style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      <div className="px-4 py-6 max-w-6xl mx-auto space-y-6">

        {/* ── Stats Grid: 2 cols on mobile, 4 on md ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={Users}      label="Total"       value={stats.totalPredictions}     accentColor="#F4C542" />
          <StatCard icon={TrendingUp} label="Top Winner"  value={stats.mostPredictedWinner}  accentColor="#FF6B35" />
          <StatCard icon={TrendingUp} label="Top Runner"  value={stats.mostPredictedRunnerUp} accentColor="#9ca3af" />
          <StatCard icon={Trophy}     label="Top Score"   value={stats.mostPredictedScore}   accentColor="#3b82f6" />
        </div>

        {/* ── Tab Switcher (all screen sizes) ── */}
        <div
          className="flex rounded-2xl p-1 gap-1"
          style={{ background: 'rgba(26,8,16,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {['submissions', 'settings', 'lucky-draw'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{
                background: activeTab === tab ? 'rgba(244,197,66,0.15)' : 'transparent',
                color:      activeTab === tab ? '#F4C542' : '#6b7280',
                border:     activeTab === tab ? '1px solid rgba(244,197,66,0.35)' : '1px solid transparent',
              }}
            >
              {tab === 'submissions' ? '📋 Submissions' : tab === 'settings' ? '⚙️ Settings' : '🎲 Lucky Draw'}
            </button>
          ))}
        </div>

        {/* ── Main content: side-by-side on lg, tabbed on mobile ── */}
        {/* Lucky Draw takes full width when active */}
        {activeTab === 'lucky-draw' ? (
          <div
            className="rounded-2xl p-5"
            style={{
              background: 'rgba(26,8,16,0.7)',
              border: '1px solid rgba(244,197,66,0.12)',
            }}
          >
            <h2 className="text-base font-black mb-5 flex items-center gap-2" style={{ color: '#F4C542' }}>
              🎲 Lucky Draw
            </h2>
            <LuckyDraw />
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Settings Panel */}
          <div
            className={`lg:col-span-1 ${activeTab === 'settings' ? 'block' : 'hidden lg:block'}`}
          >
            <div
              className="rounded-2xl p-5 h-fit"
              style={{
                background: 'rgba(26,8,16,0.7)',
                border: '1px solid rgba(244,197,66,0.15)',
              }}
            >
              <h2 className="text-base font-black mb-5 flex items-center gap-2" style={{ color: '#F4C542' }}>
                <SettingsIcon size={18} /> Settings &amp; Results
              </h2>

              <form onSubmit={handleUpdateSettings} className="space-y-4">
                {/* Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    className="flex items-center justify-between p-3.5 rounded-xl"
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <span className="font-semibold text-sm">Accepting Predictions</span>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={settings.predictionsOpen}
                        onChange={async e => {
                          const val = e.target.checked;
                          const newSettings = { ...settings, predictionsOpen: val };
                          setSettings(newSettings);
                          try { await api.put('/admin/settings', newSettings); } catch (err) { alert('Error updating settings'); }
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-wc-gold" />
                    </label>
                  </div>

                  <div
                    className="flex items-center justify-between p-3.5 rounded-xl"
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <span className="font-semibold text-sm">Leaderboard Visible</span>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={settings.leaderboardUnlocked}
                        onChange={async e => {
                          const val = e.target.checked;
                          const newSettings = { ...settings, leaderboardUnlocked: val };
                          setSettings(newSettings);
                          try { await api.put('/admin/settings', newSettings); } catch (err) { alert('Error updating settings'); }
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-wc-gold" />
                    </label>
                  </div>
                </div>

                {/* Actual results */}
                <div
                  className="p-4 rounded-xl space-y-3"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Set Actual Results</p>

                  <Select
                    label="Actual Winner"
                    value={settings.actualWinner ?? ''}
                    onChange={e => setSettings({ ...settings, actualWinner: e.target.value })}
                  >
                    <option value="">Select Winner</option>
                    {qualifiedTeams.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </Select>

                  <Select
                    label="Actual Runner-up"
                    value={settings.actualRunnerUp ?? ''}
                    onChange={e => setSettings({ ...settings, actualRunnerUp: e.target.value })}
                  >
                    <option value="">Select Runner-up</option>
                    {qualifiedTeams.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </Select>

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Winner Goals"
                      type="number"
                      value={settings.actualWinnerGoals ?? ''}
                      onChange={e => setSettings({ ...settings, actualWinnerGoals: e.target.value === '' ? null : parseInt(e.target.value) })}
                    />
                    <Input
                      label="Runner Goals"
                      type="number"
                      value={settings.actualRunnerUpGoals ?? ''}
                      onChange={e => setSettings({ ...settings, actualRunnerUpGoals: e.target.value === '' ? null : parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-black text-sm transition-all hover:scale-[1.02] active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg,#F9E2AE,#F4C542,#c9920a)',
                    color: '#1A0810',
                    boxShadow: '0 0 20px rgba(244,197,66,0.3)',
                  }}
                >
                  💾 Save &amp; Recalculate
                </button>
              </form>
            </div>
          </div>

          {/* Submissions Table */}
          <div
            className={`lg:col-span-2 lg:block ${activeTab === 'submissions' ? 'block' : 'hidden'}`}
          >
            <div
              className="rounded-2xl p-5"
              style={{
                background: 'rgba(26,8,16,0.7)',
                border: '1px solid rgba(244,197,66,0.12)',
              }}
            >
              {/* Table header bar */}
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <h2 className="font-black text-base" style={{ color: '#F4C542' }}>
                  📋 Submissions <span className="text-gray-500 font-normal text-sm">({predictions.length})</span>
                </h2>
                <div className="flex gap-2 sm:ml-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search name or phone…"
                      value={search}
                      onChange={handleSearch}
                      className="w-full sm:w-52 pl-9 pr-3 py-2 text-sm rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors"
                      style={{
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                      onFocus={e  => { e.target.style.borderColor = 'rgba(244,197,66,0.6)'; }}
                      onBlur={e   => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                    />
                  </div>
                  <button
                    onClick={handleExportCSV}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#d1d5db' }}
                  >
                    <Download size={14} />
                    <span>CSV</span>
                  </button>
                </div>
              </div>

              {/* Scrollable table */}
              <div className="overflow-x-auto -mx-1 px-1">
                <table className="w-full text-left border-collapse" style={{ minWidth: '520px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <th className="pb-3 pr-3 text-xs font-bold uppercase tracking-wider text-gray-500">Name</th>
                      <th className="pb-3 pr-3 text-xs font-bold uppercase tracking-wider text-gray-500">Phone</th>
                      <th className="pb-3 pr-3 text-xs font-bold uppercase tracking-wider text-gray-500">Prediction</th>
                      <th className="pb-3 pr-3 text-xs font-bold uppercase tracking-wider text-gray-500">Score</th>
                      <th className="pb-3 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {predictions.map((p, i) => (
                      <tr
                        key={p._id}
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                        className="hover:bg-white/[0.03] transition-colors"
                      >
                        <td className="py-3 pr-3 text-sm font-semibold text-white whitespace-nowrap">{p.name}</td>
                        <td className="py-3 pr-3 text-sm text-gray-400 whitespace-nowrap">{p.phone}</td>
                        <td className="py-3 pr-3">
                          <div className="flex flex-col gap-0.5">
                            <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#F4C542' }}>
                              <Flag team={p.winner} className="w-4 h-auto rounded" />
                              {p.winner}
                            </span>
                            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-wider pl-1">vs</span>
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <Flag team={p.runnerUp} className="w-4 h-auto rounded grayscale opacity-60" />
                              {p.runnerUp}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 pr-3 text-sm font-bold text-gray-300 whitespace-nowrap">{p.winnerGoals}–{p.runnerUpGoals}</td>
                        <td className="py-3 text-right font-black text-base whitespace-nowrap" style={{ color: '#F4C542' }}>
                          {p.points ?? '—'}
                        </td>
                      </tr>
                    ))}
                    {predictions.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-12 text-center text-gray-500 text-sm">
                          No predictions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
        )} {/* end lucky-draw ternary */}
      </div>
    </div>
  );
};

export default AdminDashboard;
