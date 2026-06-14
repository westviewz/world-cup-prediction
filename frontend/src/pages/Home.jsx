import React, { useState } from 'react';
import Hero from '../components/Hero';
import PredictionForm from '../components/PredictionForm';
import Leaderboard from '../components/Leaderboard';
import { motion } from 'framer-motion';

// Footer
const Footer = () => (
  <footer className="py-10 px-4 text-center border-t" style={{ borderColor: 'rgba(244,197,66,0.1)' }}>
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-center items-center gap-2 mb-3">
        <span className="text-2xl">⚽</span>
        <span className="font-black text-lg" style={{ color: '#F4C542' }}>FIFA World Cup 2026</span>
      </div>
      <p className="text-gray-500 text-sm mb-1">Prediction Challenge — Compete with football fans worldwide</p>
      <p className="text-gray-600 text-xs">Fan-made prediction contest. Not affiliated with FIFA.</p>
    </div>
  </footer>
);

const Home = () => {
  const [showForm, setShowForm] = useState(() => {
    return localStorage.getItem('predictionSubmitted') === 'true';
  });

  const handlePredictClick = () => {
    setShowForm(true);
    setTimeout(() => {
      document.getElementById('prediction-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  };

  return (
    <main style={{ background: 'linear-gradient(180deg, #0D0507 0%, #1A0810 30%, #0D0507 60%, #0D0507 100%)' }}>
      <Hero onPredictClick={handlePredictClick} />

      {/* Prediction Form */}
      <div id="prediction-section">
        {showForm
          ? <PredictionForm />
          : (
            /* "Make Prediction" mid-page CTA if not yet shown */
            <section className="py-16 px-4 text-center">
              <motion.button
                onClick={handlePredictClick}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-3 px-10 py-4 text-lg font-black rounded-full"
                style={{
                  background: 'linear-gradient(135deg,#F9E2AE,#F4C542,#c9920a)',
                  color: '#1A0810',
                  boxShadow: '0 0 35px rgba(244,197,66,0.45)',
                }}
              >
                ⚽ Make Your Prediction
              </motion.button>
            </section>
          )
        }
      </div>

      {/* Divider */}
      <div className="section-divider my-4" />

      {/* Leaderboard + Scoring */}
      <Leaderboard />

      <Footer />
    </main>
  );
};

export default Home;
