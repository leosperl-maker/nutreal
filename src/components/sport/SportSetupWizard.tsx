import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon3D from '../Icon3D';
import {
  ChevronRight, ChevronLeft, Dumbbell, Target, Activity,
  AlertTriangle, Clock, Calendar, Zap, Heart, Flame, Sparkles
} from 'lucide-react';
import type { SportProfile, SportGoal, Difficulty, Equipment, Limitation, WorkoutType } from '../../lib/workoutGenerator';

interface Props {
  onComplete: (profile: SportProfile) => void;
}

const STEPS = [
  { id: 'goal', title: 'Votre objectif', icon: Target },
  { id: 'level', title: 'Votre niveau', icon: Activity },
  { id: 'limitations', title: 'Limitations', icon: AlertTriangle },
  { id: 'equipment', title: 'Équipement', icon: Dumbbell },
  { id: 'schedule', title: 'Planning', icon: Calendar },
];

const GOALS: { value: SportGoal; label: string; emoji: string; desc: string }[] = [
  { value: 'weight_loss', label: 'Perte de poids', emoji: 'fire', desc: 'Brûler des calories et affiner la silhouette' },
  { value: 'muscle_gain', label: 'Prise de muscle', emoji: 'flexedBiceps', desc: 'Développer la masse musculaire' },
  { value: 'endurance', label: 'Endurance', emoji: 'personRunning', desc: 'Améliorer le cardio et l\'endurance' },
  { value: 'flexibility', label: 'Souplesse', emoji: 'personInLotus', desc: 'Yoga, étirements et mobilité' },
  { value: 'general_fitness', label: 'Forme générale', emoji: 'highVoltage', desc: 'Un peu de tout, rester en forme' },
];

const LEVELS: { value: Difficulty; label: string; emoji: string; desc: string }[] = [
  { value: 'beginner', label: 'Débutant', emoji: 'seedling', desc: 'Je commence ou reprends le sport' },
  { value: 'intermediate', label: 'Intermédiaire', emoji: 'seedling', desc: 'Je m\'entraîne régulièrement depuis quelques mois' },
  { value: 'advanced', label: 'Avancé', emoji: 'trophy', desc: 'Je m\'entraîne depuis plus d\'un an' },
];

const LIMITATIONS_OPTIONS: { value: Limitation; label: string; emoji: string }[] = [
  { value: 'none', label: 'Aucune limitation', emoji: 'shield' },
  { value: 'back_pain', label: 'Douleurs au dos', emoji: 'bone' },
  { value: 'knee_problems', label: 'Problèmes de genoux', emoji: 'leg' },
  { value: 'shoulder_injury', label: 'Blessure à l\'épaule', emoji: 'flexedBiceps' },
  { value: 'wrist_pain', label: 'Douleurs aux poignets', emoji: 'flexedBiceps' },
  { value: 'hip_problems', label: 'Problèmes de hanches', emoji: 'bone' },
];

const EQUIPMENT_OPTIONS: { value: Equipment; label: string; emoji: string }[] = [
  { value: 'none', label: 'Aucun (poids du corps)', emoji: 'personCartwheeling' },
  { value: 'dumbbells', label: 'Haltères', emoji: 'personLiftingWeights' },
  { value: 'resistance_bands', label: 'Élastiques', emoji: 'flexedBiceps' },
  { value: 'pull_up_bar', label: 'Barre de traction', emoji: 'personLiftingWeights' },
  { value: 'bench', label: 'Banc de musculation', emoji: 'personLiftingWeights' },
  { value: 'barbell', label: 'Barre olympique', emoji: 'personLiftingWeights' },
];

export default function SportSetupWizard({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<SportGoal>('weight_loss');
  const [level, setLevel] = useState<Difficulty>('beginner');
  const [limitations, setLimitations] = useState<Limitation[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>(['none']);
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [sessionDuration, setSessionDuration] = useState(30);

  const toggleLimitation = (l: Limitation) => {
    if (l === 'none') {
      setLimitations([]);
      return;
    }
    setLimitations(prev => {
      const filtered = prev.filter(x => x !== 'none');
      return filtered.includes(l) ? filtered.filter(x => x !== l) : [...filtered, l];
    });
  };

  const toggleEquipment = (e: Equipment) => {
    if (e === 'none') {
      setEquipment(['none']);
      return;
    }
    setEquipment(prev => {
      const filtered = prev.filter(x => x !== 'none');
      const result = filtered.includes(e) ? filtered.filter(x => x !== e) : [...filtered, e];
      return result.length === 0 ? ['none'] : result;
    });
  };

  const handleComplete = () => {
    const preferredTypes: WorkoutType[] = [];
    if (goal === 'weight_loss' || goal === 'endurance') preferredTypes.push('hiit', 'cardio', 'circuit');
    if (goal === 'muscle_gain' || goal === 'general_fitness') preferredTypes.push('strength');
    if (goal === 'flexibility') preferredTypes.push('yoga', 'stretching');

    const profile: SportProfile = {
      goal,
      fitnessLevel: level,
      limitations: limitations.length === 0 ? ['none'] : limitations,
      availableEquipment: equipment,
      daysPerWeek,
      sessionDuration,
      preferredTypes,
    };
    onComplete(profile);
  };

  const canProceed = () => {
    switch (step) {
      case 0: return !!goal;
      case 1: return !!level;
      case 2: return true;
      case 3: return equipment.length > 0;
      case 4: return daysPerWeek > 0 && sessionDuration > 0;
      default: return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-3">
            {GOALS.map(g => (
              <button
                key={g.value}
                onClick={() => setGoal(g.value)}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                  goal === g.value
                    ? 'border-primary-500 bg-primary-50 shadow-md'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon3D name={g.emoji} size={28} />
                  <div>
                    <p className="font-semibold text-gray-800">{g.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{g.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        );

      case 1:
        return (
          <div className="space-y-3">
            {LEVELS.map(l => (
              <button
                key={l.value}
                onClick={() => setLevel(l.value)}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                  level === l.value
                    ? 'border-primary-500 bg-primary-50 shadow-md'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon3D name={l.emoji} size={28} />
                  <div>
                    <p className="font-semibold text-gray-800">{l.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{l.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        );

      case 2:
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-400 mb-2">Sélectionnez toutes les limitations qui s'appliquent :</p>
            {LIMITATIONS_OPTIONS.map(l => (
              <button
                key={l.value}
                onClick={() => toggleLimitation(l.value)}
                className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all ${
                  (l.value === 'none' && limitations.length === 0) || limitations.includes(l.value)
                    ? 'border-primary-500 bg-primary-50 shadow-md'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon3D name={l.emoji} size={22} />
                  <p className="font-medium text-gray-800">{l.label}</p>
                </div>
              </button>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-400 mb-2">Quel équipement avez-vous à disposition ?</p>
            {EQUIPMENT_OPTIONS.map(e => (
              <button
                key={e.value}
                onClick={() => toggleEquipment(e.value)}
                className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all ${
                  equipment.includes(e.value)
                    ? 'border-primary-500 bg-primary-50 shadow-md'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon3D name={e.emoji} size={22} />
                  <p className="font-medium text-gray-800">{e.label}</p>
                </div>
              </button>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Calendar size={16} className="inline mr-2" />
                Jours d'entraînement par semaine
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6].map(d => (
                  <button
                    key={d}
                    onClick={() => setDaysPerWeek(d)}
                    className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all ${
                      daysPerWeek === d
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                {daysPerWeek <= 2 ? 'Parfait pour commencer !' : 
                 daysPerWeek <= 4 ? 'Bon équilibre entraînement/repos' : 
                 'Programme intensif — assurez-vous de bien récupérer'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Clock size={16} className="inline mr-2" />
                Durée par séance : <span className="text-primary-500">{sessionDuration} min</span>
              </label>
              <input
                type="range"
                min={15}
                max={90}
                step={5}
                value={sessionDuration}
                onChange={(e) => setSessionDuration(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>15 min</span>
                <span>45 min</span>
                <span>90 min</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white px-4 py-6">
      {/* Progress */}
      <div className="flex items-center gap-1 mb-6">
        {STEPS.map((s, i) => (
          <div
            key={s.id}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              i <= step ? 'bg-primary-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          {React.createElement(STEPS[step].icon, { size: 24, className: 'text-primary-500' })}
          <h1 className="text-2xl font-bold text-gray-800 font-display">{STEPS[step].title}</h1>
        </div>
        <p className="text-sm text-gray-400">Étape {step + 1} sur {STEPS.length}</p>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-8"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-gray-100">
        <div className="flex gap-3 max-w-lg mx-auto">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex items-center justify-center gap-1 px-6 py-3.5 rounded-xl bg-gray-100 text-gray-600 font-medium"
            >
              <ChevronLeft size={18} />
              Retour
            </button>
          )}
          <button
            onClick={() => {
              if (step < STEPS.length - 1) {
                setStep(s => s + 1);
              } else {
                handleComplete();
              }
            }}
            disabled={!canProceed()}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all ${
              canProceed()
                ? 'bg-primary-500 text-white shadow-md hover:bg-primary-600 active:scale-[0.98]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {step < STEPS.length - 1 ? (
              <>
                Suivant
                <ChevronRight size={18} />
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Générer mon programme
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
