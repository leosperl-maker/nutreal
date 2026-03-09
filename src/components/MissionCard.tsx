import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { AIMission } from '../store/useStore';

interface MissionCardProps {
  mission: AIMission;
  index?: number;
}

const DIFFICULTY_COLORS = {
  easy: 'bg-green-50 text-green-600 border-green-200',
  medium: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  hard: 'bg-red-50 text-red-600 border-red-200',
};

const DIFFICULTY_LABELS = {
  easy: 'Facile',
  medium: 'Moyen',
  hard: 'Difficile',
};

export default function MissionCard({ mission, index = 0 }: MissionCardProps) {
  const { completeMission } = useStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`glass rounded-2xl p-4 flex items-center gap-3 ${mission.isCompleted ? 'opacity-60' : ''}`}
    >
      {/* Checkbox / emoji */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => !mission.isCompleted && completeMission(mission.id)}
        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
          mission.isCompleted
            ? 'bg-green-500'
            : 'bg-primary-50 active:bg-primary-100'
        }`}
      >
        {mission.isCompleted ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <Check size={20} className="text-white" />
          </motion.div>
        ) : (
          <span className="text-xl">{mission.emoji}</span>
        )}
      </motion.button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${mission.isCompleted ? 'text-text-muted line-through' : 'text-text-primary'}`}>
          {mission.title}
        </p>
        <p className="text-xs text-text-muted truncate">{mission.description}</p>
      </div>

      {/* XP + difficulty */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className={`text-xs font-bold ${mission.isCompleted ? 'text-green-500' : 'text-primary-500'}`}>
          +{mission.xpReward} XP
        </span>
        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border ${DIFFICULTY_COLORS[mission.difficulty]}`}>
          {DIFFICULTY_LABELS[mission.difficulty]}
        </span>
      </div>
    </motion.div>
  );
}
