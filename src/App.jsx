import React, { useState, useEffect } from 'react';
import Stage1HeroBattle from './components/Stage1HeroBattle';
import Stage2AyodhyaWorld from './components/Stage2AyodhyaWorld';
import Stage3ReturnEnding from './components/Stage3ReturnEnding';
import {
  Sparkles,
  Sun,
  Moon,
  Flame,
  Compass,
  X,
  ArrowRight,
  Crown,
  Play,
  Pause,
} from 'lucide-react';

export default function App() {
  // 'hero' = Stage 1 Hero Battle
  // 'world3d' = Stage 2 Full 3D Ancient Ayodhya World
  // 'ending' = Stage 3 Return to Ayodhya Video & Golden Diwali Wishes Finale
  const [currentStage, setCurrentStage] = useState('hero');
  const [initialLightingMode, setInitialLightingMode] = useState('auto');
  const [isFullTourActive, setIsFullTourActive] = useState(false);

  // Stage 1 -> Stage 2 Popup state
  const [showCelebrationPopup, setShowCelebrationPopup] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);
  const [isPastImpact, setIsPastImpact] = useState(false);

  // Stage 2 -> Stage 3 Ending Popup state
  const [showEndingPopup, setShowEndingPopup] = useState(false);
  const [endingPopupDismissed, setEndingPopupDismissed] = useState(false);
  const [isAtRiverGhats, setIsAtRiverGhats] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Do not pop up manual modals while Full Auto-Play Tour is actively driving transitions
      if (isFullTourActive) return;

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const ratio = window.scrollY / maxScroll;

      if (currentStage === 'hero') {
        setIsPastImpact(ratio >= 0.68);
        if (ratio >= 0.88 && !popupDismissed) {
          setShowCelebrationPopup(true);
        } else if (ratio < 0.72) {
          setShowCelebrationPopup(false);
          setPopupDismissed(false);
        }
      } else if (currentStage === 'world3d') {
        setIsAtRiverGhats(ratio >= 0.84);
        if (ratio >= 0.92 && !endingPopupDismissed) {
          setShowEndingPopup(true);
        } else if (ratio < 0.82) {
          setShowEndingPopup(false);
          setEndingPopupDismissed(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentStage, popupDismissed, endingPopupDismissed, isFullTourActive]);

  const enterDiwaliCelebrations = (mode = 'auto', keepTour = false) => {
    setInitialLightingMode(mode);
    setShowCelebrationPopup(false);
    setEndingPopupDismissed(false);
    setShowEndingPopup(false);
    if (!keepTour) setIsFullTourActive(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
    setCurrentStage('world3d');
  };

  const enterEndingSection = (keepTour = false) => {
    setShowEndingPopup(false);
    if (!keepTour) setIsFullTourActive(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
    setCurrentStage('ending');
  };

  const returnToHero = () => {
    setIsFullTourActive(false);
    setCurrentStage('hero');
    setPopupDismissed(false);
    setShowCelebrationPopup(false);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 20);
  };

  const returnTo3DWorld = () => {
    setIsFullTourActive(false);
    setCurrentStage('world3d');
    setEndingPopupDismissed(false);
    setShowEndingPopup(false);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 20);
  };

  const toggleFullAutoTour = () => {
    if (isFullTourActive) {
      setIsFullTourActive(false);
      return;
    }
    setShowCelebrationPopup(false);
    setShowEndingPopup(false);
    // If at the very end of Stage 3, restart from Stage 1 Hero for the full tour
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (currentStage === 'ending' && maxScroll > 0 && window.scrollY >= maxScroll - 30) {
      setCurrentStage('hero');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        setIsFullTourActive(true);
      }, 40);
    } else {
      setIsFullTourActive(true);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#090404] text-[#f7efe2]">
      {/* =====================================================================
          GLOBAL FULL AUTO-PLAY TOUR BUTTON (TOP CENTER)
          Plays seamlessly through Stage 1 -> Stage 2 (3D Ayodhya) -> Stage 3 (Finale)
      ===================================================================== */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <button
          onClick={toggleFullAutoTour}
          className={`pointer-events-auto px-4 py-2 rounded-full border backdrop-blur-md text-[11px] font-sans font-extrabold tracking-[0.2em] uppercase flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_24px_rgba(251,191,36,0.45)] ${
            isFullTourActive
              ? 'bg-[#fbbf24] text-[#181009] border-[#fffbeb]'
              : 'bg-[#181009]/85 hover:bg-[#fbbf24] text-[#fde68a] hover:text-[#181009] border-[#fbbf24]/60'
          }`}
        >
          {isFullTourActive ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause Full Auto-Tour</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Full Auto-Play Tour</span>
            </>
          )}
        </button>
      </div>

      {/* =====================================================================
          STAGE 1: HERO BATTLE & HAPPY DIWALI REVEAL
      ===================================================================== */}
      {currentStage === 'hero' && (
        <>
          <Stage1HeroBattle
            isFullTourActive={isFullTourActive}
            onStageComplete={() => enterDiwaliCelebrations('auto', true)}
          />

          {/* FLOATING PILL AFTER IMPACT (If user minimized popup or wants quick entry) */}
          {isPastImpact && !showCelebrationPopup && !isFullTourActive && (
            <div className="fixed bottom-20 inset-x-0 z-40 flex justify-center pointer-events-none px-4">
              <button
                onClick={() => setShowCelebrationPopup(true)}
                className="pointer-events-auto group px-7 py-3.5 rounded-full bg-gradient-to-r from-[#d97706] via-[#fbbf24] to-[#d97706] text-[#181009] font-sans font-extrabold text-xs tracking-[0.22em] uppercase shadow-[0_0_35px_rgba(251,191,36,0.75)] border-2 border-[#fffbeb] flex items-center gap-3 hover:scale-105 transition-all cursor-pointer animate-bounce"
              >
                <Flame className="w-4 h-4 fill-[#181009]" />
                <span>Enter Diwali Celebrations • 3D Ayodhya</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* POPUP 1: AFTER HERO SECTION -> "Enter Diwali Celebrations" */}
          {showCelebrationPopup && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
              <div className="relative w-full max-w-xl rounded-3xl bg-gradient-to-b from-[#241308] via-[#160c06] to-[#0d0704] border-2 border-[#fbbf24] p-6 md:p-8 shadow-[0_0_70px_rgba(245,158,11,0.5)] text-center overflow-hidden">
                <div
                  className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 pointer-events-none opacity-45"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(251,191,36,0.8) 0%, transparent 70%)',
                  }}
                />

                <button
                  onClick={() => {
                    setShowCelebrationPopup(false);
                    setPopupDismissed(true);
                  }}
                  title="Minimize to view Happy Diwali screen"
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#fde68a] flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fbbf24]/15 border border-[#fbbf24]/45 text-[#fde68a] text-[11px] font-sans font-bold tracking-[0.24em] uppercase mb-4">
                  <Compass className="w-3.5 h-3.5 text-[#fbbf24]" />
                  <span>Treta Yuga • Kingdom of Ayodhya</span>
                </div>

                <h2
                  style={{ fontFamily: "'Cinzel', serif" }}
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#fffbeb] tracking-wide mb-3 drop-shadow-[0_2px_12px_rgba(251,191,36,0.4)]"
                >
                  Enter Diwali Celebrations
                </h2>

                <p className="text-sm md:text-base text-[#e6d5b8] font-serif leading-relaxed max-w-lg mx-auto mb-6">
                  Step through the grand Royal Torana Gate into a breathtaking, fully 3D ancient Ayodhya — alive with thousands of glowing diyas, palaces, Shri Ram Mandir Maha Aarti, royal elephants, chariots, festive markets, and the sacred Sarayu River.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-left mb-6">
                  {[
                    { code: 'S1', name: 'Grand Entry & Toran' },
                    { code: 'S2', name: 'Festive Streets & Dance' },
                    { code: 'S3', name: 'Homes, Sweets & Crackers' },
                    { code: 'S4', name: 'Shri Ram Temple Aarti' },
                    { code: 'S5', name: 'Royal Market & Crafts' },
                    { code: 'S6', name: 'Sarayu River Ghats' },
                  ].map((s) => (
                    <div
                      key={s.code}
                      className="px-3 py-2 rounded-xl bg-white/5 border border-[#fbbf24]/25 flex items-center gap-2"
                    >
                      <span className="px-1.5 py-0.5 rounded bg-[#fbbf24] text-[#181009] font-sans font-extrabold text-[10px]">
                        {s.code}
                      </span>
                      <span className="text-xs font-sans text-[#fffbeb] truncate">
                        {s.name}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => enterDiwaliCelebrations('auto', false)}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#d97706] via-[#fbbf24] to-[#d97706] hover:from-[#f59e0b] hover:to-[#fbbf24] text-[#181009] font-sans font-extrabold text-sm tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(251,191,36,0.65)] border border-[#fffbeb] flex items-center justify-center gap-3 transition-all cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 fill-[#181009]" />
                  <span>Enter Diwali Celebrations (3D World)</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5">
                  <button
                    onClick={() => enterDiwaliCelebrations('day', false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-[#fbbf24]/35 text-xs font-sans font-semibold text-[#fde68a] flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Sun className="w-3.5 h-3.5 text-[#fbbf24]" />
                    <span>Start in Golden Day Mode</span>
                  </button>
                  <button
                    onClick={() => enterDiwaliCelebrations('night', false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-[#fbbf24]/35 text-xs font-sans font-semibold text-[#fde68a] flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Moon className="w-3.5 h-3.5 text-[#fde047]" />
                    <span>Start in Illuminated Night Mode</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* =====================================================================
          STAGE 2: 3D ANCIENT AYODHYA DIWALI CELEBRATION WORLD
      ===================================================================== */}
      {currentStage === 'world3d' && (
        <>
          <Stage2AyodhyaWorld
            initialMode={initialLightingMode}
            onBackToHero={returnToHero}
            onEnterEnding={() => enterEndingSection(false)}
            isFullTourActive={isFullTourActive}
            onStageComplete={() => enterEndingSection(true)}
          />

          {/* FLOATING PILL AT S6 SARAYU GHATS (If user minimized the ending popup) */}
          {isAtRiverGhats && !showEndingPopup && !isFullTourActive && (
            <div className="fixed bottom-24 inset-x-0 z-40 flex justify-center pointer-events-none px-4">
              <button
                onClick={() => setShowEndingPopup(true)}
                className="pointer-events-auto group px-7 py-3.5 rounded-full bg-gradient-to-r from-[#d97706] via-[#fbbf24] to-[#d97706] text-[#181009] font-sans font-extrabold text-xs tracking-[0.2em] uppercase shadow-[0_0_35px_rgba(251,191,36,0.85)] border-2 border-[#fffbeb] flex items-center gap-3 hover:scale-105 transition-all cursor-pointer animate-bounce"
              >
                <Crown className="w-4 h-4 fill-[#181009]" />
                <span>Enter Grand Finale • The Return to Ayodhya</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* POPUP 2: AFTER 3D AYODHYA WORLD ENDS (S6) -> LAUNCHES ENDING SECTION */}
          {showEndingPopup && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
              <div className="relative w-full max-w-xl rounded-3xl bg-gradient-to-b from-[#241308] via-[#160c06] to-[#0d0704] border-2 border-[#fbbf24] p-6 md:p-8 shadow-[0_0_70px_rgba(245,158,11,0.55)] text-center overflow-hidden">
                <div
                  className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 pointer-events-none opacity-45"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(251,191,36,0.8) 0%, transparent 70%)',
                  }}
                />

                <button
                  onClick={() => {
                    setShowEndingPopup(false);
                    setEndingPopupDismissed(true);
                  }}
                  title="Minimize to keep exploring Sarayu Ghats"
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#fde68a] flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fbbf24]/15 border border-[#fbbf24]/45 text-[#fde68a] text-[11px] font-sans font-bold tracking-[0.24em] uppercase mb-4">
                  <Crown className="w-3.5 h-3.5 text-[#fbbf24]" />
                  <span>Final Chapter • Emotional Climax</span>
                </div>

                <h2
                  style={{ fontFamily: "'Cinzel', serif" }}
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#fffbeb] tracking-wide mb-3 drop-shadow-[0_2px_12px_rgba(251,191,36,0.4)]"
                >
                  The Return to Ayodhya
                </h2>

                <p className="text-sm md:text-base text-[#e6d5b8] font-serif leading-relaxed max-w-lg mx-auto mb-6">
                  You have journeyed across the illuminated Kingdom of Ayodhya to the sacred Sarayu Ghats. Now witness the emotional climax as Lord Shri Ram, Sita Mata, Lakshmana, and Hanuman Ji return home amidst Pushpavarsha flower showers and sacred Diwali blessings.
                </p>

                <button
                  onClick={() => enterEndingSection(false)}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#d97706] via-[#fbbf24] to-[#d97706] hover:from-[#f59e0b] hover:to-[#fbbf24] text-[#181009] font-sans font-extrabold text-sm tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(251,191,36,0.65)] border border-[#fffbeb] flex items-center justify-center gap-3 transition-all cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 fill-[#181009]" />
                  <span>Enter the Grand Finale</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => {
                    setShowEndingPopup(false);
                    setEndingPopupDismissed(true);
                  }}
                  className="mt-3 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-[#fbbf24]/30 text-xs font-sans font-semibold text-[#fde68a] transition-all cursor-pointer"
                >
                  Stay in 3D Ayodhya World
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* =====================================================================
          STAGE 3: ENDING SECTION — THE RETURN TO AYODHYA VIDEO & DIWALI WISHES
      ===================================================================== */}
      {currentStage === 'ending' && (
        <Stage3ReturnEnding
          onBackTo3DWorld={returnTo3DWorld}
          onRestartFullEpic={returnToHero}
          isFullTourActive={isFullTourActive}
          onStageComplete={() => setIsFullTourActive(false)}
        />
      )}
    </main>
  );
}
