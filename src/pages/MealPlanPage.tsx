import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import type { MealPlanDay, MealPlanOption } from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import ScrollReveal from '../components/ScrollReveal';
import SuccessCheckmark from '../components/SuccessCheckmark';
import { CalendarDays, ChefHat, ShoppingCart, Check, ChevronDown, ChevronUp, Sparkles, Cpu } from 'lucide-react';
import { generateMealPlanWithGemini, isGeminiConfigured } from '../lib/gemini';

const SLOT_LABELS: Record<string, string> = {
  breakfast: '🌅 Petit-déj',
  lunch: '☀️ Déjeuner',
  snack: '🍎 Collation',
  dinner: '🌙 Dîner',
};

// ─── Banques de plats variés ───────────────────────────────────────────────
const IMG = {
  chicken: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400',
  salad:   'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
  bowl:    'https://images.pexels.com/photos/1095550/pexels-photo-1095550.jpeg?auto=compress&cs=tinysrgb&w=400',
  eggs:    'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=400',
  fish:    'https://images.pexels.com/photos/1640769/pexels-photo-1640769.jpeg?auto=compress&cs=tinysrgb&w=400',
  smoothie:'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400',
  misc:    'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400',
  grains:  'https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg?auto=compress&cs=tinysrgb&w=400',
  curry:   'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=400',
  fruits:  'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400',
};

type PoolItem = Omit<MealPlanOption, 'recipe'>;

const BREAKFAST_POOL: PoolItem[] = [
  { name: 'Granola fruits tropicaux', ingredients: ['granola', 'yaourt nature', 'mangue', 'ananas', 'noix de coco'], calories: 380, protein_g: 14, fat_g: 12, carbs_g: 55, fiber_g: 6, imageUrl: IMG.salad },
  { name: 'Œufs brouillés banane plantain', ingredients: ['œufs', 'banane plantain', 'tomate', 'oignon', 'huile'], calories: 420, protein_g: 22, fat_g: 18, carbs_g: 38, fiber_g: 4, imageUrl: IMG.eggs },
  { name: 'Smoothie mangue papaye', ingredients: ['mangue', 'papaye', 'banane', 'lait de coco', 'gingembre'], calories: 280, protein_g: 4, fat_g: 6, carbs_g: 58, fiber_g: 5, imageUrl: IMG.smoothie },
  { name: 'Pain créole beurre goyave', ingredients: ['pain créole', 'beurre', 'confiture de goyave', 'jus de fruits'], calories: 350, protein_g: 7, fat_g: 14, carbs_g: 50, fiber_g: 2, imageUrl: IMG.misc },
  { name: 'Oatmeal banane noix cajou', ingredients: ['avoine', 'lait', 'banane', 'miel', 'noix de cajou'], calories: 390, protein_g: 12, fat_g: 10, carbs_g: 65, fiber_g: 7, imageUrl: IMG.grains },
  { name: 'Bol açaï fruits tropicaux', ingredients: ['açaï', 'ananas', 'mangue', 'granola', 'miel'], calories: 340, protein_g: 8, fat_g: 11, carbs_g: 54, fiber_g: 8, imageUrl: IMG.fruits },
  { name: 'Pancakes farine banane', ingredients: ['banane', 'farine', 'œuf', 'lait', 'sirop de canne'], calories: 430, protein_g: 10, fat_g: 9, carbs_g: 78, fiber_g: 3, imageUrl: IMG.eggs },
  { name: 'Yaourt noix de coco mangue', ingredients: ['yaourt grec', 'noix de coco râpée', 'mangue fraîche', 'miel'], calories: 290, protein_g: 16, fat_g: 10, carbs_g: 35, fiber_g: 2, imageUrl: IMG.fruits },
  { name: 'Bokit végétarien œuf avocat', ingredients: ['pain bokit', 'œuf', 'salade', 'tomate', 'avocat'], calories: 480, protein_g: 18, fat_g: 20, carbs_g: 55, fiber_g: 5, imageUrl: IMG.misc },
  { name: 'Tartines avocado citron', ingredients: ['pain complet', 'avocat', 'citron', 'graines de sésame', 'œuf poché'], calories: 400, protein_g: 15, fat_g: 22, carbs_g: 38, fiber_g: 7, imageUrl: IMG.eggs },
  { name: 'Smoothie bowl épinards banane', ingredients: ['épinard', 'banane', 'lait végétal', 'chia', 'fruits rouges'], calories: 310, protein_g: 9, fat_g: 7, carbs_g: 55, fiber_g: 9, imageUrl: IMG.smoothie },
];

const LUNCH_POOL: PoolItem[] = [
  { name: 'Colombo de poulet', ingredients: ['poulet', 'riz', 'lait de coco', 'colombo', 'oignon', 'ail', 'pomme de terre'], calories: 520, protein_g: 35, fat_g: 18, carbs_g: 55, fiber_g: 4, imageUrl: IMG.chicken },
  { name: 'Court-bouillon de poisson', ingredients: ['poisson', 'tomate', 'oignon', 'ail', 'citron', 'piment', 'igname'], calories: 440, protein_g: 38, fat_g: 12, carbs_g: 42, fiber_g: 5, imageUrl: IMG.fish },
  { name: 'Salade de thon avocat', ingredients: ['thon', 'avocat', 'salade', 'tomate', 'concombre', 'citron'], calories: 380, protein_g: 30, fat_g: 22, carbs_g: 12, fiber_g: 7, imageUrl: IMG.salad },
  { name: 'Riz pois + poulet boucané', ingredients: ['riz', 'haricots rouges', 'poulet fumé', 'thym', 'oignon', 'ail'], calories: 580, protein_g: 32, fat_g: 15, carbs_g: 72, fiber_g: 10, imageUrl: IMG.grains },
  { name: 'Bowl quinoa légumes créole', ingredients: ['quinoa', 'avocat', 'christophine', 'tomate', 'pois chiche', 'citron'], calories: 450, protein_g: 18, fat_g: 20, carbs_g: 50, fiber_g: 10, imageUrl: IMG.bowl },
  { name: 'Gratin de christophine', ingredients: ['christophine', 'fromage', 'crème', 'oignon', 'thym', 'pain de mie'], calories: 410, protein_g: 16, fat_g: 22, carbs_g: 35, fiber_g: 6, imageUrl: IMG.misc },
  { name: 'Soupe de giraumon lait coco', ingredients: ['giraumon', 'lait de coco', 'oignon', 'gingembre', 'pain'], calories: 300, protein_g: 6, fat_g: 10, carbs_g: 45, fiber_g: 6, imageUrl: IMG.smoothie },
  { name: 'Poulet rôti patate douce', ingredients: ['poulet', 'patate douce', 'herbes créoles', 'citron', 'ail'], calories: 530, protein_g: 40, fat_g: 18, carbs_g: 46, fiber_g: 5, imageUrl: IMG.chicken },
  { name: 'Carry de lentilles créole', ingredients: ['lentilles', 'tomate', 'oignon', 'curry', 'gingembre', 'riz'], calories: 480, protein_g: 22, fat_g: 8, carbs_g: 80, fiber_g: 14, imageUrl: IMG.curry },
  { name: 'Accras morue + salade verte', ingredients: ['morue', 'farine', 'œuf', 'piment', 'ciboulette', 'salade'], calories: 420, protein_g: 24, fat_g: 18, carbs_g: 38, fiber_g: 4, imageUrl: IMG.fish },
  { name: 'Fricassée de champignons riz', ingredients: ['champignons', 'oignon', 'ail', 'persil', 'huile', 'riz'], calories: 360, protein_g: 10, fat_g: 14, carbs_g: 48, fiber_g: 8, imageUrl: IMG.misc },
];

const SNACK_POOL: PoolItem[] = [
  { name: 'Fruits tropicaux frais', ingredients: ['mangue', 'ananas', 'papaye'], calories: 150, protein_g: 2, fat_g: 0.5, carbs_g: 38, fiber_g: 4, imageUrl: IMG.fruits },
  { name: 'Yaourt grec miel noix cajou', ingredients: ['yaourt grec', 'miel', 'noix de cajou'], calories: 200, protein_g: 14, fat_g: 9, carbs_g: 18, fiber_g: 1, imageUrl: IMG.misc },
  { name: 'Mélange noix raisins coco', ingredients: ['noix de cajou', 'amande', 'raisins secs', 'noix de coco'], calories: 220, protein_g: 6, fat_g: 14, carbs_g: 22, fiber_g: 3, imageUrl: IMG.grains },
  { name: 'Smoothie vert ananas épinard', ingredients: ['épinard', 'ananas', 'banane', 'gingembre', 'eau de coco'], calories: 180, protein_g: 4, fat_g: 1, carbs_g: 42, fiber_g: 5, imageUrl: IMG.smoothie },
  { name: 'Banane beurre de cacahuète', ingredients: ['banane', 'beurre de cacahuète'], calories: 230, protein_g: 7, fat_g: 9, carbs_g: 32, fiber_g: 3, imageUrl: IMG.fruits },
  { name: 'Galettes de riz houmous carotte', ingredients: ['galettes de riz', 'houmous', 'carotte'], calories: 190, protein_g: 6, fat_g: 7, carbs_g: 28, fiber_g: 4, imageUrl: IMG.bowl },
  { name: 'Ananas coco citron vert', ingredients: ['ananas', 'noix de coco fraîche', 'citron vert', 'menthe'], calories: 140, protein_g: 2, fat_g: 5, carbs_g: 24, fiber_g: 3, imageUrl: IMG.fruits },
  { name: 'Bâtonnets légumes + dip avocat', ingredients: ['carotte', 'concombre', 'avocat', 'citron', 'ail'], calories: 170, protein_g: 3, fat_g: 10, carbs_g: 16, fiber_g: 5, imageUrl: IMG.salad },
];

const DINNER_POOL: PoolItem[] = [
  { name: 'Rougail morue riz blanc', ingredients: ['morue', 'tomate', 'oignon', 'ail', 'piment', 'riz'], calories: 490, protein_g: 36, fat_g: 14, carbs_g: 55, fiber_g: 5, imageUrl: IMG.fish },
  { name: 'Poisson grillé légumes vapeur', ingredients: ['poisson entier', 'courgette', 'poivron', 'tomate', 'herbes créoles'], calories: 380, protein_g: 40, fat_g: 12, carbs_g: 18, fiber_g: 6, imageUrl: IMG.fish },
  { name: 'Dombrés aux crevettes', ingredients: ['crevettes', 'farine', 'haricots rouges', 'oignon', 'ail', 'piment'], calories: 510, protein_g: 32, fat_g: 10, carbs_g: 68, fiber_g: 9, imageUrl: IMG.curry },
  { name: 'Poulet massalé haricots verts', ingredients: ['poulet', 'massalé', 'haricots verts', 'oignon', 'ail', 'riz'], calories: 540, protein_g: 38, fat_g: 20, carbs_g: 50, fiber_g: 8, imageUrl: IMG.chicken },
  { name: 'Poisson en papillote riz brun', ingredients: ['poisson', 'légumes', 'citron', 'herbes', 'riz brun'], calories: 420, protein_g: 38, fat_g: 10, carbs_g: 44, fiber_g: 5, imageUrl: IMG.fish },
  { name: 'Carry aubergines végétarien', ingredients: ['aubergine', 'tomate', 'oignon', 'curry', 'lait de coco', 'riz'], calories: 390, protein_g: 10, fat_g: 14, carbs_g: 58, fiber_g: 10, imageUrl: IMG.curry },
  { name: 'Féroce avocat morue', ingredients: ['avocat', 'morue', 'farine de manioc', 'piment', 'citron'], calories: 460, protein_g: 28, fat_g: 26, carbs_g: 30, fiber_g: 8, imageUrl: IMG.salad },
  { name: 'Poulet grillé patate douce brocoli', ingredients: ['poulet', 'patate douce', 'brocoli', 'herbes', 'citron'], calories: 520, protein_g: 42, fat_g: 14, carbs_g: 52, fiber_g: 7, imageUrl: IMG.chicken },
  { name: 'Bowl quinoa crevettes avocat', ingredients: ['quinoa', 'crevettes', 'avocat', 'concombre', 'citron'], calories: 470, protein_g: 30, fat_g: 18, carbs_g: 48, fiber_g: 6, imageUrl: IMG.bowl },
  { name: 'Soupe pois d\'angole igname', ingredients: ['pois d\'angole', 'igname', 'giraumon', 'oignon', 'herbes créoles'], calories: 380, protein_g: 18, fat_g: 6, carbs_g: 65, fiber_g: 14, imageUrl: IMG.smoothie },
  { name: 'Fricassée lambi riz créole', ingredients: ['lambi', 'oignon', 'ail', 'piment', 'citron', 'riz créole'], calories: 500, protein_g: 35, fat_g: 12, carbs_g: 60, fiber_g: 5, imageUrl: IMG.curry },
];

// ─── Utilitaires ────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getThreeDistinct<T>(pool: T[], dayIndex: number): T[] {
  const shuffled = shuffle(pool);
  return [
    shuffled[dayIndex % shuffled.length],
    shuffled[(dayIndex + Math.floor(shuffled.length / 3)) % shuffled.length],
    shuffled[(dayIndex + Math.floor(shuffled.length * 2 / 3)) % shuffled.length],
  ];
}

function getMealPrice(name: string, ingredients: string[]): number {
  const n = name.toLowerCase();
  const hasSeafood = ['crevette', 'langouste', 'homard', 'lambi'].some(w => n.includes(w));
  const hasFish = ['morue', 'poisson', 'thon', 'saumon'].some(w => n.includes(w));
  const base = 1.50 + ingredients.length * 0.18;
  const multiplier = hasSeafood ? 2.1 : hasFish ? 1.5 : 1.1;
  const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return Math.round((base * multiplier + (hash % 10) * 0.08) * 100) / 100;
}

function getImageForDish(name: string, type: string): string {
  const n = name.toLowerCase();
  if (['poisson', 'morue', 'thon', 'saumon', 'lambi', 'crevette'].some(w => n.includes(w))) return IMG.fish;
  if (['poulet', 'bœuf', 'colombo', 'massalé', 'boucané'].some(w => n.includes(w))) return IMG.chicken;
  if (['curry', 'carry', 'dombrés', 'rougail'].some(w => n.includes(w))) return IMG.curry;
  if (['smoothie', 'soupe', 'bouillon'].some(w => n.includes(w))) return IMG.smoothie;
  if (['bowl', 'quinoa', 'salade'].some(w => n.includes(w))) return n.includes('thon') ? IMG.fish : IMG.bowl;
  if (['œuf', 'omelette', 'bokit', 'pancake', 'toast'].some(w => n.includes(w))) return IMG.eggs;
  if (['fruits', 'ananas', 'mangue', 'banane', 'açaï'].some(w => n.includes(w))) return IMG.fruits;
  if (type === 'breakfast') return IMG.eggs;
  if (type === 'snack') return IMG.fruits;
  return IMG.misc;
}

function generateLocalVariedPlan(monday: Date, calorieBudget: number): MealPlanDay[] {
  const DAYS_FR = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  return DAYS_FR.map((dayName, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const toOptions = (items: PoolItem[]): MealPlanOption[] =>
      items.map(opt => ({ ...opt, price: getMealPrice(opt.name, opt.ingredients) }));
    return {
      date: d.toISOString().split('T')[0],
      dayName,
      slots: [
        { type: 'breakfast', options: toOptions(getThreeDistinct(BREAKFAST_POOL, i)), selectedIndex: null },
        { type: 'lunch',     options: toOptions(getThreeDistinct(LUNCH_POOL,     i)), selectedIndex: null },
        { type: 'snack',     options: toOptions(getThreeDistinct(SNACK_POOL,     i)), selectedIndex: null },
        { type: 'dinner',    options: toOptions(getThreeDistinct(DINNER_POOL,    i)), selectedIndex: null },
      ],
    };
  });
}

// ─── Composant ──────────────────────────────────────────────────────────────
export default function MealPlanPage() {
  const { profile, mealPlan, setMealPlan, selectMealOption, validateMealPlan, toggleGroceryItem, showToast } = useStore();
  const [expandedDay, setExpandedDay] = useState(0);
  const [showGrocery, setShowGrocery] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [usingAI, setUsingAI] = useState(false);
  const [validated, setValidated] = useState(false);

  const generatePlan = async () => {
    setGenerating(true);
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

    let days: MealPlanDay[];

    // Essaye l'API Gemini si configurée
    if (isGeminiConfigured() && profile) {
      setUsingAI(true);
      try {
        const geminiResult = await generateMealPlanWithGemini({
          location: profile.location || 'guadeloupe',
          calories: profile.dailyCalorieBudget,
          protein: profile.macroTargets.protein_g,
          carbs: profile.macroTargets.carbs_g,
          fat: profile.macroTargets.fat_g,
          preferences: profile.foodPreferences || [],
          dietPreferences: profile.dietPreferences || [],
        });

        if (geminiResult && geminiResult.length === 7) {
          days = geminiResult.map((day, i) => {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            return {
              date: d.toISOString().split('T')[0],
              dayName: day.dayName,
              slots: day.slots.map(slot => ({
                type: slot.type,
                selectedIndex: null,
                options: slot.options.slice(0, 3).map(opt => ({
                  name: opt.name,
                  ingredients: opt.ingredients,
                  calories: opt.calories,
                  protein_g: opt.protein_g,
                  fat_g: opt.fat_g,
                  carbs_g: opt.carbs_g,
                  fiber_g: opt.fiber_g,
                  imageUrl: getImageForDish(opt.name, slot.type),
                  price: getMealPrice(opt.name, opt.ingredients),
                })),
              })),
            };
          });
          setMealPlan({
            weekStart: monday.toISOString().split('T')[0],
            days,
            calorieBudget: profile?.dailyCalorieBudget || 2000,
            validated: false, recipes: [], groceryList: [],
          });
          setGenerating(false);
          setUsingAI(false);
          showToast('Plan personnalisé par IA ! 🤖🍽️');
          return;
        }
      } catch (_) { /* fall through */ }
      setUsingAI(false);
    }

    // Fallback local varié
    days = generateLocalVariedPlan(monday, profile?.dailyCalorieBudget || 2000);
    setMealPlan({
      weekStart: monday.toISOString().split('T')[0],
      days,
      calorieBudget: profile?.dailyCalorieBudget || 2000,
      validated: false, recipes: [], groceryList: [],
    });
    setGenerating(false);
    showToast('Plan repas généré ! 🍽️');
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
          <p className="text-sm text-text-secondary mb-2">
            Nutreal génère un plan personnalisé selon vos objectifs et préférences.
          </p>
          {isGeminiConfigured() && (
            <p className="text-xs text-primary-400 mb-6 flex items-center justify-center gap-1">
              <Cpu size={12} /> Propulsé par Gemini IA
            </p>
          )}
          <AnimatedButton onClick={generatePlan} disabled={generating} className="px-8 py-3 text-sm flex items-center justify-center gap-2 mx-auto">
            {generating
              ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Sparkles size={18} /></motion.div>
              : <ChefHat size={18} />}
            {generating ? (usingAI ? 'IA en cours...' : 'Génération...') : 'Générer mon plan'}
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
          <AnimatedButton onClick={generatePlan} variant="ghost" className="px-3 py-2 text-xs flex items-center gap-1" disabled={generating}>
            {generating
              ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }}><Sparkles size={12} /></motion.div>
              : <ChefHat size={12} />}
            Régénérer
          </AnimatedButton>
        </div>
      </div>

      {/* Liste de courses */}
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
                  {items.map((item) => {
                    const idx = mealPlan.groceryList.indexOf(item);
                    return (
                      <motion.div key={idx} whileTap={{ scale: 0.98 }} onClick={() => toggleGroceryItem(idx)}
                        className={`flex items-center gap-2 py-1.5 cursor-pointer ${item.checked ? 'opacity-50' : ''}`}>
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${item.checked ? 'bg-success-400 border-success-400' : 'border-surface-300'}`}>
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

      {/* Jours */}
      <div className="space-y-3">
        {mealPlan.days.map((day, di) => (
          <ScrollReveal key={di} delay={di * 0.04}>
            <AnimatedCard className="overflow-hidden">
              <button onClick={() => setExpandedDay(expandedDay === di ? -1 : di)}
                className="w-full p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-text-primary">{day.dayName}</p>
                  <p className="text-xs text-text-muted">{new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</p>
                </div>
                {expandedDay === di
                  ? <ChevronUp size={18} className="text-text-muted" />
                  : <ChevronDown size={18} className="text-text-muted" />}
              </button>

              <AnimatePresence>
                {expandedDay === di && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                    <div className="px-4 pb-4 space-y-4">
                      {day.slots.map((slot, si) => (
                        <div key={si}>
                          <p className="text-xs font-semibold text-text-secondary mb-2">{SLOT_LABELS[slot.type]}</p>
                          <div className="space-y-2">
                            {slot.options.map((opt, oi) => {
                              const isSelected = slot.selectedIndex === oi;
                              return (
                                <motion.button key={oi} whileTap={{ scale: 0.98 }}
                                  onClick={() => selectMealOption(di, si, oi)}
                                  className={`w-full p-3 rounded-xl text-left flex items-center gap-3 transition-all ${isSelected ? 'bg-primary-500 shadow-float' : 'bg-surface-100 hover:bg-surface-200'}`}>
                                  <img src={opt.imageUrl} alt={opt.name}
                                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-text-primary'}`}>
                                      {opt.name}
                                    </p>
                                    <p className={`text-xs ${isSelected ? 'text-white/70' : 'text-text-muted'}`}>
                                      {opt.calories} kcal · P:{opt.protein_g}g
                                      {opt.price !== undefined && ` · ~${opt.price.toFixed(2)}€`}
                                    </p>
                                  </div>
                                  {isSelected && <Check size={18} className="text-white flex-shrink-0" />}
                                </motion.button>
                              );
                            })}
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

      {/* Bouton valider */}
      {!mealPlan.validated && (
        <div className="mt-6">
          <AnimatedButton onClick={handleValidate} className="w-full py-3.5 text-sm flex items-center justify-center gap-2" variant="success">
            <Check size={18} /> Valider le plan & générer les courses
          </AnimatedButton>
        </div>
      )}

      {/* Overlay succès */}
      <AnimatePresence>
        {validated && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-8 text-center mx-4">
              <SuccessCheckmark size={64} />
              <p className="text-lg font-semibold text-text-primary mt-4">Plan validé !</p>
              <p className="text-sm text-text-secondary mt-1">Votre liste de courses est prête 🛒</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}
