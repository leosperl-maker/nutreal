import React, { useState, useRef, useEffect } from 'react';
import { Trophy, Flame, Dumbbell, Utensils, Droplets, Check, Target, Star, Zap, Heart, Calendar, TrendingUp, Award } from 'lucide-react';
import { useStore } from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedCard from '../components/AnimatedCard';
import AchievementUnlockPopup from '../components/AchievementUnlockPopup';

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
  const { streak, meals, sportSessions, waterLogs, weightLogs, mealPlan, productScans, profile } = useStore();
  const [popupAchievement, setPopupAchievement] = useState<Achievement | null>(null);
  const prevUnlockedRef = useRef<Set<string>>(new Set());
  const isInitializedRef = useRef(false);

  const today = new Date().toISOString().split('T')[0];
  const totalMeals = meals.length;
  const totalSport = sportSessions.length;
  const totalKcalBurned = sportSessions.reduce((s, ss) => s + ss.caloriesBurned, 0);
  const totalWeightLogs = weightLogs.length;
  const todayMeals = meals.filter(m => m.date === today).length;
  const uniqueDays = new Set(meals.map(m => m.date)).size;
  const totalCaloriesTracked = meals.reduce((s, m) => s + m.totalCalories, 0);
  const hasMealPlan = mealPlan !== null;
  const hasScanProduct = productScans.length > 0;

  const list: Achievement[] = [
    // 🔥 Streak
    { id: 'streak_1',  icon: Flame,      label: 'Premier jour',        desc: 'Enregistrer un repas le 1er jour',        unlocked: streak >= 1,  color: 'text-warning-300', bg: 'bg-warning-50' },
    { id: 'streak_3',  icon: Flame,      label: '3 jours consécutifs', desc: 'Maintenir un streak de 3 jours',           unlocked: streak >= 3,  color: 'text-warning-300', bg: 'bg-warning-50' },
    { id: 'streak_7',  icon: Flame,      label: 'Semaine parfaite',    desc: 'Maintenir un streak de 7 jours',           unlocked: streak >= 7,  color: 'text-warning-400', bg: 'bg-warning-50' },
    { id: 'streak_14', icon: Flame,      label: 'Deux semaines !',     desc: 'Maintenir un streak de 14 jours',          unlocked: streak >= 14, color: 'text-warning-400', bg: 'bg-warning-50' },
    { id: 'streak_30', icon: Flame,      label: 'Mois de feu 🔥',      desc: 'Maintenir un streak de 30 jours',          unlocked: streak >= 30, color: 'text-error-300',   bg: 'bg-error-50'   },

    // 🍽️ Repas
    { id: 'meals_1',   icon: Utensils,   label: 'Premier repas',       desc: 'Enregistrer votre premier repas',          unlocked: totalMeals >= 1,   color: 'text-primary-500', bg: 'bg-primary-50' },
    { id: 'meals_5',   icon: Utensils,   label: 'Bon appétit !',       desc: 'Enregistrer 5 repas',                      unlocked: totalMeals >= 5,   color: 'text-primary-500', bg: 'bg-primary-50' },
    { id: 'meals_10',  icon: Utensils,   label: 'Gourmet',             desc: 'Enregistrer 10 repas',                     unlocked: totalMeals >= 10,  color: 'text-primary-500', bg: 'bg-primary-50' },
    { id: 'meals_25',  icon: Utensils,   label: 'Fin palais',          desc: 'Enregistrer 25 repas',                     unlocked: totalMeals >= 25,  color: 'text-primary-500', bg: 'bg-primary-50' },
    { id: 'meals_50',  icon: Utensils,   label: 'Épicurien',           desc: 'Enregistrer 50 repas',                     unlocked: totalMeals >= 50,  color: 'text-primary-600', bg: 'bg-primary-50' },
    { id: 'meals_100', icon: Award,      label: 'Centenaire',          desc: 'Enregistrer 100 repas',                    unlocked: totalMeals >= 100, color: 'text-primary-600', bg: 'bg-primary-100' },

    // 💪 Sport
    { id: 'sport_1',   icon: Dumbbell,   label: 'Premier effort',      desc: 'Compléter une séance de sport',            unlocked: totalSport >= 1,  color: 'text-success-400', bg: 'bg-success-50' },
    { id: 'sport_5',   icon: Dumbbell,   label: 'Sportif',             desc: 'Compléter 5 séances de sport',             unlocked: totalSport >= 5,  color: 'text-success-400', bg: 'bg-success-50' },
    { id: 'sport_10',  icon: Dumbbell,   label: 'Athlète en devenir',  desc: 'Compléter 10 séances de sport',            unlocked: totalSport >= 10, color: 'text-success-400', bg: 'bg-success-50' },
    { id: 'sport_20',  icon: Dumbbell,   label: 'Athlète',             desc: 'Compléter 20 séances de sport',            unlocked: totalSport >= 20, color: 'text-success-500', bg: 'bg-success-100' },
    { id: 'kcal_1000', icon: Zap,        label: 'Brûleur',             desc: 'Brûler 1 000 kcal au sport',               unlocked: totalKcalBurned >= 1000,  color: 'text-success-500', bg: 'bg-success-50' },
    { id: 'kcal_5000', icon: Zap,        label: 'Torche humaine',      desc: 'Brûler 5 000 kcal au sport',               unlocked: totalKcalBurned >= 5000,  color: 'text-success-500', bg: 'bg-success-100' },

    // 💧 Hydratation
    { id: 'water_1',   icon: Droplets,   label: 'Bien hydraté',        desc: 'Enregistrer 1 jour d\'hydratation',        unlocked: waterLogs.length >= 1,  color: 'text-primary-400', bg: 'bg-primary-50' },
    { id: 'water_7',   icon: Droplets,   label: 'Semaine hydratée',    desc: 'Enregistrer 7 jours d\'hydratation',       unlocked: waterLogs.length >= 7,  color: 'text-primary-400', bg: 'bg-primary-50' },
    { id: 'water_30',  icon: Droplets,   label: 'Source naturelle',    desc: 'Enregistrer 30 jours d\'hydratation',      unlocked: waterLogs.length >= 30, color: 'text-primary-500', bg: 'bg-primary-100' },

    // 📅 Régularité
    { id: 'days_7',    icon: Calendar,   label: '7 jours trackés',     desc: 'Utiliser Nutreal sur 7 jours différents',  unlocked: uniqueDays >= 7,  color: 'text-primary-400', bg: 'bg-primary-50' },
    { id: 'days_30',   icon: Calendar,   label: '30 jours trackés',    desc: 'Utiliser Nutreal sur 30 jours différents', unlocked: uniqueDays >= 30, color: 'text-primary-500', bg: 'bg-primary-50' },

    // 📈 Poids
    { id: 'weight_1',  icon: TrendingUp, label: 'Première pesée',      desc: 'Enregistrer votre premier poids',          unlocked: totalWeightLogs >= 1, color: 'text-error-300', bg: 'bg-error-50' },
    { id: 'weight_5',  icon: TrendingUp, label: 'Suivi régulier',      desc: 'Enregistrer 5 pesées',                     unlocked: totalWeightLogs >= 5, color: 'text-error-300', bg: 'bg-error-50' },

    // 🎯 Spécial
    { id: 'plan_done', icon: Star,       label: 'Planificateur',       desc: 'Créer un plan repas hebdomadaire',          unlocked: hasMealPlan,      color: 'text-warning-400', bg: 'bg-warning-50' },
    { id: 'scan_1',    icon: Target,     label: 'Scanner pro',         desc: 'Scanner votre premier produit',             unlocked: hasScanProduct,   color: 'text-primary-500', bg: 'bg-primary-50' },
  ];

  // Detect newly unlocked achievements and show popup
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const currentUnlocked = new Set(list.filter(a => a.unlocked).map(a => a.id));

    if (!isInitializedRef.current) {
      // First mount: record baseline, no popup
      prevUnlockedRef.current = currentUnlocked;
      isInitializedRef.current = true;
      return;
    }

    const prev = prevUnlockedRef.current;
    for (const id of currentUnlocked) {
      if (!prev.has(id)) {
        const achievement = list.find(a => a.id === id);
        if (achievement) {
          setPopupAchievement(achievement);
          break; // Show one at a time
        }
      }
    }
    prevUnlockedRef.current = currentUnlocked;
  });

  const unlockedCount = list.filter(a => a.unlocked).length;

  // Group achievements by theme
  const groups: { label: string; emoji: string; ids: string[] }[] = [
    { label: 'Régularité',    emoji: '🔥', ids: ['streak_1', 'streak_3', 'streak_7', 'streak_14', 'streak_30'] },
    { label: 'Nutrition',     emoji: '🍽️', ids: ['meals_1', 'meals_5', 'meals_10', 'meals_25', 'meals_50', 'meals_100'] },
    { label: 'Sport',         emoji: '💪', ids: ['sport_1', 'sport_5', 'sport_10', 'sport_20', 'kcal_1000', 'kcal_5000'] },
    { label: 'Hydratation',   emoji: '💧', ids: ['water_1', 'water_7', 'water_30'] },
    { label: 'Assiduité',     emoji: '📅', ids: ['days_7', 'days_30', 'weight_1', 'weight_5'] },
    { label: 'Exploration',   emoji: '⭐', ids: ['plan_done', 'scan_1'] },
  ];

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
          <span>Progression globale</span>
          <span className="font-medium text-primary-500">{Math.round((unlockedCount / list.length) * 100)}%</span>
        </div>
        <div className="h-2.5 bg-surface-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-700"
            style={{ width: `${(unlockedCount / list.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-text-muted mt-2 text-center">
          {unlockedCount === list.length ? '🏆 Tous les succès débloqués !' : `Plus que ${list.length - unlockedCount} succès à débloquer`}
        </p>
      </div>

      {/* Achievements grouped */}
      {groups.map(group => {
        const groupItems = list.filter(a => group.ids.includes(a.id));
        const groupUnlocked = groupItems.filter(a => a.unlocked).length;
        return (
          <div key={group.label} className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-text-primary">
                {group.emoji} {group.label}
              </h3>
              <span className="text-xs font-medium text-primary-500 bg-primary-50 px-2.5 py-0.5 rounded-full">
                {groupUnlocked}/{groupItems.length}
              </span>
            </div>
            <div className="space-y-2">
              {groupItems.map((achievement, i) => {
                const Icon = achievement.icon;
                return (
                  <AnimatedCard
                    key={achievement.id}
                    className={`p-4 flex items-center gap-4 ${!achievement.unlocked ? 'opacity-45' : ''}`}
                    index={i}
                  >
                    <div className={`w-11 h-11 ${achievement.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                      <Icon size={20} className={achievement.unlocked ? achievement.color : 'text-text-muted'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${achievement.unlocked ? 'text-text-primary' : 'text-text-muted'}`}>
                        {achievement.label}
                      </p>
                      <p className="text-xs text-text-muted truncate">{achievement.desc}</p>
                    </div>
                    {achievement.unlocked && (
                      <div className="w-7 h-7 bg-success-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check size={14} className="text-success-400" />
                      </div>
                    )}
                    {!achievement.unlocked && (
                      <div className="w-7 h-7 bg-surface-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-3 h-3 rounded-full border-2 border-surface-400" />
                      </div>
                    )}
                  </AnimatedCard>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Achievement unlock popup */}
      <AchievementUnlockPopup
        achievement={popupAchievement}
        onClose={() => setPopupAchievement(null)}
      />
    </AnimatedPage>
  );
}
