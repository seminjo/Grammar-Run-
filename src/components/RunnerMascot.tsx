import React from 'react';

interface RunnerMascotProps {
  isStumbling?: boolean;
  isCheering?: boolean;
  className?: string;
}

export const RunnerMascot: React.FC<RunnerMascotProps> = ({
  isStumbling = false,
  isCheering = false,
  className = 'w-24 h-28',
}) => {
  return (
    <div
      className={`relative select-none flex items-center justify-center ${className} ${
        isStumbling
          ? 'animate-bounce text-rose-500 scale-95 duration-200'
          : isCheering
          ? 'animate-bounce text-amber-500 scale-110 duration-200'
          : 'animate-pulse'
      }`}
    >
      {/* Running Dust / Speed effects */}
      {!isStumbling && (
        <div className="absolute -bottom-2 flex gap-1 items-center opacity-70">
          <span className="w-2.5 h-1 bg-amber-300 rounded-full animate-ping" />
          <span className="w-1.5 h-1 bg-white rounded-full animate-pulse" />
          <span className="w-3 h-1.5 bg-amber-400 rounded-full" />
        </div>
      )}

      {/* SVG Cartoon Runner Mascot */}
      <svg
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Shadow */}
        <ellipse cx="50" cy="112" rx="28" ry="6" fill="#00000025" />

        {/* Back Leg */}
        <g className={!isStumbling ? 'origin-[50px_85px]' : ''}>
          <path
            d="M44 80 L38 98 L30 108"
            stroke="#1E293B"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Back Sneaker */}
          <ellipse cx="28" cy="108" rx="8" ry="5" fill="#EF4444" />
          <path d="M22 108 L34 108" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Torso / Jersey */}
        <rect
          x="36"
          y="48"
          width="28"
          height="34"
          rx="8"
          fill={isStumbling ? '#F43F5E' : isCheering ? '#10B981' : '#3B82F6'}
        />
        {/* Jersey Number / Star */}
        <circle cx="50" cy="65" r="7" fill="#FFFFFF" />
        <text
          x="50"
          y="69"
          textAnchor="middle"
          fontSize="10"
          fontWeight="bold"
          fill={isStumbling ? '#F43F5E' : '#2563EB'}
        >
          5
        </text>

        {/* Front Leg */}
        <g>
          <path
            d="M56 80 L62 95 L72 106"
            stroke="#1E293B"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Front Sneaker */}
          <ellipse cx="74" cy="106" rx="9" ry="5.5" fill="#F59E0B" />
          <path d="M68 106 L80 106" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Arms */}
        {/* Left Arm */}
        <path
          d={isCheering ? 'M38 52 L22 36 L18 24' : isStumbling ? 'M36 55 L20 62 L16 70' : 'M36 55 L24 64 L30 76'}
          stroke="#1E293B"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={isCheering ? '18' : '28'} cy={isCheering ? '22' : '72'} r="4.5" fill="#FED7AA" />

        {/* Right Arm */}
        <path
          d={isCheering ? 'M62 52 L78 36 L82 24' : isStumbling ? 'M64 55 L80 62 L84 70' : 'M64 55 L74 46 L82 56'}
          stroke="#1E293B"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={isCheering ? '82' : '80'} cy={isCheering ? '22' : '56'} r="4.5" fill="#FED7AA" />

        {/* Head */}
        <circle cx="50" cy="30" r="16" fill="#FED7AA" />

        {/* Cap (Runner Hat) */}
        <path
          d="M34 26 C34 16 66 16 66 26 Z"
          fill={isStumbling ? '#9F1239' : '#1D4ED8'}
        />
        {/* Cap Visor */}
        <path
          d="M48 24 L72 26 L66 30 L48 27 Z"
          fill={isStumbling ? '#881337' : '#1E40AF'}
        />

        {/* Eyes */}
        {isStumbling ? (
          // Dizzy X eyes
          <g stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round">
            <line x1="43" y1="28" x2="47" y2="32" />
            <line x1="47" y1="28" x2="43" y2="32" />
            <line x1="53" y1="28" x2="57" y2="32" />
            <line x1="57" y1="28" x2="53" y2="32" />
          </g>
        ) : isCheering ? (
          // Happy curved eyes ^ ^
          <g stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none">
            <path d="M42 30 Q45 26 48 30" />
            <path d="M52 30 Q55 26 58 30" />
          </g>
        ) : (
          // Big lively eyes
          <g fill="#1E293B">
            <circle cx="45" cy="30" r="2.5" />
            <circle cx="55" cy="30" r="2.5" />
            {/* Catchlight */}
            <circle cx="46" cy="29" r="0.8" fill="#FFFFFF" />
            <circle cx="56" cy="29" r="0.8" fill="#FFFFFF" />
          </g>
        )}

        {/* Mouth */}
        {isStumbling ? (
          <path d="M46 38 Q50 35 54 38" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
        ) : isCheering ? (
          <path d="M44 35 Q50 44 56 35 Z" fill="#EF4444" stroke="#1E293B" strokeWidth="1.5" />
        ) : (
          <path d="M46 36 Q50 40 54 36" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
        )}

        {/* Rosy Cheeks */}
        <circle cx="39" cy="34" r="2.5" fill="#FDA4AF" opacity="0.6" />
        <circle cx="61" cy="34" r="2.5" fill="#FDA4AF" opacity="0.6" />
      </svg>
    </div>
  );
};
