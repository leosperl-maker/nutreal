import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon3D from '../Icon3D';
import {
  Play, Clock, Flame, ChevronDown, ChevronUp,
  ExternalLink, RefreshCw, Dumbbell, Target, Zap
} from 'lucide-react';
import type { WorkoutPlan, WorkoutSession, Exercise } from '../../lib/workoutGenerator';
import { getYoutubeSearchUrl } from '../../lib/workoutGenerator';

interface Props {
  plan: WorkoutPlan;
  onStartWorkout: (session: WorkoutSession) => void;
  onRegeneratePlan: () => void;
}

function ExerciseCard({ exercise, index }: { exercise: Exercise; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl border border-surface-200 overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 flex items-center gap-3 text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-500 font-bold text-sm flex-shrink-0">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-text-primary text-sm truncate">{exercise.name}</p>
          <p className="text-xs text-text-muted">
            {exercise.sets ? `${exercise.sets} × ${exercise.reps}` : `${exercise.duration}s`}
            {' · '}{exercise.restSeconds}s repos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-surface-300">
            ~{exercise.calories_per_set * (exercise.sets || 1)} kcal
          </span>
          {expanded ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
        </div>
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="px-3 pb-3 border-t border-surface-100"
        >
          <div className="pt-3 space-y-2">
            <div>
              <p className="text-xs font-semibold text-text-muted mb-1">Instructions :</p>
              <ol className="space-y-1">
                {exercise.instructions.map((inst, i) => (
                  <li key={i} className="text-xs text-text-secondary flex gap-2">
                    <span className="text-primary-400 font-bold">{i + 1}.</span>
                    {inst}
                  </li>
                ))}
              </ol>
            </div>
            
            {exercise.tips.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-text-muted mb-1">Conseils :</p>
                {exercise.tips.map((tip, i) => (
                  <p key={i} className="text-xs text-text-muted italic">• {tip}</p>
                ))}
              </div>
            )}

            <a
              href={getYoutubeSearchUrl(exercise)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-red-500 font-medium mt-2 hover:text-red-600"
            >
              <ExternalLink size={12} />
              Voir sur YouTube
            </a>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function SessionCard({ session, onStart }: { session: WorkoutSession; onStart: () => void }) {
  const [expanded, setExpanded] = useState(false);

  const muscleEmojis: Record<string, string> = {
    chest: 'flexedBiceps', back: 'flexedBiceps', shoulders: 'flexedBiceps', biceps: 'flexedBiceps', triceps: 'flexedBiceps',
    legs: 'leg', glutes: 'leg', core: 'bullseye', full_body: 'personLiftingWeights', cardio: 'fire',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-card overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-bold font-display text-text-primary">{session.name}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-text-muted">
                <Clock size={12} /> {session.estimatedDuration} min
              </span>
              <span className="flex items-center gap-1 text-xs text-text-muted">
                <Flame size={12} /> ~{session.estimatedCalories} kcal
              </span>
            </div>
          </div>
          <button
            onClick={onStart}
            className="w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-card hover:bg-primary-600 active:scale-95 transition-all"
          >
            <Play size={20} className="ml-0.5" />
          </button>
        </div>

        <div className="flex gap-1 mb-3">
          {session.focusAreas.map(area => (
            <span key={area} className="text-xs bg-surface-200 px-2 py-0.5 rounded-full text-text-muted inline-flex items-center gap-1">
              <Icon3D name={muscleEmojis[area] || 'flexedBiceps'} size={12} /> {area === 'full_body' ? 'Full body' : area === 'cardio' ? 'Cardio' : area}
            </span>
          ))}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-primary-500 font-medium"
        >
          {expanded ? 'Masquer' : 'Voir'} les exercices ({session.exercises.length})
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {expanded && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          className="px-4 pb-4 space-y-4"
        >
          {/* Échauffement */}
          {session.warmup.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-orange-500 mb-2 flex items-center gap-1">
                <Zap size={12} /> Échauffement
              </p>
              <div className="space-y-1.5">
                {session.warmup.map((ex, i) => (
                  <div key={ex.id} className="flex items-center gap-2 text-xs text-text-muted bg-orange-50 rounded-lg px-3 py-2">
                    <span className="font-medium text-orange-600">{i + 1}.</span>
                    <span>{ex.name}</span>
                    <span className="ml-auto text-orange-400">{ex.duration}s</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exercices principaux */}
          <div>
            <p className="text-xs font-semibold text-primary-500 mb-2 flex items-center gap-1">
              <Dumbbell size={12} /> Exercices principaux
            </p>
            <div className="space-y-2">
              {session.exercises.map((ex, i) => (
                <ExerciseCard key={ex.id} exercise={ex} index={i} />
              ))}
            </div>
          </div>

          {/* Retour au calme */}
          {session.cooldown.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-green-500 mb-2 flex items-center gap-1">
                <Target size={12} /> Retour au calme
              </p>
              <div className="space-y-1.5">
                {session.cooldown.map((ex, i) => (
                  <div key={ex.id} className="flex items-center gap-2 text-xs text-text-muted bg-green-50 rounded-lg px-3 py-2">
                    <span className="font-medium text-green-600">{i + 1}.</span>
                    <span>{ex.name}</span>
                    <span className="ml-auto text-green-400">{ex.duration}s</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function WorkoutPlanView({ plan, onStartWorkout, onRegeneratePlan }: Props) {
  return (
    <div className="space-y-4">
      {/* Plan Header */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-5 text-white">
        <h2 className="font-bold text-lg font-display">{plan.name}</h2>
        <p className="text-white/70 text-sm mt-1">{plan.description}</p>
        <div className="flex items-center gap-4 mt-3">
          <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
            {plan.daysPerWeek} jours/sem
          </span>
          <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
            {plan.sessions.reduce((sum, s) => sum + s.exercises.length, 0)} exercices
          </span>
        </div>
        <button
          onClick={onRegeneratePlan}
          className="mt-3 flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors"
        >
          <RefreshCw size={12} />
          Régénérer le programme
        </button>
      </div>

      {/* Sessions */}
      <div className="space-y-3">
        {plan.sessions.map(session => (
          <SessionCard
            key={session.id}
            session={session}
            onStart={() => onStartWorkout(session)}
          />
        ))}
      </div>
    </div>
  );
}
