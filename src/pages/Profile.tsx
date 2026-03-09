import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, UNLOCKABLE_TITLES } from '../store/useStore';
import { calculateAge, LOCATION_OPTIONS } from '../lib/nutrition';
import { getUnlockedItems, ALL_ITEMS } from '../components/avatar/avatarItems';
import Avatar from '../components/avatar/Avatar';
import AvatarEditor from '../components/avatar/AvatarEditor';
import LevelBar from '../components/LevelBar';
import MissionCard from '../components/MissionCard';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import ScrollReveal from '../components/ScrollReveal';
import {
  LogOut, Scale, Save, Trophy, Calendar, Flame, Check,
  ChevronDown, ChevronUp, Package, Award, Utensils,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function Profile() {
  const {
    profile, weightLogs, streak, meals, sportSessions, waterLogs, mealPlan, productScans,
    setAuth, setOnboardingComplete, updateProfile, addWeightLog, showToast,
    avatarConfig, level, xp, selectedTitle, setSelectedTitle, dailyMissions,
  } = useStore();

  const [showEditor, setShowEditor] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [showTitlePicker, setShowTitlePicker] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showCollection, setShowCollection] = useState(false);

  if (!profile) return null;

  const age = calculateAge(profile.birthDate);
  const totalMeals = meals.length;
  const uniqueDays = new Set(meals.map(m => m.date)).size;
  const totalSport = sportSessions.length;

  const weightData = weightLogs.slice(-14).map(w => ({
    date: new Date(w.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
    weight: w.weight,
  }));

  const logWeight = () => {
    const w = parseFloat(newWeight);
    if (isNaN(w) || w < 30 || w > 300) return;
    addWeightLog(new Date().toISOString().split('T')[0], w);
    updateProfile({ weightCurrentKg: w });
    setNewWeight(''); setShowWeightInput(false);
    showToast('Poids mis à jour !');
  };

  const handleLogout = () => { setAuth(false, null); setOnboardingComplete(false); };

  // Available titles for title picker
  const availableTitles = UNLOCKABLE_TITLES.filter(t => {
    if (t.requiredLevel > 0) return level >= t.requiredLevel;
    if (t.special === '30_day_streak') return streak >= 30;
    if (t.special === '100_meals_logged') return totalMeals >= 100;
    return false;
  });

  // Achievements
  const totalKcalBurned = sportSessions.reduce((s, ss) => s + ss.caloriesBurned, 0);
  const achievements = [
    { id: 'streak_1', label: 'Premier jour', unlocked: streak >= 1, emoji: '🔥' },
    { id: 'streak_7', label: 'Semaine parfaite', unlocked: streak >= 7, emoji: '🔥' },
    { id: 'streak_30', label: 'Mois de feu', unlocked: streak >= 30, emoji: '🔥' },
    { id: 'meals_1', label: 'Premier repas', unlocked: totalMeals >= 1, emoji: '🍽️' },
    { id: 'meals_10', label: 'Gourmet', unlocked: totalMeals >= 10, emoji: '🍽️' },
    { id: 'meals_50', label: 'Épicurien', unlocked: totalMeals >= 50, emoji: '🍽️' },
    { id: 'meals_100', label: 'Centenaire', unlocked: totalMeals >= 100, emoji: '🍽️' },
    { id: 'sport_1', label: 'Premier effort', unlocked: totalSport >= 1, emoji: '💪' },
    { id: 'sport_10', label: 'Athlète', unlocked: totalSport >= 10, emoji: '💪' },
    { id: 'sport_20', label: 'Champion', unlocked: totalSport >= 20, emoji: '💪' },
    { id: 'kcal_1000', label: 'Brûleur', unlocked: totalKcalBurned >= 1000, emoji: '⚡' },
    { id: 'water_7', label: 'Hydraté', unlocked: waterLogs.length >= 7, emoji: '💧' },
    { id: 'water_30', label: 'Source naturelle', unlocked: waterLogs.length >= 30, emoji: '💧' },
    { id: 'days_7', label: '7 jours trackés', unlocked: uniqueDays >= 7, emoji: '📅' },
    { id: 'days_30', label: '30 jours trackés', unlocked: uniqueDays >= 30, emoji: '📅' },
    { id: 'weight_5', label: 'Suivi régulier', unlocked: weightLogs.length >= 5, emoji: '📈' },
    { id: 'plan_done', label: 'Planificateur', unlocked: mealPlan !== null, emoji: '⭐' },
    { id: 'scan_1', label: 'Scanner pro', unlocked: productScans.length > 0, emoji: '🎯' },
  ];
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  // Item collection
  const unlockedItems = getUnlockedItems(level);
  const totalItems = ALL_ITEMS.filter(i => !i.isPremium).length;

  // Active missions
  const activeMissions = dailyMissions.filter(m => !m.isCompleted);
  const completedMissions = dailyMissions.filter(m => m.isCompleted);

  return (
    <AnimatedPage className="px-4 pt-12 pb-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-text-primary font-display">Profil</h1>
        <motion.button whileTap={{ scale: 0.9 }} onClick={handleLogout}
          className="w-10 h-10 bg-error-50 rounded-xl flex items-center justify-center">
          <LogOut size={18} className="text-error-300" />
        </motion.button>
      </div>

      {/* 1. Avatar + Name + Title */}
      <ScrollReveal>
        <AnimatedCard className="p-5 mb-4 text-center" index={0}>
          <div className="flex justify-center mb-3">
            {avatarConfig ? (
              <motion.div whileTap={{ scale: 0.95 }}>
                <Avatar config={avatarConfig} size={100} onClick={() => setShowEditor(true)} />
              </motion.div>
            ) : (
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center" onClick={() => setShowEditor(true)}>
                <span className="text-3xl">👤</span>
              </div>
            )}
          </div>
          <h2 className="text-xl font-bold text-text-primary">{profile.name}</h2>
          <button onClick={() => setShowTitlePicker(!showTitlePicker)}
            className="text-sm text-primary-500 font-medium mt-0.5 flex items-center justify-center gap-1 mx-auto">
            🏅 {selectedTitle}
            <ChevronDown size={14} />
          </button>
          <p className="text-xs text-text-muted mt-1">{age} ans · {profile.sex === 'M' ? 'Homme' : 'Femme'}</p>

          {/* Title picker */}
          <AnimatePresence>
            {showTitlePicker && availableTitles.length > 0 && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-3 pt-3 border-t border-surface-200">
                <p className="text-xs text-text-muted mb-2">Choisir un titre</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {availableTitles.map(t => (
                    <button key={t.id} onClick={() => { setSelectedTitle(t.name); setShowTitlePicker(false); }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${selectedTitle === t.name ? 'bg-primary-500 text-white' : 'bg-surface-100 text-text-secondary'}`}>
                      {t.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </AnimatedCard>
      </ScrollReveal>

      {/* 2. XP Bar */}
      <ScrollReveal delay={0.05}>
        <LevelBar className="mb-4" />
      </ScrollReveal>

      {/* 3. Missions du jour */}
      {dailyMissions.length > 0 && (
        <ScrollReveal delay={0.1}>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-text-primary">Missions du jour</h3>
              <span className="text-xs font-medium text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full">
                {completedMissions.length}/{dailyMissions.length}
              </span>
            </div>
            <div className="space-y-2">
              {activeMissions.map((m, i) => <MissionCard key={m.id} mission={m} index={i} />)}
              {completedMissions.map((m, i) => <MissionCard key={m.id} mission={m} index={activeMissions.length + i} />)}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* 4. Stats */}
      <ScrollReveal delay={0.15}>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <AnimatedCard className="p-3 text-center" index={1}>
            <Flame size={18} className="text-warning-300 mx-auto mb-1" />
            <p className="text-lg font-bold text-text-primary">{streak}</p>
            <p className="text-[10px] text-text-muted">Streak</p>
          </AnimatedCard>
          <AnimatedCard className="p-3 text-center" index={2}>
            <Calendar size={18} className="text-primary-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-text-primary">{uniqueDays}</p>
            <p className="text-[10px] text-text-muted">Jours actifs</p>
          </AnimatedCard>
          <AnimatedCard className="p-3 text-center" index={3}>
            <Utensils size={18} className="text-success-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-text-primary">{totalMeals}</p>
            <p className="text-[10px] text-text-muted">Repas</p>
          </AnimatedCard>
        </div>
      </ScrollReveal>

      {/* 5. Achievements (collapsed) */}
      <ScrollReveal delay={0.2}>
        <AnimatedCard className="p-4 mb-4" index={4}>
          <button onClick={() => setShowAchievements(!showAchievements)}
            className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy size={18} className="text-warning-300" />
              <h3 className="text-sm font-bold text-text-primary">Succès</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full">
                {unlockedCount}/{achievements.length}
              </span>
              {showAchievements ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
            </div>
          </button>

          {/* Progress bar */}
          <div className="h-2 bg-surface-200 rounded-full overflow-hidden mt-3">
            <div className="h-full bg-gradient-to-r from-warning-300 to-warning-400 rounded-full transition-all"
              style={{ width: `${(unlockedCount / achievements.length) * 100}%` }} />
          </div>

          <AnimatePresence>
            {showAchievements && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden">
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {achievements.map(a => (
                    <div key={a.id} className={`p-2 rounded-xl text-center ${a.unlocked ? 'bg-warning-50' : 'bg-surface-100 opacity-40'}`}>
                      <span className="text-lg">{a.emoji}</span>
                      <p className="text-[10px] font-medium text-text-primary mt-0.5 truncate">{a.label}</p>
                      {a.unlocked && <Check size={10} className="text-green-500 mx-auto mt-0.5" />}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </AnimatedCard>
      </ScrollReveal>

      {/* 6. Weight chart */}
      <ScrollReveal delay={0.25}>
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

      {/* 7. Item collection */}
      <ScrollReveal delay={0.3}>
        <AnimatedCard className="p-4 mb-4" index={6}>
          <button onClick={() => setShowCollection(!showCollection)}
            className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package size={18} className="text-primary-500" />
              <h3 className="text-sm font-bold text-text-primary">Collection</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full">
                {unlockedItems.length}/{totalItems}
              </span>
              {showCollection ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
            </div>
          </button>

          <AnimatePresence>
            {showCollection && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden">
                <div className="space-y-3 mt-3">
                  {['hairstyle', 'outfit', 'accessory', 'pet'].map(type => {
                    const typeItems = ALL_ITEMS.filter(i => i.type === type && !i.isPremium);
                    const unlocked = typeItems.filter(i => i.requiredLevel <= level);
                    const label = type === 'hairstyle' ? '💇 Coiffures' : type === 'outfit' ? '👕 Tenues' : type === 'accessory' ? '⌚ Accessoires' : '🐱 Animaux';
                    return (
                      <div key={type}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-medium text-text-secondary">{label}</p>
                          <p className="text-[10px] text-text-muted">{unlocked.length}/{typeItems.length}</p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {typeItems.map(item => (
                            <div key={item.id}
                              className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm ${item.requiredLevel <= level ? 'bg-primary-50' : 'bg-surface-100 opacity-30'}`}
                              title={item.requiredLevel <= level ? item.name : `Niveau ${item.requiredLevel} requis`}>
                              {item.emoji}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </AnimatedCard>
      </ScrollReveal>

      {/* Avatar Editor Modal */}
      {showEditor && <AvatarEditor onClose={() => setShowEditor(false)} />}
    </AnimatedPage>
  );
}
