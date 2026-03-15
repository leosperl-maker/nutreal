import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import ScrollReveal from '../components/ScrollReveal';
import { DashboardSkeleton } from '../components/ShimmerSkeleton';
import LevelUpModal from '../components/LevelUpModal';
import MissionCard from '../components/MissionCard';
import CheckInModal from '../components/CheckInModal';
import WeeklyReport from '../components/WeeklyReport';
import { Target, ChevronRight, ClipboardCheck, BarChart3 } from 'lucide-react';
import { celebrateStreak, celebrateWaterComplete } from '../lib/celebrations';
import { generateCoachTip } from '../lib/coachTips';
import V7Glass from '../components/svg/V7Glass';
import {
  LogoMark, StarSticker, SunSticker, PlateSticker, MoonSticker, AppleSticker,
  SneakerSticker, WeightSticker, ProteinIcon, CarbsIcon, FatIcon, FiberIcon,
} from '../components/svg/V7Stickers';

const WATER_GOAL = 2000;
const GLASS_ML = 250;
const GLASSES_TOTAL = 8;

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    profile, meals, waterLogs, dailySteps, stepsGoal, sportSessions,
    streak, calculateStreak, addWater, getTodayCalories, dailyMissions,
    addXP, showToast, checkIns,
  } = useStore();
  const [loading, setLoading] = useState(true);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showWeeklyReport, setShowWeeklyReport] = useState(false);

  useEffect(() => {
    calculateStreak();
    setTimeout(() => setLoading(false), 600);
    const lastCelebrated = sessionStorage.getItem('lastStreakCelebrated');
    if (streak > 0 && lastCelebrated !== String(streak)) {
      setTimeout(() => {
        celebrateStreak(streak);
        sessionStorage.setItem('lastStreakCelebrated', String(streak));
      }, 1200);
    }
  }, []);

  if (!profile || loading) return <DashboardSkeleton />;

  const today = new Date().toISOString().split('T')[0];
  const todayStats = getTodayCalories();
  const todaySport = sportSessions.filter(s => s.date === today);
  const burned = todaySport.reduce((s, ss) => s + ss.caloriesBurned, 0);
  const remaining = profile.dailyCalorieTarget + burned - todayStats.consumed;
  const waterToday = Math.max(0, waterLogs.find(w => w.date === today)?.amount || 0);
  const glassesConsumed = Math.min(GLASSES_TOTAL, Math.floor(waterToday / GLASS_ML));

  const handleGlassTap = (i: number) => {
    const target = i < glassesConsumed ? i * GLASS_ML : (i + 1) * GLASS_ML;
    const delta = target - waterToday;
    addWater(today, delta);
    if (delta > 0 && waterToday + delta >= WATER_GOAL) {
      setTimeout(() => celebrateWaterComplete(), 300);
    }
  };

  const todayMeals = meals.filter(m => m.date === today);
  const lastCheckIn = checkIns[0]?.date;
  const checkInDue = !lastCheckIn || (() => {
    const diff = (new Date(today).getTime() - new Date(lastCheckIn).getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 7;
  })();
  const isMonday = new Date().getDay() === 1;

  const macroData = [
    { label: 'Protéines', value: todayStats.protein, target: profile.macroTargets.protein_g, icon: <ProteinIcon />, gradient: 'linear-gradient(90deg,#2ea05a,#8fd44a)', bgTint: 'rgba(46,160,90,0.04)' },
    { label: 'Glucides', value: todayStats.carbs, target: profile.macroTargets.carbs_g, icon: <CarbsIcon />, gradient: 'linear-gradient(90deg,#f0a500,#fbbf24)', bgTint: 'rgba(240,165,0,0.04)' },
    { label: 'Lipides', value: todayStats.fat, target: profile.macroTargets.fat_g, icon: <FatIcon />, gradient: 'linear-gradient(90deg,#0b4f5c,#1a8a9e)', bgTint: 'rgba(11,79,92,0.04)' },
    { label: 'Fibres', value: todayStats.fiber, target: profile.macroTargets.fiber_g, icon: <FiberIcon />, gradient: 'linear-gradient(90deg,#8fd44a,#bbf451)', bgTint: 'rgba(143,212,74,0.05)' },
  ];

  const coachTip = generateCoachTip(profile, todayStats.consumed, waterToday, streak);

  const consumedPct = Math.min((todayStats.consumed / (profile.dailyCalorieTarget || 1)) * 100, 100);
  const waterPct = Math.round((waterToday / WATER_GOAL) * 100);

  const mealTypes = [
    { key: 'breakfast', label: 'Petit-déjeuner', sticker: <SunSticker /> },
    { key: 'lunch', label: 'Déjeuner', sticker: <PlateSticker /> },
    { key: 'dinner', label: 'Dîner', sticker: <MoonSticker /> },
    { key: 'snack', label: 'Collation', sticker: <AppleSticker /> },
  ] as const;

  // XP / level data
  const store = useStore.getState();
  const xp = (store as any).xp ?? 20;
  const level = (store as any).level ?? 1;
  const xpForNext = level * 300;
  const xpPct = Math.min((xp / xpForNext) * 100, 100);

  const dayName = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <AnimatedPage className="pb-4 max-w-[430px] mx-auto">
      {/* ═══════════════════ HEADER ═══════════════════ */}
      <div
        className="relative overflow-hidden"
        style={{ background: '#0d3d22', padding: '54px 24px 110px', borderRadius: '0 0 44px 44px' }}
      >
        {/* Blobs */}
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(143,212,74,0.14) 0%, transparent 65%)' }} />
        <div className="absolute bottom-5 -left-[60px] w-[220px] h-[220px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(26,107,63,0.45) 0%, transparent 70%)' }} />

        {/* Top bar */}
        <div className="flex justify-between items-center mb-[26px] relative z-[2]">
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="font-display text-[21px] font-extrabold text-white tracking-tight">NutReal</span>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            <button onClick={() => navigate('/profile')} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Greeting */}
        <div className="relative z-[2]">
          <div className="inline-block px-3 py-1 rounded-[20px] mb-2.5 text-[11px] font-display font-bold tracking-[2px] uppercase"
            style={{ background: 'rgba(143,212,74,0.2)', border: '1px solid rgba(143,212,74,0.3)', color: '#8fd44a' }}>
            {dayName}
          </div>
          <div className="font-display text-[34px] font-black text-white leading-[1.05] tracking-tight mb-1.5">
            Bonjour,<br />{profile.name}
          </div>
          <div className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Prêt à manger sainement ?</div>

          {/* XP strip */}
          <div className="flex items-center gap-3 mt-[22px]">
            <span className="font-display text-[11px] font-extrabold px-3.5 py-[5px] rounded-[20px] whitespace-nowrap"
              style={{ background: '#8fd44a', color: '#0d3d22' }}>
              Niv. {level}
            </span>
            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.12)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: '#8fd44a' }}
                initial={{ width: 0 }}
                animate={{ width: `${xpPct}%` }}
                transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1], delay: 0.6 }}
              />
            </div>
            <span className="text-xs whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {xp} / {xpForNext} XP
            </span>
          </div>
        </div>

      </div>

      {/* ═══════════════════ FLOAT CALORIE CARD ═══════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
        className="bg-white relative z-10 mx-[18px]"
        style={{ marginTop: '-52px', borderRadius: '28px', padding: '24px', boxShadow: '0 16px 50px rgba(13,61,34,0.16), 0 2px 10px rgba(13,61,34,0.06)' }}
      >
        <div className="font-display text-[10px] font-bold tracking-[2.5px] uppercase text-text-muted mb-[18px]">
          Bilan du jour
        </div>
        <div className="grid grid-cols-3 text-center">
          {[
            { value: remaining, label: 'Restantes', active: true },
            { value: todayStats.consumed, label: 'Consommées', active: false },
            { value: burned, label: 'Brûlées', active: false },
          ].map((col, i) => (
            <div key={col.label} className="relative">
              {i < 2 && (
                <div className="absolute right-0 top-[8%] bottom-[8%] w-px" style={{ background: '#e2ece6' }} />
              )}
              <div className={`font-display text-[32px] font-black tracking-tight leading-none mb-[5px] ${col.active ? 'text-leaf' : 'text-surface-300'}`}>
                {Math.round(col.value)}
              </div>
              <div className="text-[11px] font-medium text-text-muted">{col.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-[18px] h-[3px] rounded-full overflow-hidden" style={{ background: '#eaf3ec' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: '#2ea05a' }}
            initial={{ width: 0 }}
            animate={{ width: `${consumedPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* ═══════════════════ COACH ═══════════════════ */}
      <ScrollReveal delay={0.15}>
        <div className="px-[18px] pt-[26px]">
          <div className="relative overflow-visible min-h-[72px]"
            style={{ background: 'linear-gradient(135deg,#fffbf0,#fff6da)', border: '1px solid #f5e498', borderRadius: '20px', padding: '18px 20px 18px 70px' }}>
            <div className="absolute -left-3.5 -top-3.5" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}>
              <StarSticker />
            </div>
            <div className="font-display text-[10px] font-bold tracking-[1.5px] uppercase mb-1" style={{ color: '#f0a500' }}>
              Coach NutReal
            </div>
            <div className="text-sm font-medium leading-relaxed" style={{ color: '#3d2d00' }}>
              {coachTip.message}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* ═══════════════════ REPAS DU JOUR ═══════════════════ */}
      <ScrollReveal delay={0.22}>
        <div className="px-[18px] pt-[26px]">
          <div className="flex justify-between items-baseline mb-3.5">
            <h2 className="font-display text-lg font-extrabold tracking-tight text-text-primary">Repas du jour</h2>
            <button onClick={() => navigate('/journal')} className="text-xs font-semibold text-leaf">Journal →</button>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {mealTypes.map(({ key, label, sticker }) => {
              const meal = todayMeals.find(m => m.mealType === key);
              return (
                <motion.div
                  key={key}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/log')}
                  className="bg-white cursor-pointer relative overflow-visible min-h-[130px]"
                  style={{ borderRadius: '20px', padding: '16px', border: '1px solid #e2ece6', transition: 'transform 0.18s, box-shadow 0.18s' }}
                >
                  <div className="absolute -top-5 -right-2 z-[2]" style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.18))' }}>
                    {sticker}
                  </div>
                  <div className="font-display text-[13px] font-bold mt-[30px] mb-[3px]">{label}</div>
                  {meal ? (
                    <div className="text-sm font-bold text-leaf">{meal.totalCalories} <span className="text-[10px] font-normal text-text-muted">kcal</span></div>
                  ) : (
                    <>
                      <div className="text-[11px] text-text-muted">Non enregistré</div>
                      <div className="inline-flex items-center gap-1 mt-2.5 rounded-[20px] px-2.5 py-[5px] text-[11px] font-semibold"
                        style={{ background: '#f5f0e8', color: '#1a6b3f' }}>
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 1v10M1 6h10" /></svg>
                        Ajouter
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>

      {/* ═══════════════════ MACRONUTRIMENTS ═══════════════════ */}
      <ScrollReveal delay={0.28}>
        <div className="px-[18px] pt-[26px]">
          <h2 className="font-display text-lg font-extrabold tracking-tight text-text-primary mb-3.5">Macronutriments</h2>
          <div className="bg-white overflow-hidden" style={{ borderRadius: '20px', border: '1px solid #e2ece6' }}>
            {macroData.map((m, i) => {
              const pct = m.target > 0 ? Math.min(Math.round((m.value / m.target) * 100), 100) : 0;
              return (
                <div
                  key={m.label}
                  className="flex flex-col gap-2 px-4 py-3.5"
                  style={{
                    background: `linear-gradient(90deg, ${m.bgTint} 0%, transparent 100%)`,
                    borderBottom: i < macroData.length - 1 ? '1px solid #e2ece6' : 'none',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    {m.icon}
                    <div>
                      <div className="font-display text-[13px] font-bold text-text-primary leading-tight">{m.label}</div>
                      <div className="text-[11px] font-medium text-text-muted">{Math.round(m.value)} / {m.target}g</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex-1 h-2 rounded-lg overflow-hidden" style={{ background: '#edf4ef' }}>
                      <motion.div
                        className="h-full rounded-lg"
                        style={{ background: m.gradient }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 0.3 + i * 0.15 }}
                      />
                    </div>
                    <span className="font-display text-xs font-bold text-text-muted min-w-[28px] text-right">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>

      {/* ═══════════════════ HYDRATION ═══════════════════ */}
      <ScrollReveal delay={0.28}>
        <div className="px-[18px] pt-[26px]">
          <h2 className="font-display text-lg font-extrabold tracking-tight text-text-primary mb-3.5">Hydratation</h2>
          <div className="relative overflow-hidden" style={{ background: 'linear-gradient(150deg, #0b4f5c 0%, #062e37 100%)', borderRadius: '24px', padding: '22px' }}>
            {/* Glow */}
            <div className="absolute -top-[60px] -right-[60px] w-[200px] h-[200px] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(26,143,160,0.4) 0%, transparent 60%)' }} />

            <div className="flex justify-between items-start mb-5 relative">
              <div>
                <div className="font-display text-[10px] font-bold tracking-[2px] uppercase mb-[5px]" style={{ color: 'rgba(255,255,255,0.38)' }}>
                  Objectif eau
                </div>
                <div className="font-display text-[28px] font-black text-white">
                  {Math.min(waterToday, WATER_GOAL)} ml
                </div>
                <div className="text-xs mt-[3px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {glassesConsumed} / {GLASSES_TOTAL} verres
                </div>
              </div>
              <div className="font-display text-[42px] font-black tracking-tight" style={{ color: '#7fffd4' }}>
                {waterPct}%
              </div>
            </div>

            <div className="flex gap-[9px] flex-wrap">
              {Array.from({ length: GLASSES_TOTAL }).map((_, i) => (
                <V7Glass
                  key={i}
                  index={i}
                  filled={i < glassesConsumed}
                  onClick={() => handleGlassTap(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* ═══════════════════ ACTIVITY ═══════════════════ */}
      <ScrollReveal delay={0.34}>
        <div className="px-[18px] pt-[26px]">
          <h2 className="font-display text-lg font-extrabold tracking-tight text-text-primary mb-3.5">Activité</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Steps */}
            <div className="bg-white relative overflow-visible min-h-[110px]"
              style={{ borderRadius: '20px', padding: '18px', border: '1px solid #e2ece6' }}>
              <div className="absolute -top-[22px] -right-2.5 z-[2]" style={{ filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.18))' }}>
                <SneakerSticker />
              </div>
              <div className="font-display text-[11px] font-bold tracking-[0.8px] uppercase text-text-muted mt-7 mb-1">Pas</div>
              <div className="font-display text-2xl font-black tracking-tight text-text-primary">{dailySteps.toLocaleString()}</div>
              <div className="text-[11px] text-text-muted mt-0.5">/ {stepsGoal.toLocaleString()}</div>
            </div>

            {/* Sport */}
            <motion.div
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/sport')}
              className="bg-white relative overflow-visible min-h-[110px] cursor-pointer"
              style={{ borderRadius: '20px', padding: '18px', border: '1px solid #e2ece6' }}
            >
              <div className="absolute -top-[22px] -right-2.5 z-[2]" style={{ filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.18))' }}>
                <WeightSticker />
              </div>
              <div className="font-display text-[11px] font-bold tracking-[0.8px] uppercase text-text-muted mt-7 mb-1">Sport</div>
              <div className="font-display text-2xl font-black tracking-tight text-text-primary">{todaySport.length} séance{todaySport.length !== 1 ? 's' : ''}</div>
              <div className="text-[11px] text-text-muted mt-0.5">{burned} kcal brûlées</div>
            </motion.div>
          </div>
        </div>
      </ScrollReveal>

      {/* ═══════════════════ MISSIONS ═══════════════════ */}
      {dailyMissions.length > 0 && dailyMissions.some(m => !m.isCompleted) && (
        <ScrollReveal delay={0.36}>
          <div className="px-[18px] pt-[26px]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-leaf" />
                <h2 className="font-display text-lg font-extrabold tracking-tight text-text-primary">Missions</h2>
              </div>
              <span className="text-xs text-text-muted">
                {dailyMissions.filter(m => m.isCompleted).length}/{dailyMissions.length}
              </span>
            </div>
            <div className="space-y-2">
              {dailyMissions.filter(m => !m.isCompleted).slice(0, 3).map((m, i) => (
                <MissionCard key={m.id} mission={m} index={i} />
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* ═══════════════════ PLAN DE REPAS ═══════════════════ */}
      <ScrollReveal delay={0.34}>
        <div className="px-[18px] pt-[26px]">
          <div className="flex justify-between items-baseline mb-3.5">
            <h2 className="font-display text-lg font-extrabold tracking-tight text-text-primary">Plan de repas</h2>
            <button onClick={() => navigate('/meal-plan')} className="text-xs font-semibold text-leaf">Voir tout →</button>
          </div>
          <div className="bg-white overflow-hidden" style={{ borderRadius: '20px', border: '1px solid #e2ece6' }}>
            {[
              { name: 'Flocons d\'avoine aux baies', meta: '703 kcal · 10 min', img: 'https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg?auto=compress&cs=tinysrgb&w=200' },
              { name: 'Poisson blanc citronné', meta: '600 kcal · 20 min', img: 'https://images.pexels.com/photos/1640769/pexels-photo-1640769.jpeg?auto=compress&cs=tinysrgb&w=200' },
              { name: 'Muffins aux œufs du Sud-Ouest', meta: '655 kcal · 25 min', img: 'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=200' },
              { name: 'Tomates cerises & mozzarella', meta: '124 kcal · 3 min', img: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200' },
              { name: 'Morceaux d\'ananas frais', meta: '150 kcal · 2 min', img: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=200' },
            ].map((item, i, arr) => (
              <motion.div
                key={item.name}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/meal-plan')}
                className="flex items-center gap-3.5 px-4 py-3 cursor-pointer hover:bg-[#fafdf9] transition-colors"
                style={{ borderBottom: i < arr.length - 1 ? '1px solid #e2ece6' : 'none' }}
              >
                <div className="w-16 h-16 rounded-full flex-shrink-0 overflow-hidden"
                  style={{ border: '2px solid #e2ece6' }}>
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1">
                  <div className="font-display text-sm font-bold text-text-primary mb-[3px]">{item.name}</div>
                  <div className="text-xs font-medium text-text-muted">{item.meta}</div>
                </div>
                <ChevronRight size={16} className="text-surface-300 flex-shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* ═══════════════════ CHECK-IN & WEEKLY REPORT ═══════════════════ */}
      {(checkInDue || isMonday) && (
        <ScrollReveal delay={0.38}>
          <div className="flex gap-2 px-[18px] pt-[26px]">
            {checkInDue && (
              <motion.button whileTap={{ scale: 0.96 }} onClick={() => setShowCheckIn(true)}
                className="flex-1 rounded-2xl p-3 flex items-center gap-3 shadow-float"
                style={{ background: 'linear-gradient(135deg, #1a6b3f, #2ea05a)' }}>
                <ClipboardCheck size={18} className="text-white" />
                <div className="text-left">
                  <p className="text-xs font-bold text-white">Check-in</p>
                  <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Comment allez-vous ?</p>
                </div>
              </motion.button>
            )}
            {isMonday && (
              <motion.button whileTap={{ scale: 0.96 }} onClick={() => setShowWeeklyReport(true)}
                className="flex-1 rounded-2xl p-3 flex items-center gap-3 shadow-float"
                style={{ background: 'linear-gradient(135deg, #0d3d22, #1a6b3f)' }}>
                <BarChart3 size={18} className="text-white" />
                <div className="text-left">
                  <p className="text-xs font-bold text-white">Recap hebdo</p>
                  <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Voir la semaine</p>
                </div>
              </motion.button>
            )}
          </div>
        </ScrollReveal>
      )}

      {/* Spacer for bottom nav */}
      <div className="h-6" />

      <LevelUpModal />
      <CheckInModal open={showCheckIn} onClose={() => setShowCheckIn(false)} />
      <WeeklyReport open={showWeeklyReport} onClose={() => setShowWeeklyReport(false)} />
    </AnimatedPage>
  );
}
