import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  filled: boolean;
  fillPercent?: number;
  size?: number;
  onClick?: () => void;
}

export default function WaterGlass({ filled, fillPercent = filled ? 100 : 0, size = 48, onClick }: Props) {
  const clipId = `glass-clip-${size}-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 64"
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className="cursor-pointer"
    >
      <path d="M8 8 L12 56 Q12 60 16 60 L32 60 Q36 60 36 56 L40 8 Z"
        fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinejoin="round" />
      <defs>
        <clipPath id={clipId}>
          <path d="M9 9 L13 55 Q13 59 16 59 L32 59 Q35 59 35 55 L39 9 Z" />
        </clipPath>
        <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <motion.rect
        clipPath={`url(#${clipId})`}
        x="8" width="32"
        initial={{ y: 60, height: 0 }}
        animate={{ y: 60 - (fillPercent / 100) * 52, height: (fillPercent / 100) * 52 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        rx="2"
        fill="url(#waterGradient)"
      />
      {fillPercent > 10 && (
        <motion.ellipse
          cx="20" cy={60 - (fillPercent / 100) * 52 + 5}
          rx="4" ry="1.5"
          fill="white" opacity="0.3"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.svg>
  );
}
