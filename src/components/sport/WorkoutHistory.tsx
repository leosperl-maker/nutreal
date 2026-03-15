import React from 'react';
import { motion } from 'framer-motion';
import Icon3D from '../Icon3D';
import { Clock, Flame, Dumbbell, TrendingUp, Calendar } from 'lucide-react';
import type { CompletedWorkout } from '../../lib/workoutGenerator';

interface Props {
  workouts: CompletedWorkout[];
  weeklyStats: {
    workouts: number;
    totalCalories: number;
    totalMinutes: number;
    avgFeeling: string;
  };
  streak: number;
}

const feelingEmojis: Record<string, string> = {
  easy: 'slightlySmiling',
  good: 'flexedBiceps',
  hard: 'fire',
  exhausted: 'highVoltage',
};

export default function WorkoutHistory({ workouts, weeklyStats, streak }: Props) {
  const recentWorkouts = workouts.slice(0, 20);

  return (
    <div className="space-y-4">
      {/* Weekly Stats */}
      <div className="bg-gradient-to-br from-primary-500/10 to-primary-700/10 rounded-2xl p-4 border border-primary-500/20">
        <h3 className="font-display font-bold text-text-primary mb-3 flex items-center gap-2">
          <TrendingUp size={18} className="text-primary-500" />
          Cette semaine
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-primary-500">{weeklyStats.workouts}</p>
            <p className="text-xs text-text-muted">séances</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-orange-500">{weeklyStats.totalCalories}</p>
            <p className="text-xs text-text-muted">kcal brûlées</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-teal-500">{weeklyStats.totalMinutes}</p>
            <p className="text-xs text-text-muted">minutes</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-text-primary">{weeklyStats.avgFeeling}</p>
            <p className="text-xs text-text-muted">ressenti</p>
          </div>
        </div>
        {streak > 0 && (
          <div className="mt-3 flex items-center justify-center gap-2 bg-white rounded-xl py-2">
            <Icon3D name="fire" size={16} />
            <span className="text-sm font-semibold text-text-primary">{streak} jours consécutifs</span>
          </div>
        )}
      </div>

      {/* History */}
      <div>
        <h3 className="font-display font-bold text-text-primary mb-3 flex items-center gap-2">
          <Calendar size={18} className="text-text-muted" />
          Historique
        </h3>
        {recentWorkouts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-card">
            <span className="block mb-3"><Icon3D name="personLiftingWeights" size={40} /></span>
            <p className="text-text-muted text-sm">Aucun entraînement terminé</p>
            <p className="text-surface-300 text-xs mt-1">Lancez votre première séance !</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentWorkouts.map((workout, index) => (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-3 shadow-card flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                  <Icon3D name={feelingEmojis[workout.feeling] || 'flexedBiceps'} size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary text-sm truncate">{workout.sessionName}</p>
                  <p className="text-xs text-text-muted">
                    {new Date(workout.date).toLocaleDateString('fr-FR', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-text-muted">
                    <Clock size={10} />
                    {workout.duration} min
                  </div>
                  <div className="flex items-center gap-1 text-xs text-orange-500">
                    <Flame size={10} />
                    {workout.caloriesBurned} kcal
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
