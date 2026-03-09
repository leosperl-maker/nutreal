import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { calculateNutritionPlan, LOCATION_OPTIONS, FOOD_PREFERENCE_OPTIONS, GROCERY_FREQUENCY_OPTIONS, getCurrencyForLocation } from '../lib/nutrition';
import { ChevronLeft, ChevronRight, Check, User, Ruler, Target, Activity, MapPin, ShoppingCart, Heart, Utensils, Clock, Home, Sparkles, Pill, Plus, Trash2 } from 'lucide-react';
import AnimatedButton from '../components/AnimatedButton';
import { useConfetti } from '../components/ConfettiExplosion';

type HealthDetail = 'musculaire' | 'osseux' | 'articulaire' | 'cerebral';

const ICON_MAP: Record<string, any> = {
  'Profil': User, 'Mensurations': Ruler, 'Objectif': Target, 'Activité': Activity,
  'Localisation': MapPin, 'Budget': ShoppingCart, 'Cuisine': Clock, 'Foyer': Home,
  'Santé': Heart, 'Aller plus loin': Sparkles,
  'Corps & articulations': Activity, 'Cycle menstruel': Heart, 'Médicaments': Pill,
  'Aliments': Utensils,
};

export default function Onboarding() {
  const { setProfile, setOnboardingComplete } = useStore();
  const { fireConfetti } = useConfetti();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', sex: 'M' as 'M' | 'F', birthDate: '1990-01-01', heightCm: 175,
    weightCurrentKg: 80, weightGoalKg: 75, activityLevel: 'moderate',
    medicalConditions: [] as string[], dietPreferences: [] as string[],
    location: 'guadeloupe', groceryBudget: 100, groceryCurrency: '€',
    foodPreferences: [] as string[], groceryFrequency: 'weekly',
    cookingTime: '30 min', householdSize: 1, familyMode: false,
    healthModules: [] as string[],
    healthDetails: { musculaire: [] as string[], osseux: [] as string[], articulaire: [] as string[], cerebral: [] as string[] },
    cycleData: null as { lastPeriodDate: string; cycleLength: number; periodLength: number } | null,
    medications: [] as { name: string; frequency: string; time: string }[],
  });

  // Dynamic steps based on selected health modules
  const steps = useMemo(() => {
    const base = ['Profil', 'Mensurations', 'Objectif', 'Activité', 'Localisation', 'Budget', 'Cuisine', 'Foyer', 'Santé', 'Aller plus loin'];
    if (form.healthModules.includes('muscle_joint')) base.push('Corps & articulations');
    if (form.healthModules.includes('cycle')) base.push('Cycle menstruel');
    if (form.healthModules.includes('medications')) base.push('Médicaments');
    base.push('Aliments');
    return base;
  }, [form.healthModules]);

  const Icon = ICON_MAP[steps[step]] || Heart;

  const update = (k: string, v: any) => {
    setForm(f => {
      const nf = { ...f, [k]: v };
      if (k === 'location') nf.groceryCurrency = getCurrencyForLocation(v);
      return nf;
    });
  };

  const toggleArr = (k: 'medicalConditions' | 'dietPreferences' | 'foodPreferences' | 'healthModules', v: string) => {
    setForm(f => ({ ...f, [k]: (f[k] as string[]).includes(v) ? (f[k] as string[]).filter(x => x !== v) : [...(f[k] as string[]), v] }));
  };

  const toggleHealthDetail = (cat: HealthDetail, v: string) => {
    setForm(f => ({
      ...f,
      healthDetails: {
        ...f.healthDetails,
        [cat]: f.healthDetails[cat].includes(v) ? f.healthDetails[cat].filter(x => x !== v) : [...f.healthDetails[cat], v],
      },
    }));
  };

  const addMedication = () => {
    setForm(f => ({ ...f, medications: [...f.medications, { name: '', frequency: '1x/jour', time: 'matin' }] }));
  };

  const updateMedication = (idx: number, field: string, value: string) => {
    setForm(f => ({ ...f, medications: f.medications.map((m, i) => i === idx ? { ...m, [field]: value } : m) }));
  };

  const removeMedication = (idx: number) => {
    setForm(f => ({ ...f, medications: f.medications.filter((_, i) => i !== idx) }));
  };

  const finish = () => {
    const plan = calculateNutritionPlan(form as any);
    setProfile({
      ...form,
      dailyCalorieBudget: plan.dailyCalorieBudget,
      macroTargets: plan.macroTargets,
      tdee: plan.tdee,
      estimatedGoalDate: plan.estimatedGoalDate,
    });
    fireConfetti({ origin: { x: 0.5, y: 0.7 }, particleCount: 160, spread: 90 });
    setTimeout(() => {
      fireConfetti({ angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, particleCount: 50 });
      fireConfetti({ angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, particleCount: 50 });
    }, 200);
    setOnboardingComplete(true);
  };

  const grouped = LOCATION_OPTIONS.reduce((acc, loc) => {
    if (!acc[loc.group]) acc[loc.group] = [];
    acc[loc.group].push(loc);
    return acc;
  }, {} as Record<string, typeof LOCATION_OPTIONS>);

  const currentStepName = steps[step];

  // Render step content based on step name (not index) for dynamic steps
  const renderStep = () => {
    switch (currentStepName) {
      case 'Profil':
        return (
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
        );

      case 'Mensurations':
        return (
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
        );

      case 'Objectif':
        return (
          <div>
            <label className="text-sm font-medium text-text-secondary mb-1 block">Poids objectif (kg)</label>
            <input type="number" value={form.weightGoalKg} onChange={e => update('weightGoalKg', +e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-xl border border-surface-300 focus:ring-2 focus:ring-primary-400 focus:outline-none text-text-primary" />
            <p className="text-xs text-text-muted mt-2">
              {form.weightGoalKg < form.weightCurrentKg ? `Objectif : perdre ${form.weightCurrentKg - form.weightGoalKg} kg` :
               form.weightGoalKg > form.weightCurrentKg ? `Objectif : prendre ${form.weightGoalKg - form.weightCurrentKg} kg` : 'Maintien du poids'}
            </p>
          </div>
        );

      case 'Activité':
        return (
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
        );

      case 'Localisation':
        return (
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
        );

      case 'Budget':
        return (
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
        );

      case 'Cuisine':
        return (
          <div className="space-y-4">
            <label className="text-sm font-medium text-text-secondary mb-2 block">Combien de temps souhaitez-vous cuisiner ?</label>
            <div className="space-y-2">
              {[
                { v: '15 min', l: '⚡ 15 minutes', d: 'Repas express et rapides' },
                { v: '30 min', l: '🍳 30 minutes', d: 'La plupart des recettes classiques' },
                { v: '45 min', l: '👨‍🍳 45 minutes', d: 'Plats mijotés et élaborés' },
                { v: '1h+', l: '🎯 1 heure ou plus', d: 'Cuisine gastronomique' },
                { v: 'no_limit', l: '♾️ Pas de limite', d: 'J\'aime prendre mon temps' },
              ].map(o => (
                <button key={o.v} onClick={() => update('cookingTime', o.v)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${form.cookingTime === o.v ? 'bg-primary-500 text-white shadow-float' : 'bg-white border border-surface-300'}`}>
                  <div className="font-medium text-sm">{o.l}</div>
                  <div className={`text-xs mt-0.5 ${form.cookingTime === o.v ? 'text-white/70' : 'text-text-muted'}`}>{o.d}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'Foyer':
        return (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-text-secondary mb-2 block">Combien de personnes mangent avec vous ?</label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => update('householdSize', n)}
                    className={`py-4 rounded-xl font-bold text-lg transition-all ${form.householdSize === n ? 'bg-primary-500 text-white shadow-float' : 'bg-white border border-surface-300 text-text-primary'}`}>
                    {n === 5 ? '5+' : n}
                  </button>
                ))}
              </div>
              <p className="text-xs text-text-muted mt-2">
                {form.householdSize === 1 ? 'Vous mangez seul(e)' : `${form.householdSize} personnes au foyer`}
              </p>
            </div>
            {form.householdSize > 1 && (
              <div>
                <label className="text-sm font-medium text-text-secondary mb-2 block">
                  Souhaitez-vous que tout le monde profite de vos repas ?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => update('familyMode', true)}
                    className={`p-4 rounded-xl text-left transition-all ${form.familyMode ? 'bg-primary-500 text-white shadow-float' : 'bg-white border border-surface-300'}`}>
                    <div className="font-medium text-sm">👨‍👩‍👧‍👦 Oui, mode famille</div>
                    <div className={`text-xs mt-1 ${form.familyMode ? 'text-white/70' : 'text-text-muted'}`}>Portions adaptées pour tous</div>
                  </button>
                  <button onClick={() => update('familyMode', false)}
                    className={`p-4 rounded-xl text-left transition-all ${!form.familyMode ? 'bg-primary-500 text-white shadow-float' : 'bg-white border border-surface-300'}`}>
                    <div className="font-medium text-sm">🧑 Non, juste pour moi</div>
                    <div className={`text-xs mt-1 ${!form.familyMode ? 'text-white/70' : 'text-text-muted'}`}>Repas individuels uniquement</div>
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'Santé':
        return (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-text-secondary block mb-2">Régime alimentaire</label>
              <div className="flex flex-wrap gap-2">
                {['Omnivore', 'Végétarien', 'Végan', 'Pescétarien', 'Sans gluten', 'Sans lactose', 'Halal', 'Casher', 'Keto', 'Paléo'].map(d => (
                  <button key={d} onClick={() => toggleArr('dietPreferences', d)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${form.dietPreferences.includes(d) ? 'bg-primary-500 text-white' : 'bg-white border border-surface-300 text-text-primary'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary block mb-2">Conditions médicales</label>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-text-muted mb-1.5">Métabolique</p>
                  <div className="flex flex-wrap gap-2">
                    {['Diabète', 'Hypertension', 'Cholestérol', 'Obésité'].map(c => (
                      <button key={c} onClick={() => toggleArr('medicalConditions', c)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${form.medicalConditions.includes(c) ? 'bg-warning-300 text-white' : 'bg-white border border-surface-300 text-text-primary'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1.5">Digestif</p>
                  <div className="flex flex-wrap gap-2">
                    {['Intolérances', 'Reflux gastrique', 'SII (côlon irritable)', 'Maladie cœliaque'].map(c => (
                      <button key={c} onClick={() => toggleArr('medicalConditions', c)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${form.medicalConditions.includes(c) ? 'bg-warning-300 text-white' : 'bg-white border border-surface-300 text-text-primary'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1.5">Allergies & hormonal</p>
                  <div className="flex flex-wrap gap-2">
                    {['Allergies alimentaires', 'Allergies respiratoires', 'Thyroïde', 'SOPK'].map(c => (
                      <button key={c} onClick={() => toggleArr('medicalConditions', c)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${form.medicalConditions.includes(c) ? 'bg-warning-300 text-white' : 'bg-white border border-surface-300 text-text-primary'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => { if (!form.medicalConditions.includes('Aucune')) { setForm(f => ({ ...f, medicalConditions: ['Aucune'] })); } }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${form.medicalConditions.includes('Aucune') ? 'bg-green-500 text-white' : 'bg-white border border-surface-300 text-text-primary'}`}>
                  ✅ Aucune condition
                </button>
              </div>
            </div>
          </div>
        );

      case 'Aller plus loin':
        return (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary mb-2">Ces modules sont optionnels et vous permettent un suivi personnalisé.</p>
            <div className="space-y-3">
              {[
                { id: 'muscle_joint', emoji: '🏋️', title: 'Santé musculaire & articulaire', desc: 'Suivez vos douleurs et adaptez vos exercices', show: true },
                { id: 'cycle', emoji: '🌸', title: 'Suivi du cycle menstruel', desc: 'Adaptez votre alimentation à votre cycle', show: form.sex === 'F' },
                { id: 'medications', emoji: '💊', title: 'Rappels médicaments', desc: 'Ne manquez plus aucune prise', show: true },
              ].filter(m => m.show).map(mod => {
                const selected = form.healthModules.includes(mod.id);
                return (
                  <motion.button key={mod.id} whileTap={{ scale: 0.97 }}
                    onClick={() => toggleArr('healthModules', mod.id)}
                    className={`w-full p-4 rounded-2xl text-left transition-all flex items-start gap-3 ${selected ? 'bg-primary-500 text-white shadow-float' : 'bg-white border border-surface-300'}`}>
                    <span className="text-2xl mt-0.5">{mod.emoji}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-sm flex items-center gap-2">
                        {mod.title}
                        {selected && <Check size={16} />}
                      </div>
                      <div className={`text-xs mt-0.5 ${selected ? 'text-white/70' : 'text-text-muted'}`}>{mod.desc}</div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
            <p className="text-xs text-text-muted text-center mt-4">
              Vous pouvez toujours activer ces modules plus tard dans vos réglages.
            </p>
          </div>
        );

      case 'Corps & articulations':
        return (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary mb-2">Sélectionnez ce qui vous concerne pour adapter vos recommandations.</p>
            {([
              { cat: 'osseux' as HealthDetail, emoji: '🦴', label: 'Osseux', items: ['Ostéoporose', 'Fracture récente', 'Hernie discale', 'Scoliose'] },
              { cat: 'musculaire' as HealthDetail, emoji: '💪', label: 'Musculaire', items: ['Douleurs dos', 'Tendinite', 'Crampes fréquentes', 'Fonte musculaire', 'Fibromyalgie'] },
              { cat: 'articulaire' as HealthDetail, emoji: '🦿', label: 'Articulaire', items: ['Arthrose', 'Douleur genou', 'Douleur épaule', 'Douleur hanche', 'Douleur cheville', 'Polyarthrite'] },
              { cat: 'cerebral' as HealthDetail, emoji: '🧠', label: 'Cérébral & nerveux', items: ['Migraines', 'Trouble du sommeil', 'Anxiété / stress', 'Vertiges', 'Épilepsie'] },
            ]).map(group => (
              <div key={group.cat}>
                <p className="text-xs font-semibold text-text-muted mb-1.5">{group.emoji} {group.label}</p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map(item => (
                    <button key={item} onClick={() => toggleHealthDetail(group.cat, item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${form.healthDetails[group.cat].includes(item) ? 'bg-primary-500 text-white' : 'bg-white border border-surface-300 text-text-primary'}`}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'Cycle menstruel':
        return (
          <div className="space-y-5">
            <p className="text-sm text-text-secondary">Ces informations permettent d'adapter vos recommandations nutritionnelles à votre cycle.</p>
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1 block">Date des dernières règles</label>
              <input type="date" value={form.cycleData?.lastPeriodDate || ''}
                onChange={e => setForm(f => ({ ...f, cycleData: { lastPeriodDate: e.target.value, cycleLength: f.cycleData?.cycleLength || 28, periodLength: f.cycleData?.periodLength || 5 } }))}
                className="w-full px-4 py-3 bg-white rounded-xl border border-surface-300 focus:ring-2 focus:ring-primary-400 focus:outline-none text-text-primary" />
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary mb-2 block">
                Durée moyenne du cycle : <span className="text-primary-500 font-bold">{form.cycleData?.cycleLength || 28} jours</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 15 }, (_, i) => i + 21).map(n => (
                  <button key={n} onClick={() => setForm(f => ({ ...f, cycleData: { lastPeriodDate: f.cycleData?.lastPeriodDate || '', cycleLength: n, periodLength: f.cycleData?.periodLength || 5 } }))}
                    className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${(form.cycleData?.cycleLength || 28) === n ? 'bg-primary-500 text-white shadow-float' : 'bg-white border border-surface-300 text-text-primary'}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary mb-2 block">
                Durée des règles : <span className="text-primary-500 font-bold">{form.cycleData?.periodLength || 5} jours</span>
              </label>
              <div className="flex gap-2">
                {Array.from({ length: 7 }, (_, i) => i + 2).map(n => (
                  <button key={n} onClick={() => setForm(f => ({ ...f, cycleData: { lastPeriodDate: f.cycleData?.lastPeriodDate || '', cycleLength: f.cycleData?.cycleLength || 28, periodLength: n } }))}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${(form.cycleData?.periodLength || 5) === n ? 'bg-primary-500 text-white shadow-float' : 'bg-white border border-surface-300 text-text-primary'}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'Médicaments':
        return (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">Ajoutez vos médicaments pour recevoir des rappels.</p>
            {form.medications.map((med, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-surface-200 p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <input value={med.name} onChange={e => updateMedication(idx, 'name', e.target.value)}
                    placeholder="Nom du médicament"
                    className="flex-1 px-3 py-2 bg-surface-50 rounded-xl border border-surface-300 text-sm focus:ring-2 focus:ring-primary-400 focus:outline-none text-text-primary" />
                  <button onClick={() => removeMedication(idx)} className="w-8 h-8 flex items-center justify-center text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex gap-2">
                  <select value={med.frequency} onChange={e => updateMedication(idx, 'frequency', e.target.value)}
                    className="flex-1 px-3 py-2 bg-surface-50 rounded-xl border border-surface-300 text-xs text-text-primary">
                    <option value="1x/jour">1x / jour</option>
                    <option value="2x/jour">2x / jour</option>
                    <option value="3x/jour">3x / jour</option>
                    <option value="1x/semaine">1x / semaine</option>
                  </select>
                  <select value={med.time} onChange={e => updateMedication(idx, 'time', e.target.value)}
                    className="flex-1 px-3 py-2 bg-surface-50 rounded-xl border border-surface-300 text-xs text-text-primary">
                    <option value="matin">Matin</option>
                    <option value="midi">Midi</option>
                    <option value="soir">Soir</option>
                    <option value="coucher">Au coucher</option>
                  </select>
                </div>
              </div>
            ))}
            <motion.button whileTap={{ scale: 0.97 }} onClick={addMedication}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-surface-300 text-sm font-medium text-text-muted flex items-center justify-center gap-2 hover:border-primary-400 hover:text-primary-500 transition-all">
              <Plus size={16} /> Ajouter un médicament
            </motion.button>
          </div>
        );

      case 'Aliments':
        return (
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
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface-100 flex flex-col">
      {/* Progress */}
      <div className="px-4 pt-12 pb-4">
        <div className="flex items-center gap-1 mb-2">
          {steps.map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i <= step ? 'bg-primary-500' : 'bg-surface-300'}`} />
          ))}
        </div>
        <p className="text-xs text-text-secondary text-center">{step + 1}/{steps.length} — {steps[step]}</p>
      </div>

      <div className="flex-1 px-4 pb-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }} className="max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center">
                <Icon size={24} className="text-primary-500" />
              </div>
              <h2 className="text-xl font-bold text-text-primary font-display">{steps[step]}</h2>
            </div>

            {renderStep()}
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
        <AnimatedButton onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : finish()}
          className="flex-1 py-3.5 text-sm flex items-center justify-center gap-2"
          disabled={step === 0 && !form.name}>
          {step < steps.length - 1 ? <><span>Suivant</span><ChevronRight size={18} /></> : <><Check size={18} /><span>Commencer</span></>}
        </AnimatedButton>
      </div>
    </div>
  );
}
