import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Users, TrendingUp, Settings as SettingsIcon, LogOut, Trophy } from 'lucide-react';
import api from '../api';
import { teamFlags, teamCodes } from '../utils/teams';

const Flag = ({ team, className = "w-6 h-4" }) => {
  const code = teamCodes[team];
  return code ? <img src={`https://flagcdn.com/w80/${code}.png`} alt={team} className={`inline-block object-cover shadow-sm ${className}`} /> : null;
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalPredictions: 0, mostPredictedWinner: 'N/A', mostPredictedRunnerUp: 'N/A', mostPredictedScore: 'N/A' });
  const [predictions, setPredictions] = useState([]);
  const [settings, setSettings] = useState({ leaderboardUnlocked: false, actualWinner: '', actualRunnerUp: '', actualWinnerGoals: null, actualRunnerUpGoals: null });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      const statsRes = await api.get('/admin/dashboard');
      setStats(statsRes.data);
      
      const settingsRes = await api.get('/admin/settings');
      if (settingsRes.data) setSettings(prev => ({ ...prev, ...settingsRes.data }));
      
      fetchPredictions('');
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPredictions = async (searchQuery) => {
    try {
      const res = await api.get(`/admin/predictions?search=${searchQuery}`);
      setPredictions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchPredictions(e.target.value);
  };

  const handleExportCSV = async () => {
    try {
      const res = await api.get('/admin/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'predictions.csv');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert('Error exporting CSV');
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    try {
      await api.put('/admin/settings', settings);
      alert('Settings updated successfully!');
      fetchPredictions(search); // Refresh predictions as points might have been recalculated
    } catch (err) {
      alert('Error updating settings');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  if (loading) return <div className="min-h-screen bg-premium-dark text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-premium-dark text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-premium-gold">Admin Dashboard</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 text-red-500 hover:bg-red-600/40 transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass p-6 rounded-2xl flex items-center gap-4 border-l-4 border-premium-gold">
            <div className="p-4 bg-premium-gold/20 rounded-xl text-premium-gold">
              <Users size={32} />
            </div>
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wide">Total</p>
              <p className="text-2xl font-bold">{stats.totalPredictions}</p>
            </div>
          </div>
          <div className="glass p-6 rounded-2xl flex items-center gap-4 border-l-4 border-premium-purple">
            <div className="p-4 bg-premium-purple/20 rounded-xl text-premium-purple">
              <TrendingUp size={32} />
            </div>
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wide">Top Winner</p>
              <p className="text-xl font-bold truncate max-w-[120px]">{stats.mostPredictedWinner}</p>
            </div>
          </div>
          <div className="glass p-6 rounded-2xl flex items-center gap-4 border-l-4 border-gray-400">
            <div className="p-4 bg-gray-400/20 rounded-xl text-gray-400">
              <TrendingUp size={32} />
            </div>
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wide">Top Runner-up</p>
              <p className="text-xl font-bold truncate max-w-[120px]">{stats.mostPredictedRunnerUp}</p>
            </div>
          </div>
          <div className="glass p-6 rounded-2xl flex items-center gap-4 border-l-4 border-blue-500">
            <div className="p-4 bg-blue-500/20 rounded-xl text-blue-500">
              <Trophy size={32} />
            </div>
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wide">Top Score</p>
              <p className="text-2xl font-bold">{stats.mostPredictedScore}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Settings Panel */}
          <div className="glass p-6 rounded-2xl lg:col-span-1 h-fit">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-premium-goldLight">
              <SettingsIcon size={20} /> Settings & Results
            </h2>
            <form onSubmit={handleUpdateSettings} className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/5">
                <span className="font-medium">Leaderboard Visible</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.leaderboardUnlocked} onChange={e => setSettings({...settings, leaderboardUnlocked: e.target.checked})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-premium-gold"></div>
                </label>
              </div>

              <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-4">
                <h3 className="font-medium text-sm text-gray-400 uppercase tracking-widest">Set Actual Results (Calculates Points)</h3>
                 <div>
                  <label className="block text-xs mb-1">Actual Winner</label>
                  <select value={settings.actualWinner ?? ''} onChange={e => setSettings({...settings, actualWinner: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-2 focus:border-premium-gold outline-none">
                    <option value="">Select Winner</option>
                    {Object.keys(teamFlags).map(team => (
                      <option key={team} value={team}>{team} {teamFlags[team]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs mb-1">Actual Runner-up</label>
                  <select value={settings.actualRunnerUp ?? ''} onChange={e => setSettings({...settings, actualRunnerUp: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-2 focus:border-premium-gold outline-none">
                    <option value="">Select Runner-up</option>
                    {Object.keys(teamFlags).map(team => (
                      <option key={team} value={team}>{team} {teamFlags[team]}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs mb-1">Winner Goals</label>
                    <input type="number" value={settings.actualWinnerGoals ?? ''} onChange={e => setSettings({...settings, actualWinnerGoals: e.target.value === '' ? null : parseInt(e.target.value)})} className="w-full bg-black border border-white/10 rounded-lg p-2 focus:border-premium-gold outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Runner-up Goals</label>
                    <input type="number" value={settings.actualRunnerUpGoals ?? ''} onChange={e => setSettings({...settings, actualRunnerUpGoals: e.target.value === '' ? null : parseInt(e.target.value)})} className="w-full bg-black border border-white/10 rounded-lg p-2 focus:border-premium-gold outline-none" />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full py-3 bg-premium-gold text-black font-bold rounded-xl hover:bg-premium-goldLight transition-colors">
                Save & Recalculate
              </button>
            </form>
          </div>

          {/* Predictions Table */}
          <div className="glass p-6 rounded-2xl lg:col-span-2">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-premium-goldLight">Submissions</h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <input 
                  type="text" 
                  placeholder="Search name or phone..." 
                  value={search}
                  onChange={handleSearch}
                  className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 focus:border-premium-gold outline-none w-full sm:w-64"
                />
                <button onClick={handleExportCSV} className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-colors whitespace-nowrap">
                  <Download size={18} /> Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-400 border-b border-white/10 text-sm">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Phone</th>
                    <th className="pb-3 font-medium">Prediction</th>
                    <th className="pb-3 font-medium">Score</th>
                    <th className="pb-3 font-medium text-right">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map(p => (
                    <tr key={p._id} className="border-b border-white/5 hover:bg-white/5 text-sm">
                      <td className="py-3 pr-2">{p.name}</td>
                      <td className="py-3 pr-2">{p.phone}</td>
                      <td className="py-3 pr-2 flex items-center gap-2">
                        <span className="text-premium-gold flex items-center gap-1"><Flag team={p.winner} className="w-5 rounded-sm" /> {p.winner}</span>
                        <span className="mx-1 text-gray-500">vs</span>
                        <span className="text-gray-400 flex items-center gap-1"><Flag team={p.runnerUp} className="w-5 rounded-sm grayscale opacity-70" /> {p.runnerUp}</span>
                      </td>
                      <td className="py-3 pr-2">{p.winnerGoals} - {p.runnerUpGoals}</td>
                      <td className="py-3 text-right font-bold text-premium-gold">{p.points}</td>
                    </tr>
                  ))}
                  {predictions.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-gray-500">No predictions found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
