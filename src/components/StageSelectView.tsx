import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Shuffle, Check, Award } from 'lucide-react';
import { GRAMMAR_CATEGORIES } from '../data/questions';
import { Difficulty, GrammarCategory, UserStats } from '../types';

interface StageSelectViewProps {
  onBack: () => void;
  onSelectStage: (stageId: string, difficulty: Difficulty | 'adaptive') => void;
  userStats: UserStats;
}

export const StageSelectView: React.FC<StageSelectViewProps> = ({
  onBack,
  onSelectStage,
  userStats,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'adaptive'>('adaptive');

  return (
    <div id="stage-select-screen" className="w-full max-w-md mx-auto min-h-[580px] p-4 flex flex-col justify-between">
      {/* Top Navigation */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <button
            id="btn-back-to-home"
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>처음으로</span>
          </button>
          <h2 className="text-base font-black text-slate-800">문법 스테이지 선택</h2>
          <div className="w-16" /> {/* spacer */}
        </div>

        {/* Difficulty Selector */}
        <div className="bg-slate-100/90 p-1.5 rounded-2xl mb-4 border border-slate-200 flex text-xs font-black">
          <button
            type="button"
            onClick={() => setSelectedDifficulty('adaptive')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              selectedDifficulty === 'adaptive'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🤖 AI 자동
          </button>
          <button
            type="button"
            onClick={() => setSelectedDifficulty('easy')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              selectedDifficulty === 'easy'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            쉬움 (짧은 문장)
          </button>
          <button
            type="button"
            onClick={() => setSelectedDifficulty('normal')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              selectedDifficulty === 'normal'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            보통
          </button>
          <button
            type="button"
            onClick={() => setSelectedDifficulty('hard')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              selectedDifficulty === 'hard'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            어려움 (긴 문장)
          </button>
        </div>

        {/* Featured: [랜덤 문법 달리기] Button */}
        <button
          id="btn-stage-random"
          type="button"
          onClick={() => onSelectStage('random', selectedDifficulty)}
          className="w-full mb-3.5 p-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl shadow-md flex items-center justify-between transition-transform active:scale-[0.98] border border-blue-400"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Shuffle className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="text-sm font-black flex items-center gap-1.5">
                <span>랜덤 문법 달리기</span>
                <span className="text-[10px] bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full font-extrabold">
                  AI 추천 모드
                </span>
              </div>
              <div className="text-xs text-white/80 font-medium">
                모든 문법 유형을 골고루 섞어서 10문제 도전!
              </div>
            </div>
          </div>
          <Sparkles className="w-5 h-5 text-amber-300" />
        </button>

        {/* Specific Grammar Categories Grid */}
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {GRAMMAR_CATEGORIES.map((cat) => {
            const attempts = userStats.categoryAttempts[cat.id] || 0;
            const mistakes = userStats.categoryMistakes[cat.id] || 0;
            const accuracy = attempts > 0 ? Math.round(((attempts - mistakes) / attempts) * 100) : null;

            return (
              <button
                key={cat.id}
                id={`btn-stage-${cat.id}`}
                type="button"
                onClick={() => onSelectStage(cat.id, selectedDifficulty)}
                className="w-full p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-left transition-all active:scale-[0.98] shadow-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-xs`}>
                    <span className="text-xs font-black">{cat.name.slice(0, 2)}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-slate-900 group-hover:text-blue-600">
                        {cat.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {cat.englishName}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      예: {cat.sampleQuestion}
                    </div>
                  </div>
                </div>

                {/* Accuracy badge if played */}
                <div className="text-right">
                  {accuracy !== null ? (
                    <div className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                      accuracy >= 80
                        ? 'bg-emerald-100 text-emerald-800'
                        : accuracy >= 50
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {accuracy}% 정답
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600">
                      도전 →
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-2 text-center text-xs text-slate-400 font-medium">
        한 판에 10문제로 약 3분간 빠르게 학습합니다.
      </div>
    </div>
  );
};
