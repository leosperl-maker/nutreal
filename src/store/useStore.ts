import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MacroTargets } from '../lib/nutrition';
import { calculateNutritionPlan } from '../lib/nutrition';

export interface FoodItem { name: string; calories: number; protein_g: number; fat_g: number; carbs_g: number; fiber_g: number; quantity_g: number; }
export interface Meal { id: string; date: string; mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner'; dishName: string; photoUrl?: string; foods: FoodItem[]; totalCalories: number; totalProtein: number; totalFat: number; totalCarbs: number; totalFiber: number; aiTip?: string; createdAt: string; }
export interface WeightLog { date: string; weight: number; }
export interface WaterLog { date: string; amount: number; }
export interface RecipeStep { step: number; instruction: string; }
export interface RecipeIngredient { name: string; quantity: string; unit: string; }
export interface Recipe { mealName: string; mealType: string; servings: number; prepTime: string; cookTime: string; ingredients: RecipeIngredient[]; steps: RecipeStep[]; imageUrl: string; }
export interface GroceryItem { name: string; quantity: string; unit: string; category: string; checked: boolean; }
export interface MealPlanOption { name: string; ingredients: string[]; calories: number; protein_g: number; fat_g: number; carbs_g: number; fiber_g: number; imageUrl: string; prepTime?: string; recipe?: Recipe; benefitsNote?: string; }
export interface MealPlanSlot { type: 'breakfast' | 'lunch' | 'snack' | 'dinner'; options: MealPlanOption[]; selectedIndex: number | null; }
export interface MealPlanDay { date: string; dayName: string; slots: MealPlanSlot[]; }
export interface MealPlan { weekStart: string; days: MealPlanDay[]; calorieBudget: number; validated: boolean; recipes: Recipe[]; groceryList: GroceryItem[]; duration: number; }
export interface ProductScan { barcode: string; productName: string; brand: string; score: number; nutriscoreGrade: string; imageUrl: string; scannedAt: string; }
export interface SportSession { id: string; date: string; type: string; name: string; duration_min: number; caloriesBurned: number; notes?: string; createdAt: string; }

export interface FamilyMember {
  id: string;
  name: string;
  role: 'chef' | 'conjoint' | 'enfant' | 'frere_soeur' | 'autre';
  sex: 'M' | 'F';
  birthDate: string;
  weightKg: number;
  heightCm: number;
  activityLevel: string;
  dailyCalorieBudget: number;
}
export interface Family {
  id: string;
  inviteCode: string;
  members: FamilyMember[];
  chefId: string;
}

function categorizeIngredient(ingredient: string): string {
  const ing = ingredient.toLowerCase();
  if (['eau','jus','thé','café','boisson','lait d\'amande'].some(b => ing.includes(b))) return '🥤 Boissons';
  if (['poulet','boeuf','bœuf','porc','saumon','thon','morue','crevette','poisson','dinde','veau','tofu','lentille','pois chiche','haricot','lambi','chatrou','langouste','boudin','saucisse'].some(p => ing.includes(p))) return '🥩 Protéines';
  if (ing.includes('œuf') || ing.includes('oeuf')) return '🥚 Œufs';
  if (['lait','yaourt','fromage','crème','beurre','mozzarella','parmesan'].some(d => ing.includes(d))) return '🧀 Produits laitiers';
  if (['riz','pâte','pain','quinoa','avoine','farine','semoule','pomme de terre','patate','igname','manioc','banane plantain','fruit à pain'].some(s => ing.includes(s))) return '🌾 Féculents';
  if (['huile','amande','noix','graine','chia','cacahuète','olive','sésame'].some(f => ing.includes(f))) return '🥜 Matières grasses';
  if (['tomate','carotte','courgette','poivron','oignon','ail','épinard','brocoli','concombre','chou','pomme','banane','mangue','citron','avocat','orange','ananas','christophine','giraumon','gingembre','persil','basilic','thym'].some(p => ing.includes(p))) return '🥬 Fruits & Légumes';
  if (['sauce','vinaigre','moutarde','miel','sucre','sel','poivre','épice','colombo','curry','bouillon','lait de coco','chocolat'].some(p => ing.includes(p))) return '🫙 Épicerie';
  return '🛒 Autres';
}

function getRealisticQty(ing: string, cat: string): { quantity: string; unit: string } {
  const i = ing.toLowerCase();
  if (i.includes('œuf') || i.includes('oeuf')) return { quantity: '2', unit: 'unités' };
  if (i.includes('huile') || i.includes('vinaigre')) return { quantity: '15', unit: 'ml' };
  if (['épice','sel','poivre','colombo','curry','curcuma'].some(s => i.includes(s))) return { quantity: '5', unit: 'g' };
  if (['persil','basilic','thym','menthe','ciboulette'].some(s => i.includes(s))) return { quantity: '10', unit: 'g' };
  if (i.includes('lait de coco')) return { quantity: '200', unit: 'ml' };
  if (cat === '🥩 Protéines') return { quantity: '150', unit: 'g' };
  if (cat === '🌾 Féculents') return { quantity: '80', unit: 'g' };
  if (cat === '🥬 Fruits & Légumes') return { quantity: '200', unit: 'g' };
  return { quantity: '100', unit: 'g' };
}

interface AppState {
  isAuthenticated: boolean; userId: string | null; onboardingComplete: boolean;
  profile: { name: string; sex: 'M' | 'F'; birthDate: string; heightCm: number; weightCurrentKg: number; weightGoalKg: number; activityLevel: string; medicalConditions: string[]; dietPreferences: string[]; dailyCalorieBudget: number; macroTargets: MacroTargets; tdee: number; estimatedGoalDate: string; location: string; groceryBudget: number; groceryCurrency: string; foodPreferences: string[]; groceryFrequency: string; cookingTime: string; householdSize: number; familyMode: boolean; } | null;
  meals: Meal[]; waterLogs: WaterLog[]; weightLogs: WeightLog[]; dailySteps: number; stepsGoal: number;
  mealPlan: MealPlan | null; productScans: ProductScan[]; sportSessions: SportSession[];
  family: Family | null;
  streak: number; toastMessage: string | null;
  setAuth: (a: boolean, u: string | null) => void; setOnboardingComplete: (c: boolean) => void;
  setProfile: (p: AppState['profile']) => void; updateProfile: (u: Partial<NonNullable<AppState['profile']>>) => void;
  recalculateNutrition: () => void; addMeal: (m: Meal) => void; removeMeal: (id: string) => void;
  addWater: (d: string, a: number) => void; addWeightLog: (d: string, w: number) => void;
  setDailySteps: (s: number) => void; setMealPlan: (p: MealPlan) => void;
  selectMealOption: (d: number, s: number, o: number) => void; validateMealPlan: () => void;
  toggleGroceryItem: (i: number) => void; addProductScan: (s: ProductScan) => void;
  addSportSession: (s: SportSession) => void; removeSportSession: (id: string) => void;
  setFamily: (f: Family | null) => void; addFamilyMember: (m: FamilyMember) => void; removeFamilyMember: (id: string) => void; updateFamilyMember: (id: string, u: Partial<FamilyMember>) => void;
  calculateStreak: () => void; getMealsForDate: (d: string) => Meal[]; getWaterForDate: (d: string) => number;
  getTodayCalories: () => { consumed: number; protein: number; fat: number; carbs: number; fiber: number };
  getSportForDate: (d: string) => SportSession[]; showToast: (m: string) => void; clearToast: () => void;
}

export const useStore = create<AppState>()(persist((set, get) => ({
  isAuthenticated: false, userId: null, onboardingComplete: false, profile: null,
  meals: [], waterLogs: [], weightLogs: [], dailySteps: 0, stepsGoal: 10000,
  mealPlan: null, productScans: [], sportSessions: [], family: null, streak: 0, toastMessage: null,

  setAuth: (a, u) => set({ isAuthenticated: a, userId: u }),
  setOnboardingComplete: (c) => set({ onboardingComplete: c }),
  setProfile: (p) => set({ profile: p }),
  updateProfile: (updates) => { set((s) => s.profile ? { profile: { ...s.profile, ...updates } } : s); get().recalculateNutrition(); },
  recalculateNutrition: () => set((s) => {
    if (!s.profile) return s;
    const p = s.profile;
    const plan = calculateNutritionPlan({ name: p.name, sex: p.sex, birthDate: p.birthDate, heightCm: p.heightCm, weightCurrentKg: p.weightCurrentKg, weightGoalKg: p.weightGoalKg, activityLevel: p.activityLevel, medicalConditions: p.medicalConditions, dietPreferences: p.dietPreferences, location: p.location || '', groceryBudget: p.groceryBudget || 0, groceryCurrency: p.groceryCurrency || '€', foodPreferences: p.foodPreferences || [], groceryFrequency: p.groceryFrequency || 'weekly' });
    return { profile: { ...p, dailyCalorieBudget: plan.dailyCalorieBudget, macroTargets: plan.macroTargets, tdee: plan.tdee, estimatedGoalDate: plan.estimatedGoalDate } };
  }),
  addMeal: (m) => set((s) => ({ meals: [...s.meals, m] })),
  removeMeal: (id) => set((s) => ({ meals: s.meals.filter(m => m.id !== id) })),
  addWater: (d, a) => set((s) => { const e = s.waterLogs.find(w => w.date === d); if (e) return { waterLogs: s.waterLogs.map(w => w.date === d ? { ...w, amount: w.amount + a } : w) }; return { waterLogs: [...s.waterLogs, { date: d, amount: a }] }; }),
  addWeightLog: (d, w) => set((s) => { const e = s.weightLogs.find(l => l.date === d); if (e) return { weightLogs: s.weightLogs.map(l => l.date === d ? { ...l, weight: w } : l) }; return { weightLogs: [...s.weightLogs, { date: d, weight: w }] }; }),
  setDailySteps: (s) => set({ dailySteps: s }),
  setMealPlan: (p) => set({ mealPlan: p }),
  selectMealOption: (di, si, oi) => set((s) => {
    if (!s.mealPlan) return s;
    const np = { ...s.mealPlan }; const nd = [...np.days]; const day = { ...nd[di] }; const ns = [...day.slots]; const slot = { ...ns[si] };
    slot.selectedIndex = slot.selectedIndex === oi ? null : oi; ns[si] = slot; day.slots = ns; nd[di] = day; np.days = nd;
    return { mealPlan: np };
  }),
  validateMealPlan: () => set((s) => {
    if (!s.mealPlan) return s;
    const np = { ...s.mealPlan, validated: true }; const recipes: Recipe[] = [];
    const iMap = new Map<string, { quantity: number; unit: string; category: string }>();
    const freqMult = s.profile?.groceryFrequency === 'monthly' ? 4 : s.profile?.groceryFrequency === 'biweekly' ? 2 : 1;
    const householdMult = (s.profile?.familyMode && s.profile?.householdSize > 1) ? s.profile.householdSize : 1;
    const mult = freqMult * householdMult;
    for (const day of np.days) for (const slot of day.slots) {
      if (slot.selectedIndex !== null) {
        const opt = slot.options[slot.selectedIndex];
        const ri = opt.ingredients.map(ig => { const c = categorizeIngredient(ig); const q = getRealisticQty(ig, c); return { name: ig, quantity: q.quantity, unit: q.unit }; });
        recipes.push({ mealName: opt.name, mealType: slot.type, servings: 1, prepTime: '15 min', cookTime: '25 min', ingredients: ri, steps: [{ step: 1, instruction: `Préparer : ${opt.ingredients.join(', ')}.` }, { step: 2, instruction: 'Cuire et assembler.' }], imageUrl: opt.imageUrl });
        for (const ig of opt.ingredients) { const k = ig.toLowerCase().trim(); const c = categorizeIngredient(ig); const q = getRealisticQty(ig, c); const n = parseFloat(q.quantity) || 100; const ex = iMap.get(k); if (ex) ex.quantity += n; else iMap.set(k, { quantity: n * mult, unit: q.unit, category: c }); }
      }
    }
    const groceryList: GroceryItem[] = Array.from(iMap.entries()).map(([name, d]) => {
      let dq: string, du = d.unit;
      if (du === 'g' && d.quantity >= 1000) { dq = (d.quantity / 1000).toFixed(1); du = 'kg'; }
      else if (du === 'ml' && d.quantity >= 1000) { dq = (d.quantity / 1000).toFixed(1); du = 'L'; }
      else dq = Math.round(d.quantity).toString();
      return { name: name.charAt(0).toUpperCase() + name.slice(1), quantity: dq, unit: du, category: d.category, checked: false };
    }).sort((a, b) => a.category.localeCompare(b.category));
    np.recipes = recipes; np.groceryList = groceryList;
    return { mealPlan: np };
  }),
  toggleGroceryItem: (i) => set((s) => { if (!s.mealPlan) return s; const np = { ...s.mealPlan }; const nl = [...np.groceryList]; nl[i] = { ...nl[i], checked: !nl[i].checked }; np.groceryList = nl; return { mealPlan: np }; }),
  addProductScan: (scan) => set((s) => ({ productScans: [scan, ...s.productScans].slice(0, 50) })),
  addSportSession: (session) => set((s) => ({ sportSessions: [session, ...s.sportSessions] })),
  removeSportSession: (id) => set((s) => ({ sportSessions: s.sportSessions.filter(ss => ss.id !== id) })),
  setFamily: (f) => set({ family: f }),
  addFamilyMember: (m) => set((s) => s.family ? { family: { ...s.family, members: [...s.family.members, m] } } : s),
  removeFamilyMember: (id) => set((s) => s.family ? { family: { ...s.family, members: s.family.members.filter(m => m.id !== id) } } : s),
  updateFamilyMember: (id, u) => set((s) => s.family ? { family: { ...s.family, members: s.family.members.map(m => m.id === id ? { ...m, ...u } : m) } } : s),
  calculateStreak: () => { const { meals } = get(); const today = new Date(); let streak = 0; for (let i = 0; i < 365; i++) { const d = new Date(today); d.setDate(d.getDate() - i); if (meals.some(m => m.date === d.toISOString().split('T')[0])) streak++; else if (i > 0) break; } set({ streak }); },
  getMealsForDate: (d) => get().meals.filter(m => m.date === d),
  getWaterForDate: (d) => get().waterLogs.find(w => w.date === d)?.amount || 0,
  getTodayCalories: () => { const t = new Date().toISOString().split('T')[0]; const tm = get().meals.filter(m => m.date === t); return { consumed: tm.reduce((s, m) => s + m.totalCalories, 0), protein: tm.reduce((s, m) => s + m.totalProtein, 0), fat: tm.reduce((s, m) => s + m.totalFat, 0), carbs: tm.reduce((s, m) => s + m.totalCarbs, 0), fiber: tm.reduce((s, m) => s + m.totalFiber, 0) }; },
  getSportForDate: (d) => get().sportSessions.filter(s => s.date === d),
  showToast: (m) => { set({ toastMessage: m }); setTimeout(() => set({ toastMessage: null }), 3000); },
  clearToast: () => set({ toastMessage: null }),
}), { name: 'nutreal-storage' }));
