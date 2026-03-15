import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Utensils, Dumbbell, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import Icon3D from '../components/Icon3D';
import { detectCyclePhase, getNextPhaseDate, PHASES, CyclePhase } from '../lib/feminineCycle';
import AnimatedPage from '../components/AnimatedPage';
import ScrollReveal from '../components/ScrollReveal';

const TAB_ICONS = { nutrition: Utensils, sport: Dumbbell, wellness: Heart };
const TAB_LABELS = { nutrition: 'Nutrition', sport: 'Sport', wellness: 'Bien-être' };

const phaseOrder: CyclePhase[] = ['menstruation', 'follicular', 'ovulation', 'luteal'];

export default function FeminineCycle() {
  const navigate = useNavigate();
  const profile = useStore(s => s.profile);
  const [activeTab, setActiveTab] = React.useState<'nutrition' | 'sport' | 'wellness'>('nutrition');

  const cycleData = profile?.cycleData ?? null;
  const lastPeriodDate = cycleData ? new Date(cycleData.lastPeriodDate) : null;
  const cycleLength = cycleData?.cycleLength ?? 28;

  const currentPhase = useMemo(() => {
    if (!lastPeriodDate) return null;
    return detectCyclePhase(lastPeriodDate, cycleLength);
  }, [lastPeriodDate, cycleLength]);

  const nextPhase = useMemo(() => {
    if (!lastPeriodDate) return null;
    return getNextPhaseDate(lastPeriodDate, cycleLength);
  }, [lastPeriodDate, cycleLength]);

  if (!lastPeriodDate || !currentPhase) {
    return (
      <AnimatedPage className="min-h-screen bg-surface-50 p-6 flex flex-col items-center justify-center text-center pb-24">
        <Icon3D name="lotus" size={64} />
        <h2 className="font-display text-xl font-bold mt-4 text-text-primary">Suivi Cycle Féminin</h2>
        <p className="text-text-secondary mt-2 max-w-xs">
          Active le suivi dans ton profil pour recevoir des conseils adaptés à chaque phase.
        </p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/profile')}
          className="mt-6 px-6 py-3 bg-primary-500 text-white rounded-xl font-medium"
        >
          Configurer dans le profil
        </motion.button>
      </AnimatedPage>
    );
  }

  const currentIndex = phaseOrder.indexOf(currentPhase.phase);
  const tips = activeTab === 'nutrition'
    ? currentPhase.nutritionTips
    : activeTab === 'sport'
    ? currentPhase.sportTips
    : currentPhase.wellnessTips;

  return (
    <div className="min-h-screen bg-surface-50 pb-24">
      {/* Header gradient */}
      <div className="text-white p-6 pb-10 rounded-b-3xl" style={{ background: `linear-gradient(135deg, ${currentPhase.color}cc, ${currentPhase.color})` }}>
        <div className="flex items-center gap-3 mb-5">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)}
            className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <ArrowLeft size={20} />
          </motion.button>
          <h1 className="font-display text-xl font-bold">Mon Cycle</h1>
        </div>

        {/* Phase actuelle */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white/15 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <Icon3D name={currentPhase.emoji} size={48} />
            <div>
              <p className="text-white/70 text-xs">{currentPhase.dayRange}</p>
              <h2 className="font-display text-2xl font-bold">{currentPhase.name}</h2>
              <p className="text-white/80 text-sm mt-0.5">Focus : {currentPhase.macroFocus}</p>
            </div>
          </div>
          {currentPhase.calorieAdjustment !== 0 && (
            <p className="text-white/90 text-xs mt-3 bg-white/10 rounded-lg px-3 py-1.5 inline-block">
              {currentPhase.calorieAdjustment > 0 ? '+' : ''}{currentPhase.calorieAdjustment} kcal recommandé cette phase
            </p>
          )}
        </motion.div>

        {/* Timeline des 4 phases */}
        <div className="flex gap-1.5 mt-4">
          {phaseOrder.map((phase, i) => (
            <div key={phase} className="flex-1">
              <div className={`h-2 rounded-full transition-all ${i === currentIndex ? 'bg-white' : 'bg-white/25'}`} />
              <p className={`text-[9px] mt-1 text-center truncate ${i === currentIndex ? 'text-white font-bold' : 'text-white/40'}`}>
                {PHASES[phase].name.split(' ')[0]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 mt-4">
        {(['nutrition', 'sport', 'wellness'] as const).map(tab => {
          const Icon = TAB_ICONS[tab];
          return (
            <motion.button key={tab} whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === tab ? 'bg-primary-500 text-white' : 'bg-white text-text-secondary shadow-card'
              }`}>
              <Icon size={15} />
              {TAB_LABELS[tab]}
            </motion.button>
          );
        })}
      </div>

      {/* Tips */}
      <div className="px-4 mt-4 space-y-3">
        {tips.map((tip, i) => (
          <ScrollReveal key={`${activeTab}-${i}`} delay={i * 0.08}>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-xl p-4 shadow-card border-l-4"
              style={{ borderColor: currentPhase.color }}
            >
              <p className="text-sm text-text-primary leading-relaxed">{tip}</p>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>

      {/* Prochaine phase */}
      {nextPhase && (
        <div className="px-4 mt-6">
          <div className="bg-white rounded-xl p-4 shadow-card flex items-center gap-3">
            <Calendar size={20} className="text-text-muted flex-shrink-0" />
            <div>
              <p className="text-xs text-text-muted">Prochaine phase</p>
              <p className="text-sm font-semibold text-text-primary">
                {PHASES[nextPhase.phase].name} — {nextPhase.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
