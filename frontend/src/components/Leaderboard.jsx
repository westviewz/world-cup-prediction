import React, { useEffect, useState } from 'react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Trophy, Star, Target, Shield } from 'lucide-react';
import { teamCodes } from '../utils/teams';

const Flag = ({ team, className = 'w-6 h-auto' }) => {
  const code = teamCodes[team];
  return code
    ? <img src={`https://flagcdn.com/w80/${code}.png`} alt={team} className={`object-cover rounded shadow-sm ${className}`} />
    : null;
};

// ─── Scoring rules data ───────────────────────────────────────
const SCORING_RULES = [
  { icon: '🏆', label: 'Correct Champion',    pts: '50 pts', desc: 'Predict the winning team' },
  { icon: '🥈', label: 'Correct Runner-up',   pts: '30 pts', desc: 'Predict the losing finalist' },
  { icon: '🎯', label: 'Exact Final Score',    pts: '100 pts', desc: 'Perfect scoreline prediction' },
  { icon: '⚡', label: 'Goal Difference',      pts: '20 pts', desc: 'Correct margin of victory*' },
];

// ─── Countdown digits ────────────────────────────────────────
const CountdownUnit = ({ value, label }) => (
  <div className="flip-box">
    <div className="flip-digit animate-glow">
      {String(value).padStart(2, '0')}
    </div>
    <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-400">{label}</span>
  </div>
);

const Leaderboard = () => {
  const [data,    setData]    = useState([]);
  const [locked,  setLocked]  = useState(true);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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
        if (err.response?.status === 403) setLocked(true);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();

    // Countdown to July 19 2026
    const target = new Date('2026-07-19T00:00:00Z').getTime();
    const interval = setInterval(() => {
      const dist = target - Date.now();
      if (dist < 0) { clearInterval(interval); return; }
      setTimeLeft({
        days:    Math.floor(dist / 86400000),
        hours:   Math.floor((dist % 86400000) / 3600000),
        minutes: Math.floor((dist % 3600000)  / 60000),
        seconds: Math.floor((dist % 60000)    / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return null;

  return (
    <>
      {/* ── How Scoring Works ── */}
      <section className="py-16 px-4 relative overflow-hidden">
        {/* BG glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-wc-burgundy/20 blur-3xl rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ color: '#F4C542' }}>TOURNAMENT SCORING</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">How Points Are Calculated</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SCORING_RULES.map((rule, i) => (
              <motion.div
                key={rule.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center group hover:scale-[1.03] transition-transform duration-300"
                style={{ border: '1px solid rgba(244,197,66,0.15)' }}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {rule.icon}
                </div>
                <div className="text-2xl font-black mb-1" style={{ color: '#F4C542' }}>{rule.pts}</div>
                <div className="font-bold text-white text-sm mb-1">{rule.label}</div>
                <div className="text-xs text-gray-400 leading-relaxed">{rule.desc}</div>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-500 mt-5">
            *Goal difference and exact score points are only awarded when the entire matchup is predicted correctly.
          </p>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── Leaderboard ── */}
      <section className="py-16 px-4 relative overflow-hidden">
        {/* Stadium BG glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-wc-gold/5 blur-3xl rounded-full" />
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-wc-gold/5 blur-3xl rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ color: '#F4C542' }}>RANKINGS</p>
            <h2 className="text-3xl sm:text-4xl font-black shimmer-text">Official Leaderboard</h2>
          </motion.div>

          {locked ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-10 sm:p-14 text-center max-w-3xl mx-auto"
            >
              {/* Lock icon */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="mb-8 flex justify-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-wc-gold/20 blur-xl rounded-full scale-150" />
                  <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center animate-glow"
                    style={{ background: 'rgba(244,197,66,0.1)', border: '1px solid rgba(244,197,66,0.4)' }}>
                    <Lock size={36} color="#F4C542" />
                  </div>
                </div>
              </motion.div>

              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">Leaderboard Locked</h3>
              <p className="text-gray-400 text-sm sm:text-base mb-10">
                Results will be revealed after the FIFA World Cup 2026 Final
              </p>

              {/* Countdown */}
              <div className="flex justify-center gap-3 sm:gap-5">
                <CountdownUnit value={timeLeft.days}    label="Days"    />
                <div className="text-2xl font-black self-center pb-6 opacity-40" style={{ color: '#F4C542' }}>:</div>
                <CountdownUnit value={timeLeft.hours}   label="Hours"   />
                <div className="text-2xl font-black self-center pb-6 opacity-40" style={{ color: '#F4C542' }}>:</div>
                <CountdownUnit value={timeLeft.minutes} label="Mins"    />
                <div className="text-2xl font-black self-center pb-6 opacity-40" style={{ color: '#F4C542' }}>:</div>
                <CountdownUnit value={timeLeft.seconds} label="Secs"    />
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {/* Table card */}
              <div className="glass-card rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr style={{ background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(244,197,66,0.15)' }}>
                        <th className="p-4 sm:p-5 text-xs font-bold uppercase tracking-widest" style={{ color: '#F4C542' }}>Rank</th>
                        <th className="p-4 sm:p-5 text-xs font-bold uppercase tracking-widest" style={{ color: '#F4C542' }}>Name</th>
                        <th className="p-4 sm:p-5 text-xs font-bold uppercase tracking-widest" style={{ color: '#F4C542' }}>Prediction</th>
                        <th className="p-4 sm:p-5 text-xs font-bold uppercase tracking-widest" style={{ color: '#F4C542' }}>Score</th>
                        <th className="p-4 sm:p-5 text-xs font-bold uppercase tracking-widest text-right" style={{ color: '#F4C542' }}>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((user, idx) => (
                        <motion.tr
                          key={user._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.07 }}
                          style={{
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                            background: idx === 0
                              ? 'rgba(244,197,66,0.08)'
                              : idx === 1
                                ? 'rgba(255,255,255,0.04)'
                                : idx === 2
                                  ? 'rgba(205,127,50,0.06)'
                                  : 'transparent',
                          }}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="p-4 sm:p-5">
                            <div className="flex items-center gap-2">
                              {idx === 0 && <span className="text-xl">🥇</span>}
                              {idx === 1 && <span className="text-xl">🥈</span>}
                              {idx === 2 && <span className="text-xl">🥉</span>}
                              {idx > 2  && <span className="font-bold text-gray-400 text-sm w-6 text-center">{idx + 1}</span>}
                            </div>
                          </td>
                          <td className="p-4 sm:p-5 font-bold text-white text-sm">{user.name}</td>
                          <td className="p-4 sm:p-5">
                            <div className="flex flex-col gap-1">
                              <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                                <Flag team={user.winner} className="w-5 h-auto rounded" />
                                {user.winner}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#F4C542' }}>vs</span>
                              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                                <Flag team={user.runnerUp} className="w-4 h-auto rounded grayscale opacity-60" />
                                {user.runnerUp}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 sm:p-5 font-bold text-gray-300 text-sm">{user.winnerGoals} – {user.runnerUpGoals}</td>
                          <td className="p-4 sm:p-5 text-right">
                            <span className="font-black text-lg" style={{ color: '#F4C542' }}>{user.points}</span>
                          </td>
                        </motion.tr>
                      ))}
                      {data.length === 0 && (
                        <tr>
                          <td colSpan="5" className="py-12 text-center text-gray-500 text-sm">No predictions yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Leaderboard;
