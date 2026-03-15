import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import type { Meal } from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedCard from '../components/AnimatedCard';
import ScrollReveal from '../components/ScrollReveal';
import Icon3D from '../components/Icon3D';
import { ChevronLeft, ChevronRight, Trash2, BookOpen, Camera, Barcode, PenLine, UtensilsCrossed, Pencil, X, Check } from 'lucide-react';

const MEAL_LABELS: Record<string, { label: string; icon: string }> = {
  breakfast: { label: 'Petit-déjeuner', icon: 'sunrise' },
  lunch: { label: 'Déjeuner', icon: 'sun' },
  snack: { label: 'Collation', icon: 'redApple' },
  dinner: { label: 'Dîner', icon: 'crescentMoon' },
};

const MOOD_OPTIONS: Meal['moodRating'][] = ['😋', '😊', '😐', '😕', '🤢'];
const MOOD_LABELS: Record<string, string> = { '😋': 'Délicieux', '😊': 'Bon', '😐': 'Correct', '😕': 'Bof', '🤢': 'Mauvais' };

const SOURCE_BADGE: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  photo: { icon: <Camera size={10} />, label: 'Photo IA', color: 'bg-primary-50 text-primary-500' },
  barcode: { icon: <Barcode size={10} />, label: 'Code-barres', color: 'bg-primary-50 text-primary-600' },
  manual: { icon: <PenLine size={10} />, label: 'Manuel', color: 'bg-amber-50 text-amber-600' },
  meal_plan: { icon: <UtensilsCrossed size={10} />, label: 'Plan repas', color: 'bg-green-50 text-green-600' },
};

function getNutriScore(meal: Meal): { grade: 'A' | 'B' | 'C' | 'D' | 'E'; color: string } {
  let score = 0;
  if (meal.totalProtein >= 25) score += 2;
  else if (meal.totalProtein >= 15) score += 1;
  if (meal.totalFiber >= 5) score += 2;
  else if (meal.totalFiber >= 2) score += 1;
  if (meal.totalCalories > 800) score -= 2;
  else if (meal.totalCalories > 600) score -= 1;
  if (meal.totalFat > 30) score -= 1;
  const grade = score >= 3 ? 'A' : score === 2 ? 'B' : score === 1 ? 'C' : score === 0 ? 'D' : 'E';
  const color = { A: 'bg-green-500', B: 'bg-lime-500', C: 'bg-yellow-400', D: 'bg-orange-500', E: 'bg-red-600' }[grade];
  return { grade, color };
}

export default function FoodJournal() {
  const { meals, removeMeal, updateMeal } = useStore();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState<Meal['mealType']>('lunch');

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
    type, ...MEAL_LABELS[type], meals: dayMeals.filter(m => m.mealType === type),
  }));

  const startEdit = (meal: Meal) => {
    setEditingId(meal.id);
    setEditName(meal.dishName);
    setEditType(meal.mealType);
  };

  const commitEdit = (id: string) => {
    if (editName.trim()) updateMeal(id, { dishName: editName.trim(), mealType: editType });
    setEditingId(null);
  };

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
              <h3 className="font-display text-xs font-semibold text-text-secondary mb-2 flex items-center gap-1">
                <Icon3D name={g.icon} size={14} /> {g.label}
              </h3>
              <div className="space-y-2">
                {g.meals.map((meal, mi) => {
                  const nutri = getNutriScore(meal);
                  const src = meal.source ? SOURCE_BADGE[meal.source] : null;
                  const isEditing = editingId === meal.id;
                  return (
                    <AnimatedCard key={meal.id} className="p-3" index={mi}>
                      {/* Header row */}
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <input
                              value={editName}
                              onChange={e => setEditName(e.target.value)}
                              className="w-full text-sm font-semibold text-text-primary border-b border-primary-300 bg-transparent outline-none pb-0.5"
                              autoFocus
                            />
                          ) : (
                            <p className="text-sm font-semibold text-text-primary truncate">{meal.dishName}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {isEditing ? (
                            <>
                              <motion.button whileTap={{ scale: 0.9 }} onClick={() => commitEdit(meal.id)}
                                className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
                                <Check size={12} className="text-green-600" />
                              </motion.button>
                              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setEditingId(null)}
                                className="w-7 h-7 bg-surface-100 rounded-lg flex items-center justify-center">
                                <X size={12} className="text-text-muted" />
                              </motion.button>
                            </>
                          ) : (
                            <>
                              <motion.button whileTap={{ scale: 0.9 }} onClick={() => startEdit(meal)}
                                className="w-7 h-7 bg-surface-50 rounded-lg flex items-center justify-center">
                                <Pencil size={11} className="text-text-muted" />
                              </motion.button>
                              <motion.button whileTap={{ scale: 0.9 }} onClick={() => removeMeal(meal.id)}
                                className="w-7 h-7 bg-error-50 rounded-lg flex items-center justify-center">
                                <Trash2 size={12} className="text-error-300" />
                              </motion.button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Meal type selector when editing */}
                      <AnimatePresence>
                        {isEditing && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            className="flex gap-1.5 mb-2 overflow-hidden">
                            {(['breakfast', 'lunch', 'snack', 'dinner'] as const).map(t => (
                              <button key={t} onClick={() => setEditType(t)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${editType === t ? 'bg-primary-500 text-white' : 'bg-surface-100 text-text-muted'}`}>
                                {MEAL_LABELS[t].label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Macros + badges row */}
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="text-xs font-medium text-primary-500">{meal.totalCalories} kcal</span>
                        <span className="text-xs text-text-muted">P:{Math.round(meal.totalProtein)}g</span>
                        <span className="text-xs text-text-muted">G:{Math.round(meal.totalCarbs)}g</span>
                        <span className="text-xs text-text-muted">L:{Math.round(meal.totalFat)}g</span>
                        {/* NutriScore badge */}
                        <span className={`ml-auto text-[10px] font-black text-white px-1.5 py-0.5 rounded-md ${nutri.color}`}>
                          {nutri.grade}
                        </span>
                        {/* Source badge */}
                        {src && (
                          <span className={`flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${src.color}`}>
                            {src.icon} {src.label}
                          </span>
                        )}
                      </div>

                      {/* Mood selector */}
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-text-muted mr-1">Ressenti :</span>
                        {MOOD_OPTIONS.map(emoji => (
                          <motion.button key={emoji} whileTap={{ scale: 0.85 }}
                            onClick={() => updateMeal(meal.id, { moodRating: meal.moodRating === emoji ? undefined : emoji })}
                            className={`text-base transition-all ${meal.moodRating === emoji ? 'scale-125 opacity-100' : 'opacity-40 hover:opacity-70'}`}
                            title={MOOD_LABELS[emoji!]}>
                            {emoji}
                          </motion.button>
                        ))}
                      </div>

                      {/* AI tip if present */}
                      {meal.aiTip && (
                        <p className="text-[10px] text-text-muted mt-1.5 italic border-t border-surface-100 pt-1.5 leading-relaxed">
                          {meal.aiTip}
                        </p>
                      )}
                    </AnimatedCard>
                  );
                })}
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}
    </AnimatedPage>
  );
}
