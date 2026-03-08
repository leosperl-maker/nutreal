export interface MacroTargets { protein_g: number; fat_g: number; carbs_g: number; fiber_g: number; }
export interface NutritionPlan { bmr: number; tdee: number; dailyCalorieBudget: number; macroTargets: MacroTargets; deficit: number; estimatedWeeksToGoal: number; estimatedGoalDate: string; }
export interface UserProfile { name: string; sex: 'M' | 'F'; birthDate: string; heightCm: number; weightCurrentKg: number; weightGoalKg: number; activityLevel: string; medicalConditions: string[]; dietPreferences: string[]; location: string; groceryBudget: number; groceryCurrency: string; foodPreferences: string[]; groceryFrequency: string; }

export const LOCATION_OPTIONS: { value: string; label: string; emoji: string; group: string }[] = [
  { value: 'guadeloupe', label: 'Guadeloupe', emoji: '🏝️', group: 'Antilles françaises' },
  { value: 'martinique', label: 'Martinique', emoji: '🏝️', group: 'Antilles françaises' },
  { value: 'la_desirade', label: 'La Désirade', emoji: '🏝️', group: 'Antilles françaises' },
  { value: 'marie_galante', label: 'Marie-Galante', emoji: '🏝️', group: 'Antilles françaises' },
  { value: 'les_saintes', label: 'Les Saintes', emoji: '🏝️', group: 'Antilles françaises' },
  { value: 'saint_martin', label: 'Saint-Martin', emoji: '🏝️', group: 'Antilles françaises' },
  { value: 'saint_barthelemy', label: 'Saint-Barthélemy', emoji: '🏝️', group: 'Antilles françaises' },
  { value: 'guyane', label: 'Guyane', emoji: '🌿', group: 'Autres DROM-TOM' },
  { value: 'reunion', label: 'Réunion', emoji: '🌋', group: 'Autres DROM-TOM' },
  { value: 'mayotte', label: 'Mayotte', emoji: '🏝️', group: 'Autres DROM-TOM' },
  { value: 'saint_pierre_miquelon', label: 'Saint-Pierre-et-Miquelon', emoji: '🐟', group: 'Autres DROM-TOM' },
  { value: 'polynesie', label: 'Polynésie française', emoji: '🌺', group: 'Autres DROM-TOM' },
  { value: 'nouvelle_caledonie', label: 'Nouvelle-Calédonie', emoji: '🦎', group: 'Autres DROM-TOM' },
  { value: 'wallis_futuna', label: 'Wallis-et-Futuna', emoji: '🐚', group: 'Autres DROM-TOM' },
  { value: 'france', label: 'France métropolitaine', emoji: '🇫🇷', group: 'Autres' },
  { value: 'usa', label: 'États-Unis', emoji: '🇺🇸', group: 'Autres' },
  { value: 'other', label: 'Autre', emoji: '🌍', group: 'Autres' },
];

export const FOOD_PREFERENCE_OPTIONS: { value: string; label: string; emoji: string }[] = [
  { value: 'poulet', label: 'Poulet', emoji: '🍗' }, { value: 'boeuf', label: 'Bœuf', emoji: '🥩' },
  { value: 'porc', label: 'Porc', emoji: '🥓' }, { value: 'poisson', label: 'Poisson', emoji: '🐟' },
  { value: 'saumon', label: 'Saumon', emoji: '🍣' }, { value: 'thon', label: 'Thon', emoji: '🐠' },
  { value: 'crevettes', label: 'Crevettes', emoji: '🦐' }, { value: 'morue', label: 'Morue', emoji: '🐡' },
  { value: 'oeufs', label: 'Œufs', emoji: '🥚' }, { value: 'tofu', label: 'Tofu', emoji: '🧊' },
  { value: 'riz', label: 'Riz', emoji: '🍚' }, { value: 'pates', label: 'Pâtes', emoji: '🍝' },
  { value: 'quinoa', label: 'Quinoa', emoji: '🌾' }, { value: 'lentilles', label: 'Lentilles', emoji: '🫘' },
  { value: 'fromage', label: 'Fromage', emoji: '🧀' }, { value: 'yaourt', label: 'Yaourt', emoji: '🥛' },
  { value: 'fruits', label: 'Fruits', emoji: '🍎' }, { value: 'legumes_verts', label: 'Légumes', emoji: '🥬' },
  { value: 'avocat', label: 'Avocat', emoji: '🥑' }, { value: 'patate_douce', label: 'Patate douce', emoji: '🍠' },
  { value: 'banane_plantain', label: 'Banane plantain', emoji: '🍌' }, { value: 'christophine', label: 'Christophine', emoji: '🥒' },
  { value: 'igname', label: 'Igname', emoji: '🥔' },
];

export const GROCERY_FREQUENCY_OPTIONS = [
  { value: 'weekly', label: 'Hebdomadaire', emoji: '📅', desc: 'Courses 1x/semaine' },
  { value: 'biweekly', label: 'Bi-mensuel', emoji: '📆', desc: 'Courses toutes les 2 semaines' },
  { value: 'monthly', label: 'Mensuel', emoji: '🗓️', desc: 'Courses 1x/mois' },
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
  let deficit = 0, budget = tdee;
  if (diff > 0) { deficit = Math.min(Math.max(Math.round(diff * 30), 300), 1000); budget = Math.max(tdee - deficit, profile.sex === 'M' ? 1500 : 1200); deficit = tdee - budget; }
  else if (diff < 0) { deficit = -300; budget = tdee + 300; }
  const protK = ['active', 'very_active'].includes(profile.activityLevel) ? 2.0 : 1.6;
  const protein_g = Math.round(profile.weightGoalKg * protK);
  const fat_g = Math.round((budget * 0.28) / 9);
  const carbs_g = Math.round((budget - protein_g * 4 - fat_g * 9) / 4);
  const fiber_g = profile.sex === 'M' ? 35 : 28;
  const wkDef = deficit * 7; const totalCals = Math.abs(diff) * 7700;
  const weeks = wkDef > 0 ? Math.round(totalCals / wkDef) : 0;
  const gd = new Date(); gd.setDate(gd.getDate() + weeks * 7);
  return { bmr, tdee, dailyCalorieBudget: budget, macroTargets: { protein_g, fat_g, carbs_g, fiber_g }, deficit, estimatedWeeksToGoal: weeks, estimatedGoalDate: gd.toISOString().split('T')[0] };
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
