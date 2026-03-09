import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { analyzeHealthProfile, generateDailyMissions } from '../lib/gemini';
import { DEFAULT_AVATAR_CONFIG } from '../components/avatar/avatarItems';
import { useConfetti } from '../components/ConfettiExplosion';
import Icon3D from '../components/Icon3D';

const STEPS = [
  { icon: 'microscope', label: 'Analyse de votre profil santé...', sublabel: 'Évaluation des conditions et restrictions' },
  { icon: 'personLiftingWeights', label: 'Programme personnalisé...', sublabel: 'Adaptation sport et réhabilitation' },
  { icon: 'bullseye', label: 'Missions du jour...', sublabel: 'Objectifs sur-mesure pour vous' },
];

export default function AIAnalysisLoading() {
  const navigate = useNavigate();
  const { fireConfetti } = useConfetti();
  const { profile, detailedHealthIssues, setAIAnalysis, setAIAnalysisLoading, setDailyMissions, setAvatarConfig, setOnboardingComplete } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) {
      navigate('/onboarding');
      return;
    }

    let cancelled = false;

    async function runAnalysis() {
      setAIAnalysisLoading(true);

      try {
        // Step 1: Analyze health profile
        setCurrentStep(0);
        const birthYear = parseInt(profile!.birthDate.split('-')[0]);
        const age = new Date().getFullYear() - birthYear;

        const analysis = await analyzeHealthProfile({
          name: profile!.name,
          sex: profile!.sex,
          age,
          weightKg: profile!.weightCurrentKg,
          heightCm: profile!.heightCm,
          activityLevel: profile!.activityLevel,
          medicalConditions: profile!.medicalConditions,
          healthDetails: profile!.healthDetails,
          detailedIssues: detailedHealthIssues,
          medications: profile!.medications,
        });

        if (cancelled) return;

        if (analysis) {
          setAIAnalysis({
            ...analysis,
            rehabPrograms: analysis.rehabPrograms.map(p => ({
              ...p,
              currentWeek: 1,
              completedSessions: 0,
              isCompleted: false,
            })),
            analyzedAt: new Date().toISOString(),
          });
        }

        // Step 2: Generate programs (visual step, analysis covers this)
        setCurrentStep(1);
        await new Promise(r => setTimeout(r, 1500));
        if (cancelled) return;

        // Step 3: Generate daily missions
        setCurrentStep(2);
        const missions = await generateDailyMissions({
          name: profile!.name,
          sex: profile!.sex,
          age,
          level: 1,
          activityLevel: profile!.activityLevel,
          medicalConditions: profile!.medicalConditions,
          weightGoalKg: profile!.weightGoalKg,
          weightCurrentKg: profile!.weightCurrentKg,
          streak: 0,
          sportRestrictions: analysis?.sportRestrictions,
        });

        if (cancelled) return;

        if (missions) {
          const today = new Date().toISOString().split('T')[0];
          setDailyMissions(
            missions.map(m => ({ ...m, isCompleted: false })),
            today
          );
        }

        // Set default avatar
        setAvatarConfig({ ...DEFAULT_AVATAR_CONFIG });

        // Done! Complete onboarding
        await new Promise(r => setTimeout(r, 800));
        if (cancelled) return;

        setAIAnalysisLoading(false);
        setOnboardingComplete(true);

        // Celebrate!
        fireConfetti({ origin: { x: 0.5, y: 0.6 }, particleCount: 160, spread: 90 });
        setTimeout(() => {
          fireConfetti({ angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, particleCount: 50 });
          fireConfetti({ angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, particleCount: 50 });
        }, 200);

        setTimeout(() => navigate('/'), 1200);
      } catch (err) {
        console.error('[Nutreal] AI Analysis error:', err);
        if (cancelled) return;
        setError('Une erreur est survenue. Réessayez ou continuez sans analyse IA.');
        setAIAnalysisLoading(false);
      }
    }

    runAnalysis();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skipAnalysis = () => {
    setAvatarConfig({ ...DEFAULT_AVATAR_CONFIG });
    setAIAnalysisLoading(false);
    setOnboardingComplete(true);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-500 via-primary-600 to-primary-700 flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 12 }}
        className="mb-12"
      >
        <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center">
          <span className="text-4xl font-black text-primary-600 font-display">N</span>
        </div>
        <h1 className="text-white font-bold text-2xl text-center mt-4 font-display">Nutreal</h1>
        <p className="text-white/60 text-sm text-center mt-1">Intelligence artificielle santé</p>
      </motion.div>

      {/* Steps */}
      <div className="w-full max-w-sm space-y-4 mb-12">
        <AnimatePresence>
          {STEPS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: i <= currentStep ? 1 : 0.3,
                y: 0,
              }}
              transition={{ delay: i * 0.3, duration: 0.5 }}
              className="flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                i < currentStep ? 'bg-green-400/20' : i === currentStep ? 'bg-white/20' : 'bg-white/5'
              }`}>
                {i < currentStep ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={20} className="text-green-300" /></motion.div>
                ) : i === currentStep ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}><Icon3D name={s.icon} size={20} /></motion.div>
                ) : (
                  <span className="opacity-50"><Icon3D name={s.icon} size={20} /></span>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-semibold transition-colors duration-300 ${i <= currentStep ? 'text-white' : 'text-white/40'}`}>
                  {s.label}
                </p>
                <p className={`text-xs transition-colors duration-300 ${i <= currentStep ? 'text-white/60' : 'text-white/20'}`}>
                  {s.sublabel}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-sm">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white/40 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 text-center">
          <p className="text-white/80 text-sm mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white/20 rounded-xl text-white text-sm font-medium backdrop-blur-sm">
              Réessayer
            </button>
            <button onClick={skipAnalysis}
              className="px-6 py-3 bg-white rounded-xl text-primary-600 text-sm font-medium">
              Continuer sans IA
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
