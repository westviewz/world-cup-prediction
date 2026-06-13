import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Hero = ({ onPredictClick }) => {
  const bgRef = useRef(null);

  useEffect(() => {
    // Parallax stadium background
    gsap.to(bgRef.current, {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: bgRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div 
        ref={bgRef}
        className="absolute inset-0 bg-stadium bg-cover bg-center bg-no-repeat"
        style={{ height: '130%' }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-premium-dark/80 via-premium-dark/60 to-premium-dark" />

      {/* Floating Particles Placeholder */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-premium-gold"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random()
            }}
            animate={{
              y: [null, Math.random() * -500],
              opacity: [null, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Predict The <span className="text-transparent bg-clip-text bg-gradient-to-r from-premium-goldLight to-premium-gold">World Champion</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 mb-10 font-light">
            Choose the Winner, Runner-up and Final Score of FIFA World Cup 2026
          </p>
          <button 
            onClick={onPredictClick}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-premium-dark bg-gradient-to-r from-premium-goldLight to-premium-gold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:shadow-[0_0_40px_rgba(251,191,36,0.6)]"
          >
            <span className="relative z-10">Make Prediction</span>
            <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-300 ease-out" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
