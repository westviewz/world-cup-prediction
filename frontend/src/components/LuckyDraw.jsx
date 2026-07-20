import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Shuffle, Users, Clock, ShieldCheck } from 'lucide-react';
import api from '../api';

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/** Mask middle digits of phone: 98XXXX1234 */
const maskPhone = (phone = '') => {
  if (phone.length < 6) return phone;
  const start  = phone.slice(0, 2);
  const end    = phone.slice(-4);
  const masked = 'X'.repeat(phone.length - 6);
  return `${start}${masked}${end}`;
};

/** Format ISO date to readable string */
const formatTime = (iso) =>
  new Date(iso).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  });

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

const InfoRow = ({ icon: Icon, label, value, color = '#F4C542' }) => (
  <div
    className="flex items-center gap-3 p-3 rounded-xl"
    style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)' }}
  >
    <div className="shrink-0 p-2 rounded-lg" style={{ background: `${color}18` }}>
      <Icon size={16} style={{ color }} />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{label}</p>
      <p className="text-sm font-bold text-white truncate">{value}</p>
    </div>
  </div>
);

/** Winner reveal card shown after animation */
const WinnerCard = ({ result, onReset, isResetting }) => {
  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      className="flex flex-col items-center gap-6"
    >
      {/* Trophy glow */}
      <div className="relative">
        <div
          className="absolute inset-0 rounded-full blur-3xl scale-150"
          style={{ background: 'radial-gradient(circle, rgba(244,197,66,0.35) 0%, transparent 70%)' }}
        />
        <span className="relative text-8xl drop-shadow-[0_0_40px_rgba(244,197,66,0.9)] select-none">
          🏆
        </span>
      </div>

      <div className="text-center">
        <p
          className="text-xs font-black uppercase tracking-[0.3em] mb-1"
          style={{ color: '#F4C542' }}
        >
          Lucky Draw Winner
        </p>
        <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
          {result.name}
        </h2>
      </div>

      {/* Details grid */}
      <div className="w-full max-w-sm space-y-2">
        <InfoRow icon={ShieldCheck} label="Phone Number"         value={maskPhone(result.phone)}         color="#F4C542" />
        <InfoRow icon={Clock}       label="Draw Time (IST)"      value={formatTime(result.drawTime)}     color="#a78bfa" />
        <InfoRow icon={Users}       label="Total Eligible"        value={`${result.eligibleCount} participants`} color="#34d399" />
        <InfoRow icon={ShieldCheck} label="Selection Method"     value={result.method}                   color="#60a5fa" />
      </div>

      {/* Reset button */}
      <button
        onClick={onReset}
        disabled={isResetting}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        style={{
          background: 'rgba(239,68,68,0.12)',
          border:     '1px solid rgba(239,68,68,0.3)',
          color:      '#f87171',
        }}
      >
        <RotateCcw size={14} className={isResetting ? 'animate-spin' : ''} />
        {isResetting ? 'Resetting…' : 'Reset Draw'}
      </button>
    </motion.div>
  );
};

/** Spinning name display during animation */
const SpinBox = ({ participant }) => (
  <AnimatePresence mode="popLayout">
    <motion.div
      key={participant?.name ?? 'empty'}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      exit={{    y:  20, opacity: 0 }}
      transition={{ duration: 0.08 }}
      className="text-center"
    >
      <p className="text-2xl sm:text-3xl font-black text-white">{participant?.name ?? '—'}</p>
      <p className="text-sm text-gray-400 mt-1">{maskPhone(participant?.phone ?? '')}</p>
    </motion.div>
  </AnimatePresence>
);

// ─────────────────────────────────────────────────────────────
// Main LuckyDraw component
// ─────────────────────────────────────────────────────────────
const LuckyDraw = () => {
  const [eligible,    setEligible]    = useState([]);   // all eligible participants
  const [topScore,    setTopScore]    = useState(0);
  const [result,      setResult]      = useState(null); // stored winner (or null)
  const [loading,     setLoading]     = useState(true);
  const [isDrawing,   setIsDrawing]   = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [displayed,   setDisplayed]   = useState(null); // participant shown during spin
  const [error,       setError]       = useState('');

  // ── Fetch eligible + result on mount ──────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [eligRes, resRes] = await Promise.all([
        api.get('/admin/lucky-draw/eligible'),
        api.get('/admin/lucky-draw/result'),
      ]);
      setEligible(eligRes.data.eligible ?? []);
      setTopScore(eligRes.data.topScore  ?? 0);
      setResult(resRes.data.result ?? null);
    } catch (err) {
      setError('Failed to load lucky draw data. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Fire confetti burst ────────────────────────────────────
  const fireConfetti = () => {
    const shoot = (angle, x) =>
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { x, y: 0.6 },
        angle,
        colors: ['#F4C542', '#FF6B35', '#ffffff', '#a78bfa', '#34d399'],
      });
    shoot(60, 0.25);
    shoot(120, 0.75);
    setTimeout(() => shoot(80, 0.5), 300);
  };

  // ── Animation engine ───────────────────────────────────────
  const runAnimation = (winner, pool) => {
    // Build frame schedule: starts at 60ms, slows to 320ms over ~4s
    const timeouts = [];
    let delay     = 0;
    let stepDelay = 60;
    const FRAMES  = 55;

    for (let i = 0; i < FRAMES; i++) {
      delay    += stepDelay;
      stepDelay = Math.min(320, stepDelay * 1.09);

      const isFinalFrame = i === FRAMES - 1;
      const frameDelay   = delay;

      timeouts.push(
        setTimeout(() => {
          if (isFinalFrame) {
            // Land on the backend-selected winner
            setDisplayed(winner);
            setTimeout(() => {
              setResult(winner);
              setIsDrawing(false);
              fireConfetti();
            }, 500);
          } else {
            // Pick a random participant visually (safe — only for display)
            const idx = Math.floor(Math.random() * pool.length);
            setDisplayed(pool[idx]);
          }
        }, frameDelay)
      );
    }

    return timeouts;
  };

  // ── Conduct Draw ───────────────────────────────────────────
  const handleDraw = async () => {
    if (isDrawing || result) return;
    setError('');
    setIsDrawing(true);

    try {
      // Backend selects the winner first — cryptographically secure
      const res    = await api.post('/admin/lucky-draw/draw');
      const winner = res.data;

      // Start visual animation using the already-determined winner
      runAnimation(winner, eligible);
    } catch (err) {
      setIsDrawing(false);
      setError(err.response?.data?.error ?? 'Draw failed. Please try again.');
    }
  };

  // ── Reset Draw ─────────────────────────────────────────────
  const handleReset = async () => {
    if (isResetting) return;
    if (!window.confirm('Are you sure you want to reset the draw? This cannot be undone.')) return;
    setIsResetting(true);
    setError('');
    try {
      await api.post('/admin/lucky-draw/reset');
      setResult(null);
      setDisplayed(null);
    } catch (err) {
      setError(err.response?.data?.error ?? 'Reset failed. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🎲</div>
          <p className="text-gray-400 text-sm font-medium">Loading lucky draw…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Error banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold"
          style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
        >
          ⚠️ {error}
        </motion.div>
      )}

      {/* ── Already drawn: show winner card ── */}
      {result && !isDrawing && (
        <div
          className="rounded-2xl p-8 flex flex-col items-center"
          style={{
            background:  'rgba(26,8,16,0.8)',
            border:      '1px solid rgba(244,197,66,0.25)',
            boxShadow:   '0 0 60px rgba(244,197,66,0.1)',
          }}
        >
          <WinnerCard result={result} onReset={handleReset} isResetting={isResetting} />
        </div>
      )}

      {/* ── Drawing animation ── */}
      {isDrawing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl p-10 flex flex-col items-center gap-6"
          style={{
            background: 'rgba(26,8,16,0.85)',
            border:     '1px solid rgba(244,197,66,0.3)',
            boxShadow:  '0 0 80px rgba(244,197,66,0.15)',
          }}
        >
          <div className="text-5xl animate-spin">🎲</div>
          <p
            className="text-xs font-black uppercase tracking-[0.3em]"
            style={{ color: '#F4C542' }}
          >
            Selecting Winner…
          </p>

          {/* Spin box */}
          <div
            className="w-full max-w-xs min-h-[80px] flex items-center justify-center rounded-2xl px-6 py-5"
            style={{
              background: 'rgba(244,197,66,0.07)',
              border:     '2px solid rgba(244,197,66,0.35)',
            }}
          >
            <SpinBox participant={displayed} />
          </div>
        </motion.div>
      )}

      {/* ── Pre-draw view ── */}
      {!result && !isDrawing && (
        <>
          {/* Header */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: 'rgba(26,8,16,0.7)',
              border:     '1px solid rgba(244,197,66,0.15)',
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎲</span>
                <div>
                  <h2 className="text-lg font-black" style={{ color: '#F4C542' }}>
                    Lucky Draw
                  </h2>
                  <p className="text-xs text-gray-400">
                    {eligible.length > 0
                      ? `${eligible.length} participant${eligible.length !== 1 ? 's' : ''} eligible · ${topScore} pts each`
                      : 'No eligible participants yet'}
                  </p>
                </div>
              </div>

              {/* Conduct Draw button */}
              <div className="sm:ml-auto">
                {eligible.length === 0 ? (
                  <div
                    className="px-5 py-3 rounded-xl text-sm font-bold text-center"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border:     '1px solid rgba(255,255,255,0.1)',
                      color:      '#6b7280',
                    }}
                  >
                    No participants to draw
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleDraw}
                    className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm transition-all"
                    style={{
                      background: 'linear-gradient(135deg,#F9E2AE,#F4C542,#c9920a)',
                      color:      '#1A0810',
                      boxShadow:  '0 0 28px rgba(244,197,66,0.45)',
                    }}
                  >
                    <Shuffle size={16} />
                    🎲 Conduct Lucky Draw
                  </motion.button>
                )}
              </div>
            </div>

            {/* Eligible participants table */}
            {eligible.length > 0 ? (
              <div className="overflow-x-auto -mx-1 px-1">
                <table className="w-full text-left border-collapse" style={{ minWidth: '420px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      {['#', 'Name', 'Phone', 'Submitted At', 'Points'].map(h => (
                        <th key={h} className="pb-3 pr-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {eligible.map((p, i) => (
                      <tr
                        key={p._id ?? i}
                        className="hover:bg-white/[0.03] transition-colors"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      >
                        <td className="py-3 pr-4 text-sm text-gray-500 font-bold">{i + 1}</td>
                        <td className="py-3 pr-4 text-sm font-semibold text-white whitespace-nowrap">{p.name}</td>
                        <td className="py-3 pr-4 text-sm text-gray-400 whitespace-nowrap font-mono">
                          {maskPhone(p.phone)}
                        </td>
                        <td className="py-3 pr-4 text-sm text-gray-400 whitespace-nowrap">
                          {formatTime(p.createdAt)}
                        </td>
                        <td className="py-3 text-sm font-black whitespace-nowrap" style={{ color: '#F4C542' }}>
                          {p.points} pts
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-10 text-center text-gray-500 text-sm">
                No participants with scored predictions found.<br />
                Set the actual match result in Settings first.
              </div>
            )}
          </div>

          {/* Already-selected notice when draw is done (edge case: fast refresh) */}
          {result && (
            <div
              className="px-4 py-3 rounded-xl text-sm font-semibold text-center"
              style={{
                background: 'rgba(244,197,66,0.08)',
                border:     '1px solid rgba(244,197,66,0.25)',
                color:      '#F4C542',
              }}
            >
              ✅ Winner has already been selected.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LuckyDraw;
