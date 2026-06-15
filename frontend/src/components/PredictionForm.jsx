import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import api from '../api';
import { teams, teamCodes } from '../utils/teams';
import { User, Phone, Trophy, ChevronUp, ChevronDown, CheckCircle2, Search } from 'lucide-react';

// ─── Flag Image ───────────────────────────────────────────────
const Flag = ({ team, className = 'w-8 h-auto' }) => {
  const code = teamCodes[team];
  return code
    ? <img src={`https://flagcdn.com/w80/${code}.png`} alt={team} className={`object-cover rounded shadow-sm ${className}`} />
    : null;
};

// ─── Stepper ─────────────────────────────────────────────────
const steps = [
  { num: 1, icon: '👤', label: 'Details' },
  { num: 2, icon: '🏆', label: 'Winner' },
  { num: 3, icon: '🥈', label: 'Runner-up' },
  { num: 4, icon: '🎯', label: 'Score' },
];

const StepIndicator = ({ step }) => (
  <div className="flex items-center w-full mb-10">
    {steps.map((s, idx) => (
      <React.Fragment key={s.num}>
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <motion.div
            animate={{
              scale:      step === s.num ? 1.15 : 1,
              background: step > s.num
                ? 'linear-gradient(135deg,#16a34a,#22c55e)'
                : step === s.num
                  ? 'linear-gradient(135deg,#F9E2AE,#F4C542)'
                  : 'rgba(255,255,255,0.07)',
              boxShadow: step === s.num
                ? '0 0 20px rgba(244,197,66,0.6)'
                : 'none',
            }}
            transition={{ duration: 0.3 }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border"
            style={{
              borderColor: step > s.num
                ? '#22c55e'
                : step === s.num
                  ? '#F4C542'
                  : 'rgba(255,255,255,0.12)',
              color: step >= s.num ? '#1A0810' : '#6b7280',
            }}
          >
            {step > s.num ? '✓' : s.icon}
          </motion.div>
          <span className={`text-[10px] font-semibold tracking-wide hidden sm:block ${step >= s.num ? 'text-wc-champagne' : 'text-gray-600'}`}>
            {s.label}
          </span>
        </div>
        {idx < steps.length - 1 && (
          <div className="flex-1 mx-1.5 h-px relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div
              className="absolute inset-y-0 left-0"
              style={{ background: 'linear-gradient(90deg,#7A1423,#F4C542)' }}
              animate={{ width: step > s.num ? '100%' : '0%' }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>
        )}
      </React.Fragment>
    ))}
  </div>
);

// ─── Score stepper ────────────────────────────────────────────
const ScoreStepper = ({ team, value, onChange, isWinner }) => (
  <div className="flex flex-col items-center gap-3">
    {/* Team card */}
    <div
      className="relative flex flex-col items-center justify-center gap-1.5 rounded-2xl p-3 w-28 sm:w-40 h-32 sm:h-44 overflow-hidden"
      style={{
        background: isWinner
          ? 'linear-gradient(180deg,rgba(244,197,66,0.15) 0%,rgba(26,8,16,0.9) 100%)'
          : 'rgba(26,8,16,0.8)',
        border: `1px solid ${isWinner ? 'rgba(244,197,66,0.5)' : 'rgba(255,255,255,0.12)'}`,
        boxShadow: isWinner ? '0 0 25px rgba(244,197,66,0.2)' : 'none',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-1"
        style={{ background: isWinner ? 'linear-gradient(90deg,transparent,#F4C542,transparent)' : 'none' }} />
      <Flag team={team} className="w-12 sm:w-16 h-auto rounded-lg shadow-lg" />
      <span className="text-[10px] sm:text-xs font-bold text-white text-center leading-tight break-words max-w-full">{team}</span>
      <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: isWinner ? '#F4C542' : '#9ca3af' }}>
        {isWinner ? 'WINNER' : 'RUNNER-UP'}
      </span>
    </div>

    {/* Score input + steppers */}
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, (value || 0) + 1))}
        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{ background: 'rgba(244,197,66,0.15)', border: '1px solid rgba(244,197,66,0.3)' }}
      >
        <ChevronUp size={20} color="#F4C542" />
      </button>

      <div className="relative flex justify-center w-full">
        <input
          type="number"
          min="0"
          value={value === '' ? '' : value}
          onChange={e => onChange(e.target.value === '' ? '' : parseInt(e.target.value))}
          className="score-input"
        />
        {value === '' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span 
              className="text-[10px] sm:text-xs font-black uppercase text-center leading-tight tracking-[0.1em]" 
              style={{ color: 'rgba(244,197,66,0.35)', textShadow: 'none' }}
            >
              Enter<br/>Score
            </span>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => onChange(Math.max(0, (value || 0) - 1))}
        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
      >
        <ChevronDown size={20} color="#9ca3af" />
      </button>
    </div>
  </div>
);

// ─── Main PredictionForm ──────────────────────────────────────
const PredictionForm = () => {
  const [step, setStep] = useState(1);
  const [predictionsOpen, setPredictionsOpen] = useState(true);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    api.get('/predictions/status')
      .then(res => {
        if (res.data && res.data.predictionsOpen !== undefined) {
          setPredictionsOpen(res.data.predictionsOpen);
        }
      })
      .catch(err => console.error('Failed to fetch prediction status', err))
      .finally(() => setCheckingStatus(false));
  }, []);
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('predictionFormData');
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return { name: '', phone: '', winner: '', runnerUp: '', winnerGoals: '', runnerUpGoals: '' };
  });
  const [error,        setError]        = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess,    setIsSuccess]    = useState(() => localStorage.getItem('predictionSubmitted') === 'true');
  const [teamSearch,   setTeamSearch]   = useState('');

  const filteredTeams = teams.filter(t => t.toLowerCase().includes(teamSearch.toLowerCase()));

  // ── Validate & advance ──
  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!formData.name || !formData.phone) return setError('Please fill in all fields.');
      if (!/^\d{10}$/.test(formData.phone))  return setError('Phone number must be exactly 10 digits.');
    }
    if (step === 2 && !formData.winner) return setError('Please select a winning team.');
    if (step === 3) {
      if (!formData.runnerUp)                          return setError('Please select a runner-up team.');
      if (formData.winner === formData.runnerUp)       return setError('Winner and Runner-up must be different teams.');
    }
    setTeamSearch('');
    setStep(s => s + 1);
  };

  const handlePrev = () => { setTeamSearch(''); setStep(s => s - 1); };

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.winnerGoals === '' || formData.runnerUpGoals === '')
      return setError('Please enter goals for both teams.');
    if (Number(formData.winnerGoals) <= Number(formData.runnerUpGoals))
      return setError('Winner goals must be greater than Runner-up goals.');

    setIsSubmitting(true);
    try {
      await api.post('/predictions', formData);
      localStorage.setItem('predictionSubmitted', 'true');
      localStorage.setItem('predictionFormData', JSON.stringify(formData));
      setIsSuccess(true);
      triggerConfetti();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Reset ──
  const handleReset = () => {
    localStorage.removeItem('predictionSubmitted');
    localStorage.removeItem('predictionFormData');
    setIsSuccess(false);
    setStep(1);
    setFormData({ name: '', phone: '', winner: '', runnerUp: '', winnerGoals: '', runnerUpGoals: '' });
  };

  // ── Confetti ──
  const triggerConfetti = () => {
    const duration = 4000;
    const end = Date.now() + duration;
    const burst = () => {
      confetti({ particleCount: 6, angle: 60,  spread: 60, origin: { x: 0 }, colors: ['#F4C542','#F9E2AE','#FF6B35','#ffffff'] });
      confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1 }, colors: ['#F4C542','#F9E2AE','#FF6B35','#ffffff'] });
      if (Date.now() < end) requestAnimationFrame(burst);
    };
    burst();
  };

  const triggerCardConfetti = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 25, spread: 50,
      origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight },
      colors: ['#F4C542','#F9E2AE','#FF6B35','#ffffff'],
    });
  };

  // ─────────────────────────────────────────────────────────────
  // STATUS & SUCCESS SCREENS
  // ─────────────────────────────────────────────────────────────
  if (checkingStatus) {
    return (
      <section id="prediction-section" className="py-20 px-4 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-12 h-12 border-4 border-t-[#F4C542] border-r-[#F4C542] border-b-transparent border-l-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Loading...</p>
        </div>
      </section>
    );
  }

  if (!predictionsOpen) {
    return (
      <section id="prediction-section" className="py-20 px-4 flex items-center justify-center min-h-[50vh]">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center relative overflow-hidden"
          style={{ border: '1px solid rgba(244,197,66,0.2)', boxShadow: '0 0 60px rgba(0,0,0,0.8)' }}
        >
          <div className="text-6xl mb-6 drop-shadow-[0_0_20px_rgba(244,197,66,0.4)]">⏳</div>
          <h2 className="text-2xl sm:text-3xl font-black mb-3" style={{ color: '#F4C542' }}>
            PREDICTIONS ARE OVER
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8">
            The prediction window has officially closed. Thank you to everyone who participated!
          </p>
          <button
            onClick={() => {
              const el = document.getElementById('leaderboard-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full py-3 rounded-xl font-black text-sm transition-all hover:scale-[1.02] active:scale-95"
            style={{
              background: 'linear-gradient(135deg,#F9E2AE,#F4C542,#c9920a)',
              color: '#1A0810',
              boxShadow: '0 0 20px rgba(244,197,66,0.3)',
            }}
          >
            View Leaderboard ↓
          </button>
        </motion.div>
      </section>
    );
  }

  if (isSuccess) {
    return (
      <section id="prediction-section" className="py-20 px-4 flex items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120 }}
          className="glass-card rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center"
          style={{ border: '1px solid rgba(244,197,66,0.4)', boxShadow: '0 0 60px rgba(244,197,66,0.15)' }}
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="mb-6 flex justify-center"
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
              style={{ background: 'linear-gradient(135deg,rgba(244,197,66,0.2),rgba(244,197,66,0.05))', border: '2px solid rgba(244,197,66,0.5)' }}>
              ✅
            </div>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-black mb-2" style={{
            background: 'linear-gradient(135deg,#F9E2AE,#F4C542)',
            WebkitBackgroundClip: 'text', color: 'transparent'
          }}>
            Prediction Submitted!
          </h2>
          <p className="text-gray-400 mb-8 text-sm sm:text-base leading-relaxed">
            Your prediction is locked until the World Cup Final.<br/>Check back to see where you rank!
          </p>

          {/* Summary card */}
          <div className="text-left rounded-2xl p-5 space-y-3 mb-8"
            style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-gray-400 text-sm">Name</span>
              <span className="font-bold text-white">{formData.name}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-gray-400 text-sm">Winner</span>
              <span className="flex items-center gap-2 font-bold" style={{ color: '#F4C542' }}>
                <Flag team={formData.winner} className="w-6 h-auto rounded" />
                {formData.winner}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-gray-400 text-sm">Runner-up</span>
              <span className="flex items-center gap-2 font-bold text-wc-muted">
                <Flag team={formData.runnerUp} className="w-6 h-auto rounded grayscale opacity-70" />
                {formData.runnerUp}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-400 text-sm">Predicted Score</span>
              <span className="font-black text-lg" style={{ color: '#F4C542' }}>
                {formData.winnerGoals} – {formData.runnerUpGoals}
              </span>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-full py-3 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95"
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
          >
            Log Out / Reset Prediction
          </button>
        </motion.div>
      </section>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // FORM STEPS
  // ─────────────────────────────────────────────────────────────
  const slideVariants = {
    initial: { x: 60, opacity: 0 },
    animate: { x: 0,  opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } },
    exit:    { x: -60, opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } },
  };

  return (
    <section id="prediction-section" className="py-16 sm:py-24 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-2" style={{ color: '#F4C542' }}>PREDICTION CENTRE</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Make Your Prediction</h2>
        </motion.div>

        {/* Glass card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-6 sm:p-10"
        >
          <StepIndicator step={step} />

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                key="err"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{   opacity: 0, height: 0 }}
                className="mb-6 px-4 py-3 rounded-xl text-sm font-medium text-red-300 text-center"
                style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)' }}
              >
                ⚠️ {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step content */}
          <div className="overflow-hidden min-h-[340px]">
            <AnimatePresence mode="wait">

              {/* ── Step 1: Personal Details ── */}
              {step === 1 && (
                <motion.div key="s1" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="space-y-5">
                  <h3 className="text-xl font-black mb-5" style={{ color: '#F4C542' }}>⚽ Personal Details</h3>

                  {/* Name */}
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <User size={18} color="#F4C542" opacity={0.7} />
                    </div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Full Name"
                      className="w-full pl-12 pr-4 py-4 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all text-base font-medium"
                      style={{
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                      onFocus={e  => { e.target.style.borderColor = 'rgba(244,197,66,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(244,197,66,0.08)'; }}
                      onBlur={e   => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Phone size={18} color="#F4C542" opacity={0.7} />
                    </div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Phone Number (10 digits)"
                      className="w-full pl-12 pr-4 py-4 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all text-base font-medium"
                      style={{
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                      onFocus={e => { e.target.style.borderColor = 'rgba(244,197,66,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(244,197,66,0.08)'; }}
                      onBlur={e  => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                </motion.div>
              )}

              {/* ── Step 2: Choose Winner ── */}
              {step === 2 && (
                <motion.div key="s2" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="space-y-4">
                  <h3 className="text-xl font-black mb-1" style={{ color: '#F4C542' }}>🏆 Choose World Cup Winner</h3>

                  {/* Search */}
                  <div className="relative">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={teamSearch}
                      onChange={e => setTeamSearch(e.target.value)}
                      placeholder="Search countries..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none text-sm transition-all"
                      style={{
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                      onFocus={e => { e.target.style.borderColor = 'rgba(244,197,66,0.6)'; }}
                      onBlur={e  => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                    />
                  </div>

                  {/* Team grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                    {filteredTeams.map(team => (
                      <button
                        key={team}
                        type="button"
                        onClick={(e) => {
                          if (formData.winner !== team) triggerCardConfetti(e);
                          setFormData({ ...formData, winner: team });
                        }}
                        className={`team-card ${formData.winner === team ? 'selected' : ''}`}
                      >
                        {formData.winner === team && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle2 size={14} color="#F4C542" />
                          </div>
                        )}
                        <Flag team={team} className="w-10 sm:w-12 h-auto rounded-md" />
                        <span className="text-xs sm:text-sm font-semibold text-white leading-tight break-words max-w-full text-center">
                          {team}
                        </span>
                      </button>
                    ))}
                    {filteredTeams.length === 0 && (
                      <div className="col-span-full py-10 text-center text-gray-500 text-sm">No countries found.</div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── Step 3: Choose Runner-up ── */}
              {step === 3 && (
                <motion.div key="s3" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="space-y-4">
                  <h3 className="text-xl font-black mb-1" style={{ color: '#F4C542' }}>🥈 Choose Runner-up</h3>

                  {/* Search */}
                  <div className="relative">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={teamSearch}
                      onChange={e => setTeamSearch(e.target.value)}
                      placeholder="Search countries..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none text-sm transition-all"
                      style={{
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                      onFocus={e => { e.target.style.borderColor = 'rgba(244,197,66,0.6)'; }}
                      onBlur={e  => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                    />
                  </div>

                  {/* Team grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                    {filteredTeams.map(team => (
                      <button
                        key={team}
                        type="button"
                        disabled={formData.winner === team}
                        onClick={(e) => {
                          if (formData.runnerUp !== team) triggerCardConfetti(e);
                          setFormData({ ...formData, runnerUp: team });
                        }}
                        className={`team-card ${formData.runnerUp === team ? 'selected' : ''} ${formData.winner === team ? 'opacity-25 cursor-not-allowed' : ''}`}
                      >
                        {formData.runnerUp === team && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle2 size={14} color="#F4C542" />
                          </div>
                        )}
                        <Flag team={team} className="w-10 sm:w-12 h-auto rounded-md" />
                        <span className="text-xs sm:text-sm font-semibold text-white leading-tight break-words max-w-full text-center">
                          {team}
                        </span>
                      </button>
                    ))}
                    {filteredTeams.length === 0 && (
                      <div className="col-span-full py-10 text-center text-gray-500 text-sm">No countries found.</div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── Step 4: Final Score ── */}
              {step === 4 && (
                <motion.div key="s4" variants={slideVariants} initial="initial" animate="animate" exit="exit">
                  <h3 className="text-xl font-black mb-6 text-center" style={{ color: '#F4C542' }}>🎯 Predict the Final Score</h3>

                  <div className="flex flex-row items-center justify-center gap-2 sm:gap-6">
                    {/* Winner */}
                    <ScoreStepper
                      team={formData.winner}
                      value={formData.winnerGoals}
                      onChange={v => setFormData({ ...formData, winnerGoals: v })}
                      isWinner={true}
                    />

                    {/* VS Divider */}
                    <div className="flex flex-col items-center justify-center gap-2 shrink-0">
                      <motion.span
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-3xl sm:text-5xl drop-shadow-[0_0_30px_rgba(244,197,66,0.8)]"
                      >🏆</motion.span>
                      <span className="text-xs font-black tracking-[0.25em]" style={{ color: 'rgba(244,197,66,0.5)' }}>VS</span>
                    </div>

                    {/* Runner-up */}
                    <ScoreStepper
                      team={formData.runnerUp}
                      value={formData.runnerUpGoals}
                      onChange={v => setFormData({ ...formData, runnerUpGoals: v })}
                      isWinner={false}
                    />
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between items-center gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-6 py-3 rounded-2xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-95"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: '#d1d5db' }}
              >
                ← Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 rounded-2xl font-black text-sm transition-all hover:scale-[1.03] active:scale-95"
                style={{
                  background: 'linear-gradient(135deg,#F9E2AE,#F4C542,#c9920a)',
                  color: '#1A0810',
                  boxShadow: '0 0 25px rgba(244,197,66,0.4)',
                }}
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 rounded-2xl font-black text-sm transition-all hover:scale-[1.03] active:scale-95 disabled:opacity-50"
                style={{
                  background: isSubmitting ? 'rgba(244,197,66,0.3)' : 'linear-gradient(135deg,#FF6B35,#7A1423)',
                  color: '#ffffff',
                  boxShadow: '0 0 25px rgba(255,107,53,0.4)',
                }}
              >
                {isSubmitting ? '⏳ Submitting...' : '🚀 Submit Prediction'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PredictionForm;
