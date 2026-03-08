import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import ScrollReveal from '../components/ScrollReveal';
import SuccessCheckmark from '../components/SuccessCheckmark';
import { Dumbbell, Play, Clock, Flame, Plus, Trash2, Trophy } from 'lucide-react';

const EXERCISES = [
  { name: 'Course à pied', emoji: '🏃', calPerMin: 10, type: 'cardio' },
  { name: 'Marche rapide', emoji: '🚶', calPerMin: 5, type: 'cardio' },
  { name: 'Natation', emoji: '🏊', calPerMin: 9, type: 'cardio' },
  { name: 'Vélo', emoji: '🚴', calPerMin: 8, type: 'cardio' },
  { name: 'Corde à sauter', emoji: '⏭️', calPerMin: 12, type: 'cardio' },
  { name: 'Musculation', emoji: '🏋️', calPerMin: 7, type: 'strength' },
  { name: 'Pompes', emoji: '💪', calPerMin: 8, type: 'strength' },
  { name: 'Squats', emoji: '🦵', calPerMin: 7, type: 'strength' },
  { name: 'Abdominaux', emoji: '🔥', calPerMin: 6, type: 'strength' },
  { name: 'Yoga', emoji: '🧘', calPerMin: 3, type: 'flexibility' },
  { name: 'Stretching', emoji: '🤸', calPerMin: 2, type: 'flexibility' },
  { name: 'Danse', emoji: '💃', calPerMin: 7, type: 'cardio' },
];

export default function SportPage() {
  const { sportSessions, addSportSession, removeSportSession, showToast } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<typeof EXERCISES[0] | null>(null);
  const [duration, setDuration] = useState(30);
  const [saved, setSaved] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todaySessions = sportSessions.filter(s => s.date === today);
  const totalBurned = todaySessions.reduce((s, ss) => s + ss.caloriesBurned, 0);

  const addSession = () => {
    if (!selected) return;
    const cal = Math.round(selected.calPerMin * duration);
    addSportSession({
      id: Date.now().toString(), date: today, type: selected.type, name: selected.name,
      duration_min: duration, caloriesBurned: cal, createdAt: new Date().toISOString(),
    });
    setSaved(true); showToast(`${selected.name} ajouté ! 🔥 ${cal} kcal brûlées`);
    setTimeout(() => { setSaved(false); setShowAdd(false); setSelected(null); setDuration(30); }, 1500);
  };

  return (
    <AnimatedPage className="px-4 pt-12 pb-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary font-display">Sport</h1>
        <AnimatedButton onClick={() => setShowAdd(true)} className="px-4 py-2 text-sm flex items-center gap-2">
          <Plus size={16} /> Ajouter
        </AnimatedButton>
      </div>

      {/* Today stats */}
      <ScrollReveal>
        <AnimatedCard className="p-4 mb-4" index={0}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary">Aujourd'hui</p>
              <p className="text-2xl font-bold text-text-primary font-display">{totalBurned} kcal</p>
              <p className="text-xs text-text-muted">{todaySessions.length} séance(s)</p>
            </div>
            <div className="w-14 h-14 bg-success-50 rounded-2xl flex items-center justify-center">
              <Flame size={28} className="text-success-400" />
            </div>
          </div>
        </AnimatedCard>
      </ScrollReveal>

      {/* Today sessions */}
      <ScrollReveal delay={0.1}>
        <h3 className="text-sm font-semibold text-text-primary mb-3">Séances du jour</h3>
        {todaySessions.length === 0 ? (
          <AnimatedCard className="p-6 text-center" index={1}>
            <Dumbbell size={32} className="text-text-muted mx-auto mb-2" />
            <p className="text-sm text-text-secondary">Aucune séance aujourd'hui</p>
          </AnimatedCard>
        ) : (
          <div className="space-y-2">
            {todaySessions.map((s, i) => (
              <AnimatedCard key={s.id} className="p-3 flex items-center gap-3" index={i + 1}>
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-lg">
                  {EXERCISES.find(e => e.name === s.name)?.emoji || '🏋️'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">{s.name}</p>
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span className="flex items-center gap-1"><Clock size={12} /> {s.duration_min} min</span>
                    <span className="flex items-center gap-1"><Flame size={12} /> {s.caloriesBurned} kcal</span>
                  </div>
                </div>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => removeSportSession(s.id)}
                  className="w-8 h-8 bg-error-50 rounded-lg flex items-center justify-center">
                  <Trash2 size={14} className="text-error-300" />
                </motion.button>
              </AnimatedCard>
            ))}
          </div>
        )}
      </ScrollReveal>

      {/* Recent history */}
      <ScrollReveal delay={0.2}>
        <h3 className="text-sm font-semibold text-text-primary mb-3 mt-6">Historique récent</h3>
        {sportSessions.filter(s => s.date !== today).slice(0, 5).length === 0 ? (
          <p className="text-sm text-text-muted text-center py-4">Pas encore d'historique</p>
        ) : (
          <div className="space-y-2">
            {sportSessions.filter(s => s.date !== today).slice(0, 5).map((s, i) => (
              <AnimatedCard key={s.id} className="p-3 flex items-center gap-3" index={i}>
                <div className="w-8 h-8 bg-surface-200 rounded-lg flex items-center justify-center text-sm">
                  {EXERCISES.find(e => e.name === s.name)?.emoji || '🏋️'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">{s.name}</p>
                  <p className="text-xs text-text-muted">{new Date(s.date).toLocaleDateString('fr-FR')} · {s.duration_min} min · {s.caloriesBurned} kcal</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        )}
      </ScrollReveal>

      {/* Add modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={() => setShowAdd(false)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white rounded-t-3xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              
              {saved ? (
                <div className="flex flex-col items-center py-8">
                  <SuccessCheckmark size={64} />
                  <p className="text-lg font-semibold text-text-primary mt-4">Séance ajoutée !</p>
                </div>
              ) : (
                <>
                  <div className="w-10 h-1 bg-surface-300 rounded-full mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-text-primary mb-4">Nouvelle séance</h3>
                  
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {EXERCISES.map(ex => (
                      <motion.button key={ex.name} whileTap={{ scale: 0.95 }} onClick={() => setSelected(ex)}
                        className={`p-3 rounded-xl text-center transition-all ${selected?.name === ex.name ? 'bg-primary-500 text-white shadow-float' : 'bg-surface-100 text-text-primary'}`}>
                        <span className="text-xl block mb-1">{ex.emoji}</span>
                        <span className="text-[10px] font-medium leading-tight block">{ex.name}</span>
                      </motion.button>
                    ))}
                  </div>

                  {selected && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <label className="text-sm font-medium text-text-secondary mb-2 block">Durée : {duration} min</label>
                      <input type="range" min={5} max={120} step={5} value={duration} onChange={e => setDuration(+e.target.value)}
                        className="w-full mb-2 accent-primary-500" />
                      <div className="flex justify-between text-xs text-text-muted mb-4"><span>5 min</span><span>120 min</span></div>
                      <div className="bg-primary-50 rounded-xl p-3 mb-4 text-center">
                        <p className="text-xs text-text-secondary">Calories estimées</p>
                        <p className="text-2xl font-bold text-primary-500">{Math.round(selected.calPerMin * duration)} kcal</p>
                      </div>
                      <AnimatedButton onClick={addSession} className="w-full py-3 text-sm flex items-center justify-center gap-2">
                        <Trophy size={18} /> Enregistrer la séance
                      </AnimatedButton>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}
