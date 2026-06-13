import React, { useEffect, useState } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { Lock, Trophy } from 'lucide-react';
import { teamCodes } from '../utils/teams';

const Flag = ({ team, className = "w-6 h-4" }) => {
  const code = teamCodes[team];
  return code ? <img src={`https://flagcdn.com/w80/${code}.png`} alt={team} className={`inline-block object-cover shadow-sm ${className}`} /> : null;
};
const Leaderboard = () => {
  const [data, setData] = useState([]);
  const [locked, setLocked] = useState(true);
  const [loading, setLoading] = useState(true);

  // Hardcoded for demo: Days, Hours, Minutes, Seconds until World Cup Final (e.g., July 19, 2026)
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/predictions/leaderboard');
        if (res.data.locked) {
          setLocked(true);
        } else {
          setLocked(false);
          setData(res.data.leaderboard);
        }
      } catch (err) {
        if (err.response?.status === 403) {
          setLocked(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();

    // Countdown timer logic
    const targetDate = new Date('2026-07-19T00:00:00Z').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return null;

  return (
    <section className="py-20 px-4 bg-black/50 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-premium-goldLight to-premium-gold">
          Official Leaderboard
        </h2>

        {locked ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-12 text-center border-white/10"
          >
            <Lock size={64} className="mx-auto text-premium-gold mb-6 opacity-50" />
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Leaderboard Unlocks After World Cup Final</h3>
            
            <div className="flex justify-center gap-4 md:gap-8 mt-8">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-premium-dark rounded-2xl border border-white/20 flex items-center justify-center text-3xl md:text-4xl font-bold text-premium-gold shadow-lg">
                    {value.toString().padStart(2, '0')}
                  </div>
                  <span className="text-sm text-gray-400 mt-2 uppercase tracking-widest">{unit}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <div className="glass rounded-2xl p-6 border border-white/10">
              <h3 className="text-premium-gold font-bold mb-4 flex items-center gap-2"><Trophy size={18} /> Scoring Rules</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5"><span className="text-gray-400 block mb-1">Correct Winner</span><span className="font-bold text-premium-gold">+50 pts</span></div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5"><span className="text-gray-400 block mb-1">Correct Runner-up</span><span className="font-bold text-premium-gold">+30 pts</span></div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5"><span className="text-gray-400 block mb-1">Exact Score*</span><span className="font-bold text-premium-gold">+100 pts</span></div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5"><span className="text-gray-400 block mb-1">Goal Difference*</span><span className="font-bold text-premium-gold">+20 pts</span></div>
              </div>
              <p className="text-xs text-gray-500 mt-4">*Score points are only awarded if the entire matchup is predicted correctly.</p>
            </div>

            <div className="glass rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/40 text-premium-goldLight border-b border-white/10">
                    <th className="p-4 md:p-6 font-semibold">Rank</th>
                    <th className="p-4 md:p-6 font-semibold">Name</th>
                    <th className="p-4 md:p-6 font-semibold">Predicted Matchup</th>
                    <th className="p-4 md:p-6 font-semibold">Score</th>
                    <th className="p-4 md:p-6 font-semibold text-right">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((user, idx) => (
                    <motion.tr 
                      key={user._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`border-b border-white/5 hover:bg-white/5 transition-colors ${idx < 3 ? 'bg-premium-gold/10' : ''}`}
                    >
                      <td className="p-4 md:p-6 flex items-center gap-3">
                        {idx === 0 && <Trophy size={20} className="text-premium-gold" />}
                        {idx === 1 && <Trophy size={20} className="text-gray-400" />}
                        {idx === 2 && <Trophy size={20} className="text-amber-700" />}
                        <span className={`font-bold ${idx < 3 ? 'text-lg' : ''}`}>{idx + 1}</span>
                      </td>
                      <td className="p-4 md:p-6 font-medium">{user.name}</td>
                      <td className="p-4 md:p-6 text-gray-300 flex items-center gap-2 whitespace-nowrap">
                        <span className="text-white flex items-center gap-2 font-medium"><Flag team={user.winner} className="w-6 rounded-sm" /> {user.winner}</span>
                        <span className="text-xs text-premium-gold uppercase mx-1">vs</span>
                        <span className="text-gray-400 flex items-center gap-2"><Flag team={user.runnerUp} className="w-5 rounded-sm grayscale opacity-70" /> {user.runnerUp}</span>
                      </td>
                      <td className="p-4 md:p-6 text-gray-400">{user.winnerGoals} - {user.runnerUpGoals}</td>
                      <td className="p-4 md:p-6 font-bold text-premium-gold text-right">{user.points}</td>
                    </motion.tr>
                  ))}
                  {data.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500">No predictions yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Leaderboard;
