import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

const SoccerBall = ({ size = 64, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m12 2-3.5 3.5L10 10H6L2 12l4 2v4l3.5 1.5L12 22l3.5-2.5L14 18v-4l4-2h-4l1.5-4.5L12 2z" />
    <path d="m12 10-2.5 4 4.5 2.5" />
  </svg>
);

const IntroSequence = ({ onFinish }) => {
  const containerRef = useRef(null);
  const lightsRef = useRef(null);
  const trophyRef = useRef(null);
  const textRef1 = useRef(null);
  const textRef2 = useRef(null);
  const footballRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: onFinish
    });

    // Scene 1: Dark screen -> Stadium lights slowly turn on
    tl.to(lightsRef.current, { opacity: 1, duration: 2, ease: "power2.inOut" })
      
      // Scene 2: Trophy emerges from darkness
      .to(trophyRef.current, { 
        opacity: 1, 
        scale: 1, 
        duration: 1.5, 
        ease: "back.out(1.7)",
        onComplete: () => {
          gsap.to(trophyRef.current, { rotationY: 360, duration: 4, repeat: -1, ease: "linear" });
        }
      }, "-=0.5")
      
      // Scene 3: Text animation
      .fromTo(textRef1.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=1")
      .fromTo(textRef2.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.5")
      
      // Scene 4: Football flies across screen
      .fromTo(footballRef.current, { x: -300, rotation: -360, opacity: 0 }, { x: '120vw', rotation: 720, opacity: 1, duration: 2, ease: "power2.inOut" }, "+=0.5")
      
      // Transition out
      .to(containerRef.current, { opacity: 0, duration: 1, ease: "power2.inOut" });

    return () => {
      tl.kill();
      gsap.killTweensOf(trophyRef.current);
    };
  }, [onFinish]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Lights Effect */}
      <div 
        ref={lightsRef}
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(0,0,0,1) 80%)'
        }}
      />

      <button 
        onClick={onFinish}
        className="absolute top-8 right-8 z-50 text-white/50 hover:text-white uppercase tracking-widest text-sm transition-colors"
      >
        Skip Intro
      </button>

      <div className="relative z-10 flex flex-col items-center">
        {/* Trophy */}
        <div ref={trophyRef} className="opacity-0 scale-50 mb-12 relative" style={{ perspective: '1000px' }}>
          <div className="absolute inset-0 bg-premium-gold/20 blur-3xl rounded-full" />
          <Trophy size={120} className="text-premium-gold drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]" strokeWidth={1} />
        </div>

        {/* Texts */}
        <div className="text-center overflow-hidden mb-2">
          <h1 ref={textRef1} className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-premium-goldLight to-premium-gold">
            FIFA WORLD CUP 2026
          </h1>
        </div>
        <div className="text-center overflow-hidden">
          <h2 ref={textRef2} className="text-xl md:text-3xl font-light tracking-widest text-white/80">
            PREDICTION CHALLENGE
          </h2>
        </div>
      </div>

      {/* Football */}
      <div ref={footballRef} className="absolute bottom-1/4 left-0">
        <SoccerBall size={64} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
      </div>

    </div>
  );
};

export default IntroSequence;
