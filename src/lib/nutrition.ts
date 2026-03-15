export interface MacroTargets { protein_g: number; fat_g: number; carbs_g: number; fiber_g: number; }
export interface NutritionPlan { bmr: number; tdee: number; dailyCalorieTarget: number; macroTargets: MacroTargets; deficit: number; estimatedWeeksToGoal: number; estimatedGoalDate: string; }
export interface UserProfile { name: string; sex: 'M' | 'F'; birthDate: string; heightCm: number; weightCurrentKg: number; weightGoalKg: number; activityLevel: string; medicalConditions: string[]; dietPreferences: string[]; location: string; groceryBudget: number; groceryCurrency: string; foodPreferences: string[]; groceryFrequency: string; goal?: string; pace?: string; sleepHours?: string; stressLevel?: string; alcoholFrequency?: string; }

export const LOCATION_OPTIONS: { value: string; label: string; emoji: string; group: string }[] = [
  { value: 'guadeloupe', label: 'Guadeloupe', emoji: 'sun', group: 'Antilles françaises' },
  { value: 'martinique', label: 'Martinique', emoji: 'sun', group: 'Antilles françaises' },
  { value: 'la_desirade', label: 'La Désirade', emoji: 'sun', group: 'Antilles françaises' },
  { value: 'marie_galante', label: 'Marie-Galante', emoji: 'sun', group: 'Antilles françaises' },
  { value: 'les_saintes', label: 'Les Saintes', emoji: 'sun', group: 'Antilles françaises' },
  { value: 'saint_martin', label: 'Saint-Martin', emoji: 'sun', group: 'Antilles françaises' },
  { value: 'saint_barthelemy', label: 'Saint-Barthélemy', emoji: 'sun', group: 'Antilles françaises' },
  { value: 'guyane', label: 'Guyane', emoji: 'seedling', group: 'Autres DROM-TOM' },
  { value: 'reunion', label: 'Réunion', emoji: 'fire', group: 'Autres DROM-TOM' },
  { value: 'mayotte', label: 'Mayotte', emoji: 'sun', group: 'Autres DROM-TOM' },
  { value: 'saint_pierre_miquelon', label: 'Saint-Pierre-et-Miquelon', emoji: 'droplet', group: 'Autres DROM-TOM' },
  { value: 'polynesie', label: 'Polynésie française', emoji: 'cherryBlossom', group: 'Autres DROM-TOM' },
  { value: 'nouvelle_caledonie', label: 'Nouvelle-Calédonie', emoji: 'seedling', group: 'Autres DROM-TOM' },
  { value: 'wallis_futuna', label: 'Wallis-et-Futuna', emoji: 'droplet', group: 'Autres DROM-TOM' },
  { value: 'france', label: 'France métropolitaine', emoji: 'star', group: 'Autres' },
  { value: 'usa', label: 'États-Unis', emoji: 'star', group: 'Autres' },
  { value: 'other', label: 'Autre', emoji: 'star', group: 'Autres' },
];

export const FOOD_PREFERENCE_OPTIONS: { value: string; label: string; emoji: string }[] = [
  { value: 'poulet', label: 'Poulet', emoji: 'cutOfMeat' }, { value: 'boeuf', label: 'Boeuf', emoji: 'cutOfMeat' },
  { value: 'porc', label: 'Porc', emoji: 'cutOfMeat' }, { value: 'poisson', label: 'Poisson', emoji: 'forkAndKnife' },
  { value: 'saumon', label: 'Saumon', emoji: 'forkAndKnife' }, { value: 'thon', label: 'Thon', emoji: 'forkAndKnife' },
  { value: 'crevettes', label: 'Crevettes', emoji: 'forkAndKnife' }, { value: 'morue', label: 'Morue', emoji: 'forkAndKnife' },
  { value: 'oeufs', label: 'Oeufs', emoji: 'egg' }, { value: 'tofu', label: 'Tofu', emoji: 'leafyGreen' },
  { value: 'riz', label: 'Riz', emoji: 'sheafOfRice' }, { value: 'pates', label: 'Pâtes', emoji: 'forkAndKnife' },
  { value: 'quinoa', label: 'Quinoa', emoji: 'sheafOfRice' }, { value: 'lentilles', label: 'Lentilles', emoji: 'seedling' },
  { value: 'fromage', label: 'Fromage', emoji: 'cheeseWedge' }, { value: 'yaourt', label: 'Yaourt', emoji: 'beverageBox' },
  { value: 'fruits', label: 'Fruits', emoji: 'redApple' }, { value: 'legumes_verts', label: 'Légumes', emoji: 'leafyGreen' },
  { value: 'avocat', label: 'Avocat', emoji: 'leafyGreen' }, { value: 'patate_douce', label: 'Patate douce', emoji: 'seedling' },
  { value: 'banane_plantain', label: 'Banane plantain', emoji: 'seedling' }, { value: 'christophine', label: 'Christophine', emoji: 'leafyGreen' },
  { value: 'igname', label: 'Igname', emoji: 'seedling' },
];

export const GROCERY_FREQUENCY_OPTIONS = [
  { value: 'weekly', label: 'Hebdomadaire', emoji: 'calendar', desc: 'Courses 1x/semaine' },
  { value: 'biweekly', label: 'Bi-mensuel', emoji: 'calendar', desc: 'Courses toutes les 2 semaines' },
  { value: 'monthly', label: 'Mensuel', emoji: 'calendar', desc: 'Courses 1x/mois' },
];

export function getCurrencyForLocation(loc: string): string {
  if (loc === 'usa') return '$';
  if (['polynesie', 'nouvelle_caledonie', 'wallis_futuna'].includes(loc)) return 'F CFP';
  return '€';
}

export function calculateAge(birthDate: string): number {
  const b = new Date(birthDate); const t = new Date();
  let age = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) age--;
  return age;
}

export function calculateNutritionPlan(profile: UserProfile): NutritionPlan {
  const age = calculateAge(profile.birthDate);
  let bmr = profile.sex === 'M'
    ? 10 * profile.weightCurrentKg + 6.25 * profile.heightCm - 5 * age + 5
    : 10 * profile.weightCurrentKg + 6.25 * profile.heightCm - 5 * age - 161;
  bmr = Math.round(bmr);
  const mult: Record<string, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
  const tdee = Math.round(bmr * (mult[profile.activityLevel] || 1.55));
  const diff = profile.weightCurrentKg - profile.weightGoalKg;

  // Goal-aware deficit
  let deficit = 0;
  const goal = profile.goal;
  if (goal === 'lose_weight') {
    switch (profile.pace) {
      case 'slow': deficit = 250; break;
      case 'fast': deficit = 750; break;
      default: deficit = 500;
    }
    // If no pace provided, fall back to weight-based
    if (!profile.pace) {
      deficit = Math.min(Math.max(Math.round(diff * 30), 300), 1000);
    }
  } else if (goal === 'gain_muscle') {
    deficit = -300;
  } else if (goal === 'maintain') {
    deficit = 0;
  } else if (!goal) {
    // Legacy: weight-based
    if (diff > 0) deficit = Math.min(Math.max(Math.round(diff * 30), 300), 1000);
    else if (diff < 0) deficit = -300;
  } else {
    // eat_healthy / medical
    deficit = diff > 5 ? 300 : 0;
  }

  // Lifestyle adjustments
  if (profile.sleepHours === 'less_5') deficit = Math.max(deficit - 100, 0);
  if (profile.stressLevel === 'very_high') deficit = Math.max(deficit - 75, 0);
  if (profile.alcoholFrequency === 'regular') deficit += 100;

  const minCals = profile.sex === 'M' ? 1500 : 1200;
  const budget = Math.max(tdee - deficit, minCals);
  const actualDeficit = tdee - budget;

  // Macros
  let protein_g: number, fat_g: number, carbs_g: number, fiber_g: number;
  if (goal === 'gain_muscle') {
    protein_g = Math.round(profile.weightCurrentKg * 2.2);
    fat_g = Math.round((budget * 0.25) / 9);
    carbs_g = Math.round((budget - protein_g * 4 - fat_g * 9) / 4);
    fiber_g = Math.round((budget / 1000) * 14);
  } else {
    const protK = ['active', 'very_active'].includes(profile.activityLevel) ? 2.0 : 1.6;
    protein_g = Math.round(profile.weightGoalKg * protK);
    fat_g = Math.round((budget * 0.28) / 9);
    carbs_g = Math.round((budget - protein_g * 4 - fat_g * 9) / 4);
    fiber_g = profile.sex === 'M' ? 35 : 28;
  }

  const wkDef = actualDeficit * 7; const totalCals = Math.abs(diff) * 7700;
  const weeks = wkDef > 0 ? Math.round(totalCals / wkDef) : 0;
  const gd = new Date(); gd.setDate(gd.getDate() + weeks * 7);
  return { bmr, tdee, dailyCalorieTarget: budget, macroTargets: { protein_g, fat_g, carbs_g, fiber_g }, deficit: actualDeficit, estimatedWeeksToGoal: weeks, estimatedGoalDate: gd.toISOString().split('T')[0] };
}

export function getWaterTarget(w: number): number { return Math.round(w * 33); }

export function getNutritionalScore(cal: number, prot: number, fib: number, fat: number) {
  let s = 50;
  if (prot > 20) s += 15; else if (prot > 10) s += 8;
  if (fib > 8) s += 15; else if (fib > 4) s += 8;
  if (fat > 30) s -= 15; else if (fat > 20) s -= 5;
  if (cal > 800) s -= 10;
  s = Math.max(0, Math.min(100, s));
  if (s >= 75) return { label: 'Excellent', color: '#2E9E6B', score: s };
  if (s >= 55) return { label: 'Bon', color: '#3D8BAD', score: s };
  if (s >= 35) return { label: 'Moyen', color: '#E8A838', score: s };
  return { label: 'À améliorer', color: '#E85438', score: s };
}
