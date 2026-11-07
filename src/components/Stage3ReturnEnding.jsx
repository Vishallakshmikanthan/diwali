import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Flame,
  Heart,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Exact 240 HD frames extracted from `ending-section-ref/gemini_generated_video_dbc05b5b.mp4` (24fps, 10.0s)
const TOTAL_ENDING_FRAMES = 240;
// 0.00 -> 0.72 scrubs the full Return-to-Ayodhya video from Frame 1 to Frame 240;
// 0.72 -> 1.00 reveals the Movanze-style Golden Diwali Wishes & Tamil Blessing over the final frame
const VIDEO_SCRUB_END = 0.72;

export default function Stage3ReturnEnding({
  onBackTo3DWorld,
  onRestartFullEpic,
  isFullTourActive = false,
  onToggleFullTour,
  onStageComplete,
}) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  // Frame cache & zero-lag smooth scrub state
  const framesRef = useRef([]);
  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const autoPlayingRef = useRef(false);
  const blessingBurstRef = useRef(0);

  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [blessingCount, setBlessingCount] = useState(108);

  // Refs for GSAP-animated parallax layers & post-video Diwali wishes reveal
  const topParallaxArchRef = useRef(null);
  const bottomDiyaParallaxRef = useRef(null);
  const goldenVeilRef = useRef(null);
  const wishesContainerRef = useRef(null);
  const crestRef = useRef(null);
  const wordmarkRef = useRef(null);
  const tamilWishesRef = useRef(null);
  const blessingTextRef = useRef(null);
  const diyaInteractiveRowRef = useRef(null);
  const footerColumnsRef = useRef(null);

  // 1. Preload all 240 frames of `ending-section-ref/gemini_generated_video_dbc05b5b.mp4`
  useEffect(() => {
    let loaded = 0;
    const imgArray = new Array(TOTAL_ENDING_FRAMES);

    const onFrameLoad = () => {
      loaded += 1;
      setLoadedCount(Math.round((loaded / TOTAL_ENDING_FRAMES) * 100));
      if (loaded >= 24) {
        setIsReady(true);
      }
    };

    for (let i = 1; i <= TOTAL_ENDING_FRAMES; i++) {
      const img = new Image();
      const padded = String(i).padStart(4, '0');
      img.src = `/ending/frames/frame_${padded}.jpg`;
      img.onload = onFrameLoad;
      img.onerror = onFrameLoad;
      imgArray[i - 1] = img;
    }
    framesRef.current = imgArray;
  }, []);

  // 2. High-DPI 60FPS Canvas Engine:
  //    Renders the actual Return-to-Ayodhya video frame-by-frame + Multi-Speed Parallax Petals & Particles
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

    // PARALLAX LAYER A (Mid-ground 0.65x speed): Subtle Golden Prana Particles
    const goldenParticles = Array.from({ length: 70 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.3 - Math.random() * 0.7,
      r: 1.0 + Math.random() * 2.2,
      alpha: 0.3 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2,
      parallaxFactor: 55 + Math.random() * 45,
    }));

    // PARALLAX LAYER B (Foreground 1.35x speed): Floating Rose & Marigold Petals (Pushpavarsha)
    // Placed delicately with soft opacity so they enhance depth without obscuring the video!
    const petals = Array.from({ length: 42 }, (_, idx) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: -0.35 + Math.random() * 0.7,
      vy: 0.45 + Math.random() * 0.85,
      size: idx % 3 === 0 ? 5.5 + Math.random() * 3.5 : 3.5 + Math.random() * 2.5,
      rot: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.03,
      isRose: Math.random() > 0.45,
      sway: Math.random() * Math.PI * 2,
      depthSpeed: idx % 3 === 0 ? 135 : 75, // Multi-speed scroll parallax
    }));

    const drawCover = (img, x, y, w, h, scaleMult = 1, offsetY = 0) => {
      if (!img || !img.complete || !img.naturalWidth) return;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const winRatio = w / h;

      // On mobile / portrait screens (`winRatio < 1.05`), standard full-height cover zooms in ~3.8x
      // and crops out Lord Shri Ram (who stands at x ≈ 18%–41% while Sita is at x ≈ 41%–60%).
      // We render a full-screen ambient backdrop of the frame + frame the main video at 1.65x width
      // anchored at `focusX = 0.37` so BOTH Lord Shri Ram and Sita Mata are 100% visible on phones!
      if (winRatio < 1.05) {
        const bgH = h * scaleMult;
        const bgW = bgH * imgRatio;
        const bgX = x + w * 0.5 - bgW * 0.38;
        const bgY = y + (h - bgH) / 2 + offsetY;

        ctx.save();
        ctx.globalAlpha *= 0.28;
        ctx.drawImage(img, bgX, bgY, bgW, bgH);
        ctx.restore();

        const drawW = Math.min(h * imgRatio, w * 1.66) * scaleMult;
        const drawH = drawW / imgRatio;
        const focusX = 0.37; // Centers directly on Lord Shri Ram + Sita Mata together
        const unclampedX = x + w * 0.5 - drawW * focusX;
        const drawX = Math.min(x, Math.max(x + w - drawW, unclampedX));
        const drawY = y + (h - drawH) * 0.46 + offsetY;

        ctx.drawImage(img, drawX, drawY, drawW, drawH);

        // Soft top & bottom atmospheric vignette blend so the portrait frame transitions seamlessly
        const topBlend = ctx.createLinearGradient(0, drawY - 2, 0, drawY + 42);
        topBlend.addColorStop(0, 'rgba(9, 4, 4, 0.92)');
        topBlend.addColorStop(1, 'rgba(9, 4, 4, 0)');
        ctx.fillStyle = topBlend;
        ctx.fillRect(0, Math.max(0, drawY - 4), w, 46);

        const botBlend = ctx.createLinearGradient(
          0,
          drawY + drawH - 42,
          0,
          drawY + drawH + 2
        );
        botBlend.addColorStop(0, 'rgba(9, 4, 4, 0)');
        botBlend.addColorStop(1, 'rgba(9, 4, 4, 0.92)');
        ctx.fillStyle = botBlend;
        ctx.fillRect(0, drawY + drawH - 42, w, 46);
        return;
      }

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

      // Smoothly interpolate scroll progress for butter-smooth frame-by-frame scrubbing
      smoothProgressRef.current +=
        (targetProgressRef.current - smoothProgressRef.current) * 0.18;
      const p = smoothProgressRef.current;

      if (blessingBurstRef.current > 0) {
        blessingBurstRef.current = Math.max(0, blessingBurstRef.current - 0.018);
      }
      const burst = blessingBurstRef.current;

      ctx.clearRect(0, 0, w, h);

      // =====================================================================
      // PRIMARY VISUAL: ACTUAL PROVIDED RETURN-TO-AYODHYA VIDEO (FRAMES 1..240)
      // =====================================================================
      const videoNorm = Math.min(1, Math.max(0, p / VIDEO_SCRUB_END));
      const exactFrameIdx = videoNorm * (TOTAL_ENDING_FRAMES - 1);
      const frameAIndex = Math.floor(exactFrameIdx);
      const frameBIndex = Math.min(TOTAL_ENDING_FRAMES - 1, frameAIndex + 1);
      const subFrameBlend = exactFrameIdx - frameAIndex;

      const frameA = framesRef.current[frameAIndex] || framesRef.current[0];
      const frameB = framesRef.current[frameBIndex];

      // Subtle background depth scale push-in after video finishes (0.72 -> 1.00)
      const postVideoT = Math.max(0, Math.min(1, (p - VIDEO_SCRUB_END) / (1 - VIDEO_SCRUB_END)));
      const videoScale = 1.0 + postVideoT * 0.035;
      const videoParallaxY = postVideoT * -8;

      if (frameA && frameA.complete && frameA.naturalWidth) {
        ctx.save();
        ctx.globalAlpha = 1;
        drawCover(frameA, 0, 0, w, h, videoScale, videoParallaxY);

        if (
          frameB &&
          frameB.complete &&
          frameB.naturalWidth &&
          frameBIndex !== frameAIndex &&
          subFrameBlend > 0.04
        ) {
          ctx.globalAlpha = subFrameBlend;
          drawCover(frameB, 0, 0, w, h, videoScale, videoParallaxY);
        }
        ctx.restore();
      }

      // =====================================================================
      // LAYER 2: SUBTLE ATMOSPHERIC GOLDEN DEPTH HALO
      // =====================================================================
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const auraGrad = ctx.createRadialGradient(
        w * 0.5,
        h * 0.35,
        0,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.65
      );
      auraGrad.addColorStop(0, `rgba(254, 240, 138, ${0.08 + postVideoT * 0.14 + burst * 0.18})`);
      auraGrad.addColorStop(0.5, `rgba(245, 158, 11, ${0.04 + postVideoT * 0.08})`);
      auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = auraGrad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // =====================================================================
      // LAYER 3 (MID-GROUND PARALLAX): RISING GOLDEN CELEBRATORY PARTICLES
      // Moves with distinct scroll parallax offset (`p * e.parallaxFactor`)
      // =====================================================================
      goldenParticles.forEach((e) => {
        e.x += e.vx + Math.sin(t + e.phase) * 0.25;
        e.y += e.vy * (1 + burst * 2.0);
        if (e.y < -20) {
          e.y = h + 20;
          e.x = Math.random() * w;
        }
        if (e.x > w + 20) e.x = -20;
        if (e.x < -20) e.x = w + 20;

        // Scroll-driven multi-speed parallax Y position
        const drawY = ((e.y - p * e.parallaxFactor) % (h + 40) + (h + 40)) % (h + 40) - 20;

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const rad = ctx.createRadialGradient(e.x, drawY, 0, e.x, drawY, e.r * 2.8);
        const alphaBoost = e.alpha * (0.65 + postVideoT * 0.35 + burst * 0.4);
        rad.addColorStop(0, `rgba(255, 251, 235, ${Math.min(1, alphaBoost)})`);
        rad.addColorStop(0.5, `rgba(251, 191, 36, ${Math.min(1, alphaBoost * 0.65)})`);
        rad.addColorStop(1, 'rgba(217, 119, 6, 0)');
        ctx.fillStyle = rad;
        ctx.beginPath();
        ctx.arc(e.x, drawY, e.r * 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // =====================================================================
      // LAYER 4 (FOREGROUND PARALLAX): FLOATING ROSE & MARIGOLD PETALS
      // Moves at faster parallax speed (`p * pt.depthSpeed`) along the frame
      // =====================================================================
      petals.forEach((pt) => {
        pt.x += pt.vx + Math.sin(t * 1.1 + pt.sway) * 0.45;
        pt.y += pt.vy * (1 + burst * 1.8);
        pt.rot += pt.vRot;

        if (pt.y > h + 30) {
          pt.y = -30;
          pt.x = Math.random() * w;
        }
        if (pt.x > w + 30) pt.x = -30;
        if (pt.x < -30) pt.x = w + 30;

        const drawY = ((pt.y - p * pt.depthSpeed) % (h + 60) + (h + 60)) % (h + 60) - 30;

        ctx.save();
        ctx.translate(pt.x, drawY);
        ctx.rotate(pt.rot);
        ctx.globalAlpha = 0.55 + postVideoT * 0.25 + burst * 0.2;
        const pGrad = ctx.createLinearGradient(-pt.size, 0, pt.size, 0);
        if (pt.isRose) {
          pGrad.addColorStop(0, '#f43f5e');
          pGrad.addColorStop(1, '#be123c');
        } else {
          pGrad.addColorStop(0, '#fde047');
          pGrad.addColorStop(1, '#f59e0b');
        }
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, pt.size, pt.size * 0.56, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // 3. GSAP ScrollTrigger Choreography:
  //    0% -> 72%: Video scrubs frame-by-frame with multi-speed foreground edge parallax
  //    72% -> 100%: Smooth fade-in and scale-up of Movanze-style Golden Diwali Wishes & Tamil Blessing
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    targetProgressRef.current = 0;
    smoothProgressRef.current = 0;

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

      // Keep wishes hidden during 0% -> 72% so the video is 100% unobstructed
      tl.set(wishesContainerRef.current, { opacity: 0, pointerEvents: 'none' }, 0);
      tl.set(goldenVeilRef.current, { opacity: 0 }, 0);

      // Foreground Parallax Layer Movement (0% -> 100%)
      tl.fromTo(
        topParallaxArchRef.current,
        { y: 0, scale: 1 },
        { y: -65, scale: 1.06, duration: 1, ease: 'none' },
        0
      );
      tl.fromTo(
        bottomDiyaParallaxRef.current,
        { y: 36, opacity: 0.55 },
        { y: 0, opacity: 1, duration: 1, ease: 'none' },
        0
      );

      // Once video reaches Frame 240 (72% scroll), smoothly fade in warm backdrop veil & scale up Wishes!
      tl.to(
        goldenVeilRef.current,
        { opacity: 1, duration: 0.08, ease: 'power2.out' },
        VIDEO_SCRUB_END
      )
        .set(wishesContainerRef.current, { pointerEvents: 'auto' }, VIDEO_SCRUB_END)
        .fromTo(
          wishesContainerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.06, ease: 'power2.out' },
          VIDEO_SCRUB_END
        )
        .fromTo(
          crestRef.current,
          { opacity: 0, y: 26, scale: 0.88 },
          { opacity: 1, y: 0, scale: 1, duration: 0.08, ease: 'power3.out' },
          0.74
        )
        .fromTo(
          wordmarkRef.current,
          { opacity: 0, y: 34, scale: 0.91, filter: 'blur(6px)' },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.1,
            ease: 'power3.out',
          },
          0.76
        )
        .fromTo(
          tamilWishesRef.current,
          { opacity: 0, y: 24, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.09, ease: 'back.out(1.4)' },
          0.81
        )
        .fromTo(
          blessingTextRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' },
          0.85
        )
        .fromTo(
          diyaInteractiveRowRef.current,
          { opacity: 0, y: 16, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.08, ease: 'power2.out' },
          0.88
        )
        .fromTo(
          footerColumnsRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' },
          0.91
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
      audio.currentTime = p <= VIDEO_SCRUB_END ? (p / VIDEO_SCRUB_END) * 9.8 : 0;
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
        startRatio < VIDEO_SCRUB_END
          ? (startRatio / VIDEO_SCRUB_END) * 9.8
          : 0;
      audioRef.current.play().catch(() => {});
      setSoundEnabled(true);
    }

    let lastTime = performance.now();
    // 0% -> 100% in ~13.6s (so 0% -> 72% matches the 9.8s audio track with zero seeking!)
    const totalDurationMs = 13600;

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
          onStageComplete();
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
    let startTimer;
    if (isFullTourActive && !autoPlayingRef.current) {
      startTimer = setTimeout(() => {
        if (isFullTourActive && !autoPlayingRef.current) {
          startAutoPlayLoop(true);
        }
      }, 350);
    } else if (!isFullTourActive && autoPlayingRef.current) {
      autoPlayingRef.current = false;
      setIsAutoPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
    return () => {
      if (startTimer) clearTimeout(startTimer);
    };
  }, [isFullTourActive]);

  const replayEndingVideo = () => {
    autoPlayingRef.current = false;
    setIsAutoPlaying(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerBlessingShower = () => {
    blessingBurstRef.current = 1.0;
    setBlessingCount((c) => c + 1);
  };

  const getStageCaption = () => {
    if (scrollPct < 22) return 'I. THE ROYAL RETURN TO AYODHYA';
    if (scrollPct < 48) return 'II. PUSHPAVARSHA & DEVOTIONAL WELCOME';
    if (scrollPct < 72) return 'III. SHRI RAM & SITA’S DIVINE ABHAYA BLESSING';
    return 'IV. இனிய தீபாவளி நல்வாழ்த்துக்கள் • HAPPY DIWALI';
  };

  return (
    <section
      ref={sectionRef}
      id="stage-3-ending"
      className="relative w-full h-[580vh] bg-[#090404] select-none"
    >
      {/* Synchronized Audio Track from `ending-section-ref/gemini_generated_video_dbc05b5b.mp4` */}
      <audio ref={audioRef} src="/ending/return_to_ayodhya.mp4" preload="auto" />

      {/* Pinned Fullscreen Viewport */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        {/* =====================================================================
            PRIMARY VISUAL CANVAS:
            Scrubs 240 Frames of the Return-to-Ayodhya Video + Parallax Petals/Particles
        ===================================================================== */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block pointer-events-none"
        />

        {/* =====================================================================
            FOREGROUND PARALLAX LAYER 1: SUBTLE GOLDEN TORAN ARCH CORNERS
            Moves upward at 1.2x scroll speed for depth without blocking the video
        ===================================================================== */}
        <div
          ref={topParallaxArchRef}
          className="absolute inset-x-0 top-0 h-32 pointer-events-none z-10 flex justify-between px-4 md:px-10 opacity-75"
        >
          {/* Left Ornate Corner */}
          <svg viewBox="0 0 180 110" className="w-28 md:w-44 h-auto text-[#fbbf24]/55">
            <path
              d="M 0 0 L 180 0 C 120 12, 65 40, 22 95 L 0 110 Z"
              fill="rgba(24, 12, 6, 0.55)"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="48" cy="28" r="4" fill="#fde68a" />
            <circle cx="88" cy="16" r="3" fill="#fde68a" />
          </svg>
          {/* Right Ornate Corner */}
          <svg
            viewBox="0 0 180 110"
            className="w-28 md:w-44 h-auto text-[#fbbf24]/55 -scale-x-100"
          >
            <path
              d="M 0 0 L 180 0 C 120 12, 65 40, 22 95 L 0 110 Z"
              fill="rgba(24, 12, 6, 0.55)"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="48" cy="28" r="4" fill="#fde68a" />
            <circle cx="88" cy="16" r="3" fill="#fde68a" />
          </svg>
        </div>

        {/* =====================================================================
            FOREGROUND PARALLAX LAYER 2: GLOWING GOLDEN DIYAS ALONG BOTTOM RIM
        ===================================================================== */}
        <div
          ref={bottomDiyaParallaxRef}
          className="absolute inset-x-0 bottom-0 z-20 pointer-events-none flex items-end justify-between px-4 sm:px-12 pb-1.5"
        >
          {/* Subtle Bottom Vignette Gradient */}
          <div
            className="absolute inset-x-0 bottom-0 h-24 -z-10"
            style={{
              background:
                'linear-gradient(to top, rgba(9, 4, 4, 0.85) 0%, rgba(9, 4, 4, 0.35) 55%, transparent 100%)',
            }}
          />
          {Array.from({ length: 11 }).map((_, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center ${
                idx % 2 === 1 ? 'hidden sm:flex' : 'flex'
              }`}
            >
              {/* Flickering Golden Flame */}
              <div className="w-2.5 h-4 rounded-full bg-gradient-to-t from-[#f59e0b] via-[#fde047] to-[#fffbeb] shadow-[0_0_14px_#fbbf24] animate-flame -mb-0.5" />
              {/* Terracotta & Gold Diya Bowl */}
              <div className="w-7 h-2.5 rounded-b-full bg-gradient-to-r from-[#9a3412] via-[#fbbf24] to-[#9a3412] border border-[#fde68a]/60 shadow-md" />
            </div>
          ))}
        </div>

        {/* =====================================================================
            WARM GOLDEN RADIAL VEIL (Fades in only after Frame 240 at 72% scroll
            so the Golden Diwali Wishes Typography gleams over the final frame!)
        ===================================================================== */}
        <div
          ref={goldenVeilRef}
          className="absolute inset-0 pointer-events-none z-20 opacity-0"
          style={{
            background:
              'radial-gradient(circle at 50% 48%, rgba(20, 10, 5, 0.72) 0%, rgba(12, 6, 3, 0.82) 65%, rgba(8, 4, 2, 0.92) 100%)',
          }}
        />

        {/* =====================================================================
            TOP LUXURY NAVIGATION & PLAYBACK CONTROLS BAR
            (Responsive & non-overlapping on Mobile & Desktop)
        ===================================================================== */}
        <header className="absolute top-0 inset-x-0 z-40 px-3 sm:px-6 md:px-10 py-3.5 sm:py-5 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 sm:gap-2.5 pointer-events-auto">
            {onBackTo3DWorld && (
              <button
                onClick={onBackTo3DWorld}
                className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-black/55 hover:bg-[#fbbf24] text-[#fffdf9] hover:text-[#181009] border border-[#fde68a]/35 backdrop-blur-md text-[10px] sm:text-[11px] tracking-[0.14em] sm:tracking-[0.18em] uppercase font-sans font-semibold flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span>3D Ayodhya</span>
              </button>
            )}

            <div className="hidden lg:flex px-3.5 py-2 rounded-full bg-black/45 border border-[#fde68a]/25 backdrop-blur-md items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#fde68a] shadow-[0_0_10px_#fde68a]" />
              <span
                style={{ fontFamily: "'Cinzel', serif" }}
                className="text-[11px] tracking-[0.26em] uppercase text-[#fffdf9]/95 font-semibold whitespace-nowrap"
              >
                FINALE • THE RETURN TO AYODHYA
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 pointer-events-auto">
            {onToggleFullTour && (
              <button
                onClick={onToggleFullTour}
                className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full border backdrop-blur-md text-[10px] sm:text-[11px] font-sans font-extrabold tracking-[0.14em] sm:tracking-[0.2em] uppercase flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(251,191,36,0.4)] whitespace-nowrap ${
                  isFullTourActive
                    ? 'bg-[#fbbf24] text-[#181009] border-[#fffbeb]'
                    : 'bg-[#181009]/85 hover:bg-[#fbbf24] text-[#fde68a] hover:text-[#181009] border-[#fbbf24]/60'
                }`}
              >
                {isFullTourActive ? (
                  <>
                    <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current shrink-0" />
                    <span className="sm:hidden">Pause Tour</span>
                    <span className="hidden sm:inline">Pause Full Tour</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current shrink-0" />
                    <span className="sm:hidden">Full Tour</span>
                    <span className="hidden sm:inline">Full Auto-Play Tour</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={triggerAutoPlay}
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/50 hover:bg-black/75 border border-[#fffdf9]/25 backdrop-blur-md text-[10px] sm:text-[11px] tracking-[0.14em] sm:tracking-[0.2em] uppercase text-[#fffdf9] flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer whitespace-nowrap"
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="w-3 h-3 fill-[#fde68a] text-[#fde68a] shrink-0" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-[#fde68a] text-[#fde68a] shrink-0" />
                  <span>Auto-Play</span>
                </>
              )}
            </button>

            <button
              onClick={toggleSound}
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/50 hover:bg-black/75 border border-[#fffdf9]/25 backdrop-blur-md text-[10px] sm:text-[11px] tracking-[0.14em] sm:tracking-[0.2em] uppercase text-[#fffdf9] flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer whitespace-nowrap"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#fde68a] shrink-0" />
                  <span className="hidden md:inline">Sound On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#fffdf9]/60 shrink-0" />
                  <span className="hidden md:inline">Sound Off</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* =====================================================================
            POST-VIDEO CLIMAX REVEAL (72% - 100% SCROLL):
            MOVANZE-STYLE (`typography-ref`) GOLDEN CALLIGRAPHIC "Happy Diwali"
            + TAMIL FESTIVE WISHES ("இனிய தீபாவளி நல்வாழ்த்துக்கள்!")
            + EMOTIONAL BLESSING & GLOWING DIYAS
        ===================================================================== */}
        <div
          ref={wishesContainerRef}
          className="absolute inset-0 z-30 flex flex-col items-center justify-between pt-16 pb-10 md:py-12 px-4 md:px-8 opacity-0 pointer-events-none"
        >
          <div />

          {/* CENTERPIECE: MOVANZE LUXURY DISPLAY TYPOGRAPHY & TAMIL BLESSING */}
          <div className="relative flex flex-col items-center w-full max-w-6xl mx-auto my-auto">
            {/* 1. Botanical Magnolia/Lotus & Luminous Orb Crest (Exact match to `typography-ref/image.png`) */}
            <div ref={crestRef} className="relative flex flex-col items-center -mb-3 md:-mb-5">
              <svg
                viewBox="0 0 500 145"
                className="w-[210px] sm:w-[270px] md:w-[340px] h-auto overflow-visible drop-shadow-[0_4px_20px_rgba(0,0,0,0.65)]"
              >
                <defs>
                  <radialGradient id="endingLunarOrbGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fffdf9" stopOpacity="0.95" />
                    <stop offset="65%" stopColor="#fef3c7" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Luminous Ivory Moon/Sun Disc behind Blossoms */}
                <circle cx="272" cy="74" r="50" fill="url(#endingLunarOrbGrad)" />
                <circle
                  cx="272"
                  cy="74"
                  r="42"
                  fill="#fffdf9"
                  fillOpacity="0.28"
                  stroke="#fffdf9"
                  strokeOpacity="0.5"
                  strokeWidth="0.9"
                />

                {/* Razor-thin Horizontal Pedestal Hairline */}
                <line
                  x1="85"
                  y1="122"
                  x2="415"
                  y2="122"
                  stroke="#fde68a"
                  strokeOpacity="0.55"
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
                  opacity="0.9"
                />
                <path
                  d="M 380 70 Q 380 88 398 88 Q 380 88 380 106 Q 380 88 362 88 Q 380 88 380 70 Z"
                  fill="#fde68a"
                  opacity="0.95"
                />
                <path
                  d="M 424 54 Q 424 62 432 62 Q 424 62 424 70 Q 424 62 416 62 Q 424 62 424 54 Z"
                  fill="#fde68a"
                  opacity="0.8"
                />
              </svg>
            </div>

            {/* 2. BESPOKE MOVANZE-STYLE CALLIGRAPHIC SWASH WORDMARK ("Happy Diwali")
                Matching `typography-ref/image.png` with variable-width ribbons & inner counter stars */}
            <div ref={wordmarkRef} className="relative w-full flex justify-center">
              <svg
                viewBox="0 0 1360 300"
                className="w-full max-w-[980px] h-auto overflow-visible drop-shadow-[0_8px_28px_rgba(0,0,0,0.85)]"
              >
                <defs>
                  <linearGradient id="endingMovanzeGold" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fffdf9" />
                    <stop offset="50%" stopColor="#fef08a" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>

                {/* Left Variable-Width Calligraphic Ribbon Swash (`Movanze` Left Entry Loop) */}
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
                  fill="url(#endingMovanzeGold)"
                />

                {/* Main High-Contrast Didone Luxury Serif Display Wordmark */}
                <text
                  x="680"
                  y="192"
                  textAnchor="middle"
                  fill="url(#endingMovanzeGold)"
                  style={{
                    fontFamily: "'Bodoni Moda', 'Cormorant Garamond', Georgia, serif",
                    fontSize: '146px',
                    fontWeight: 400,
                    letterSpacing: '0.01em',
                  }}
                >
                  Happy Diwali
                </text>

                {/* Signature 4-Point Inner Counter Stars (+) Inside Round Bowls */}
                <g transform="translate(314, 158)">
                  <path
                    d="M 0 -8 L 2 -2 L 8 0 L 2 2 L 0 8 L -2 2 L -8 0 L -2 -2 Z"
                    fill="#fffdf9"
                  />
                </g>
                <g transform="translate(754, 140)">
                  <path
                    d="M 0 -9 L 2.2 -2.2 L 9 0 L 2.2 2.2 L 0 9 L -2.2 2.2 L -9 0 L -2.2 -2.2 Z"
                    fill="#fffdf9"
                  />
                </g>

                {/* Lower Center Variable-Width Figure-Eight Calligraphic Flourish (`anz` loop in Movanze) */}
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
                  fill="url(#endingMovanzeGold)"
                />

                {/* Right Variable-Width Overarching Calligraphic Hood & Wave Tail (`ze` flourish in Movanze) */}
                <path
                  d="M 1082 54
                     L 1094 38
                     C 1152 42, 1188 86, 1182 142
                     C 1176 188, 1142 206, 1106 196
                     C 1138 198, 1166 178, 1168 140
                     C 1170 92, 1136 58, 1082 54 Z"
                  fill="url(#endingMovanzeGold)"
                />
                <path
                  d="M 1172 152
                     C 1196 122, 1236 118, 1278 148
                     L 1268 166
                     C 1232 136, 1196 134, 1172 158 Z"
                  fill="url(#endingMovanzeGold)"
                />

                {/* Floating 4-Point Concave Sparkle Stars */}
                <path
                  d="M 552 228 Q 552 248 572 248 Q 552 248 552 268 Q 552 248 532 248 Q 552 248 552 228 Z"
                  fill="#fde68a"
                  opacity="0.9"
                />
                <path
                  d="M 482 262 Q 482 273 493 273 Q 482 273 482 284 Q 482 273 471 273 Q 482 273 482 262 Z"
                  fill="#fde68a"
                  opacity="0.75"
                />
              </svg>
            </div>

            {/* 3. SACRED TAMIL DIWALI WISHES ("இனிய தீபாவளி நல்வாழ்த்துக்கள்!") */}
            <div
              ref={tamilWishesRef}
              className="mt-1 mb-2 px-6 py-2 rounded-full bg-gradient-to-r from-transparent via-[#1f1005]/80 to-transparent border-y border-[#fde68a]/40 flex items-center justify-center gap-3"
            >
              <span className="text-[#fde68a] text-sm md:text-lg">✦</span>
              <h2
                style={{ fontFamily: "'Noto Serif Tamil', 'Cinzel', serif" }}
                className="text-xl sm:text-2xl md:text-4xl font-bold tracking-wide text-center bg-gradient-to-b from-[#fffdf9] via-[#fde68a] to-[#f59e0b] bg-clip-text text-transparent drop-shadow-[0_3px_14px_rgba(245,158,11,0.55)]"
              >
                இனிய தீபாவளி நல்வாழ்த்துக்கள்!
              </h2>
              <span className="text-[#fde68a] text-sm md:text-lg">✦</span>
            </div>

            {/* 4. EMOTIONAL FESTIVE BLESSING */}
            <div ref={blessingTextRef} className="max-w-2xl mx-auto text-center px-4 mb-5">
              <p
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                className="text-base sm:text-lg md:text-xl italic text-[#fffdf9]/95 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
              >
                “As Lord Shri Ram, Sita Mata, Lakshmana, and Hanuman Ji return home to a radiant Ayodhya, may the sacred light of Deepavali dispel every darkness and fill your home with eternal peace, prosperity, and boundless joy.”
              </p>
            </div>

            {/* 5. INTERACTIVE CELEBRATION CONTROLS & PUSHPAVARSHA BLESSING BUTTON */}
            <div
              ref={diyaInteractiveRowRef}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              <button
                onClick={triggerBlessingShower}
                className="group px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d97706] via-[#fbbf24] to-[#d97706] text-[#181009] font-sans font-extrabold text-xs tracking-[0.2em] uppercase shadow-[0_0_28px_rgba(251,191,36,0.65)] border border-[#fffdf9] flex items-center gap-2 hover:scale-105 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-[#181009]" />
                <span>Shower Pushpavarsha ({blessingCount})</span>
              </button>

              <button
                onClick={replayEndingVideo}
                className="group px-5 py-2.5 rounded-full bg-black/55 hover:bg-black/80 border border-[#fde68a]/40 backdrop-blur-md text-[11px] uppercase tracking-[0.22em] text-[#fffdf9] flex items-center gap-2 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#fde68a] group-hover:-rotate-90 transition-transform duration-500" />
                <span>Replay Return Video</span>
              </button>

              {onRestartFullEpic && (
                <button
                  onClick={onRestartFullEpic}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-[#fffdf9]/30 backdrop-blur-md text-[11px] uppercase tracking-[0.22em] text-[#fde68a] flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 fill-[#fde68a]" />
                  <span>Restart Full Epic</span>
                </button>
              )}
            </div>

            {/* 5B. CREATOR CREDITS SECTION: Diwali wishes by Vishallakshmikanthan */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5 px-5 py-2 rounded-2xl bg-black/55 border border-[#fbbf24]/40 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.65)]">
              <span
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                className="text-sm sm:text-base text-[#fffdf9] tracking-wide"
              >
                Diwali wishes by{' '}
                <strong
                  style={{ fontFamily: "'Cinzel', serif" }}
                  className="text-[#fde68a] font-bold tracking-wider"
                >
                  Vishallakshmikanthan
                </strong>
              </span>
              <span className="hidden sm:inline text-[#fbbf24]/50">•</span>
              <a
                href="https://www.linkedin.com/in/vishallakshmikanthan/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fbbf24]/15 hover:bg-[#fbbf24] text-[#fde68a] hover:text-[#181009] border border-[#fbbf24]/50 text-[11px] font-sans font-bold tracking-wider uppercase transition-all"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
                <span>Connect on LinkedIn</span>
              </a>
            </div>
          </div>

          {/* 6. BOTTOM EDITORIAL 5-COLUMN MICRO-TYPOGRAPHY BAR (Exact match to `typography-ref/image.png` footer) */}
          <div
            ref={footerColumnsRef}
            className="w-full max-w-6xl mx-auto pt-3.5 border-t border-[#fffdf9]/25 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] mb-4"
          >
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-[#fde68a]/85">
                SACRED RETURN
              </div>
              <div className="text-[10px] tracking-[0.22em] uppercase text-[#fffdf9] font-medium mt-0.5">
                SHRI RAM & SITA
              </div>
            </div>

            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-[#fde68a]/85">
                FESTIVAL OF
              </div>
              <div className="text-[10px] tracking-[0.22em] uppercase text-[#fffdf9] font-medium mt-0.5">
                ETERNAL LIGHT
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <div className="text-[11px] tracking-[0.24em] uppercase text-[#fde68a] font-semibold">
                இனிய தீபாவளி
              </div>
              <div className="text-[11px] tracking-[0.24em] uppercase text-[#fffdf9] font-semibold mt-0.5">
                HAPPY DIWALI
              </div>
            </div>

            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-[#fde68a]/85">
                PEACE &
              </div>
              <div className="text-[10px] tracking-[0.22em] uppercase text-[#fffdf9] font-medium mt-0.5">
                PROSPERITY
              </div>
            </div>

            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-[#fde68a]/85">
                GRAND CLIMAX
              </div>
              <div className="text-[10px] tracking-[0.22em] uppercase text-[#fffdf9] font-medium mt-0.5">
                AYODHYA 2026
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================================
            BOTTOM SCROLL PROGRESS HUD (Visible while scrubbing the video 0% - 72%)
        ===================================================================== */}
        <div
          className={`absolute bottom-8 inset-x-6 md:inset-x-12 z-40 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-none transition-opacity duration-500 ${
            scrollPct >= 72 ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="px-4 py-2 rounded-full bg-black/55 border border-[#fffdf9]/25 backdrop-blur-md flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#fde68a] animate-pulse" />
            <span className="text-[11px] font-sans tracking-[0.22em] uppercase text-[#fffdf9]">
              {getStageCaption()}
            </span>
          </div>

          <div className="px-4 py-2 rounded-full bg-black/55 border border-[#fffdf9]/25 backdrop-blur-md flex items-center gap-3 text-xs font-sans text-[#fffdf9]/90">
            <span className="tracking-[0.16em] uppercase text-[10px]">
              {!isReady
                ? `Preloading Finale (${loadedCount}%)`
                : 'Scroll to Witness the Return to Ayodhya'}
            </span>
            <div className="w-28 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#f59e0b] to-[#fffdf9] transition-all duration-100"
                style={{
                  width: `${Math.min(100, Math.round((scrollPct / 72) * 100))}%`,
                }}
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
