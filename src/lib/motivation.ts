/**
 * Daily motivational quotes system.
 * Mixes famous health/discipline quotes with personalized progress messages.
 */

interface MotivationalQuote {
  text: string;
  author?: string;
  type: 'famous' | 'progress';
}

const famousQuotes: MotivationalQuote[] = [
  { text: "Prends soin de ton corps, c'est le seul endroit où tu es obligé de vivre.", author: "Jim Rohn", type: 'famous' },
  { text: "Le succès n'est pas final, l'échec n'est pas fatal : c'est le courage de continuer qui compte.", author: "Winston Churchill", type: 'famous' },
  { text: "La discipline est le pont entre les objectifs et les résultats.", author: "Jim Rohn", type: 'famous' },
  { text: "Ton corps peut presque tout supporter. C'est ton esprit que tu dois convaincre.", type: 'famous' },
  { text: "Chaque repas est une occasion de nourrir ton corps avec amour.", type: 'famous' },
  { text: "Le meilleur moment pour commencer était hier. Le deuxième meilleur moment, c'est maintenant.", type: 'famous' },
  { text: "La santé n'est pas un objectif, c'est un mode de vie.", type: 'famous' },
  { text: "Les petits progrès quotidiens mènent à de grands résultats.", type: 'famous' },
  { text: "Ne compte pas les jours, fais que les jours comptent.", author: "Muhammad Ali", type: 'famous' },
  { text: "La persévérance n'est pas une longue course, c'est plusieurs petites courses l'une après l'autre.", author: "Walter Elliot", type: 'famous' },
  { text: "Tu n'as pas besoin d'être parfait, tu as besoin d'être constant.", type: 'famous' },
  { text: "La nourriture que tu manges peut être la forme de médecine la plus sûre ou la forme de poison la plus lente.", author: "Ann Wigmore", type: 'famous' },
  { text: "Crois en toi et tout devient possible.", type: 'famous' },
  { text: "Le changement ne viendra pas si nous attendons une autre personne ou un autre moment. Nous sommes ceux que nous attendions.", author: "Barack Obama", type: 'famous' },
  { text: "La seule mauvaise séance d'entraînement est celle qui n'a pas eu lieu.", type: 'famous' },
  { text: "Mange pour le corps que tu veux, pas pour le stress que tu as.", type: 'famous' },
  { text: "Chaque jour est une nouvelle chance de changer ta vie.", type: 'famous' },
  { text: "La force ne vient pas de ce que tu peux faire. Elle vient de surmonter ce que tu pensais ne pas pouvoir faire.", author: "Rikki Rogers", type: 'famous' },
  { text: "Un voyage de mille lieues commence par un seul pas.", author: "Lao Tseu", type: 'famous' },
  { text: "La motivation te fait commencer. L'habitude te fait continuer.", type: 'famous' },
  { text: "Investis dans ta santé aujourd'hui, ou paie pour ta maladie demain.", type: 'famous' },
  { text: "Le corps réalise ce que l'esprit croit.", type: 'famous' },
  { text: "Sois plus fort que tes excuses.", type: 'famous' },
  { text: "La constance bat le talent quand le talent n'est pas constant.", type: 'famous' },
  { text: "Chaque choix alimentaire est un vote pour la personne que tu veux devenir.", type: 'famous' },
  { text: "N'abandonne pas. Les débuts sont toujours les plus difficiles.", type: 'famous' },
  { text: "Ta santé est un investissement, pas une dépense.", type: 'famous' },
  { text: "Le progrès, pas la perfection.", type: 'famous' },
  { text: "Fais-le pour toi, pas pour les autres.", type: 'famous' },
  { text: "Aujourd'hui est un bon jour pour être en bonne santé.", type: 'famous' },
  { text: "La douleur que tu ressens aujourd'hui sera la force que tu ressentiras demain.", type: 'famous' },
];

/**
 * Get a deterministic daily quote index based on the date.
 * Changes every day at midnight.
 */
function getDailyIndex(totalQuotes: number): number {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  // Use year + day to get a unique index per day
  const seed = today.getFullYear() * 366 + dayOfYear;
  return seed % totalQuotes;
}

export interface MotivationContext {
  weightLost: number;
  weightToGo: number;
  streak: number;
  totalMeals: number;
  goalWeight: number;
  currentWeight: number;
  startWeight: number;
  name: string;
  estimatedWeeksToGoal: number;
}

/**
 * Generate personalized progress messages based on user data.
 */
function getPersonalizedMessages(ctx: MotivationContext): MotivationalQuote[] {
  const messages: MotivationalQuote[] = [];

  // Weight loss progress
  if (ctx.weightLost > 0) {
    messages.push({
      text: `Tu as déjà perdu ${ctx.weightLost.toFixed(1)} kg, ${ctx.name} ! Continue comme ça, tu es sur la bonne voie ! 💪`,
      type: 'progress',
    });

    if (ctx.weightLost >= 1 && ctx.weightLost < 5) {
      messages.push({
        text: `${ctx.weightLost.toFixed(1)} kg de perdus ! Les premiers kilos sont les plus importants, ils prouvent que tu peux le faire ! 🌟`,
        type: 'progress',
      });
    }

    if (ctx.weightLost >= 5) {
      messages.push({
        text: `Incroyable, ${ctx.name} ! ${ctx.weightLost.toFixed(1)} kg de perdus ! Tu es une vraie source d'inspiration ! 🏆`,
        type: 'progress',
      });
    }

    const percentLost = ctx.startWeight > ctx.goalWeight 
      ? (ctx.weightLost / (ctx.startWeight - ctx.goalWeight)) * 100 
      : 0;
    
    if (percentLost >= 25 && percentLost < 50) {
      messages.push({
        text: `Tu as déjà parcouru un quart du chemin ! ${Math.round(percentLost)}% de ton objectif atteint ! 🎯`,
        type: 'progress',
      });
    } else if (percentLost >= 50 && percentLost < 75) {
      messages.push({
        text: `La moitié du chemin est faite ! ${Math.round(percentLost)}% de ton objectif, tu es incroyable ! 🔥`,
        type: 'progress',
      });
    } else if (percentLost >= 75) {
      messages.push({
        text: `${Math.round(percentLost)}% de ton objectif atteint ! La ligne d'arrivée est en vue ! 🏁`,
        type: 'progress',
      });
    }
  }

  // Weight to go
  if (ctx.weightToGo > 0 && ctx.weightToGo <= 5) {
    messages.push({
      text: `Plus que ${ctx.weightToGo.toFixed(1)} kg avant ton objectif ! Tu y es presque, ${ctx.name} ! 🎉`,
      type: 'progress',
    });
  } else if (ctx.weightToGo > 5 && ctx.weightToGo <= 10) {
    messages.push({
      text: `Encore ${ctx.weightToGo.toFixed(1)} kg et tu atteins ton objectif. Chaque jour te rapproche ! 🚀`,
      type: 'progress',
    });
  }

  // Streak messages
  if (ctx.streak >= 3 && ctx.streak < 7) {
    messages.push({
      text: `${ctx.streak} jours consécutifs de suivi ! Tu construis une habitude solide ! 🔥`,
      type: 'progress',
    });
  } else if (ctx.streak >= 7 && ctx.streak < 14) {
    messages.push({
      text: `${ctx.streak} jours de suite ! Une semaine complète de discipline, bravo ${ctx.name} ! 💎`,
      type: 'progress',
    });
  } else if (ctx.streak >= 14 && ctx.streak < 30) {
    messages.push({
      text: `${ctx.streak} jours consécutifs ! Tu es en train de transformer ta vie ! 🌟`,
      type: 'progress',
    });
  } else if (ctx.streak >= 30) {
    messages.push({
      text: `${ctx.streak} jours de suite ! Un mois de constance, tu es un champion ! 👑`,
      type: 'progress',
    });
  }

  // Total meals tracked
  if (ctx.totalMeals >= 10 && ctx.totalMeals < 50) {
    messages.push({
      text: `${ctx.totalMeals} repas enregistrés ! Tu prends le contrôle de ton alimentation ! 📊`,
      type: 'progress',
    });
  } else if (ctx.totalMeals >= 50 && ctx.totalMeals < 100) {
    messages.push({
      text: `${ctx.totalMeals} repas suivis ! Tu es devenu un expert de ton alimentation ! 🧠`,
      type: 'progress',
    });
  } else if (ctx.totalMeals >= 100) {
    messages.push({
      text: `Plus de ${ctx.totalMeals} repas enregistrés ! La nutrition n'a plus de secrets pour toi ! 🏅`,
      type: 'progress',
    });
  }

  // Estimated time to goal
  if (ctx.estimatedWeeksToGoal > 0 && ctx.estimatedWeeksToGoal <= 4) {
    messages.push({
      text: `Plus que ~${ctx.estimatedWeeksToGoal} semaines pour atteindre ton objectif ! Le sprint final ! 🏃`,
      type: 'progress',
    });
  }

  // Starting fresh (no progress yet)
  if (ctx.weightLost <= 0 && ctx.streak <= 1 && ctx.totalMeals < 5) {
    messages.push({
      text: `Bienvenue ${ctx.name} ! Chaque grand voyage commence par un premier pas. Tu as fait le tien ! 🌱`,
      type: 'progress',
    });
    messages.push({
      text: `${ctx.name}, aujourd'hui est le premier jour de ta transformation. Tu vas y arriver ! 💪`,
      type: 'progress',
    });
  }

  return messages;
}

/**
 * Get the daily motivational quote.
 * Alternates between famous quotes and personalized messages.
 * Changes every day.
 */
export function getDailyMotivation(ctx: MotivationContext): MotivationalQuote {
  const personalizedMessages = getPersonalizedMessages(ctx);
  
  // Combine all quotes: famous + personalized
  const allQuotes: MotivationalQuote[] = [...famousQuotes, ...personalizedMessages];
  
  // Get deterministic daily index
  const index = getDailyIndex(allQuotes.length);
  
  return allQuotes[index];
}

/**
 * Get milestone thresholds and check which ones have been reached.
 */
export const MILESTONE_THRESHOLDS = [1, 2, 3, 5, 7, 10, 15, 20, 25, 30, 40, 50];

export interface Milestone {
  kg: number;
  reached: boolean;
  celebrated: boolean;
  emoji: string;
  title: string;
  message: string;
}

export function getMilestones(weightLost: number, celebratedMilestones: number[]): Milestone[] {
  return MILESTONE_THRESHOLDS.map(kg => {
    const reached = weightLost >= kg;
    const celebrated = celebratedMilestones.includes(kg);
    
    let emoji: string;
    let title: string;
    let message: string;

    if (kg <= 2) {
      emoji = '🌱';
      title = `${kg} kg de perdus !`;
      message = `Les premiers kilos sont les plus importants. Tu as prouvé que tu peux le faire !`;
    } else if (kg <= 5) {
      emoji = '⭐';
      title = `${kg} kg de perdus !`;
      message = `Bravo ! Tu commences à voir de vrais résultats. Continue sur cette lancée !`;
    } else if (kg <= 10) {
      emoji = '🔥';
      title = `${kg} kg de perdus !`;
      message = `Incroyable ! ${kg} kg c'est énorme. Ton corps te remercie !`;
    } else if (kg <= 20) {
      emoji = '🏆';
      title = `${kg} kg de perdus !`;
      message = `Tu es une machine ! ${kg} kg de transformation, c'est inspirant !`;
    } else if (kg <= 30) {
      emoji = '👑';
      title = `${kg} kg de perdus !`;
      message = `Légendaire ! ${kg} kg de perdus, tu as complètement changé ta vie !`;
    } else {
      emoji = '💎';
      title = `${kg} kg de perdus !`;
      message = `Extraordinaire ! ${kg} kg, tu es un exemple pour tous. Rien ne peut t'arrêter !`;
    }

    return { kg, reached, celebrated, emoji, title, message };
  });
}

export function getNextUncelabratedMilestone(
  weightLost: number,
  celebratedMilestones: number[]
): Milestone | null {
  const milestones = getMilestones(weightLost, celebratedMilestones);
  return milestones.find(m => m.reached && !m.celebrated) || null;
}
