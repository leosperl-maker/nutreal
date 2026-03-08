import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { calculateAge, LOCATION_OPTIONS } from '../lib/nutrition';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedCounter from '../components/AnimatedCounter';
import ScrollReveal from '../components/ScrollReveal';
import { User, Scale, Target, Activity, MapPin, LogOut, Edit3, Save, TrendingDown, Award, Calendar, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function Profile() {
  const { profile, weightLogs, streak, meals, setAuth, setOnboardingComplete, updateProfile, addWeightLog, showToast } = useStore();
  const [editing, setEditing] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [showWeightInput, setShowWeightInput] = useState(false);

  if (!profile) return null;

  const age = calculateAge(profile.birthDate);
  const loc = LOCATION_OPTIONS.find(l => l.value === profile.location);
  const totalMeals = meals.length;
  const uniqueDays = new Set(meals.map(m => m.date)).size;

  const weightData = weightLogs.slice(-14).map(w => ({
    date: new Date(w.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
    weight: w.weight,
  }));

  const logWeight = () => {
    const w = parseFloat(newWeight);
    if (isNaN(w) || w < 30 || w > 300) return;
    const today = new Date().toISOString().split('T')[0];
    addWeightLog(today, w);
    updateProfile({ weightCurrentKg: w });
    setNewWeight(''); setShowWeightInput(false);
    showToast('Poids mis à jour ! ⚖️');
  };

  const handleLogout = () => {
    setAuth(false, null);
    setOnboardingComplete(false);
  };

  return (
    <AnimatedPage className="px-4 pt-12 pb-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary font-display">Profil</h1>
        <motion.button whileTap={{ scale: 0.9 }} onClick={handleLogout}
          className="w-10 h-10 bg-error-50 rounded-xl flex items-center justify-center">
          <LogOut size={18} className="text-error-300" />
        </motion.button>
      </div>

      {/* Profile card */}
      <ScrollReveal>
        <AnimatedCard className="p-5 mb-4" index={0}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
              <User size={28} className="text-primary-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">{profile.name}</h2>
              <p className="text-sm text-text-secondary">{age} ans · {profile.sex === 'M' ? 'Homme' : 'Femme'}</p>
              {loc && <p className="text-xs text-text-muted">{loc.emoji} {loc.label}</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[{ l: 'Taille', v: `${profile.heightCm} cm`, i: '📏' },
              { l: 'Poids', v: `${profile.weightCurrentKg} kg`, i: '⚖️' },
              { l: 'Objectif', v: `${profile.weightGoalKg} kg`, i: '🎯' }].map(s => (
              <div key={s.l} className="bg-surface-100 rounded-xl p-3 text-center">
                <span className="text-lg">{s.i}</span>
                <p className="text-sm font-bold text-text-primary mt-1">{s.v}</p>
                <p className="text-[10px] text-text-muted">{s.l}</p>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </ScrollReveal>

      {/* Stats */}
      <ScrollReveal delay={0.05}>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <AnimatedCard className="p-3 text-center" index={1}>
            <Award size={20} className="text-warning-300 mx-auto mb-1" />
            <p className="text-lg font-bold text-text-primary">{streak}</p>
            <p className="text-[10px] text-text-muted">Jours streak</p>
          </AnimatedCard>
          <AnimatedCard className="p-3 text-center" index={2}>
            <Calendar size={20} className="text-primary-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-text-primary">{uniqueDays}</p>
            <p className="text-[10px] text-text-muted">Jours actifs</p>
          </AnimatedCard>
          <AnimatedCard className="p-3 text-center" index={3}>
            <TrendingDown size={20} className="text-success-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-text-primary">{totalMeals}</p>
            <p className="text-[10px] text-text-muted">Repas logués</p>
          </AnimatedCard>
        </div>
      </ScrollReveal>

      {/* Nutrition info */}
      <ScrollReveal delay={0.1}>
        <AnimatedCard className="p-4 mb-4" index={4}>
          <h3 className="text-sm font-semibold text-text-primary mb-3">Objectifs nutritionnels</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-surface-100 rounded-xl p-3">
              <p className="text-text-muted text-xs">Budget calorique</p>
              <p className="font-bold text-primary-500"><AnimatedCounter value={profile.dailyCalorieBudget} /> kcal</p>
            </div>
            <div className="bg-surface-100 rounded-xl p-3">
              <p className="text-text-muted text-xs">TDEE</p>
              <p className="font-bold text-text-primary"><AnimatedCounter value={profile.tdee} /> kcal</p>
            </div>
            <div className="bg-surface-100 rounded-xl p-3">
              <p className="text-text-muted text-xs">Protéines</p>
              <p className="font-bold text-text-primary">{profile.macroTargets.protein_g}g</p>
            </div>
            <div className="bg-surface-100 rounded-xl p-3">
              <p className="text-text-muted text-xs">Date objectif</p>
              <p className="font-bold text-text-primary text-xs">{profile.estimatedGoalDate ? new Date(profile.estimatedGoalDate).toLocaleDateString('fr-FR') : '—'}</p>
            </div>
          </div>
        </AnimatedCard>
      </ScrollReveal>

      {/* Weight log */}
      <ScrollReveal delay={0.15}>
        <AnimatedCard className="p-4 mb-4" index={5}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text-primary">Suivi du poids</h3>
            <AnimatedButton variant="ghost" onClick={() => setShowWeightInput(!showWeightInput)} className="px-3 py-1.5 text-xs">
              <Scale size={14} className="mr-1" /> Peser
            </AnimatedButton>
          </div>
          <AnimatePresence>
            {showWeightInput && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-3">
                <div className="flex gap-2">
                  <input type="number" value={newWeight} onChange={e => setNewWeight(e.target.value)} placeholder="Ex: 78.5"
                    className="flex-1 px-3 py-2 bg-surface-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
                  <AnimatedButton onClick={logWeight} className="px-4 py-2 text-sm"><Save size={16} /></AnimatedButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {weightData.length > 1 ? (
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={weightData}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#8BA3B0" />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} stroke="#8BA3B0" width={35} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(42,107,138,0.1)' }} />
                <Line type="monotone" dataKey="weight" stroke="#2A6B8A" strokeWidth={2} dot={{ fill: '#2A6B8A', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-text-muted text-center py-4">Ajoutez des pesées pour voir le graphique</p>
          )}
        </AnimatedCard>
      </ScrollReveal>
    </AnimatedPage>
  );
}
