import React from 'react';

interface V7GlassProps {
  index: number;
  filled: boolean;
  onClick: () => void;
}

export default function V7Glass({ index, filled, onClick }: V7GlassProps) {
  const fillY = filled ? 10 : 48;
  const waveColor1 = filled ? '#38bdf8' : 'rgba(148,196,230,0.15)';
  const waveColor2 = filled ? '#0ea5e9' : 'rgba(120,170,210,0.08)';
  const strokeC = filled ? '#7dd3fc' : 'rgba(180,210,240,0.35)';
  const shimmer = filled ? 'rgba(255,255,255,0.45)' : 'transparent';
  const gcId = `gc${index}`;
  const gwId = `gw${index}`;

  return (
    <svg
      width="36"
      height="48"
      viewBox="0 0 36 48"
      fill="none"
      onClick={onClick}
      className="cursor-pointer flex-shrink-0 transition-transform hover:scale-110 hover:-translate-y-[3px] active:scale-[0.94]"
    >
      <defs>
        <clipPath id={gcId}>
          <path d="M5 4 L3 44 Q3 46 6 46 L30 46 Q33 46 33 44 L31 4 Q30 2 18 2 Q6 2 5 4Z" />
        </clipPath>
        <linearGradient id={gwId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={waveColor1} />
          <stop offset="100%" stopColor={waveColor2} />
        </linearGradient>
      </defs>
      <path
        d="M5 4 L3 44 Q3 46 6 46 L30 46 Q33 46 33 44 L31 4 Q30 2 18 2 Q6 2 5 4Z"
        fill="rgba(200,235,255,0.06)"
        stroke={strokeC}
        strokeWidth="1.5"
      />
      <g clipPath={`url(#${gcId})`}>
        {filled && (
          <>
            <rect x="1" y={fillY} width="34" height="48" fill={`url(#${gwId})`} />
            <path fill="rgba(255,255,255,0.22)">
              <animate
                attributeName="d"
                values={`M1,${fillY + 2} Q10,${fillY - 4} 18,${fillY + 2} Q26,${fillY + 8} 34,${fillY + 2} L34,${fillY + 9} L1,${fillY + 9}Z;M1,${fillY + 2} Q10,${fillY + 8} 18,${fillY + 2} Q26,${fillY - 4} 34,${fillY + 2} L34,${fillY + 9} L1,${fillY + 9}Z;M1,${fillY + 2} Q10,${fillY - 4} 18,${fillY + 2} Q26,${fillY + 8} 34,${fillY + 2} L34,${fillY + 9} L1,${fillY + 9}Z`}
                dur="1.6s"
                repeatCount="indefinite"
              />
            </path>
            <rect x="8" y={fillY + 5} width="3" height="28" rx="1.5" fill={shimmer} opacity="0.5" />
          </>
        )}
      </g>
      <path d="M7 4 Q18 1.5 29 4" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  );
}
