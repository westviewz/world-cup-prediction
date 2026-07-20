import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const bgRef    = useRef(null);
  const titleRef = useRef(null);

  // ── Prediction deadline: July 15 2026 12:00 AM IST = July 14 2026 18:30 UTC ──
  const DEADLINE = new Date('2026-07-14T18:30:00Z').getTime();

  const calcTimeLeft = () => {
    const dist = DEADLINE - Date.now();
    if (dist <= 0) return null;
    return {
      days:    Math.floor(dist / 86400000),
      hours:   Math.floor((dist % 86400000) / 3600000),
      minutes: Math.floor((dist % 3600000)  / 60000),
      seconds: Math.floor((dist % 60000)    / 1000),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calcTimeLeft);

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

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(id);
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
        className="absolute inset-0 bg-cover bg-no-repeat hero-bg-image"
        style={{
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
          <span className="shimmer-text block sm:inline">ULTIMATE</span>
          <span className="text-white"> CHAMPION</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="text-wc-muted/80 text-base sm:text-lg md:text-xl font-light mb-10 max-w-xl leading-relaxed"
        >
          The world's greatest football tournament is here. Make your predictions, challenge your friends, and secure your place in history.
        </motion.p>

        {/* ── Prediction Deadline Countdown (placed above CTA) ── */}
        {timeLeft && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="flex flex-col items-center gap-1.5 mb-6"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
              ⏰ {t('hero.countdown_label')}
            </p>
            <div className="flex items-center gap-1">
              {[
                { v: timeLeft.days,    l: t('hero.cd_d') },
                { v: timeLeft.hours,   l: t('hero.cd_h') },
                { v: timeLeft.minutes, l: t('hero.cd_m') },
                { v: timeLeft.seconds, l: t('hero.cd_s') },
              ].map(({ v, l }, i) => (
                <React.Fragment key={l}>
                  <div
                    className="flex flex-col items-center min-w-[38px] py-1 px-1.5 rounded-lg"
                    style={{
                      background: timeLeft.days < 1 ? 'rgba(251,146,60,0.15)' : 'rgba(244,197,66,0.1)',
                      border: `1px solid ${timeLeft.days < 1 ? 'rgba(251,146,60,0.45)' : 'rgba(244,197,66,0.25)'}`,
                    }}
                  >
                    <span
                      className="text-base sm:text-lg font-black tabular-nums leading-none"
                      style={{ color: timeLeft.days < 1 ? '#fb923c' : '#F4C542' }}
                    >
                      {String(v).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mt-0.5">{l}</span>
                  </div>
                  {i < 3 && <span className="text-gray-600 font-bold text-xs mb-3 mx-0.5">:</span>}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        )}
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
