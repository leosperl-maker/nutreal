import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Leaf, User, Ruler, Activity, Heart, Utensils, MapPin, Wallet, ShoppingCart, Apple } from 'lucide-react';
import { useStore } from '../store/useStore';
import {
  calculateNutritionPlan,
  type UserProfile,
  LOCATION_OPTIONS,
  FOOD_PREFERENCE_OPTIONS,
  GROCERY_FREQUENCY_OPTIONS,
  getCurrencyForLocation,
} from '../lib/nutrition';

const steps = [
  { icon: User, title: 'Qui êtes-vous ?', subtitle: 'Informations de base' },
  { icon: Ruler, title: 'Vos mensurations', subtitle: 'Taille et poids' },
  { icon: MapPin, title: 'Votre localisation', subtitle: 'Où vivez-vous ?' },
  { icon: Activity, title: 'Votre activité', subtitle: 'Niveau d\'activité physique' },
  { icon: Heart, title: 'Votre santé', subtitle: 'Conditions médicales' },
  { icon: Utensils, title: 'Vos préférences', subtitle: 'Régime alimentaire' },
  { icon: Apple, title: 'Vos aliments', subtitle: 'Ce que vous aimez manger' },
  { icon: ShoppingCart, title: 'Vos courses', subtitle: 'Budget et fréquence' },
];

const activityLevels = [
  { value: 'sedentary', label: 'Sédentaire', desc: 'Peu ou pas d\'exercice', emoji: '🪑' },
  { value: 'light', label: 'Légèrement actif', desc: '1-3 jours/semaine', emoji: '🚶' },
  { value: 'moderate', label: 'Modérément actif', desc: '3-5 jours/semaine', emoji: '🏃' },
  { value: 'active', label: 'Actif', desc: '6-7 jours/semaine', emoji: '💪' },
  { value: 'very_active', label: 'Très actif', desc: 'Exercice intense quotidien', emoji: '🏋️' },
];

const medicalOptions = [
  { value: 'none', label: 'Aucune condition', emoji: '✅' },
  { value: 'diabetes', label: 'Diabète', emoji: '💉' },
  { value: 'hypertension', label: 'Hypertension', emoji: '❤️‍🩹' },
  { value: 'food_allergies', label: 'Allergies alimentaires', emoji: '⚠️' },
  { value: 'celiac', label: 'Maladie cœliaque', emoji: '🌾' },
  { value: 'lactose_intolerance', label: 'Intolérance au lactose', emoji: '🥛' },
];

const dietOptions = [
  { value: 'none', label: 'Aucune restriction', emoji: '🍽️' },
  { value: 'vegetarian', label: 'Végétarien', emoji: '🥬' },
  { value: 'vegan', label: 'Végan', emoji: '🌱' },
  { value: 'gluten_free', label: 'Sans gluten', emoji: '🚫🌾' },
  { value: 'halal', label: 'Halal', emoji: '☪️' },
  { value: 'lactose_free', label: 'Sans lactose', emoji: '🚫🥛' },
  { value: 'keto', label: 'Cétogène', emoji: '🥑' },
  { value: 'mediterranean', label: 'Méditerranéen', emoji: '🫒' },
];

export default function Onboarding() {
  const { setProfile, setOnboardingComplete, addWeightLog } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    sex: '' as 'M' | 'F' | '',
    birthDate: '',
    heightCm: '',
    weightCurrentKg: '',
    weightGoalKg: '',
    location: '',
    activityLevel: '',
    medicalConditions: [] as string[],
    allergyDetails: '',
    dietPreferences: [] as string[],
    foodPreferences: [] as string[],
    groceryBudget: '',
    groceryFrequency: 'weekly',
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field: 'medicalConditions' | 'dietPreferences' | 'foodPreferences', value: string) => {
    setFormData(prev => {
      const arr = prev[field];
      if (value === 'none') {
        return { ...prev, [field]: arr.includes('none') ? [] : ['none'] };
      }
      const filtered = arr.filter(v => v !== 'none');
      if (filtered.includes(value)) {
        return { ...prev, [field]: filtered.filter(v => v !== value) };
      }
      return { ...prev, [field]: [...filtered, value] };
    });
  };

  const currency = formData.location === 'usa' ? '$' : '€';

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.name && formData.sex && formData.birthDate;
      case 1: return formData.heightCm && formData.weightCurrentKg && formData.weightGoalKg;
      case 2: return formData.location;
      case 3: return formData.activityLevel;
      case 4: return formData.medicalConditions.length > 0;
      case 5: return formData.dietPreferences.length > 0;
      case 6: return formData.foodPreferences.length > 0;
      case 7: return formData.groceryBudget && formData.groceryFrequency;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handleComplete = () => {
    const locationLabel = LOCATION_OPTIONS.find(l => l.value === formData.location)?.label || formData.location;
    const userProfile: UserProfile = {
      name: formData.name,
      sex: formData.sex as 'M' | 'F',
      birthDate: formData.birthDate,
      heightCm: Number(formData.heightCm),
      weightCurrentKg: Number(formData.weightCurrentKg),
      weightGoalKg: Number(formData.weightGoalKg),
      activityLevel: formData.activityLevel,
      medicalConditions: formData.medicalConditions.filter(c => c !== 'none'),
      dietPreferences: formData.dietPreferences.filter(p => p !== 'none'),
      location: formData.location,
      groceryBudget: Number(formData.groceryBudget),
      groceryCurrency: currency,
      foodPreferences: formData.foodPreferences,
      groceryFrequency: formData.groceryFrequency,
    };

    const plan = calculateNutritionPlan(userProfile);

    setProfile({
      name: userProfile.name,
      sex: userProfile.sex,
      birthDate: userProfile.birthDate,
      heightCm: userProfile.heightCm,
      weightCurrentKg: userProfile.weightCurrentKg,
      weightGoalKg: userProfile.weightGoalKg,
      activityLevel: userProfile.activityLevel,
      medicalConditions: userProfile.medicalConditions,
      dietPreferences: userProfile.dietPreferences,
      dailyCalorieBudget: plan.dailyCalorieBudget,
      macroTargets: plan.macroTargets,
      tdee: plan.tdee,
      estimatedGoalDate: plan.estimatedGoalDate,
      location: userProfile.location,
      groceryBudget: userProfile.groceryBudget,
      groceryCurrency: userProfile.groceryCurrency,
      foodPreferences: userProfile.foodPreferences,
      groceryFrequency: userProfile.groceryFrequency,
    });

    const today = new Date().toISOString().split('T')[0];
    addWeightLog(today, userProfile.weightCurrentKg);
    setOnboardingComplete(true);
  };

  const plan = showSummary ? calculateNutritionPlan({
    name: formData.name,
    sex: formData.sex as 'M' | 'F',
    birthDate: formData.birthDate,
    heightCm: Number(formData.heightCm),
    weightCurrentKg: Number(formData.weightCurrentKg),
    weightGoalKg: Number(formData.weightGoalKg),
    activityLevel: formData.activityLevel,
    medicalConditions: formData.medicalConditions,
    dietPreferences: formData.dietPreferences,
    location: formData.location,
    groceryBudget: Number(formData.groceryBudget),
    groceryCurrency: currency,
    foodPreferences: formData.foodPreferences,
    groceryFrequency: formData.groceryFrequency,
  }) : null;

  if (showSummary && plan) {
    const locationLabel = LOCATION_OPTIONS.find(l => l.value === formData.location)?.label || formData.location;
    const freqLabel = GROCERY_FREQUENCY_OPTIONS.find(f => f.value === formData.groceryFrequency)?.label || formData.groceryFrequency;

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check size={32} className="text-primary-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 font-display">Votre plan personnalisé</h2>
            <p className="text-sm text-gray-400 mt-1">Basé sur vos informations</p>
          </div>

          <div className="space-y-3">
            <div className="bg-primary-50 rounded-xl p-4 text-center">
              <p className="text-xs text-primary-600 font-medium">Budget calorique quotidien</p>
              <p className="text-3xl font-bold text-primary-700 font-display">{plan.dailyCalorieBudget}</p>
              <p className="text-xs text-primary-500">kcal / jour</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-red-50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-red-400 font-medium">Protéines</p>
                <p className="text-lg font-bold text-red-600">{plan.macroTargets.protein_g}g</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-yellow-600 font-medium">Lipides</p>
                <p className="text-lg font-bold text-yellow-700">{plan.macroTargets.fat_g}g</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-orange-400 font-medium">Glucides</p>
                <p className="text-lg font-bold text-orange-600">{plan.macroTargets.carbs_g}g</p>
              </div>
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-green-500 font-medium">Fibres</p>
                <p className="text-lg font-bold text-green-600">{plan.macroTargets.fiber_g}g</p>
              </div>
            </div>

            <div className="bg-surface-100 rounded-xl p-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">BMR</span>
                <span className="font-semibold text-gray-700">{plan.bmr} kcal</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">TDEE</span>
                <span className="font-semibold text-gray-700">{plan.tdee} kcal</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">Déficit</span>
                <span className="font-semibold text-secondary-500">-{plan.deficit} kcal</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">Localisation</span>
                <span className="font-semibold text-gray-700">{locationLabel}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">Budget courses</span>
                <span className="font-semibold text-gray-700">{formData.groceryBudget}{currency} / {freqLabel.toLowerCase()}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">Aliments préférés</span>
                <span className="font-semibold text-gray-700">{formData.foodPreferences.length} sélectionnés</span>
              </div>
              {plan.estimatedWeeksToGoal > 0 && (
                <>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-500">Objectif estimé</span>
                    <span className="font-semibold text-primary-600">{plan.estimatedWeeksToGoal} semaines</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-500">Date estimée</span>
                    <span className="font-semibold text-gray-700">
                      {new Date(plan.estimatedGoalDate).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <button
            onClick={handleComplete}
            className="w-full mt-6 bg-primary-500 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-600 active:scale-[0.98] transition-all"
          >
            Commencer mon parcours
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
            <Leaf size={22} className="text-primary-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 font-display">NutriLens</h1>
            <p className="text-xs text-gray-400">Étape {currentStep + 1} sur {steps.length}</p>
          </div>
        </div>

        <div className="flex gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i <= currentStep ? 'bg-primary-500' : 'bg-gray-100'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 px-6 py-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 font-display mb-1">
              {steps[currentStep].title}
            </h2>
            <p className="text-sm text-gray-400 mb-6">{steps[currentStep].subtitle}</p>

            {/* Step 0: Basic Info */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">Prénom</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Votre prénom"
                    className="w-full px-4 py-3 bg-surface-100 rounded-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-2 block">Sexe</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'M', label: 'Homme', emoji: '👨' },
                      { value: 'F', label: 'Femme', emoji: '👩' },
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => updateField('sex', option.value)}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          formData.sex === option.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-100 bg-white'
                        }`}
                      >
                        <span className="text-2xl">{option.emoji}</span>
                        <span className={`text-sm font-medium ${
                          formData.sex === option.value ? 'text-primary-600' : 'text-gray-600'
                        }`}>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">Date de naissance</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => updateField('birthDate', e.target.value)}
                    className="w-full px-4 py-3 bg-surface-100 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                  />
                </div>
              </div>
            )}

            {/* Step 1: Measurements */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">Taille (cm)</label>
                  <input
                    type="number"
                    value={formData.heightCm}
                    onChange={(e) => updateField('heightCm', e.target.value)}
                    placeholder="170"
                    className="w-full px-4 py-3 bg-surface-100 rounded-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">Poids actuel (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weightCurrentKg}
                    onChange={(e) => updateField('weightCurrentKg', e.target.value)}
                    placeholder="75"
                    className="w-full px-4 py-3 bg-surface-100 rounded-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">Poids objectif (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weightGoalKg}
                    onChange={(e) => updateField('weightGoalKg', e.target.value)}
                    placeholder="68"
                    className="w-full px-4 py-3 bg-surface-100 rounded-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div className="space-y-2">
                {LOCATION_OPTIONS.map(loc => (
                  <button
                    key={loc.value}
                    onClick={() => updateField('location', loc.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 text-left ${
                      formData.location === loc.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-100 bg-white'
                    }`}
                  >
                    <span className="text-2xl">{loc.emoji}</span>
                    <span className={`font-semibold text-sm ${
                      formData.location === loc.value ? 'text-primary-600' : 'text-gray-700'
                    }`}>{loc.label}</span>
                    {formData.location === loc.value && (
                      <Check size={18} className="text-primary-500 ml-auto" />
                    )}
                  </button>
                ))}
                <p className="text-[10px] text-gray-400 mt-2 text-center">
                  Votre localisation nous aide à adapter les recettes et la devise
                </p>
              </div>
            )}

            {/* Step 3: Activity */}
            {currentStep === 3 && (
              <div className="space-y-2">
                {activityLevels.map(level => (
                  <button
                    key={level.value}
                    onClick={() => updateField('activityLevel', level.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 text-left ${
                      formData.activityLevel === level.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-100 bg-white'
                    }`}
                  >
                    <span className="text-2xl">{level.emoji}</span>
                    <div>
                      <p className={`font-semibold text-sm ${
                        formData.activityLevel === level.value ? 'text-primary-600' : 'text-gray-700'
                      }`}>{level.label}</p>
                      <p className="text-xs text-gray-400">{level.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 4: Medical */}
            {currentStep === 4 && (
              <div className="space-y-2">
                {medicalOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => toggleArrayField('medicalConditions', option.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 text-left ${
                      formData.medicalConditions.includes(option.value)
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-100 bg-white'
                    }`}
                  >
                    <span className="text-xl">{option.emoji}</span>
                    <span className={`font-medium text-sm ${
                      formData.medicalConditions.includes(option.value) ? 'text-primary-600' : 'text-gray-700'
                    }`}>{option.label}</span>
                    {formData.medicalConditions.includes(option.value) && (
                      <Check size={18} className="text-primary-500 ml-auto" />
                    )}
                  </button>
                ))}
                {formData.medicalConditions.includes('food_allergies') && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <input
                      type="text"
                      value={formData.allergyDetails}
                      onChange={(e) => updateField('allergyDetails', e.target.value)}
                      placeholder="Précisez vos allergies..."
                      className="w-full px-4 py-3 bg-surface-100 rounded-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30 mt-2"
                    />
                  </motion.div>
                )}
              </div>
            )}

            {/* Step 5: Diet Preferences */}
            {currentStep === 5 && (
              <div className="grid grid-cols-2 gap-2">
                {dietOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => toggleArrayField('dietPreferences', option.value)}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      formData.dietPreferences.includes(option.value)
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-100 bg-white'
                    }`}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className={`text-xs font-medium text-center ${
                      formData.dietPreferences.includes(option.value) ? 'text-primary-600' : 'text-gray-600'
                    }`}>{option.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 6: Food Preferences */}
            {currentStep === 6 && (
              <div>
                <p className="text-xs text-gray-400 mb-4">
                  Sélectionnez les aliments que vous aimez. Les aliments non sélectionnés ne seront <strong>jamais</strong> proposés dans vos plans repas.
                </p>
                <div className="flex flex-wrap gap-2">
                  {FOOD_PREFERENCE_OPTIONS.map(food => (
                    <button
                      key={food.value}
                      onClick={() => toggleArrayField('foodPreferences', food.value)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                        formData.foodPreferences.includes(food.value)
                          ? 'bg-primary-500 text-white shadow-sm'
                          : 'bg-white text-gray-600 border border-gray-100 hover:bg-surface-50'
                      }`}
                    >
                      <span>{food.emoji}</span>
                      <span>{food.label}</span>
                      {formData.foodPreferences.includes(food.value) && (
                        <Check size={14} className="ml-0.5" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, foodPreferences: FOOD_PREFERENCE_OPTIONS.map(f => f.value) }))}
                    className="text-xs text-primary-500 font-semibold hover:text-primary-600"
                  >
                    Tout sélectionner
                  </button>
                  <span className="text-gray-300">•</span>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, foodPreferences: [] }))}
                    className="text-xs text-gray-400 font-semibold hover:text-gray-500"
                  >
                    Tout désélectionner
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-3">
                  {formData.foodPreferences.length} aliment{formData.foodPreferences.length > 1 ? 's' : ''} sélectionné{formData.foodPreferences.length > 1 ? 's' : ''}
                </p>
              </div>
            )}

            {/* Step 7: Grocery Budget & Frequency */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                    Budget courses ({currency})
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">{currency}</span>
                    <input
                      type="number"
                      value={formData.groceryBudget}
                      onChange={(e) => updateField('groceryBudget', e.target.value)}
                      placeholder={currency === '€' ? '80' : '100'}
                      className="w-full pl-10 pr-4 py-3 bg-surface-100 rounded-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Budget hebdomadaire pour vos courses alimentaires</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 mb-2 block">Fréquence des courses</label>
                  <div className="space-y-2">
                    {GROCERY_FREQUENCY_OPTIONS.map(freq => (
                      <button
                        key={freq.value}
                        onClick={() => updateField('groceryFrequency', freq.value)}
                        className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 text-left ${
                          formData.groceryFrequency === freq.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-100 bg-white'
                        }`}
                      >
                        <span className="text-xl">{freq.emoji}</span>
                        <div>
                          <p className={`font-semibold text-sm ${
                            formData.groceryFrequency === freq.value ? 'text-primary-600' : 'text-gray-700'
                          }`}>{freq.label}</p>
                          <p className="text-xs text-gray-400">{freq.desc}</p>
                        </div>
                        {formData.groceryFrequency === freq.value && (
                          <Check size={18} className="text-primary-500 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="px-6 pb-8 pt-4 flex gap-3">
        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="w-12 h-12 rounded-xl bg-surface-100 flex items-center justify-center text-gray-400 hover:bg-surface-200 active:scale-95 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex-1 bg-primary-500 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-600 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {currentStep === steps.length - 1 ? 'Voir mon plan' : 'Continuer'}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
