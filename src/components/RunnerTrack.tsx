import React, { useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';
import { RunnerMascot } from './RunnerMascot';

interface RunnerTrackProps {
  laneIndex: number; // 0: Left, 1: Center, 2: Right
  onSelectLane: (index: number) => void;
  options: string[];
  isLocked: boolean; // when answering feedback is playing
  isCorrect: boolean | null;
  selectedAnswer: string | null;
  progress: number; // 0 to 100 towards the gate
  timeLeft: number; // 5, 4, 3, 2, 1, 0 seconds
}

export const RunnerTrack: React.FC<RunnerTrackProps> = ({
  laneIndex,
  onSelectLane,
  options,
  isLocked,
  isCorrect,
  selectedAnswer,
  progress,
  timeLeft,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  // Touch Swipe Support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isLocked) return;
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isLocked || touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartXRef.current;
    if (Math.abs(diff) > 35) {
      if (diff > 0 && laneIndex < 2) {
        onSelectLane(laneIndex + 1);
      } else if (diff < 0 && laneIndex > 0) {
        onSelectLane(laneIndex - 1);
      }
    }
    touchStartXRef.current = null;
  };

  // Keyboard Left / Right Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        if (laneIndex > 0) onSelectLane(laneIndex - 1);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        if (laneIndex < 2) onSelectLane(laneIndex + 1);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S' || e.key === 'Enter') {
        // Can hold center or confirm
        if (laneIndex !== 1) onSelectLane(1);
      } else if (e.key === '1') {
        onSelectLane(0);
      } else if (e.key === '2') {
        onSelectLane(1);
      } else if (e.key === '3') {
        onSelectLane(2);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [laneIndex, isLocked, onSelectLane]);

  // Position of runner: left lane is 16.6%, center is 50%, right is 83.3%
  const lanePositions = ['17%', '50%', '83%'];

  return (
    <div
      id="runner-track-container"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-gradient-to-b from-sky-400 via-blue-500 to-indigo-900 shadow-inner select-none"
    >
      {/* Dynamic Sky Background with Clouds & Sun */}
      <div className="absolute inset-x-0 top-0 h-28 pointer-events-none">
        {/* Sun */}
        <div className="absolute top-3 right-8 w-12 h-12 rounded-full bg-yellow-300 shadow-[0_0_25px_rgba(253,224,71,0.8)] opacity-90" />
        {/* Clouds */}
        <div className="absolute top-6 left-6 w-20 h-6 bg-white/70 rounded-full blur-[0.5px]" />
        <div className="absolute top-10 left-28 w-16 h-5 bg-white/60 rounded-full" />
        <div className="absolute top-5 right-24 w-24 h-7 bg-white/70 rounded-full" />
        {/* Distant Hills */}
        <div className="absolute bottom-0 inset-x-0 h-10 bg-emerald-700/80 rounded-t-[50%] scale-x-125" />
      </div>

      {/* Time Limit Badge on the Side (5초 카운트다운) */}
      <div
        id="side-timer-indicator"
        className={`absolute top-3 right-3 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black shadow-lg border-2 backdrop-blur-xs transition-all ${
          timeLeft <= 2
            ? 'bg-rose-500 text-white border-white animate-bounce ring-4 ring-rose-300'
            : 'bg-white/95 text-slate-800 border-amber-400 ring-2 ring-amber-300/60'
        }`}
      >
        <Clock
          className={`w-4 h-4 ${
            timeLeft <= 2 ? 'text-white animate-spin' : 'text-amber-500'
          }`}
        />
        <div className="flex items-baseline gap-1">
          <span className="text-[11px] font-bold text-slate-500 hidden xs:inline">
            시간 제한
          </span>
          <span
            className={`text-sm sm:text-base font-black ${
              timeLeft <= 2 ? 'text-white' : 'text-rose-600'
            }`}
          >
            {timeLeft}초
          </span>
        </div>
      </div>

      {/* Perspective Track Area */}
      <div
        className="absolute inset-x-4 bottom-0 top-24 overflow-hidden"
        style={{
          perspective: '450px',
        }}
      >
        {/* Track Surface with 3D rotation */}
        <div
          className="relative w-full h-full origin-bottom"
          style={{
            transform: 'rotateX(55deg)',
            background: 'linear-gradient(to bottom, #1E293B, #0F172A)',
          }}
        >
          {/* Running Dash Animation Effect */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* 3 Lane Division Lines */}
          {/* Lane 1/3 divider */}
          <div
            className="absolute top-0 bottom-0 left-[33.33%] w-1.5 bg-yellow-300/80 dashed-line"
            style={{
              backgroundImage: 'linear-gradient(to bottom, transparent 40%, rgba(253,224,71,0.9) 40%)',
              backgroundSize: '100% 40px',
              animation: isLocked ? 'none' : 'roadRun 0.4s linear infinite',
            }}
          />
          {/* Lane 2/3 divider */}
          <div
            className="absolute top-0 bottom-0 left-[66.66%] w-1.5 bg-yellow-300/80 dashed-line"
            style={{
              backgroundImage: 'linear-gradient(to bottom, transparent 40%, rgba(253,224,71,0.9) 40%)',
              backgroundSize: '100% 40px',
              animation: isLocked ? 'none' : 'roadRun 0.4s linear infinite',
            }}
          />

          {/* Outer track borders */}
          <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-red-500" />
          <div className="absolute top-0 bottom-0 right-0 w-2.5 bg-red-500" />

          {/* Lane click/tap zones */}
          <div className="absolute inset-0 flex">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                id={`lane-tap-zone-${idx}`}
                type="button"
                onClick={() => !isLocked && onSelectLane(idx)}
                className={`flex-1 h-full cursor-pointer transition-colors duration-150 relative ${
                  laneIndex === idx
                    ? 'bg-blue-400/20'
                    : 'hover:bg-white/10 active:bg-white/20'
                }`}
                title={`Lane ${idx + 1}`}
              >
                {/* Active lane beam */}
                {laneIndex === idx && (
                  <div className="absolute inset-x-2 bottom-0 top-1/2 bg-gradient-to-t from-amber-400/30 via-transparent to-transparent pointer-events-none rounded-b-lg" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Approaching Option Gates (Archways) */}
      {/* Positioned in 2D space above the 3D track for crisp font rendering */}
      <div className="absolute inset-x-4 top-24 bottom-24 pointer-events-none flex justify-between items-center z-10 px-2">
        {options.map((opt, idx) => {
          const isSelected = laneIndex === idx;
          const isCorrectChoice = isCorrect !== null && isSelected && isCorrect;
          const isWrongChoice = isCorrect !== null && isSelected && !isCorrect;

          // Scale and position based on runner progress
          const gateScale = 0.85 + (progress / 100) * 0.35;
          const gateOpacity = Math.min(1, 0.4 + (progress / 100) * 0.7);

          return (
            <div
              key={`${idx}-${opt}`}
              className="flex-1 flex flex-col items-center justify-center transition-all duration-150"
              style={{
                transform: `scale(${gateScale})`,
                opacity: gateOpacity,
              }}
            >
              {/* Floating Gate Arch */}
              <div
                className={`pointer-events-auto cursor-pointer flex flex-col items-center px-3 py-2.5 rounded-2xl border-2 transition-all shadow-lg ${
                  isSelected
                    ? isCorrectChoice
                      ? 'bg-emerald-500 text-white border-white scale-110 shadow-emerald-400/50'
                      : isWrongChoice
                      ? 'bg-rose-600 text-white border-white scale-105 shadow-rose-400/50'
                      : 'bg-amber-400 text-slate-900 border-white ring-4 ring-amber-300/60 scale-105 shadow-amber-400/40'
                    : 'bg-slate-900/85 text-white border-slate-600 hover:bg-slate-800'
                }`}
                onClick={() => !isLocked && onSelectLane(idx)}
              >
                {/* Lane indicator tag */}
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 ${
                    isSelected
                      ? 'bg-black/25 text-white'
                      : 'bg-slate-700/80 text-slate-300'
                  }`}
                >
                  {idx === 0 ? '◀ 왼쪽' : idx === 1 ? '▲ 가운데' : '오른쪽 ▶'}
                </span>

                {/* Option text */}
                <span className="text-base sm:text-lg font-black tracking-tight drop-shadow-sm whitespace-nowrap">
                  {opt}
                </span>

                {/* Status indicator badge */}
                {isSelected && (
                  <div className="mt-1">
                    {isCorrectChoice && (
                      <span className="text-[11px] font-bold bg-white text-emerald-700 px-1.5 py-0.2 rounded-full shadow">
                        ✓ 정답!
                      </span>
                    )}
                    {isWrongChoice && (
                      <span className="text-[11px] font-bold bg-white text-rose-700 px-1.5 py-0.2 rounded-full shadow">
                        ✕ 오답
                      </span>
                    )}
                    {isCorrect === null && (
                      <span className="text-[10px] font-bold text-slate-800">
                        선택된 길
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Runner Mascot (Smoothly glides across lanes) */}
      <div
        className="absolute bottom-4 z-20 transition-all duration-200 ease-out -translate-x-1/2"
        style={{
          left: lanePositions[laneIndex],
        }}
      >
        <RunnerMascot
          isStumbling={isCorrect === false}
          isCheering={isCorrect === true}
          className="w-20 h-24 sm:w-24 sm:h-28"
        />

        {/* Lane Marker Glow beneath the runner */}
        <div
          className={`w-14 h-4 mx-auto -mt-2 rounded-full blur-[2px] transition-colors ${
            isCorrect === true
              ? 'bg-emerald-400 shadow-[0_0_15px_#34D399]'
              : isCorrect === false
              ? 'bg-rose-500 shadow-[0_0_15px_#F43F5E]'
              : 'bg-amber-300 shadow-[0_0_15px_#FCD34D]'
          }`}
        />
      </div>

      {/* Approaching Distance Meter (Progress bar at bottom of track) */}
      <div className="absolute inset-x-6 bottom-1.5 h-1.5 bg-black/40 rounded-full overflow-hidden z-20">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-100 ease-linear rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Inline style for road motion */}
      <style>{`
        @keyframes roadRun {
          from {
            background-position-y: 0px;
          }
          to {
            background-position-y: 40px;
          }
        }
      `}</style>
    </div>
  );
};
