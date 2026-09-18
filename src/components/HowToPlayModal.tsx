import React from 'react';
import { X, CheckCircle, ArrowRight, Zap, Heart } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 font-black flex items-center justify-center text-sm">
              🏃
            </span>
            <h3 className="font-black text-slate-900 text-base">게임 방법 (30초 정복!)</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Step Guide for 5th Graders */}
        <div className="my-4 space-y-3.5">
          {/* Step 1 */}
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div className="text-left">
              <h4 className="text-xs font-black text-slate-900">문장 읽기</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                화면 위의 빈칸 문장을 읽어요.
                <br />
                <span className="inline-block bg-slate-100 text-blue-700 px-1.5 py-0.5 rounded font-bold text-[11px] mt-0.5">
                  Tom ___ basketball.
                </span>
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <div className="text-left">
              <h4 className="text-xs font-black text-slate-900">정답 길로 이동하기</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                앞의 3개 길 중 올바른 단어가 있는 길로 화면을 스와이프하거나 아래 버튼을 눌러 이동해요!
              </p>
              <div className="flex gap-1 mt-1 text-[11px] font-extrabold text-slate-700">
                <span className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200">play</span>
                <span className="px-1.5 py-0.5 bg-amber-300 text-slate-900 rounded border border-amber-400">plays (정답!)</span>
                <span className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200">playing</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <div className="text-left">
              <h4 className="text-xs font-black text-slate-900">콤보 점수 & 하트</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                연속으로 맞히면 <strong className="text-amber-600 font-bold">COMBO 점수 UP!</strong> 오답 시 하트 1개가 감소해요.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl shadow-md transition-all active:scale-95"
        >
          이해했어요! 달릴 준비 완료 🚀
        </button>
      </div>
    </div>
  );
};
