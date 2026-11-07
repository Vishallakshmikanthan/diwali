import React, { useState, useEffect } from 'react';
import Stage1HeroBattle from './components/Stage1HeroBattle';
import Stage2AyodhyaWorld from './components/Stage2AyodhyaWorld';
import { Sparkles, Sun, Moon, Flame, Compass, X, ArrowRight } from 'lucide-react';

export default function App() {
  // False = Stage 1 Hero Battle (100% isolated so Hero never crashes or lags)
  // True = Stage 2 Full 3D Ancient Ayodhya World
  const [in3DWorld, setIn3DWorld] = useState(false);
  const [initialLightingMode, setInitialLightingMode] = useState('auto');

  // Popup state triggered after reaching the end of the Hero section
  const [showCelebrationPopup, setShowCelebrationPopup] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);
  const [isPastImpact, setIsPastImpact] = useState(false);

  useEffect(() => {
    if (in3DWorld) return;

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const ratio = window.scrollY / maxScroll;

      setIsPastImpact(ratio >= 0.68);

      // Show the "Enter Diwali Celebrations" popup once the user reaches the end of the Hero section
      if (ratio >= 0.88 && !popupDismissed) {
        setShowCelebrationPopup(true);
      } else if (ratio < 0.72) {
        setShowCelebrationPopup(false);
        setPopupDismissed(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [in3DWorld, popupDismissed]);

  const enterDiwaliCelebrations = (mode = 'auto') => {
    setInitialLightingMode(mode);
    setShowCelebrationPopup(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIn3DWorld(true);
  };

  const returnToHero = () => {
    setIn3DWorld(false);
    setPopupDismissed(false);
    setShowCelebrationPopup(false);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 20);
  };

  return (
    <main className="relative min-h-screen bg-[#090404] text-[#f7efe2]">
      {!in3DWorld ? (
        <>
          {/* STAGE 1: UNTOUCHED HERO BATTLE & HAPPY DIWALI REVEAL */}
          <Stage1HeroBattle />

          {/* FLOATING PILL AFTER IMPACT (If user minimized popup or wants quick entry) */}
          {isPastImpact && !showCelebrationPopup && (
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

          {/* =====================================================================
              ROYAL INVITATION POPUP AFTER HERO SECTION:
              "Enter Diwali Celebrations" -> Launches Full 3D Ancient Ayodhya World
          ===================================================================== */}
          {showCelebrationPopup && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
              <div className="relative w-full max-w-xl rounded-3xl bg-gradient-to-b from-[#241308] via-[#160c06] to-[#0d0704] border-2 border-[#fbbf24] p-6 md:p-8 shadow-[0_0_70px_rgba(245,158,11,0.5)] text-center overflow-hidden">
                {/* Decorative Top Golden Glow */}
                <div
                  className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 pointer-events-none opacity-45"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(251,191,36,0.8) 0%, transparent 70%)',
                  }}
                />

                {/* Minimize / Close Button (lets user admire the Happy Diwali screen) */}
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

                {/* Suryavanshi Crest Badge */}
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

                {/* 6 Section Preview Badges */}
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

                {/* Primary CTA Button */}
                <button
                  onClick={() => enterDiwaliCelebrations('auto')}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#d97706] via-[#fbbf24] to-[#d97706] hover:from-[#f59e0b] hover:to-[#fbbf24] text-[#181009] font-sans font-extrabold text-sm tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(251,191,36,0.65)] border border-[#fffbeb] flex items-center justify-center gap-3 transition-all cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 fill-[#181009]" />
                  <span>Enter Diwali Celebrations (3D World)</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Quick Direct Mode Launchers: Day Mode vs Night Mode */}
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5">
                  <button
                    onClick={() => enterDiwaliCelebrations('day')}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-[#fbbf24]/35 text-xs font-sans font-semibold text-[#fde68a] flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Sun className="w-3.5 h-3.5 text-[#fbbf24]" />
                    <span>Start in Golden Day Mode</span>
                  </button>
                  <button
                    onClick={() => enterDiwaliCelebrations('night')}
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
      ) : (
        /* STAGE 2: BREATHTAKING 3D ANCIENT AYODHYA DIWALI CELEBRATION WORLD */
        <Stage2AyodhyaWorld
          initialMode={initialLightingMode}
          onBackToHero={returnToHero}
        />
      )}
    </main>
  );
}
