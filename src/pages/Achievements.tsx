import React from 'react';
import { Trophy, Flame, Dumbbell, Utensils, Droplets, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedCard from '../components/AnimatedCard';

interface Achievement {
  id: string;
  icon: React.ElementType;
  label: string;
  desc: string;
  unlocked: boolean;
  color: string;
  bg: string;
}

export default function Achievements() {
  const { streak, meals, sportSessions, waterLogs, profile } = useStore();

  const totalMeals = meals.length;
  const totalSport = sportSessions.length;

  const list: Achievement[] = [
    { id: 'streak_3', icon: Flame, label: '3 jours consécutifs', desc: 'Maintenir un streak de 3 jours', unlocked: streak >= 3, color: 'text-warning-300', bg: 'bg-warning-50' },
    { id: 'streak_7', icon: Flame, label: 'Semaine parfaite', desc: 'Maintenir un streak de 7 jours', unlocked: streak >= 7, color: 'text-warning-300', bg: 'bg-warning-50' },
    { id: 'streak_30', icon: Flame, label: 'Mois de feu', desc: 'Maintenir un streak de 30 jours', unlocked: streak >= 30, color: 'text-warning-300', bg: 'bg-warning-50' },
    { id: 'meals_1', icon: Utensils, label: 'Premier repas', desc: 'Enregistrer votre premier repas', unlocked: totalMeals >= 1, color: 'text-primary-500', bg: 'bg-primary-50' },
    { id: 'meals_10', icon: Utensils, label: 'Gourmet', desc: 'Enregistrer 10 repas', unlocked: totalMeals >= 10, color: 'text-primary-500', bg: 'bg-primary-50' },
    { id: 'meals_50', icon: Utensils, label: 'Épicurien', desc: 'Enregistrer 50 repas', unlocked: totalMeals >= 50, color: 'text-primary-500', bg: 'bg-primary-50' },
    { id: 'sport_1', icon: Dumbbell, label: 'Premier effort', desc: 'Compléter une séance de sport', unlocked: totalSport >= 1, color: 'text-success-400', bg: 'bg-success-50' },
    { id: 'sport_5', icon: Dumbbell, label: 'Sportif', desc: 'Compléter 5 séances de sport', unlocked: totalSport >= 5, color: 'text-success-400', bg: 'bg-success-50' },
    { id: 'sport_20', icon: Dumbbell, label: 'Athlète', desc: 'Compléter 20 séances de sport', unlocked: totalSport >= 20, color: 'text-success-400', bg: 'bg-success-50' },
    { id: 'water_7', icon: Droplets, label: 'Bien hydraté', desc: 'Enregistrer 7 jours d\'hydratation', unlocked: waterLogs.length >= 7, color: 'text-primary-400', bg: 'bg-primary-50' },
  ];

  const unlockedCount = list.filter(a => a.unlocked).length;

  return (
    <AnimatedPage className="px-4 pt-12 pb-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 bg-warning-50 rounded-2xl flex items-center justify-center">
          <Trophy size={24} className="text-warning-300" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-display">Succès</h1>
          <p className="text-sm text-text-secondary">{unlockedCount}/{list.length} débloqués</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="glass rounded-2xl p-4 mb-6">
        <div className="flex justify-between text-xs text-text-secondary mb-2">
          <span>Progression</span>
          <span className="font-medium text-primary-500">{Math.round((unlockedCount / list.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-surface-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-700"
            style={{ width: `${(unlockedCount / list.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Achievements list */}
      <div className="space-y-3">
        {list.map((achievement, i) => {
          const Icon = achievement.icon;
          return (
            <AnimatedCard
              key={achievement.id}
              className={`p-4 flex items-center gap-4 ${!achievement.unlocked ? 'opacity-50' : ''}`}
              index={i}
            >
              <div className={`w-12 h-12 ${achievement.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                <Icon size={22} className={achievement.unlocked ? achievement.color : 'text-text-muted'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${achievement.unlocked ? 'text-text-primary' : 'text-text-muted'}`}>
                  {achievement.label}
                </p>
                <p className="text-xs text-text-muted truncate">{achievement.desc}</p>
              </div>
              {achievement.unlocked && (
                <div className="w-8 h-8 bg-success-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={16} className="text-success-400" />
                </div>
              )}
            </AnimatedCard>
          );
        })}
      </div>
    </AnimatedPage>
  );
}
