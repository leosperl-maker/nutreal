import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedCounter from '../components/AnimatedCounter';
import AnimatedProgressBar from '../components/AnimatedProgressBar';
import CircularProgress from '../components/CircularProgress';
import ScrollReveal from '../components/ScrollReveal';
import { DashboardSkeleton } from '../components/ShimmerSkeleton';
import { Droplets, Footprints, Flame, BookOpen, Dumbbell, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';

const WATER_GOAL = 2000;
const GLASS_ML = 250;
const GLASSES_TOTAL = 8;

const QUOTES = [
  "Chaque repas est une opportunité de nourrir ton corps. 🌱",
  "La constance bat l'intensité. Continue ! 💪",
  "Ton corps est ton temple, prends-en soin. ✨",
  "Un pas à la fois vers tes objectifs. 🎯",
  "La nutrition est la base de tout progrès. 🍎",
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, meals, waterLogs, dailySteps, stepsGoal, sportSessions, streak, calculateStreak, addWater, getTodayCalories } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => { calculateStreak(); setTimeout(() => setLoading(false), 600); }, []);

  if (!profile || loading) return <DashboardSkeleton />;

  const today = new Date().toISOString().split('T')[0];
  const todayStats = getTodayCalories();
  const todaySport = sportSessions.filter(s => s.date === today);
  const burned = todaySport.reduce((s, ss) => s + ss.caloriesBurned, 0);
  const remaining = profile.dailyCalorieBudget + burned - todayStats.consumed;
  const waterToday = Math.max(0, waterLogs.find(w => w.date === today)?.amount || 0);
  const glassesConsumed = Math.min(GLASSES_TOTAL, Math.floor(waterToday / GLASS_ML));
  const handleGlassTap = (i: number) => {
    const target = i < glassesConsumed ? i * GLASS_ML : (i + 1) * GLASS_ML;
    addWater(today, target - waterToday);
  };
  const quote = QUOTES[new Date().getDate() % QUOTES.length];
  const todayMeals = meals.filter(m => m.date === today);

  const macros = [
    { label: 'Protéines', value: todayStats.protein, target: profile.macroTargets.protein_g, color: 'bg-primary-500', unit: 'g' },
    { label: 'Glucides', value: todayStats.carbs, target: profile.macroTargets.carbs_g, color: 'bg-warning-300', unit: 'g' },
    { label: 'Lipides', value: todayStats.fat, target: profile.macroTargets.fat_g, color: 'bg-error-300', unit: 'g' },
    { label: 'Fibres', value: todayStats.fiber, target: profile.macroTargets.fiber_g, color: 'bg-success-400', unit: 'g' },
  ];

  return (
    <AnimatedPage className="px-4 pt-12 pb-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-display">Bonjour, {profile.name} 👋</h1>
          <p className="text-sm text-text-secondary">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        {streak > 0 && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.3 }}
            className="bg-warning-50 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <Flame size={16} className="text-warning-300" />
            <span className="text-sm font-bold text-warning-500">{streak}j</span>
          </motion.div>
        )}
      </div>

      {/* Quote */}
      <ScrollReveal>
        <div className="glass rounded-2xl p-4 mb-4 flex items-center gap-3">
          <Sparkles size={20} className="text-primary-400 flex-shrink-0" />
          <p className="text-sm text-text-secondary italic">{quote}</p>
        </div>
      </ScrollReveal>

      {/* Calorie Ring */}
      <ScrollReveal delay={0.05}>
        <AnimatedCard className="p-6 mb-4" index={0}>
          <div className="flex justify-center mb-4">
            <CircularProgress value={todayStats.consumed} max={profile.dailyCalorieBudget} size={180} color="#2A6B8A">
              <div className="text-center">
                <AnimatedCounter value={remaining} className="text-3xl font-bold text-text-primary font-display" />
                <p className="text-xs text-text-secondary mt-0.5">Restant</p>
              </div>
            </CircularProgress>
          </div>
          <div className="grid grid-cols-3 text-center gap-2 text-xs">
            <div className="bg-primary-50 rounded-xl py-2 px-1">
              <p className="font-bold text-primary-500"><AnimatedCounter value={profile.dailyCalorieBudget} /></p>
              <p className="text-text-muted">Budget</p>
            </div>
            <div className="bg-success-50 rounded-xl py-2 px-1">
              <p className="font-bold text-success-400"><AnimatedCounter value={todayStats.consumed} /></p>
              <p className="text-text-muted">Consommé</p>
            </div>
            <div className="bg-warning-50 rounded-xl py-2 px-1">
              <p className="font-bold text-warning-300"><AnimatedCounter value={burned} /></p>
              <p className="text-text-muted">Brûlé</p>
            </div>
          </div>
        </AnimatedCard>
      </ScrollReveal>

      {/* Macros */}
      <ScrollReveal delay={0.1}>
        <AnimatedCard className="p-4 mb-4" index={1}>
          <h3 className="text-sm font-semibold text-text-primary mb-3">Macronutriments</h3>
          <div className="space-y-3">
            {macros.map((m, i) => (
              <div key={m.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-secondary">{m.label}</span>
                  <span className="font-medium text-text-primary">{Math.round(m.value)}/{m.target}{m.unit}</span>
                </div>
                <AnimatedProgressBar percentage={m.target > 0 ? (m.value / m.target) * 100 : 0} color={m.color} delay={0.2 + i * 0.1} />
              </div>
            ))}
          </div>
        </AnimatedCard>
      </ScrollReveal>

      {/* Water */}
      <ScrollReveal delay={0.15}>
        <AnimatedCard className="p-4 mb-4" index={2}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                <Droplets size={20} className="text-primary-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-primary">Hydratation</h3>
                <p className="text-xs text-text-secondary">
                  {glassesConsumed}/{GLASSES_TOTAL} verres · {Math.min(waterToday, WATER_GOAL)}/{WATER_GOAL} ml
                </p>
              </div>
            </div>
            <p className="text-lg font-bold text-primary-500">
              {Math.round((waterToday / WATER_GOAL) * 100)}%
            </p>
          </div>
          <AnimatedProgressBar percentage={Math.min((waterToday / WATER_GOAL) * 100, 100)} color="bg-primary-500" className="mb-4" />
          {/* 8 verres cliquables */}
          <div className="flex justify-between px-1">
            {Array.from({ length: GLASSES_TOTAL }).map((_, i) => (
              <motion.button
                key={i}
                onClick={() => handleGlassTap(i)}
                whileTap={{ scale: 0.8 }}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.06, duration: 0.2 }}
                className="flex flex-col items-center gap-1"
                aria-label={`Verre ${i + 1}`}
              >
                <Droplets
                  size={28}
                  className={i < glassesConsumed ? 'text-primary-500' : 'text-surface-300'}
                  strokeWidth={i < glassesConsumed ? 2.5 : 1.5}
                />
                <span className={`text-[9px] font-medium ${i < glassesConsumed ? 'text-primary-500' : 'text-text-muted'}`}>
                  {(i + 1) * GLASS_ML / 1000 >= 1 ? `${(i + 1) * GLASS_ML / 1000}L` : `${(i + 1) * GLASS_ML}ml`}
                </span>
              </motion.button>
            ))}
          </div>
        </AnimatedCard>
      </ScrollReveal>

      {/* Steps & Sport */}
      <ScrollReveal delay={0.2}>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <AnimatedCard className="p-4" index={3}>
            <div className="flex items-center gap-2 mb-2">
              <Footprints size={18} className="text-primary-400" />
              <span className="text-xs font-medium text-text-secondary">Pas</span>
            </div>
            <AnimatedCounter value={dailySteps} className="text-xl font-bold text-text-primary" />
            <p className="text-xs text-text-muted">/ {stepsGoal.toLocaleString()}</p>
          </AnimatedCard>
          <AnimatedCard className="p-4" index={4} onClick={() => navigate('/sport')}>
            <div className="flex items-center gap-2 mb-2">
              <Dumbbell size={18} className="text-success-400" />
              <span className="text-xs font-medium text-text-secondary">Sport</span>
            </div>
            <AnimatedCounter value={todaySport.length} className="text-xl font-bold text-text-primary" suffix=" séance(s)" />
            <p className="text-xs text-text-muted">{burned} kcal brûlées</p>
          </AnimatedCard>
        </div>
      </ScrollReveal>

      {/* Today's meals */}
      <ScrollReveal delay={0.25}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-text-primary">Repas du jour</h3>
          <button onClick={() => navigate('/journal')} className="text-xs text-primary-500 font-medium flex items-center gap-1">
            Journal <ChevronRight size={14} />
          </button>
        </div>
        {todayMeals.length === 0 ? (
          <AnimatedCard className="p-6 text-center" index={5}>
            <BookOpen size={32} className="text-text-muted mx-auto mb-2" />
            <p className="text-sm text-text-secondary">Aucun repas enregistré</p>
            <button onClick={() => navigate('/scanner')} className="text-primary-500 text-sm font-medium mt-2">Scanner un repas →</button>
          </AnimatedCard>
        ) : (
          <div className="space-y-2">
            {todayMeals.map((meal, i) => (
              <AnimatedCard key={meal.id} className="p-3 flex items-center gap-3" index={5 + i}>
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-lg">
                  {meal.mealType === 'breakfast' ? '🌅' : meal.mealType === 'lunch' ? '☀️' : meal.mealType === 'snack' ? '🍎' : '🌙'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{meal.dishName}</p>
                  <p className="text-xs text-text-muted">{meal.totalCalories} kcal</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        )}
      </ScrollReveal>

      {/* Quick actions */}
      <ScrollReveal delay={0.3}>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <motion.button whileTap={{ scale: 0.96 }} onClick={() => navigate('/scanner')}
            className="bg-primary-500 text-white rounded-2xl p-4 text-left shadow-float">
            <TrendingUp size={20} className="mb-2" />
            <p className="text-sm font-semibold">Scanner</p>
            <p className="text-xs text-white/70">Photo ou code-barres</p>
          </motion.button>
          <motion.button whileTap={{ scale: 0.96 }} onClick={() => navigate('/meal-plan')}
            className="bg-success-400 text-white rounded-2xl p-4 text-left shadow-float">
            <BookOpen size={20} className="mb-2" />
            <p className="text-sm font-semibold">Plan repas</p>
            <p className="text-xs text-white/70">Planifier la semaine</p>
          </motion.button>
        </div>
      </ScrollReveal>
    </AnimatedPage>
  );
}
