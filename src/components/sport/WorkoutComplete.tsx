import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Flame, Dumbbell, Star, ArrowRight } from 'lucide-react';
import Icon3D from '../Icon3D';
import confetti from 'canvas-confetti';

interface Props {
  result: {
    duration: number;
    caloriesBurned: number;
    exercisesCompleted: number;
    totalExercises: number;
  };
  sessionName: string;
  onSelectFeeling: (feeling: 'easy' | 'good' | 'hard' | 'exhausted') => void;
}

export default function WorkoutComplete({ result, sessionName, onSelectFeeling }: Props) {
  useEffect(() => {
    // Confetti celebration!
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#9E7FFF', '#38bdf8', '#f472b6', '#10b981'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#9E7FFF', '#38bdf8', '#f472b6', '#10b981'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const feelings: { value: 'easy' | 'good' | 'hard' | 'exhausted'; emoji: string; label: string }[] = [
    { value: 'easy', emoji: 'slightlySmiling', label: 'Facile' },
    { value: 'good', emoji: 'flexedBiceps', label: 'Bien' },
    { value: 'hard', emoji: 'fire', label: 'Intense' },
    { value: 'exhausted', emoji: 'highVoltage', label: 'Épuisant' },
  ];

  const completionRate = Math.round((result.exercisesCompleted / result.totalExercises) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center px-6"
    >
      {/* Trophy */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', delay: 0.3 }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-6 shadow-2xl"
      >
        <Trophy size={48} className="text-white" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity:1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-3xl font-bold text-white font-display mb-2"
      >
        Bravo !
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-white/60 text-sm mb-8"
      >
        {sessionName} terminé !
      </motion.p>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="grid grid-cols-3 gap-4 w-full max-w-sm mb-8"
      >
        <div className="bg-white/10 rounded-2xl p-4 text-center">
          <Clock size={20} className="text-blue-400 mx-auto mb-1" />
          <p className="text-white font-bold text-lg">{result.duration}</p>
          <p className="text-white/40 text-xs">minutes</p>
        </div>
        <div className="bg-white/10 rounded-2xl p-4 text-center">
          <Flame size={20} className="text-orange-400 mx-auto mb-1" />
          <p className="text-white font-bold text-lg">{result.caloriesBurned}</p>
          <p className="text-white/40 text-xs">kcal</p>
        </div>
        <div className="bg-white/10 rounded-2xl p-4 text-center">
          <Dumbbell size={20} className="text-primary-400 mx-auto mb-1" />
          <p className="text-white font-bold text-lg">{completionRate}%</p>
          <p className="text-white/40 text-xs">complété</p>
        </div>
      </motion.div>

      {/* Feeling Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="w-full max-w-sm"
      >
        <p className="text-white/60 text-sm text-center mb-3">Comment vous sentez-vous ?</p>
        <div className="grid grid-cols-4 gap-2">
          {feelings.map(f => (
            <button
              key={f.value}
              onClick={() => onSelectFeeling(f.value)}
              className="bg-white/10 hover:bg-white/20 rounded-xl p-3 text-center transition-all active:scale-95"
            >
              <span className="block mb-1"><Icon3D name={f.emoji} size={28} /></span>
              <span className="text-white/70 text-xs">{f.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
