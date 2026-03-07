export interface UserProfile {
  name: string;
  sex: 'M' | 'F';
  birthDate: string;
  heightCm: number;
  weightCurrentKg: number;
  weightGoalKg: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  medicalConditions: string[];
  dietPreferences: string[];
}

export interface MacroTargets {
  protein_g: number;
  fat_g: number;
  carbs_g: number;
  fiber_g: number;
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

export function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function calculateBMR(sex: 'M' | 'F', weightKg: number, heightCm: number, age: number): number {
  if (sex === 'M') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
}

export function calculateTDEE(bmr: number, activityLevel: string): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel as keyof typeof ACTIVITY_MULTIPLIERS] || 1.2;
  return Math.round(bmr * multiplier);
}

export function calculateNutritionPlan(profile: UserProfile): NutritionPlan {
  const age = calculateAge(profile.birthDate);
  const bmr = calculateBMR(profile.sex, profile.weightCurrentKg, profile.heightCm, age);
  const tdee = calculateTDEE(bmr, profile.activityLevel);

  const weightDiff = profile.weightCurrentKg - profile.weightGoalKg;
  const isLosing = weightDiff > 0;
  const isGaining = weightDiff < 0;

  // Safe deficit: 500 kcal/day = ~0.5kg/week loss
  let deficit = 0;
  if (isLosing) {
    deficit = Math.min(500, tdee * 0.2); // Max 20% of TDEE or 500 kcal
  } else if (isGaining) {
    deficit = -300; // Surplus for muscle gain
  }

  const dailyCalorieBudget = Math.round(tdee - deficit);

  // Macro split: 30% protein, 25% fat, 40% carbs, 5% fiber
  const proteinCals = dailyCalorieBudget * 0.30;
  const fatCals = dailyCalorieBudget * 0.25;
  const carbsCals = dailyCalorieBudget * 0.40;

  const macroTargets: MacroTargets = {
    protein_g: Math.round(proteinCals / 4),
    fat_g: Math.round(fatCals / 9),
    carbs_g: Math.round(carbsCals / 4),
    fiber_g: Math.round(dailyCalorieBudget / 1000 * 14), // 14g per 1000 kcal
  };

  // Estimate weeks to goal
  const weeklyLossKg = (deficit * 7) / 7700; // 7700 kcal = 1 kg
  const weeksToGoal = weeklyLossKg > 0 ? Math.ceil(Math.abs(weightDiff) / weeklyLossKg) : 0;

  const goalDate = new Date();
  goalDate.setDate(goalDate.getDate() + weeksToGoal * 7);

  return {
    dailyCalorieBudget,
    macroTargets,
    tdee,
    bmr: Math.round(bmr),
    deficit: Math.round(deficit),
    estimatedWeeksToGoal: weeksToGoal,
    estimatedGoalDate: goalDate.toISOString().split('T')[0],
  };
}

export function getWaterTarget(weightKg: number): number {
  return Math.round(weightKg * 30); // 30ml per kg
}

export function getNutritionalScore(calories: number, protein: number, fiber: number, fat: number): {
  label: string;
  color: string;
  score: number;
} {
  let score = 50;
  
  // Protein bonus
  if (protein > 20) score += 15;
  else if (protein > 10) score += 8;
  
  // Fiber bonus
  if (fiber > 5) score += 15;
  else if (fiber > 2) score += 8;
  
  // Calorie penalty
  if (calories > 800) score -= 15;
  else if (calories > 600) score -= 5;
  else if (calories < 400) score += 10;
  
  // Fat penalty
  if (fat > 30) score -= 15;
  else if (fat > 20) score -= 5;
  
  score = Math.max(0, Math.min(100, score));
  
  if (score >= 75) return { label: 'Excellent', color: '#4CAF50', score };
  if (score >= 50) return { label: 'Bon', color: '#8BC34A', score };
  if (score >= 25) return { label: 'Moyen', color: '#FF9800', score };
  return { label: 'À améliorer', color: '#F44336', score };
}
