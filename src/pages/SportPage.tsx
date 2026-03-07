import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dumbbell, Plus, Flame, Clock, Trash2, X, Check,
  Activity, Bike, Footprints, Waves, Zap, Heart
} from 'lucide-react';
import { useStore } from '../store/useStore';

const sportTypes = [
  { id: 'running', name: 'Course à pied', icon: Footprints, emoji: '🏃', calPerMin: 10 },
  { id: 'cycling', name: 'Vélo', icon: Bike, emoji: '🚴', calPerMin: 8 },
  { id: 'swimming', name: 'Natation', icon: Waves, emoji: '🏊', calPerMin: 9 },
  { id: 'gym', name: 'Musculation', icon: Dumbbell, emoji: '🏋️', calPerMin: 7 },
  { id: 'hiit', name: 'HIIT', icon: Zap, emoji: '⚡', calPerMin: 12 },
  { id: 'yoga', name: 'Yoga', icon: Heart, emoji: '🧘', calPerMin: 4 },
  { id: 'walking', name: 'Marche', icon: Footprints, emoji: '🚶', calPerMin: 5 },
  { id: 'cardio', name: 'Cardio', icon: Activity, emoji: '❤️‍🔥', calPerMin: 9 },
  { id: 'dance', name: 'Danse / Zouk', icon: Activity, emoji: '💃', calPerMin: 7 },
  { id: 'other', name: 'Autre', icon: Activity, emoji: '🎯', calPerMin: 6 },
];

export default function SportPage() {
  const { sportSessions, addSportSession, removeSportSession, showToast } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState(sportTypes[0]);
  const [duration, setDuration] = useState('30');
  const [notes, setNotes] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const todaySessions = sportSessions.filter(s => s.date === today);
  const todayCaloriesBurned = todaySessions.reduce((sum, s) => sum + s.caloriesBurned, 0);
  const todayDuration = todaySessions.reduce((sum, s) => sum + s.duration_min, 0);

  const handleAdd = () => {
    const dur = parseInt(duration) || 30;
    const calories = Math.round(dur * selectedType.calPerMin);

    addSportSession({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      date: today,
      type: selectedType.id,
      name: selectedType.name,
      duration_min: dur,
      caloriesBurned: calories,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    });

    showToast(`🏋️ ${selectedType.name} — ${calories} kcal brûlées`);
    setShowForm(false);
    setDuration('30');
    setNotes('');
  };

  const handleDelete = (id: string) => {
    removeSportSession(id);
    showToast('Session supprimée');
  };

  return (
    <div className="px-4 pt-12 pb-24 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 font-display">Sport</h1>
          <p className="text-xs text-gray-400">Suivez vos activités physiques</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-white shadow-float hover:bg-primary-600 active:scale-90 transition-all"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Today Summary */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-5 mb-6 text-white"
      >
        <p className="text-xs font-medium text-white/70 mb-3">Aujourd'hui</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <Dumbbell size={20} className="mx-auto mb-1 text-white/80" />
            <p className="text-2xl font-bold">{todaySessions.length}</p>
            <p className="text-[10px] text-white/60">séances</p>
          </div>
          <div className="text-center">
            <Clock size={20} className="mx-auto mb-1 text-white/80" />
            <p className="text-2xl font-bold">{todayDuration}</p>
            <p className="text-[10px] text-white/60">minutes</p>
          </div>
          <div className="text-center">
            <Flame size={20} className="mx-auto mb-1 text-white/80" />
            <p className="text-2xl font-bold">{todayCaloriesBurned}</p>
            <p className="text-[10px] text-white/60">kcal brûlées</p>
          </div>
        </div>
      </motion.div>

      {/* Sessions List */}
      {todaySessions.length > 0 ? (
        <div className="space-y-3 mb-6">
          <h2 className="text-sm font-semibold text-gray-700">Séances du jour</h2>
          {todaySessions.map((session, i) => {
            const type = sportTypes.find(t => t.id === session.type) || sportTypes[sportTypes.length - 1];
            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-3"
              >
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-xl">
                  {type.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">{session.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={10} /> {session.duration_min} min
                    </span>
                    <span className="text-xs text-orange-500 font-semibold flex items-center gap-1">
                      <Flame size={10} /> {session.caloriesBurned} kcal
                    </span>
                  </div>
                  {session.notes && <p className="text-[10px] text-gray-400 mt-1 truncate">{session.notes}</p>}
                </div>
                <button
                  onClick={() => handleDelete(session.id)}
                  className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 active:scale-90 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Dumbbell size={28} className="text-gray-300" />
          </div>
          <p className="text-gray-400 text-sm mb-1">Aucune séance aujourd'hui</p>
          <p className="text-gray-300 text-xs">Appuyez sur + pour ajouter une activité</p>
        </div>
      )}

      {/* Quick Add Buttons */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Ajout rapide</h2>
        <div className="grid grid-cols-2 gap-2">
          {sportTypes.slice(0, 6).map(type => (
            <button
              key={type.id}
              onClick={() => { setSelectedType(type); setShowForm(true); }}
              className="bg-white rounded-xl p-3 shadow-card flex items-center gap-2.5 hover:bg-surface-50 active:scale-[0.98] transition-all text-left"
            >
              <span className="text-lg">{type.emoji}</span>
              <div>
                <p className="text-xs font-semibold text-gray-700">{type.name}</p>
                <p className="text-[10px] text-gray-400">~{type.calPerMin * 30} kcal/30min</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Add Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl w-full max-w-lg p-6 pb-10"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-gray-800 font-display">Nouvelle séance</h3>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <X size={16} className="text-gray-500" />
                </button>
              </div>

              {/* Sport Type Grid */}
              <p className="text-xs font-medium text-gray-500 mb-2">Type d'activité</p>
              <div className="grid grid-cols-5 gap-2 mb-5">
                {sportTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type)}
                    className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                      selectedType.id === type.id ? 'bg-primary-50 ring-2 ring-primary-500' : 'bg-surface-50 hover:bg-surface-100'
                    }`}
                  >
                    <span className="text-lg mb-0.5">{type.emoji}</span>
                    <span className="text-[9px] text-gray-600 font-medium text-center leading-tight">{type.name}</span>
                  </button>
                ))}
              </div>

              {/* Duration */}
              <p className="text-xs font-medium text-gray-500 mb-2">Durée (minutes)</p>
              <div className="flex gap-2 mb-4">
                {['15', '30', '45', '60', '90'].map(d => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      duration === d ? 'bg-primary-500 text-white' : 'bg-surface-50 text-gray-600 hover:bg-surface-100'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Durée personnalisée"
                className="w-full bg-surface-50 rounded-xl px-4 py-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              />

              {/* Estimated Calories */}
              <div className="bg-orange-50 rounded-xl p-3 mb-4 flex items-center gap-3">
                <Flame size={20} className="text-orange-500" />
                <div>
                  <p className="text-xs text-orange-600 font-medium">Calories estimées</p>
                  <p className="text-lg font-bold text-orange-700">
                    {Math.round((parseInt(duration) || 0) * selectedType.calPerMin)} kcal
                  </p>
                </div>
              </div>

              {/* Notes */}
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes (optionnel)"
                className="w-full bg-surface-50 rounded-xl px-4 py-3 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              />

              <button
                onClick={handleAdd}
                className="w-full bg-primary-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-600 active:scale-[0.98] transition-all shadow-float"
              >
                <Check size={20} />
                Enregistrer la séance
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
