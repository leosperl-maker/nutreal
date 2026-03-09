import React from 'react';
import { motion } from 'framer-motion';
import { useStore, xpForNextLevel } from '../store/useStore';

interface LevelBarProps {
  compact?: boolean;
  className?: string;
}

export default function LevelBar({ compact = false, className = '' }: LevelBarProps) {
  const { xp, level } = useStore();
  const needed = xpForNextLevel(level);
  const progress = needed > 0 ? Math.min(xp / needed, 1) : 0;

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-7 h-7 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-black">{level}</span>
        </div>
        <div className="flex-1">
          <div className="h-2 bg-surface-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
        <span className="text-[10px] text-text-muted font-medium">{xp}/{needed}</span>
      </div>
    );
  }

  return (
    <div className={`glass rounded-2xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-float">
            <span className="text-white text-sm font-black">{level}</span>
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary">Niveau {level}</p>
            <p className="text-xs text-text-muted">{xp} / {needed} XP</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-muted">Prochain niveau</p>
          <p className="text-sm font-bold text-primary-500">{needed - xp} XP</p>
        </div>
      </div>

      <div className="h-3 bg-surface-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
}
