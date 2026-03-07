import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, TrendingDown, Flame, Target, LogOut, ChevronRight,
  Scale, Calendar, Award, Settings, Crown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useStore } from '../store/useStore';

export default function Profile() {
  const { profile, weightLogs, meals, streak, setAuth, setOnboardingComplete, addWeightLog } = useStore();
  const [timeRange, setTimeRange] = useState<'30' | '90' | '365'>('30');
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [newWeight, setNewWeight] = useState('');

  if (!profile) return null;

  // Weight data
  const sortedWeightLogs = [...weightLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latestWeight = sortedWeightLogs.length > 0 ? sortedWeightLogs[sortedWeightLogs.length - 1].weight : profile.weightCurrentKg;
  const weightLost = profile.weightCurrentKg - latestWeight;
  const weightToGo = latestWeight - profile.weightGoalKg;

  // Chart data
  const weightChartData = sortedWeightLogs.map(log => ({
    date: new Date(log.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
    poids: log.weight,
  }));

  // Weekly calorie averages
  const getWeeklyCalories = () => {
    const weeks: Record<string, number[]> = {};
    meals.forEach(meal => {
      const date = new Date(meal.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const key = weekStart.toISOString().split('T')[0];
      if (!weeks[key]) weeks[key] = [];
      weeks[key].push(meal.totalCalories);
    });

    return Object.entries(weeks).map(([week, cals]) => ({
      semaine: new Date(week).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      moyenne: Math.round(cals.reduce((a, b) => a + b, 0) / 7),
    })).slice(-8);
  };

  const handleAddWeight = () => {
    if (newWeight) {
      const today = new Date().toISOString().split('T')[0];
      addWeightLog(today, parseFloat(newWeight));
      setNewWeight('');
      setShowWeightInput(false);
    }
  };

  const handleLogout = () => {
    setAuth(false, null);
    setOnboardingComplete(false);
  };

  return (
    <div className="px-4 pt-12 pb-24 max-w-lg mx-auto">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-6 mb-4 text-white"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-2xl font-bold">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold font-display">{profile.name}</h1>
            <p className="text-white/70 text-sm">
              {profile.sex === 'M' ? 'Homme' : 'Femme'} • {profile.heightCm} cm
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <Scale size={16} className="mx-auto mb-1 text-white/70" />
            <p className="text-lg font-bold">{latestWeight}</p>
            <p className="text-[10px] text-white/60">kg actuel</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <Target size={16} className="mx-auto mb-1 text-white/70" />
            <p className="text-lg font-bold">{profile.weightGoalKg}</p>
            <p className="text-[10px] text-white/60">kg objectif</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <Flame size={16} className="mx-auto mb-1 text-white/70" />
            <p className="text-lg font-bold">{streak}</p>
            <p className="text-[10px] text-white/60">jours streak</p>
          </div>
        </div>
      </motion.div>

      {/* Motivation Message */}
      {weightLost > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-primary-50 rounded-2xl p-4 mb-4 flex items-center gap-3"
        >
          <Award size={24} className="text-primary-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-primary-700">
              Vous avez perdu {weightLost.toFixed(1)} kg ! 🎉
            </p>
            <p className="text-xs text-primary-500">
              {weightToGo > 0
                ? `Plus que ${weightToGo.toFixed(1)} kg pour atteindre votre objectif`
                : 'Objectif atteint ! Félicitations !'}
            </p>
          </div>
        </motion.div>
      )}

      {/* Weight Log */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-2xl p-4 shadow-card mb-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-800 text-sm">Suivi du poids</h2>
          <button
            onClick={() => setShowWeightInput(!showWeightInput)}
            className="text-xs text-primary-500 font-semibold"
          >
            + Ajouter
          </button>
        </div>

        {showWeightInput && (
          <div className="flex gap-2 mb-3">
            <input
              type="number"
              step="0.1"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder="Poids (kg)"
              className="flex-1 px-3 py-2 bg-surface-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
            <button
              onClick={handleAddWeight}
              className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              OK
            </button>
          </div>
        )}

        {/* Time Range Toggle */}
        <div className="flex bg-surface-100 rounded-lg p-0.5 mb-3">
          {(['30', '90', '365'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                timeRange === range ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400'
              }`}
            >
              {range === '30' ? '30j' : range === '90' ? '90j' : '1an'}
            </button>
          ))}
        </div>

        {weightChartData.length > 1 ? (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={weightChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#ccc" />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} stroke="#ccc" />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Line
                type="monotone"
                dataKey="poids"
                stroke="#4CAF50"
                strokeWidth={2}
                dot={{ fill: '#4CAF50', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-32 flex items-center justify-center text-gray-300 text-sm">
            Ajoutez des pesées pour voir votre courbe
          </div>
        )}
      </motion.div>

      {/* Weekly Calories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-4 shadow-card mb-4"
      >
        <h2 className="font-bold text-gray-800 text-sm mb-3">Calories moyennes / semaine</h2>
        {getWeeklyCalories().length > 0 ? (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={getWeeklyCalories()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="semaine" tick={{ fontSize: 10 }} stroke="#ccc" />
              <YAxis tick={{ fontSize: 10 }} stroke="#ccc" />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="moyenne" fill="#FF9800" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-32 flex items-center justify-center text-gray-300 text-sm">
            Enregistrez des repas pour voir vos statistiques
          </div>
        )}
      </motion.div>

      {/* Premium Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-4 mb-4 text-white"
      >
        <div className="flex items-center gap-3">
          <Crown size={24} />
          <div className="flex-1">
            <h3 className="font-bold text-sm">NutriLens Premium</h3>
            <p className="text-xs text-white/80">Scanner illimité, plan repas IA, export données</p>
          </div>
          <span className="text-sm font-bold">5,99€/mois</span>
        </div>
      </motion.div>

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-card overflow-hidden mb-4"
      >
        {[
          { icon: User, label: 'Modifier le profil', action: () => {} },
          { icon: Target, label: 'Modifier les objectifs', action: () => {} },
          { icon: Settings, label: 'Paramètres', action: () => {} },
        ].map((item, i) => (
          <button
            key={i}
            onClick={item.action}
            className="w-full flex items-center gap-3 p-4 hover:bg-surface-50 transition-colors border-b border-gray-50 last:border-0"
          >
            <item.icon size={18} className="text-gray-400" />
            <span className="flex-1 text-sm font-medium text-gray-700 text-left">{item.label}</span>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        ))}
      </motion.div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-medium text-sm hover:bg-red-50 rounded-2xl transition-colors"
      >
        <LogOut size={18} />
        Se déconnecter
      </button>
    </div>
  );
}
