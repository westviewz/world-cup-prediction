import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import api from '../api';

const maskPhone = (phone = '') => {
  if (phone.length < 6) return phone;
  return `${phone.slice(0, 2)}${'X'.repeat(phone.length - 6)}${phone.slice(-4)}`;
};

const formatTime = (iso) =>
  new Date(iso).toLocaleString('en-IN', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  });

const LuckyDrawWinnerBanner = () => {
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/predictions/lucky-draw-winner')
      .then(res => setWinner(res.data.winner ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Fire celebratory confetti once winner is loaded
  useEffect(() => {
    if (!winner) return;
    const shoot = (angle, x) =>
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { x, y: 0.5 },
        angle,
        colors: ['#F4C542', '#FF6B35', '#ffffff', '#a78bfa', '#34d399'],
      });
    const t1 = setTimeout(() => { shoot(60, 0.2); shoot(120, 0.8); }, 400);
    const t2 = setTimeout(() => { shoot(80, 0.5); }, 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [winner]);

  if (loading || !winner) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
      className="px-4 py-6 max-w-2xl mx-auto"
    >
      <div
        className="relative rounded-3xl overflow-hidden p-8 text-center"
        style={{
          background:  'linear-gradient(135deg, rgba(26,8,16,0.95) 0%, rgba(40,12,24,0.98) 100%)',
          border:      '1px solid rgba(244,197,66,0.45)',
          boxShadow:   '0 0 80px rgba(244,197,66,0.18), 0 0 0 1px rgba(244,197,66,0.1) inset',
        }}
      >
        {/* Background shimmer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(244,197,66,0.12) 0%, transparent 65%)',
          }}
        />

        {/* Draw label */}
        <p
          className="relative text-[11px] font-black uppercase tracking-[0.35em] mb-4"
          style={{ color: 'rgba(244,197,66,0.7)' }}
        >
          ⭐ Football Gramam · Lucky Draw Winner ⭐
        </p>

        {/* Trophy */}
        <div className="relative inline-block mb-4">
          <div
            className="absolute inset-0 blur-3xl scale-150 rounded-full"
            style={{ background: 'rgba(244,197,66,0.25)' }}
          />
          <motion.span
            className="relative text-7xl sm:text-8xl select-none"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ filter: 'drop-shadow(0 0 30px rgba(244,197,66,0.9))' }}
          >
            🏆
          </motion.span>
        </div>

        {/* Winner name */}
        <motion.h2
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
          className="relative text-3xl sm:text-4xl font-black text-white mb-1 leading-tight"
        >
          {winner.name}
        </motion.h2>

        {/* Phone */}
        <p className="relative text-base font-mono text-gray-400 mb-6 tracking-wider">
          {maskPhone(winner.phone)}
        </p>

        {/* Divider */}
        <div
          className="relative w-24 h-px mx-auto mb-5"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(244,197,66,0.5), transparent)' }}
        />

        {/* Meta info pills */}
        <div className="relative flex flex-wrap justify-center gap-3 text-xs font-semibold">
          <span
            className="px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(244,197,66,0.1)', border: '1px solid rgba(244,197,66,0.25)', color: '#F4C542' }}
          >
            🎲 Selected by lucky draw
          </span>
          <span
            className="px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', color: '#34d399' }}
          >
            👥 From {winner.eligibleCount} eligible participant{winner.eligibleCount !== 1 ? 's' : ''}
          </span>
          <span
            className="px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)', color: '#a78bfa' }}
          >
            🕐 {formatTime(winner.drawTime)}
          </span>
        </div>

        {/* Prize label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-sm"
          style={{
            background: 'linear-gradient(135deg,#F9E2AE,#F4C542,#c9920a)',
            color: '#1A0810',
            boxShadow: '0 0 24px rgba(244,197,66,0.45)',
          }}
        >
          🍖 Wins a Full Goat Mandhi!
        </motion.div>
      </div>
    </motion.section>
  );
};

export default LuckyDrawWinnerBanner;
