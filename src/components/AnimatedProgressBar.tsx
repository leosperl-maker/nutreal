import React from 'react';
import { motion } from 'framer-motion';

interface Props { percentage: number; color?: string; height?: string; className?: string; delay?: number; }

export default function AnimatedProgressBar({ percentage, color = 'bg-primary-500', height = 'h-2', className = '', delay = 0.2 }: Props) {
  const clamped = Math.min(100, Math.max(0, percentage));
  return (
    <div className={`w-full ${height} bg-surface-200 rounded-full overflow-hidden ${className}`}>
      <motion.div
        className={`${height} ${color} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.8, ease: 'easeOut', delay }}
        style={{ willChange: 'transform' }}
      />
    </div>
  );
}
