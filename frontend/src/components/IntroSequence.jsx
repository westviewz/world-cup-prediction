import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

/* ─── Utility: random range ─────────────────────────── */
const rand = (min, max) => Math.random() * (max - min) + min;

/* ─── Canvas-based gold particle system ─────────────── */
const ParticleCanvas = ({ active, explode, width, height }) => {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const particles = useRef([]);

  /* spawn a confetti/dust particle */
  const spawn = (burst = false) => {
    const x = burst ? width / 2 : rand(0, width);
    const y = burst ? height * 0.42 : rand(0, height);
    const angle  = burst ? rand(0, Math.PI * 2) : rand(-0.3, 0.3);
    const speed  = burst ? rand(3, 9) : rand(0.3, 1.2);
    const colors = ['#F4C542','#FFE08A','#FF6B35','#ffffff','#FFDDA0'];
    return {
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (burst ? 0 : 0.3),
      alpha: 1,
      size: burst ? rand(3, 7) : rand(1, 3),
      color: colors[Math.floor(rand(0, colors.length))],
      life: 1,
      decay: burst ? rand(0.012, 0.022) : rand(0.005, 0.012),
      isSquare: burst && Math.random() > 0.5,
      rotation: rand(0, Math.PI * 2),
      rotSpeed: rand(-0.15, 0.15),
    };
  };

  const isMobile = width < 640;

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (explode) {
      const burstCount = isMobile ? 90 : 220;
      for (let i = 0; i < burstCount; i++) particles.current.push(spawn(true));
    }

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      /* ambient drizzle — halved on mobile for perf */
      if (Math.random() < (isMobile ? 0.18 : 0.4)) particles.current.push(spawn(false));

      particles.current = particles.current.filter(p => p.life > 0);

      particles.current.forEach(p => {
        p.x   += p.vx;
        p.y   += p.vy;
        p.vy  += 0.04;          /* gravity */
        p.life -= p.decay;
        p.alpha = Math.max(0, p.life);
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.globalAlpha = p.alpha * 0.85;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        if (p.isSquare) {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, explode, width, height]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}
    />
  );
};

/* ─── Letter-by-letter text (Removed for cinematic reveal) ─── */
// The RevealText component has been removed as the text is now revealed all at once.

/* ─── Trophy SVG ─────────────────────────────────────── */
const TrophySVG = ({ size = 110 }) => (
  <svg width={size} height={size} viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="tg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%"   stopColor="#FFE08A"/>
        <stop offset="50%"  stopColor="#F4C542"/>
        <stop offset="100%" stopColor="#B8860B"/>
      </linearGradient>
    </defs>
    {/* cup */}
    <path d="M20 4 H44 L40 38 Q32 46 24 38 Z" fill="url(#tg)" opacity="0.95"/>
    {/* handles */}
    <path d="M20 10 Q8 12 10 24 Q12 34 22 32" stroke="url(#tg)" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M44 10 Q56 12 54 24 Q52 34 42 32" stroke="url(#tg)" strokeWidth="3" fill="none" strokeLinecap="round"/>
    {/* stem */}
    <rect x="28" y="38" width="8" height="14" fill="url(#tg)" rx="2"/>
    {/* base */}
    <rect x="20" y="52" width="24" height="5" fill="url(#tg)" rx="2.5"/>
    <rect x="16" y="57" width="32" height="4" fill="url(#tg)" rx="2"/>
    {/* shine */}
    <path d="M27 10 Q30 8 33 12" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
  </svg>
);

/* ─── Football SVG ───────────────────────────────────── */
const FootballSVG = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="36" fill="#1a1a1a" stroke="#F4C542" strokeWidth="2.5"/>
    <polygon points="40,14 48,26 40,32 32,26" fill="#F4C542" stroke="#111" strokeWidth="1"/>
    <polygon points="62,28 60,42 50,44 44,36 48,26" fill="#1a1a1a" stroke="#F4C542" strokeWidth="1.2"/>
    <polygon points="18,28 20,42 30,44 36,36 32,26" fill="#1a1a1a" stroke="#F4C542" strokeWidth="1.2"/>
    <polygon points="40,66 32,54 40,48 48,54" fill="#F4C542" stroke="#111" strokeWidth="1"/>
    <polygon points="62,52 60,42 50,44 48,54" fill="#1a1a1a" stroke="#F4C542" strokeWidth="1.2"/>
    <polygon points="18,52 20,42 30,44 32,54" fill="#1a1a1a" stroke="#F4C542" strokeWidth="1.2"/>
  </svg>
);

/* ─── Stadium Silhouette ─────────────────────────────── */
const StadiumBG = () => (
  <svg
    viewBox="0 0 1440 320"
    style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', opacity: 0.18, pointerEvents: 'none' }}
    preserveAspectRatio="xMidYMax meet"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* crowd silhouette */}
    <path d="M0 320 L0 200 Q120 140 240 170 Q360 200 480 160 Q600 120 720 150 Q840 180 960 145 Q1080 110 1200 155 Q1320 200 1440 170 L1440 320 Z" fill="#2a0a10"/>
    {/* upper tier */}
    <path d="M0 320 L0 250 Q180 210 360 230 Q540 250 720 220 Q900 190 1080 225 Q1260 260 1440 235 L1440 320 Z" fill="#3d0f18"/>
  </svg>
);

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════ */
const IntroSequence = ({ onFinish }) => {
  const [dims, setDims] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [particlesActive, setParticlesActive] = useState(false);
  const [particlesExplode, setParticlesExplode] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const onResize = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ── GSAP master timeline ── */
  useEffect(() => {
    const tl = gsap.timeline({ onComplete: onFinish });

    /* helpers */
    const $ = id => document.getElementById(id);
    const fadeIn  = (id, dur = 0.6, vars = {}) => tl.to($(id),  { opacity: 1, ...vars, duration: dur }, '<+=0.05');
    const fadeOut = (id, dur = 0.5) => tl.to($(id), { opacity: 0, duration: dur }, '<+=0.1');

    /* ── SCENE 1: lights on ──────────────────────────── */
    tl.set('#intro-root', { opacity: 1 });

    /* ── SCENE 2: FOOTBALL GRAMAM cinematic reveal ──────── */
    tl.set('#brand-wrap', { opacity: 1 });

    /* simple reveal brand text all at once */
    tl.fromTo('#brand-text', 
      { opacity: 0, scale: 1.05 }, 
      { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }
    );

    /* fade in subtext */
    tl.fromTo('#brand-presents', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 }, '+=0.1');

    /* ── SCENE 3: Trophy + headline ─────────────────── */
    tl.call(() => { setParticlesActive(true); });

    tl.fromTo('#trophy-wrap', { opacity: 0, scale: 0.3, rotation: -15 },
      { opacity: 1, scale: 1, rotation: 0, duration: 0.75, ease: 'back.out(1.5)' }, '+=0.15');

    /* orbit glow */
    tl.to('#trophy-glow', { opacity: 1, scale: 1.6, duration: 0.6, ease: 'power2.out' }, '<+=0.2');

    /* explode particles */
    tl.call(() => { setParticlesExplode(true); }, [], '+=0.05');
    tl.call(() => { setParticlesExplode(false); }, [], '+=0.05');

    /* headline */
    tl.fromTo('#headline-wc', { opacity: 0, y: 30, scale: 0.92 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out' }, '+=0.1');

    tl.fromTo('#headline-sub', { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '+=0.08');

    /* ── SCENE 4: composition settle ───────────────── */
    /* Brand text drifts upward (already visible) */
    tl.to('#brand-wrap', { y: -30, duration: 0.45, ease: 'power2.inOut' }, '+=0.2');




    /* hold then fly into the page */
    tl.to('#intro-root', { opacity: 0, scale: 3, filter: 'blur(10px)', duration: 0.8, ease: 'power3.in' }, '+=2.5');

    return () => tl.kill();
  }, []);


  const { w, h } = dims;

  return (
    <div
      id="intro-root"
      ref={containerRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#000', opacity: 0, overflow: 'hidden',
        fontFamily: "'Cinzel', 'Georgia', serif",
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        userSelect: 'none',
      }}
    >
      {/* ── Google font ── */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Raleway:wght@300;400;600&display=swap"
      />

      {/* ── Particle canvas ── */}
      <ParticleCanvas active={particlesActive} explode={particlesExplode} width={w} height={h} />

      {/* ── Stadium silhouette ── */}
      <StadiumBG />



      {/* ── Crowd haze overlay ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%',
        background: 'linear-gradient(to top, rgba(20,5,10,0.85) 0%, transparent 100%)',
        pointerEvents: 'none', zIndex: 2,
      }} />






      {/* ── BRAND WRAP ── */}
      <div
        id="brand-wrap"
        style={{
          position: 'absolute', top: 'clamp(22%, 24%, 26%)', left: 0, right: 0,
          textAlign: 'center', opacity: 0, zIndex: 30,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          overflow: 'visible',
          padding: '0 12px',
        }}
      >


        {/* brand text */}
        <div
          id="brand-text"
          style={{
            fontSize: 'clamp(20px, 6.5vw, 64px)',
            fontFamily: "'Cinzel', 'Georgia', serif",
            fontWeight: 900,
            letterSpacing: 'clamp(0.06em, 0.18em, 0.18em)',
            color: '#F4C542',
            textShadow: '0 0 20px rgba(244,197,66,0.4)',
            lineHeight: 1.15,
            position: 'relative', zIndex: 45,
            wordBreak: 'keep-all',
          }}
        >
          FOOTBALL GRAMAM
        </div>

        {/* presents */}
        <div
          id="brand-presents"
          style={{
            marginTop: 8,
            fontSize: 'clamp(8px, 2vw, 14px)',
            letterSpacing: '0.4em',
            color: 'rgba(255,255,255,0.55)',
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 300,
            textTransform: 'uppercase',
            opacity: 0,
          }}
        >
          presents
        </div>
      </div>

      {/* ── TROPHY ── */}
      <div
        id="trophy-wrap"
        style={{
          position: 'relative', zIndex: 25,
          marginTop: 'clamp(10px, 2vh, 20px)', opacity: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {/* glow halo — smaller on mobile */}
        <div
          id="trophy-glow"
          style={{
            position: 'absolute',
            width: 'clamp(100px, 25vw, 180px)',
            height: 'clamp(100px, 25vw, 180px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(244,197,66,0.35) 0%, transparent 70%)',
            opacity: 0, scale: 0.8, zIndex: 24,
          }}
        />
        <div style={{ position: 'relative', zIndex: 26 }}>
          <TrophySVG size={clampSize(70, 130)} />
        </div>
      </div>

      {/* ── FIFA WORLD CUP 2026 ── */}
      <div
        id="headline-wc"
        style={{
          opacity: 0, zIndex: 30, textAlign: 'center',
          fontSize: 'clamp(15px, 5vw, 52px)',
          fontFamily: "'Cinzel', serif",
          fontWeight: 900,
          letterSpacing: 'clamp(0.05em, 0.12em, 0.12em)',
          background: 'linear-gradient(90deg, #FFE08A 0%, #F4C542 50%, #FF6B35 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: 'none',
          marginTop: 'clamp(8px, 1.5vh, 14px)',
          lineHeight: 1.2,
          padding: '0 16px',
        }}
      >
        FIFA WORLD CUP 2026
      </div>

      {/* ── PREDICTION CHALLENGE ── */}
      <div
        id="headline-sub"
        style={{
          opacity: 0, zIndex: 30, textAlign: 'center',
          fontSize: 'clamp(8px, 2.8vw, 22px)',
          fontFamily: "'Raleway', sans-serif",
          fontWeight: 600,
          letterSpacing: 'clamp(0.12em, 0.38em, 0.38em)',
          color: 'rgba(255,255,255,0.8)',
          marginTop: 'clamp(4px, 1vh, 8px)',
          padding: '0 12px',
        }}
      >
        PREDICTION CHALLENGE
      </div>


      {/* ── Skip ── */}
      <button
        onClick={onFinish}
        style={{
          position: 'absolute', top: 16, right: 16, zIndex: 100,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(244,197,66,0.25)',
          borderRadius: 3,
          color: 'rgba(255,255,255,0.45)',
          padding: 'clamp(5px,1vh,8px) clamp(12px,3vw,18px)',
          fontSize: 'clamp(9px, 2vw, 11px)',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          fontFamily: "'Raleway', sans-serif",
          transition: 'color 0.2s, border-color 0.2s',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          minWidth: 60,
          minHeight: 36,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = '#F4C542';
          e.currentTarget.style.borderColor = 'rgba(244,197,66,0.6)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = 'rgba(255,255,255,0.45)';
          e.currentTarget.style.borderColor = 'rgba(244,197,66,0.25)';
        }}
      >
        Skip
      </button>

    </div>
  );
};

/* tiny helper – keeps trophy size responsive without importing useWindowSize */
function clampSize(min, max) {
  if (typeof window === 'undefined') return max;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  /* on small screens use vh too so it never overflows vertically */
  const byW = Math.round(vw * 0.09);
  const byH = Math.round(vh * 0.11);
  return Math.min(max, Math.max(min, Math.min(byW, byH)));
}

export default IntroSequence;
