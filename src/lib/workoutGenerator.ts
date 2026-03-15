// Workout Generator - NutReal Sport Module
// Générateur de programmes d'entraînement adaptatif

export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'legs' | 'glutes' | 'core' | 'full_body' | 'cardio';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type Equipment = 'none' | 'dumbbells' | 'barbell' | 'resistance_bands' | 'pull_up_bar' | 'bench' | 'machine';
export type SportGoal = 'weight_loss' | 'muscle_gain' | 'endurance' | 'flexibility' | 'general_fitness';
export type Limitation = 'back_pain' | 'knee_problems' | 'shoulder_injury' | 'wrist_pain' | 'hip_problems' | 'none';
export type WorkoutType = 'strength' | 'hiit' | 'cardio' | 'yoga' | 'stretching' | 'circuit';

export interface Exercise {
  id: string;
  name: string;
  nameEn: string;
  muscleGroups: MuscleGroup[];
  equipment: Equipment[];
  difficulty: Difficulty;
  type: WorkoutType;
  sets?: number;
  reps?: string;
  duration?: number; // seconds
  restSeconds: number;
  calories_per_set: number;
  instructions: string[];
  tips: string[];
  contraindications: Limitation[];
  wgerExerciseId?: number;
  youtubeSearchQuery: string;
  imageUrl?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  goal: SportGoal;
  difficulty: Difficulty;
  daysPerWeek: number;
  sessions: WorkoutSession[];
  createdAt: string;
}

export interface WorkoutSession {
  id: string;
  dayNumber: number;
  dayName: string;
  name: string;
  focusAreas: MuscleGroup[];
  warmup: Exercise[];
  exercises: Exercise[];
  cooldown: Exercise[];
  estimatedDuration: number; // minutes
  estimatedCalories: number;
}

export interface CompletedWorkout {
  id: string;
  sessionId: string;
  sessionName: string;
  date: string;
  duration: number; // minutes
  caloriesBurned: number;
  exercisesCompleted: number;
  totalExercises: number;
  feeling: 'easy' | 'good' | 'hard' | 'exhausted';
  createdAt: string;
}

export interface SportProfile {
  goal: SportGoal;
  fitnessLevel: Difficulty;
  limitations: Limitation[];
  availableEquipment: Equipment[];
  daysPerWeek: number;
  sessionDuration: number; // minutes
  preferredTypes: WorkoutType[];
}

// ============================================
// BASE D'EXERCICES COMPLÈTE
// ============================================

const EXERCISES: Exercise[] = [
  // ---- ÉCHAUFFEMENT ----
  {
    id: 'warmup-jumping-jacks',
    name: 'Jumping Jacks',
    nameEn: 'Jumping Jacks',
    muscleGroups: ['full_body', 'cardio'],
    equipment: ['none'],
    difficulty: 'beginner',
    type: 'cardio',
    duration: 60,
    restSeconds: 10,
    calories_per_set: 10,
    instructions: [
      'Debout, pieds joints, bras le long du corps',
      'Sautez en écartant les pieds et levant les bras au-dessus de la tête',
      'Revenez à la position initiale en sautant',
    ],
    tips: ['Gardez un rythme régulier', 'Atterrissez sur la pointe des pieds'],
    contraindications: ['knee_problems'],
    youtubeSearchQuery: 'jumping jacks exercice tutoriel',
  },
  {
    id: 'warmup-arm-circles',
    name: 'Cercles de bras',
    nameEn: 'Arm Circles',
    muscleGroups: ['shoulders'],
    equipment: ['none'],
    difficulty: 'beginner',
    type: 'stretching',
    duration: 30,
    restSeconds: 5,
    calories_per_set: 3,
    instructions: [
      'Debout, bras tendus sur les côtés',
      'Faites de petits cercles vers l\'avant',
      'Augmentez progressivement la taille des cercles',
      'Inversez le sens après 15 secondes',
    ],
    tips: ['Gardez les bras bien tendus'],
    contraindications: ['shoulder_injury'],
    youtubeSearchQuery: 'arm circles warmup exercise',
  },
  {
    id: 'warmup-high-knees',
    name: 'Montées de genoux',
    nameEn: 'High Knees',
    muscleGroups: ['legs', 'cardio', 'core'],
    equipment: ['none'],
    difficulty: 'beginner',
    type: 'cardio',
    duration: 45,
    restSeconds: 10,
    calories_per_set: 12,
    instructions: [
      'Debout, pieds écartés largeur des hanches',
      'Montez un genou vers la poitrine',
      'Alternez rapidement les jambes',
      'Accompagnez le mouvement avec les bras',
    ],
    tips: ['Gardez le dos droit', 'Engagez les abdominaux'],
    contraindications: ['knee_problems', 'hip_problems'],
    youtubeSearchQuery: 'high knees exercise tutorial',
  },
  {
    id: 'warmup-hip-circles',
    name: 'Cercles de hanches',
    nameEn: 'Hip Circles',
    muscleGroups: ['glutes', 'core'],
    equipment: ['none'],
    difficulty: 'beginner',
    type: 'stretching',
    duration: 30,
    restSeconds: 5,
    calories_per_set: 3,
    instructions: [
      'Debout, mains sur les hanches',
      'Faites de grands cercles avec les hanches',
      'Changez de direction après 15 secondes',
    ],
    tips: ['Mouvement fluide et contrôlé'],
    contraindications: ['hip_problems'],
    youtubeSearchQuery: 'hip circles warmup',
  },
  {
    id: 'warmup-leg-swings',
    name: 'Balanciers de jambes',
    nameEn: 'Leg Swings',
    muscleGroups: ['legs', 'glutes'],
    equipment: ['none'],
    difficulty: 'beginner',
    type: 'stretching',
    duration: 30,
    restSeconds: 5,
    calories_per_set: 4,
    instructions: [
      'Tenez-vous à un mur pour l\'équilibre',
      'Balancez une jambe d\'avant en arrière',
      'Gardez la jambe tendue',
      'Changez de jambe après 15 secondes',
    ],
    tips: ['Augmentez progressivement l\'amplitude'],
    contraindications: ['hip_problems', 'back_pain'],
    youtubeSearchQuery: 'leg swings warmup exercise',
  },

  // ---- POITRINE (CHEST) ----
  {
    id: 'chest-pushups',
    name: 'Pompes classiques',
    nameEn: 'Push-ups',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    equipment: ['none'],
    difficulty: 'beginner',
    type: 'strength',
    sets: 3,
    reps: '10-15',
    restSeconds: 60,
    calories_per_set: 8,
    instructions: [
      'Position de planche, mains écartées largeur des épaules',
      'Descendez en pliant les coudes à 90°',
      'Poussez pour revenir en position haute',
      'Gardez le corps aligné tout au long du mouvement',
    ],
    tips: ['Engagez les abdominaux', 'Ne creusez pas le dos', 'Respirez en descendant, expirez en montant'],
    contraindications: ['wrist_pain', 'shoulder_injury'],
    wgerExerciseId: 182,
    youtubeSearchQuery: 'pompes classiques tutoriel technique',
  },
  {
    id: 'chest-incline-pushups',
    name: 'Pompes inclinées',
    nameEn: 'Incline Push-ups',
    muscleGroups: ['chest', 'triceps'],
    equipment: ['none'],
    difficulty: 'beginner',
    type: 'strength',
    sets: 3,
    reps: '12-15',
    restSeconds: 45,
    calories_per_set: 6,
    instructions: [
      'Placez vos mains sur un banc ou une surface surélevée',
      'Corps en ligne droite, pieds au sol',
      'Descendez la poitrine vers le support',
      'Poussez pour revenir en haut',
    ],
    tips: ['Idéal pour les débutants', 'Plus la surface est haute, plus c\'est facile'],
    contraindications: ['wrist_pain'],
    youtubeSearchQuery: 'incline pushups beginner tutorial',
  },
  {
    id: 'chest-diamond-pushups',
    name: 'Pompes diamant',
    nameEn: 'Diamond Push-ups',
    muscleGroups: ['chest', 'triceps'],
    equipment: ['none'],
    difficulty: 'intermediate',
    type: 'strength',
    sets: 3,
    reps: '8-12',
    restSeconds: 60,
    calories_per_set: 9,
    instructions: [
      'Position de pompe, mains rapprochées formant un diamant',
      'Descendez lentement en gardant les coudes près du corps',
      'Poussez explosif pour remonter',
    ],
    tips: ['Excellent pour les triceps', 'Gardez les coudes serrés'],
    contraindications: ['wrist_pain', 'shoulder_injury'],
    youtubeSearchQuery: 'diamond pushups tutorial',
  },
  {
    id: 'chest-dumbbell-press',
    name: 'Développé couché haltères',
    nameEn: 'Dumbbell Bench Press',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    equipment: ['dumbbells', 'bench'],
    difficulty: 'intermediate',
    type: 'strength',
    sets: 4,
    reps: '8-12',
    restSeconds: 90,
    calories_per_set: 10,
    instructions: [
      'Allongé sur un banc, un haltère dans chaque main',
      'Bras tendus au-dessus de la poitrine',
      'Descendez les haltères de chaque côté de la poitrine',
      'Poussez pour revenir en position haute',
    ],
    tips: ['Gardez les pieds au sol', 'Serrez les omoplates'],
    contraindications: ['shoulder_injury'],
    wgerExerciseId: 97,
    youtubeSearchQuery: 'dumbbell bench press technique',
  },
  {
    id: 'chest-dumbbell-fly',
    name: 'Écarté couché haltères',
    nameEn: 'Dumbbell Fly',
    muscleGroups: ['chest'],
    equipment: ['dumbbells', 'bench'],
    difficulty: 'intermediate',
    type: 'strength',
    sets: 3,
    reps: '10-12',
    restSeconds: 60,
    calories_per_set: 7,
    instructions: [
      'Allongé sur un banc, haltères au-dessus de la poitrine',
      'Ouvrez les bras en arc de cercle, coudes légèrement fléchis',
      'Descendez jusqu\'à sentir l\'étirement dans la poitrine',
      'Remontez en serrant la poitrine',
    ],
    tips: ['Ne descendez pas trop bas', 'Mouvement lent et contrôlé'],
    contraindications: ['shoulder_injury'],
    wgerExerciseId: 145,
    youtubeSearchQuery: 'dumbbell fly chest exercise',
  },

  // ---- DOS (BACK) ----
  {
    id: 'back-superman',
    name: 'Superman',
    nameEn: 'Superman',
    muscleGroups: ['back', 'glutes'],
    equipment: ['none'],
    difficulty: 'beginner',
    type: 'strength',
    sets: 3,
    reps: '12-15',
    restSeconds: 45,
    calories_per_set: 5,
    instructions: [
      'Allongé face au sol, bras tendus devant vous',
      'Levez simultanément les bras et les jambes',
      'Maintenez 2-3 secondes en haut',
      'Redescendez lentement',
    ],
    tips: ['Ne forcez pas sur le bas du dos', 'Regardez le sol pour garder la nuque neutre'],
    contraindications: [],
    youtubeSearchQuery: 'superman exercise back tutorial',
  },
  {
    id: 'back-pullups',
    name: 'Tractions',
    nameEn: 'Pull-ups',
    muscleGroups: ['back', 'biceps'],
    equipment: ['pull_up_bar'],
    difficulty: 'advanced',
    type: 'strength',
    sets: 4,
    reps: '5-10',
    restSeconds: 120,
    calories_per_set: 12,
    instructions: [
      'Suspendez-vous à la barre, mains en pronation (paumes vers l\'avant)',
      'Tirez-vous vers le haut jusqu\'à ce que le menton dépasse la barre',
      'Descendez lentement en contrôlant le mouvement',
    ],
    tips: ['Engagez les omoplates', 'Évitez de vous balancer'],
    contraindications: ['shoulder_injury'],
    wgerExerciseId: 107,
    youtubeSearchQuery: 'pull ups technique tutorial',
  },
  {
    id: 'back-dumbbell-row',
    name: 'Rowing haltère',
    nameEn: 'Dumbbell Row',
    muscleGroups: ['back', 'biceps'],
    equipment: ['dumbbells'],
    difficulty: 'intermediate',
    type: 'strength',
    sets: 3,
    reps: '10-12',
    restSeconds: 60,
    calories_per_set: 8,
    instructions: [
      'Un genou et une main sur un banc, l\'autre pied au sol',
      'Tenez un haltère dans la main libre',
      'Tirez l\'haltère vers la hanche en serrant l\'omoplate',
      'Redescendez lentement',
    ],
    tips: ['Gardez le dos plat', 'Ne tournez pas le torse'],
    contraindications: ['back_pain'],
    wgerExerciseId: 362,
    youtubeSearchQuery: 'dumbbell row technique dos',
  },
  {
    id: 'back-reverse-snow-angels',
    name: 'Anges de neige inversés',
    nameEn: 'Reverse Snow Angels',
    muscleGroups: ['back', 'shoulders'],
    equipment: ['none'],
    difficulty: 'beginner',
    type: 'strength',
    sets: 3,
    reps: '10-12',
    restSeconds: 45,
    calories_per_set: 5,
    instructions: [
      'Allongé face au sol, bras le long du corps',
      'Levez les bras et les jambes du sol',
      'Faites glisser les bras en arc de cercle au-dessus de la tête',
      'Revenez à la position de départ',
    ],
    tips: ['Mouvement lent et contrôlé', 'Gardez la tête neutre'],
    contraindications: ['shoulder_injury'],
    youtubeSearchQuery: 'reverse snow angels back exercise',
  },
  {
    id: 'back-band-pulldown',
    name: 'Tirage élastique',
    nameEn: 'Band Pulldown',
    muscleGroups: ['back', 'biceps'],
    equipment: ['resistance_bands'],
    difficulty: 'beginner',
    type: 'strength',
    sets: 3,
    reps: '12-15',
    restSeconds: 45,
    calories_per_set: 6,
    instructions: [
      'Fixez l\'élastique en hauteur',
      'Saisissez les extrémités, bras tendus au-dessus',
      'Tirez vers le bas en serrant les omoplates',
      'Remontez lentement',
    ],
    tips: ['Gardez le torse droit', 'Concentrez-vous sur le dos'],
    contraindications: [],
    youtubeSearchQuery: 'resistance band lat pulldown',
  },

  // ---- ÉPAULES (SHOULDERS) ----
  {
    id: 'shoulders-pike-pushups',
    name: 'Pompes piquées',
    nameEn: 'Pike Push-ups',
    muscleGroups: ['shoulders', 'triceps'],
    equipment: ['none'],
    difficulty: 'intermediate',
    type: 'strength',
    sets: 3,
    reps: '8-12',
    restSeconds: 60,
    calories_per_set: 8,
    instructions: [
      'Position de pompe, hanches levées formant un V inversé',
      'Pliez les coudes pour descendre la tête vers le sol',
      'Poussez pour revenir en position haute',
    ],
    tips: ['Plus les pieds sont proches des mains, plus c\'est difficile'],
    contraindications: ['shoulder_injury', 'wrist_pain'],
    youtubeSearchQuery: 'pike pushups shoulders tutorial',
  },
  {
    id: 'shoulders-lateral-raise',
    name: 'Élévations latérales',
    nameEn: 'Lateral Raises',
    muscleGroups: ['shoulders'],
    equipment: ['dumbbells'],
    difficulty: 'beginner',
    type: 'strength',
    sets: 3,
    reps: '12-15',
    restSeconds: 45,
    calories_per_set: 5,
    instructions: [
      'Debout, un haltère dans chaque main le long du corps',
      'Levez les bras sur les côtés jusqu\'à hauteur des épaules',
      'Redescendez lentement',
    ],
    tips: ['Ne balancez pas le corps', 'Légère flexion des coudes'],
    contraindications: ['shoulder_injury'],
    wgerExerciseId: 148,
    youtubeSearchQuery: 'lateral raises dumbbell technique',
  },
  {
    id: 'shoulders-overhead-press',
    name: 'Développé militaire haltères',
    nameEn: 'Dumbbell Overhead Press',
    muscleGroups: ['shoulders', 'triceps'],
    equipment: ['dumbbells'],
    difficulty: 'intermediate',
    type: 'strength',
    sets: 4,
    reps: '8-10',
    restSeconds: 90,
    calories_per_set: 9,
    instructions: [
      'Debout ou assis, haltères à hauteur des épaules',
      'Poussez les haltères au-dessus de la tête',
      'Redescendez lentement à la position de départ',
    ],
    tips: ['Engagez les abdominaux', 'Ne cambrez pas le dos'],
    contraindications: ['shoulder_injury', 'back_pain'],
    wgerExerciseId: 123,
    youtubeSearchQuery: 'dumbbell overhead press technique',
  },
  {
    id: 'shoulders-front-raise',
    name: 'Élévations frontales',
    nameEn: 'Front Raises',
    muscleGroups: ['shoulders'],
    equipment: ['dumbbells'],
    difficulty: 'beginner',
    type: 'strength',
    sets: 3,
    reps: '12-15',
    restSeconds: 45,
    calories_per_set: 5,
    instructions: [
      'Debout, haltères devant les cuisses',
      'Levez un bras devant vous jusqu\'à hauteur des épaules',
      'Redescendez et alternez',
    ],
    tips: ['Mouvement contrôlé', 'Ne balancez pas'],
    contraindications: ['shoulder_injury'],
    youtubeSearchQuery: 'front raises dumbbell tutorial',
  },

  // ---- BICEPS ----
  {
    id: 'biceps-curls',
    name: 'Curls biceps',
    nameEn: 'Bicep Curls',
    muscleGroups: ['biceps'],
    equipment: ['dumbbells'],
    difficulty: 'beginner',
    type: 'strength',
    sets: 3,
    reps: '10-12',
    restSeconds: 45,
    calories_per_set: 5,
    instructions: [
      'Debout, un haltère dans chaque main, paumes vers l\'avant',
      'Pliez les coudes pour monter les haltères vers les épaules',
      'Redescendez lentement en contrôlant',
    ],
    tips: ['Gardez les coudes collés au corps', 'Ne balancez pas'],
    contraindications: ['wrist_pain'],
    wgerExerciseId: 81,
    youtubeSearchQuery: 'bicep curls dumbbell technique',
  },
  {
    id: 'biceps-hammer-curls',
    name: 'Curls marteau',
    nameEn: 'Hammer Curls',
    muscleGroups: ['biceps'],
    equipment: ['dumbbells'],
    difficulty: 'beginner',
    type: 'strength',
    sets: 3,
    reps: '10-12',
    restSeconds: 45,
    calories_per_set: 5,
    instructions: [
      'Debout, haltères le long du corps, paumes face à face',
      'Montez les haltères en gardant les paumes face à face',
      'Redescendez lentement',
    ],
    tips: ['Travaille aussi les avant-bras', 'Mouvement strict'],
    contraindications: ['wrist_pain'],
    youtubeSearchQuery: 'hammer curls technique tutorial',
  },
  {
    id: 'biceps-band-curls',
    name: 'Curls élastique',
    nameEn: 'Band Curls',
    muscleGroups: ['biceps'],
    equipment: ['resistance_bands'],
    difficulty: 'beginner',
    type: 'strength',
    sets: 3,
    reps: '15-20',
    restSeconds: 30,
    calories_per_set: 4,
    instructions: [
      'Debout sur l\'élastique, saisissez les extrémités',
      'Pliez les coudes pour monter les mains vers les épaules',
      'Redescendez lentement',
    ],
    tips: ['Tension constante', 'Gardez les coudes fixes'],
    contraindications: [],
    youtubeSearchQuery: 'resistance band bicep curls',
  },

  // ---- TRICEPS ----
  {
    id: 'triceps-dips',
    name: 'Dips sur chaise',
    nameEn: 'Chair Dips',
    muscleGroups: ['triceps', 'chest'],
    equipment: ['none'],
    difficulty: 'beginner',
    type: 'strength',
    sets: 3,
    reps: '10-15',
    restSeconds: 60,
    calories_per_set: 7,
    instructions: [
      'Mains sur le bord d\'une chaise, pieds au sol',
      'Descendez en pliant les coudes à 90°',
      'Poussez pour remonter',
    ],
    tips: ['Gardez le dos près de la chaise', 'Ne descendez pas trop bas'],
    contraindications: ['shoulder_injury', 'wrist_pain'],
    youtubeSearchQuery: 'chair dips triceps tutorial',
  },
  {
    id: 'triceps-overhead-extension',
    name: 'Extension triceps au-dessus de la tête',
    nameEn: 'Overhead Tricep Extension',
    muscleGroups: ['triceps'],
    equipment: ['dumbbells'],
    difficulty: 'beginner',
    type: 'strength',
    sets: 3,
    reps: '10-12',
    restSeconds: 45,
    calories_per_set: 5,
    instructions: [
      'Debout, tenez un haltère à deux mains derrière la tête',
      'Tendez les bras vers le haut',
      'Redescendez lentement derrière la tête',
    ],
    tips: ['Gardez les coudes près des oreilles', 'Engagez les abdominaux'],
    contraindications: ['shoulder_injury'],
    youtubeSearchQuery: 'overhead tricep extension dumbbell',
  },
  {
    id: 'triceps-kickback',
    name: 'Kickback triceps',
    nameEn: 'Tricep Kickback',
    muscleGroups: ['triceps'],
    equipment: ['dumbbells'],
    difficulty: 'beginner',
    type: 'strength',
    sets: 3,
    reps: '12-15',
    restSeconds: 45,
    calories_per_set: 5,
    instructions: [
      'Penché en avant, coude plié à 90°',
      'Tendez le bras vers l\'arrière',
      'Revenez lentement à 90°',
    ],
    tips: ['Gardez le coude fixe', 'Serrez le triceps en haut'],
    contraindications: ['back_pain'],
    youtubeSearchQuery: 'tricep kickback dumbbell technique',
  },

  // ---- JAMBES (LEGS) ----
  {
    id: 'legs-squats',
    name: 'Squats',
    nameEn: 'Bodyweight Squats',
    muscleGroups: ['legs', 'glutes'],
    equipment: ['none'],
    difficulty: 'beginner',
    type: 'strength',
    sets: 3,
    reps: '15-20',
    restSeconds: 60,
    calories_per_set: 10,
    instructions: [
      'Debout, pieds écartés largeur des épaules',
      'Descendez comme pour vous asseoir, cuisses parallèles au sol',
      'Gardez le poids sur les talons',
      'Remontez en poussant sur les talons',
    ],
    tips: ['Genoux dans l\'axe des pieds', 'Dos droit', 'Regardez devant vous'],
    contraindications: [],
    wgerExerciseId: 111,
    youtubeSearchQuery: 'squats technique débutant tutoriel',
  },
  {
    id: 'legs-lunges',
    name: 'Fentes avant',
    nameEn: 'Forward Lunges',
    muscleGroups: ['legs', 'glutes'],
    equipment: ['none'],
    difficulty: 'beginner',
    type: 'strength',
    sets: 3,
    reps: '10 par jambe',
    restSeconds: 60,
    calories_per_set: 9,
    instructions: [
      'Debout, faites un grand pas en avant',
      'Descendez jusqu\'à ce que les deux genoux soient à 90°',
      'Poussez sur le pied avant pour revenir',
      'Alternez les jambes',
    ],
    tips: ['Genou avant ne dépasse pas les orteils', 'Torse droit'],
    contraindications: ['knee_problems'],
    wgerExerciseId: 112,
    youtubeSearchQuery: 'fentes avant technique tutoriel',
  },
  {
    id: 'legs-wall-sit',
    name: 'Chaise murale',
    nameEn: 'Wall Sit',
    muscleGroups: ['legs'],
    equipment: ['none'],
    difficulty: 'beginner',
    type: 'strength',
    duration: 30,
    restSeconds: 60,
    calories_per_set: 8,
    instructions: [
      'Dos contre un mur, descendez en position assise',
      'Cuisses parallèles au sol, genoux à 90°',
      'Maintenez la position',
    ],
    tips: ['Respirez normalement', 'Poussez le dos contre le mur'],
    contraindications: ['knee_problems'],
    youtubeSearchQuery: 'wall sit exercise tutorial',
  },
  {
    id: 'legs-goblet-squat',
    name: 'Goblet squat',
    nameEn: 'Goblet Squat',
    muscleGroups: ['legs', 'glutes', 'core'],
    equipment: ['dumbbells'],
    difficulty: 'intermediate',
    type: 'strength',
    sets: 4,
    reps: '10-12',
    restSeconds: 60,
    calories_per_set: 11,
    instructions: [
      'Tenez un haltère verticalement contre la poitrine',
      'Pieds écartés, orteils légèrement vers l\'extérieur',
      'Descendez en squat profond',
      'Remontez en poussant sur les talons',
    ],
    tips: ['L\'haltère aide à garder le dos droit', 'Descendez le plus bas possible'],
    contraindications: ['knee_problems'],
    youtubeSearchQuery: 'goblet squat dumbbell technique',
  },
  {
    id: 'legs-step-ups',
    name: 'Step-ups',
    nameEn: 'Step-ups',
    muscleGroups: ['legs', 'glutes'],
    equipment: ['none'],
    difficulty: 'beginner',
    type: 'strength',
    sets: 3,
    reps: '10 par jambe',
    restSeconds: 45,
    calories_per_set: 8,
    instructions: [
      'Face à une marche ou un banc solide',
      'Montez un pied sur la marche',
      'Poussez pour monter complètement',
      'Redescendez et alternez',
    ],
    tips: ['Gardez le torse droit', 'Poussez avec le talon'],
    contraindications: ['knee_problems'],
    youtubeSearchQuery: 'step ups exercise tutorial',
  },
  {
    id: 'legs-calf-raises',
    name: 'Mollets debout',
    nameEn: 'Calf Raises',
    muscleGroups: ['legs'],
    equipment: ['none'],
    difficulty: 'beginner',
    type: 'strength',
    sets: 3,
    reps: '15-20',
    restSeconds: 30,
    calories_per_set: 4,
    instructions: [
      'Debout, pieds écartés largeur des hanches',
      'Montez sur la pointe des pieds',
      'Maintenez 1-2 secondes en haut',
      'Redescendez lentement',
    ],
    tips: ['Faites-le sur une marche pour plus d\'amplitude'],
    contraindications: [],
    youtubeSearchQuery: 'calf raises exercise tutorial',
  },
  {
    id: 'legs-sumo-squat',
    name: 'Squat sumo',
    nameEn: 'Sumo Squat',
    muscleGroups: ['legs', 'glutes'],
    equipment: ['none'],
    difficulty: 'beginner',
    type: 'strength',
    sets: 3,
    reps: '15-20',
    restSeconds: 60,
    calories_per_set: 10,
    instructions: [
      'Pieds très écartés, orteils vers l\'extérieur',
      'Descendez en gardant le dos droit',
      'Poussez sur les talons pour remonter',
    ],
    tips: ['Cible davantage l\'intérieur des cuisses', 'Genoux dans l\'axe des pieds'],
    contraindications: ['hip_problems'],
    youtubeSearchQuery: 'sumo squat technique tutorial',
  },
  {
    id: 'legs-glute-bridge',
    name: 'Pont fessier',
    nameEn: 'Glute Bridge',
    muscleGroups: ['glutes', 'legs'],
    equipment: ['none'],
    difficulty: 'beginner',
    type: 'strength',
    sets: 3,
    reps: '15-20',
    restSeconds: 45,
    calories_per_set: 6,
    instructions: [
      'Allongé sur le dos, genoux pliés, pieds au sol',
      'Levez les hanches en serrant les fessiers',
      'Maintenez 2 secondes en haut',
      'Redescendez lentement',
    ],
    tips: ['Serrez fort les fessiers en haut', 'Ne cambrez pas le dos'],
    contraindications: [],
    wgerExerciseId: 171,
    youtubeSearchQuery: 'glute bridge exercise technique',
  },
  {
    id: 'legs-single-leg-deadlift',
    name: 'Soulevé de terre unipodal',
    nameEn: 'Single Leg Deadlift',
    muscleGroups: ['legs', 'glutes', 'back'],
    equipment: ['dumbbells'],
    difficulty: 'intermediate',
    type: 'strength',
    sets: 3,
    reps: '8-10 par jambe',
    restSeconds: 60,
    calories_per_set: 8,
    instructions: [
      'Debout sur une jambe, haltère dans la main opposée',
      'Penchez-vous en avant en levant la jambe arrière',
      'Gardez le dos plat',
      'Revenez en position debout',
    ],
    tips: ['Excellent pour l\'équilibre', 'Mouvement lent'],
    contraindications: ['back_pain'],
    youtubeSearchQuery: 'single leg deadlift dumbbell technique',
  },

  // ---- ABDOMINAUX (CORE) ----
  {
    id: 'core-plank',
    name: 'Planche',
    nameEn: 'Plank',
    muscleGroups: ['core'],
    equipment: ['none'],
    difficulty: 'beginner',
    type: 'strength',
    duration: 30,
    restSeconds: 30,
    calories_per_set: 5,
    instructions: [
      'Appui sur les avant-bras et les orteils',
      'Corps en ligne droite de la tête aux pieds',
      'Engagez les abdominaux',
      'Maintenez la position',
    ],
    tips: ['Ne laissez pas les hanches descendre', 'Respirez normalement'],
    contraindications: [],
    wgerExerciseId: 238,
    youtubeSearchQuery: 'planche abdominaux technique tutoriel',
  },
  {
    id: 'core-crunches',
    name: 'Crunchs',
    nameEn: 'Crunches',
    muscleGroups: ['core'],
    equipment: ['none'],
    difficulty: 'beginner',
    type: 'strength',
    sets: 3,
    reps: '15-20',
    restSeconds: 30,
    calories_per_set: 5,
    instructions: [
      'Allongé sur le dos, genoux pliés',
      'Mains derrière la tête ou croisées sur la poitrine',
      'Soulevez les épaules du sol en contractant les abdos',
      'Redescendez lentement',
    ],
    tips: ['Ne tirez pas sur la nuque', 'Expirez en montant'],
    contraindications: ['back_pain'],
    youtubeSearchQuery: 'crunches abdominaux technique',
  },
  {
    id: 'core-bicycle-crunches',
    name: 'Crunchs vélo',
    nameEn: 'Bicycle Crunches',
    muscleGroups: ['core'],
    equipment: ['none'],
    difficulty: 'intermediate',
    type: 'strength',
    sets: 3,
    reps: '20 (10 par côté)',
    restSeconds: 30,
    calories_per_set: 7,
    instructions: [
      'Allongé sur le dos, mains derrière la tête',
      'Amenez le coude droit vers le genou gauche',
      'Alternez en pédalant',
    ],
    tips: ['Mouvement contrôlé', 'Tournez le torse, pas juste les coudes'],
    contraindications: ['back_pain'],
    youtubeSearchQuery: 'bicycle crunches technique tutorial',
  },
  {
    id: 'core-mountain-climbers',
    name: 'Mountain climbers',
    nameEn: 'Mountain Climbers',
    muscleGroups: ['core', 'cardio', 'legs'],
    equipment: ['none'],
    difficulty: 'intermediate',
    type: 'hiit',
    duration: 30,
    restSeconds: 30,
    calories_per_set: 12,
    instructions: [
      'Position de planche haute',
      'Amenez un genou vers la poitrine',
      'Alternez rapidement les jambes',
    ],
    tips: ['Gardez les hanches basses', 'Rythme rapide pour le cardio'],
    contraindications: ['wrist_pain'],
    youtubeSearchQuery: 'mountain climbers exercise tutorial',
  },
  {
    id: 'core-russian-twist',
    name: 'Russian twist',
    nameEn: 'Russian Twist',
    muscleGroups: ['core'],
    equipment: ['none'],
    difficulty: 'intermediate',
    type: 'strength',
    sets: 3,
    reps: '20 (10 par côté)',
    restSeconds: 30,
    calories_per_set: 6,
    instructions: [
      'Assis, genoux pliés, pieds légèrement levés',
      'Penchez le torse en arrière à 45°',
      'Tournez le torse de gauche à droite',
    ],
    tips: ['Gardez le dos droit', 'Ajoutez un poids pour plus de difficulté'],
    contraindications: ['back_pain'],
    youtubeSearchQuery: 'russian twist exercise tutorial',
  },
  {
    id: 'core-leg-raises',
    name: 'Relevés de jambes',
    nameEn: 'Leg Raises',
    muscleGroups: ['core'],
    equipment: ['none'],
    difficulty: 'intermediate',
    type: 'strength',
    sets: 3,
    reps: '10-15',
    restSeconds: 45,
    calories_per_set: 6,
    instructions: [
      'Allongé sur le dos, jambes tendues',
      'Levez les jambes à 90° en gardant le bas du dos au sol',
      'Redescendez lentement sans toucher le sol',
    ],
    tips: ['Placez les mains sous les fesses si besoin', 'Mouvement lent'],
    contraindications: ['back_pain'],
    youtubeSearchQuery: 'leg raises abs exercise tutorial',
  },
  {
    id: 'core-dead-bug',
    name: 'Dead bug',
    nameEn: 'Dead Bug',
    muscleGroups: ['core'],
    equipment: ['none'],
    difficulty: 'beginner',
    type: 'strength',
    sets: 3,
    reps: '10 par côté',
    restSeconds: 30,
    calories_per_set: 5,
    instructions: [
      'Allongé sur le dos, bras tendus vers le plafond, genoux à 90°',
      'Tendez le bras droit et la jambe gauche simultanément',
      'Revenez et alternez',
    ],
    tips: ['Gardez le bas du dos collé au sol', 'Excellent pour les débutants'],
    contraindications: [],
    youtubeSearchQuery: 'dead bug exercise core tutorial',
  },

  // ---- HIIT / CARDIO ----
  {
    id: 'hiit-burpees',
    name: 'Burpees',
    nameEn: 'Burpees',
    muscleGroups: ['full_body', 'cardio'],
    equipment: ['none'],
    difficulty: 'advanced',
    type: 'hiit',
    sets: 3,
    reps: '8-12',
    restSeconds: 60,
    calories_per_set: 15,
    instructions: [
      'Debout, descendez en squat, mains au sol',
      'Sautez les pieds en arrière en position de planche',
      'Faites une pompe',
      'Ramenez les pieds et sautez en l\'air',
    ],
    tips: ['Mouvement explosif', 'Modifiez en supprimant la pompe si besoin'],
    contraindications: ['knee_problems', 'back_pain', 'wrist_pain'],
    youtubeSearchQuery: 'burpees technique tutorial',
  },
  {
    id: 'hiit-squat-jumps',
    name: 'Squats sautés',
    nameEn: 'Squat Jumps',
    muscleGroups: ['legs', 'glutes', 'cardio'],
    equipment: ['none'],
    difficulty: 'intermediate',
    type: 'hiit',
    sets: 3,
    reps: '10-15',
    restSeconds: 60,
    calories_per_set: 12,
    instructions: [
      'Descendez en squat',
      'Sautez explosif en l\'air',
      'Atterrissez en douceur en squat',
    ],
    tips: ['Atterrissez sur la pointe des pieds', 'Amortissez bien'],
    contraindications: ['knee_problems', 'back_pain'],
    youtubeSearchQuery: 'squat jumps exercise tutorial',
  },
  {
    id: 'hiit-plank-jacks',
    name: 'Plank jacks',
    nameEn: 'Plank Jacks',
    muscleGroups: ['core', 'cardio'],
    equipment: ['none'],
    difficulty: 'intermediate',
    type: 'hiit',
    duration: 30,
    restSeconds: 30,
    calories_per_set: 10,
    instructions: [
      'Position de planche haute',
      'Sautez les pieds écartés puis joints',
      'Comme des jumping jacks en position de planche',
    ],
    tips: ['Gardez les hanches stables', 'Engagez les abdominaux'],
    contraindications: ['wrist_pain', 'back_pain'],
    youtubeSearchQuery: 'plank jacks exercise tutorial',
  },
  {
    id: 'hiit-skaters',
    name: 'Patineurs',
    nameEn: 'Skaters',
    muscleGroups: ['legs', 'glutes', 'cardio'],
    equipment: ['none'],
    difficulty: 'intermediate',
    type: 'hiit',
    duration: 30,
    restSeconds: 30,
    calories_per_set: 10,
    instructions: [
      'Sautez latéralement d\'un pied à l\'autre',
      'Croisez la jambe arrière derrière vous',
      'Balancez les bras pour l\'élan',
    ],
    tips: ['Atterrissez en douceur', 'Gardez le centre de gravité bas'],
    contraindications: ['knee_problems', 'hip_problems'],
    youtubeSearchQuery: 'skater exercise lateral jumps',
  },
  {
    id: 'cardio-marche-rapide',
    name: 'Marche rapide sur place',
    nameEn: 'Fast March in Place',
    muscleGroups: ['cardio', 'legs'],
    equipment: ['none'],
    difficulty: 'beginner',
    type: 'cardio',
    duration: 120,
    restSeconds: 30,
    calories_per_set: 15,
    instructions: [
      'Marchez rapidement sur place',
      'Levez bien les genoux',
      'Balancez les bras',
    ],
    tips: ['Idéal pour l\'échauffement ou les débutants', 'Augmentez le rythme progressivement'],
    contraindications: [],
    youtubeSearchQuery: 'marche rapide sur place exercice',
  },
  {
    id: 'cardio-shadow-boxing',
    name: 'Shadow boxing',
    nameEn: 'Shadow Boxing',
    muscleGroups: ['cardio', 'shoulders', 'core'],
    equipment: ['none'],
    difficulty: 'beginner',
    type: 'cardio',
    duration: 60,
    restSeconds: 30,
    calories_per_set: 12,
    instructions: [
      'Position de garde, pieds décalés',
      'Enchaînez des coups de poing dans le vide',
      'Bougez les pieds, esquivez',
    ],
    tips: ['Gardez les mains hautes', 'Engagez le torse dans les coups'],
    contraindications: ['shoulder_injury'],
    youtubeSearchQuery: 'shadow boxing workout beginner',
  },

  // ---- YOGA / ÉTIREMENTS ----
  {
    id: 'yoga-downward-dog',
    name: 'Chien tête en bas',
    nameEn: 'Downward Dog',
    muscleGroups: ['full_body'],
    equipment: ['none'],
    difficulty: 'beginner',
    type: 'yoga',
    duration: 30,
    restSeconds: 10,
    calories_per_set: 3,
    instructions: [
      'À quatre pattes, levez les hanches vers le plafond',
      'Formez un V inversé avec le corps',
      'Poussez les talons vers le sol',
      'Bras tendus, tête entre les bras',
    ],
    tips: ['Pliez les genoux si les ischio-jambiers sont raides'],
    contraindications: ['wrist_pain'],
    youtubeSearchQuery: 'downward dog yoga pose tutorial',
  },
  {
    id: 'yoga-warrior-2',
    name: 'Guerrier II',
    nameEn: 'Warrior II',
    muscleGroups: ['legs', 'core'],
    equipment: ['none'],
    difficulty: 'beginner',
    type: 'yoga',
    duration: 30,
    restSeconds: 10,
    calories_per_set: 4,
    instructions: [
      'Grand écart de jambes, pied avant tourné à 90°',
      'Pliez le genou avant à 90°',
      'Bras tendus parallèles au sol',
      'Regardez au-dessus de la main avant',
    ],
    tips: ['Genou au-dessus de la cheville', 'Ouvrez les hanches'],
    contraindications: ['knee_problems'],
    youtubeSearchQuery: 'warrior 2 yoga pose tutorial',
  },
  {
    id: 'yoga-childs-pose',
    name: 'Posture de l\'enfant',
    nameEn: 'Child\'s Pose',
    muscleGroups: ['back'],
    equipment: ['none'],
    difficulty: 'beginner',
    type: 'yoga',
    duration: 30,
    restSeconds: 5,
    calories_per_set: 2,
    instructions: [
      'À genoux, asseyez-vous sur les talons',
      'Penchez-vous en avant, bras tendus devant',
      'Front au sol, respirez profondément',
    ],
    tips: ['Excellent pour la récupération', 'Écartez les genoux si besoin'],
    contraindications: [],
    youtubeSearchQuery: 'child pose yoga tutorial',
  },
  {
    id: 'stretch-quad',
    name: 'Étirement quadriceps',
    nameEn: 'Quad Stretch',
    muscleGroups: ['legs'],
    equipment: ['none'],
    difficulty: 'beginner',
    type: 'stretching',
    duration: 30,
    restSeconds: 5,
    calories_per_set: 2,
    instructions: [
      'Debout, attrapez un pied derrière vous',
      'Tirez le talon vers les fessiers',
      'Gardez les genoux joints',
      'Maintenez 15 secondes par jambe',
    ],
    tips: ['Tenez-vous à un mur pour l\'équilibre'],
    contraindications: ['knee_problems'],
    youtubeSearchQuery: 'quad stretch standing tutorial',
  },
  {
    id: 'stretch-hamstring',
    name: 'Étirement ischio-jambiers',
    nameEn: 'Hamstring Stretch',
    muscleGroups: ['legs'],
    equipment: ['none'],
    difficulty: 'beginner',
    type: 'stretching',
    duration: 30,
    restSeconds: 5,
    calories_per_set: 2,
    instructions: [
      'Assis, une jambe tendue devant vous',
      'Penchez-vous en avant vers le pied',
      'Gardez le dos droit',
      'Maintenez 15 secondes par jambe',
    ],
    tips: ['Ne forcez pas', 'Respirez profondément'],
    contraindications: ['back_pain'],
    youtubeSearchQuery: 'hamstring stretch seated tutorial',
  },
  {
    id: 'stretch-chest-doorway',
    name: 'Étirement pectoraux',
    nameEn: 'Doorway Chest Stretch',
    muscleGroups: ['chest', 'shoulders'],
    equipment: ['none'],
    difficulty: 'beginner',
    type: 'stretching',
    duration: 30,
    restSeconds: 5,
    calories_per_set: 2,
    instructions: [
      'Placez l\'avant-bras contre un cadre de porte',
      'Avancez le pied du même côté',
      'Tournez le torse pour sentir l\'étirement',
      'Maintenez 15 secondes par côté',
    ],
    tips: ['Coude à hauteur de l\'épaule'],
    contraindications: ['shoulder_injury'],
    youtubeSearchQuery: 'doorway chest stretch tutorial',
  },
];

// ============================================
// FONCTIONS DE GÉNÉRATION
// ============================================

function getExercisesForMuscle(
  muscle: MuscleGroup,
  difficulty: Difficulty,
  equipment: Equipment[],
  limitations: Limitation[]
): Exercise[] {
  return EXERCISES.filter(ex => {
    // Filtre par groupe musculaire
    if (!ex.muscleGroups.includes(muscle)) return false;
    
    // Filtre par équipement disponible
    if (!ex.equipment.some(eq => equipment.includes(eq))) return false;
    
    // Filtre par contre-indications
    if (ex.contraindications.some(c => limitations.includes(c))) return false;
    
    // Filtre par difficulté (inclure les niveaux inférieurs ou égaux)
    const difficultyOrder: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
    const maxLevel = difficultyOrder.indexOf(difficulty);
    const exLevel = difficultyOrder.indexOf(ex.difficulty);
    if (exLevel > maxLevel) return false;
    
    // Exclure les exercices d'échauffement et d'étirement
    if (ex.type === 'stretching' || ex.type === 'yoga') return false;
    
    return true;
  });
}

function getWarmupExercises(limitations: Limitation[]): Exercise[] {
  const warmups = EXERCISES.filter(ex => 
    ex.id.startsWith('warmup-') && 
    !ex.contraindications.some(c => limitations.includes(c))
  );
  // Retourner 3-4 exercices d'échauffement
  return shuffleArray(warmups).slice(0, Math.min(4, warmups.length));
}

function getCooldownExercises(limitations: Limitation[]): Exercise[] {
  const stretches = EXERCISES.filter(ex => 
    (ex.type === 'stretching' || ex.type === 'yoga') &&
    !ex.contraindications.some(c => limitations.includes(c))
  );
  return shuffleArray(stretches).slice(0, Math.min(4, stretches.length));
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Splits d'entraînement selon le nombre de jours
function getSplitForDays(daysPerWeek: number, goal: SportGoal): { name: string; muscles: MuscleGroup[] }[] {
  if (goal === 'weight_loss' || goal === 'endurance') {
    // Full body + cardio focus
    const sessions: { name: string; muscles: MuscleGroup[] }[] = [];
    const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    for (let i = 0; i < daysPerWeek; i++) {
      if (i % 2 === 0) {
        sessions.push({ name: `${dayNames[i]} - Full Body + Cardio`, muscles: ['full_body', 'cardio', 'core'] });
      } else {
        sessions.push({ name: `${dayNames[i]} - HIIT + Abdos`, muscles: ['cardio', 'core', 'legs'] });
      }
    }
    return sessions;
  }

  if (goal === 'flexibility') {
    const sessions: { name: string; muscles: MuscleGroup[] }[] = [];
    const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    for (let i = 0; i < daysPerWeek; i++) {
      sessions.push({ name: `${dayNames[i]} - Yoga & Étirements`, muscles: ['full_body'] });
    }
    return sessions;
  }

  // Muscle gain / general fitness
  switch (daysPerWeek) {
    case 2:
      return [
        { name: 'Jour A - Haut du corps', muscles: ['chest', 'back', 'shoulders', 'biceps', 'triceps'] },
        { name: 'Jour B - Bas du corps + Abdos', muscles: ['legs', 'glutes', 'core'] },
      ];
    case 3:
      return [
        { name: 'Jour A - Poussée (Push)', muscles: ['chest', 'shoulders', 'triceps'] },
        { name: 'Jour B - Tirage (Pull)', muscles: ['back', 'biceps', 'core'] },
        { name: 'Jour C - Jambes', muscles: ['legs', 'glutes', 'core'] },
      ];
    case 4:
      return [
        { name: 'Jour A - Poitrine & Triceps', muscles: ['chest', 'triceps'] },
        { name: 'Jour B - Dos & Biceps', muscles: ['back', 'biceps'] },
        { name: 'Jour C - Épaules & Abdos', muscles: ['shoulders', 'core'] },
        { name: 'Jour D - Jambes & Fessiers', muscles: ['legs', 'glutes'] },
      ];
    case 5:
      return [
        { name: 'Jour A - Poitrine', muscles: ['chest', 'triceps'] },
        { name: 'Jour B - Dos', muscles: ['back', 'biceps'] },
        { name: 'Jour C - Épaules & Abdos', muscles: ['shoulders', 'core'] },
        { name: 'Jour D - Jambes', muscles: ['legs', 'glutes'] },
        { name: 'Jour E - Full Body + Cardio', muscles: ['full_body', 'cardio'] },
      ];
    case 6:
      return [
        { name: 'Jour A - Poitrine & Triceps', muscles: ['chest', 'triceps'] },
        { name: 'Jour B - Dos & Biceps', muscles: ['back', 'biceps'] },
        { name: 'Jour C - Jambes', muscles: ['legs', 'glutes'] },
        { name: 'Jour D - Épaules & Abdos', muscles: ['shoulders', 'core'] },
        { name: 'Jour E - Full Body', muscles: ['chest', 'back', 'legs'] },
        { name: 'Jour F - Cardio & Mobilité', muscles: ['cardio', 'full_body'] },
      ];
    default:
      return [
        { name: 'Full Body', muscles: ['chest', 'back', 'legs', 'core'] },
      ];
  }
}

function selectExercisesForSession(
  muscles: MuscleGroup[],
  profile: SportProfile,
  sessionDuration: number
): Exercise[] {
  const selected: Exercise[] = [];
  const targetExerciseCount = Math.floor(sessionDuration / 8); // ~8 min per exercise with rest

  for (const muscle of muscles) {
    if (muscle === 'full_body') {
      // Pour full body, prendre un exercice de chaque groupe principal
      const mainGroups: MuscleGroup[] = ['chest', 'back', 'legs', 'core'];
      for (const mg of mainGroups) {
        const available = getExercisesForMuscle(mg, profile.fitnessLevel, profile.availableEquipment, profile.limitations);
        if (available.length > 0) {
          selected.push(shuffleArray(available)[0]);
        }
      }
      continue;
    }

    if (muscle === 'cardio') {
      const cardioExercises = EXERCISES.filter(ex =>
        (ex.type === 'hiit' || ex.type === 'cardio') &&
        ex.equipment.some(eq => profile.availableEquipment.includes(eq)) &&
        !ex.contraindications.some(c => profile.limitations.includes(c)) &&
        !ex.id.startsWith('warmup-')
      );
      const diffOrder: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
      const maxLevel = diffOrder.indexOf(profile.fitnessLevel);
      const filtered = cardioExercises.filter(ex => diffOrder.indexOf(ex.difficulty) <= maxLevel);
      const picked = shuffleArray(filtered).slice(0, 2);
      selected.push(...picked);
      continue;
    }

    const available = getExercisesForMuscle(muscle, profile.fitnessLevel, profile.availableEquipment, profile.limitations);
    const count = Math.min(2, available.length);
    const picked = shuffleArray(available).slice(0, count);
    selected.push(...picked);
  }

  // Limiter au nombre cible
  return selected.slice(0, targetExerciseCount);
}

export function generateWorkoutPlan(profile: SportProfile): WorkoutPlan {
  const split = getSplitForDays(profile.daysPerWeek, profile.goal);
  
  const sessions: WorkoutSession[] = split.map((day, index) => {
    const warmup = getWarmupExercises(profile.limitations);
    const exercises = selectExercisesForSession(day.muscles, profile, profile.sessionDuration);
    const cooldown = getCooldownExercises(profile.limitations);

    const warmupDuration = warmup.reduce((sum, ex) => sum + (ex.duration || 30) + ex.restSeconds, 0) / 60;
    const exerciseDuration = exercises.reduce((sum, ex) => {
      const exTime = ex.duration ? ex.duration : (ex.sets || 3) * 40; // ~40s per set
      return sum + exTime + (ex.sets || 1) * ex.restSeconds;
    }, 0) / 60;
    const cooldownDuration = cooldown.reduce((sum, ex) => sum + (ex.duration || 30) + ex.restSeconds, 0) / 60;

    const totalDuration = Math.round(warmupDuration + exerciseDuration + cooldownDuration);
    const totalCalories = Math.round(
      warmup.reduce((sum, ex) => sum + ex.calories_per_set, 0) +
      exercises.reduce((sum, ex) => sum + ex.calories_per_set * (ex.sets || 1), 0) +
      cooldown.reduce((sum, ex) => sum + ex.calories_per_set, 0)
    );

    return {
      id: generateId(),
      dayNumber: index + 1,
      dayName: day.name,
      name: day.name,
      focusAreas: day.muscles,
      warmup,
      exercises,
      cooldown,
      estimatedDuration: Math.max(totalDuration, 20),
      estimatedCalories: Math.max(totalCalories, 80),
    };
  });

  const goalNames: Record<SportGoal, string> = {
    weight_loss: 'Perte de poids',
    muscle_gain: 'Prise de muscle',
    endurance: 'Endurance',
    flexibility: 'Souplesse',
    general_fitness: 'Forme générale',
  };

  const difficultyNames: Record<Difficulty, string> = {
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé',
  };

  return {
    id: generateId(),
    name: `Programme ${goalNames[profile.goal]} - ${difficultyNames[profile.fitnessLevel]}`,
    description: `Programme personnalisé de ${profile.daysPerWeek} jours/semaine, adapté à votre niveau ${difficultyNames[profile.fitnessLevel].toLowerCase()} avec objectif ${goalNames[profile.goal].toLowerCase()}.`,
    goal: profile.goal,
    difficulty: profile.fitnessLevel,
    daysPerWeek: profile.daysPerWeek,
    sessions,
    createdAt: new Date().toISOString(),
  };
}

export function getExerciseImageUrl(exercise: Exercise): string {
  if (exercise.wgerExerciseId) {
    return `https://wger.de/api/v2/exerciseimage/?exercise_base=${exercise.wgerExerciseId}&format=json`;
  }
  return '';
}

export function getYoutubeSearchUrl(exercise: Exercise): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.youtubeSearchQuery)}`;
}

export { EXERCISES };
