import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Flag card — small floating badge with flag image
const FlagBadge = ({ team, code, style }) => (
  <motion.div
    className="absolute flex flex-col items-center gap-1"
    style={style}
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' }}
  >
    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-wc-gold/50 overflow-hidden shadow-[0_0_15px_rgba(244,197,66,0.3)] bg-wc-darkCard">
      <img
        src={`https://flagcdn.com/w80/${code}.png`}
        alt={team}
        className="w-full h-full object-cover"
      />
    </div>
    <span className="text-[10px] font-bold text-wc-champagne/80 tracking-wide bg-wc-darkCard/80 px-1.5 py-0.5 rounded-full border border-wc-gold/20 whitespace-nowrap">
      {team}
    </span>
  </motion.div>
);

const Hero = ({ onPredictClick }) => {
  const bgRef  = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    gsap.to(bgRef.current, {
      yPercent: 25,
      ease: 'none',
      scrollTrigger: {
        trigger: bgRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, []);

  const topTeams = [
    { team: 'Argentina',  code: 'ar', style: { top: '22%', left: '3%'   } },
    { team: 'Brazil',     code: 'br', style: { top: '40%', left: '1%'   } },
    { team: 'France',     code: 'fr', style: { top: '58%', left: '4%'   } },
    { team: 'England',    code: 'gb-eng', style: { top: '22%', right: '3%'  } },
    { team: 'Portugal',   code: 'pt', style: { top: '40%', right: '1%'  } },
    { team: 'Germany',    code: 'de', style: { top: '58%', right: '4%'  } },
  ];

  return (
    <section className="relative h-screen min-h-[680px] flex flex-col items-center justify-center overflow-hidden">

      {/* Stadium Background */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/hero-bg.jpg')",
          height: '130%',
          top: '-15%',
          backgroundPosition: 'center top',
        }}
      />

      {/* Layered overlays — lighter so the poster is visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-wc-dark/60 via-transparent to-wc-dark" />
      <div className="absolute inset-0 bg-gradient-to-t from-wc-dark via-transparent to-wc-dark/40" />

      {/* Floodlight glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-wc-gold/5 blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-wc-gold/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-wc-crimson/10 blur-3xl pointer-events-none" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-wc-gold"
            style={{
              width:  Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left:   Math.random() * 100 + '%',
              top:    Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.1,
            }}
            animate={{ y: [0, -(Math.random() * 300 + 100)], opacity: [null, 0] }}
            transition={{
              duration: Math.random() * 6 + 5,
              repeat: Infinity,
              ease: 'linear',
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Floating country badges — hidden since image already has players */}

      {/* Hero content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">

        {/* FIFA 2026 eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-wc-gold/40 bg-wc-gold/10 backdrop-blur-sm"
        >
          <span className="text-wc-gold text-xs font-bold tracking-[0.2em] uppercase">⚽ FIFA World Cup 2026</span>
        </motion.div>

        {/* Floating Trophy */}
        <motion.div
          className="mb-6 animate-float"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-wc-gold/20 blur-2xl rounded-full scale-150" />
            <span className="relative text-7xl sm:text-8xl drop-shadow-[0_0_40px_rgba(244,197,66,0.8)] select-none">🏆</span>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4 tracking-tight"
        >
          <span className="text-white">PREDICT THE </span>
          <span className="shimmer-text block sm:inline">FIFA WORLD CUP</span>
          <span className="text-white"> 2026 CHAMPION</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="text-wc-muted/80 text-base sm:text-lg md:text-xl font-light mb-10 max-w-xl leading-relaxed"
        >
          Choose the Winner, Runner-up and Final Score. Compete with football fans worldwide.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <button
            onClick={onPredictClick}
            id="make-prediction-btn"
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 sm:py-5 text-base sm:text-lg font-black tracking-wide rounded-full overflow-hidden animate-glow transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #F9E2AE 0%, #F4C542 50%, #c9920a 100%)',
              color: '#1A0810',
              boxShadow: '0 0 35px rgba(244,197,66,0.5), 0 4px 25px rgba(0,0,0,0.5)',
            }}
          >
            {/* Shine sweep */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
            <span className="relative">⚽</span>
            <span className="relative">Make Your Prediction</span>
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-wc-muted/40"
      >
        <span className="text-xs tracking-widest uppercase font-medium">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
