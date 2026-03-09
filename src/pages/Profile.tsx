import React, { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, UNLOCKABLE_TITLES } from '../store/useStore';
import { calculateAge } from '../lib/nutrition';
import { getUnlockedItems, ALL_ITEMS } from '../components/avatar/avatarItems';
import RPMCreator from '../components/avatar/RPMCreator';
import LevelBar from '../components/LevelBar';
import MissionCard from '../components/MissionCard';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import ScrollReveal from '../components/ScrollReveal';
import Icon3D from '../components/Icon3D';
import {
  LogOut, Scale, Save, Trophy, Calendar, Flame, Check,
  ChevronDown, ChevronUp, Package, Pencil, Loader2,
  Utensils,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

// Lazy load Avatar3D to avoid loading Three.js until needed
const Avatar3D = lazy(() => import('../components/avatar/Avatar3D'));

export default function Profile() {
  const {
    profile, weightLogs, streak, meals, sportSessions, waterLogs, mealPlan, productScans,
    setAuth, setOnboardingComplete, updateProfile, addWeightLog, showToast,
    avatarConfig, setAvatarUrl, level, xp, selectedTitle, setSelectedTitle, dailyMissions,
  } = useStore();

  const [showRPMCreator, setShowRPMCreator] = useState(false);
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
  const avatarUrl = avatarConfig?.avatarUrl || null;

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
    showToast('Poids mis a jour !');
  };

  const handleLogout = () => { setAuth(false, null); setOnboardingComplete(false); };

  const handleAvatarCreated = (url: string) => {
    setAvatarUrl(url);
    showToast('Avatar 3D sauvegarde !');
  };

  // Available titles
  const availableTitles = UNLOCKABLE_TITLES.filter(t => {
    if (t.requiredLevel > 0) return level >= t.requiredLevel;
    if (t.special === '30_day_streak') return streak >= 30;
    if (t.special === '100_meals_logged') return totalMeals >= 100;
    return false;
  });

  // Achievements
  const totalKcalBurned = sportSessions.reduce((s, ss) => s + ss.caloriesBurned, 0);
  const achievements = [
    { id: 'streak_1', label: 'Premier jour', unlocked: streak >= 1, emoji: 'fire' },
    { id: 'streak_7', label: 'Semaine parfaite', unlocked: streak >= 7, emoji: 'fire' },
    { id: 'streak_30', label: 'Mois de feu', unlocked: streak >= 30, emoji: 'fire' },
    { id: 'meals_1', label: 'Premier repas', unlocked: totalMeals >= 1, emoji: 'forkAndKnife' },
    { id: 'meals_10', label: 'Gourmet', unlocked: totalMeals >= 10, emoji: 'forkAndKnife' },
    { id: 'meals_50', label: 'Epicurien', unlocked: totalMeals >= 50, emoji: 'forkAndKnife' },
    { id: 'meals_100', label: 'Centenaire', unlocked: totalMeals >= 100, emoji: 'forkAndKnife' },
    { id: 'sport_1', label: 'Premier effort', unlocked: totalSport >= 1, emoji: 'flexedBiceps' },
    { id: 'sport_10', label: 'Athlete', unlocked: totalSport >= 10, emoji: 'flexedBiceps' },
    { id: 'sport_20', label: 'Champion', unlocked: totalSport >= 20, emoji: 'flexedBiceps' },
    { id: 'kcal_1000', label: 'Bruleur', unlocked: totalKcalBurned >= 1000, emoji: 'highVoltage' },
    { id: 'water_7', label: 'Hydrate', unlocked: waterLogs.length >= 7, emoji: 'droplet' },
    { id: 'water_30', label: 'Source naturelle', unlocked: waterLogs.length >= 30, emoji: 'droplet' },
    { id: 'days_7', label: '7 jours trackes', unlocked: uniqueDays >= 7, emoji: 'calendar' },
    { id: 'days_30', label: '30 jours trackes', unlocked: uniqueDays >= 30, emoji: 'calendar' },
    { id: 'weight_5', label: 'Suivi regulier', unlocked: weightLogs.length >= 5, emoji: 'chartIncreasing' },
    { id: 'plan_done', label: 'Planificateur', unlocked: mealPlan !== null, emoji: 'glowingStar' },
    { id: 'scan_1', label: 'Scanner pro', unlocked: productScans.length > 0, emoji: 'bullseye' },
  ];
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  // Item collection
  const unlockedItems = getUnlockedItems(level);
  const totalItems = ALL_ITEMS.filter(i => !i.isPremium).length;

  // Active missions
  const activeMissions = dailyMissions.filter(m => !m.isCompleted);
  const completedMissions = dailyMissions.filter(m => m.isCompleted);

  return (
    <AnimatedPage className="max-w-lg mx-auto pb-4">
      {/* Logout button (absolute top-right) */}
      <div className="absolute top-12 right-4 z-10">
        <motion.button whileTap={{ scale: 0.9 }} onClick={handleLogout}
          className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm">
          <LogOut size={18} className="text-error-300" />
        </motion.button>
      </div>

      {/* ── HERO: 3D Avatar ── */}
      <div className="relative">
        <Suspense fallback={
          <div className="w-full flex items-center justify-center bg-gradient-to-b from-primary-100 to-white rounded-2xl" style={{ height: '55vh' }}>
            <div className="text-center">
              <Loader2 size={32} className="text-primary-400 animate-spin mx-auto mb-2" />
              <p className="text-xs text-text-muted">Chargement 3D...</p>
            </div>
          </div>
        }>
          <Avatar3D url={avatarUrl} height="55vh" />
        </Suspense>

        {/* Modify avatar button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowRPMCreator(true)}
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-float"
        >
          <Pencil size={16} className="text-primary-500" />
          <span className="text-xs font-bold text-primary-600">
            {avatarUrl ? 'Modifier' : 'Creer mon avatar'}
          </span>
        </motion.button>
      </div>

      {/* Content below avatar */}
      <div className="px-4 -mt-2 relative z-10">
        {/* Name + Title */}
        <ScrollReveal>
          <div className="text-center mb-4 pt-4">
            <h2 className="text-2xl font-black text-text-primary font-display">{profile.name}</h2>
            <button onClick={() => setShowTitlePicker(!showTitlePicker)}
              className="text-sm text-primary-500 font-medium mt-1 flex items-center justify-center gap-1 mx-auto">
              <Icon3D name="sportsMedal" size={16} /> {selectedTitle}
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
          </div>
        </ScrollReveal>

        {/* XP Bar */}
        <ScrollReveal delay={0.05}>
          <LevelBar className="mb-4" />
        </ScrollReveal>

        {/* Missions */}
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

        {/* Stats */}
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

        {/* Achievements */}
        <ScrollReveal delay={0.2}>
          <AnimatedCard className="p-4 mb-4" index={4}>
            <button onClick={() => setShowAchievements(!showAchievements)}
              className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-warning-300" />
                <h3 className="text-sm font-bold text-text-primary">Succes</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full">
                  {unlockedCount}/{achievements.length}
                </span>
                {showAchievements ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
              </div>
            </button>
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
                        <Icon3D name={a.emoji} size={20} />
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

        {/* Weight chart */}
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
              <p className="text-xs text-text-muted text-center py-4">Ajoutez des pesees pour voir le graphique</p>
            )}
          </AnimatedCard>
        </ScrollReveal>

        {/* Item collection */}
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
                    {(['hairstyle', 'outfit', 'accessory', 'pet'] as const).map(type => {
                      const typeItems = ALL_ITEMS.filter(i => i.type === type && !i.isPremium);
                      const unlocked = typeItems.filter(i => i.requiredLevel <= level);
                      const iconName = type === 'hairstyle' ? 'personGettingHaircut' : type === 'outfit' ? 'tShirt' : type === 'accessory' ? 'watch' : 'catFace';
                      const labelText = type === 'hairstyle' ? 'Coiffures' : type === 'outfit' ? 'Tenues' : type === 'accessory' ? 'Accessoires' : 'Animaux';
                      return (
                        <div key={type}>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-medium text-text-secondary flex items-center gap-1"><Icon3D name={iconName} size={14} /> {labelText}</p>
                            <p className="text-[10px] text-text-muted">{unlocked.length}/{typeItems.length}</p>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {typeItems.map(item => (
                              <div key={item.id}
                                className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.requiredLevel <= level ? 'bg-primary-50' : 'bg-surface-100 opacity-30'}`}
                                title={item.requiredLevel <= level ? item.name : `Niveau ${item.requiredLevel} requis`}>
                                <Icon3D name={item.emoji} size={18} />
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
      </div>

      {/* RPM Creator Modal */}
      <RPMCreator
        open={showRPMCreator}
        onClose={() => setShowRPMCreator(false)}
        onAvatarCreated={handleAvatarCreated}
      />
    </AnimatedPage>
  );
}
