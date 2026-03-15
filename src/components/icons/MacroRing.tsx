import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  percent: number;
  color: string;
  label: string;
  value: string;
  size?: number;
}

export default function MacroRing({ percent, color, label, value, size = 64 }: Props) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(percent, 100) / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth="6" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <p className="text-xs font-bold mt-1" style={{ color }}>{value}</p>
      <p className="text-[10px] text-text-muted">{label}</p>
    </div>
  );
}
