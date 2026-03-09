import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MacroTargets } from '../lib/nutrition';
import { calculateNutritionPlan } from '../lib/nutrition';

// ── Existing interfaces ──
export interface FoodItem { name: string; calories: number; protein_g: number; fat_g: number; carbs_g: number; fiber_g: number; quantity_g: number; }
export interface Meal { id: string; date: string; mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner'; dishName: string; photoUrl?: string; foods: FoodItem[]; totalCalories: number; totalProtein: number; totalFat: number; totalCarbs: number; totalFiber: number; aiTip?: string; createdAt: string; }
export interface WeightLog { date: string; weight: number; }
export interface WaterLog { date: string; amount: number; }
export interface RecipeStep { step: number; instruction: string; }
export interface RecipeIngredient { name: string; quantity: string; unit: string; }
export interface Recipe { mealName: string; mealType: string; servings: number; prepTime: string; cookTime: string; ingredients: RecipeIngredient[]; steps: RecipeStep[]; imageUrl: string; }
export interface GroceryItem { name: string; quantity: string; unit: string; category: string; checked: boolean; }
export interface MealPlanOption { name: string; ingredients: string[]; calories: number; protein_g: number; fat_g: number; carbs_g: number; fiber_g: number; imageUrl: string; prepTime?: string; price?: number; recipe?: Recipe; benefitsNote?: string; }
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

// ── Gamification interfaces ──

export interface DetailedHealthIssue {
  condition: string;
  location: string;
  duration: string;
  doctorConsulted: boolean;
  treatments: string[];
  freeText?: string;
}

export interface SportRestriction {
  sportId: string;
  status: 'locked' | 'caution' | 'unlocked';
  reason: string;
  unlockCondition?: string;
  estimatedWeeks?: number;
}

export interface RehabExercise {
  name: string;
  description: string;
  duration: string;
  reps?: string;
}

export interface RehabProgram {
  id: string;
  name: string;
  condition: string;
  totalWeeks: number;
  currentWeek: number;
  exercises: RehabExercise[];
  milestones: { week: number; description: string; unlockedSports?: string[] }[];
  completedSessions: number;
  isCompleted: boolean;
}

export interface AIMission {
  id: string;
  title: string;
  description: string;
  emoji: string;
  xpReward: number;
  type: 'water' | 'food' | 'sport' | 'wellness' | 'walking' | 'custom';
  isCompleted: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface AIHealthAnalysis {
  sportRestrictions: SportRestriction[];
  rehabPrograms: RehabProgram[];
  healthInsights: string[];
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  analyzedAt: string;
}

export interface AvatarConfig {
  skinColor: string;
  hairColor: string;
  hairStyle: string;
  eyeColor: string;
  outfit: string;
  outfitColor: string;
  accessory: string | null;
  pet: string | null;
  unlockedItems: string[];
  avatarUrl: string | null; // Ready Player Me GLB URL
}

export interface CheckIn {
  date: string;
  mood: string;
  painLevel: number;
  notes: string;
  conditionEvolution: { condition: string; status: 'better' | 'same' | 'worse' }[];
}

// ── Titles unlockable by level ──
export const UNLOCKABLE_TITLES: { id: string; name: string; requiredLevel: number; special?: string }[] = [
  { id: 'title_1', name: 'Débutant motivé', requiredLevel: 1 },
  { id: 'title_3', name: 'Guerrier du matin', requiredLevel: 3 },
  { id: 'title_5', name: 'Maître de l\'hydratation', requiredLevel: 5 },
  { id: 'title_7', name: 'Athlète en devenir', requiredLevel: 7 },
  { id: 'title_10_m', name: 'Iron Man', requiredLevel: 10 },
  { id: 'title_10_f', name: 'Wonder Woman', requiredLevel: 10 },
  { id: 'title_15', name: 'Légende Nutreal', requiredLevel: 15 },
  { id: 'title_streak_30', name: 'Flamme éternelle', requiredLevel: 0, special: '30_day_streak' },
  { id: 'title_meals_100', name: 'Chef étoilé', requiredLevel: 0, special: '100_meals_logged' },
  { id: 'title_rehab', name: 'Phoenix', requiredLevel: 0, special: 'rehab_complete' },
];

// ── XP formulas ──
export function xpForNextLevel(level: number): number {
  return level * 200 + 100;
}

export function totalXpForLevel(targetLevel: number): number {
  let total = 0;
  for (let l = 1; l < targetLevel; l++) total += xpForNextLevel(l);
  return total;
}

// ── Grocery helpers ──

function categorizeIngredient(ingredient: string): string {
  const ing = ingredient.toLowerCase();
  if (['eau','jus','thé','café','boisson','lait d\'amande'].some(b => ing.includes(b))) return 'Boissons';
  if (['poulet','boeuf','bœuf','porc','saumon','thon','morue','crevette','poisson','dinde','veau','tofu','lentille','pois chiche','haricot','lambi','chatrou','langouste','boudin','saucisse'].some(p => ing.includes(p))) return 'Protéines';
  if (ing.includes('œuf') || ing.includes('oeuf')) return 'Oeufs';
  if (['lait','yaourt','fromage','crème','beurre','mozzarella','parmesan'].some(d => ing.includes(d))) return 'Produits laitiers';
  if (['riz','pâte','pain','quinoa','avoine','farine','semoule','pomme de terre','patate','igname','manioc','banane plantain','fruit à pain'].some(s => ing.includes(s))) return 'Féculents';
  if (['huile','amande','noix','graine','chia','cacahuète','olive','sésame'].some(f => ing.includes(f))) return 'Matières grasses';
  if (['tomate','carotte','courgette','poivron','oignon','ail','épinard','brocoli','concombre','chou','pomme','banane','mangue','citron','avocat','orange','ananas','christophine','giraumon','gingembre','persil','basilic','thym'].some(p => ing.includes(p))) return 'Fruits & Légumes';
  if (['sauce','vinaigre','moutarde','miel','sucre','sel','poivre','épice','colombo','curry','bouillon','lait de coco','chocolat'].some(p => ing.includes(p))) return 'Épicerie';
  return 'Autres';
}

function getRealisticQty(ing: string, cat: string): { quantity: string; unit: string } {
  const i = ing.toLowerCase();
  if (i.includes('œuf') || i.includes('oeuf')) return { quantity: '2', unit: 'unités' };
  if (i.includes('huile') || i.includes('vinaigre')) return { quantity: '15', unit: 'ml' };
  if (['épice','sel','poivre','colombo','curry','curcuma'].some(s => i.includes(s))) return { quantity: '5', unit: 'g' };
  if (['persil','basilic','thym','menthe','ciboulette'].some(s => i.includes(s))) return { quantity: '10', unit: 'g' };
  if (i.includes('lait de coco')) return { quantity: '200', unit: 'ml' };
  if (cat === 'Protéines') return { quantity: '150', unit: 'g' };
  if (cat === 'Féculents') return { quantity: '80', unit: 'g' };
  if (cat === 'Fruits & Légumes') return { quantity: '200', unit: 'g' };
  return { quantity: '100', unit: 'g' };
}

// ── Store interface ──

interface AppState {
  // Auth & onboarding
  isAuthenticated: boolean; userId: string | null; onboardingComplete: boolean;
  profile: { name: string; sex: 'M' | 'F'; birthDate: string; heightCm: number; weightCurrentKg: number; weightGoalKg: number; activityLevel: string; medicalConditions: string[]; dietPreferences: string[]; dailyCalorieBudget: number; macroTargets: MacroTargets; tdee: number; estimatedGoalDate: string; location: string; groceryBudget: number; groceryCurrency: string; foodPreferences: string[]; groceryFrequency: string; cookingTime: string; householdSize: number; familyMode: boolean; healthModules: string[]; healthDetails: { musculaire: string[]; osseux: string[]; articulaire: string[]; cerebral: string[] }; cycleData: { lastPeriodDate: string; cycleLength: number; periodLength: number } | null; medications: { name: string; frequency: string; time: string }[]; } | null;

  // Tracking data
  meals: Meal[]; waterLogs: WaterLog[]; weightLogs: WeightLog[]; dailySteps: number; stepsGoal: number;
  mealPlan: MealPlan | null; productScans: ProductScan[]; sportSessions: SportSession[];
  family: Family | null;
  streak: number; toastMessage: string | null;

  // ── Gamification state ──
  xp: number;
  level: number;
  lastLevelUp: number | null; // set when level up happens, cleared by dismissLevelUp
  avatarConfig: AvatarConfig | null;
  selectedTitle: string;
  dailyMissions: AIMission[];
  missionsDate: string | null; // date when missions were last generated
  aiAnalysis: AIHealthAnalysis | null;
  aiAnalysisLoading: boolean;
  detailedHealthIssues: DetailedHealthIssue[];
  checkIns: CheckIn[];
  streakProtectionAvailable: boolean;
  streakProtectionUsedDate: string | null;

  // ── Existing actions ──
  setAuth: (a: boolean, u: string | null) => void;
  setOnboardingComplete: (c: boolean) => void;
  setProfile: (p: AppState['profile']) => void;
  updateProfile: (u: Partial<NonNullable<AppState['profile']>>) => void;
  recalculateNutrition: () => void;
  addMeal: (m: Meal) => void; removeMeal: (id: string) => void;
  addWater: (d: string, a: number) => void;
  addWeightLog: (d: string, w: number) => void;
  setDailySteps: (s: number) => void;
  setMealPlan: (p: MealPlan) => void;
  selectMealOption: (d: number, s: number, o: number) => void;
  validateMealPlan: () => void;
  toggleGroceryItem: (i: number) => void;
  addProductScan: (s: ProductScan) => void;
  addSportSession: (s: SportSession) => void; removeSportSession: (id: string) => void;
  setFamily: (f: Family | null) => void;
  addFamilyMember: (m: FamilyMember) => void; removeFamilyMember: (id: string) => void; updateFamilyMember: (id: string, u: Partial<FamilyMember>) => void;
  calculateStreak: () => void;
  getMealsForDate: (d: string) => Meal[];
  getWaterForDate: (d: string) => number;
  getTodayCalories: () => { consumed: number; protein: number; fat: number; carbs: number; fiber: number };
  getSportForDate: (d: string) => SportSession[];
  showToast: (m: string) => void; clearToast: () => void;

  // ── Gamification actions ──
  addXP: (amount: number) => void;
  dismissLevelUp: () => void;
  setAvatarConfig: (config: AvatarConfig) => void;
  updateAvatarConfig: (updates: Partial<AvatarConfig>) => void;
  setAvatarUrl: (url: string) => void;
  unlockAvatarItem: (itemId: string) => void;
  setSelectedTitle: (title: string) => void;
  setDailyMissions: (missions: AIMission[], date: string) => void;
  completeMission: (missionId: string) => void;
  setAIAnalysis: (analysis: AIHealthAnalysis | null) => void;
  setAIAnalysisLoading: (loading: boolean) => void;
  setDetailedHealthIssues: (issues: DetailedHealthIssue[]) => void;
  addCheckIn: (checkIn: CheckIn) => void;
  useStreakProtection: () => void;
  completeRehabSession: (programId: string) => void;
  getXpForNextLevel: () => number;
  getXpProgress: () => number; // 0-1 progress toward next level
}

export const useStore = create<AppState>()(persist((set, get) => ({
  // ── Defaults ──
  isAuthenticated: false, userId: null, onboardingComplete: false, profile: null,
  meals: [], waterLogs: [], weightLogs: [], dailySteps: 0, stepsGoal: 10000,
  mealPlan: null, productScans: [], sportSessions: [], family: null, streak: 0, toastMessage: null,

  // Gamification defaults
  xp: 0,
  level: 1,
  lastLevelUp: null,
  avatarConfig: null,
  selectedTitle: 'Débutant motivé',
  dailyMissions: [],
  missionsDate: null,
  aiAnalysis: null,
  aiAnalysisLoading: false,
  detailedHealthIssues: [],
  checkIns: [],
  streakProtectionAvailable: false,
  streakProtectionUsedDate: null,

  // ── Existing actions ──
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
  addWater: (d, a) => set((s) => { const e = s.waterLogs.find(w => w.date === d); if (e) return { waterLogs: s.waterLogs.map(w => w.date === d ? { ...w, amount: Math.max(0, w.amount + a) } : w) }; return { waterLogs: [...s.waterLogs, { date: d, amount: Math.max(0, a) }] }; }),
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

  // ── Gamification actions ──

  addXP: (amount) => set((s) => {
    let newXp = s.xp + amount;
    let newLevel = s.level;
    let leveledUp: number | null = null;
    let newStreakProtection = s.streakProtectionAvailable;

    // Check for level ups (can level up multiple times at once)
    while (newXp >= xpForNextLevel(newLevel)) {
      newXp -= xpForNextLevel(newLevel);
      newLevel++;
      leveledUp = newLevel;
      // Unlock streak protection at level 5
      if (newLevel === 5) newStreakProtection = true;
    }

    return {
      xp: newXp,
      level: newLevel,
      lastLevelUp: leveledUp,
      streakProtectionAvailable: newStreakProtection,
    };
  }),

  dismissLevelUp: () => set({ lastLevelUp: null }),

  setAvatarConfig: (config) => set({ avatarConfig: config }),

  updateAvatarConfig: (updates) => set((s) => {
    if (!s.avatarConfig) return s;
    return { avatarConfig: { ...s.avatarConfig, ...updates } };
  }),

  setAvatarUrl: (url) => set((s) => {
    const config = s.avatarConfig || { skinColor: '', hairColor: '', hairStyle: '', eyeColor: '', outfit: '', outfitColor: '', accessory: null, pet: null, unlockedItems: [], avatarUrl: null };
    return { avatarConfig: { ...config, avatarUrl: url } };
  }),

  unlockAvatarItem: (itemId) => set((s) => {
    if (!s.avatarConfig) return s;
    if (s.avatarConfig.unlockedItems.includes(itemId)) return s;
    return { avatarConfig: { ...s.avatarConfig, unlockedItems: [...s.avatarConfig.unlockedItems, itemId] } };
  }),

  setSelectedTitle: (title) => set({ selectedTitle: title }),

  setDailyMissions: (missions, date) => set({ dailyMissions: missions, missionsDate: date }),

  completeMission: (missionId) => set((s) => {
    const mission = s.dailyMissions.find(m => m.id === missionId);
    if (!mission || mission.isCompleted) return s;
    const updatedMissions = s.dailyMissions.map(m =>
      m.id === missionId ? { ...m, isCompleted: true } : m
    );

    // Add XP from the mission
    let newXp = s.xp + mission.xpReward;
    let newLevel = s.level;
    let leveledUp: number | null = null;
    let newStreakProtection = s.streakProtectionAvailable;
    while (newXp >= xpForNextLevel(newLevel)) {
      newXp -= xpForNextLevel(newLevel);
      newLevel++;
      leveledUp = newLevel;
      if (newLevel === 5) newStreakProtection = true;
    }

    return {
      dailyMissions: updatedMissions,
      xp: newXp,
      level: newLevel,
      lastLevelUp: leveledUp,
      streakProtectionAvailable: newStreakProtection,
    };
  }),

  setAIAnalysis: (analysis) => set({ aiAnalysis: analysis }),
  setAIAnalysisLoading: (loading) => set({ aiAnalysisLoading: loading }),

  setDetailedHealthIssues: (issues) => set({ detailedHealthIssues: issues }),

  addCheckIn: (checkIn) => set((s) => ({
    checkIns: [checkIn, ...s.checkIns].slice(0, 52), // Keep ~1 year of weekly check-ins
  })),

  useStreakProtection: () => set((s) => {
    if (!s.streakProtectionAvailable) return s;
    return {
      streakProtectionAvailable: false,
      streakProtectionUsedDate: new Date().toISOString().split('T')[0],
    };
  }),

  completeRehabSession: (programId) => set((s) => {
    if (!s.aiAnalysis) return s;
    const programs = s.aiAnalysis.rehabPrograms.map(p => {
      if (p.id !== programId || p.isCompleted) return p;
      const newCompleted = p.completedSessions + 1;
      // Advance week every 3 sessions
      const newWeek = Math.min(p.totalWeeks, Math.floor(newCompleted / 3) + 1);
      const isComplete = newWeek >= p.totalWeeks && newCompleted >= p.totalWeeks * 3;

      // Check milestones for sport unlocks
      const updatedRestrictions = [...s.aiAnalysis!.sportRestrictions];
      const milestone = p.milestones.find(ms => ms.week === newWeek);
      if (milestone?.unlockedSports) {
        for (const sportId of milestone.unlockedSports) {
          const idx = updatedRestrictions.findIndex(r => r.sportId === sportId);
          if (idx >= 0) updatedRestrictions[idx] = { ...updatedRestrictions[idx], status: 'caution' };
        }
      }

      // If program is complete, unlock all associated sports
      if (isComplete && p.milestones.length > 0) {
        for (const ms of p.milestones) {
          if (ms.unlockedSports) {
            for (const sportId of ms.unlockedSports) {
              const idx = updatedRestrictions.findIndex(r => r.sportId === sportId);
              if (idx >= 0) updatedRestrictions[idx] = { ...updatedRestrictions[idx], status: 'unlocked' };
            }
          }
        }
      }

      // Update restrictions in aiAnalysis
      if (milestone?.unlockedSports || isComplete) {
        // We'll handle this in the outer set
      }

      return { ...p, completedSessions: newCompleted, currentWeek: newWeek, isCompleted: isComplete };
    });

    return {
      aiAnalysis: { ...s.aiAnalysis, rehabPrograms: programs },
    };
  }),

  getXpForNextLevel: () => xpForNextLevel(get().level),

  getXpProgress: () => {
    const { xp, level } = get();
    const needed = xpForNextLevel(level);
    return needed > 0 ? xp / needed : 0;
  },

}), { name: 'nutreal-storage' }));
