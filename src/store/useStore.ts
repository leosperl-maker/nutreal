import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MacroTargets } from '../lib/nutrition';
import { calculateNutritionPlan, calculateAge } from '../lib/nutrition';

export interface FoodItem {
  name: string;
  calories: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
  fiber_g: number;
  quantity_g: number;
}

export interface Meal {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  dishName: string;
  photoUrl?: string;
  foods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  totalFiber: number;
  aiTip?: string;
  createdAt: string;
}

export interface WeightLog {
  date: string;
  weight: number;
}

export interface WaterLog {
  date: string;
  amount: number;
}

export interface RecipeStep {
  step: number;
  instruction: string;
}

export interface RecipeIngredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface Recipe {
  mealName: string;
  mealType: string;
  servings: number;
  prepTime: string;
  cookTime: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  imageUrl: string;
}

export interface GroceryItem {
  name: string;
  quantity: string;
  unit: string;
  category: string;
  checked: boolean;
}

export interface MealPlanOption {
  name: string;
  ingredients: string[];
  calories: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
  fiber_g: number;
  imageUrl: string;
  recipe?: Recipe;
}

export interface MealPlanSlot {
  type: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  options: MealPlanOption[];
  selectedIndex: number | null;
}

export interface MealPlanDay {
  date: string;
  dayName: string;
  slots: MealPlanSlot[];
}

export interface MealPlan {
  weekStart: string;
  days: MealPlanDay[];
  calorieBudget: number;
  validated: boolean;
  recipes: Recipe[];
  groceryList: GroceryItem[];
}

export interface ProductScan {
  barcode: string;
  productName: string;
  brand: string;
  score: number;
  nutriscoreGrade: string;
  imageUrl: string;
  scannedAt: string;
}

export interface SportSession {
  id: string;
  date: string;
  type: string;
  name: string;
  duration_min: number;
  caloriesBurned: number;
  notes?: string;
  createdAt: string;
}

interface AppState {
  isAuthenticated: boolean;
  userId: string | null;
  onboardingComplete: boolean;
  profile: {
    name: string;
    sex: 'M' | 'F';
    birthDate: string;
    heightCm: number;
    weightCurrentKg: number;
    weightGoalKg: number;
    activityLevel: string;
    medicalConditions: string[];
    dietPreferences: string[];
    dailyCalorieBudget: number;
    macroTargets: MacroTargets;
    tdee: number;
    estimatedGoalDate: string;
    location: string;
    groceryBudget: number;
    groceryCurrency: string;
    foodPreferences: string[];
    groceryFrequency: string;
  } | null;
  meals: Meal[];
  waterLogs: WaterLog[];
  weightLogs: WeightLog[];
  dailySteps: number;
  stepsGoal: number;
  mealPlan: MealPlan | null;
  productScans: ProductScan[];
  sportSessions: SportSession[];
  streak: number;
  toastMessage: string | null;

  setAuth: (isAuth: boolean, userId: string | null) => void;
  setOnboardingComplete: (complete: boolean) => void;
  setProfile: (profile: AppState['profile']) => void;
  updateProfile: (updates: Partial<NonNullable<AppState['profile']>>) => void;
  recalculateNutrition: () => void;
  addMeal: (meal: Meal) => void;
  removeMeal: (id: string) => void;
  addWater: (date: string, amount: number) => void;
  addWeightLog: (date: string, weight: number) => void;
  setDailySteps: (steps: number) => void;
  setMealPlan: (plan: MealPlan) => void;
  selectMealOption: (dayIndex: number, slotIndex: number, optionIndex: number) => void;
  validateMealPlan: () => void;
  toggleGroceryItem: (index: number) => void;
  addProductScan: (scan: ProductScan) => void;
  addSportSession: (session: SportSession) => void;
  removeSportSession: (id: string) => void;
  calculateStreak: () => void;
  getMealsForDate: (date: string) => Meal[];
  getWaterForDate: (date: string) => number;
  getTodayCalories: () => { consumed: number; protein: number; fat: number; carbs: number; fiber: number };
  getSportForDate: (date: string) => SportSession[];
  showToast: (message: string) => void;
  clearToast: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      userId: null,
      onboardingComplete: false,
      profile: null,
      meals: [],
      waterLogs: [],
      weightLogs: [],
      dailySteps: 0,
      stepsGoal: 10000,
      mealPlan: null,
      productScans: [],
      sportSessions: [],
      streak: 0,
      toastMessage: null,

      setAuth: (isAuth, userId) => set({ isAuthenticated: isAuth, userId }),
      setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),
      setProfile: (profile) => set({ profile }),

      updateProfile: (updates) => {
        set((state) => {
          if (!state.profile) return state;
          const newProfile = { ...state.profile, ...updates };
          return { profile: newProfile };
        });
        get().recalculateNutrition();
      },

      recalculateNutrition: () => set((state) => {
        if (!state.profile) return state;
        const p = state.profile;
        const plan = calculateNutritionPlan({
          name: p.name,
          sex: p.sex,
          birthDate: p.birthDate,
          heightCm: p.heightCm,
          weightCurrentKg: p.weightCurrentKg,
          weightGoalKg: p.weightGoalKg,
          activityLevel: p.activityLevel,
          medicalConditions: p.medicalConditions,
          dietPreferences: p.dietPreferences,
          location: p.location || '',
          groceryBudget: p.groceryBudget || 0,
          groceryCurrency: p.groceryCurrency || '€',
          foodPreferences: p.foodPreferences || [],
          groceryFrequency: p.groceryFrequency || 'weekly',
        });
        return {
          profile: {
            ...p,
            dailyCalorieBudget: plan.dailyCalorieBudget,
            macroTargets: plan.macroTargets,
            tdee: plan.tdee,
            estimatedGoalDate: plan.estimatedGoalDate,
          },
        };
      }),

      addMeal: (meal) => set((state) => ({ meals: [...state.meals, meal] })),
      removeMeal: (id) => set((state) => ({ meals: state.meals.filter(m => m.id !== id) })),

      addWater: (date, amount) => set((state) => {
        const existing = state.waterLogs.find(w => w.date === date);
        if (existing) {
          return { waterLogs: state.waterLogs.map(w => w.date === date ? { ...w, amount: w.amount + amount } : w) };
        }
        return { waterLogs: [...state.waterLogs, { date, amount }] };
      }),

      addWeightLog: (date, weight) => set((state) => {
        const existing = state.weightLogs.find(w => w.date === date);
        if (existing) {
          return { weightLogs: state.weightLogs.map(w => w.date === date ? { ...w, weight } : w) };
        }
        return { weightLogs: [...state.weightLogs, { date, weight }] };
      }),

      setDailySteps: (steps) => set({ dailySteps: steps }),
      setMealPlan: (plan) => set({ mealPlan: plan }),

      selectMealOption: (dayIndex, slotIndex, optionIndex) => set((state) => {
        if (!state.mealPlan) return state;
        const newPlan = { ...state.mealPlan };
        const newDays = [...newPlan.days];
        const newDay = { ...newDays[dayIndex] };
        const newSlots = [...newDay.slots];
        const newSlot = { ...newSlots[slotIndex] };
        newSlot.selectedIndex = newSlot.selectedIndex === optionIndex ? null : optionIndex;
        newSlots[slotIndex] = newSlot;
        newDay.slots = newSlots;
        newDays[dayIndex] = newDay;
        newPlan.days = newDays;
        return { mealPlan: newPlan };
      }),

      validateMealPlan: () => set((state) => {
        if (!state.mealPlan) return state;
        const newPlan = { ...state.mealPlan, validated: true };
        // Generate recipes and grocery list from selected meals
        const recipes: Recipe[] = [];
        const ingredientMap: Map<string, { quantity: number; unit: string; category: string }> = new Map();

        const frequency = state.profile?.groceryFrequency || 'weekly';
        const weeksMultiplier = frequency === 'monthly' ? 4 : frequency === 'biweekly' ? 2 : 1;

        for (const day of newPlan.days) {
          for (const slot of day.slots) {
            if (slot.selectedIndex !== null) {
              const option = slot.options[slot.selectedIndex];
              // Generate recipe
              const recipe: Recipe = {
                mealName: option.name,
                mealType: slot.type,
                servings: 1,
                prepTime: '15 min',
                cookTime: '25 min',
                ingredients: option.ingredients.map(ing => ({
                  name: ing,
                  quantity: '100',
                  unit: 'g',
                })),
                steps: generateRecipeSteps(option.name, option.ingredients),
                imageUrl: option.imageUrl,
              };
              recipes.push(recipe);

              // Aggregate ingredients for grocery list
              for (const ing of option.ingredients) {
                const key = ing.toLowerCase().trim();
                const existing = ingredientMap.get(key);
                if (existing) {
                  existing.quantity += 100 * weeksMultiplier;
                } else {
                  ingredientMap.set(key, {
                    quantity: 100 * weeksMultiplier,
                    unit: 'g',
                    category: categorizeIngredient(ing),
                  });
                }
              }
            }
          }
        }

        const groceryList: GroceryItem[] = Array.from(ingredientMap.entries()).map(([name, data]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          quantity: data.quantity >= 1000 ? `${(data.quantity / 1000).toFixed(1)}` : `${data.quantity}`,
          unit: data.quantity >= 1000 ? 'kg' : 'g',
          category: data.category,
          checked: false,
        }));

        // Sort by category
        groceryList.sort((a, b) => a.category.localeCompare(b.category));

        newPlan.recipes = recipes;
        newPlan.groceryList = groceryList;

        return { mealPlan: newPlan };
      }),

      toggleGroceryItem: (index) => set((state) => {
        if (!state.mealPlan) return state;
        const newPlan = { ...state.mealPlan };
        const newList = [...newPlan.groceryList];
        newList[index] = { ...newList[index], checked: !newList[index].checked };
        newPlan.groceryList = newList;
        return { mealPlan: newPlan };
      }),

      addProductScan: (scan) => set((state) => ({
        productScans: [scan, ...state.productScans].slice(0, 50),
      })),

      addSportSession: (session) => set((state) => ({
        sportSessions: [session, ...state.sportSessions],
      })),

      removeSportSession: (id) => set((state) => ({
        sportSessions: state.sportSessions.filter(s => s.id !== id),
      })),

      calculateStreak: () => {
        const { meals } = get();
        const today = new Date();
        let streak = 0;
        for (let i = 0; i < 365; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          const hasMeals = meals.some(m => m.date === dateStr);
          if (hasMeals) {
            streak++;
          } else if (i > 0) {
            break;
          }
        }
        set({ streak });
      },

      getMealsForDate: (date) => get().meals.filter(m => m.date === date),
      getWaterForDate: (date) => {
        const log = get().waterLogs.find(w => w.date === date);
        return log?.amount || 0;
      },

      getTodayCalories: () => {
        const today = new Date().toISOString().split('T')[0];
        const todayMeals = get().meals.filter(m => m.date === today);
        return {
          consumed: todayMeals.reduce((sum, m) => sum + m.totalCalories, 0),
          protein: todayMeals.reduce((sum, m) => sum + m.totalProtein, 0),
          fat: todayMeals.reduce((sum, m) => sum + m.totalFat, 0),
          carbs: todayMeals.reduce((sum, m) => sum + m.totalCarbs, 0),
          fiber: todayMeals.reduce((sum, m) => sum + m.totalFiber, 0),
        };
      },

      getSportForDate: (date) => get().sportSessions.filter(s => s.date === date),

      showToast: (message) => {
        set({ toastMessage: message });
        setTimeout(() => set({ toastMessage: null }), 3000);
      },

      clearToast: () => set({ toastMessage: null }),
    }),
    { name: 'nutrilens-storage' }
  )
);

// Helper: generate recipe steps from dish name and ingredients
function generateRecipeSteps(dishName: string, ingredients: string[]): RecipeStep[] {
  const steps: RecipeStep[] = [];
  const name = dishName.toLowerCase();

  steps.push({ step: 1, instruction: `Préparer tous les ingrédients : ${ingredients.join(', ')}.` });

  if (name.includes('salade') || name.includes('bowl')) {
    steps.push({ step: 2, instruction: 'Laver et couper les légumes en morceaux.' });
    steps.push({ step: 3, instruction: 'Préparer la protéine (cuire si nécessaire) et laisser refroidir.' });
    steps.push({ step: 4, instruction: 'Assembler tous les ingrédients dans un bol.' });
    steps.push({ step: 5, instruction: 'Assaisonner avec la vinaigrette ou sauce et servir.' });
  } else if (name.includes('soupe') || name.includes('velouté')) {
    steps.push({ step: 2, instruction: 'Éplucher et couper les légumes en morceaux.' });
    steps.push({ step: 3, instruction: 'Faire revenir les oignons dans un peu d\'huile d\'olive.' });
    steps.push({ step: 4, instruction: 'Ajouter les légumes et couvrir d\'eau ou de bouillon.' });
    steps.push({ step: 5, instruction: 'Cuire 25 minutes à feu moyen, puis mixer.' });
    steps.push({ step: 6, instruction: 'Assaisonner et servir chaud.' });
  } else if (name.includes('gratin')) {
    steps.push({ step: 2, instruction: 'Préchauffer le four à 180°C.' });
    steps.push({ step: 3, instruction: 'Couper les légumes en tranches fines.' });
    steps.push({ step: 4, instruction: 'Disposer les couches dans un plat à gratin.' });
    steps.push({ step: 5, instruction: 'Napper de sauce béchamel ou crème et parsemer de fromage.' });
    steps.push({ step: 6, instruction: 'Enfourner 30 minutes jusqu\'à ce que le dessus soit doré.' });
  } else if (name.includes('smoothie') || name.includes('porridge') || name.includes('yaourt')) {
    steps.push({ step: 2, instruction: 'Mesurer les portions de chaque ingrédient.' });
    steps.push({ step: 3, instruction: name.includes('smoothie') ? 'Mixer tous les ingrédients jusqu\'à obtenir une texture lisse.' : 'Mélanger les ingrédients dans un bol.' });
    steps.push({ step: 4, instruction: 'Ajouter les toppings et servir immédiatement.' });
  } else if (name.includes('curry') || name.includes('colombo')) {
    steps.push({ step: 2, instruction: 'Couper la viande ou les légumes en morceaux.' });
    steps.push({ step: 3, instruction: 'Faire revenir les oignons et l\'ail dans de l\'huile.' });
    steps.push({ step: 4, instruction: 'Ajouter les épices et faire torréfier 1 minute.' });
    steps.push({ step: 5, instruction: 'Ajouter la protéine et faire dorer.' });
    steps.push({ step: 6, instruction: 'Verser le lait de coco, couvrir et mijoter 25 minutes.' });
    steps.push({ step: 7, instruction: 'Servir avec du riz.' });
  } else if (name.includes('wok') || name.includes('sauté')) {
    steps.push({ step: 2, instruction: 'Couper tous les légumes et la protéine en lamelles.' });
    steps.push({ step: 3, instruction: 'Chauffer le wok à feu vif avec un filet d\'huile.' });
    steps.push({ step: 4, instruction: 'Saisir la protéine 3-4 minutes, réserver.' });
    steps.push({ step: 5, instruction: 'Faire sauter les légumes 3 minutes en remuant.' });
    steps.push({ step: 6, instruction: 'Remettre la protéine, ajouter la sauce et servir.' });
  } else if (name.includes('pancake') || name.includes('crêpe') || name.includes('pain perdu')) {
    steps.push({ step: 2, instruction: 'Mélanger les ingrédients secs dans un bol.' });
    steps.push({ step: 3, instruction: 'Ajouter les ingrédients liquides et fouetter.' });
    steps.push({ step: 4, instruction: 'Chauffer une poêle antiadhésive à feu moyen.' });
    steps.push({ step: 5, instruction: 'Cuire chaque portion 2-3 minutes de chaque côté.' });
    steps.push({ step: 6, instruction: 'Garnir et servir chaud.' });
  } else {
    // Generic cooking steps
    steps.push({ step: 2, instruction: 'Laver, éplucher et couper les légumes.' });
    steps.push({ step: 3, instruction: 'Chauffer une poêle ou casserole avec un filet d\'huile d\'olive.' });
    steps.push({ step: 4, instruction: 'Cuire la protéine principale à feu moyen pendant 8-10 minutes.' });
    steps.push({ step: 5, instruction: 'Ajouter les légumes et assaisonnements, cuire 5 minutes.' });
    steps.push({ step: 6, instruction: 'Dresser l\'assiette et servir.' });
  }

  return steps;
}

// Helper: categorize ingredient for grocery list sections
function categorizeIngredient(ingredient: string): string {
  const ing = ingredient.toLowerCase();
  const categories: Record<string, string[]> = {
    '🥩 Viandes & Poissons': ['poulet', 'boeuf', 'bœuf', 'porc', 'saumon', 'thon', 'cabillaud', 'morue', 'crevette', 'poisson', 'jambon', 'dinde', 'veau'],
    '🥬 Fruits & Légumes': ['tomate', 'carotte', 'courgette', 'poivron', 'oignon', 'ail', 'épinard', 'salade', 'laitue', 'brocoli', 'haricot', 'aubergine', 'champignon', 'pomme', 'banane', 'mangue', 'kiwi', 'citron', 'avocat', 'christophine', 'giraumon', 'igname', 'concombre', 'roquette', 'ciboulette', 'herbe', 'piment', 'fruit'],
    '🧀 Produits laitiers': ['lait', 'fromage', 'yaourt', 'crème', 'beurre', 'mozzarella', 'parmesan', 'gruyère', 'chèvre'],
    '🌾 Féculents & Céréales': ['riz', 'pâte', 'quinoa', 'flocon', 'pain', 'farine', 'semoule', 'nouille', 'tortilla', 'granola', 'lentille', 'pois chiche', 'pomme de terre', 'patate'],
    '🫙 Épicerie': ['huile', 'vinaigre', 'sauce', 'épice', 'sel', 'poivre', 'miel', 'sucre', 'sirop', 'chocolat', 'coco', 'pesto', 'bouillon', 'moutarde', 'cannelle', 'vanille', 'muscade', 'colombo', 'curry'],
    '🥜 Fruits secs & Graines': ['amande', 'noix', 'graine', 'chia', 'lin', 'cacahuète', 'raisin sec', 'tahini', 'sésame'],
    '🥤 Boissons': ['eau', 'jus', 'thé', 'café'],
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(k => ing.includes(k))) return category;
  }
  return '🛒 Autres';
}
