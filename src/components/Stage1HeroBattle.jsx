import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Volume2, VolumeX, Play, RotateCcw } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Frame 1 to 221 covers the full reference video sequence up to Ravana's impact & golden shatter
const TOTAL_VIDEO_FRAMES = 221;
// 0.00 -> 0.66 scrubs the video frames; 0.66 -> 1.00 reveals the `background-ref` sunset & `typography-ref` Movanze Happy Diwali
const IMPACT_SCROLL_END = 0.66;

export default function Stage1HeroBattle({
  isFullTourActive = false,
  onStageComplete,
}) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  // Frame cache & smooth scrub state
  const framesRef = useRef([]);
  const sunsetImageRef = useRef(null);
  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const autoPlayingRef = useRef(false);

  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Refs for GSAP-animated post-impact reveal elements
  const flashOverlayRef = useRef(null);
  const diwaliContainerRef = useRef(null);
  const crestRef = useRef(null);
  const wordmarkRef = useRef(null);
  const subTextRef = useRef(null);
  const bottomColumnsRef = useRef(null);

  // 1. Preload all 221 HD video frames + `background-ref/image.png` (`sunset_bg.png`)
  useEffect(() => {
    let loaded = 0;
    const totalToLoad = TOTAL_VIDEO_FRAMES + 1;
    const imgArray = new Array(TOTAL_VIDEO_FRAMES);

    const onAssetLoad = () => {
      loaded += 1;
      setLoadedCount(Math.round((loaded / totalToLoad) * 100));
      if (loaded >= 30) {
        setIsReady(true);
      }
    };

    const bg = new Image();
    bg.src = '/hero/sunset_bg.png';
    bg.onload = () => {
      sunsetImageRef.current = bg;
      onAssetLoad();
    };
    bg.onerror = onAssetLoad;

    for (let i = 1; i <= TOTAL_VIDEO_FRAMES; i++) {
      const img = new Image();
      const padded = String(i).padStart(4, '0');
      img.src = `/hero/frames/frame_${padded}.jpg`;
      img.onload = onAssetLoad;
      img.onerror = onAssetLoad;
      imgArray[i - 1] = img;
    }
    framesRef.current = imgArray;
  }, []);

  // 2. High-DPI Canvas Engine: Syncs Reference Video Frames + `background-ref` Sunset Horizon
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Subtle rising golden embers over the sunset crags
    const embers = Array.from({ length: 65 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.45) * 0.65,
      vy: -0.35 - Math.random() * 0.95,
      size: 1.1 + Math.random() * 2.4,
      alpha: 0.25 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2,
    }));

    const drawCover = (img, x, y, w, h, scaleMult = 1, offsetY = 0) => {
      if (!img || !img.complete || !img.naturalWidth) return;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const winRatio = w / h;
      let drawW, drawH;
      if (winRatio > imgRatio) {
        drawW = w * scaleMult;
        drawH = (w / imgRatio) * scaleMult;
      } else {
        drawH = h * scaleMult;
        drawW = h * imgRatio * scaleMult;
      }
      const drawX = x + (w - drawW) / 2;
      const drawY = y + (h - drawH) / 2 + offsetY;
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    };

    let t = 0;
    const renderLoop = () => {
      t += 0.016;
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Smoothly interpolate scroll progress for zero-jitter frame scrubbing
      smoothProgressRef.current +=
        (targetProgressRef.current - smoothProgressRef.current) * 0.18;
      const p = smoothProgressRef.current;

      ctx.clearRect(0, 0, w, h);

      // LAYER 1: `background-ref/image.png` (Fiery Crimson & Gold Sunset over Rocky Crags)
      const bgImg = sunsetImageRef.current;
      if (bgImg) {
        const postImpactT = Math.max(
          0,
          Math.min(1, (p - IMPACT_SCROLL_END) / (1 - IMPACT_SCROLL_END))
        );
        // Gentle cinematic push-in on the sunset horizon as Happy Diwali unfolds
        const bgScale = 1.0 + postImpactT * 0.065;
        const bgOffsetY = postImpactT * -12;
        drawCover(bgImg, 0, 0, w, h, bgScale, bgOffsetY);

        // Subtle golden sun breath on the horizon
        if (postImpactT > 0.01) {
          ctx.save();
          const sunX = w * 0.5;
          const sunY = h * 0.52 + bgOffsetY;
          const sunRadius = Math.max(w, h) * (0.24 + Math.sin(t * 1.8) * 0.015);
          const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius);
          sunGlow.addColorStop(0, `rgba(255, 252, 230, ${0.32 * postImpactT})`);
          sunGlow.addColorStop(0.4, `rgba(251, 146, 60, ${0.16 * postImpactT})`);
          sunGlow.addColorStop(1, 'rgba(153, 27, 27, 0)');
          ctx.globalCompositeOperation = 'screen';
          ctx.fillStyle = sunGlow;
          ctx.fillRect(0, 0, w, h);
          ctx.restore();
        }
      }

      // LAYER 2: Scroll-Synced Reference Video (`ram_ravana_hero.mp4`, Frames 1..221)
      if (p <= IMPACT_SCROLL_END + 0.045) {
        const videoNorm = Math.min(1, Math.max(0, p / IMPACT_SCROLL_END));
        const exactFrameIdx = videoNorm * (TOTAL_VIDEO_FRAMES - 1);
        const frameAIndex = Math.floor(exactFrameIdx);
        const frameBIndex = Math.min(TOTAL_VIDEO_FRAMES - 1, frameAIndex + 1);
        const subFrameBlend = exactFrameIdx - frameAIndex;

        const frameA = framesRef.current[frameAIndex];
        const frameB = framesRef.current[frameBIndex];

        // Smooth dissolve right after frame 221 (when the arrow shatters Ravana) into the Sunset Background
        const fadeOutAfterImpact =
          p > IMPACT_SCROLL_END
            ? Math.max(0, 1 - (p - IMPACT_SCROLL_END) / 0.045)
            : 1;

        if (frameA && frameA.complete && frameA.naturalWidth) {
          ctx.save();

          // On the final impact flash & golden shatter frames (219-221), screen-blend over `sunset_bg.png`
          if (frameAIndex >= 219) {
            ctx.globalCompositeOperation = 'screen';
          }
          ctx.globalAlpha = fadeOutAfterImpact;
          drawCover(frameA, 0, 0, w, h, 1.0, 0);

          if (
            frameB &&
            frameB.complete &&
            frameB.naturalWidth &&
            frameBIndex !== frameAIndex &&
            subFrameBlend > 0.04
          ) {
            ctx.globalAlpha = subFrameBlend * fadeOutAfterImpact;
            drawCover(frameB, 0, 0, w, h, 1.0, 0);
          }

          ctx.restore();
        }
      }

      // LAYER 3: Rising Golden Embers over the Sunset Crags (After Arrow Hits Ravana)
      if (p >= IMPACT_SCROLL_END - 0.04) {
        const emberVisibility = Math.min(
          1,
          (p - (IMPACT_SCROLL_END - 0.04)) / 0.12
        );
        embers.forEach((e) => {
          e.x += e.vx + Math.sin(t + e.phase) * 0.3;
          e.y += e.vy;
          if (e.y < -10) {
            e.y = h + 10;
            e.x = Math.random() * w;
          }
          if (e.x > w + 10) e.x = -10;
          if (e.x < -10) e.x = w + 10;

          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          const rad = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.size * 2.6);
          rad.addColorStop(0, `rgba(255, 251, 235, ${e.alpha * emberVisibility})`);
          rad.addColorStop(0.5, `rgba(251, 191, 36, ${e.alpha * 0.6 * emberVisibility})`);
          rad.addColorStop(1, 'rgba(220, 38, 38, 0)');
          ctx.fillStyle = rad;
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.size * 2.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }

      animId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // 3. GSAP ScrollTrigger Choreography
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.35,
          onUpdate: (self) => {
            const p = self.progress;
            targetProgressRef.current = p;
            setScrollPct(Math.round(p * 100));
          },
        },
      });

      tl.set(diwaliContainerRef.current, { opacity: 0, pointerEvents: 'none' }, 0);

      // Blinding white-gold impact flash right when the arrow pierces Ravana (~64% -> 67%)
      tl.fromTo(
        flashOverlayRef.current,
        { opacity: 0 },
        { opacity: 0.88, duration: 0.025, ease: 'power4.in' },
        0.635
      ).to(
        flashOverlayRef.current,
        { opacity: 0, duration: 0.065, ease: 'power2.out' },
        0.66
      );

      // Reveal Movanze-style "Happy Diwali" over the Crimson Sunset Background (66% -> 100%)
      tl.set(diwaliContainerRef.current, { pointerEvents: 'auto' }, 0.66)
        .fromTo(
          diwaliContainerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.05, ease: 'power2.out' },
          0.66
        )
        .fromTo(
          crestRef.current,
          { opacity: 0, y: 26, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.1, ease: 'power3.out' },
          0.68
        )
        .fromTo(
          wordmarkRef.current,
          { opacity: 0, y: 34, scale: 0.93, filter: 'blur(6px)' },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.13,
            ease: 'power3.out',
          },
          0.70
        )
        .fromTo(
          subTextRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' },
          0.78
        )
        .fromTo(
          bottomColumnsRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' },
          0.82
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [soundEnabled]);

  const toggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (soundEnabled) {
      audio.pause();
      setSoundEnabled(false);
    } else {
      const p = targetProgressRef.current;
      audio.currentTime = p <= IMPACT_SCROLL_END ? (p / IMPACT_SCROLL_END) * 9.2 : 0;
      audio.play().catch(() => {});
      setSoundEnabled(true);
    }
  };

  const startAutoPlayLoop = (notifyComplete = false) => {
    autoPlayingRef.current = true;
    setIsAutoPlaying(true);

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    let currentY = window.scrollY;
    if (currentY >= maxScroll - 20) {
      currentY = 0;
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    if (audioRef.current) {
      const startRatio = maxScroll > 0 ? currentY / maxScroll : 0;
      audioRef.current.currentTime =
        startRatio < IMPACT_SCROLL_END
          ? (startRatio / IMPACT_SCROLL_END) * 9.2
          : 0;
      audioRef.current.play().catch(() => {});
      setSoundEnabled(true);
    }

    let lastTime = performance.now();
    // 0% -> 100% in ~13.9s (so 0% -> 66% matches the 9.2s audio track with zero seeking!)
    const totalDurationMs = 13900;

    const step = (now) => {
      if (!autoPlayingRef.current) return;
      const dt = Math.min(50, now - lastTime);
      lastTime = now;

      const maxS = document.documentElement.scrollHeight - window.innerHeight;
      currentY += (maxS / totalDurationMs) * dt;

      if (currentY < maxS - 1) {
        window.scrollTo({ top: currentY, behavior: 'instant' });
        requestAnimationFrame(step);
      } else {
        window.scrollTo({ top: maxS, behavior: 'instant' });
        autoPlayingRef.current = false;
        setIsAutoPlaying(false);
        if (notifyComplete && onStageComplete) {
          setTimeout(() => {
            onStageComplete();
          }, 1600);
        }
      }
    };
    requestAnimationFrame(step);
  };

  const triggerAutoPlay = () => {
    if (autoPlayingRef.current) {
      autoPlayingRef.current = false;
      setIsAutoPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      return;
    }
    startAutoPlayLoop(false);
  };

  useEffect(() => {
    if (isFullTourActive && !autoPlayingRef.current) {
      startAutoPlayLoop(true);
    } else if (!isFullTourActive && autoPlayingRef.current) {
      autoPlayingRef.current = false;
      setIsAutoPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [isFullTourActive]);

  const resetToTop = () => {
    autoPlayingRef.current = false;
    setIsAutoPlaying(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStageCaption = () => {
    if (scrollPct < 15) return 'I. THE DIVINE AIM';
    if (scrollPct < 39) return 'II. FLIGHT OF THE GOLDEN ARROW';
    if (scrollPct < 52) return 'III. REFLECTION IN RAVANA’S EYES';
    if (scrollPct < 66) return 'IV. THE ARROW PIERCES RAVANA';
    return 'V. HAPPY DIWALI — TRIUMPH OF LIGHT';
  };

  return (
    <section
      ref={sectionRef}
      id="hero-stage"
      className="relative w-full h-[560vh] bg-[#090404] select-none"
    >
      {/* Reference Video Audio Track */}
      <audio ref={audioRef} src="/hero/ram_ravana_hero.mp4" preload="auto" />

      {/* Pinned Fullscreen Viewport */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        {/* HIGH-DPI CANVAS: Scrubs Video Frames (0% -> 66%) & Reveals Full `background-ref` Sunset (66% -> 100%) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block pointer-events-none"
        />

        {/* IMPACT FLASH OVERLAY (When Arrow Pierces Ravana) */}
        <div
          ref={flashOverlayRef}
          className="absolute inset-0 pointer-events-none z-20 opacity-0"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, #ffffff 0%, #fef08a 40%, #ea580c 80%, transparent 100%)',
          }}
        />

        {/* =====================================================================
            TOP MINIMALIST LUXURY CONTROLS BAR
        ===================================================================== */}
        <header className="absolute top-0 inset-x-0 z-40 px-6 md:px-12 py-6 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-3 pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-[#fde68a] shadow-[0_0_10px_#fde68a]" />
            <span
              style={{ fontFamily: "'Cinzel', serif" }}
              className="text-xs tracking-[0.32em] uppercase text-[#fffdf9]/90 font-semibold"
            >
              THE RAMAYANA EPIC
            </span>
          </div>

          <div className="flex items-center gap-3 pointer-events-auto">
            <button
              onClick={triggerAutoPlay}
              className="px-4 py-2 rounded-full bg-black/40 hover:bg-black/65 border border-[#fffdf9]/20 backdrop-blur-md text-[11px] tracking-[0.2em] uppercase text-[#fffdf9] flex items-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-3 h-3 fill-[#fde68a] text-[#fde68a]" />
              <span>{isAutoPlaying ? 'Pause' : 'Auto-Play'}</span>
            </button>

            <button
              onClick={toggleSound}
              className="px-4 py-2 rounded-full bg-black/40 hover:bg-black/65 border border-[#fffdf9]/20 backdrop-blur-md text-[11px] tracking-[0.2em] uppercase text-[#fffdf9] flex items-center gap-2 transition-all cursor-pointer"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#fde68a]" />
                  <span className="hidden sm:inline">Sound On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#fffdf9]/60" />
                  <span className="hidden sm:inline">Sound Off</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* =====================================================================
            POST-IMPACT REVEAL (66% - 100% SCROLL):
            MOVANZE-STYLE (`typography-ref`) LUXURY CALLIGRAPHIC "Happy Diwali"
            OVER THE UNOBSTRUCTED `background-ref` CRIMSON SUNSET SKY
        ===================================================================== */}
        <div
          ref={diwaliContainerRef}
          className="absolute inset-0 z-30 flex flex-col items-center justify-between pt-14 pb-8 md:py-14 px-6 opacity-0 pointer-events-none"
        >
          <div />

          {/* CENTERPIECE: MOVANZE LUXURY DISPLAY TYPOGRAPHY & FLORAL-ORB CREST */}
          <div className="relative flex flex-col items-center w-full max-w-6xl mx-auto my-auto -mt-6 md:-mt-10">
            {/* 1. Botanical Magnolia/Lotus & Luminous Orb Crest (Exact match to `typography-ref/image.png`) */}
            <div ref={crestRef} className="relative flex flex-col items-center -mb-2 md:-mb-4">
              <svg
                viewBox="0 0 500 145"
                className="w-[240px] sm:w-[320px] md:w-[390px] h-auto overflow-visible drop-shadow-[0_4px_20px_rgba(0,0,0,0.45)]"
              >
                <defs>
                  <radialGradient id="lunarOrbGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fffdf9" stopOpacity="0.95" />
                    <stop offset="65%" stopColor="#fef3c7" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Luminous Ivory Moon/Sun Disc behind Blossoms */}
                <circle cx="272" cy="74" r="50" fill="url(#lunarOrbGrad)" />
                <circle
                  cx="272"
                  cy="74"
                  r="42"
                  fill="#fffdf9"
                  fillOpacity="0.28"
                  stroke="#fffdf9"
                  strokeOpacity="0.45"
                  strokeWidth="0.8"
                />

                {/* Razor-thin Horizontal Pedestal Hairline */}
                <line
                  x1="85"
                  y1="122"
                  x2="415"
                  y2="122"
                  stroke="#fffdf9"
                  strokeOpacity="0.45"
                  strokeWidth="1"
                />

                {/* Botanical Branch & Olive-Bronze Leaves */}
                <path
                  d="M 196 122 C 214 108, 230 90, 244 70 M 218 102 C 236 108, 252 116, 268 122"
                  fill="none"
                  stroke="#78350f"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M 174 120 C 186 106, 204 106, 214 120 C 198 124, 184 124, 174 120 Z"
                  fill="#656d3f"
                />
                <path
                  d="M 282 122 C 298 110, 320 112, 334 124 C 314 130, 296 128, 282 122 Z"
                  fill="#656d3f"
                />

                {/* Left Blossom Bud */}
                <path
                  d="M 194 50 C 186 66, 192 84, 206 90 C 214 76, 208 58, 194 50 Z"
                  fill="#fffdf9"
                  stroke="#d6c29f"
                  strokeWidth="1"
                />

                {/* Center Magnolia Blossom */}
                <g transform="translate(242, 64)">
                  <path
                    d="M 0 18 C -22 6, -26 -18, -8 -34 C 0 -20, 4 -4, 0 18 Z"
                    fill="#fffdf9"
                    stroke="#d6c29f"
                    strokeWidth="1"
                  />
                  <path
                    d="M 0 18 C 22 6, 26 -18, 8 -34 C 0 -20, -4 -4, 0 18 Z"
                    fill="#f7efe2"
                    stroke="#d6c29f"
                    strokeWidth="1"
                  />
                  <path
                    d="M 0 20 C -12 -2, -10 -26, 0 -38 C 10 -26, 12 -2, 0 20 Z"
                    fill="#ffffff"
                    stroke="#e5d5b5"
                    strokeWidth="1"
                  />
                  <circle cx="0" cy="12" r="3.5" fill="#b45309" />
                </g>

                {/* Right Magnolia Blossom */}
                <g transform="translate(278, 94)">
                  <path
                    d="M 0 26 C -26 16, -34 -6, -16 -24 C -4 -12, 0 6, 0 26 Z"
                    fill="#fffdf9"
                    stroke="#d6c29f"
                    strokeWidth="1"
                  />
                  <path
                    d="M 0 26 C 26 16, 36 -4, 22 -24 C 8 -12, 2 6, 0 26 Z"
                    fill="#f7efe2"
                    stroke="#d6c29f"
                    strokeWidth="1"
                  />
                  <path
                    d="M 0 26 C -10 8, -8 -14, 2 -26 C 12 -14, 10 8, 0 26 Z"
                    fill="#ffffff"
                    stroke="#e5d5b5"
                    strokeWidth="1"
                  />
                  <circle cx="0" cy="18" r="4" fill="#b45309" />
                </g>

                {/* Signature 4-Point Concave Sparkle Stars (✦) from `typography-ref/image.png` */}
                <path
                  d="M 388 20 Q 388 30 398 30 Q 388 30 388 40 Q 388 30 378 30 Q 388 30 388 20 Z"
                  fill="#fde68a"
                  opacity="0.85"
                />
                <path
                  d="M 380 70 Q 380 88 398 88 Q 380 88 380 106 Q 380 88 362 88 Q 380 88 380 70 Z"
                  fill="#fde68a"
                  opacity="0.9"
                />
                <path
                  d="M 424 54 Q 424 62 432 62 Q 424 62 424 70 Q 424 62 416 62 Q 424 62 424 54 Z"
                  fill="#fde68a"
                  opacity="0.75"
                />
              </svg>
            </div>

            {/* 2. BESPOKE MOVANZE-STYLE CALLIGRAPHIC SWASH WORDMARK ("Happy Diwali")
                Crafted with true variable-width filled calligraphic ribbons (thin 1.5px hairlines -> thick 16px swells) */}
            <div ref={wordmarkRef} className="relative w-full flex justify-center">
              <svg
                viewBox="0 0 1360 320"
                className="w-full max-w-[1160px] h-auto overflow-visible drop-shadow-[0_8px_28px_rgba(0,0,0,0.65)]"
              >
                <defs>
                  <linearGradient id="movanzeCreamGold" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fffdf9" />
                    <stop offset="55%" stopColor="#f7efe2" />
                    <stop offset="100%" stopColor="#e6cfa8" />
                  </linearGradient>
                </defs>

                {/* =========================================================
                    LEFT VARIABLE-WIDTH CALLIGRAPHIC RIBBON SWASH (Exact `Movanze` Left Entry Loop)
                    Starts with a chisel ribbon at top-left, tapers to a hairline, swells at the bottom loop,
                    and intertwines into a figure-eight loop under the first letter!
                ========================================================= */}
                <path
                  d="M 42 78
                     L 54 62
                     C 98 68, 122 104, 120 158
                     C 118 214, 136 248, 182 248
                     C 226 248, 256 210, 286 210
                     C 308 210, 318 226, 312 242
                     C 306 256, 282 260, 260 248
                     C 232 232, 210 192, 196 145
                     L 204 142
                     C 218 186, 240 222, 268 236
                     C 284 244, 298 242, 300 232
                     C 302 222, 292 218, 278 220
                     C 250 224, 222 256, 176 256
                     C 122 256, 102 218, 106 158
                     C 110 108, 86 82, 42 78 Z"
                  fill="url(#movanzeCreamGold)"
                />

                {/* =========================================================
                    MAIN HIGH-CONTRAST DIDONE LUXURY SERIF DISPLAY WORDMARK
                ========================================================= */}
                <text
                  x="680"
                  y="192"
                  textAnchor="middle"
                  fill="url(#movanzeCreamGold)"
                  style={{
                    fontFamily: "'Bodoni Moda', 'Cormorant Garamond', Georgia, serif",
                    fontSize: '146px',
                    fontWeight: 400,
                    letterSpacing: '0.01em',
                  }}
                >
                  Happy Diwali
                </text>

                {/* =========================================================
                    SIGNATURE 4-POINT INNER COUNTER STARS (+) INSIDE ROUND BOWLS (Matching `o` in Movanze)
                ========================================================= */}
                {/* Inside 'a' of Happy */}
                <g transform="translate(314, 158)">
                  <path
                    d="M 0 -8 L 2 -2 L 8 0 L 2 2 L 0 8 L -2 2 L -8 0 L -2 -2 Z"
                    fill="#fffdf9"
                  />
                </g>
                {/* Inside 'D' of Diwali */}
                <g transform="translate(754, 140)">
                  <path
                    d="M 0 -9 L 2.2 -2.2 L 9 0 L 2.2 2.2 L 0 9 L -2.2 2.2 L -9 0 L -2.2 -2.2 Z"
                    fill="#fffdf9"
                  />
                </g>

                {/* =========================================================
                    LOWER CENTER VARIABLE-WIDTH FIGURE-EIGHT CALLIGRAPHIC FLOURISH (Exact `anz` loop in Movanze)
                    Hairline loops on left & right with a sculpted chisel-tip ribbon stem in the center!
                ========================================================= */}
                {/* Left & Right Intertwined Hairline-to-Ribbon Figure-Eight Loop */}
                <path
                  d="M 796 190
                     C 796 244, 836 278, 884 268
                     C 922 260, 926 226, 886 220
                     C 842 214, 742 276, 678 268
                     C 634 262, 632 224, 676 218
                     C 722 212, 774 248, 796 306
                     L 780 314
                     C 762 256, 718 220, 676 224
                     C 646 228, 646 254, 680 260
                     C 740 268, 840 206, 888 214
                     C 938 222, 936 268, 886 276
                     C 830 286, 784 250, 784 190 Z"
                  fill="url(#movanzeCreamGold)"
                />

                {/* =========================================================
                    RIGHT VARIABLE-WIDTH OVERARCHING CALLIGRAPHIC HOOD & WAVE TAIL (Exact `ze` flourish in Movanze)
                ========================================================= */}
                <path
                  d="M 1082 54
                     L 1094 38
                     C 1152 42, 1188 86, 1182 142
                     C 1176 188, 1142 206, 1106 196
                     C 1138 198, 1166 178, 1168 140
                     C 1170 92, 1136 58, 1082 54 Z"
                  fill="url(#movanzeCreamGold)"
                />
                {/* Sweeping Right Calligraphic Wave Ribbon */}
                <path
                  d="M 1172 152
                     C 1196 122, 1236 118, 1278 148
                     L 1268 166
                     C 1232 136, 1196 134, 1172 158 Z"
                  fill="url(#movanzeCreamGold)"
                />

                {/* Bottom-Left Floating 4-Point Concave Sparkle Stars (Matching `typography-ref`) */}
                <path
                  d="M 552 228 Q 552 248 572 248 Q 552 248 552 268 Q 552 248 532 248 Q 552 248 552 228 Z"
                  fill="#fde68a"
                  opacity="0.85"
                />
                <path
                  d="M 482 262 Q 482 273 493 273 Q 482 273 482 284 Q 482 273 471 273 Q 482 273 482 262 Z"
                  fill="#fde68a"
                  opacity="0.7"
                />
              </svg>
            </div>

            {/* 3. Subtle English Caption & Replay Button */}
            <div ref={subTextRef} className="mt-1 flex flex-col items-center text-center">
              <p
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="text-base sm:text-lg md:text-xl italic text-[#fffdf9]/90 max-w-lg tracking-wide mb-5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
              >
                Light triumphs over darkness as a new dawn awakens on the horizon.
              </p>

              <button
                onClick={resetToTop}
                className="group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-black/40 hover:bg-black/65 border border-[#fffdf9]/30 backdrop-blur-md text-[11px] uppercase tracking-[0.26em] text-[#fffdf9] transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#fde68a] group-hover:-rotate-90 transition-transform duration-500" />
                <span>Replay the Arrow Sequence</span>
              </button>
            </div>
          </div>

          {/* 4. BOTTOM EDITORIAL 5-COLUMN MICRO-TYPOGRAPHY BAR (Exact match to `typography-ref/image.png` footer) */}
          <div
            ref={bottomColumnsRef}
            className="w-full max-w-6xl mx-auto pt-4 border-t border-[#fffdf9]/20 grid grid-cols-2 sm:grid-cols-5 gap-4 text-center font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
          >
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-[#fde68a]/80">
                CHAPTER I
              </div>
              <div className="text-[10px] tracking-[0.22em] uppercase text-[#fffdf9] font-medium mt-0.5">
                THE DIVINE BOW
              </div>
            </div>

            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-[#fde68a]/80">
                VICTORY OF
              </div>
              <div className="text-[10px] tracking-[0.22em] uppercase text-[#fffdf9] font-medium mt-0.5">
                SACRED LIGHT
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <div className="text-[11px] tracking-[0.26em] uppercase text-[#fde68a] font-semibold">
                ELEGANT DISPLAY
              </div>
              <div className="text-[11px] tracking-[0.24em] uppercase text-[#fffdf9] font-semibold mt-0.5">
                HAPPY DIWALI
              </div>
            </div>

            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-[#fde68a]/80">
                RADIANT &
              </div>
              <div className="text-[10px] tracking-[0.22em] uppercase text-[#fffdf9] font-medium mt-0.5">
                ETERNAL
              </div>
            </div>

            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-[#fde68a]/80">
                EPIC EDITION
              </div>
              <div className="text-[10px] tracking-[0.22em] uppercase text-[#fffdf9] font-medium mt-0.5">
                AYODHYA
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================================
            BOTTOM SCROLL PROGRESS HUD (Visible only while scrubbing the video 0% - 66%)
        ===================================================================== */}
        <div
          className={`absolute bottom-6 inset-x-6 md:inset-x-12 z-40 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-none transition-opacity duration-500 ${
            scrollPct >= 66 ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="px-4 py-2 rounded-full bg-black/50 border border-[#fffdf9]/20 backdrop-blur-md flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#fde68a] animate-pulse" />
            <span className="text-[11px] font-sans tracking-[0.22em] uppercase text-[#fffdf9]">
              {getStageCaption()}
            </span>
          </div>

          <div className="px-4 py-2 rounded-full bg-black/50 border border-[#fffdf9]/20 backdrop-blur-md flex items-center gap-3 text-xs font-sans text-[#fffdf9]/85">
            <span className="tracking-[0.16em] uppercase text-[10px]">
              {!isReady ? `Loading Frames (${loadedCount}%)` : 'Scroll to Unleash the Arrow'}
            </span>
            <div className="w-28 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#f59e0b] to-[#fffdf9] transition-all duration-100"
                style={{ width: `${Math.min(100, Math.round((scrollPct / 66) * 100))}%` }}
              />
            </div>
            <span className="font-mono text-[11px] text-[#fde68a] w-8 text-right">
              {scrollPct}%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
