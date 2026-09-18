import React from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Flame, CheckCircle2, RotateCcw, ArrowRight, BookOpen, Home, Sparkles, Volume2 } from 'lucide-react';
import { GameResult, GrammarCategory } from '../types';
import { sound } from '../utils/sound';

interface ResultViewProps {
  result: GameResult;
  onPlayAgain: () => void;
  onSelectOtherStage: () => void;
  onGoHome: () => void;
  onReviewMissed: () => void;
  onRunRecommendedCategory: (categoryId: GrammarCategory) => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  onPlayAgain,
  onSelectOtherStage,
  onGoHome,
  onReviewMissed,
  onRunRecommendedCategory,
}) => {
  const isGreatScore = result.correctCount >= 8;

  React.useEffect(() => {
    if (isGreatScore) {
      try {
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch {
        // ignore
      }
    }
  }, [isGreatScore]);

  return (
    <div id="result-view-screen" className="w-full max-w-md mx-auto min-h-[580px] p-4 flex flex-col justify-between">
      <div className="space-y-4">
        {/* Header Ribbon & Score Card */}
        <div className="bg-gradient-to-b from-blue-600 to-indigo-700 text-white rounded-3xl p-5 shadow-lg text-center relative overflow-hidden">
          <div className="text-xs font-extrabold uppercase tracking-widest text-blue-200 mb-1">
            오늘의 결과 • {result.stageName}
          </div>

          <div className="text-4xl font-black tracking-tight my-1 flex items-center justify-center gap-2">
            <Trophy className="w-8 h-8 text-amber-300 fill-amber-300" />
            <span>{result.totalScore}</span>
            <span className="text-base text-amber-300 font-bold">POINTS</span>
          </div>

          {/* Quick Stats: Correct count & Max Combo */}
          <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-white/20 text-xs font-black">
            <div className="bg-white/15 px-3 py-1 rounded-xl flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>정답: {result.correctCount}/{result.totalCount}</span>
            </div>

            <div className="bg-white/15 px-3 py-1 rounded-xl flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>최고 콤보: ×{result.maxCombo}</span>
            </div>
          </div>
        </div>

        {/* 문법별 결과 (Category breakdown) */}
        {Object.keys(result.categoryStats).length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <div className="text-xs font-black text-slate-700 mb-2 flex items-center justify-between">
              <span>문법별 정답률</span>
              <span className="text-[11px] text-slate-400 font-medium">카테고리별 성취도</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(result.categoryStats).map(([catId, data]) => {
                const isPerfect = data.correct === data.total;
                return (
                  <div
                    key={catId}
                    className={`p-2 rounded-xl border flex items-center justify-between text-xs font-bold ${
                      isPerfect
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <span>{data.typeName}:</span>
                    <span className={isPerfect ? 'text-emerald-700' : 'text-slate-900'}>
                      {data.correct}/{data.total}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AI 추천 복습 문법 */}
        {result.recommendedCategory && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 mb-1">
              <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>AI 추천 복습</span>
            </div>
            <p className="text-sm font-black text-slate-900 mb-2">
              {result.recommendedReason}
            </p>
            <button
              id="btn-run-recommended"
              type="button"
              onClick={() => result.recommendedCategory && onRunRecommendedCategory(result.recommendedCategory)}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>[{result.recommendedCategoryName || '추천 문법'} 다시 달리기]</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 틀린 문제 목록 (Incorrect Questions Review) */}
        {result.incorrectQuestions.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800">
                틀린 문제 다시보기 ({result.incorrectQuestions.length}개)
              </span>
              <button
                id="btn-review-missed"
                type="button"
                onClick={onReviewMissed}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 underline flex items-center gap-1"
              >
                <span>[오답 다시 풀기]</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {result.incorrectQuestions.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 text-xs text-left space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-blue-700">
                      {item.question.grammarTypeName}
                    </span>
                    <button
                      type="button"
                      onClick={() => sound.speakEnglish(item.question.fullSentence)}
                      className="text-slate-400 hover:text-slate-600 p-0.5"
                      title="발음 듣기"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="font-black text-slate-900 text-sm">
                    {item.question.sentence}
                  </div>
                  <div className="flex items-center gap-3 font-bold">
                    <span className="text-rose-600">내 답: {item.userAnswer}</span>
                    <span className="text-emerald-700">정답: {item.question.correctAnswer}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium bg-white p-2 rounded-lg border border-slate-100">
                    {item.question.koreanExplanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Navigation */}
      <div className="space-y-2 pt-4">
        <button
          id="btn-play-again"
          type="button"
          onClick={onPlayAgain}
          className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-base rounded-2xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>다시 달리기</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            id="btn-choose-stage"
            type="button"
            onClick={onSelectOtherStage}
            className="py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-slate-500" />
            <span>다른 문법 선택</span>
          </button>

          <button
            id="btn-return-home"
            type="button"
            onClick={onGoHome}
            className="py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4 text-slate-500" />
            <span>처음으로</span>
          </button>
        </div>
      </div>
    </div>
  );
};
