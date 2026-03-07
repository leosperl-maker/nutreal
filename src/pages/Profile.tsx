import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Flame, Target, LogOut, ChevronRight,
  Scale, Award, Settings, Crown, Check, ArrowLeft, MapPin, Wallet, ShoppingCart, Apple
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useStore } from '../store/useStore';
import {
  calculateTDEE, calculateMacros, calculateAge, calculateNutritionPlan,
  LOCATION_OPTIONS, FOOD_PREFERENCE_OPTIONS, GROCERY_FREQUENCY_OPTIONS, getCurrencyForLocation,
} from '../lib/nutrition';

type SettingsPage = null | 'editProfile' | 'editGoals' | 'editPreferences' | 'editLocation' | 'editFoodPrefs' | 'editGrocery';

const activityLevels = [
  { value: 'sedentary', label: 'Sédentaire', desc: 'Peu ou pas d\'exercice' },
  { value: 'light', label: 'Légèrement actif', desc: '1-3 jours/semaine' },
  { value: 'moderate', label: 'Modérément actif', desc: '3-5 jours/semaine' },
  { value: 'active', label: 'Actif', desc: '6-7 jours/semaine' },
  { value: 'very_active', label: 'Très actif', desc: 'Exercice intense quotidien' },
];

const dietOptions = [
  'Végétarien', 'Végan', 'Sans gluten', 'Sans lactose',
  'Halal', 'Casher', 'Keto', 'Paléo', 'Sans porc',
  'Pescétarien', 'Faible en sel', 'Sans sucre ajouté',
];

export default function Profile() {
  const { profile, weightLogs, meals, streak, setAuth, setOnboardingComplete, addWeightLog, updateProfile, showToast } = useStore();
  const [timeRange, setTimeRange] = useState<'30' | '90' | '365'>('30');
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [settingsPage, setSettingsPage] = useState<SettingsPage>(null);

  // Edit states
  const [editName, setEditName] = useState('');
  const [editHeight, setEditHeight] = useState('');
  const [editWeight, setEditWeight] = useState('');
  const [editBirthDate, setEditBirthDate] = useState('');
  const [editGoalWeight, setEditGoalWeight] = useState('');
  const [editSex, setEditSex] = useState<'M' | 'F'>('M');
  const [editActivity, setEditActivity] = useState('');
  const [editPreferences, setEditPreferences] = useState<string[]>([]);
  const [editLocation, setEditLocation] = useState('');
  const [editFoodPrefs, setEditFoodPrefs] = useState<string[]>([]);
  const [editGroceryBudget, setEditGroceryBudget] = useState('');
  const [editGroceryFrequency, setEditGroceryFrequency] = useState('');

  if (!profile) return null;

  const sortedWeightLogs = [...weightLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latestWeight = sortedWeightLogs.length > 0 ? sortedWeightLogs[sortedWeightLogs.length - 1].weight : profile.weightCurrentKg;
  const weightLost = profile.weightCurrentKg - latestWeight;
  const weightToGo = latestWeight - profile.weightGoalKg;
  const age = calculateAge(profile.birthDate);

  const weightChartData = sortedWeightLogs.map(log => ({
    date: new Date(log.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
    poids: log.weight,
  }));

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
      showToast('Poids enregistré ✓');
    }
  };

  const handleLogout = () => {
    setAuth(false, null);
    setOnboardingComplete(false);
  };

  const openEditProfile = () => {
    setEditName(profile.name);
    setEditHeight(profile.heightCm.toString());
    setEditWeight(latestWeight.toString());
    setEditSex(profile.sex);
    setEditBirthDate(profile.birthDate || '');
    setSettingsPage('editProfile');
  };

  const openEditGoals = () => {
    setEditGoalWeight(profile.weightGoalKg.toString());
    setEditActivity(profile.activityLevel);
    setSettingsPage('editGoals');
  };

  const openEditPreferences = () => {
    setEditPreferences([...profile.dietPreferences]);
    setSettingsPage('editPreferences');
  };

  const openEditLocation = () => {
    setEditLocation(profile.location || '');
    setSettingsPage('editLocation');
  };

  const openEditFoodPrefs = () => {
    setEditFoodPrefs([...(profile.foodPreferences || [])]);
    setSettingsPage('editFoodPrefs');
  };

  const openEditGrocery = () => {
    setEditGroceryBudget((profile.groceryBudget || 0).toString());
    setEditGroceryFrequency(profile.groceryFrequency || 'weekly');
    setSettingsPage('editGrocery');
  };

  const saveProfile = () => {
    const height = parseInt(editHeight) || profile.heightCm;
    const weight = parseFloat(editWeight) || latestWeight;
    const birthDate = editBirthDate || profile.birthDate;
    updateProfile({
      name: editName.trim() || profile.name,
      heightCm: height,
      weightCurrentKg: weight,
      sex: editSex,
      birthDate,
    });
    if (weight !== latestWeight) {
      const today = new Date().toISOString().split('T')[0];
      addWeightLog(today, weight);
    }
    showToast('Profil mis à jour ✓');
    setSettingsPage(null);
  };

  const saveGoals = () => {
    const goalWeight = parseFloat(editGoalWeight) || profile.weightGoalKg;
    updateProfile({ weightGoalKg: goalWeight, activityLevel: editActivity });
    showToast('Objectifs mis à jour ✓');
    setSettingsPage(null);
  };

  const savePreferences = () => {
    updateProfile({ dietPreferences: editPreferences });
    showToast('Préférences mises à jour ✓');
    setSettingsPage(null);
  };

  const saveLocation = () => {
    const currency = editLocation === 'usa' ? '$' : '€';
    updateProfile({ location: editLocation, groceryCurrency: currency });
    showToast('Localisation mise à jour ✓');
    setSettingsPage(null);
  };

  const saveFoodPrefs = () => {
    updateProfile({ foodPreferences: editFoodPrefs });
    showToast('Aliments préférés mis à jour ✓');
    setSettingsPage(null);
  };

  const saveGrocery = () => {
    updateProfile({
      groceryBudget: parseFloat(editGroceryBudget) || 0,
      groceryFrequency: editGroceryFrequency,
    });
    showToast('Budget courses mis à jour ✓');
    setSettingsPage(null);
  };

  const togglePreference = (pref: string) => {
    setEditPreferences(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const toggleFoodPref = (pref: string) => {
    setEditFoodPrefs(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const currency = profile.groceryCurrency || '€';

  // ─── Settings Sub-pages ───
  if (settingsPage) {
    return (
      <div className="px-4 pt-12 pb-24 max-w-lg mx-auto">
        <button onClick={() => setSettingsPage(null)} className="flex items-center gap-2 text-gray-500 mb-6 hover:text-gray-700 transition-colors">
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Retour</span>
        </button>

        {settingsPage === 'editProfile' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-xl font-bold text-gray-800 font-display mb-6">Modifier le profil</h1>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Prénom</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white rounded-xl px-4 py-3 text-sm border border-gray-100 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none shadow-card" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Sexe</label>
                <div className="flex gap-2">
                  {(['M', 'F'] as const).map(s => (
                    <button key={s} onClick={() => setEditSex(s)}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${editSex === s ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border border-gray-100'}`}>
                      {s === 'M' ? '👨 Homme' : '👩 Femme'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Date de naissance</label>
                <input type="date" value={editBirthDate} onChange={(e) => setEditBirthDate(e.target.value)}
                  className="w-full bg-white rounded-xl px-4 py-3 text-sm border border-gray-100 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none shadow-card" />
                {editBirthDate && (
                  <p className="text-[10px] text-gray-400 mt-1">Âge : {calculateAge(editBirthDate)} ans</p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Taille (cm)</label>
                <input type="number" value={editHeight} onChange={(e) => setEditHeight(e.target.value)}
                  className="w-full bg-white rounded-xl px-4 py-3 text-sm border border-gray-100 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none shadow-card" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Poids actuel (kg)</label>
                <input type="number" step="0.1" value={editWeight} onChange={(e) => setEditWeight(e.target.value)}
                  className="w-full bg-white rounded-xl px-4 py-3 text-sm border border-gray-100 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none shadow-card" />
              </div>
              {editWeight && editHeight && editBirthDate && (
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs font-medium text-blue-600 mb-1">Aperçu du calcul</p>
                  {(() => {
                    const previewAge = calculateAge(editBirthDate);
                    const previewTDEE = calculateTDEE(editSex, parseFloat(editWeight) || 70, parseInt(editHeight) || 170, previewAge, profile.activityLevel);
                    return (
                      <p className="text-sm text-blue-700">
                        Âge: {previewAge} ans • TDEE: <span className="font-bold">{previewTDEE} kcal</span>
                      </p>
                    );
                  })()}
                </div>
              )}
              <button onClick={saveProfile}
                className="w-full bg-primary-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-600 active:scale-[0.98] transition-all shadow-float mt-6">
                <Check size={20} /> Enregistrer
              </button>
            </div>
          </motion.div>
        )}

        {settingsPage === 'editGoals' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-xl font-bold text-gray-800 font-display mb-6">Modifier les objectifs</h1>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Poids objectif (kg)</label>
                <input type="number" step="0.1" value={editGoalWeight} onChange={(e) => setEditGoalWeight(e.target.value)}
                  className="w-full bg-white rounded-xl px-4 py-3 text-sm border border-gray-100 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none shadow-card" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-2 block">Niveau d'activité</label>
                <div className="space-y-2">
                  {activityLevels.map(level => (
                    <button key={level.value} onClick={() => setEditActivity(level.value)}
                      className={`w-full p-3 rounded-xl text-left transition-all ${
                        editActivity === level.value
                          ? 'bg-primary-50 border-2 border-primary-500'
                          : 'bg-white border border-gray-100 hover:bg-surface-50'
                      }`}>
                      <p className="text-sm font-semibold text-gray-700">{level.label}</p>
                      <p className="text-[10px] text-gray-400">{level.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              {editActivity && (
                <div className="bg-primary-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-primary-600 mb-1">Nouveau budget estimé</p>
                  {(() => {
                    const previewPlan = calculateNutritionPlan({
                      name: profile.name,
                      sex: profile.sex,
                      birthDate: profile.birthDate,
                      heightCm: profile.heightCm,
                      weightCurrentKg: latestWeight,
                      weightGoalKg: parseFloat(editGoalWeight) || profile.weightGoalKg,
                      activityLevel: editActivity,
                      medicalConditions: profile.medicalConditions,
                      dietPreferences: profile.dietPreferences,
                      location: profile.location || '',
                      groceryBudget: profile.groceryBudget || 0,
                      groceryCurrency: profile.groceryCurrency || '€',
                      foodPreferences: profile.foodPreferences || [],
                      groceryFrequency: profile.groceryFrequency || 'weekly',
                    });
                    return (
                      <>
                        <p className="text-xl font-bold text-primary-700">{previewPlan.dailyCalorieBudget} kcal/jour</p>
                        <p className="text-[10px] text-primary-500">
                          BMR: {previewPlan.bmr} kcal • TDEE: {previewPlan.tdee} kcal • Déficit: {previewPlan.deficit} kcal
                        </p>
                        {previewPlan.estimatedWeeksToGoal > 0 && (
                          <p className="text-[10px] text-primary-500 mt-1">
                            Objectif atteint en ~{previewPlan.estimatedWeeksToGoal} semaines
                          </p>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
              <button onClick={saveGoals}
                className="w-full bg-primary-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-600 active:scale-[0.98] transition-all shadow-float mt-4">
                <Check size={20} /> Enregistrer les objectifs
              </button>
            </div>
          </motion.div>
        )}

        {settingsPage === 'editPreferences' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-xl font-bold text-gray-800 font-display mb-2">Préférences alimentaires</h1>
            <p className="text-xs text-gray-400 mb-6">Sélectionnez vos restrictions et préférences</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {dietOptions.map(pref => (
                <button key={pref} onClick={() => togglePreference(pref)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    editPreferences.includes(pref)
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'bg-white text-gray-600 border border-gray-100 hover:bg-surface-50'
                  }`}>
                  {editPreferences.includes(pref) && <Check size={14} className="inline mr-1.5" />}
                  {pref}
                </button>
              ))}
            </div>
            <button onClick={savePreferences}
              className="w-full bg-primary-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-600 active:scale-[0.98] transition-all shadow-float">
              <Check size={20} /> Enregistrer les préférences
            </button>
          </motion.div>
        )}

        {settingsPage === 'editLocation' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-xl font-bold text-gray-800 font-display mb-6">Localisation</h1>
            <div className="space-y-2 mb-6">
              {LOCATION_OPTIONS.map(loc => (
                <button key={loc.value} onClick={() => setEditLocation(loc.value)}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 text-left ${
                    editLocation === loc.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-100 bg-white hover:bg-surface-50'
                  }`}>
                  <span className="text-xl">{loc.emoji}</span>
                  <span className={`font-semibold text-sm ${editLocation === loc.value ? 'text-primary-600' : 'text-gray-700'}`}>{loc.label}</span>
                  {editLocation === loc.value && <Check size={18} className="text-primary-500 ml-auto" />}
                </button>
              ))}
            </div>
            <button onClick={saveLocation}
              className="w-full bg-primary-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-600 active:scale-[0.98] transition-all shadow-float">
              <Check size={20} /> Enregistrer
            </button>
          </motion.div>
        )}

        {settingsPage === 'editFoodPrefs' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-xl font-bold text-gray-800 font-display mb-2">Aliments préférés</h1>
            <p className="text-xs text-gray-400 mb-4">Les aliments non sélectionnés ne seront jamais proposés</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {FOOD_PREFERENCE_OPTIONS.map(food => (
                <button key={food.value} onClick={() => toggleFoodPref(food.value)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                    editFoodPrefs.includes(food.value)
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'bg-white text-gray-600 border border-gray-100 hover:bg-surface-50'
                  }`}>
                  <span>{food.emoji}</span>
                  <span>{food.label}</span>
                  {editFoodPrefs.includes(food.value) && <Check size={14} className="ml-0.5" />}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mb-6">
              <button onClick={() => setEditFoodPrefs(FOOD_PREFERENCE_OPTIONS.map(f => f.value))}
                className="text-xs text-primary-500 font-semibold">Tout sélectionner</button>
              <span className="text-gray-300">•</span>
              <button onClick={() => setEditFoodPrefs([])}
                className="text-xs text-gray-400 font-semibold">Tout désélectionner</button>
            </div>
            <button onClick={saveFoodPrefs}
              className="w-full bg-primary-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-600 active:scale-[0.98] transition-all shadow-float">
              <Check size={20} /> Enregistrer ({editFoodPrefs.length} aliments)
            </button>
          </motion.div>
        )}

        {settingsPage === 'editGrocery' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-xl font-bold text-gray-800 font-display mb-6">Budget & Fréquence courses</h1>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Budget courses ({currency})</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">{currency}</span>
                  <input type="number" value={editGroceryBudget} onChange={(e) => setEditGroceryBudget(e.target.value)}
                    className="w-full pl-10 pr-4 bg-white rounded-xl px-4 py-3 text-sm border border-gray-100 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none shadow-card" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-2 block">Fréquence</label>
                <div className="space-y-2">
                  {GROCERY_FREQUENCY_OPTIONS.map(freq => (
                    <button key={freq.value} onClick={() => setEditGroceryFrequency(freq.value)}
                      className={`w-full p-3 rounded-xl text-left transition-all flex items-center gap-3 ${
                        editGroceryFrequency === freq.value
                          ? 'bg-primary-50 border-2 border-primary-500'
                          : 'bg-white border border-gray-100 hover:bg-surface-50'
                      }`}>
                      <span className="text-lg">{freq.emoji}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">{freq.label}</p>
                        <p className="text-[10px] text-gray-400">{freq.desc}</p>
                      </div>
                      {editGroceryFrequency === freq.value && <Check size={18} className="text-primary-500 ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={saveGrocery}
                className="w-full bg-primary-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-600 active:scale-[0.98] transition-all shadow-float">
                <Check size={20} /> Enregistrer
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // ─── Main Profile View ───
  const locationLabel = LOCATION_OPTIONS.find(l => l.value === profile.location)?.label || profile.location || 'Non défini';
  const freqLabel = GROCERY_FREQUENCY_OPTIONS.find(f => f.value === profile.groceryFrequency)?.label || profile.groceryFrequency || 'Hebdomadaire';

  return (
    <div className="px-4 pt-12 pb-24 max-w-lg mx-auto">
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
              {profile.sex === 'M' ? 'Homme' : 'Femme'} • {age} ans • {profile.heightCm} cm
            </p>
            <p className="text-white/50 text-xs">{locationLabel}</p>
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

      {weightLost > 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="bg-primary-50 rounded-2xl p-4 mb-4 flex items-center gap-3">
          <Award size={24} className="text-primary-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-primary-700">Vous avez perdu {weightLost.toFixed(1)} kg ! 🎉</p>
            <p className="text-xs text-primary-500">
              {weightToGo > 0 ? `Plus que ${weightToGo.toFixed(1)} kg pour atteindre votre objectif` : 'Objectif atteint ! Félicitations !'}
            </p>
          </div>
        </motion.div>
      )}

      {/* Weight Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-white rounded-2xl p-4 shadow-card mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-800 text-sm">Suivi du poids</h2>
          <button onClick={() => setShowWeightInput(!showWeightInput)} className="text-xs text-primary-500 font-semibold">+ Ajouter</button>
        </div>
        {showWeightInput && (
          <div className="flex gap-2 mb-3">
            <input type="number" step="0.1" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} placeholder="Poids (kg)"
              className="flex-1 px-3 py-2 bg-surface-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
            <button onClick={handleAddWeight} className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">OK</button>
          </div>
        )}
        <div className="flex bg-surface-100 rounded-lg p-0.5 mb-3">
          {(['30', '90', '365'] as const).map(range => (
            <button key={range} onClick={() => setTimeRange(range)}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${timeRange === range ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400'}`}>
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
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="poids" stroke="#4CAF50" strokeWidth={2} dot={{ fill: '#4CAF50', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-32 flex items-center justify-center text-gray-300 text-sm">Ajoutez des pesées pour voir votre courbe</div>
        )}
      </motion.div>

      {/* Calorie Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-4 shadow-card mb-4">
        <h2 className="font-bold text-gray-800 text-sm mb-3">Calories moyennes / semaine</h2>
        {getWeeklyCalories().length > 0 ? (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={getWeeklyCalories()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="semaine" tick={{ fontSize: 10 }} stroke="#ccc" />
              <YAxis tick={{ fontSize: 10 }} stroke="#ccc" />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="moyenne" fill="#FF9800" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-32 flex items-center justify-center text-gray-300 text-sm">Enregistrez des repas pour voir vos statistiques</div>
        )}
      </motion.div>

      {/* Parameters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
        className="bg-white rounded-2xl p-4 shadow-card mb-4">
        <h2 className="font-bold text-gray-800 text-sm mb-3">Vos paramètres</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Âge</span>
            <span className="font-semibold text-gray-700">{age} ans</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Budget calorique</span>
            <span className="font-semibold text-gray-700">{profile.dailyCalorieBudget} kcal/jour</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">TDEE</span>
            <span className="font-semibold text-gray-700">{Math.round(profile.tdee)} kcal</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Protéines</span>
            <span className="font-semibold text-gray-700">{profile.macroTargets.protein_g}g</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Activité</span>
            <span className="font-semibold text-gray-700">{activityLevels.find(a => a.value === profile.activityLevel)?.label || profile.activityLevel}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Localisation</span>
            <span className="font-semibold text-gray-700">{locationLabel}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Budget courses</span>
            <span className="font-semibold text-gray-700">{profile.groceryBudget || 0}{currency} / {freqLabel.toLowerCase()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Aliments préférés</span>
            <span className="font-semibold text-gray-700">{(profile.foodPreferences || []).length} sélectionnés</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Préférences</span>
            <span className="font-semibold text-gray-700 text-right max-w-[60%] truncate">
              {profile.dietPreferences.length > 0 ? profile.dietPreferences.join(', ') : 'Aucune'}
            </span>
          </div>
          {profile.estimatedGoalDate && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Date objectif estimée</span>
              <span className="font-semibold text-primary-600">
                {new Date(profile.estimatedGoalDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Premium */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-4 mb-4 text-white">
        <div className="flex items-center gap-3">
          <Crown size={24} />
          <div className="flex-1">
            <h3 className="font-bold text-sm">NutriLens Premium</h3>
            <p className="text-xs text-white/80">Scanner illimité, plan repas IA, export données</p>
          </div>
          <span className="text-sm font-bold">5,99€/mois</span>
        </div>
      </motion.div>

      {/* Settings Menu */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-card overflow-hidden mb-4">
        {[
          { icon: User, label: 'Modifier le profil', action: openEditProfile },
          { icon: Target, label: 'Modifier les objectifs', action: openEditGoals },
          { icon: Settings, label: 'Préférences alimentaires', action: openEditPreferences },
          { icon: MapPin, label: 'Localisation', action: openEditLocation },
          { icon: Apple, label: 'Aliments préférés', action: openEditFoodPrefs },
          { icon: ShoppingCart, label: 'Budget & Fréquence courses', action: openEditGrocery },
        ].map((item, i) => (
          <button key={i} onClick={item.action}
            className="w-full flex items-center gap-3 p-4 hover:bg-surface-50 transition-colors border-b border-gray-50 last:border-0">
            <item.icon size={18} className="text-gray-400" />
            <span className="flex-1 text-sm font-medium text-gray-700 text-left">{item.label}</span>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        ))}
      </motion.div>

      <button onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-medium text-sm hover:bg-red-50 rounded-2xl transition-colors">
        <LogOut size={18} /> Se déconnecter
      </button>
    </div>
  );
}
