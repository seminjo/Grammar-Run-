import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, AlertTriangle, ArrowRight, Heart, Sparkles } from 'lucide-react';
import { Question } from '../types';

interface FeedbackBannerProps {
  isCorrect: boolean;
  question: Question;
  selectedAnswer: string;
  pointsEarned: number;
  combo: number;
  hearts: number;
  onNext: () => void;
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
  isCorrect,
  question,
  selectedAnswer,
  pointsEarned,
  combo,
  hearts,
  onNext,
}) => {
  useEffect(() => {
    if (isCorrect) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
        });
      } catch {
        // ignore
      }
    }
  }, [isCorrect]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="feedback-card"
        className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl border-4 transition-transform text-center ${
          isCorrect
            ? 'bg-white border-emerald-400 ring-4 ring-emerald-200'
            : 'bg-white border-rose-400 ring-4 ring-rose-200'
        }`}
      >
        {/* Banner Title Badge */}
        <div className="flex justify-center -mt-9 mb-3">
          {isCorrect ? (
            <div className="px-5 py-2 bg-emerald-500 text-white font-black text-lg rounded-full shadow-lg flex items-center gap-1.5 animate-bounce">
              <Sparkles className="w-5 h-5 fill-white" />
              <span>Perfect!</span>
            </div>
          ) : (
            <div className="px-5 py-2 bg-rose-500 text-white font-black text-lg rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
              <AlertTriangle className="w-5 h-5" />
              <span>Oops!</span>
            </div>
          )}
        </div>

        {/* Score and Combo Reward or Hearts Status */}
        {isCorrect ? (
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-emerald-700 font-black text-base bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              +{pointsEarned} POINTS
            </span>
            {combo > 1 && (
              <span className="text-amber-600 font-black text-sm bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                COMBO ×{combo} 🔥
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1.5 mb-3 text-sm font-bold text-slate-600">
            <span>남은 하트:</span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3].map((h) => (
                <Heart
                  key={h}
                  className={`w-4 h-4 ${
                    h <= hearts ? 'text-rose-500 fill-rose-500' : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Sentence */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 mb-3.5">
          <div className="text-xs font-extrabold text-slate-400 uppercase mb-1">
            {isCorrect ? '완성된 문장' : '정답 문장'}
          </div>
          <div className="text-lg font-black text-slate-900 leading-snug">
            {question.fullSentence}
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-1">
            {question.koreanMeaning}
          </div>
        </div>

        {/* If wrong: Show user choice vs correct answer & friendly explanation */}
        {!isCorrect && (
          <div className="text-left bg-amber-50/80 border border-amber-200 rounded-2xl p-3 mb-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-rose-600">내가 고른 길: {selectedAnswer}</span>
              <span className="text-emerald-700">정답: {question.correctAnswer}</span>
            </div>
            <div className="text-xs text-amber-900 font-medium leading-relaxed">
              {question.koreanExplanation}
            </div>
          </div>
        )}

        {/* If correct: Show friendly tip too */}
        {isCorrect && (
          <div className="text-xs text-emerald-800 bg-emerald-50/70 border border-emerald-100 rounded-xl p-2.5 mb-4 font-medium">
            {question.koreanExplanation}
          </div>
        )}

        {/* Next Question Button */}
        <button
          id="btn-feedback-next"
          type="button"
          onClick={onNext}
          className={`w-full py-3 text-white font-black text-base rounded-2xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 ${
            isCorrect
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
          }`}
        >
          <span>계속 달리기!</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
