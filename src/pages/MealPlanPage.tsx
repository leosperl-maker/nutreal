import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, RefreshCw, Check, Loader2, Sparkles, ChefHat } from 'lucide-react';
import { useStore, type MealPlan } from '../store/useStore';

const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const mealTypeLabels: Record<string, { label: string; emoji: string }> = {
  breakfast: { label: 'Petit-déjeuner', emoji: '🌅' },
  lunch: { label: 'Déjeuner', emoji: '☀️' },
  snack: { label: 'Goûter', emoji: '🍪' },
  dinner: { label: 'Dîner', emoji: '🌙' },
};

function generateMealPlan(budget: number, macros: any, preferences: string[]): MealPlan {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);

  const mealTemplates = {
    breakfast: [
      { name: 'Porridge aux fruits rouges et graines de chia', ingredients: ['Flocons d\'avoine', 'Lait d\'amande', 'Fruits rouges', 'Graines de chia', 'Miel'], calories: Math.round(budget * 0.25), protein_g: Math.round(macros.protein_g * 0.2), fat_g: Math.round(macros.fat_g * 0.2), carbs_g: Math.round(macros.carbs_g * 0.3), fiber_g: Math.round(macros.fiber_g * 0.3) },
      { name: 'Tartines avocat et œuf poché', ingredients: ['Pain complet', 'Avocat', 'Œuf', 'Tomates cerises', 'Citron'], calories: Math.round(budget * 0.25), protein_g: Math.round(macros.protein_g * 0.25), fat_g: Math.round(macros.fat_g * 0.25), carbs_g: Math.round(macros.carbs_g * 0.2), fiber_g: Math.round(macros.fiber_g * 0.25) },
      { name: 'Smoothie bowl protéiné', ingredients: ['Banane', 'Épinards', 'Protéine en poudre', 'Granola', 'Beurre de cacahuète'], calories: Math.round(budget * 0.25), protein_g: Math.round(macros.protein_g * 0.3), fat_g: Math.round(macros.fat_g * 0.15), carbs_g: Math.round(macros.carbs_g * 0.25), fiber_g: Math.round(macros.fiber_g * 0.2) },
      { name: 'Omelette aux légumes', ingredients: ['Œufs', 'Poivrons', 'Champignons', 'Fromage', 'Herbes'], calories: Math.round(budget * 0.25), protein_g: Math.round(macros.protein_g * 0.3), fat_g: Math.round(macros.fat_g * 0.3), carbs_g: Math.round(macros.carbs_g * 0.1), fiber_g: Math.round(macros.fiber_g * 0.15) },
      { name: 'Yaourt grec aux noix et miel', ingredients: ['Yaourt grec', 'Noix', 'Miel', 'Graines de lin', 'Fruits frais'], calories: Math.round(budget * 0.2), protein_g: Math.round(macros.protein_g * 0.2), fat_g: Math.round(macros.fat_g * 0.2), carbs_g: Math.round(macros.carbs_g * 0.15), fiber_g: Math.round(macros.fiber_g * 0.15) },
      { name: 'Pancakes à la banane', ingredients: ['Banane', 'Œufs', 'Farine complète', 'Lait', 'Sirop d\'érable'], calories: Math.round(budget * 0.25), protein_g: Math.round(macros.protein_g * 0.2), fat_g: Math.round(macros.fat_g * 0.15), carbs_g: Math.round(macros.carbs_g * 0.3), fiber_g: Math.round(macros.fiber_g * 0.2) },
      { name: 'Bol de fruits et granola', ingredients: ['Granola maison', 'Yaourt', 'Mangue', 'Kiwi', 'Noix de coco'], calories: Math.round(budget * 0.22), protein_g: Math.round(macros.protein_g * 0.15), fat_g: Math.round(macros.fat_g * 0.2), carbs_g: Math.round(macros.carbs_g * 0.25), fiber_g: Math.round(macros.fiber_g * 0.25) },
    ],
    lunch: [
      { name: 'Poulet grillé, quinoa et légumes rôtis', ingredients: ['Blanc de poulet', 'Quinoa', 'Courgettes', 'Poivrons', 'Huile d\'olive'], calories: Math.round(budget * 0.35), protein_g: Math.round(macros.protein_g * 0.35), fat_g: Math.round(macros.fat_g * 0.3), carbs_g: Math.round(macros.carbs_g * 0.3), fiber_g: Math.round(macros.fiber_g * 0.3) },
      { name: 'Bowl saumon, riz et edamame', ingredients: ['Saumon', 'Riz complet', 'Edamame', 'Avocat', 'Sauce soja'], calories: Math.round(budget * 0.35), protein_g: Math.round(macros.protein_g * 0.35), fat_g: Math.round(macros.fat_g * 0.35), carbs_g: Math.round(macros.carbs_g * 0.3), fiber_g: Math.round(macros.fiber_g * 0.25) },
      { name: 'Salade César au poulet', ingredients: ['Poulet grillé', 'Laitue romaine', 'Parmesan', 'Croûtons', 'Sauce César légère'], calories: Math.round(budget * 0.3), protein_g: Math.round(macros.protein_g * 0.3), fat_g: Math.round(macros.fat_g * 0.25), carbs_g: Math.round(macros.carbs_g * 0.2), fiber_g: Math.round(macros.fiber_g * 0.2) },
      { name: 'Curry de lentilles et riz basmati', ingredients: ['Lentilles corail', 'Lait de coco', 'Épices', 'Riz basmati', 'Épinards'], calories: Math.round(budget * 0.35), protein_g: Math.round(macros.protein_g * 0.25), fat_g: Math.round(macros.fat_g * 0.25), carbs_g: Math.round(macros.carbs_g * 0.35), fiber_g: Math.round(macros.fiber_g * 0.35) },
      { name: 'Wrap dinde et crudités', ingredients: ['Tortilla complète', 'Dinde', 'Salade', 'Tomates', 'Houmous'], calories: Math.round(budget * 0.3), protein_g: Math.round(macros.protein_g * 0.3), fat_g: Math.round(macros.fat_g * 0.2), carbs_g: Math.round(macros.carbs_g * 0.25), fiber_g: Math.round(macros.fiber_g * 0.25) },
      { name: 'Pâtes complètes au pesto et légumes', ingredients: ['Pâtes complètes', 'Pesto basilic', 'Tomates séchées', 'Mozzarella', 'Roquette'], calories: Math.round(budget * 0.35), protein_g: Math.round(macros.protein_g * 0.25), fat_g: Math.round(macros.fat_g * 0.3), carbs_g: Math.round(macros.carbs_g * 0.35), fiber_g: Math.round(macros.fiber_g * 0.25) },
      { name: 'Steak haché, patate douce et brocoli', ingredients: ['Steak haché 5%', 'Patate douce', 'Brocoli', 'Huile d\'olive', 'Ail'], calories: Math.round(budget * 0.35), protein_g: Math.round(macros.protein_g * 0.35), fat_g: Math.round(macros.fat_g * 0.25), carbs_g: Math.round(macros.carbs_g * 0.3), fiber_g: Math.round(macros.fiber_g * 0.3) },
    ],
    snack: [
      { name: 'Pomme et beurre d\'amande', ingredients: ['Pomme', 'Beurre d\'amande'], calories: Math.round(budget * 0.1), protein_g: Math.round(macros.protein_g * 0.08), fat_g: Math.round(macros.fat_g * 0.1), carbs_g: Math.round(macros.carbs_g * 0.1), fiber_g: Math.round(macros.fiber_g * 0.15) },
      { name: 'Yaourt et fruits secs', ingredients: ['Yaourt nature', 'Amandes', 'Raisins secs'], calories: Math.round(budget * 0.1), protein_g: Math.round(macros.protein_g * 0.1), fat_g: Math.round(macros.fat_g * 0.1), carbs_g: Math.round(macros.carbs_g * 0.1), fiber_g: Math.round(macros.fiber_g * 0.1) },
      { name: 'Houmous et bâtonnets de légumes', ingredients: ['Houmous', 'Carottes', 'Concombre', 'Céleri'], calories: Math.round(budget * 0.08), protein_g: Math.round(macros.protein_g * 0.08), fat_g: Math.round(macros.fat_g * 0.08), carbs_g: Math.round(macros.carbs_g * 0.08), fiber_g: Math.round(macros.fiber_g * 0.15) },
      { name: 'Smoothie banane-épinards', ingredients: ['Banane', 'Épinards', 'Lait d\'amande', 'Graines de chia'], calories: Math.round(budget * 0.1), protein_g: Math.round(macros.protein_g * 0.08), fat_g: Math.round(macros.fat_g * 0.05), carbs_g: Math.round(macros.carbs_g * 0.12), fiber_g: Math.round(macros.fiber_g * 0.15) },
      { name: 'Fromage blanc et miel', ingredients: ['Fromage blanc 0%', 'Miel', 'Cannelle'], calories: Math.round(budget * 0.08), protein_g: Math.round(macros.protein_g * 0.12), fat_g: Math.round(macros.fat_g * 0.02), carbs_g: Math.round(macros.carbs_g * 0.08), fiber_g: Math.round(macros.fiber_g * 0.02) },
      { name: 'Barre énergétique maison', ingredients: ['Flocons d\'avoine', 'Miel', 'Noix', 'Chocolat noir'], calories: Math.round(budget * 0.1), protein_g: Math.round(macros.protein_g * 0.08), fat_g: Math.round(macros.fat_g * 0.1), carbs_g: Math.round(macros.carbs_g * 0.12), fiber_g: Math.round(macros.fiber_g * 0.1) },
      { name: 'Compote de pommes sans sucre', ingredients: ['Pommes', 'Cannelle', 'Vanille'], calories: Math.round(budget * 0.06), protein_g: Math.round(macros.protein_g * 0.02), fat_g: Math.round(macros.fat_g * 0.01), carbs_g: Math.round(macros.carbs_g * 0.1), fiber_g: Math.round(macros.fiber_g * 0.1) },
    ],
    dinner: [
      { name: 'Filet de cabillaud, purée et haricots verts', ingredients: ['Cabillaud', 'Pommes de terre', 'Haricots verts', 'Beurre', 'Citron'], calories: Math.round(budget * 0.3), protein_g: Math.round(macros.protein_g * 0.3), fat_g: Math.round(macros.fat_g * 0.25), carbs_g: Math.round(macros.carbs_g * 0.25), fiber_g: Math.round(macros.fiber_g * 0.25) },
      { name: 'Soupe de légumes et tartine de chèvre', ingredients: ['Carottes', 'Poireaux', 'Pommes de terre', 'Fromage de chèvre', 'Pain complet'], calories: Math.round(budget * 0.25), protein_g: Math.round(macros.protein_g * 0.2), fat_g: Math.round(macros.fat_g * 0.2), carbs_g: Math.round(macros.carbs_g * 0.25), fiber_g: Math.round(macros.fiber_g * 0.3) },
      { name: 'Wok de crevettes et légumes', ingredients: ['Crevettes', 'Brocoli', 'Poivrons', 'Sauce soja', 'Nouilles de riz'], calories: Math.round(budget * 0.3), protein_g: Math.round(macros.protein_g * 0.3), fat_g: Math.round(macros.fat_g * 0.2), carbs_g: Math.round(macros.carbs_g * 0.25), fiber_g: Math.round(macros.fiber_g * 0.2) },
      { name: 'Gratin de courgettes au thon', ingredients: ['Courgettes', 'Thon', 'Crème légère', 'Gruyère', 'Herbes'], calories: Math.round(budget * 0.3), protein_g: Math.round(macros.protein_g * 0.3), fat_g: Math.round(macros.fat_g * 0.3), carbs_g: Math.round(macros.carbs_g * 0.15), fiber_g: Math.round(macros.fiber_g * 0.2) },
      { name: 'Salade tiède de lentilles et saumon', ingredients: ['Lentilles vertes', 'Saumon fumé', 'Roquette', 'Vinaigrette', 'Oignon rouge'], calories: Math.round(budget * 0.3), protein_g: Math.round(macros.protein_g * 0.3), fat_g: Math.round(macros.fat_g * 0.25), carbs_g: Math.round(macros.carbs_g * 0.2), fiber_g: Math.round(macros.fiber_g * 0.3) },
      { name: 'Risotto aux champignons', ingredients: ['Riz arborio', 'Champignons', 'Parmesan', 'Oignon', 'Bouillon'], calories: Math.round(budget * 0.3), protein_g: Math.round(macros.protein_g * 0.2), fat_g: Math.round(macros.fat_g * 0.25), carbs_g: Math.round(macros.carbs_g * 0.35), fiber_g: Math.round(macros.fiber_g * 0.15) },
      { name: 'Tofu sauté, riz et légumes vapeur', ingredients: ['Tofu ferme', 'Riz complet', 'Brocoli', 'Carottes', 'Sauce teriyaki'], calories: Math.round(budget * 0.3), protein_g: Math.round(macros.protein_g * 0.25), fat_g: Math.round(macros.fat_g * 0.2), carbs_g: Math.round(macros.carbs_g * 0.3), fiber_g: Math.round(macros.fiber_g * 0.25) },
    ],
  };

  const days = dayNames.map((dayName, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);

    return {
      date: date.toISOString().split('T')[0],
      dayName,
      meals: (['breakfast', 'lunch', 'snack', 'dinner'] as const).map(type => {
        const templates = mealTemplates[type];
        return { type, ...templates[i % templates.length] };
      }),
    };
  });

  return {
    weekStart: monday.toISOString().split('T')[0],
    days,
  };
}

export default function MealPlanPage() {
  const { profile, mealPlan, setMealPlan, addMeal } = useStore();
  const [selectedDay, setSelectedDay] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [regeneratingMeal, setRegeneratingMeal] = useState<string | null>(null);

  if (!profile) return null;

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const plan = generateMealPlan(
        profile.dailyCalorieBudget,
        profile.macroTargets,
        profile.dietPreferences
      );
      setMealPlan(plan);
      setGenerating(false);
    }, 1500);
  };

  const handleAddToJournal = (dayMeal: any, date: string) => {
    addMeal({
      id: Date.now().toString() + Math.random(),
      date,
      mealType: dayMeal.type,
      dishName: dayMeal.name,
      foods: dayMeal.ingredients.map((ing: string) => ({
        name: ing,
        calories: Math.round(dayMeal.calories / dayMeal.ingredients.length),
        protein_g: Math.round(dayMeal.protein_g / dayMeal.ingredients.length),
        fat_g: Math.round(dayMeal.fat_g / dayMeal.ingredients.length),
        carbs_g: Math.round(dayMeal.carbs_g / dayMeal.ingredients.length),
        fiber_g: Math.round(dayMeal.fiber_g / dayMeal.ingredients.length),
        quantity_g: 100,
      })),
      totalCalories: dayMeal.calories,
      totalProtein: dayMeal.protein_g,
      totalFat: dayMeal.fat_g,
      totalCarbs: dayMeal.carbs_g,
      totalFiber: dayMeal.fiber_g,
      createdAt: new Date().toISOString(),
    });
  };

  if (!mealPlan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <ChefHat size={36} className="text-primary-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 font-display mb-2">Plan Repas IA</h1>
          <p className="text-gray-400 text-sm mb-6 max-w-xs">
            Générez un plan repas personnalisé basé sur vos objectifs et préférences
          </p>

          <div className="bg-white rounded-2xl p-4 shadow-card mb-6 text-left max-w-sm">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Budget calorique</span>
              <span className="font-semibold text-gray-700">{profile.dailyCalorieBudget} kcal/jour</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Protéines</span>
              <span className="font-semibold text-gray-700">{profile.macroTargets.protein_g}g</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Préférences</span>
              <span className="font-semibold text-gray-700">
                {profile.dietPreferences.length > 0
                  ? profile.dietPreferences.join(', ')
                  : 'Aucune restriction'}
              </span>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-primary-500 text-white px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-600 active:scale-[0.98] transition-all shadow-float mx-auto"
          >
            {generating ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Générer mon plan
              </>
            )}
          </button>
        </motion.div>
      </div>
    );
  }

  const currentDay = mealPlan.days[selectedDay];

  return (
    <div className="px-4 pt-12 pb-24 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800 font-display">Plan Repas</h1>
          <p className="text-xs text-gray-400">Semaine du {new Date(mealPlan.weekStart).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</p>
        </div>
        <button
          onClick={handleGenerate}
          className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 hover:bg-primary-100 active:scale-90 transition-all"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Day Tabs */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 -mx-4 px-4">
        {mealPlan.days.map((day, i) => (
          <button
            key={i}
            onClick={() => setSelectedDay(i)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedDay === i
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-white text-gray-500 hover:bg-surface-50'
            }`}
          >
            {day.dayName.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Day Meals */}
      <div className="space-y-3">
        {currentDay.meals.map((meal, i) => {
          const info = mealTypeLabels[meal.type];
          return (
            <motion.div
              key={meal.type}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-card"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{info.emoji}</span>
                  <span className="text-xs font-medium text-gray-400">{info.label}</span>
                </div>
                <span className="text-sm font-bold text-secondary-500">{meal.calories} kcal</span>
              </div>

              <h3 className="font-semibold text-gray-800 text-sm mb-2">{meal.name}</h3>

              <div className="flex gap-3 mb-3">
                <span className="text-[10px] text-gray-400">P: {meal.protein_g}g</span>
                <span className="text-[10px] text-gray-400">L: {meal.fat_g}g</span>
                <span className="text-[10px] text-gray-400">G: {meal.carbs_g}g</span>
                <span className="text-[10px] text-gray-400">F: {meal.fiber_g}g</span>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {meal.ingredients.map((ing, j) => (
                  <span key={j} className="text-[10px] bg-surface-100 text-gray-500 px-2 py-0.5 rounded-full">
                    {ing}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAddToJournal(meal, currentDay.date)}
                  className="flex-1 bg-primary-50 text-primary-600 py-2 rounded-xl text-xs font-semibold hover:bg-primary-100 active:scale-[0.98] transition-all flex items-center justify-center gap-1"
                >
                  <Check size={14} />
                  Valider
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Daily Total */}
      <div className="bg-primary-50 rounded-2xl p-4 mt-4">
        <p className="text-xs font-medium text-primary-600 mb-1">Total du jour</p>
        <p className="text-xl font-bold text-primary-700">
          {currentDay.meals.reduce((sum, m) => sum + m.calories, 0)} kcal
        </p>
        <p className="text-xs text-primary-500">
          Budget : {profile.dailyCalorieBudget} kcal
        </p>
      </div>
    </div>
  );
}
