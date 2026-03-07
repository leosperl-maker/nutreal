import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MacroTargets } from '../lib/nutrition';

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

export interface MealPlan {
  weekStart: string;
  days: {
    date: string;
    dayName: string;
    meals: {
      type: 'breakfast' | 'lunch' | 'snack' | 'dinner';
      name: string;
      ingredients: string[];
      calories: number;
      protein_g: number;
      fat_g: number;
      carbs_g: number;
      fiber_g: number;
    }[];
  }[];
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

interface AppState {
  // Auth
  isAuthenticated: boolean;
  userId: string | null;
  
  // Onboarding
  onboardingComplete: boolean;
  
  // User Profile
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
  } | null;
  
  // Meals
  meals: Meal[];
  
  // Water
  waterLogs: WaterLog[];
  
  // Weight
  weightLogs: WeightLog[];
  
  // Steps
  dailySteps: number;
  stepsGoal: number;
  
  // Meal Plan
  mealPlan: MealPlan | null;
  
  // Product Scans
  productScans: ProductScan[];
  
  // Streak
  streak: number;
  
  // Actions
  setAuth: (isAuth: boolean, userId: string | null) => void;
  setOnboardingComplete: (complete: boolean) => void;
  setProfile: (profile: AppState['profile']) => void;
  addMeal: (meal: Meal) => void;
  removeMeal: (id: string) => void;
  addWater: (date: string, amount: number) => void;
  addWeightLog: (date: string, weight: number) => void;
  setDailySteps: (steps: number) => void;
  setMealPlan: (plan: MealPlan) => void;
  addProductScan: (scan: ProductScan) => void;
  calculateStreak: () => void;
  getMealsForDate: (date: string) => Meal[];
  getWaterForDate: (date: string) => number;
  getTodayCalories: () => { consumed: number; protein: number; fat: number; carbs: number; fiber: number };
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
      streak: 0,

      setAuth: (isAuth, userId) => set({ isAuthenticated: isAuth, userId }),
      
      setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),
      
      setProfile: (profile) => set({ profile }),
      
      addMeal: (meal) => set((state) => ({ meals: [...state.meals, meal] })),
      
      removeMeal: (id) => set((state) => ({ meals: state.meals.filter(m => m.id !== id) })),
      
      addWater: (date, amount) => set((state) => {
        const existing = state.waterLogs.find(w => w.date === date);
        if (existing) {
          return {
            waterLogs: state.waterLogs.map(w =>
              w.date === date ? { ...w, amount: w.amount + amount } : w
            ),
          };
        }
        return { waterLogs: [...state.waterLogs, { date, amount }] };
      }),
      
      addWeightLog: (date, weight) => set((state) => {
        const existing = state.weightLogs.find(w => w.date === date);
        if (existing) {
          return {
            weightLogs: state.weightLogs.map(w =>
              w.date === date ? { ...w, weight } : w
            ),
          };
        }
        return { weightLogs: [...state.weightLogs, { date, weight }] };
      }),
      
      setDailySteps: (steps) => set({ dailySteps: steps }),
      
      setMealPlan: (plan) => set({ mealPlan: plan }),
      
      addProductScan: (scan) => set((state) => ({
        productScans: [scan, ...state.productScans].slice(0, 50),
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
      
      getMealsForDate: (date) => {
        return get().meals.filter(m => m.date === date);
      },
      
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
    }),
    {
      name: 'nutrilens-storage',
    }
  )
);
