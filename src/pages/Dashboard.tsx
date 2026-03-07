import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, ChevronRight, Flame, BookOpen } from 'lucide-react';
import { useStore } from '../store/useStore';
import CircularProgress from '../components/CircularProgress';
import MacroBar from '../components/MacroBar';
import WaterTracker from '../components/WaterTracker';
import StepsTracker from '../components/StepsTracker';
import MealCard from '../components/MealCard';

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, getMealsForDate, getTodayCalories, dailySteps, streak, removeMeal } = useStore();
  
  const today = new Date().toISOString().split('T')[0];
  const todayMeals = getMealsForDate(today);
  const todayCalories = getTodayCalories();
  const burned = Math.round(dailySteps * 0.04);

  if (!profile) return null;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <div className="px-4 pt-12 pb-4 max-w-lg mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-display">
            {greeting()}, {profile.name} 👋
          </h1>
          <p className="text-sm text-gray-400">
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1 bg-secondary-50 px-3 py-1.5 rounded-full">
            <Flame size={16} className="text-secondary-500" />
            <span className="text-sm font-bold text-secondary-600">{streak}</span>
          </div>
        )}
      </motion.div>

      {/* Calorie Circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-6 shadow-card mb-4"
      >
        <div className="flex justify-center mb-4">
          <CircularProgress
            consumed={todayCalories.consumed}
            budget={profile.dailyCalorieBudget}
            burned={burned}
          />
        </div>
        
        <div className="text-center mb-4">
          <p className="text-xs text-gray-400">
            Budget : <span className="font-semibold text-gray-600">{profile.dailyCalorieBudget} kcal</span>
          </p>
        </div>

        {/* Macro Bars */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <MacroBar
            label="Protéines"
            current={todayCalories.protein}
            target={profile.macroTargets.protein_g}
            color="#EF5350"
          />
          <MacroBar
            label="Lipides"
            current={todayCalories.fat}
            target={profile.macroTargets.fat_g}
            color="#FFC107"
          />
          <MacroBar
            label="Glucides"
            current={todayCalories.carbs}
            target={profile.macroTargets.carbs_g}
            color="#FF9800"
          />
          <MacroBar
            label="Fibres"
            current={todayCalories.fiber}
            target={profile.macroTargets.fiber_g}
            color="#4CAF50"
          />
        </div>
      </motion.div>

      {/* Water & Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 gap-3 mb-4"
      >
        <WaterTracker />
        <StepsTracker />
      </motion.div>

      {/* Today's Meals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-800 font-display">Journal du jour</h2>
          <button
            onClick={() => navigate('/journal')}
            className="flex items-center gap-1 text-primary-500 text-sm font-medium"
          >
            <BookOpen size={14} />
            Voir tout
            <ChevronRight size={14} />
          </button>
        </div>

        {todayMeals.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-card text-center">
            <div className="text-4xl mb-3">🍽️</div>
            <p className="text-gray-400 text-sm">Aucun repas enregistré</p>
            <p className="text-gray-300 text-xs mt-1">Scannez votre premier repas !</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayMeals.map(meal => (
              <MealCard key={meal.id} meal={meal} onDelete={removeMeal} />
            ))}
          </div>
        )}
      </motion.div>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        onClick={() => navigate('/scanner')}
        className="fixed bottom-24 right-4 w-14 h-14 bg-primary-500 text-white rounded-full shadow-float flex items-center justify-center hover:bg-primary-600 active:scale-90 transition-all z-40"
      >
        <Plus size={28} />
      </motion.button>
    </div>
  );
}
