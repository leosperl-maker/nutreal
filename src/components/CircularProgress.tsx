import React from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

interface Props { value: number; max: number; size?: number; strokeWidth?: number; color?: string; label?: string; unit?: string; children?: React.ReactNode; }

export default function CircularProgress({ value, max, size = 180, strokeWidth = 10, color = '#2ea05a', label, unit, children }: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = max > 0 ? Math.min(value / max, 1) : 0;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2ece6" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - percentage) }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          style={{ willChange: 'stroke-dashoffset' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children || (
          <>
            <AnimatedCounter value={value} className="text-3xl font-bold text-text-primary font-display" />
            {unit && <span className="text-xs text-text-secondary mt-0.5">{unit}</span>}
            {label && <span className="text-xs text-text-muted mt-0.5">{label}</span>}
          </>
        )}
      </div>
    </div>
  );
}
