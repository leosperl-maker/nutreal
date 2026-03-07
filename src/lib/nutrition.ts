export interface MacroTargets {
  protein_g: number;
  fat_g: number;
  carbs_g: number;
  fiber_g: number;
}

export interface UserProfile {
  name: string;
  sex: 'M' | 'F';
  birthDate: string;
  heightCm: number;
  weightCurrentKg: number;
  weightGoalKg: number;
  activityLevel: string;
  medicalConditions: string[];
  dietPreferences: string[];
  location: string;
  groceryBudget: number;
  groceryCurrency: string;
  foodPreferences: string[];
  groceryFrequency: string;
}

export interface NutritionPlan {
  dailyCalorieBudget: number;
  macroTargets: MacroTargets;
  tdee: number;
  bmr: number;
  deficit: number;
  estimatedWeeksToGoal: number;
  estimatedGoalDate: string;
}

export function calculateBMR(
  sex: 'M' | 'F',
  weightKg: number,
  heightCm: number,
  age: number
): number {
  if (sex === 'M') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
}

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function calculateTDEE(
  sex: 'M' | 'F',
  weightKg: number,
  heightCm: number,
  age: number,
  activityLevel: string
): number {
  const bmr = calculateBMR(sex, weightKg, heightCm, age);
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.55;
  return Math.round(bmr * multiplier);
}

export function calculateAge(birthDate: string): number {
  if (!birthDate) return 30;
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return Math.max(18, Math.min(100, age));
}

export function getWaterTarget(weightKg: number): number {
  const target = Math.round(weightKg * 33);
  return Math.max(1500, Math.min(4000, target));
}

export function calculateMacros(dailyCalories: number, weightKg: number): MacroTargets {
  const protein_g = Math.round(weightKg * 1.8);
  const fat_g = Math.round((dailyCalories * 0.25) / 9);
  const proteinCals = protein_g * 4;
  const fatCals = fat_g * 9;
  const remainingCals = Math.max(0, dailyCalories - proteinCals - fatCals);
  const carbs_g = Math.round(remainingCals / 4);
  const fiber_g = Math.round((dailyCalories / 1000) * 14);
  return { protein_g, fat_g, carbs_g, fiber_g };
}

export function calculateNutritionPlan(profile: UserProfile): NutritionPlan {
  const age = calculateAge(profile.birthDate);
  const bmr = calculateBMR(profile.sex, profile.weightCurrentKg, profile.heightCm, age);
  const tdee = calculateTDEE(profile.sex, profile.weightCurrentKg, profile.heightCm, age, profile.activityLevel);

  const weightDiff = profile.weightCurrentKg - profile.weightGoalKg;
  let deficit: number;

  if (weightDiff > 15) {
    deficit = 750;
  } else if (weightDiff > 5) {
    deficit = 500;
  } else if (weightDiff > 0) {
    deficit = 300;
  } else if (weightDiff < -5) {
    deficit = -300;
  } else {
    deficit = 0;
  }

  const dailyCalorieBudget = Math.round(tdee - deficit);
  const safeBudget = Math.max(profile.sex === 'M' ? 1500 : 1200, dailyCalorieBudget);
  const macroTargets = calculateMacros(safeBudget, profile.weightCurrentKg);

  const weeklyLoss = deficit > 0 ? deficit / 7700 * 7 : deficit < 0 ? Math.abs(deficit) / 7700 * 7 : 0;
  const estimatedWeeksToGoal = weeklyLoss > 0 ? Math.ceil(Math.abs(weightDiff) / weeklyLoss) : 0;

  const goalDate = new Date();
  goalDate.setDate(goalDate.getDate() + estimatedWeeksToGoal * 7);

  return {
    dailyCalorieBudget: safeBudget,
    macroTargets,
    tdee,
    bmr,
    deficit,
    estimatedWeeksToGoal,
    estimatedGoalDate: goalDate.toISOString().split('T')[0],
  };
}

export function getNutritionalScore(
  calories: number,
  protein: number,
  fiber: number,
  fat: number
): { label: string; color: string; score: number } {
  let score = 50;
  if (protein >= 20) score += 15;
  else if (protein >= 10) score += 8;
  if (fiber >= 5) score += 15;
  else if (fiber >= 3) score += 8;
  if (calories > 800) score -= 15;
  else if (calories > 600) score -= 5;
  else if (calories < 400) score += 10;
  if (fat > 30) score -= 10;
  else if (fat < 15) score += 5;
  score = Math.max(0, Math.min(100, score));
  if (score >= 75) return { label: 'Excellent', color: '#4CAF50', score };
  if (score >= 55) return { label: 'Bon', color: '#8BC34A', score };
  if (score >= 35) return { label: 'Moyen', color: '#FF9800', score };
  return { label: 'À améliorer', color: '#F44336', score };
}

export function getCurrencyForLocation(location: string): string {
  if (location === 'États-Unis') return '$';
  return '€';
}

export const LOCATION_OPTIONS = [
  { value: 'guadeloupe', label: 'Guadeloupe', emoji: '🏝️' },
  { value: 'martinique', label: 'Martinique', emoji: '🏝️' },
  { value: 'france', label: 'France métropolitaine', emoji: '🇫🇷' },
  { value: 'usa', label: 'États-Unis', emoji: '🇺🇸' },
  { value: 'other', label: 'Autre', emoji: '🌍' },
];

export const FOOD_PREFERENCE_OPTIONS = [
  { value: 'poulet', label: 'Poulet', emoji: '🍗' },
  { value: 'boeuf', label: 'Bœuf', emoji: '🥩' },
  { value: 'porc', label: 'Porc', emoji: '🥓' },
  { value: 'poisson', label: 'Poisson', emoji: '🐟' },
  { value: 'fruits_de_mer', label: 'Fruits de mer', emoji: '🦐' },
  { value: 'oeufs', label: 'Œufs', emoji: '🥚' },
  { value: 'tofu', label: 'Tofu', emoji: '🧈' },
  { value: 'riz', label: 'Riz', emoji: '🍚' },
  { value: 'pates', label: 'Pâtes', emoji: '🍝' },
  { value: 'lentilles', label: 'Lentilles', emoji: '🫘' },
  { value: 'pois_chiches', label: 'Pois chiches', emoji: '🫛' },
  { value: 'pommes_de_terre', label: 'Pommes de terre', emoji: '🥔' },
  { value: 'patate_douce', label: 'Patate douce', emoji: '🍠' },
  { value: 'banane_plantain', label: 'Banane plantain', emoji: '🍌' },
  { value: 'igname', label: 'Igname', emoji: '🌿' },
  { value: 'christophine', label: 'Christophine', emoji: '🥒' },
  { value: 'giraumon', label: 'Giraumon', emoji: '🎃' },
  { value: 'avocat', label: 'Avocat', emoji: '🥑' },
  { value: 'fromage', label: 'Fromage', emoji: '🧀' },
  { value: 'yaourt', label: 'Yaourt', emoji: '🥛' },
  { value: 'noix', label: 'Noix & graines', emoji: '🥜' },
  { value: 'quinoa', label: 'Quinoa', emoji: '🌾' },
  { value: 'saumon', label: 'Saumon', emoji: '🍣' },
  { value: 'thon', label: 'Thon', emoji: '🐠' },
  { value: 'crevettes', label: 'Crevettes', emoji: '🦞' },
  { value: 'morue', label: 'Morue', emoji: '🐟' },
  { value: 'legumes_verts', label: 'Légumes verts', emoji: '🥦' },
  { value: 'fruits', label: 'Fruits frais', emoji: '🍎' },
];

export const GROCERY_FREQUENCY_OPTIONS = [
  { value: 'weekly', label: 'Chaque semaine', desc: '1 liste par semaine', emoji: '📅' },
  { value: 'biweekly', label: 'Toutes les 2 semaines', desc: '1 liste pour 2 semaines', emoji: '📆' },
  { value: 'monthly', label: 'Chaque mois', desc: '1 liste pour le mois', emoji: '🗓️' },
];
