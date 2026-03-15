import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Droplets, Dumbbell, Utensils, TrendingUp, Target } from 'lucide-react';
import { useStore } from '../store/useStore';
import Icon3D from './Icon3D';

interface WeeklyReportProps {
  open: boolean;
  onClose: () => void;
}

export default function WeeklyReport({ open, onClose }: WeeklyReportProps) {
  const { meals, waterLogs, sportSessions, xp, level, streak, dailyMissions } = useStore();

  if (!open) return null;

  // Calculate this week's stats
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekStart = weekAgo.toISOString().split('T')[0];

  const weekMeals = meals.filter(m => m.date >= weekStart);
  const weekSport = sportSessions.filter(s => s.date >= weekStart);
  const weekWater = waterLogs.filter(w => w.date >= weekStart);
  const weekCalories = weekMeals.reduce((s, m) => s + m.totalCalories, 0);
  const weekBurned = weekSport.reduce((s, ss) => s + ss.caloriesBurned, 0);
  const weekWaterTotal = weekWater.reduce((s, w) => s + w.amount, 0);
  const completedMissions = dailyMissions.filter(m => m.isCompleted).length;

  const stats = [
    { icon: Utensils, label: 'Repas enregistrés', value: weekMeals.length, emoji: 'forkAndKnife', color: 'from-primary-400 to-primary-600' },
    { icon: Flame, label: 'Calories consommées', value: `${Math.round(weekCalories).toLocaleString()} kcal`, emoji: 'fire', color: 'from-orange-400 to-red-500' },
    { icon: Dumbbell, label: 'Séances sport', value: weekSport.length, emoji: 'flexedBiceps', color: 'from-green-400 to-emerald-600' },
    { icon: Dumbbell, label: 'Calories brûlées', value: `${weekBurned} kcal`, emoji: 'highVoltage', color: 'from-amber-400 to-amber-500' },
    { icon: Droplets, label: 'Eau bue', value: `${(weekWaterTotal / 1000).toFixed(1)}L`, emoji: 'droplet', color: 'from-teal-400 to-teal-600' },
    { icon: Target, label: 'Missions complétées', value: completedMissions, emoji: 'bullseye', color: 'from-primary-600 to-primary-800' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-b from-primary-600 to-primary-800 z-50 flex flex-col items-center overflow-y-auto"
      >
        {/* Close button */}
        <button onClick={onClose} className="absolute top-12 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center z-10">
          <X size={20} className="text-white" />
        </button>

        <div className="w-full max-w-sm px-6 pt-16 pb-8">
          {/* Header */}
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-center mb-8">
            <p className="text-white/50 text-xs uppercase tracking-widest font-bold">Votre semaine</p>
            <h1 className="text-3xl font-black text-white mt-2 font-display">Récap hebdo</h1>
            <p className="text-white/40 text-sm mt-1">
              {weekAgo.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} — {today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
            </p>
          </motion.div>

          {/* Stats cards - Spotify Wrapped style */}
          <div className="space-y-3">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ x: i % 2 === 0 ? -50 : 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className={`bg-gradient-to-r ${stat.color} rounded-2xl p-4 flex items-center gap-4`}
              >
                <Icon3D name={stat.emoji} size={32} />
                <div>
                  <p className="text-white/70 text-xs">{stat.label}</p>
                  <p className="text-white text-2xl font-black">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* XP & Level summary */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-6 bg-white/10 backdrop-blur-xl rounded-2xl p-5 text-center"
          >
            <p className="text-white/50 text-xs uppercase tracking-wider font-bold mb-2">Progression</p>
            <div className="flex items-center justify-center gap-4">
              <div>
                <p className="text-white text-3xl font-black">Niv. {level}</p>
                <p className="text-white/50 text-xs">{xp} XP total</p>
              </div>
              {streak > 0 && (
                <div className="border-l border-white/20 pl-4">
                  <p className="text-white text-3xl font-black flex items-center gap-1">{streak}<Icon3D name="fire" size={28} /></p>
                  <p className="text-white/50 text-xs">jours de streak</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Close CTA */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5 }}
            onClick={onClose}
            className="w-full mt-6 py-4 bg-white rounded-2xl font-bold text-primary-600 text-sm active:scale-95 transition-transform"
          >
            Continuer
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
