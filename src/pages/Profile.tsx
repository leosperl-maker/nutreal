import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, UNLOCKABLE_TITLES } from '../store/useStore';
import { calculateAge } from '../lib/nutrition';
import { getUnlockedItems, ALL_ITEMS, getItemRarity, RARITY_MAP, DEFAULT_AVATAR_CONFIG, isItemUnlocked } from '../components/avatar/avatarItems';
import type { AvatarItem } from '../components/avatar/avatarItems';
import AvatarEditor from '../components/avatar/AvatarEditor';
import ShopModal from '../components/ShopModal';
import LevelBar from '../components/LevelBar';
import MissionCard from '../components/MissionCard';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import ScrollReveal from '../components/ScrollReveal';
import Icon3D from '../components/Icon3D';
import ItemPreview from '../components/avatar/ItemPreview';
import {
  LogOut, Scale, Save, Trophy, Calendar, Flame, Check,
  ChevronDown, ChevronUp, Package, Pencil, Coins,
  ShoppingBag, Utensils,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const Avatar3DViewer = lazy(() => import('../components/avatar/Avatar3DViewer'));

/** Game-style inventory item card */
function ItemCard({ item, playerLevel, purchased }: { item: AvatarItem; playerLevel: number; purchased: string[] }) {
  const unlocked = isItemUnlocked(item.id, playerLevel, purchased);
  const rarity = getItemRarity(item);
  const info = RARITY_MAP[rarity];

  return (
    <div className="relative group" title={unlocked ? `${item.name} (${info.name})` : `Niv. ${item.requiredLevel} requis`}>
      <div
        className="relative rounded-xl overflow-hidden aspect-square flex flex-col items-center justify-center"
        style={{
          background: unlocked
            ? `linear-gradient(135deg, ${info.bgFrom}20, ${info.bgTo}30)`
            : '#F3F4F6',
          border: `2px solid ${unlocked ? info.border : '#E5E7EB'}`,
          boxShadow: unlocked && info.glow ? `0 4px 12px ${info.glow}` : 'none',
        }}
      >
        <div className={`transition-all ${unlocked ? '' : 'opacity-25 grayscale'}`}>
          <ItemPreview itemId={item.id} emoji={item.emoji} type={item.type} size={40} />
        </div>
        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">
            <div className="bg-black/60 rounded-full w-6 h-6 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <rect x="3" y="11" width="18" height="12" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" fill="none" stroke="white" strokeWidth="2" />
              </svg>
            </div>
          </div>
        )}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ background: unlocked ? `linear-gradient(90deg, ${info.bgFrom}, ${info.bgTo})` : '#D1D5DB' }}
        />
      </div>
      <p className={`text-[9px] font-medium text-center mt-1 truncate px-0.5 ${unlocked ? 'text-text-primary' : 'text-text-muted'}`}>
        {item.name}
      </p>
      {!unlocked && (
        <div className="absolute -top-1 -right-1 bg-text-primary text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow">
          {item.requiredLevel}
        </div>
      )}
    </div>
  );
}

export default function Profile() {
  const {
    profile, weightLogs, streak, meals, sportSessions, waterLogs, mealPlan, productScans,
    setAuth, setOnboardingComplete, updateProfile, addWeightLog, showToast,
    avatarConfig, setAvatarConfig, level, xp, selectedTitle, setSelectedTitle, dailyMissions,
    coins, purchasedItems,
  } = useStore();

  const [showEditor, setShowEditor] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [showTitlePicker, setShowTitlePicker] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showCollection, setShowCollection] = useState(false);

  // Auto-init avatar config
  useEffect(() => {
    if (!avatarConfig) {
      setAvatarConfig({ ...DEFAULT_AVATAR_CONFIG });
    }
  }, [avatarConfig, setAvatarConfig]);

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
    showToast('Poids mis a jour !');
  };

  const handleLogout = () => { setAuth(false, null); setOnboardingComplete(false); };

  const availableTitles = UNLOCKABLE_TITLES.filter(t => {
    if (t.requiredLevel > 0) return level >= t.requiredLevel;
    if (t.special === '30_day_streak') return streak >= 30;
    if (t.special === '100_meals_logged') return totalMeals >= 100;
    return false;
  });

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

  const unlockedItems = getUnlockedItems(level);
  const totalItems = ALL_ITEMS.filter(i => !i.isPremium).length;

  const activeMissions = dailyMissions.filter(m => !m.isCompleted);
  const completedMissions = dailyMissions.filter(m => m.isCompleted);

  return (
    <AnimatedPage className="max-w-lg mx-auto pb-4">
      {/* Logout button */}
      <div className="absolute top-12 right-4 z-10">
        <motion.button whileTap={{ scale: 0.9 }} onClick={handleLogout}
          className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm">
          <LogOut size={18} className="text-error-300" />
        </motion.button>
      </div>

      {/* ── HERO: 3D Avatar ── */}
      <div className="relative">
        {avatarConfig ? (
          <Suspense fallback={
            <div className="w-full rounded-2xl bg-gradient-to-b from-indigo-100 to-pink-50 flex items-center justify-center" style={{ height: '280px' }}>
              <div className="animate-pulse text-primary-400 text-sm font-medium">Chargement 3D...</div>
            </div>
          }>
            <Avatar3DViewer config={avatarConfig} height="280px" />
          </Suspense>
        ) : (
          <div className="w-full rounded-2xl bg-gradient-to-b from-primary-200 via-primary-100 to-white flex items-center justify-center" style={{ height: '280px' }}>
            <div className="animate-pulse text-primary-400 text-sm">Chargement...</div>
          </div>
        )}

        {/* Customize button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowEditor(true)}
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-float z-[2]"
        >
          <Pencil size={16} className="text-primary-500" />
          <span className="text-xs font-bold text-primary-600">Personnaliser</span>
        </motion.button>
      </div>

      {/* Content */}
      <div className="px-4 -mt-2 relative z-10">
        {/* Coins bar */}
        <ScrollReveal>
          <div className="flex items-center justify-center gap-2 mb-3 pt-3">
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-4 py-2">
              <Coins size={18} className="text-amber-500" />
              <span className="text-base font-bold text-amber-700">{coins.toLocaleString()}</span>
              <span className="text-xs text-amber-500 font-medium ml-0.5">coins</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Name + Title */}
        <ScrollReveal>
          <div className="text-center mb-4">
            <h2 className="text-2xl font-black text-text-primary font-display">{profile.name}</h2>
            <button onClick={() => setShowTitlePicker(!showTitlePicker)}
              className="text-sm text-primary-500 font-medium mt-1 flex items-center justify-center gap-1 mx-auto">
              <Icon3D name="sportsMedal" size={16} /> {selectedTitle}
              <ChevronDown size={14} />
            </button>
            <p className="text-xs text-text-muted mt-1">{age} ans · {profile.sex === 'M' ? 'Homme' : 'Femme'}</p>

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
          <LevelBar className="mb-3" />
        </ScrollReveal>

        {/* Shop button */}
        <ScrollReveal delay={0.08}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowShop(true)}
            className="w-full mb-4 bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl p-4 flex items-center justify-between shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <ShoppingBag size={20} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white">Boutique</p>
                <p className="text-[11px] text-white/80">Acheter des items avec vos coins</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1.5">
              <Coins size={14} className="text-white" />
              <span className="text-sm font-bold text-white">{coins.toLocaleString()}</span>
            </div>
          </motion.button>
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
                <h3 className="text-sm font-bold text-text-primary">Inventaire</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full">
                  {unlockedItems.length + purchasedItems.length}/{totalItems}
                </span>
                {showCollection ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
              </div>
            </button>
            <AnimatePresence>
              {showCollection && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden">
                  <div className="space-y-4 mt-4">
                    {(['hairstyle', 'outfit', 'accessory', 'pet'] as const).map(type => {
                      const typeItems = ALL_ITEMS.filter(i => i.type === type);
                      const owned = typeItems.filter(i => isItemUnlocked(i.id, level, purchasedItems));
                      const labelText = type === 'hairstyle' ? 'Coiffures' : type === 'outfit' ? 'Tenues' : type === 'accessory' ? 'Accessoires' : 'Compagnons';
                      return (
                        <div key={type}>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-bold text-text-primary uppercase tracking-wider">{labelText}</p>
                            <p className="text-[10px] text-text-muted font-medium">{owned.length}/{typeItems.length}</p>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            {typeItems.map(item => <ItemCard key={item.id} item={item} playerLevel={level} purchased={purchasedItems} />)}
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

      {/* Modals */}
      {showEditor && <AvatarEditor onClose={() => setShowEditor(false)} />}
      {showShop && <ShopModal onClose={() => setShowShop(false)} />}
    </AnimatedPage>
  );
}
