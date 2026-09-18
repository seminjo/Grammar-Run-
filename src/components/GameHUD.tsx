import React from 'react';
import { Heart, Volume2, Flame } from 'lucide-react';
import { Question } from '../types';
import { sound } from '../utils/sound';

interface GameHUDProps {
  currentIndex: number; // 0-based
  totalCount: number;
  score: number;
  hearts: number; // max 3
  combo: number;
  currentQuestion: Question;
  selectedOption: string | null;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  currentIndex,
  totalCount,
  score,
  hearts,
  combo,
  currentQuestion,
  selectedOption,
}) => {
  // Replace the blank with the currently selected option or '___'
  const displaySentence = () => {
    if (!currentQuestion) return '';
    const parts = currentQuestion.sentence.split('___');
    if (parts.length === 2) {
      return (
        <span className="leading-relaxed">
          {parts[0]}
          <span
            className={`inline-block px-2.5 py-0.5 mx-1 rounded-lg border-2 font-black transition-all ${
              selectedOption
                ? 'bg-amber-100 text-amber-900 border-amber-400 scale-105'
                : 'bg-slate-100 text-blue-700 border-blue-300 border-dashed'
            }`}
          >
            {selectedOption || '____'}
          </span>
          {parts[1]}
        </span>
      );
    }
    return currentQuestion.sentence;
  };

  const handleSpeak = () => {
    sound.speakEnglish(currentQuestion.fullSentence);
  };

  return (
    <div id="game-hud-panel" className="w-full space-y-2.5">
      {/* Top Status Bar: Question Number, Hearts, Combo, Score */}
      <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl px-3.5 py-2 shadow-sm">
        {/* Left: Question Counter & Category */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-blue-600 text-white font-black text-xs sm:text-sm rounded-lg shadow-sm">
            {currentIndex + 1}/{totalCount}
          </span>
          <span className="text-xs font-bold text-slate-500 hidden xs:inline">
            {currentQuestion.grammarTypeName}
          </span>
        </div>

        {/* Center: Hearts & Combo */}
        <div className="flex items-center gap-3">
          {/* Hearts */}
          <div className="flex items-center gap-1" title={`${hearts} Hearts left`}>
            {[1, 2, 3].map((h) => (
              <Heart
                key={h}
                className={`w-5 h-5 transition-transform duration-200 ${
                  h <= hearts
                    ? 'text-rose-500 fill-rose-500 scale-100'
                    : 'text-slate-300 fill-slate-200 scale-90'
                }`}
              />
            ))}
          </div>

          {/* Combo Multiplier Badge */}
          {combo > 1 && (
            <div className="flex items-center gap-0.5 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black rounded-full shadow animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>COMBO ×{combo}</span>
            </div>
          )}
        </div>

        {/* Right: Score */}
        <div className="text-right">
          <div className="text-xs font-extrabold text-slate-600 uppercase tracking-tight">SCORE</div>
          <div className="text-base sm:text-lg font-black text-blue-700 leading-none">
            {score} <span className="text-[10px] text-slate-500">PTS</span>
          </div>
        </div>
      </div>

      {/* Main Question Card (Clean, high-contrast, large text for 5th graders) */}
      <div className="relative bg-white rounded-2xl p-4 sm:p-5 border-2 border-slate-200 shadow-md flex flex-col items-center text-center">
        {/* Category Pill */}
        <div className="flex items-center justify-between w-full mb-1">
          <span className="text-[11px] font-extrabold uppercase tracking-wide px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
            {currentQuestion.grammarTypeName}
          </span>
          <button
            type="button"
            onClick={handleSpeak}
            className="p-1.5 text-slate-400 hover:text-blue-600 active:scale-95 transition-colors rounded-lg hover:bg-slate-100 flex items-center gap-1 text-xs font-medium"
            title="문장 영어 발음 듣기"
          >
            <Volume2 className="w-4 h-4" />
            <span className="text-[11px] hidden sm:inline">발음 듣기</span>
          </button>
        </div>

        {/* Sentence with Blank */}
        <div className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 my-1.5 leading-relaxed tracking-tight">
          {displaySentence()}
        </div>

        {/* Korean sentence meaning preview */}
        <p className="text-xs sm:text-sm font-medium text-slate-500">
          {currentQuestion.koreanMeaning}
        </p>
      </div>
    </div>
  );
};
