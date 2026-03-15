interface CoachTip {
  emoji: string;
  message: string;
  category: 'nutrition' | 'hydration' | 'sport' | 'habit' | 'motivation';
}

export function generateCoachTip(
  profile: any,
  todayCalories: number,
  waterAmount: number,
  streak: number
): CoachTip {
  const remaining = (profile.dailyCalorieTarget || 2000) - todayCalories;
  const waterTarget = (profile.weightCurrentKg || 70) * 33;
  const waterPct = waterTarget > 0 ? (waterAmount / waterTarget) * 100 : 0;
  const hour = new Date().getHours();

  // Contextual tips based on onboarding habits
  if (profile.snackingHabit === 'often' && remaining > 300 && hour > 14 && hour < 17) {
    return {
      emoji: '🍎',
      message: `Il te reste ${remaining} kcal — c'est le moment idéal pour ta collation saine !`,
      category: 'nutrition',
    };
  }

  if ((profile.stressLevel === 'high' || profile.stressLevel === 'very_high') && hour > 12) {
    return {
      emoji: '🧘',
      message: 'Journée stressante ? Pense au chocolat noir ou aux amandes — riches en magnésium.',
      category: 'habit',
    };
  }

  if (waterPct < 30 && hour > 14) {
    return {
      emoji: '💧',
      message: `Seulement ${Math.round(waterPct)}% de ton objectif eau. Un grand verre maintenant !`,
      category: 'hydration',
    };
  }

  if (streak >= 7) {
    return {
      emoji: '🔥',
      message: `${streak} jours de suite ! Tu es incroyable. Continue comme ça !`,
      category: 'motivation',
    };
  }

  if (profile.sleepHours === 'less_5' || profile.sleepHours === '5_6') {
    return {
      emoji: '😴',
      message: 'Pense à manger léger ce soir pour mieux dormir. Ton corps te remerciera !',
      category: 'habit',
    };
  }

  if (profile.goal === 'gain_muscle' && remaining > 400) {
    return {
      emoji: '💪',
      message: `Il te reste ${remaining} kcal pour atteindre ton surplus. Pense à un shake protéiné !`,
      category: 'nutrition',
    };
  }

  if (profile.goal === 'lose_weight' && remaining < 0) {
    return {
      emoji: '⚡',
      message: 'Tu as dépassé ton objectif aujourd\'hui. Une courte marche peut compenser !',
      category: 'sport',
    };
  }

  if (waterPct < 60 && hour > 10) {
    return {
      emoji: '💧',
      message: 'Hydratation en retard — boire régulièrement boost ton énergie et ta concentration.',
      category: 'hydration',
    };
  }

  // Default time-based tips
  if (hour < 10) return { emoji: '🌅', message: 'Un petit-déjeuner protéiné te donnera de l\'énergie toute la matinée !', category: 'nutrition' };
  if (hour < 14) return { emoji: '☀️', message: 'Bon appétit ! Pense à bien mâcher pour mieux digérer.', category: 'nutrition' };
  if (hour < 18) return { emoji: '💪', message: 'L\'après-midi est idéal pour bouger. Même 15 min font la différence !', category: 'sport' };
  return { emoji: '🌙', message: 'Un dîner léger ce soir pour une bonne nuit de sommeil.', category: 'nutrition' };
}
