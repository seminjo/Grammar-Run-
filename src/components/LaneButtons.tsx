import React from 'react';
import { ArrowLeft, ArrowRight, Disc } from 'lucide-react';

interface LaneButtonsProps {
  laneIndex: number;
  onSelectLane: (index: number) => void;
  onConfirmChoice?: () => void;
  isLocked: boolean;
  options: string[];
}

export const LaneButtons: React.FC<LaneButtonsProps> = ({
  laneIndex,
  onSelectLane,
  onConfirmChoice,
  isLocked,
  options,
}) => {
  return (
    <div id="lane-control-panel" className="w-full space-y-2 mt-2">
      {/* 3 Lane Selector Buttons */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {/* Left Lane Button */}
        <button
          id="btn-lane-left"
          type="button"
          disabled={isLocked}
          onClick={() => onSelectLane(0)}
          className={`h-14 sm:h-16 rounded-xl font-bold flex flex-col items-center justify-center transition-all active:scale-95 shadow-md border-2 ${
            laneIndex === 0
              ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-amber-300/50 ring-2 ring-amber-300'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-1 text-xs sm:text-sm font-extrabold text-slate-600">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>왼쪽 길</span>
          </div>
          <span className="text-sm sm:text-base font-black truncate max-w-full px-1 text-slate-900">
            {options[0] || '1'}
          </span>
        </button>

        {/* Center Lane Button */}
        <button
          id="btn-lane-center"
          type="button"
          disabled={isLocked}
          onClick={() => onSelectLane(1)}
          className={`h-14 sm:h-16 rounded-xl font-bold flex flex-col items-center justify-center transition-all active:scale-95 shadow-md border-2 ${
            laneIndex === 1
              ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-amber-300/50 ring-2 ring-amber-300'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-1 text-xs sm:text-sm font-extrabold text-slate-600">
            <Disc className="w-3.5 h-3.5" />
            <span>가운데 길</span>
          </div>
          <span className="text-sm sm:text-base font-black truncate max-w-full px-1 text-slate-900">
            {options[1] || '2'}
          </span>
        </button>

        {/* Right Lane Button */}
        <button
          id="btn-lane-right"
          type="button"
          disabled={isLocked}
          onClick={() => onSelectLane(2)}
          className={`h-14 sm:h-16 rounded-xl font-bold flex flex-col items-center justify-center transition-all active:scale-95 shadow-md border-2 ${
            laneIndex === 2
              ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-amber-300/50 ring-2 ring-amber-300'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-1 text-xs sm:text-sm font-extrabold text-slate-600">
            <span>오른쪽 길</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm sm:text-base font-black truncate max-w-full px-1 text-slate-900">
            {options[2] || '3'}
          </span>
        </button>
      </div>

      {/* Immediate Gate Pass button if the student doesn't want to wait for auto run */}
      {onConfirmChoice && !isLocked && (
        <button
          id="btn-rush-gate"
          type="button"
          onClick={onConfirmChoice}
          className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm sm:text-base rounded-xl shadow-md transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span>선택한 길로 돌진하기! ⚡</span>
        </button>
      )}
    </div>
  );
};
