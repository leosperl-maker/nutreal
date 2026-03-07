import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, RefreshCw, Check, Loader2, Sparkles, ChefHat,
  ChevronLeft, ChevronRight, Flame, ShoppingCart, BookOpen, X,
  CheckCircle2, Circle, ChevronDown, ChevronUp
} from 'lucide-react';
import { useStore, type MealPlan, type MealPlanOption, type MealPlanSlot, type Recipe, type GroceryItem } from '../store/useStore';
import { FOOD_PREFERENCE_OPTIONS, GROCERY_FREQUENCY_OPTIONS } from '../lib/nutrition';

const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const mealTypeLabels: Record<string, { label: string; emoji: string }> = {
  breakfast: { label: 'Petit-déjeuner', emoji: '🌅' },
  lunch: { label: 'Déjeuner', emoji: '☀️' },
  snack: { label: 'Goûter', emoji: '🍪' },
  dinner: { label: 'Dîner', emoji: '🌙' },
};

// ─── Meal templates filtered by food preferences ───
interface MealTemplate {
  name: string;
  ingredients: string[];
  tags: string[]; // food preference tags this meal requires
  pct: { cal: number; p: number; f: number; c: number; fi: number };
}

const allMealTemplates: Record<string, MealTemplate[]> = {
  breakfast: [
    { name: 'Porridge aux fruits rouges et graines de chia', ingredients: ['Flocons d\'avoine', 'Lait d\'amande', 'Fruits rouges', 'Graines de chia', 'Miel'], tags: ['fruits'], pct: { cal: 0.25, p: 0.2, f: 0.2, c: 0.3, fi: 0.3 } },
    { name: 'Tartines avocat et œuf poché', ingredients: ['Pain complet', 'Avocat', 'Œuf', 'Tomates cerises', 'Citron'], tags: ['oeufs', 'avocat'], pct: { cal: 0.25, p: 0.25, f: 0.25, c: 0.2, fi: 0.25 } },
    { name: 'Smoothie bowl protéiné', ingredients: ['Banane', 'Épinards', 'Protéine en poudre', 'Granola', 'Beurre de cacahuète'], tags: ['fruits', 'noix'], pct: { cal: 0.25, p: 0.3, f: 0.15, c: 0.25, fi: 0.2 } },
    { name: 'Omelette aux légumes', ingredients: ['Œufs', 'Poivrons', 'Champignons', 'Fromage', 'Herbes'], tags: ['oeufs', 'fromage', 'legumes_verts'], pct: { cal: 0.25, p: 0.3, f: 0.3, c: 0.1, fi: 0.15 } },
    { name: 'Yaourt grec aux noix et miel', ingredients: ['Yaourt grec', 'Noix', 'Miel', 'Graines de lin', 'Fruits frais'], tags: ['yaourt', 'noix', 'fruits'], pct: { cal: 0.2, p: 0.2, f: 0.2, c: 0.15, fi: 0.15 } },
    { name: 'Pancakes à la banane', ingredients: ['Banane', 'Œufs', 'Farine complète', 'Lait', 'Sirop d\'érable'], tags: ['oeufs', 'fruits'], pct: { cal: 0.25, p: 0.2, f: 0.15, c: 0.3, fi: 0.2 } },
    { name: 'Bol de fruits et granola', ingredients: ['Granola maison', 'Yaourt', 'Mangue', 'Kiwi', 'Noix de coco'], tags: ['yaourt', 'fruits'], pct: { cal: 0.22, p: 0.15, f: 0.2, c: 0.25, fi: 0.25 } },
    { name: 'Crêpes complètes au fromage', ingredients: ['Farine de sarrasin', 'Œuf', 'Fromage', 'Jambon', 'Salade'], tags: ['oeufs', 'fromage', 'porc'], pct: { cal: 0.25, p: 0.25, f: 0.25, c: 0.2, fi: 0.1 } },
    { name: 'Pain perdu aux fruits', ingredients: ['Pain brioché', 'Œufs', 'Lait', 'Cannelle', 'Fruits frais'], tags: ['oeufs', 'fruits'], pct: { cal: 0.25, p: 0.18, f: 0.2, c: 0.3, fi: 0.15 } },
    { name: 'Tartine de fromage frais et saumon', ingredients: ['Pain complet', 'Fromage frais', 'Saumon fumé', 'Aneth', 'Citron'], tags: ['saumon', 'fromage'], pct: { cal: 0.25, p: 0.25, f: 0.2, c: 0.2, fi: 0.1 } },
    { name: 'Bol de quinoa sucré', ingredients: ['Quinoa', 'Lait d\'amande', 'Miel', 'Fruits secs', 'Cannelle'], tags: ['quinoa', 'fruits'], pct: { cal: 0.22, p: 0.18, f: 0.15, c: 0.28, fi: 0.2 } },
  ],
  lunch: [
    { name: 'Poulet grillé, quinoa et légumes rôtis', ingredients: ['Blanc de poulet', 'Quinoa', 'Courgettes', 'Poivrons', 'Huile d\'olive'], tags: ['poulet', 'quinoa', 'legumes_verts'], pct: { cal: 0.35, p: 0.35, f: 0.3, c: 0.3, fi: 0.3 } },
    { name: 'Bowl saumon, riz et edamame', ingredients: ['Saumon', 'Riz complet', 'Edamame', 'Avocat', 'Sauce soja'], tags: ['saumon', 'riz', 'avocat'], pct: { cal: 0.35, p: 0.35, f: 0.35, c: 0.3, fi: 0.25 } },
    { name: 'Colombo de poulet et riz', ingredients: ['Poulet', 'Poudre à colombo', 'Lait de coco', 'Riz basmati', 'Aubergines'], tags: ['poulet', 'riz'], pct: { cal: 0.35, p: 0.3, f: 0.3, c: 0.35, fi: 0.2 } },
    { name: 'Curry de lentilles et riz basmati', ingredients: ['Lentilles corail', 'Lait de coco', 'Épices', 'Riz basmati', 'Épinards'], tags: ['lentilles', 'riz', 'legumes_verts'], pct: { cal: 0.35, p: 0.25, f: 0.25, c: 0.35, fi: 0.35 } },
    { name: 'Ti-nain morue', ingredients: ['Banane verte', 'Morue dessalée', 'Huile d\'olive', 'Oignons', 'Piment'], tags: ['morue', 'banane_plantain'], pct: { cal: 0.3, p: 0.3, f: 0.2, c: 0.25, fi: 0.25 } },
    { name: 'Pâtes complètes au pesto et légumes', ingredients: ['Pâtes complètes', 'Pesto basilic', 'Tomates séchées', 'Mozzarella', 'Roquette'], tags: ['pates', 'fromage', 'legumes_verts'], pct: { cal: 0.35, p: 0.25, f: 0.3, c: 0.35, fi: 0.25 } },
    { name: 'Court-bouillon de poisson', ingredients: ['Poisson frais', 'Tomates', 'Oignons', 'Citron vert', 'Riz'], tags: ['poisson', 'riz'], pct: { cal: 0.35, p: 0.35, f: 0.15, c: 0.3, fi: 0.2 } },
    { name: 'Salade César au poulet', ingredients: ['Poulet grillé', 'Laitue romaine', 'Parmesan', 'Croûtons', 'Sauce César'], tags: ['poulet', 'fromage', 'legumes_verts'], pct: { cal: 0.3, p: 0.35, f: 0.25, c: 0.2, fi: 0.15 } },
    { name: 'Wrap poulet-avocat', ingredients: ['Tortilla complète', 'Poulet', 'Avocat', 'Tomate', 'Salade'], tags: ['poulet', 'avocat', 'legumes_verts'], pct: { cal: 0.32, p: 0.3, f: 0.28, c: 0.28, fi: 0.2 } },
    { name: 'Bœuf sauté aux légumes et riz', ingredients: ['Bœuf', 'Brocoli', 'Poivrons', 'Sauce soja', 'Riz'], tags: ['boeuf', 'riz', 'legumes_verts'], pct: { cal: 0.35, p: 0.35, f: 0.3, c: 0.3, fi: 0.2 } },
    { name: 'Gratin de pâtes au thon', ingredients: ['Pâtes', 'Thon', 'Crème légère', 'Gruyère', 'Tomates'], tags: ['pates', 'thon', 'fromage'], pct: { cal: 0.35, p: 0.3, f: 0.3, c: 0.35, fi: 0.15 } },
    { name: 'Crevettes sautées et riz parfumé', ingredients: ['Crevettes', 'Riz jasmin', 'Ail', 'Gingembre', 'Légumes'], tags: ['crevettes', 'riz'], pct: { cal: 0.33, p: 0.3, f: 0.2, c: 0.3, fi: 0.2 } },
    { name: 'Dhal de lentilles corail', ingredients: ['Lentilles corail', 'Tomates', 'Oignons', 'Curcuma', 'Riz basmati'], tags: ['lentilles', 'riz'], pct: { cal: 0.35, p: 0.25, f: 0.2, c: 0.35, fi: 0.35 } },
    { name: 'Tofu sauté aux légumes', ingredients: ['Tofu ferme', 'Brocoli', 'Carottes', 'Sauce soja', 'Sésame'], tags: ['tofu', 'legumes_verts'], pct: { cal: 0.3, p: 0.25, f: 0.25, c: 0.25, fi: 0.3 } },
    { name: 'Porc caramélisé et patate douce', ingredients: ['Filet de porc', 'Patate douce', 'Sauce soja', 'Miel', 'Sésame'], tags: ['porc', 'patate_douce'], pct: { cal: 0.35, p: 0.3, f: 0.25, c: 0.3, fi: 0.2 } },
    { name: 'Salade de pois chiches méditerranéenne', ingredients: ['Pois chiches', 'Concombre', 'Tomates', 'Feta', 'Olives'], tags: ['pois_chiches', 'fromage', 'legumes_verts'], pct: { cal: 0.3, p: 0.2, f: 0.25, c: 0.3, fi: 0.3 } },
  ],
  snack: [
    { name: 'Pomme et beurre d\'amande', ingredients: ['Pomme', 'Beurre d\'amande'], tags: ['fruits', 'noix'], pct: { cal: 0.1, p: 0.08, f: 0.1, c: 0.1, fi: 0.15 } },
    { name: 'Yaourt et fruits secs', ingredients: ['Yaourt nature', 'Amandes', 'Raisins secs'], tags: ['yaourt', 'noix', 'fruits'], pct: { cal: 0.1, p: 0.1, f: 0.1, c: 0.1, fi: 0.1 } },
    { name: 'Accras de morue (3 pièces)', ingredients: ['Morue', 'Farine', 'Ciboulette', 'Piment', 'Huile'], tags: ['morue'], pct: { cal: 0.12, p: 0.1, f: 0.12, c: 0.1, fi: 0.05 } },
    { name: 'Smoothie banane-épinards', ingredients: ['Banane', 'Épinards', 'Lait d\'amande', 'Graines de chia'], tags: ['fruits', 'legumes_verts'], pct: { cal: 0.1, p: 0.08, f: 0.05, c: 0.12, fi: 0.15 } },
    { name: 'Fromage blanc et miel', ingredients: ['Fromage blanc 0%', 'Miel', 'Cannelle'], tags: ['yaourt'], pct: { cal: 0.08, p: 0.12, f: 0.02, c: 0.08, fi: 0.02 } },
    { name: 'Houmous et crudités', ingredients: ['Pois chiches', 'Tahini', 'Carottes', 'Concombre'], tags: ['pois_chiches', 'legumes_verts'], pct: { cal: 0.1, p: 0.08, f: 0.08, c: 0.1, fi: 0.12 } },
    { name: 'Barres énergétiques maison', ingredients: ['Flocons d\'avoine', 'Miel', 'Noix', 'Chocolat noir'], tags: ['noix'], pct: { cal: 0.1, p: 0.08, f: 0.1, c: 0.12, fi: 0.08 } },
    { name: 'Compote de pommes sans sucre', ingredients: ['Pommes', 'Cannelle', 'Vanille'], tags: ['fruits'], pct: { cal: 0.06, p: 0.02, f: 0.01, c: 0.1, fi: 0.1 } },
    { name: 'Œuf dur et tomates cerises', ingredients: ['Œuf dur', 'Tomates cerises', 'Sel', 'Poivre'], tags: ['oeufs', 'legumes_verts'], pct: { cal: 0.08, p: 0.1, f: 0.08, c: 0.03, fi: 0.05 } },
    { name: 'Banane plantain grillée', ingredients: ['Banane plantain', 'Cannelle'], tags: ['banane_plantain'], pct: { cal: 0.1, p: 0.03, f: 0.02, c: 0.15, fi: 0.08 } },
  ],
  dinner: [
    { name: 'Filet de cabillaud, purée et haricots verts', ingredients: ['Cabillaud', 'Pommes de terre', 'Haricots verts', 'Beurre', 'Citron'], tags: ['poisson', 'pommes_de_terre', 'legumes_verts'], pct: { cal: 0.3, p: 0.3, f: 0.25, c: 0.25, fi: 0.25 } },
    { name: 'Soupe de légumes et tartine de chèvre', ingredients: ['Carottes', 'Poireaux', 'Pommes de terre', 'Fromage de chèvre', 'Pain complet'], tags: ['fromage', 'pommes_de_terre', 'legumes_verts'], pct: { cal: 0.25, p: 0.2, f: 0.2, c: 0.25, fi: 0.3 } },
    { name: 'Gratin de christophine', ingredients: ['Christophine', 'Béchamel légère', 'Gruyère', 'Muscade', 'Herbes'], tags: ['christophine', 'fromage'], pct: { cal: 0.25, p: 0.15, f: 0.25, c: 0.2, fi: 0.25 } },
    { name: 'Gratin de courgettes au thon', ingredients: ['Courgettes', 'Thon', 'Crème légère', 'Gruyère', 'Herbes'], tags: ['thon', 'fromage', 'legumes_verts'], pct: { cal: 0.3, p: 0.3, f: 0.3, c: 0.15, fi: 0.2 } },
    { name: 'Salade tiède de lentilles et saumon', ingredients: ['Lentilles vertes', 'Saumon fumé', 'Roquette', 'Vinaigrette', 'Oignon rouge'], tags: ['lentilles', 'saumon', 'legumes_verts'], pct: { cal: 0.3, p: 0.3, f: 0.25, c: 0.2, fi: 0.3 } },
    { name: 'Risotto aux champignons', ingredients: ['Riz arborio', 'Champignons', 'Parmesan', 'Oignon', 'Bouillon'], tags: ['riz', 'fromage'], pct: { cal: 0.3, p: 0.2, f: 0.25, c: 0.35, fi: 0.15 } },
    { name: 'Poulet boucané et légumes pays', ingredients: ['Poulet boucané', 'Igname', 'Banane plantain', 'Giraumon', 'Sauce chien'], tags: ['poulet', 'igname', 'banane_plantain', 'giraumon'], pct: { cal: 0.3, p: 0.3, f: 0.2, c: 0.3, fi: 0.25 } },
    { name: 'Wok de crevettes aux légumes', ingredients: ['Crevettes', 'Brocoli', 'Poivrons', 'Sauce soja', 'Nouilles de riz'], tags: ['crevettes', 'legumes_verts'], pct: { cal: 0.28, p: 0.3, f: 0.15, c: 0.28, fi: 0.2 } },
    { name: 'Ratatouille et œuf au plat', ingredients: ['Courgettes', 'Aubergines', 'Tomates', 'Poivrons', 'Œuf'], tags: ['oeufs', 'legumes_verts'], pct: { cal: 0.25, p: 0.2, f: 0.2, c: 0.2, fi: 0.35 } },
    { name: 'Steak de bœuf et patate douce', ingredients: ['Steak de bœuf', 'Patate douce', 'Brocoli', 'Huile d\'olive', 'Ail'], tags: ['boeuf', 'patate_douce', 'legumes_verts'], pct: { cal: 0.32, p: 0.35, f: 0.3, c: 0.25, fi: 0.2 } },
    { name: 'Filet de porc et purée de giraumon', ingredients: ['Filet de porc', 'Giraumon', 'Crème', 'Thym', 'Salade'], tags: ['porc', 'giraumon'], pct: { cal: 0.3, p: 0.3, f: 0.25, c: 0.2, fi: 0.2 } },
    { name: 'Tofu grillé et riz aux légumes', ingredients: ['Tofu', 'Riz complet', 'Courgettes', 'Carottes', 'Sauce teriyaki'], tags: ['tofu', 'riz', 'legumes_verts'], pct: { cal: 0.3, p: 0.2, f: 0.2, c: 0.3, fi: 0.25 } },
  ],
};

function getImageUrl(dishName: string): string {
  const encoded = encodeURIComponent(dishName.replace(/['']/g, ' '));
  return `https://source.unsplash.com/400x300/?${encoded},food`;
}

function pick3Random<T>(arr: T[], seed: number): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.abs((seed * (i + 1) * 2654435761) % (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 3);
}

function filterMealsByPreferences(templates: MealTemplate[], foodPrefs: string[]): MealTemplate[] {
  if (!foodPrefs || foodPrefs.length === 0) return templates;
  return templates.filter(t => {
    // A meal is allowed if ALL its required tags are in the user's food preferences
    return t.tags.every(tag => foodPrefs.includes(tag));
  });
}

function generateMealPlan(budget: number, macros: any, foodPrefs: string[]): MealPlan {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);

  const days = dayNames.map((dayName, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const daySeed = i * 7 + Date.now() % 1000;

    const slots: MealPlanSlot[] = (['breakfast', 'lunch', 'snack', 'dinner'] as const).map(type => {
      const templates = allMealTemplates[type];
      const filtered = filterMealsByPreferences(templates, foodPrefs);
      // Fallback to all templates if filtering leaves too few
      const pool = filtered.length >= 3 ? filtered : templates;
      const picked = pick3Random(pool, daySeed + type.charCodeAt(0));

      const options: MealPlanOption[] = picked.map(t => ({
        name: t.name,
        ingredients: t.ingredients,
        calories: Math.round(budget * t.pct.cal),
        protein_g: Math.round(macros.protein_g * t.pct.p),
        fat_g: Math.round(macros.fat_g * t.pct.f),
        carbs_g: Math.round(macros.carbs_g * t.pct.c),
        fiber_g: Math.round(macros.fiber_g * t.pct.fi),
        imageUrl: getImageUrl(t.name),
      }));

      return { type, options, selectedIndex: null };
    });

    return { date: dateStr, dayName, slots };
  });

  return { weekStart: monday.toISOString().split('T')[0], days, calorieBudget: budget, validated: false, recipes: [], groceryList: [] };
}

// ─── Image component with fallback ───
function MealImage({ url, name }: { url: string; name: string }) {
  const [failed, setFailed] = useState(false);
  const emojis = ['🍽️', '🥗', '🍲', '🥘', '🍛', '🥙'];
  const emoji = emojis[name.length % emojis.length];

  if (failed) {
    return (
      <div className="w-full h-28 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
        <span className="text-4xl">{emoji}</span>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={name}
      className="w-full h-28 rounded-xl object-cover"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

// ─── Meal Slot Cards ───
function MealSlotCards({
  slot,
  dayIndex,
  slotIndex,
  onSelect,
  onValidate,
  isValidated,
  planValidated,
}: {
  slot: MealPlanSlot;
  dayIndex: number;
  slotIndex: number;
  onSelect: (optionIndex: number) => void;
  onValidate: (option: MealPlanOption) => void;
  isValidated: boolean;
  planValidated: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const info = mealTypeLabels[slot.type];
  const selectedOption = slot.selectedIndex !== null ? slot.options[slot.selectedIndex] : null;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">{info.emoji}</span>
          <span className="text-xs font-semibold text-gray-600">{info.label}</span>
        </div>
        {selectedOption && (
          <span className="text-xs font-bold text-secondary-500">{selectedOption.calories} kcal</span>
        )}
      </div>

      <div className="relative">
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-1 px-1">
          {slot.options.map((option, optIdx) => {
            const isSelected = slot.selectedIndex === optIdx;
            const isOther = slot.selectedIndex !== null && !isSelected;

            return (
              <motion.div
                key={optIdx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: optIdx * 0.05 }}
                onClick={() => !planValidated && onSelect(optIdx)}
                className={`flex-shrink-0 w-[200px] snap-start rounded-2xl overflow-hidden transition-all duration-200 ${
                  planValidated ? 'cursor-default' : 'cursor-pointer'
                } ${
                  isSelected
                    ? 'ring-2 ring-primary-500 shadow-lg scale-[1.02]'
                    : isOther
                    ? 'opacity-50 scale-[0.97]'
                    : 'shadow-card hover:shadow-lg hover:scale-[1.01]'
                } bg-white`}
              >
                <div className="relative">
                  <MealImage url={option.imageUrl} name={option.name} />
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    <span className="text-[10px] font-bold text-white">{option.calories} kcal</span>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="text-xs font-semibold text-gray-800 leading-tight mb-1.5 line-clamp-2">{option.name}</h4>
                  <div className="flex gap-2 text-[9px] text-gray-400">
                    <span>P:{option.protein_g}g</span>
                    <span>L:{option.fat_g}g</span>
                    <span>G:{option.carbs_g}g</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {selectedOption && !planValidated && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2">
          <button
            onClick={() => onValidate(selectedOption)}
            disabled={isValidated}
            className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
              isValidated
                ? 'bg-green-100 text-green-600'
                : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
            }`}
          >
            <Check size={14} />
            {isValidated ? 'Ajouté au journal ✓' : 'Ajouter au journal'}
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ─── Recipe View ───
function RecipeView({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-white rounded-t-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white z-10 px-4 pt-4 pb-2 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800 font-display">{recipe.mealName}</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center">
              <X size={16} className="text-gray-500" />
            </button>
          </div>
          <div className="flex gap-3 mt-2 text-xs text-gray-400">
            <span>{mealTypeLabels[recipe.mealType]?.emoji} {mealTypeLabels[recipe.mealType]?.label}</span>
            <span>⏱️ Prépa: {recipe.prepTime}</span>
            <span>🔥 Cuisson: {recipe.cookTime}</span>
          </div>
        </div>

        <div className="px-4 py-4">
          <MealImage url={recipe.imageUrl} name={recipe.mealName} />

          <h3 className="font-bold text-sm text-gray-800 mt-4 mb-2">🧾 Ingrédients</h3>
          <div className="bg-surface-50 rounded-xl p-3 mb-4">
            {recipe.ingredients.map((ing, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 border-b border-gray-100 last:border-0">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                <span className="text-sm text-gray-700">{ing.name}</span>
                <span className="text-xs text-gray-400 ml-auto">{ing.quantity} {ing.unit}</span>
              </div>
            ))}
          </div>

          <h3 className="font-bold text-sm text-gray-800 mb-2">👨‍🍳 Préparation</h3>
          <div className="space-y-3">
            {recipe.steps.map((step) => (
              <div key={step.step} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary-600">{step.step}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed pt-1">{step.instruction}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Grocery List View ───
function GroceryListView({
  groceryList,
  onToggle,
  onClose,
  currency,
  budget,
  frequency,
}: {
  groceryList: GroceryItem[];
  onToggle: (index: number) => void;
  onClose: () => void;
  currency: string;
  budget: number;
  frequency: string;
}) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const categories = [...new Set(groceryList.map(item => item.category))];
  const checkedCount = groceryList.filter(i => i.checked).length;
  const freqLabel = GROCERY_FREQUENCY_OPTIONS.find(f => f.value === frequency)?.label || frequency;

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  // Initialize all categories as expanded
  React.useEffect(() => {
    setExpandedCategories(new Set(categories));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-white rounded-t-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white z-10 px-4 pt-4 pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800 font-display">🛒 Liste de courses</h2>
              <p className="text-xs text-gray-400">{freqLabel} • Budget: {budget}{currency}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center">
              <X size={16} className="text-gray-500" />
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-300"
                style={{ width: `${groceryList.length > 0 ? (checkedCount / groceryList.length) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">{checkedCount}/{groceryList.length}</span>
          </div>
        </div>

        <div className="px-4 py-3">
          {categories.map(category => {
            const items = groceryList.map((item, idx) => ({ ...item, originalIndex: idx })).filter(item => item.category === category);
            const isExpanded = expandedCategories.has(category);
            const categoryChecked = items.filter(i => i.checked).length;

            return (
              <div key={category} className="mb-3">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between py-2"
                >
                  <span className="text-sm font-bold text-gray-700">{category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400">{categoryChecked}/{items.length}</span>
                    {isExpanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                  </div>
                </button>
                {isExpanded && (
                  <div className="space-y-1">
                    {items.map((item) => (
                      <button
                        key={item.originalIndex}
                        onClick={() => onToggle(item.originalIndex)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                          item.checked ? 'bg-green-50' : 'bg-surface-50 hover:bg-surface-100'
                        }`}
                      >
                        {item.checked ? (
                          <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                        ) : (
                          <Circle size={18} className="text-gray-300 flex-shrink-0" />
                        )}
                        <span className={`text-sm flex-1 text-left ${item.checked ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                          {item.name}
                        </span>
                        <span className="text-xs text-gray-400">{item.quantity} {item.unit}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ───
export default function MealPlanPage() {
  const { profile, mealPlan, setMealPlan, selectMealOption, validateMealPlan, toggleGroceryItem, addMeal, showToast } = useStore();
  const [selectedDay, setSelectedDay] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [validatedMeals, setValidatedMeals] = useState<Set<string>>(new Set());
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);
  const [showGroceryList, setShowGroceryList] = useState(false);

  if (!profile) return null;

  const budget = profile.dailyCalorieBudget;
  const macros = profile.macroTargets;
  const foodPrefs = profile.foodPreferences || [];
  const currency = profile.groceryCurrency || '€';
  const groceryBudget = profile.groceryBudget || 0;
  const groceryFrequency = profile.groceryFrequency || 'weekly';

  const handleGenerate = () => {
    setGenerating(true);
    setValidatedMeals(new Set());
    setTimeout(() => {
      const plan = generateMealPlan(budget, macros, foodPrefs);
      setMealPlan(plan);
      setGenerating(false);
    }, 1500);
  };

  const handleSelectOption = (dayIdx: number, slotIdx: number, optIdx: number) => {
    selectMealOption(dayIdx, slotIdx, optIdx);
  };

  const handleValidateSingleMeal = (option: MealPlanOption, slotType: string, date: string) => {
    const mealKey = `${date}-${slotType}`;
    if (validatedMeals.has(mealKey)) return;

    const today = new Date().toISOString().split('T')[0];
    addMeal({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      date: today,
      mealType: slotType as any,
      dishName: option.name,
      foods: option.ingredients.map((ing: string) => ({
        name: ing,
        calories: Math.round(option.calories / option.ingredients.length),
        protein_g: Math.round((option.protein_g / option.ingredients.length) * 10) / 10,
        fat_g: Math.round((option.fat_g / option.ingredients.length) * 10) / 10,
        carbs_g: Math.round((option.carbs_g / option.ingredients.length) * 10) / 10,
        fiber_g: Math.round((option.fiber_g / option.ingredients.length) * 10) / 10,
        quantity_g: 100,
      })),
      totalCalories: option.calories,
      totalProtein: option.protein_g,
      totalFat: option.fat_g,
      totalCarbs: option.carbs_g,
      totalFiber: option.fiber_g,
      createdAt: new Date().toISOString(),
    });

    setValidatedMeals(prev => new Set(prev).add(mealKey));
    showToast(`✅ "${option.name}" ajouté au journal`);
  };

  const handleValidateWeeklyPlan = () => {
    // Check that at least some meals are selected
    const selectedCount = mealPlan!.days.reduce((sum, day) =>
      sum + day.slots.filter(s => s.selectedIndex !== null).length, 0
    );

    if (selectedCount === 0) {
      showToast('⚠️ Sélectionnez au moins un repas par jour');
      return;
    }

    validateMealPlan();
    showToast(`✅ Plan validé ! ${selectedCount} recettes générées + liste de courses`);
  };

  const budgetMismatch = mealPlan && mealPlan.calorieBudget !== budget;

  // Count total selected meals
  const totalSelected = mealPlan ? mealPlan.days.reduce((sum, day) =>
    sum + day.slots.filter(s => s.selectedIndex !== null).length, 0
  ) : 0;

  if (!mealPlan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <ChefHat size={36} className="text-primary-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 font-display mb-2">Plan Repas IA</h1>
          <p className="text-gray-400 text-sm mb-6 max-w-xs">
            Générez un plan repas personnalisé avec 3 options par repas, adapté à vos préférences
          </p>

          <div className="bg-white rounded-2xl p-4 shadow-card mb-6 text-left max-w-sm">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Budget calorique</span>
              <span className="font-semibold text-gray-700">{budget} kcal/jour</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Protéines</span>
              <span className="font-semibold text-gray-700">{macros.protein_g}g</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Aliments préférés</span>
              <span className="font-semibold text-gray-700">{foodPrefs.length} sélectionnés</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Budget courses</span>
              <span className="font-semibold text-gray-700">{groceryBudget}{currency}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Fréquence courses</span>
              <span className="font-semibold text-gray-700">
                {GROCERY_FREQUENCY_OPTIONS.find(f => f.value === groceryFrequency)?.label || groceryFrequency}
              </span>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-primary-500 text-white px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-600 active:scale-[0.98] transition-all shadow-float mx-auto"
          >
            {generating ? (
              <><Loader2 size={20} className="animate-spin" /> Génération en cours...</>
            ) : (
              <><Sparkles size={20} /> Générer mon plan</>
            )}
          </button>
        </motion.div>
      </div>
    );
  }

  const currentDay = mealPlan.days[selectedDay];
  const selectedDayTotal = currentDay.slots.reduce((sum, slot) => {
    if (slot.selectedIndex !== null) {
      return sum + slot.options[slot.selectedIndex].calories;
    }
    return sum;
  }, 0);

  return (
    <div className="px-4 pt-12 pb-24 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800 font-display">Plan Repas</h1>
          <p className="text-xs text-gray-400">
            Semaine du {new Date(mealPlan.weekStart).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
            {' • '}{budget} kcal/jour
          </p>
        </div>
        <div className="flex gap-2">
          {mealPlan.validated && mealPlan.groceryList.length > 0 && (
            <button
              onClick={() => setShowGroceryList(true)}
              className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-100 active:scale-90 transition-all"
            >
              <ShoppingCart size={18} />
            </button>
          )}
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 hover:bg-primary-100 active:scale-90 transition-all"
          >
            {generating ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
          </button>
        </div>
      </div>

      {/* Budget mismatch warning */}
      {budgetMismatch && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-center gap-2">
          <Flame size={16} className="text-amber-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-amber-700">Budget changé ({mealPlan.calorieBudget} → {budget} kcal). Régénérez le plan.</p>
          </div>
          <button onClick={handleGenerate} className="text-xs font-semibold text-amber-600 hover:text-amber-700">Régénérer</button>
        </motion.div>
      )}

      {/* Validated banner */}
      {mealPlan.validated && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-green-600" />
            <span className="text-xs font-semibold text-green-700">Plan validé ✓</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowGroceryList(true)}
              className="flex-1 bg-green-100 text-green-700 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-green-200 transition-all"
            >
              <ShoppingCart size={14} /> Liste de courses ({mealPlan.groceryList.length})
            </button>
            <button
              onClick={() => {
                if (mealPlan.recipes.length > 0) setViewingRecipe(mealPlan.recipes[0]);
              }}
              className="flex-1 bg-primary-100 text-primary-700 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-primary-200 transition-all"
            >
              <BookOpen size={14} /> Recettes ({mealPlan.recipes.length})
            </button>
          </div>
        </motion.div>
      )}

      {/* Day Tabs */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        {mealPlan.days.map((day, i) => {
          const daySelected = day.slots.filter(s => s.selectedIndex !== null).length;
          return (
            <button
              key={i}
              onClick={() => setSelectedDay(i)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all relative ${
                selectedDay === i ? 'bg-primary-500 text-white shadow-sm' : 'bg-white text-gray-500 hover:bg-surface-50'
              }`}
            >
              {day.dayName.slice(0, 3)}
              {daySelected > 0 && (
                <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ${
                  selectedDay === i ? 'bg-white text-primary-500' : 'bg-primary-500 text-white'
                }`}>
                  {daySelected}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-[10px] text-gray-400 mb-3 text-center">← Glissez pour voir les 3 options, tapez pour choisir →</p>

      {/* Meal Slots */}
      <div>
        {currentDay.slots.map((slot, slotIdx) => {
          const mealKey = `${currentDay.date}-${slot.type}`;
          const isValidated = validatedMeals.has(mealKey);

          return (
            <MealSlotCards
              key={slot.type}
              slot={slot}
              dayIndex={selectedDay}
              slotIndex={slotIdx}
              onSelect={(optIdx) => handleSelectOption(selectedDay, slotIdx, optIdx)}
              onValidate={(option) => handleValidateSingleMeal(option, slot.type, currentDay.date)}
              isValidated={isValidated}
              planValidated={mealPlan.validated}
            />
          );
        })}
      </div>

      {/* Daily Total */}
      <div className="bg-primary-50 rounded-2xl p-4 mt-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-primary-600 mb-1">Total sélectionné</p>
            <p className="text-xl font-bold text-primary-700">{selectedDayTotal} kcal</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-primary-500">Budget : {budget} kcal</p>
            <p className={`text-xs font-semibold ${selectedDayTotal > budget ? 'text-red-500' : 'text-green-600'}`}>
              {selectedDayTotal > budget ? `+${selectedDayTotal - budget}` : `-${budget - selectedDayTotal}`} kcal
            </p>
          </div>
        </div>
        <div className="mt-2 h-2 bg-primary-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${selectedDayTotal > budget ? 'bg-red-400' : 'bg-primary-500'}`}
            style={{ width: `${Math.min(100, (selectedDayTotal / budget) * 100)}%` }}
          />
        </div>
      </div>

      {/* Validate Weekly Plan Button */}
      {!mealPlan.validated && totalSelected > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
          <button
            onClick={handleValidateWeeklyPlan}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:from-primary-600 hover:to-primary-700 active:scale-[0.98] transition-all shadow-float"
          >
            <CheckCircle2 size={20} />
            Valider le plan ({totalSelected} repas) → Recettes + Liste de courses
          </button>
        </motion.div>
      )}

      {/* Recipe cards after validation */}
      {mealPlan.validated && mealPlan.recipes.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
          <h3 className="font-bold text-sm text-gray-800 mb-3">📖 Vos recettes</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {mealPlan.recipes.map((recipe, i) => (
              <button
                key={i}
                onClick={() => setViewingRecipe(recipe)}
                className="flex-shrink-0 w-[160px] bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <MealImage url={recipe.imageUrl} name={recipe.mealName} />
                <div className="p-2.5">
                  <p className="text-[10px] text-gray-400">{mealTypeLabels[recipe.mealType]?.emoji} {mealTypeLabels[recipe.mealType]?.label}</p>
                  <p className="text-xs font-semibold text-gray-800 line-clamp-2 mt-0.5">{recipe.mealName}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recipe Modal */}
      <AnimatePresence>
        {viewingRecipe && (
          <RecipeView recipe={viewingRecipe} onClose={() => setViewingRecipe(null)} />
        )}
      </AnimatePresence>

      {/* Grocery List Modal */}
      <AnimatePresence>
        {showGroceryList && mealPlan.groceryList.length > 0 && (
          <GroceryListView
            groceryList={mealPlan.groceryList}
            onToggle={toggleGroceryItem}
            onClose={() => setShowGroceryList(false)}
            currency={currency}
            budget={groceryBudget}
            frequency={groceryFrequency}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
