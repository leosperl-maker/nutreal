import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import ScrollReveal from '../components/ScrollReveal';
import SuccessCheckmark from '../components/SuccessCheckmark';
import { CalendarDays, ChefHat, ShoppingCart, Check, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const SLOT_LABELS: Record<string, string> = { breakfast: '🌅 Petit-déj', lunch: '☀️ Déjeuner', snack: '🍎 Collation', dinner: '🌙 Dîner' };

const SAMPLE_OPTIONS = [
  { name: 'Colombo de poulet', ingredients: ['poulet', 'riz', 'lait de coco', 'colombo', 'oignon', 'ail', 'pomme de terre'], calories: 520, protein_g: 35, fat_g: 18, carbs_g: 55, fiber_g: 4, imageUrl: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Salade de thon', ingredients: ['thon', 'salade', 'tomate', 'concombre', 'huile d\'olive', 'citron'], calories: 320, protein_g: 28, fat_g: 15, carbs_g: 12, fiber_g: 5, imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Bowl quinoa légumes', ingredients: ['quinoa', 'avocat', 'tomate', 'concombre', 'pois chiche', 'citron'], calories: 450, protein_g: 18, fat_g: 20, carbs_g: 50, fiber_g: 10, imageUrl: 'https://images.pexels.com/photos/1095550/pexels-photo-1095550.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

export default function MealPlanPage() {
  const { profile, mealPlan, setMealPlan, selectMealOption, validateMealPlan, toggleGroceryItem, showToast } = useStore();
  const [expandedDay, setExpandedDay] = useState(0);
  const [showGrocery, setShowGrocery] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [validated, setValidated] = useState(false);

  const generatePlan = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1500));
    const today = new Date();
    const monday = new Date(today); monday.setDate(today.getDate() - today.getDay() + 1);
    const days = DAYS.map((name, i) => {
      const d = new Date(monday); d.setDate(monday.getDate() + i);
      return {
        date: d.toISOString().split('T')[0], dayName: name,
        slots: (['breakfast', 'lunch', 'snack', 'dinner'] as const).map(type => ({
          type, options: SAMPLE_OPTIONS.map(o => ({ ...o })), selectedIndex: null,
        })),
      };
    });
    setMealPlan({ weekStart: monday.toISOString().split('T')[0], days, calorieBudget: profile?.dailyCalorieBudget || 2000, validated: false, recipes: [], groceryList: [] });
    setGenerating(false); showToast('Plan repas généré ! 🍽️');
  };

  const handleValidate = () => {
    validateMealPlan();
    setValidated(true);
    showToast('Plan validé ! Liste de courses prête 🛒');
    setTimeout(() => setValidated(false), 2000);
  };

  if (!mealPlan) {
    return (
      <AnimatedPage className="px-4 pt-12 pb-4 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-text-primary font-display mb-6">Plan repas</h1>
        <AnimatedCard className="p-8 text-center">
          <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <CalendarDays size={32} className="text-primary-500" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">Planifiez votre semaine</h3>
          <p className="text-sm text-text-secondary mb-6">Nutreal génère un plan personnalisé selon vos objectifs et préférences.</p>
          <AnimatedButton onClick={generatePlan} disabled={generating} className="px-8 py-3 text-sm flex items-center justify-center gap-2 mx-auto">
            {generating ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Sparkles size={18} /></motion.div> : <ChefHat size={18} />}
            {generating ? 'Génération...' : 'Générer mon plan'}
          </AnimatedButton>
        </AnimatedCard>
      </AnimatedPage>
    );
  }

  const grouped = mealPlan.groceryList.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof mealPlan.groceryList>);

  return (
    <AnimatedPage className="px-4 pt-12 pb-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-text-primary font-display">Plan repas</h1>
        <div className="flex gap-2">
          {mealPlan.validated && (
            <AnimatedButton variant="secondary" onClick={() => setShowGrocery(!showGrocery)} className="px-3 py-2 text-xs flex items-center gap-1">
              <ShoppingCart size={14} /> Courses
            </AnimatedButton>
          )}
          <AnimatedButton onClick={generatePlan} variant="ghost" className="px-3 py-2 text-xs">Régénérer</AnimatedButton>
        </div>
      </div>

      <AnimatePresence>
        {showGrocery && mealPlan.validated && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <AnimatedCard className="p-4 mb-4">
              <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                <ShoppingCart size={16} className="text-primary-500" /> Liste de courses
              </h3>
              {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat} className="mb-3">
                  <p className="text-xs font-semibold text-text-secondary mb-1">{cat}</p>
                  {items.map((item, i) => {
                    const idx = mealPlan.groceryList.indexOf(item);
                    return (
                      <motion.div key={i} whileTap={{ scale: 0.98 }} onClick={() => toggleGroceryItem(idx)}
                        className={`flex items-center gap-2 py-1.5 cursor-pointer ${item.checked ? 'opacity-50' : ''}`}>
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${item.checked ? 'bg-success-400 border-success-400' : 'border-surface-300'}`}>
                          {item.checked && <Check size={12} className="text-white" />}
                        </div>
                        <span className={`text-sm flex-1 ${item.checked ? 'line-through text-text-muted' : 'text-text-primary'}`}>{item.name}</span>
                        <span className="text-xs text-text-muted">{item.quantity} {item.unit}</span>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </AnimatedCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Days */}
      <div className="space-y-3">
        {mealPlan.days.map((day, di) => (
          <ScrollReveal key={di} delay={di * 0.05}>
            <AnimatedCard className="overflow-hidden">
              <button onClick={() => setExpandedDay(expandedDay === di ? -1 : di)}
                className="w-full p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-text-primary">{day.dayName}</p>
                  <p className="text-xs text-text-muted">{day.date}</p>
                </div>
                {expandedDay === di ? <ChevronUp size={18} className="text-text-muted" /> : <ChevronDown size={18} className="text-text-muted" />}
              </button>
              <AnimatePresence>
                {expandedDay === di && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }} className="overflow-hidden">
                    <div className="px-4 pb-4 space-y-3">
                      {day.slots.map((slot, si) => (
                        <div key={si}>
                          <p className="text-xs font-semibold text-text-secondary mb-2">{SLOT_LABELS[slot.type]}</p>
                          <div className="space-y-2">
                            {slot.options.map((opt, oi) => (
                              <motion.button key={oi} whileTap={{ scale: 0.98 }}
                                onClick={() => selectMealOption(di, si, oi)}
                                className={`w-full p-3 rounded-xl text-left flex items-center gap-3 transition-all ${slot.selectedIndex === oi ? 'bg-primary-500 text-white shadow-float' : 'bg-surface-100'}`}>
                                <img src={opt.imageUrl} alt={opt.name} className="w-12 h-12 rounded-lg object-cover" />
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium truncate ${slot.selectedIndex === oi ? 'text-white' : 'text-text-primary'}`}>{opt.name}</p>
                                  <p className={`text-xs ${slot.selectedIndex === oi ? 'text-white/70' : 'text-text-muted'}`}>{opt.calories} kcal · P:{opt.protein_g}g</p>
                                </div>
                                {slot.selectedIndex === oi && <Check size={18} />}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </AnimatedCard>
          </ScrollReveal>
        ))}
      </div>

      {/* Validate */}
      {!mealPlan.validated && (
        <div className="mt-6">
          <AnimatedButton onClick={handleValidate} className="w-full py-3.5 text-sm flex items-center justify-center gap-2" variant="success">
            <Check size={18} /> Valider le plan
          </AnimatedButton>
        </div>
      )}

      <AnimatePresence>
        {validated && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-8 text-center mx-4">
              <SuccessCheckmark size={64} />
              <p className="text-lg font-semibold text-text-primary mt-4">Plan validé !</p>
              <p className="text-sm text-text-secondary mt-1">Votre liste de courses est prête</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}
