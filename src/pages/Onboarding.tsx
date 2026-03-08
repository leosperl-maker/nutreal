import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { calculateNutritionPlan, LOCATION_OPTIONS, FOOD_PREFERENCE_OPTIONS, GROCERY_FREQUENCY_OPTIONS, getCurrencyForLocation } from '../lib/nutrition';
import { ChevronLeft, ChevronRight, Check, User, Ruler, Target, Activity, MapPin, ShoppingCart, Heart, Utensils } from 'lucide-react';
import AnimatedButton from '../components/AnimatedButton';

const STEPS = ['Profil', 'Mensurations', 'Objectif', 'Activité', 'Localisation', 'Budget', 'Préférences', 'Aliments'];

export default function Onboarding() {
  const { setProfile, setOnboardingComplete } = useStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: '', sex: 'M' as 'M' | 'F', birthDate: '1990-01-01', heightCm: 175, weightCurrentKg: 80, weightGoalKg: 75, activityLevel: 'moderate', medicalConditions: [] as string[], dietPreferences: [] as string[], location: 'guadeloupe', groceryBudget: 100, groceryCurrency: '€', foodPreferences: [] as string[], groceryFrequency: 'weekly' });

  const update = (k: string, v: any) => {
    setForm(f => {
      const nf = { ...f, [k]: v };
      if (k === 'location') nf.groceryCurrency = getCurrencyForLocation(v);
      return nf;
    });
  };

  const toggleArr = (k: 'medicalConditions' | 'dietPreferences' | 'foodPreferences', v: string) => {
    setForm(f => ({ ...f, [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v] }));
  };

  const finish = () => {
    const plan = calculateNutritionPlan(form as any);
    setProfile({ ...form, dailyCalorieBudget: plan.dailyCalorieBudget, macroTargets: plan.macroTargets, tdee: plan.tdee, estimatedGoalDate: plan.estimatedGoalDate });
    setOnboardingComplete(true);
  };

  const icons = [User, Ruler, Target, Activity, MapPin, ShoppingCart, Heart, Utensils];
  const Icon = icons[step];

  const grouped = LOCATION_OPTIONS.reduce((acc, loc) => {
    if (!acc[loc.group]) acc[loc.group] = [];
    acc[loc.group].push(loc);
    return acc;
  }, {} as Record<string, typeof LOCATION_OPTIONS>);

  return (
    <div className="min-h-screen bg-surface-100 flex flex-col">
      {/* Progress */}
      <div className="px-4 pt-12 pb-4">
        <div className="flex items-center gap-1 mb-2">
          {STEPS.map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i <= step ? 'bg-primary-500' : 'bg-surface-300'}`} />
          ))}
        </div>
        <p className="text-xs text-text-secondary text-center">{step + 1}/{STEPS.length} — {STEPS[step]}</p>
      </div>

      <div className="flex-1 px-4 pb-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }} className="max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center">
                <Icon size={24} className="text-primary-500" />
              </div>
              <h2 className="text-xl font-bold text-text-primary font-display">{STEPS[step]}</h2>
            </div>

            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-secondary mb-1 block">Prénom</label>
                  <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Votre prénom"
                    className="w-full px-4 py-3 bg-white rounded-xl border border-surface-300 focus:ring-2 focus:ring-primary-400 focus:outline-none text-text-primary" />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary mb-2 block">Sexe</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ v: 'M', l: '👨 Homme' }, { v: 'F', l: '👩 Femme' }].map(o => (
                      <button key={o.v} onClick={() => update('sex', o.v)}
                        className={`py-3 rounded-xl font-medium text-sm transition-all ${form.sex === o.v ? 'bg-primary-500 text-white shadow-float' : 'bg-white text-text-primary border border-surface-300'}`}>
                        {o.l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary mb-1 block">Date de naissance</label>
                  <input type="date" value={form.birthDate} onChange={e => update('birthDate', e.target.value)}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-surface-300 focus:ring-2 focus:ring-primary-400 focus:outline-none text-text-primary" />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-secondary mb-1 block">Taille (cm)</label>
                  <input type="number" value={form.heightCm} onChange={e => update('heightCm', +e.target.value)}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-surface-300 focus:ring-2 focus:ring-primary-400 focus:outline-none text-text-primary" />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary mb-1 block">Poids actuel (kg)</label>
                  <input type="number" value={form.weightCurrentKg} onChange={e => update('weightCurrentKg', +e.target.value)}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-surface-300 focus:ring-2 focus:ring-primary-400 focus:outline-none text-text-primary" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <label className="text-sm font-medium text-text-secondary mb-1 block">Poids objectif (kg)</label>
                <input type="number" value={form.weightGoalKg} onChange={e => update('weightGoalKg', +e.target.value)}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-surface-300 focus:ring-2 focus:ring-primary-400 focus:outline-none text-text-primary" />
                <p className="text-xs text-text-muted mt-2">
                  {form.weightGoalKg < form.weightCurrentKg ? `Objectif : perdre ${form.weightCurrentKg - form.weightGoalKg} kg` :
                   form.weightGoalKg > form.weightCurrentKg ? `Objectif : prendre ${form.weightGoalKg - form.weightCurrentKg} kg` : 'Maintien du poids'}
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-2">
                {[{ v: 'sedentary', l: '🪑 Sédentaire', d: 'Bureau, peu de mouvement' },
                  { v: 'light', l: '🚶 Légèrement actif', d: '1-2 séances/semaine' },
                  { v: 'moderate', l: '🏃 Modérément actif', d: '3-5 séances/semaine' },
                  { v: 'active', l: '💪 Actif', d: '6-7 séances/semaine' },
                  { v: 'very_active', l: '🔥 Très actif', d: 'Athlète, travail physique' }].map(o => (
                  <button key={o.v} onClick={() => update('activityLevel', o.v)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${form.activityLevel === o.v ? 'bg-primary-500 text-white shadow-float' : 'bg-white border border-surface-300'}`}>
                    <div className="font-medium text-sm">{o.l}</div>
                    <div className={`text-xs mt-0.5 ${form.activityLevel === o.v ? 'text-white/70' : 'text-text-muted'}`}>{o.d}</div>
                  </button>
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                {Object.entries(grouped).map(([group, locs]) => (
                  <div key={group}>
                    <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">{group}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {locs.map(loc => (
                        <button key={loc.value} onClick={() => update('location', loc.value)}
                          className={`p-3 rounded-xl text-left text-sm transition-all ${form.location === loc.value ? 'bg-primary-500 text-white shadow-float' : 'bg-white border border-surface-300'}`}>
                          {loc.emoji} {loc.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-secondary mb-1 block">Budget courses ({form.groceryCurrency})</label>
                  <input type="number" value={form.groceryBudget} onChange={e => update('groceryBudget', +e.target.value)}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-surface-300 focus:ring-2 focus:ring-primary-400 focus:outline-none text-text-primary" />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary mb-2 block">Fréquence des courses</label>
                  <div className="space-y-2">
                    {GROCERY_FREQUENCY_OPTIONS.map(o => (
                      <button key={o.value} onClick={() => update('groceryFrequency', o.value)}
                        className={`w-full p-3 rounded-xl text-left text-sm transition-all ${form.groceryFrequency === o.value ? 'bg-primary-500 text-white shadow-float' : 'bg-white border border-surface-300'}`}>
                        {o.emoji} {o.label} — <span className={form.groceryFrequency === o.value ? 'text-white/70' : 'text-text-muted'}>{o.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4">
                <label className="text-sm font-medium text-text-secondary block">Régime alimentaire</label>
                <div className="flex flex-wrap gap-2">
                  {['Omnivore', 'Végétarien', 'Végan', 'Pescétarien', 'Sans gluten', 'Sans lactose', 'Halal', 'Casher', 'Keto', 'Paléo'].map(d => (
                    <button key={d} onClick={() => toggleArr('dietPreferences', d)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${form.dietPreferences.includes(d) ? 'bg-primary-500 text-white' : 'bg-white border border-surface-300 text-text-primary'}`}>
                      {d}
                    </button>
                  ))}
                </div>
                <label className="text-sm font-medium text-text-secondary block mt-4">Conditions médicales</label>
                <div className="flex flex-wrap gap-2">
                  {['Diabète', 'Hypertension', 'Cholestérol', 'Allergies', 'Aucune'].map(c => (
                    <button key={c} onClick={() => toggleArr('medicalConditions', c)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${form.medicalConditions.includes(c) ? 'bg-warning-300 text-white' : 'bg-white border border-surface-300 text-text-primary'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 7 && (
              <div>
                <p className="text-sm text-text-secondary mb-3">Sélectionnez vos aliments préférés</p>
                <div className="flex flex-wrap gap-2">
                  {FOOD_PREFERENCE_OPTIONS.map(f => (
                    <button key={f.value} onClick={() => toggleArr('foodPreferences', f.value)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${form.foodPreferences.includes(f.value) ? 'bg-primary-500 text-white' : 'bg-white border border-surface-300 text-text-primary'}`}>
                      {f.emoji} {f.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="px-4 pb-8 pt-2 flex gap-3 max-w-md mx-auto w-full">
        {step > 0 && (
          <AnimatedButton variant="secondary" onClick={() => setStep(s => s - 1)} className="px-6 py-3 text-sm">
            <ChevronLeft size={18} />
          </AnimatedButton>
        )}
        <AnimatedButton onClick={() => step < STEPS.length - 1 ? setStep(s => s + 1) : finish()}
          className="flex-1 py-3.5 text-sm flex items-center justify-center gap-2"
          disabled={step === 0 && !form.name}>
          {step < STEPS.length - 1 ? <><span>Suivant</span><ChevronRight size={18} /></> : <><Check size={18} /><span>Commencer</span></>}
        </AnimatedButton>
      </div>
    </div>
  );
}
