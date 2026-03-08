import React from 'react';
import { motion } from 'framer-motion';

interface Props { children: React.ReactNode; index?: number; className?: string; onClick?: () => void; glass?: boolean; }

export default function AnimatedCard({ children, index = 0, className = '', onClick, glass = true }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: 'easeOut' }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`${glass ? 'glass' : 'bg-white'} rounded-2xl ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}
