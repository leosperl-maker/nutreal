import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedCard from '../components/AnimatedCard';
import ScrollReveal from '../components/ScrollReveal';
import { ChevronLeft, ChevronRight, Trash2, BookOpen } from 'lucide-react';

const MEAL_LABELS: Record<string, string> = { breakfast: '🌅 Petit-déjeuner', lunch: '☀️ Déjeuner', snack: '🍎 Collation', dinner: '🌙 Dîner' };

export default function FoodJournal() {
  const { meals, removeMeal } = useStore();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const changeDate = (delta: number) => {
    const d = new Date(date); d.setDate(d.getDate() + delta);
    setDate(d.toISOString().split('T')[0]);
  };

  const dayMeals = meals.filter(m => m.date === date);
  const totals = {
    calories: dayMeals.reduce((s, m) => s + m.totalCalories, 0),
    protein: dayMeals.reduce((s, m) => s + m.totalProtein, 0),
    fat: dayMeals.reduce((s, m) => s + m.totalFat, 0),
    carbs: dayMeals.reduce((s, m) => s + m.totalCarbs, 0),
  };

  const grouped = (['breakfast', 'lunch', 'snack', 'dinner'] as const).map(type => ({
    type, label: MEAL_LABELS[type], meals: dayMeals.filter(m => m.mealType === type),
  }));

  return (
    <AnimatedPage className="px-4 pt-12 pb-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-text-primary font-display mb-4">Journal alimentaire</h1>

      {/* Date nav */}
      <div className="flex items-center justify-between mb-4">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => changeDate(-1)}
          className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-card">
          <ChevronLeft size={20} className="text-text-secondary" />
        </motion.button>
        <div className="text-center">
          <p className="text-sm font-semibold text-text-primary">
            {new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          {date === new Date().toISOString().split('T')[0] && <span className="text-xs text-primary-500 font-medium">Aujourd'hui</span>}
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => changeDate(1)}
          className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-card">
          <ChevronRight size={20} className="text-text-secondary" />
        </motion.button>
      </div>

      {/* Totals */}
      {dayMeals.length > 0 && (
        <ScrollReveal>
          <AnimatedCard className="p-4 mb-4">
            <div className="grid grid-cols-4 text-center gap-2">
              {[{ l: 'Calories', v: totals.calories, u: 'kcal', c: 'text-primary-500' },
                { l: 'Prot.', v: Math.round(totals.protein), u: 'g', c: 'text-primary-400' },
                { l: 'Gluc.', v: Math.round(totals.carbs), u: 'g', c: 'text-warning-300' },
                { l: 'Lip.', v: Math.round(totals.fat), u: 'g', c: 'text-error-300' }].map(s => (
                <div key={s.l}>
                  <p className={`text-lg font-bold ${s.c}`}>{s.v}</p>
                  <p className="text-[10px] text-text-muted">{s.l}</p>
                </div>
              ))}
            </div>
          </AnimatedCard>
        </ScrollReveal>
      )}

      {/* Meals by slot */}
      {dayMeals.length === 0 ? (
        <AnimatedCard className="p-8 text-center">
          <BookOpen size={32} className="text-text-muted mx-auto mb-2" />
          <p className="text-sm text-text-secondary">Aucun repas ce jour</p>
        </AnimatedCard>
      ) : (
        <div className="space-y-4">
          {grouped.filter(g => g.meals.length > 0).map((g, gi) => (
            <ScrollReveal key={g.type} delay={gi * 0.05}>
              <h3 className="text-xs font-semibold text-text-secondary mb-2">{g.label}</h3>
              <div className="space-y-2">
                {g.meals.map((meal, mi) => (
                  <AnimatedCard key={meal.id} className="p-3" index={mi}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-text-primary">{meal.dishName}</p>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => removeMeal(meal.id)}
                        className="w-7 h-7 bg-error-50 rounded-lg flex items-center justify-center">
                        <Trash2 size={12} className="text-error-300" />
                      </motion.button>
                    </div>
                    <div className="flex gap-3 text-xs text-text-muted">
                      <span className="font-medium text-primary-500">{meal.totalCalories} kcal</span>
                      <span>P:{Math.round(meal.totalProtein)}g</span>
                      <span>G:{Math.round(meal.totalCarbs)}g</span>
                      <span>L:{Math.round(meal.totalFat)}g</span>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}
    </AnimatedPage>
  );
}
