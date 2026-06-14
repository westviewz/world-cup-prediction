import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import api from '../api';
import { teams, teamCodes } from '../utils/teams';

const Flag = ({ team, className = "w-6 h-4" }) => {
  const code = teamCodes[team];
  return code ? <img src={`https://flagcdn.com/w80/${code}.png`} alt={team} className={`inline-block object-cover shadow-sm ${className}`} /> : null;
};

const PredictionForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('predictionFormData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      name: '',
      phone: '',
      winner: '',
      runnerUp: '',
      winnerGoals: '',
      runnerUpGoals: '',
    };
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(() => {
    return localStorage.getItem('predictionSubmitted') === 'true';
  });
  const [teamSearch, setTeamSearch] = useState('');

  const filteredTeams = teams.filter(team => 
    team.toLowerCase().includes(teamSearch.toLowerCase())
  );

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!formData.name || !formData.phone) return setError('Please fill all fields');
      // Exact 10 digit check
      if (!/^\d{10}$/.test(formData.phone)) return setError('Phone number must be exactly 10 digits');
    }
    if (step === 2 && !formData.winner) return setError('Please select a winner');
    if (step === 3) {
      if (!formData.runnerUp) return setError('Please select a runner-up');
      if (formData.winner === formData.runnerUp) return setError('Winner and runner-up cannot be the same');
    }
    setTeamSearch('');
    setStep(s => s + 1);
  };

  const handlePrev = () => {
    setTeamSearch('');
    setStep(s => s - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.winnerGoals === '' || formData.runnerUpGoals === '') {
      return setError('Please enter goals for both teams.');
    }

    if (Number(formData.winnerGoals) <= Number(formData.runnerUpGoals)) {
      return setError('Winner goals must be strictly greater than runner-up goals.');
    }

    setIsSubmitting(true);
    try {
      await api.post('/predictions', formData);
      localStorage.setItem('predictionSubmitted', 'true');
      localStorage.setItem('predictionFormData', JSON.stringify(formData));
      setIsSuccess(true);
      triggerConfetti();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#fbbf24', '#fcd34d', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#fbbf24', '#fcd34d', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const triggerCardConfetti = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { x, y },
      colors: ['#fbbf24', '#fcd34d', '#ffffff'],
      zIndex: 1000,
      disableForReducedMotion: true
    });
  };

  const handleReset = () => {
    localStorage.removeItem('predictionSubmitted');
    localStorage.removeItem('predictionFormData');
    setIsSuccess(false);
    setStep(1);
    setFormData({
      name: '',
      phone: '',
      winner: '',
      runnerUp: '',
      winnerGoals: '',
      runnerUpGoals: '',
    });
  };

  if (isSuccess) {
    return (
      <section className="py-20 px-4 min-h-[60vh] flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass p-10 rounded-3xl max-w-lg w-full text-center"
        >
          <h2 className="text-4xl font-bold text-premium-gold mb-4">Prediction Submitted!</h2>
          <p className="text-xl text-gray-300 mb-8">Thank you for participating. Check back for the leaderboard!</p>
          <div className="text-left bg-black/40 p-6 rounded-2xl space-y-2">
            <p><strong>Name:</strong> {formData.name}</p>
            <p className="flex items-center gap-2"><strong>Winner:</strong> <Flag team={formData.winner} /> {formData.winner}</p>
            <p className="flex items-center gap-2"><strong>Runner-up:</strong> <Flag team={formData.runnerUp} /> {formData.runnerUp}</p>
            <p><strong>Score:</strong> {formData.winnerGoals} - {formData.runnerUpGoals}</p>
          </div>
          <button 
            onClick={handleReset}
            className="mt-8 px-8 py-3 w-full sm:w-auto rounded-xl bg-red-600/20 text-red-400 font-bold hover:bg-red-600/40 border border-red-500/30 transition-colors flex items-center justify-center mx-auto gap-2"
          >
            Log Out / Reset
          </button>
        </motion.div>
      </section>
    );
  }

  const variants = {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-2xl mx-auto glass p-8 md:p-12 rounded-3xl">
        {/* Progress Bar */}
        <div className="mb-12 w-full max-w-lg mx-auto">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-4 left-0 w-full h-1 bg-gray-800 -z-10 transform -translate-y-1/2 rounded" />
            <motion.div 
              className="absolute top-4 left-0 h-1 bg-premium-gold -z-10 transform -translate-y-1/2 rounded shadow-[0_0_10px_rgba(251,191,36,0.5)]"
              initial={{ width: '0%' }}
              animate={{ width: `${((step - 1) / 3) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
            {[
              { num: 1, label: 'Details' },
              { num: 2, label: 'Winner' },
              { num: 3, label: 'Runner-up' },
              { num: 4, label: 'Score' }
            ].map(item => (
              <div key={item.num} className="flex flex-col items-center gap-2">
                <motion.div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 shadow-lg ${step > item.num ? 'bg-green-500 text-white' : step === item.num ? 'bg-premium-gold text-black shadow-[0_0_15px_rgba(251,191,36,0.6)]' : 'bg-gray-800 text-gray-400 border border-gray-600'}`}
                  initial={false}
                  animate={{ scale: step === item.num ? 1.2 : 1 }}
                >
                  {step > item.num ? '✓' : (step === item.num ? '●' : item.num)}
                </motion.div>
                <span className={`text-xs md:text-sm font-medium transition-colors duration-300 ${step >= item.num ? 'text-white' : 'text-gray-500'}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl text-center shadow-lg">{error}</div>}

        <div className="overflow-hidden min-h-[300px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <h3 className="text-2xl font-bold mb-4 text-premium-goldLight">Step 1: Personal Details</h3>
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-premium-gold transition-colors"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-premium-gold transition-colors"
                    placeholder="Enter phone number"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-4">
                <h3 className="text-2xl font-bold text-premium-goldLight">Step 2: Choose Winner</h3>
                <input 
                  type="text"
                  value={teamSearch}
                  onChange={e => setTeamSearch(e.target.value)}
                  placeholder="Search countries..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-premium-gold transition-colors text-sm"
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[320px] overflow-y-auto pr-1">
                  {filteredTeams.map(team => (
                    <button
                      key={team}
                      onClick={(e) => {
                        if (formData.winner !== team) triggerCardConfetti(e);
                        setFormData({...formData, winner: team});
                      }}
                      className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer ${formData.winner === team ? 'bg-premium-gold/20 text-premium-gold border-premium-gold font-bold scale-105 shadow-[0_0_20px_rgba(251,191,36,0.3)] z-10' : 'bg-black/40 border-white/10 hover:border-white/30 text-white hover:bg-black/60'}`}
                    >
                      <span className="flex items-center justify-center mr-1"><Flag team={team} className="w-8 h-auto rounded" /></span>
                      <span className="truncate text-lg">{team}</span>
                    </button>
                  ))}
                  {filteredTeams.length === 0 && (
                    <div className="col-span-full py-8 text-center text-gray-500">No matching countries found.</div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-4">
                <h3 className="text-2xl font-bold text-premium-goldLight">Step 3: Choose Runner-up</h3>
                <input 
                  type="text"
                  value={teamSearch}
                  onChange={e => setTeamSearch(e.target.value)}
                  placeholder="Search countries..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-premium-gold transition-colors text-sm"
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[320px] overflow-y-auto pr-1">
                  {filteredTeams.map(team => (
                    <button
                      key={team}
                      disabled={formData.winner === team}
                      onClick={(e) => {
                        if (formData.runnerUp !== team) triggerCardConfetti(e);
                        setFormData({...formData, runnerUp: team});
                      }}
                      className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer ${formData.winner === team ? 'opacity-30 cursor-not-allowed' : formData.runnerUp === team ? 'bg-gray-300/20 text-white border-gray-300 font-bold scale-105 shadow-[0_0_20px_rgba(209,213,219,0.3)] z-10' : 'bg-black/40 border-white/10 hover:border-white/30 text-white hover:bg-black/60'}`}
                    >
                      <span className="flex items-center justify-center mr-1"><Flag team={team} className="w-8 h-auto rounded" /></span>
                      <span className="truncate text-lg">{team}</span>
                    </button>
                  ))}
                  {filteredTeams.length === 0 && (
                    <div className="col-span-full py-8 text-center text-gray-500">No matching countries found.</div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                <h3 className="text-3xl font-bold mb-6 text-premium-goldLight text-center">Predict Final Score</h3>
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 py-4">
                  
                  {/* Winner Card */}
                  <div className="flex flex-col items-center gap-6">
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="bg-black/60 border border-premium-gold/40 rounded-2xl p-6 flex flex-col items-center justify-center w-40 h-48 shadow-[0_0_20px_rgba(251,191,36,0.2)] relative overflow-hidden"
                    >
                      <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-premium-gold to-transparent opacity-80"></div>
                      <span className="mb-3"><Flag team={formData.winner} className="w-20 h-auto rounded-md shadow-md" /></span>
                      <span className="font-bold text-lg text-center text-white break-words leading-tight">{formData.winner}</span>
                      <span className="text-xs text-premium-gold mt-2 uppercase tracking-widest font-bold">Winner</span>
                    </motion.div>
                    
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-premium-gold to-yellow-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                      <motion.input 
                        key={`w-${formData.winnerGoals}`}
                        initial={{ scale: 0.8, filter: 'brightness(2)' }}
                        animate={{ scale: 1, filter: 'brightness(1)' }}
                        transition={{ duration: 0.3 }}
                        type="number" 
                        min="0"
                        value={formData.winnerGoals}
                        onChange={e => setFormData({...formData, winnerGoals: e.target.value === '' ? '' : parseInt(e.target.value)})}
                        className="relative w-28 h-32 text-center bg-[#0a0a0a] border-2 border-gray-800 rounded-xl p-2 text-6xl font-mono font-bold text-red-500 focus:outline-none focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.5)] shadow-inner"
                        style={{ textShadow: '0 0 12px rgba(239, 68, 68, 0.9)' }}
                      />
                    </div>
                  </div>

                  {/* Trophy Divider */}
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="flex flex-col items-center justify-center z-10 my-4 md:my-0"
                  >
                    <span className="text-6xl drop-shadow-[0_0_25px_rgba(251,191,36,0.6)] hover:scale-110 transition-transform cursor-default">🏆</span>
                    <span className="text-sm font-bold text-gray-500 mt-3 tracking-widest">VS</span>
                  </motion.div>

                  {/* Runner-up Card */}
                  <div className="flex flex-col items-center gap-6">
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="bg-black/60 border border-gray-500/40 rounded-2xl p-6 flex flex-col items-center justify-center w-40 h-48 shadow-[0_0_20px_rgba(156,163,175,0.15)] relative overflow-hidden"
                    >
                      <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-60"></div>
                      <span className="mb-3"><Flag team={formData.runnerUp} className="w-20 h-auto rounded-md shadow-md" /></span>
                      <span className="font-bold text-lg text-center text-white break-words leading-tight">{formData.runnerUp}</span>
                      <span className="text-xs text-gray-400 mt-2 uppercase tracking-widest font-bold">Runner-up</span>
                    </motion.div>

                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-gray-500 to-gray-700 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                      <motion.input 
                        key={`r-${formData.runnerUpGoals}`}
                        initial={{ scale: 0.8, filter: 'brightness(2)' }}
                        animate={{ scale: 1, filter: 'brightness(1)' }}
                        transition={{ duration: 0.3 }}
                        type="number" 
                        min="0"
                        value={formData.runnerUpGoals}
                        onChange={e => setFormData({...formData, runnerUpGoals: e.target.value === '' ? '' : parseInt(e.target.value)})}
                        className="relative w-28 h-32 text-center bg-[#0a0a0a] border-2 border-gray-800 rounded-xl p-2 text-6xl font-mono font-bold text-red-500 focus:outline-none focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.5)] shadow-inner"
                        style={{ textShadow: '0 0 12px rgba(239, 68, 68, 0.9)' }}
                      />
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-between">
          {step > 1 ? (
            <button 
              onClick={handlePrev}
              className="px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors"
            >
              Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button 
              onClick={handleNext}
              className="px-8 py-3 rounded-full bg-premium-gold text-black font-bold hover:bg-premium-goldLight transition-colors"
            >
              Next
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-premium-purple to-blue-600 text-white font-bold hover:shadow-[0_0_20px_rgba(109,40,217,0.5)] transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Prediction'}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default PredictionForm;
