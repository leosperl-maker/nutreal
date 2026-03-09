import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedCard from '../components/AnimatedCard';
import SuccessCheckmark from '../components/SuccessCheckmark';
import {
  Clock, Flame, Trash2, Trophy, Youtube,
  ArrowLeft, Check, Play, Pause, RotateCcw,
  ChevronDown, ChevronUp, ChevronRight, Zap, Heart, Dumbbell, Wind,
} from 'lucide-react';

interface Exercise {
  name: string;
  sets?: string;
  duration?: string;
  detail: string;
}

interface SportProgram {
  name: string;
  emoji: string;
  calPerMin: number;
  type: 'cardio' | 'strength' | 'flexibility';
  gradient: string;
  imageUrl: string;
  youtubeVideoId: string;
  exercises: Exercise[];
  description: string;
}

// Images Unsplash (free to use)
const SPORT_PROGRAMS: Record<string, SportProgram> = {
  running: {
    name: 'Course à pied', emoji: '🏃', calPerMin: 10, type: 'cardio',
    gradient: 'from-orange-500 to-red-600',
    imageUrl: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&q=80&auto=format',
    description: '30 min · Fractionné & endurance',
    youtubeVideoId: 'eL12C6lkFSs',
    exercises: [
      { name: 'Échauffement', duration: '5 min', detail: 'Marche rapide, montées de genoux, talons-fesses, rotation chevilles' },
      { name: 'Course légère', duration: '10 min', detail: '70% FC max, rythme conversationnel, respiration nasale' },
      { name: 'Fractionné 30/30', sets: '8 séries', detail: 'Sprint 30s → marche active 30s → répéter sans repos entre' },
      { name: 'Course modérée', duration: '5 min', detail: 'Reprise à rythme confortable, cœur qui redescend' },
      { name: 'Retour au calme', duration: '5 min', detail: 'Marche lente + étirements mollets, quadriceps, ischio-jambiers' },
    ],
  },
  hiit: {
    name: 'HIIT', emoji: '⚡', calPerMin: 14, type: 'cardio',
    gradient: 'from-yellow-400 to-orange-600',
    imageUrl: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&q=80&auto=format',
    description: '20 min · Haute intensité',
    youtubeVideoId: 'ml6cT4AZdqI',
    exercises: [
      { name: 'Burpees', sets: '3 × 30s', detail: 'Planche → pompe → squat → saut + applaudissement' },
      { name: 'Mountain Climbers', sets: '3 × 30s', detail: 'Position planche, alterner genoux vers poitrine rapidement' },
      { name: 'Squat Sauté', sets: '3 × 30s', detail: 'Squat profond → explosion max vers le haut' },
      { name: 'High Knees', sets: '3 × 30s', detail: 'Courir sur place, genoux à hauteur des hanches' },
      { name: 'Repos actif', duration: '15s entre chaque', detail: 'Marche sur place, respirer profondément' },
    ],
  },
  strength: {
    name: 'Musculation', emoji: '🏋️', calPerMin: 7, type: 'strength',
    gradient: 'from-violet-600 to-purple-800',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80&auto=format',
    description: '45 min · Full body',
    youtubeVideoId: 'UBMk30rjy0o',
    exercises: [
      { name: 'Squat', sets: '4 × 12 reps', detail: 'Pieds largeur épaules, descendre cuisses parallèles, pousser dans les talons' },
      { name: 'Développé couché', sets: '4 × 10 reps', detail: 'Contrôler la descente (3s), pousser fort' },
      { name: 'Rowing haltère', sets: '3 × 12 reps', detail: 'Buste penché 45°, tirer vers la hanche, coude collé' },
      { name: 'Presse militaire', sets: '3 × 10 reps', detail: 'Haltères aux épaules, pousser au-dessus de la tête' },
      { name: 'Gainage planche', sets: '3 × 45s', detail: 'Sur coudes et pointes de pieds, corps aligné' },
    ],
  },
  yoga: {
    name: 'Yoga', emoji: '🧘', calPerMin: 3, type: 'flexibility',
    gradient: 'from-emerald-500 to-teal-700',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format',
    description: '30 min · Flow & méditation',
    youtubeVideoId: 'v7AYKMP6rOE',
    exercises: [
      { name: 'Salutation au Soleil', sets: '5 cycles', detail: 'Enchaînement fluide, une respiration par mouvement' },
      { name: 'Guerrier I & II', sets: '2 séries', detail: 'Tenir 5 respirations chaque côté, ouvrir les hanches' },
      { name: 'Chien tête en bas', duration: '1 min', detail: 'Hanches vers le ciel, talons vers le sol, colonne allongée' },
      { name: 'Pigeon', duration: '1 min/côté', detail: 'Ouverture intense des hanches, respiration longue' },
      { name: 'Savasana', duration: '3 min', detail: 'Relâchement total, observation calme du souffle' },
    ],
  },
  pilates: {
    name: 'Pilates', emoji: '🌸', calPerMin: 4, type: 'flexibility',
    gradient: 'from-rose-400 to-pink-600',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80&auto=format',
    description: '30 min · Core & posture',
    youtubeVideoId: 'K56Z12XNQ5c',
    exercises: [
      { name: 'The Hundred', sets: '1 × 100 pompes', detail: 'Allongé, jambes à 45°, pomper les bras 100x' },
      { name: 'Roll Up', sets: '3 × 10 reps', detail: 'Dérouler vertèbre par vertèbre, contrôle total' },
      { name: 'Single Leg Circles', sets: '3 × 10/jambe', detail: 'Tracer des cercles avec une jambe, bassin stable' },
      { name: 'Swimming', sets: '3 × 30s', detail: 'Ventre au sol, alterner bras/jambe opposés' },
      { name: 'Spine Stretch', sets: '3 × 8 reps', detail: 'Assis jambes écartées, pencher en avant en soufflant' },
    ],
  },
  cycling: {
    name: 'Vélo', emoji: '🚴', calPerMin: 8, type: 'cardio',
    gradient: 'from-amber-500 to-yellow-600',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80&auto=format',
    description: '30 min · Endurance & intervalles',
    youtubeVideoId: 'Ho2OuG6yEpY',
    exercises: [
      { name: 'Échauffement', duration: '5 min', detail: 'Résistance faible, cadence 70-80 rpm' },
      { name: 'Endurance', duration: '15 min', detail: 'Résistance modérée, cadence 80-90 rpm' },
      { name: 'Intervalles', sets: '5 × 30s', detail: 'Résistance max 30s → récup 1 min' },
      { name: 'Sprint final', duration: '1 min', detail: 'Tout donner, cadence maximum' },
      { name: 'Récup active', duration: '4 min', detail: 'Résistance nulle, pédaler doucement' },
    ],
  },
  swimming: {
    name: 'Natation', emoji: '🏊', calPerMin: 9, type: 'cardio',
    gradient: 'from-cyan-500 to-blue-600',
    imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80&auto=format',
    description: '30 min · Technique & cardio',
    youtubeVideoId: 'gh5_v5VY2oo',
    exercises: [
      { name: 'Crawl', sets: '4 × 50m', detail: 'Bras alternés, rotation du corps, souffle rythmé' },
      { name: 'Dos crawlé', sets: '2 × 50m', detail: 'Regard plafond, bras alternés, battements réguliers' },
      { name: 'Brassé', sets: '4 × 25m', detail: 'Synchronisation bras-jambes, phase de glisse max' },
      { name: 'Récupération', duration: '2 min', detail: 'Flotter sur le dos, respiration calme' },
    ],
  },
  abs: {
    name: 'Abdominaux', emoji: '🔥', calPerMin: 6, type: 'strength',
    gradient: 'from-red-500 to-orange-600',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80&auto=format',
    description: '15 min · Core intense',
    youtubeVideoId: '1919eTCoESo',
    exercises: [
      { name: 'Crunch classique', sets: '4 × 20 reps', detail: 'Dos au sol, lever les épaules, souffler en montant' },
      { name: 'Planche', sets: '4 × 45s', detail: 'Corps aligné tête-talon, abdos contractés' },
      { name: 'Bicycle crunch', sets: '3 × 20 reps', detail: 'Coude droit → genou gauche, alterner' },
      { name: 'Relevé de jambes', sets: '3 × 15 reps', detail: 'Lever jambes à 90°, redescendre sans toucher le sol' },
      { name: 'Mountain climbers', sets: '3 × 30s', detail: 'Planche bras tendus, genoux vers poitrine rapidement' },
    ],
  },
  pushups: {
    name: 'Pompes', emoji: '💪', calPerMin: 8, type: 'strength',
    gradient: 'from-indigo-500 to-blue-700',
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&q=80&auto=format',
    description: '20 min · Pectoraux & triceps',
    youtubeVideoId: 'IODxDxX7oi4',
    exercises: [
      { name: 'Pompes classiques', sets: '4 × 15 reps', detail: 'Corps aligné, descendre à 1 cm du sol, coudes 45°' },
      { name: 'Pompes larges', sets: '3 × 12 reps', detail: 'Mains écartées, cible les pectoraux extérieurs' },
      { name: 'Pompes serrées', sets: '3 × 10 reps', detail: 'Mains proches, cible les triceps' },
      { name: 'Pompes déclinées', sets: '3 × 10 reps', detail: 'Pieds surélevés, cible pectoraux hauts' },
      { name: 'Gainage statique', sets: '3 × 45s', detail: 'Position pompe maintenue, corps rigide' },
    ],
  },
  squats: {
    name: 'Squats', emoji: '🦵', calPerMin: 7, type: 'strength',
    gradient: 'from-orange-600 to-amber-800',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80&auto=format',
    description: '20 min · Jambes & fessiers',
    youtubeVideoId: 'UItWltVZZmE',
    exercises: [
      { name: 'Squat air', sets: '4 × 20 reps', detail: 'Descendre lentement (3s), genoux alignés pieds' },
      { name: 'Squat sauté', sets: '3 × 12 reps', detail: 'Explosion max vers le haut, atterrir souple' },
      { name: 'Fente avant', sets: '3 × 10/jambe', detail: 'Genou arrière vers le sol, dos droit' },
      { name: 'Squat sumo', sets: '3 × 15 reps', detail: 'Pieds écartés, pointes vers extérieur' },
      { name: 'Wall sit', sets: '3 × 45s', detail: 'Dos contre mur, cuisses horizontales' },
    ],
  },
  walking: {
    name: 'Marche rapide', emoji: '🚶', calPerMin: 5, type: 'cardio',
    gradient: 'from-green-500 to-teal-600',
    imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format',
    description: '30 min · Brûle-graisse doux',
    youtubeVideoId: 'inpok4MKVLM',
    exercises: [
      { name: 'Démarrage', duration: '3 min', detail: 'Marche normale, rotation des bras' },
      { name: 'Marche tonique', duration: '20 min', detail: 'Bras en balancier, cadence ~120 pas/min' },
      { name: 'Dénivelé', sets: '3 montées', detail: 'Accélérer dans la montée, descendre en marchant' },
      { name: 'Retour calme', duration: '5 min', detail: 'Rythme qui diminue + étirements' },
    ],
  },
  jumprope: {
    name: 'Corde à sauter', emoji: '⏭️', calPerMin: 12, type: 'cardio',
    gradient: 'from-pink-500 to-rose-600',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&auto=format',
    description: '15 min · Cardio explosif',
    youtubeVideoId: 'sHdHMvaT7VI',
    exercises: [
      { name: 'Saut basique', sets: '3 × 1 min', detail: 'Deux pieds, rebonds courts et légers' },
      { name: 'Saut alterné', sets: '3 × 1 min', detail: 'Alterner pied gauche / droit' },
      { name: 'Double saut', sets: '2 × 30s', detail: 'Corde passe deux fois par saut' },
      { name: 'Repos actif', duration: '30s entre séries', detail: 'Marche sur place' },
    ],
  },
  stretching: {
    name: 'Stretching', emoji: '🤸', calPerMin: 2, type: 'flexibility',
    gradient: 'from-fuchsia-400 to-purple-500',
    imageUrl: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&q=80&auto=format',
    description: '20 min · Récupération & mobilité',
    youtubeVideoId: 'g_tea8ZNk5A',
    exercises: [
      { name: 'Étirement cou', sets: '3 × 15s/côté', detail: 'Incliner doucement la tête vers chaque épaule' },
      { name: 'Ouverture pectoraux', duration: '30s/côté', detail: 'Bras en croix contre un mur, pivoter le buste' },
      { name: 'Hip flexor stretch', duration: '45s/côté', detail: 'Fente basse, hanches poussées vers avant' },
      { name: 'Ischio-jambiers', duration: '45s/jambe', detail: 'Assis, jambe tendue, se pencher vers le pied' },
      { name: 'Posture enfant', duration: '1 min', detail: 'Fesses sur talons, bras devant, front au sol' },
    ],
  },
  dance: {
    name: 'Danse', emoji: '💃', calPerMin: 7, type: 'cardio',
    gradient: 'from-pink-500 to-violet-600',
    imageUrl: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=800&q=80&auto=format',
    description: '30 min · Cardio fun',
    youtubeVideoId: 'ZWk19OVon2k',
    exercises: [
      { name: 'Échauffement', duration: '5 min', detail: 'Ondulations du corps, balancements' },
      { name: 'Chorégraphie de base', duration: '10 min', detail: 'Pas en rythme, rebonds, bras expressifs' },
      { name: 'Salsa / Merengue', duration: '10 min', detail: 'Déhanchements, pas latéraux, tours' },
      { name: 'Freestyle', duration: '5 min', detail: 'Bougez librement, exprimez-vous' },
      { name: 'Retour calme', duration: '5 min', detail: 'Mouvements lents, étirements doux' },
    ],
  },
};

type SportKey = keyof typeof SPORT_PROGRAMS;

const CATEGORIES = [
  { key: 'all', label: 'Tout', icon: Zap },
  { key: 'cardio', label: 'Cardio', icon: Heart },
  { key: 'strength', label: 'Force', icon: Dumbbell },
  { key: 'flexibility', label: 'Souplesse', icon: Wind },
];

function useTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  return {
    seconds, running,
    start: () => setRunning(true),
    pause: () => setRunning(false),
    reset: () => { setRunning(false); setSeconds(0); },
    fmt: (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`,
  };
}

// ─── Workout Detail Page ─────────────────────────────────────────────────────
function WorkoutDetail({ sportKey, sport, onBack }: { sportKey: SportKey; sport: SportProgram; onBack: () => void }) {
  const { addSportSession, showToast } = useStore();
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);
  const [manualDuration, setManualDuration] = useState(30);
  const [saved, setSaved] = useState(false);
  const [checkedExercises, setCheckedExercises] = useState<Set<number>>(new Set());
  const timer = useTimer();

  const today = new Date().toISOString().split('T')[0];
  const timerMinutes = Math.max(1, Math.round(timer.seconds / 60));
  const effectiveDuration = timer.seconds > 60 ? timerMinutes : manualDuration;
  const estimatedCal = Math.round(sport.calPerMin * effectiveDuration);

  const toggleExercise = (i: number) => {
    setCheckedExercises(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const validateSession = () => {
    addSportSession({
      id: Date.now().toString(), date: today, type: sport.type,
      name: sport.name, duration_min: effectiveDuration,
      caloriesBurned: estimatedCal, createdAt: new Date().toISOString(),
    });
    setSaved(true);
    showToast(`${sport.emoji} ${estimatedCal} kcal brûlées !`);
    timer.reset();
    setTimeout(() => { setSaved(false); onBack(); }, 2500);
  };

  const openYoutube = () => {
    window.open(`https://www.youtube.com/watch?v=${sport.youtubeVideoId}`, '_blank', 'noopener,noreferrer');
  };

  if (saved) {
    return (
      <AnimatedPage className="flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <SuccessCheckmark size={80} />
          <p className="text-xl font-bold text-text-primary mt-4">Séance terminée !</p>
          <p className="text-sm text-text-secondary mt-1">{estimatedCal} kcal brûlées 🔥</p>
        </motion.div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="pb-8 max-w-lg mx-auto">
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
        {/* Hero Image */}
        <div className="relative h-64 overflow-hidden">
          <img src={sport.imageUrl} alt={sport.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <button onClick={onBack} className="absolute top-12 left-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${sport.type === 'cardio' ? 'bg-red-500/80 text-white' : sport.type === 'strength' ? 'bg-purple-500/80 text-white' : 'bg-emerald-500/80 text-white'}`}>
                {sport.type === 'cardio' ? '❤️ Cardio' : sport.type === 'strength' ? '💪 Force' : '🤸 Souplesse'}
              </span>
              <span className="text-white/70 text-xs">{sport.calPerMin} kcal/min</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">{sport.name}</h1>
            <p className="text-white/60 text-sm mt-1">{sport.exercises.length} exercices · {sport.description}</p>
          </div>
        </div>

        <div className="px-4 pt-5 space-y-4">
          {/* YouTube CTA */}
          <motion.button whileTap={{ scale: 0.97 }} onClick={openYoutube}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Youtube size={22} className="text-white" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-bold text-white">Suivre un cours vidéo</p>
              <p className="text-xs text-white/70">Entraînements YouTube sélectionnés</p>
            </div>
            <ChevronRight size={18} className="text-white/60" />
          </motion.button>

          {/* Exercises */}
          <div>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Programme</h3>
            <div className="space-y-2">
              {sport.exercises.map((ex, i) => {
                const done = checkedExercises.has(i);
                return (
                  <div key={i} className={`bg-white border rounded-2xl overflow-hidden shadow-sm transition-all ${done ? 'border-green-300 bg-green-50/30' : 'border-surface-200'}`}>
                    <div className="flex items-center gap-3 p-3">
                      <motion.button whileTap={{ scale: 0.85 }} onClick={() => toggleExercise(i)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${done ? 'bg-green-500' : `bg-gradient-to-br ${sport.gradient}`}`}>
                        {done ? <Check size={16} className="text-white" /> : <span className="text-white text-xs font-bold">{i + 1}</span>}
                      </motion.button>
                      <button onClick={() => setExpandedExercise(expandedExercise === i ? null : i)} className="flex-1 text-left min-w-0">
                        <p className={`text-sm font-semibold truncate ${done ? 'text-green-700 line-through' : 'text-text-primary'}`}>{ex.name}</p>
                        <p className="text-xs text-text-muted">{ex.sets || ex.duration}</p>
                      </button>
                      <button onClick={() => setExpandedExercise(expandedExercise === i ? null : i)}>
                        {expandedExercise === i ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
                      </button>
                    </div>
                    <AnimatePresence>
                      {expandedExercise === i && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <p className="text-sm text-text-secondary px-4 pb-3 pl-14 leading-relaxed">{ex.detail}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-text-muted text-center mt-2">
              {checkedExercises.size}/{sport.exercises.length} exercices complétés
            </p>
          </div>

          {/* Timer */}
          <div className="bg-white border border-surface-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock size={14} /> Chronomètre
            </h3>
            <div className="text-center">
              <div className="text-6xl font-mono font-black text-text-primary mb-5 tabular-nums tracking-tight">
                {timer.fmt(timer.seconds)}
              </div>
              <div className="flex gap-3 justify-center mb-4">
                {!timer.running ? (
                  <motion.button whileTap={{ scale: 0.95 }} onClick={timer.start}
                    className={`flex items-center gap-2 px-8 py-3 bg-gradient-to-r ${sport.gradient} text-white rounded-xl text-sm font-bold shadow-lg`}>
                    <Play size={18} fill="white" /> Go
                  </motion.button>
                ) : (
                  <motion.button whileTap={{ scale: 0.95 }} onClick={timer.pause}
                    className="flex items-center gap-2 px-8 py-3 bg-amber-500 text-white rounded-xl text-sm font-bold shadow-lg">
                    <Pause size={18} fill="white" /> Pause
                  </motion.button>
                )}
                <motion.button whileTap={{ scale: 0.95 }} onClick={timer.reset}
                  className="p-3 bg-surface-100 border border-surface-200 rounded-xl">
                  <RotateCcw size={18} className="text-text-secondary" />
                </motion.button>
              </div>

              {timer.seconds < 60 && (
                <div className="bg-surface-50 rounded-xl p-3">
                  <p className="text-[10px] text-text-muted mb-2 uppercase tracking-wider">Durée manuelle</p>
                  <input type="range" min={5} max={120} step={5} value={manualDuration}
                    onChange={e => setManualDuration(+e.target.value)}
                    className="w-full accent-primary-500 mb-1" />
                  <p className="text-sm font-bold text-text-primary">{manualDuration} min</p>
                </div>
              )}
            </div>
          </div>

          {/* Calories burned */}
          <div className={`bg-gradient-to-r ${sport.gradient} rounded-2xl p-5 flex items-center gap-4 shadow-lg`}>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Flame size={28} className="text-white" />
            </div>
            <div>
              <p className="text-white/70 text-xs uppercase tracking-wider">Calories estimées</p>
              <p className="text-white text-4xl font-black">{estimatedCal}</p>
              <p className="text-white/60 text-xs">{effectiveDuration} min · {sport.calPerMin} kcal/min</p>
            </div>
          </div>

          {/* Validate */}
          <motion.button whileTap={{ scale: 0.97 }} onClick={validateSession}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-base rounded-2xl flex items-center justify-center gap-3 shadow-xl">
            <Trophy size={22} /> Terminer la séance
          </motion.button>
        </div>
      </motion.div>
    </AnimatedPage>
  );
}

// ─── Main Sport Page ─────────────────────────────────────────────────────────
export default function SportPage() {
  const { sportSessions, removeSportSession } = useStore();
  const [selectedKey, setSelectedKey] = useState<SportKey | null>(null);
  const [category, setCategory] = useState('all');

  const today = new Date().toISOString().split('T')[0];
  const todaySessions = sportSessions.filter(s => s.date === today);
  const totalBurned = todaySessions.reduce((sum, s) => sum + s.caloriesBurned, 0);
  const totalMinutes = todaySessions.reduce((sum, s) => sum + s.duration_min, 0);

  const filteredPrograms = Object.entries(SPORT_PROGRAMS).filter(
    ([, prog]) => category === 'all' || prog.type === category
  );

  if (selectedKey && SPORT_PROGRAMS[selectedKey]) {
    return (
      <WorkoutDetail
        sportKey={selectedKey}
        sport={SPORT_PROGRAMS[selectedKey]}
        onBack={() => setSelectedKey(null)}
      />
    );
  }

  // Featured workout (hero card)
  const featured = filteredPrograms[0];

  return (
    <AnimatedPage className="pb-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="px-4 pt-12 mb-4">
        <h1 className="text-3xl font-black text-text-primary tracking-tight">Sport</h1>
        <p className="text-sm text-text-muted mt-0.5">Trouvez votre workout du jour</p>
      </div>

      {/* Today's Stats */}
      {todaySessions.length > 0 && (
        <div className="px-4 mb-5">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 shadow-lg">
            <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-2">Aujourd'hui</p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white text-4xl font-black">{totalBurned}</p>
                <p className="text-white/70 text-xs">kcal brûlées</p>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <p className="text-white text-lg font-bold">{todaySessions.length}</p>
                  <p className="text-white/60 text-[10px]">séance{todaySessions.length > 1 ? 's' : ''}</p>
                </div>
                <div className="text-right">
                  <p className="text-white text-lg font-bold">{totalMinutes}</p>
                  <p className="text-white/60 text-[10px]">minutes</p>
                </div>
              </div>
            </div>
            {/* Recent sessions */}
            <div className="mt-3 pt-3 border-t border-white/20 space-y-2">
              {todaySessions.map(s => {
                const prog = Object.values(SPORT_PROGRAMS).find(p => p.name === s.name);
                return (
                  <div key={s.id} className="flex items-center gap-2">
                    <span className="text-base">{prog?.emoji || '🏋️'}</span>
                    <span className="text-white/90 text-xs flex-1">{s.name} · {s.duration_min} min</span>
                    <span className="text-white/70 text-xs">{s.caloriesBurned} kcal</span>
                    <motion.button whileTap={{ scale: 0.8 }} onClick={() => removeSportSession(s.id)}
                      className="w-6 h-6 bg-white/15 rounded-full flex items-center justify-center">
                      <Trash2 size={10} className="text-white/70" />
                    </motion.button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="px-4 mb-5">
        <div className="flex gap-2">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const active = category === cat.key;
            return (
              <motion.button key={cat.key} whileTap={{ scale: 0.95 }}
                onClick={() => setCategory(cat.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${active ? 'bg-text-primary text-white shadow-md' : 'bg-white border border-surface-200 text-text-secondary'}`}>
                <Icon size={14} />
                {cat.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Featured Hero Card */}
      {featured && (
        <div className="px-4 mb-5">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedKey(featured[0] as SportKey)}
            className="w-full relative h-52 rounded-3xl overflow-hidden shadow-xl">
            <img src={featured[1].imageUrl} alt={featured[1].name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Workout du jour</span>
              <h2 className="text-2xl font-black text-white mt-1">{featured[1].name}</h2>
              <p className="text-white/60 text-xs mt-1">{featured[1].description} · {featured[1].calPerMin} kcal/min</p>
            </div>
            <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
              <Play size={24} className="text-white ml-0.5" fill="white" />
            </div>
          </motion.button>
        </div>
      )}

      {/* Workout Grid */}
      <div className="px-4">
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
          {category === 'all' ? 'Tous les workouts' : CATEGORIES.find(c => c.key === category)?.label}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {filteredPrograms.slice(1).map(([key, prog], i) => (
            <motion.button
              key={key}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedKey(key as SportKey)}
              className="relative h-40 rounded-2xl overflow-hidden shadow-md">
              <img src={prog.imageUrl} alt={prog.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-bold text-sm">{prog.name}</p>
                <p className="text-white/50 text-[10px] mt-0.5">{prog.description}</p>
              </div>
              <div className="absolute top-2 right-2">
                <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-full ${prog.type === 'cardio' ? 'bg-red-500/80 text-white' : prog.type === 'strength' ? 'bg-purple-500/80 text-white' : 'bg-emerald-500/80 text-white'}`}>
                  {prog.calPerMin} kcal/min
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* History */}
      {sportSessions.filter(s => s.date !== today).length > 0 && (
        <div className="px-4 mt-6">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Historique</h3>
          <div className="space-y-2">
            {sportSessions.filter(s => s.date !== today).slice(0, 5).map(s => {
              const prog = Object.values(SPORT_PROGRAMS).find(p => p.name === s.name);
              return (
                <AnimatedCard key={s.id} className="p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center text-lg">{prog?.emoji || '🏋️'}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">{s.name}</p>
                    <p className="text-xs text-text-muted">
                      {new Date(s.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })} · {s.duration_min} min · {s.caloriesBurned} kcal
                    </p>
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}
