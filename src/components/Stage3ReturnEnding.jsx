import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Flame, RotateCcw, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Stage3ReturnEnding({ onReplayEpic }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const progressRef = useRef(0);
  const blessingBoostRef = useRef(0);

  const [scrollPct, setScrollPct] = useState(0);
  const [actTitle, setActTitle] = useState('ACT I • FOOTSTEPS ON THE SACRED SARAYU GHATS');
  const [blessingCount, setBlessingCount] = useState(108);

  // Layer refs for 2D Parallax Choreography
  const ghatsPlateRef = useRef(null);
  const ghatsForegroundRef = useRef(null);
  const chariotPlateRef = useRef(null);
  const chariotArchLeftRef = useRef(null);
  const chariotArchRightRef = useRef(null);
  const panoramaPlateRef = useRef(null);
  const foregroundDiyaLedgeRef = useRef(null);
  const finalScrollCardRef = useRef(null);

  // 2D Canvas Engine for Pushpavarsha (Rose & Marigold Flower Shower), Sparklers & Floating Diyas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth * Math.min(window.devicePixelRatio, 2);
      canvas.height = window.innerHeight * Math.min(window.devicePixelRatio, 2);
      ctx.scale(Math.min(window.devicePixelRatio, 2), Math.min(window.devicePixelRatio, 2));
    };
    resize();
    window.addEventListener('resize', resize);

    // Rose & Marigold Petals for Pushpavarsha
    const petals = Array.from({ length: 95 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: -0.6 + Math.random() * 1.2,
      vy: 0.9 + Math.random() * 1.6,
      size: 4 + Math.random() * 6,
      rot: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.05,
      isRose: Math.random() > 0.45,
      sway: Math.random() * Math.PI * 2,
    }));

    // Rising Golden Diya Sparks & Sky Blessings
    const sparks = Array.from({ length: 75 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vy: 0.5 + Math.random() * 1.4,
      r: 1.5 + Math.random() * 3.5,
      phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    const render = () => {
      t += 0.02;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const p = progressRef.current;
      const boost = blessingBoostRef.current;
      if (blessingBoostRef.current > 0) {
        blessingBoostRef.current = Math.max(0, blessingBoostRef.current - 0.015);
      }

      ctx.clearRect(0, 0, w, h);

      // 1. Flower Petal Shower (Pushpavarsha) — intensifies during Chariot Arrival & Blessing
      const petalOpacity = p < 0.25 ? 0.55 : p < 0.75 ? 0.95 : 0.65 + boost * 0.35;
      petals.forEach((pt) => {
        pt.x += pt.vx + Math.sin(t + pt.sway) * 0.8;
        pt.y += pt.vy * (1 + boost * 1.5);
        pt.rot += pt.vRot;

        if (pt.y > h + 20) {
          pt.y = -20;
          pt.x = Math.random() * w;
        }
        if (pt.x > w + 20) pt.x = -20;
        if (pt.x < -20) pt.x = w + 20;

        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(pt.rot);
        ctx.globalAlpha = petalOpacity;
        ctx.fillStyle = pt.isRose ? '#e11d48' : '#f59e0b';
        ctx.strokeStyle = '#181009';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(0, 0, pt.size, pt.size * 0.58, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });

      // 2. Rising Golden Diya Glow Orbs & Sparkler Twinkles
      sparks.forEach((sp) => {
        sp.y -= sp.vy * (1 + boost * 2.2);
        sp.x += Math.cos(t + sp.phase) * 0.4;
        if (sp.y < -20) {
          sp.y = h + 20;
          sp.x = Math.random() * w;
        }

        const glowR = sp.r * (2.6 + Math.sin(t * 4 + sp.phase) * 0.6);
        const grad = ctx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, glowR);
        grad.addColorStop(0, 'rgba(255, 251, 235, 0.95)');
        grad.addColorStop(0.45, 'rgba(251, 191, 36, 0.65)');
        grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, glowR, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // GSAP ScrollTrigger 2D Parallax Choreography for Stage 3
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress;
            progressRef.current = p;
            setScrollPct(Math.round(p * 100));
            if (p < 0.34) {
              setActTitle('ACT I • ARRIVAL AT THE SARAYU GHATS OF AYODHYA');
            } else if (p < 0.68) {
              setActTitle('ACT II • THE ROYAL CHARIOT & FLOWER SHOWER (PUSHPAVARSHA)');
            } else {
              setActTitle('ACT III • THE GOLDEN PANORAMA OF ETERNAL DIWALI');
            }
          },
        },
      });

      // ACT I (0.0 -> 0.36): Sarayu Ghats Parallax Zoom & Foreground Garland Drift
      tl.fromTo(
        ghatsPlateRef.current,
        { scale: 1.12, y: 0, opacity: 1 },
        { scale: 1.0, y: -35, opacity: 1, duration: 0.32, ease: 'none' },
        0
      )
        .fromTo(
          ghatsForegroundRef.current,
          { y: 40, scale: 1 },
          { y: -60, scale: 1.08, duration: 0.34, ease: 'none' },
          0
        )
        // Crossfade Act I -> Act II (Chariot Procession with Shri Ram, Sita, Lakshman & Hanuman)
        .to(ghatsPlateRef.current, { opacity: 0, scale: 0.96, duration: 0.1 }, 0.3)
        .fromTo(
          chariotPlateRef.current,
          { opacity: 0, scale: 1.14, y: 30 },
          { opacity: 1, scale: 1.0, y: 0, duration: 0.12, ease: 'power1.out' },
          0.29
        )
        .fromTo(
          chariotArchLeftRef.current,
          { x: -120, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.14 },
          0.3
        )
        .fromTo(
          chariotArchRightRef.current,
          { x: 120, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.14 },
          0.3
        )
        // Subtle parallax push on Chariot during Act II (0.38 -> 0.65)
        .to(
          chariotPlateRef.current,
          { scale: 1.06, y: -20, duration: 0.24, ease: 'none' },
          0.4
        )
        .to(
          chariotArchLeftRef.current,
          { x: -90, scale: 1.1, opacity: 0, duration: 0.12 },
          0.62
        )
        .to(
          chariotArchRightRef.current,
          { x: 90, scale: 1.1, opacity: 0, duration: 0.12 },
          0.62
        )
        // Crossfade Act II -> Act III (Golden Panorama of Ayodhya & Sacred Blessing)
        .to(chariotPlateRef.current, { opacity: 0, duration: 0.12 }, 0.64)
        .fromTo(
          panoramaPlateRef.current,
          { opacity: 0, scale: 1.16, y: 25 },
          { opacity: 1, scale: 1.0, y: 0, duration: 0.16, ease: 'power2.out' },
          0.63
        )
        .fromTo(
          foregroundDiyaLedgeRef.current,
          { y: 120, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.16, ease: 'power2.out' },
          0.68
        )
        .fromTo(
          finalScrollCardRef.current,
          { opacity: 0, scale: 0.88, y: 45 },
          { opacity: 1, scale: 1, y: 0, duration: 0.18, ease: 'back.out(1.3)' },
          0.74
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const triggerDiyaBlessing = () => {
    blessingBoostRef.current = 1.0;
    setBlessingCount((c) => c + 108);
  };

  return (
    <section
      ref={sectionRef}
      id="stage-3-return"
      className="relative w-full h-[460vh] bg-[#0b101d] select-none"
    >
      {/* Sticky Pinned 2D Parallax Finale Viewport */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden epic-woodblock-grain">
        {/* =====================================================================
            ACT I LAYER (0% - 36%): ARRIVAL ALONG THE SARAYU GHATS AT TWILIGHT
        ===================================================================== */}
        <div ref={ghatsPlateRef} className="absolute inset-0 w-full h-full">
          <img
            src="/art/stage3_ayodhya_ghats.png"
            alt="Shri Ram, Sita Mata, and Lakshman arriving along the Sarayu Ghats"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b101d] via-transparent to-[#0b101d]/40" />
        </div>

        {/* Act I Foreground Parallax Marigold Torans & Glowing Ghats Balustrade */}
        <div
          ref={ghatsForegroundRef}
          className="absolute inset-x-0 top-0 pointer-events-none z-10"
        >
          <svg viewBox="0 0 1440 220" className="w-full h-auto">
            {/* Hanging Sacred Marigold & Mango-Leaf Festoons (Torans) */}
            {[-40, 260, 560, 860, 1160].map((tx, idx) => (
              <g key={idx}>
                <path
                  d={`M ${tx} 0 Q ${tx + 150} 135 ${tx + 300} 0`}
                  fill="none"
                  stroke="#181009"
                  strokeWidth="14"
                />
                <path
                  d={`M ${tx} 0 Q ${tx + 150} 135 ${tx + 300} 0`}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="10"
                  strokeDasharray="14 6"
                />
                {/* Hanging Brass Temple Bell at Festoon Center */}
                <line
                  x1={tx + 150}
                  y1="68"
                  x2={tx + 150}
                  y2="115"
                  stroke="#eab308"
                  strokeWidth="3"
                />
                <path
                  d={`M ${tx + 136} 135 L ${tx + 164} 135 L ${tx + 156} 112 L ${tx + 144} 112 Z`}
                  fill="#fef08a"
                  stroke="#181009"
                  strokeWidth="2.5"
                />
              </g>
            ))}
          </svg>
        </div>

        {/* =====================================================================
            ACT II LAYER (34% - 68%): ROYAL CHARIOT WITH SHRI RAM, SITA, LAKSHMAN & HANUMAN
        ===================================================================== */}
        <div
          ref={chariotPlateRef}
          className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
        >
          <img
            src="/art/stage3_return_chariot.png"
            alt="Shri Ram, Sita Mata, Lakshman and Hanuman returning on the Royal Chariot"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b101d] via-transparent to-[#0b101d]/35" />
        </div>

        {/* Act II Foreground Parallax Carved Palace Pillars Framing the Chariot Avenue */}
        <div
          ref={chariotArchLeftRef}
          className="absolute left-0 inset-y-0 w-[16vw] max-w-[220px] pointer-events-none z-15 opacity-0"
        >
          <svg viewBox="0 0 220 900" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M 0 0 L 185 0 L 145 140 L 115 280 L 115 900 L 0 900 Z"
              fill="#2a1608"
              stroke="#d97706"
              strokeWidth="4"
            />
            {/* Glowing Diya Niches on Left Pillar */}
            {[220, 380, 540, 700].map((ny, i) => (
              <g key={i} transform={`translate(58, ${ny})`}>
                <path d="M -22 30 L -22 0 Q 0 -24 22 0 L 22 30 Z" fill="#451a03" stroke="#fbbf24" strokeWidth="2" />
                <circle cx="0" cy="12" r="9" fill="#fef08a" />
              </g>
            ))}
          </svg>
        </div>

        <div
          ref={chariotArchRightRef}
          className="absolute right-0 inset-y-0 w-[16vw] max-w-[220px] pointer-events-none z-15 opacity-0"
        >
          <svg viewBox="0 0 220 900" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M 220 0 L 35 0 L 75 140 L 105 280 L 105 900 L 220 900 Z"
              fill="#2a1608"
              stroke="#d97706"
              strokeWidth="4"
            />
            {[220, 380, 540, 700].map((ny, i) => (
              <g key={i} transform={`translate(162, ${ny})`}>
                <path d="M -22 30 L -22 0 Q 0 -24 22 0 L 22 30 Z" fill="#451a03" stroke="#fbbf24" strokeWidth="2" />
                <circle cx="0" cy="12" r="9" fill="#fef08a" />
              </g>
            ))}
          </svg>
        </div>

        {/* =====================================================================
            ACT III LAYER (65% - 100%): GOLDEN PANORAMA OF AYODHYA & DIWALI BLESSING
        ===================================================================== */}
        <div
          ref={panoramaPlateRef}
          className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
        >
          <img
            src="/art/stage3_golden_panorama.png"
            alt="Golden Panorama of Illuminated Ayodhya on Diwali Night"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/35 to-transparent" />
        </div>

        {/* Foreground 2D SVG Ledge of Glowing Earthen Diyas Along the Bottom Viewport */}
        <div
          ref={foregroundDiyaLedgeRef}
          className="absolute inset-x-0 bottom-0 h-[15vh] pointer-events-none z-20 opacity-0"
        >
          <svg
            viewBox="0 0 1440 160"
            preserveAspectRatio="none"
            className="w-full h-full overflow-visible"
          >
            {/* Carved Sandstone Terrace Ledge */}
            <rect
              x="0"
              y="95"
              width="1440"
              height="70"
              fill="#281509"
              stroke="#181009"
              strokeWidth="3"
            />
            <line x1="0" y1="98" x2="1440" y2="98" stroke="#d97706" strokeWidth="4" />

            {/* 17 Ornate Glowing Earthen Diyas along the Foreground Ledge */}
            {Array.from({ length: 17 }).map((_, i) => {
              const dx = 45 + i * 84;
              return (
                <g key={i} transform={`translate(${dx}, 85)`}>
                  {/* Warm Radial Halo */}
                  <circle cx="0" cy="-22" r="34" fill="#fbbf24" opacity="0.28" />
                  {/* Flickering Flame */}
                  <path
                    d="M 0 -46 C 10 -30, 12 -16, 0 -8 C -12 -16, -10 -30, 0 -46 Z"
                    fill="#fef08a"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    className="animate-flame"
                  />
                  {/* Terracotta Diya Bowl with Gold Rim */}
                  <path
                    d="M -26 -8 Q 0 18 26 -8 L 20 -12 L -20 -12 Z"
                    fill="#b45309"
                    stroke="#181009"
                    strokeWidth="2.5"
                  />
                  <line x1="-22" y1="-10" x2="22" y2="-10" stroke="#fbbf24" strokeWidth="2.5" />
                </g>
              );
            })}
          </svg>
        </div>

        {/* REAL-TIME 2D CANVAS: FLOWER PETAL SHOWER (PUSHPAVARSHA) & GOLDEN SPARKS */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-25"
        />

        {/* ACT I & II STORY CAPTION PILL (When < 72% scroll) */}
        {scrollPct < 72 && (
          <div className="absolute bottom-8 inset-x-4 z-30 flex justify-center pointer-events-none">
            <div className="sacred-stroke-box px-6 py-4 rounded-2xl max-w-2xl text-center backdrop-blur-md">
              <div className="text-xs font-sans font-bold uppercase tracking-[0.25em] text-[#fbbf24] mb-1">
                {actTitle}
              </div>
              <p className="text-base md:text-xl text-[#fffbeb] font-medium">
                {scrollPct < 34
                  ? 'After fourteen years of exile, Shri Ram, Sita Mata, and Lakshman step onto the flower-strewn ghats of the sacred Sarayu River as twilight turns to gold.'
                  : 'Aboard the royal golden chariot with devoted Hanuman kneeling at their feet, the kingdom erupts in joyous sparklers and showers of crimson rose petals.'}
              </p>
            </div>
          </div>
        )}

        {/* ACT III FINALE: ORNATE GOLDEN DIWALI BLESSING SCROLL (72% - 100%) */}
        <div
          ref={finalScrollCardRef}
          className="absolute inset-0 z-30 flex items-center justify-center px-4 pb-12 pointer-events-none opacity-0"
        >
          <div className="pointer-events-auto sacred-stroke-box rounded-3xl px-6 py-7 md:px-12 md:py-9 max-w-2xl text-center backdrop-blur-md relative overflow-hidden">
            {/* Corner Lotus Ornaments */}
            <div className="text-xs md:text-sm font-sans font-bold uppercase tracking-[0.3em] text-[#fde047] mb-2">
              ॥ श्री रामचन्द्राय नमः • शुभ दीपावली ॥
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black sacred-gold-text mb-3 leading-tight">
              The Eternal Light Returns Home
            </h2>

            <p className="text-sm md:text-lg text-[#f5e7c6] leading-relaxed mb-6 font-serif">
              Fourteen years of darkness dissolve into an ocean of golden light. As a million earthen diyas shimmer across the sacred Sarayu and fill the palaces of Ayodhya, may the divine blessings of{' '}
              <span className="text-[#fde047] font-semibold">
                Shri Ram, Sita Mata, Lakshman, and Hanuman
              </span>{' '}
              grace your home with Dharma, peace, prosperity, and boundless joy.
            </p>

            {/* Interactive Blessing & Replay Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={triggerDiyaBlessing}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-[#d97706] via-[#fbbf24] to-[#d97706] text-[#181009] font-sans font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(251,191,36,0.65)] hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-[#181009]"
              >
                <Flame className="w-4 h-4 fill-[#181009]" />
                <span>Offer a Diya & Shower Petals ({blessingCount.toLocaleString()})</span>
              </button>

              <button
                onClick={onReplayEpic}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-[#fde68a] border border-[#fbbf24]/50 font-sans font-semibold text-sm transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Replay the Epic</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

