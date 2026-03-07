import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import MealCard from '../components/MealCard';

const mealSlots = [
  { type: 'breakfast', label: 'Petit-déjeuner', emoji: '🌅' },
  { type: 'lunch', label: 'Déjeuner', emoji: '☀️' },
  { type: 'snack', label: 'Goûter', emoji: '🍪' },
  { type: 'dinner', label: 'Dîner', emoji: '🌙' },
] as const;

export default function FoodJournal() {
  const navigate = useNavigate();
  const { getMealsForDate, removeMeal, profile } = useStore();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dateStr = selectedDate.toISOString().split('T')[0];
  const meals = getMealsForDate(dateStr);

  const changeDate = (delta: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + delta);
    setSelectedDate(newDate);
  };

  const isToday = dateStr === new Date().toISOString().split('T')[0];

  const totalCalories = meals.reduce((sum, m) => sum + m.totalCalories, 0);
  const totalProtein = meals.reduce((sum, m) => sum + m.totalProtein, 0);
  const totalFat = meals.reduce((sum, m) => sum + m.totalFat, 0);
  const totalCarbs = meals.reduce((sum, m) => sum + m.totalCarbs, 0);
  const totalFiber = meals.reduce((sum, m) => sum + m.totalFiber, 0);

  return (
    <div className="px-4 pt-12 pb-24 max-w-lg mx-auto">
      {/* Date Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => changeDate(-1)}
          className="w-10 h-10 rounded-xl bg-white shadow-card flex items-center justify-center text-gray-400 hover:bg-surface-50 active:scale-90 transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="text-center">
          <h1 className="font-bold text-gray-800 font-display">
            {isToday ? "Aujourd'hui" : selectedDate.toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </h1>
          {!isToday && (
            <p className="text-xs text-gray-400">
              {selectedDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>

        <button
          onClick={() => changeDate(1)}
          className="w-10 h-10 rounded-xl bg-white shadow-card flex items-center justify-center text-gray-400 hover:bg-surface-50 active:scale-90 transition-all"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Meal Slots */}
      <div className="space-y-4">
        {mealSlots.map(slot => {
          const slotMeals = meals.filter(m => m.mealType === slot.type);
          
          return (
            <motion.div
              key={slot.type}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{slot.emoji}</span>
                  <h2 className="font-semibold text-gray-800 text-sm">{slot.label}</h2>
                </div>
                {slotMeals.length > 0 && (
                  <span className="text-xs font-semibold text-secondary-500">
                    {slotMeals.reduce((sum, m) => sum + m.totalCalories, 0)} kcal
                  </span>
                )}
              </div>

              {slotMeals.length > 0 ? (
                <div className="space-y-2">
                  {slotMeals.map(meal => (
                    <MealCard key={meal.id} meal={meal} onDelete={removeMeal} compact />
                  ))}
                </div>
              ) : (
                <button
                  onClick={() => navigate('/scanner')}
                  className="w-full bg-white rounded-xl p-4 shadow-card border-2 border-dashed border-gray-100 flex items-center justify-center gap-2 text-gray-300 hover:border-primary-200 hover:text-primary-400 transition-all"
                >
                  <Plus size={16} />
                  <span className="text-sm">Ajouter un repas</span>
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Daily Summary */}
      {meals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 shadow-card mt-6"
        >
          <h3 className="font-semibold text-gray-800 text-sm mb-3">Résumé du jour</h3>
          <div className="grid grid-cols-5 gap-2 text-center">
            <div>
              <p className="text-lg font-bold text-gray-800">{totalCalories}</p>
              <p className="text-[10px] text-gray-400">kcal</p>
            </div>
            <div>
              <p className="text-lg font-bold text-red-500">{totalProtein}g</p>
              <p className="text-[10px] text-gray-400">Prot.</p>
            </div>
            <div>
              <p className="text-lg font-bold text-yellow-500">{totalFat}g</p>
              <p className="text-[10px] text-gray-400">Lip.</p>
            </div>
            <div>
              <p className="text-lg font-bold text-orange-500">{totalCarbs}g</p>
              <p className="text-[10px] text-gray-400">Gluc.</p>
            </div>
            <div>
              <p className="text-lg font-bold text-green-500">{totalFiber}g</p>
              <p className="text-[10px] text-gray-400">Fibres</p>
            </div>
          </div>
          
          {profile && (
            <div className="mt-3 pt-3 border-t border-gray-50">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Budget restant</span>
                <span className={`font-semibold ${
                  profile.dailyCalorieBudget - totalCalories >= 0 ? 'text-primary-500' : 'text-red-500'
                }`}>
                  {profile.dailyCalorieBudget - totalCalories} kcal
                </span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
