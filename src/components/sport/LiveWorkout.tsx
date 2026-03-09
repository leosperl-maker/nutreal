import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Play, Pause, SkipForward, ChevronRight, 
  Clock, Flame, CheckCircle2, ExternalLink, Volume2
} from 'lucide-react';
import type { WorkoutSession, Exercise } from '../../lib/workoutGenerator';
import { getYoutubeSearchUrl } from '../../lib/workoutGenerator';

interface Props {
  session: WorkoutSession;
  onComplete: (result: {
    duration: number;
    caloriesBurned: number;
    exercisesCompleted: number;
    totalExercises: number;
  }) => void;
  onCancel: () => void;
}

type Phase = 'warmup' | 'exercise' | 'rest' | 'cooldown' | 'complete';

export default function LiveWorkout({ session, onComplete, onCancel }: Props) {
  const allExercises = [
    ...session.warmup.map(e => ({ ...e, phase: 'warmup' as Phase })),
    ...session.exercises.map(e => ({ ...e, phase: 'exercise' as Phase })),
    ...session.cooldown.map(e => ({ ...e, phase: 'cooldown' as Phase })),
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [phase, setPhase] = useState<Phase>('warmup');
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [completedExercises, setCompletedExercises] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const startTimeRef = useRef(Date.now());

  const currentExercise = allExercises[currentIndex];
  const totalExerciseCount = allExercises.length;
  const progress = ((currentIndex + 1) / totalExerciseCount) * 100;

  // Timer principal
  useEffect(() => {
    if (isPaused || phase === 'complete') return;
    const interval = setInterval(() => {
      setTotalTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      if (!isResting) {
        setTimer(t => t + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, phase, isResting]);

  // Timer de repos
  useEffect(() => {
    if (!isResting || isPaused) return;
    if (restTimer <= 0) {
      setIsResting(false);
      return;
    }
    const interval = setInterval(() => {
      setRestTimer(t => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isResting, restTimer, isPaused]);

  // Vibration au changement d'exercice
  useEffect(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(200);
    }
  }, [currentIndex]);

  // Son de fin de repos
  useEffect(() => {
    if (isResting && restTimer === 3) {
      // Beep sonore 3 secondes avant la fin
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        osc.frequency.value = 880;
        osc.connect(ctx.destination);
        osc.start();
        setTimeout(() => osc.stop(), 200);
      } catch {}
    }
  }, [restTimer, isResting]);

  const nextExercise = useCallback(() => {
    if (!currentExercise) return;

    const maxSets = currentExercise.sets || 1;
    
    if (currentSet < maxSets) {
      // Prochaine série
      setCurrentSet(s => s + 1);
      setIsResting(true);
      setRestTimer(currentExercise.restSeconds);
      setTimer(0);
      return;
    }

    // Exercice terminé
    setCompletedExercises(c => c + 1);
    
    if (currentIndex < allExercises.length - 1) {
      // Repos entre exercices
      setIsResting(true);
      setRestTimer(currentExercise.restSeconds);
      
      setTimeout(() => {
        setCurrentIndex(i => i + 1);
        setCurrentSet(1);
        setTimer(0);
        const nextEx = allExercises[currentIndex + 1];
        if (nextEx) setPhase(nextEx.phase);
      }, currentExercise.restSeconds * 1000);
    } else {
      // Entraînement terminé !
      setPhase('complete');
      const duration = Math.round((Date.now() - startTimeRef.current) / 60000);
      const calories = Math.round(
        session.exercises.reduce((sum, ex) => sum + ex.calories_per_set * (ex.sets || 1), 0) +
        session.warmup.reduce((sum, ex) => sum + ex.calories_per_set, 0) +
        session.cooldown.reduce((sum, ex) => sum + ex.calories_per_set, 0)
      );
      onComplete({
        duration: Math.max(duration, 1),
        caloriesBurned: calories,
        exercisesCompleted: completedExercises + 1,
        totalExercises: session.exercises.length,
      });
    }
  }, [currentIndex, currentSet, currentExercise, allExercises, session, completedExercises, onComplete]);

  const skipExercise = () => {
    if (currentIndex < allExercises.length - 1) {
      setCurrentIndex(i => i + 1);
      setCurrentSet(1);
      setTimer(0);
      setIsResting(false);
      const nextEx = allExercises[currentIndex + 1];
      if (nextEx) setPhase(nextEx.phase);
    } else {
      nextExercise();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const phaseColors: Record<Phase, string> = {
    warmup: 'from-orange-500 to-amber-500',
    exercise: 'from-primary-500 to-purple-600',
    rest: 'from-blue-500 to-cyan-500',
    cooldown: 'from-green-500 to-emerald-500',
    complete: 'from-yellow-500 to-orange-500',
  };

  const phaseLabels: Record<Phase, string> = {
    warmup: 'Échauffement',
    exercise: 'Exercice',
    rest: 'Repos',
    cooldown: 'Retour au calme',
    complete: 'Terminé !',
  };

  if (phase === 'complete') return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-gray-900 flex flex-col"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/30">
        <button
          onClick={() => setShowExitConfirm(true)}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
        >
          <X size={20} />
        </button>
        <div className="text-center">
          <p className="text-white/60 text-xs">{formatTime(totalTime)}</p>
          <p className="text-white text-sm font-medium">{session.name}</p>
        </div>
        <button
          onClick={skipExercise}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
        >
          <SkipForward size={20} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-white/10">
        <motion.div
          className={`h-full bg-gradient-to-r ${phaseColors[isResting ? 'rest' : phase]}`}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {isResting ? (
            <motion.div
              key="rest"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              <p className="text-blue-400 text-sm font-medium mb-4">Repos</p>
              <div className="w-40 h-40 rounded-full border-4 border-blue-400 flex items-center justify-center mb-6">
                <span className="text-5xl font-bold text-white">{restTimer}</span>
              </div>
              <p className="text-white/60 text-sm">
                Prochain : {allExercises[currentIndex + 1]?.name || 'Fin'}
              </p>
              <button
                onClick={() => { setIsResting(false); setRestTimer(0); }}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full text-sm font-medium"
              >
                Passer le repos
              </button>
            </motion.div>
          ) : currentExercise ? (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="text-center w-full"
            >
              {/* Phase Label */}
              <p className={`text-sm font-medium mb-2 ${
                phase === 'warmup' ? 'text-orange-400' :
                phase === 'cooldown' ? 'text-green-400' : 'text-primary-400'
              }`}>
                {phaseLabels[phase]}
              </p>

              {/* Exercise Name */}
              <h2 className="text-2xl font-bold text-white mb-2 font-display">
                {currentExercise.name}
              </h2>

              {/* Sets/Reps or Duration */}
              <div className="mb-6">
                {currentExercise.sets ? (
                  <p className="text-white/70 text-lg">
                    Série <span className="text-white font-bold">{currentSet}</span> / {currentExercise.sets}
                    {' · '}<span className="text-primary-400">{currentExercise.reps} reps</span>
                  </p>
                ) : (
                  <p className="text-white/70 text-lg">
                    <span className="text-white font-bold">{currentExercise.duration}s</span>
                  </p>
                )}
              </div>

              {/* Timer Circle */}
              <div className="w-32 h-32 rounded-full border-4 border-white/20 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white font-mono">{formatTime(timer)}</span>
              </div>

              {/* Instructions */}
              <div className="bg-white/5 rounded-2xl p-4 mb-4 text-left max-h-32 overflow-y-auto">
                {currentExercise.instructions.map((inst, i) => (
                  <p key={i} className="text-white/60 text-sm mb-1">
                    <span className="text-primary-400 font-bold">{i + 1}.</span> {inst}
                  </p>
                ))}
              </div>

              {/* YouTube Link */}
              <a
                href={getYoutubeSearchUrl(currentExercise)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-red-400 font-medium"
              >
                <ExternalLink size={12} />
                Voir la démo sur YouTube
              </a>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      {!isResting && (
        <div className="px-6 pb-8 pt-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white"
            >
              {isPaused ? <Play size={24} /> : <Pause size={24} />}
            </button>
            <button
              onClick={nextExercise}
              className={`flex-1 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] bg-gradient-to-r ${phaseColors[phase]} text-white shadow-lg`}
            >
              <CheckCircle2 size={22} />
              {currentExercise?.sets && currentSet < currentExercise.sets ? 'Série terminée' : 'Exercice terminé'}
            </button>
          </div>

          {/* Exercise Counter */}
          <p className="text-center text-white/40 text-xs mt-3">
            Exercice {currentIndex + 1} / {totalExerciseCount}
          </p>
        </div>
      )}

      {/* Exit Confirmation */}
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-gray-800 rounded-2xl p-6 w-full max-w-sm"
            >
              <h3 className="text-white font-bold text-lg mb-2">Quitter l'entraînement ?</h3>
              <p className="text-white/60 text-sm mb-4">
                Votre progression ne sera pas sauvegardée.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-3 rounded-xl bg-white/10 text-white font-medium"
                >
                  Continuer
                </button>
                <button
                  onClick={onCancel}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium"
                >
                  Quitter
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
