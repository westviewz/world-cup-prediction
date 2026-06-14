import React, { useState } from 'react';
import Hero from '../components/Hero';
import PredictionForm from '../components/PredictionForm';
import Leaderboard from '../components/Leaderboard';

const Home = () => {
  const [showForm, setShowForm] = useState(() => {
    return localStorage.getItem('predictionSubmitted') === 'true';
  });

  const handlePredictClick = () => {
    setShowForm(true);
    // Smooth scroll to form
    setTimeout(() => {
      document.getElementById('prediction-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <main className="min-h-screen bg-premium-dark">
      <Hero onPredictClick={handlePredictClick} />
      
      <div id="prediction-section">
        {showForm && <PredictionForm />}
      </div>

      <Leaderboard />
    </main>
  );
};

export default Home;
