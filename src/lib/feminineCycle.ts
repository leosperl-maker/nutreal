export type CyclePhase = 'menstruation' | 'follicular' | 'ovulation' | 'luteal';

export interface CyclePhaseInfo {
  phase: CyclePhase;
  name: string;
  emoji: string;
  color: string;
  dayRange: string;
  nutritionTips: string[];
  sportTips: string[];
  wellnessTips: string[];
  calorieAdjustment: number;
  macroFocus: string;
}

export const PHASES: Record<CyclePhase, CyclePhaseInfo> = {
  menstruation: {
    phase: 'menstruation',
    name: 'Menstruation',
    emoji: 'lotus',
    color: '#ef4444',
    dayRange: 'Jours 1-5',
    nutritionTips: [
      'Privilégiez le fer : lentilles, épinards, viande rouge maigre',
      'Magnésium contre les crampes : chocolat noir 70%, banane, amandes',
      'Oméga-3 anti-inflammatoires : saumon, graines de lin, noix',
      'Hydratation renforcée : tisanes (gingembre, camomille)',
    ],
    sportTips: [
      'Yoga doux et stretching (pas de positions inversées)',
      'Marche légère 20-30 min',
      'Réduire l\'intensité de 30-40%',
      'Écouter son corps — repos si nécessaire',
    ],
    wellnessTips: [
      'Sommeil : viser 8h+ cette semaine',
      'Bouillotte sur le ventre contre les crampes',
      'Réduire caféine et sel (rétention d\'eau)',
    ],
    calorieAdjustment: +100,
    macroFocus: 'Fer + Magnésium',
  },
  follicular: {
    phase: 'follicular',
    name: 'Phase Folliculaire',
    emoji: 'sparkles',
    color: '#10b981',
    dayRange: 'Jours 6-13',
    nutritionTips: [
      'Phase d\'énergie montante — idéal pour un léger déficit',
      'Protéines : augmenter à 1.8g/kg pour la récupération',
      'Glucides complexes pour l\'entraînement : patate douce, quinoa',
      'Probiotiques : yaourt, kéfir, choucroute',
    ],
    sportTips: [
      'Meilleur moment pour l\'intensité : HIIT, musculation lourde',
      'Force maximale cette semaine — tester de nouveaux records',
      'Cardio haute intensité bien toléré',
      'Récupération rapide — profitez-en !',
    ],
    wellnessTips: [
      'Énergie et motivation au top — planifier les projets importants',
      'Socialiser, essayer de nouvelles activités',
    ],
    calorieAdjustment: 0,
    macroFocus: 'Protéines + Glucides complexes',
  },
  ovulation: {
    phase: 'ovulation',
    name: 'Ovulation',
    emoji: 'highVoltage',
    color: '#f59e0b',
    dayRange: 'Jours 14-16',
    nutritionTips: [
      'Pic d\'énergie — maintenir l\'apport protéique',
      'Antioxydants : fruits rouges, légumes colorés',
      'Fibres pour l\'équilibre hormonal : brocoli, chou-fleur',
      'Zinc : graines de courge, huîtres, bœuf',
    ],
    sportTips: [
      'Performance maximale — jour idéal pour les compétitions',
      'Attention aux ligaments (plus laxes) — bien s\'échauffer',
      'Excellent pour les sports collectifs et l\'endurance',
    ],
    wellnessTips: [
      'Confiance et communication au top',
      'Attention : risque de blessure ligamentaire légèrement accru',
    ],
    calorieAdjustment: 0,
    macroFocus: 'Antioxydants + Zinc',
  },
  luteal: {
    phase: 'luteal',
    name: 'Phase Lutéale',
    emoji: 'brain',
    color: '#8b5cf6',
    dayRange: 'Jours 17-28',
    nutritionTips: [
      'Métabolisme accéléré (+100-300 kcal naturellement) — ne pas culpabiliser',
      'Magnésium et B6 contre le SPM : banane, avocat, noix du Brésil',
      'Calcium : yaourt, fromage blanc, amandes',
      'Tryptophane (sérotonine) : dinde, œufs, graines de tournesol',
      'Limiter sel, sucre raffiné, alcool, caféine',
    ],
    sportTips: [
      'Baisser l\'intensité progressivement',
      'Privilégier : Pilates, natation, marche rapide',
      'Yoga (réduction du stress, étirements profonds)',
      'Semaine 2 lutéale : repos actif, pas de PR',
    ],
    wellnessTips: [
      'Envies de sucre normales — orienter vers chocolat noir ou fruits',
      'Journaling et méditation recommandés',
      'Ne pas se comparer aux performances de la phase folliculaire',
    ],
    calorieAdjustment: +150,
    macroFocus: 'Magnésium + Calcium + Tryptophane',
  },
};

export function detectCyclePhase(lastPeriodDate: Date, cycleLength: number = 28): CyclePhaseInfo {
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24));
  const dayInCycle = diffDays % cycleLength;

  if (dayInCycle <= 5) return PHASES.menstruation;
  if (dayInCycle <= 13) return PHASES.follicular;
  if (dayInCycle <= 16) return PHASES.ovulation;
  return PHASES.luteal;
}

export function getNextPhaseDate(lastPeriodDate: Date, cycleLength: number = 28): { phase: CyclePhase; date: Date } {
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24));
  const dayInCycle = diffDays % cycleLength;

  let daysUntilNext: number;
  let nextPhase: CyclePhase;

  if (dayInCycle <= 5) { daysUntilNext = 6 - dayInCycle; nextPhase = 'follicular'; }
  else if (dayInCycle <= 13) { daysUntilNext = 14 - dayInCycle; nextPhase = 'ovulation'; }
  else if (dayInCycle <= 16) { daysUntilNext = 17 - dayInCycle; nextPhase = 'luteal'; }
  else { daysUntilNext = cycleLength - dayInCycle + 1; nextPhase = 'menstruation'; }

  const nextDate = new Date(today);
  nextDate.setDate(nextDate.getDate() + daysUntilNext);
  return { phase: nextPhase, date: nextDate };
}
