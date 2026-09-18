import React from 'react';
import { Play, BookOpen, HelpCircle, Sparkles, Volume2, VolumeX, Flame } from 'lucide-react';
import { RunnerMascot } from './RunnerMascot';
import { GrammarCategory } from '../types';
import { GRAMMAR_CATEGORIES } from '../data/questions';

interface StartViewProps {
  onStartGame: (stageId: string) => void;
  onOpenStageSelect: () => void;
  onOpenHowToPlay: () => void;
  weakCategories: GrammarCategory[];
  isMuted: boolean;
  onToggleMute: () => void;
  highScore: number;
}

export const StartView: React.FC<StartViewProps> = ({
  onStartGame,
  onOpenStageSelect,
  onOpenHowToPlay,
  weakCategories,
  isMuted,
  onToggleMute,
  highScore,
}) => {
  const topWeakCategory = weakCategories[0]
    ? GRAMMAR_CATEGORIES.find((c) => c.id === weakCategories[0])
    : null;

  return (
    <div id="start-view-screen" className="w-full max-w-md mx-auto flex flex-col items-center justify-between min-h-[580px] p-4 text-center">
      {/* Sound mute toggle & High Score in top bar */}
      <div className="w-full flex items-center justify-between">
        <button
          id="btn-toggle-sound"
          type="button"
          onClick={onToggleMute}
          className="p-2.5 bg-white/80 hover:bg-white text-slate-700 rounded-full shadow-sm border border-slate-200 active:scale-95 transition-all"
          title={isMuted ? '소리 켜기' : '소리 끄기'}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-blue-600" />}
        </button>

        {highScore > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-full text-xs font-black shadow-xs">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>최고 점수: {highScore} PTS</span>
          </div>
        )}
      </div>

      {/* Hero Section: Logo & Mascot */}
      <div className="flex flex-col items-center my-auto py-2">
        {/* Title Logo */}
        <div className="relative mb-2">
          <div className="inline-block px-3 py-1 mb-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-black uppercase tracking-wider rounded-full shadow-sm">
            초등 5학년 영어 문법 러닝 게임
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 tracking-tight drop-shadow-xs">
            Grammar Run!
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
            달리면서 올바른 문법 길을 찾아보세요! 🏃‍♂️💨
          </p>
        </div>

        {/* Animated Mascot */}
        <div className="relative my-4">
          <div className="w-32 h-36 bg-gradient-to-b from-sky-100 to-indigo-50 rounded-3xl border-2 border-indigo-100 flex items-center justify-center shadow-inner relative overflow-hidden">
            {/* Speed lines */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:12px_12px]" />
            <RunnerMascot className="w-24 h-28" />
          </div>
        </div>

        {/* AI Customized Recommendation Banner (if user has weak areas from prior runs) */}
        {topWeakCategory && (
          <div className="w-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300/80 rounded-2xl p-3 mb-3 text-left shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 mb-0.5">
              <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>AI 맞춤 학습 추천!</span>
            </div>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              최근 <strong className="text-amber-700 font-bold">{topWeakCategory.name}</strong> 문제에서 오답이 있었어요.
            </p>
            <button
              type="button"
              onClick={() => onStartGame(topWeakCategory.id)}
              className="mt-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-lg shadow-xs transition-transform active:scale-95"
            >
              👉 {topWeakCategory.name} 집중 런 바로 시작!
            </button>
          </div>
        )}
      </div>

      {/* Main Buttons Panel */}
      <div className="w-full space-y-2.5 pb-2">
        {/* [게임 시작] 버튼 — 화면 중앙, 큰 버튼 */}
        <button
          id="btn-start-game-main"
          type="button"
          onClick={() => onStartGame('random')}
          className="w-full h-15 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-lg sm:text-xl rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 border-b-4 border-indigo-900"
        >
          <Play className="w-6 h-6 fill-white" />
          <span>게임 시작 (랜덤 달리기)</span>
        </button>

        {/* Sub Buttons: 문법 선택 & 게임 방법 */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* [문법 선택] 버튼 */}
          <button
            id="btn-open-stage-select"
            type="button"
            onClick={onOpenStageSelect}
            className="h-13 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base rounded-2xl border-2 border-slate-200 shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>문법 선택</span>
          </button>

          {/* [게임 방법] 버튼 */}
          <button
            id="btn-open-how-to-play"
            type="button"
            onClick={onOpenHowToPlay}
            className="h-13 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base rounded-2xl border-2 border-slate-200 shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>게임 방법</span>
          </button>
        </div>
      </div>
    </div>
  );
};
