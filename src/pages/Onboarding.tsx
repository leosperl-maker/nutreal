import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { DetailedHealthIssue } from '../store/useStore';
import { calculateNutritionPlan, LOCATION_OPTIONS, FOOD_PREFERENCE_OPTIONS, GROCERY_FREQUENCY_OPTIONS, getCurrencyForLocation } from '../lib/nutrition';
import { ChevronLeft, ChevronRight, Check, User, Ruler, Target, Activity, MapPin, ShoppingCart, Heart, Utensils, Clock, Home, Sparkles, Pill, Plus, Trash2, FileText, Loader2 } from 'lucide-react';
import AnimatedButton from '../components/AnimatedButton';
import Icon3D from '../components/Icon3D';
import { celebrateOnboarding, haptic } from '../lib/celebrations';

type HealthDetail = 'musculaire' | 'osseux' | 'articulaire' | 'cerebral';

const ICON_MAP: Record<string, any> = {
  'Goal': Target, 'Motivation': Heart, 'RepasHabitudes': Utensils, 'CuisineRelation': Clock,
  'Lifestyle': Activity, 'Rythme': Target, 'Engagement': Sparkles, 'Calcul': Loader2, 'Résultat': Check,
  'Profil': User, 'Mensurations': Ruler, 'Objectif': Target, 'Activité': Activity,
  'Localisation': MapPin, 'Budget': ShoppingCart, 'Cuisine': Clock, 'Foyer': Home,
  'Santé': Heart, 'Aller plus loin': Sparkles,
  'Corps & articulations': Activity, 'Détails conditions': FileText,
  'Cycle menstruel': Heart, 'Médicaments': Pill,
  'Aliments': Utensils,
};

const GOALS = [
  { value: 'lose_weight', icon: 'directHit', label: 'Perdre du poids', desc: 'Atteindre un poids santé' },
  { value: 'gain_muscle', icon: 'flexedBiceps', label: 'Prendre du muscle', desc: 'Se tonifier et gagner en force' },
  { value: 'eat_healthy', icon: 'greenSalad', label: 'Manger plus sainement', desc: 'Améliorer mon alimentation' },
  { value: 'maintain', icon: 'balanceScale', label: 'Maintenir mon poids', desc: 'Garder mes acquis' },
  { value: 'medical', icon: 'hospital', label: 'Raison médicale', desc: 'Diabète, cholestérol, etc.' },
];

const MOTIVATIONS = [
  { value: 'health', icon: 'heart', label: 'Ma santé' },
  { value: 'confidence', icon: 'sparkles', label: 'Confiance en moi' },
  { value: 'energy', icon: 'highVoltage', label: "Plus d'énergie" },
  { value: 'sport', icon: 'personLiftingWeights', label: 'Performance sportive' },
  { value: 'clothes', icon: 'tShirt', label: 'Mes vêtements' },
  { value: 'example', icon: 'raisingHands', label: 'Être un exemple' },
  { value: 'wellbeing', icon: 'lotus', label: 'Bien-être' },
  { value: 'medical', icon: 'stethoscope', label: 'Raison médicale' },
];

const COOKING_STYLES = [
  { value: 'love_cooking', icon: 'cook', label: "J'adore cuisiner", desc: 'Recettes élaborées bienvenues' },
  { value: 'order_often', icon: 'takeoutBox', label: 'Je commande souvent', desc: 'Plats à emporter, livraison' },
  { value: 'want_quick', icon: 'timerClock', label: 'Je veux du rapide', desc: '15 min max en cuisine' },
  { value: 'love_discover', icon: 'globeShowingEuropeAfrica', label: "J'aime découvrir", desc: 'Nouvelles cuisines et saveurs' },
];

const CALC_STEPS = [
  { label: 'Analyse de votre métabolisme...', delay: 500 },
  { label: 'Calcul de vos besoins caloriques...', delay: 1200 },
  { label: 'Personnalisation de votre plan...', delay: 1900 },
  { label: 'Adaptation à vos habitudes...', delay: 2600 },
  { label: 'Préparation de vos objectifs...', delay: 3300 },
];

const STEP_LABELS: Record<string, string> = {
  'Goal': 'Mon objectif',
  'Motivation': 'Mes motivations',
  'RepasHabitudes': 'Mes habitudes',
  'CuisineRelation': 'Ma cuisine',
  'Lifestyle': 'Mon quotidien',
  'Rythme': 'Mon rythme',
  'Engagement': 'Mon engagement',
  'Calcul': 'Calcul en cours...',
  'Résultat': 'Votre plan',
};

export default function Onboarding() {
  const { setProfile, setDetailedHealthIssues } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [calcStepsDone, setCalcStepsDone] = useState(0);
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
    detailedIssues: [] as DetailedHealthIssue[],
    // New fields
    goal: 'lose_weight',
    motivation: [] as string[],
    mealsPerDay: '3',
    snackingHabit: 'sometimes',
    cookedMealsFrequency: 'sometimes',
    cookingRelation: 'want_quick',
    sleepHours: '7_8',
    stressLevel: 'medium',
    waterHabit: 'normal',
    alcoholFrequency: 'never',
    pace: 'moderate',
  });

  // Dynamic steps based on selected health modules
  const steps = useMemo(() => {
    const base = ['Goal', 'Motivation', 'Profil', 'Mensurations', 'Objectif', 'RepasHabitudes', 'CuisineRelation', 'Lifestyle', 'Activité', 'Localisation', 'Budget', 'Cuisine', 'Foyer', 'Santé', 'Aller plus loin'];
    if (form.healthModules.includes('muscle_joint')) {
      base.push('Corps & articulations');
      base.push('Détails conditions');
    }
    if (form.healthModules.includes('cycle')) base.push('Cycle menstruel');
    if (form.healthModules.includes('medications')) base.push('Médicaments');
    base.push('Aliments', 'Rythme', 'Engagement', 'Calcul', 'Résultat');
    return base;
  }, [form.healthModules]);

  const currentStepName = steps[step];
  const Icon = ICON_MAP[currentStepName] || Heart;

  // Calculating animation effect
  React.useEffect(() => {
    if (currentStepName !== 'Calcul') return;
    setCalcStepsDone(0);
    const timers = CALC_STEPS.map((cs, i) => setTimeout(() => setCalcStepsDone(i + 1), cs.delay));
    const advance = setTimeout(() => setStep(s => s + 1), 4200);
    return () => { timers.forEach(clearTimeout); clearTimeout(advance); };
  }, [currentStepName]);

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

  // Detailed health issues helpers
  const getAllSelectedConditions = (): string[] => {
    const conditions: string[] = [];
    for (const cat of Object.keys(form.healthDetails) as HealthDetail[]) {
      conditions.push(...form.healthDetails[cat]);
    }
    return conditions;
  };

  const updateDetailedIssue = (condition: string, field: keyof DetailedHealthIssue, value: any) => {
    setForm(f => {
      const existing = f.detailedIssues.find(i => i.condition === condition);
      if (existing) {
        return { ...f, detailedIssues: f.detailedIssues.map(i => i.condition === condition ? { ...i, [field]: value } : i) };
      }
      const newIssue: DetailedHealthIssue = { condition, location: '', duration: '', doctorConsulted: false, treatments: [], freeText: '' };
      (newIssue as any)[field] = value;
      return { ...f, detailedIssues: [...f.detailedIssues, newIssue] };
    });
  };

  const getIssueField = (condition: string): DetailedHealthIssue => {
    return form.detailedIssues.find(i => i.condition === condition) || { condition, location: '', duration: '', doctorConsulted: false, treatments: [], freeText: '' };
  };

  const finish = () => {
    const plan = calculateNutritionPlan(form as any);
    setProfile({
      ...form,
      dailyCalorieTarget: plan.dailyCalorieTarget,
      macroTargets: plan.macroTargets,
      tdee: plan.tdee,
      estimatedGoalDate: plan.estimatedGoalDate,
    });
    if (form.detailedIssues.length > 0) {
      setDetailedHealthIssues(form.detailedIssues);
    }
    celebrateOnboarding();
    navigate('/loading');
  };

  const grouped = LOCATION_OPTIONS.reduce((acc, loc) => {
    if (!acc[loc.group]) acc[loc.group] = [];
    acc[loc.group].push(loc);
    return acc;
  }, {} as Record<string, typeof LOCATION_OPTIONS>);

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
                {[{ v: 'M', l: 'Homme' }, { v: 'F', l: 'Femme' }].map(o => (
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
            {[{ v: 'sedentary', l: 'Sédentaire', icon: null, d: 'Bureau, peu de mouvement' },
              { v: 'light', l: 'Légèrement actif', icon: 'personWalking', d: '1-2 séances/semaine' },
              { v: 'moderate', l: 'Modérément actif', icon: 'personRunning', d: '3-5 séances/semaine' },
              { v: 'active', l: 'Actif', icon: 'flexedBiceps', d: '6-7 séances/semaine' },
              { v: 'very_active', l: 'Très actif', icon: 'fire', d: 'Athlète, travail physique' }].map(o => (
              <button key={o.v} onClick={() => update('activityLevel', o.v)}
                className={`w-full p-4 rounded-xl text-left transition-all ${form.activityLevel === o.v ? 'bg-primary-500 text-white shadow-float' : 'bg-white border border-surface-300'}`}>
                <div className="font-medium text-sm flex items-center gap-1.5">{o.icon && <Icon3D name={o.icon} size={16} />}{o.l}</div>
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
                      className={`p-3 rounded-xl text-left text-sm transition-all flex items-center gap-1.5 ${form.location === loc.value ? 'bg-primary-500 text-white shadow-float' : 'bg-white border border-surface-300'}`}>
                      <Icon3D name={loc.emoji} size={16} /> {loc.label}
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
                    className={`w-full p-3 rounded-xl text-left text-sm transition-all flex items-center gap-1.5 ${form.groceryFrequency === o.value ? 'bg-primary-500 text-white shadow-float' : 'bg-white border border-surface-300'}`}>
                    <Icon3D name={o.emoji} size={16} /> {o.label} — <span className={form.groceryFrequency === o.value ? 'text-white/70' : 'text-text-muted'}>{o.desc}</span>
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
                { v: '15 min', l: '15 minutes', icon: 'highVoltage', d: 'Repas express et rapides' },
                { v: '30 min', l: '30 minutes', icon: null, d: 'La plupart des recettes classiques' },
                { v: '45 min', l: '45 minutes', icon: null, d: 'Plats mijotés et élaborés' },
                { v: '1h+', l: '1 heure ou plus', icon: 'bullseye', d: 'Cuisine gastronomique' },
                { v: 'no_limit', l: 'Pas de limite', icon: null, d: 'J\'aime prendre mon temps' },
              ].map(o => (
                <button key={o.v} onClick={() => update('cookingTime', o.v)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${form.cookingTime === o.v ? 'bg-primary-500 text-white shadow-float' : 'bg-white border border-surface-300'}`}>
                  <div className="font-medium text-sm flex items-center gap-1.5">{o.icon && <Icon3D name={o.icon} size={16} />}{o.l}</div>
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
                    <div className="font-medium text-sm">Oui, mode famille</div>
                    <div className={`text-xs mt-1 ${form.familyMode ? 'text-white/70' : 'text-text-muted'}`}>Portions adaptées pour tous</div>
                  </button>
                  <button onClick={() => update('familyMode', false)}
                    className={`p-4 rounded-xl text-left transition-all ${!form.familyMode ? 'bg-primary-500 text-white shadow-float' : 'bg-white border border-surface-300'}`}>
                    <div className="font-medium text-sm">Non, juste pour moi</div>
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
                  Aucune condition
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
                { id: 'muscle_joint', emoji: 'personLiftingWeights', title: 'Santé musculaire & articulaire', desc: 'Suivez vos douleurs et adaptez vos exercices', show: true },
                { id: 'cycle', emoji: 'cherryBlossom', title: 'Suivi du cycle menstruel', desc: 'Adaptez votre alimentation à votre cycle', show: form.sex === 'F' },
                { id: 'medications', emoji: 'pill', title: 'Rappels médicaments', desc: 'Ne manquez plus aucune prise', show: true },
              ].filter(m => m.show).map(mod => {
                const selected = form.healthModules.includes(mod.id);
                return (
                  <motion.button key={mod.id} whileTap={{ scale: 0.97 }}
                    onClick={() => toggleArr('healthModules', mod.id)}
                    className={`w-full p-4 rounded-2xl text-left transition-all flex items-start gap-3 ${selected ? 'bg-primary-500 text-white shadow-float' : 'bg-white border border-surface-300'}`}>
                    <span className="mt-0.5"><Icon3D name={mod.emoji} size={28} /></span>
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
              { cat: 'osseux' as HealthDetail, emoji: 'bone', label: 'Osseux', items: ['Ostéoporose', 'Fracture récente', 'Hernie discale', 'Scoliose'] },
              { cat: 'musculaire' as HealthDetail, emoji: 'flexedBiceps', label: 'Musculaire', items: ['Douleurs dos', 'Tendinite', 'Crampes fréquentes', 'Fonte musculaire', 'Fibromyalgie'] },
              { cat: 'articulaire' as HealthDetail, emoji: 'mechanicalLeg', label: 'Articulaire', items: ['Arthrose', 'Douleur genou', 'Douleur épaule', 'Douleur hanche', 'Douleur cheville', 'Polyarthrite'] },
              { cat: 'cerebral' as HealthDetail, emoji: 'brain', label: 'Cérébral & nerveux', items: ['Migraines', 'Trouble du sommeil', 'Anxiété / stress', 'Vertiges', 'Épilepsie'] },
            ]).map(group => (
              <div key={group.cat}>
                <p className="text-xs font-semibold text-text-muted mb-1.5 flex items-center gap-1"><Icon3D name={group.emoji} size={16} /> {group.label}</p>
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

      case 'Détails conditions': {
        const conditions = getAllSelectedConditions();
        if (conditions.length === 0) {
          return (
            <div className="text-center py-8">
              <p className="text-sm text-text-muted">Aucune condition sélectionnée.</p>
              <p className="text-xs text-text-muted mt-2">Vous pouvez passer cette étape.</p>
            </div>
          );
        }
        return (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">Plus vous êtes précis, mieux l'IA pourra vous accompagner.</p>
            {conditions.map(condition => {
              const issue = getIssueField(condition);
              return (
                <div key={condition} className="bg-white rounded-2xl border border-surface-200 p-4 space-y-3">
                  <h4 className="text-sm font-bold text-text-primary">{condition}</h4>

                  <div>
                    <label className="text-xs text-text-muted block mb-1">Localisation précise</label>
                    <input value={issue.location} onChange={e => updateDetailedIssue(condition, 'location', e.target.value)}
                      placeholder="Ex: bas du dos, genou droit..."
                      className="w-full px-3 py-2 bg-surface-50 rounded-xl border border-surface-300 text-sm focus:ring-2 focus:ring-primary-400 focus:outline-none text-text-primary" />
                  </div>

                  <div>
                    <label className="text-xs text-text-muted block mb-1">Depuis combien de temps ?</label>
                    <div className="flex flex-wrap gap-2">
                      {['< 1 mois', '1-6 mois', '6-12 mois', '1-3 ans', '3+ ans'].map(d => (
                        <button key={d} onClick={() => updateDetailedIssue(condition, 'duration', d)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${issue.duration === d ? 'bg-primary-500 text-white' : 'bg-surface-50 border border-surface-300 text-text-primary'}`}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-text-muted block mb-1">Médecin consulté ?</label>
                    <div className="flex gap-2">
                      {[{ v: true, l: 'Oui' }, { v: false, l: 'Non' }].map(o => (
                        <button key={String(o.v)} onClick={() => updateDetailedIssue(condition, 'doctorConsulted', o.v)}
                          className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${issue.doctorConsulted === o.v ? 'bg-primary-500 text-white' : 'bg-surface-50 border border-surface-300 text-text-primary'}`}>
                          {o.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-text-muted block mb-1">Traitements essayés</label>
                    <div className="flex flex-wrap gap-2">
                      {['Kinésithérapie', 'Médicaments', 'Chirurgie', 'Ostéopathie', 'Repos', 'Autre'].map(t => (
                        <button key={t} onClick={() => {
                          const current = issue.treatments;
                          const updated = current.includes(t) ? current.filter(x => x !== t) : [...current, t];
                          updateDetailedIssue(condition, 'treatments', updated);
                        }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${issue.treatments.includes(t) ? 'bg-primary-500 text-white' : 'bg-surface-50 border border-surface-300 text-text-primary'}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-text-muted block mb-1">Autre chose à préciser ?</label>
                    <textarea value={issue.freeText || ''} onChange={e => updateDetailedIssue(condition, 'freeText', e.target.value)}
                      placeholder="Décrivez votre situation..."
                      rows={2}
                      className="w-full px-3 py-2 bg-surface-50 rounded-xl border border-surface-300 text-sm focus:ring-2 focus:ring-primary-400 focus:outline-none text-text-primary resize-none" />
                  </div>
                </div>
              );
            })}
          </div>
        );
      }

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

      case 'Goal':
        return (
          <div className="space-y-3">
            {GOALS.map(g => (
              <motion.button key={g.value} whileTap={{ scale: 0.97 }}
                onClick={() => { update('goal', g.value); setTimeout(() => setStep(s => s + 1), 150); }}
                className={`w-full p-4 rounded-2xl text-left transition-all flex items-center gap-4 ${form.goal === g.value ? 'bg-primary-500 text-white shadow-float' : 'bg-white border border-surface-300'}`}>
                <Icon3D name={g.icon} size={36} />
                <div className="flex-1">
                  <div className="font-semibold">{g.label}</div>
                  <div className={`text-xs mt-0.5 ${form.goal === g.value ? 'text-white/70' : 'text-text-muted'}`}>{g.desc}</div>
                </div>
                {form.goal === g.value && <Check size={18} />}
              </motion.button>
            ))}
          </div>
        );

      case 'Motivation':
        return (
          <div>
            <p className="text-sm text-text-secondary mb-4">Ce qui vous motive (plusieurs choix possible)</p>
            <div className="grid grid-cols-2 gap-2">
              {MOTIVATIONS.map(m => {
                const sel = form.motivation.includes(m.value);
                return (
                  <motion.button key={m.value} whileTap={{ scale: 0.97 }}
                    onClick={() => setForm(f => ({ ...f, motivation: sel ? f.motivation.filter(x => x !== m.value) : [...f.motivation, m.value] }))}
                    className={`p-4 rounded-2xl text-center transition-all flex flex-col items-center gap-2 ${sel ? 'bg-primary-500 text-white shadow-float' : 'bg-white border border-surface-300'}`}>
                    <Icon3D name={m.icon} size={32} />
                    <div className="text-xs font-semibold">{m.label}</div>
                    {sel && <Check size={12} />}
                  </motion.button>
                );
              })}
            </div>
          </div>
        );

      case 'RepasHabitudes':
        return (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-text-primary mb-3 block">Combien de repas par jour ?</label>
              <div className="flex gap-2">
                {['2', '3', '4', '5+'].map(v => (
                  <button key={v} onClick={() => update('mealsPerDay', v)}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${form.mealsPerDay === v ? 'bg-primary-500 text-white shadow-float' : 'bg-white border border-surface-300 text-text-primary'}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-text-primary mb-3 block">Vous grignotez entre les repas ?</label>
              <div className="space-y-2">
                {[
                  { v: 'never', l: 'Jamais', icon: 'leafyGreen' },
                  { v: 'sometimes', l: 'Parfois', icon: 'sparkles' },
                  { v: 'often', l: 'Souvent', icon: 'forkAndKnife' },
                ].map(o => (
                  <button key={o.v} onClick={() => update('snackingHabit', o.v)}
                    className={`w-full p-3 rounded-xl text-left text-sm flex items-center gap-3 transition-all ${form.snackingHabit === o.v ? 'bg-primary-500 text-white shadow-float' : 'bg-white border border-surface-300'}`}>
                    <Icon3D name={o.icon} size={20} /> {o.l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-text-primary mb-3 block">Vous cuisinez maison ?</label>
              <div className="space-y-2">
                {[
                  { v: 'always', l: 'Toujours ou presque', icon: 'forkAndKnife' },
                  { v: 'sometimes', l: 'La moitié du temps', icon: 'takeoutBox' },
                  { v: 'rarely', l: 'Rarement', icon: 'highVoltage' },
                ].map(o => (
                  <button key={o.v} onClick={() => update('cookedMealsFrequency', o.v)}
                    className={`w-full p-3 rounded-xl text-left text-sm flex items-center gap-3 transition-all ${form.cookedMealsFrequency === o.v ? 'bg-primary-500 text-white shadow-float' : 'bg-white border border-surface-300'}`}>
                    <Icon3D name={o.icon} size={20} /> {o.l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'CuisineRelation':
        return (
          <div className="space-y-3">
            {COOKING_STYLES.map(cs => (
              <motion.button key={cs.value} whileTap={{ scale: 0.97 }}
                onClick={() => { update('cookingRelation', cs.value); setTimeout(() => setStep(s => s + 1), 150); }}
                className={`w-full p-4 rounded-2xl text-left transition-all flex items-center gap-4 ${form.cookingRelation === cs.value ? 'bg-primary-500 text-white shadow-float' : 'bg-white border border-surface-300'}`}>
                <Icon3D name={cs.icon} size={36} />
                <div className="flex-1">
                  <div className="font-semibold text-sm">{cs.label}</div>
                  <div className={`text-xs mt-0.5 ${form.cookingRelation === cs.value ? 'text-white/70' : 'text-text-muted'}`}>{cs.desc}</div>
                </div>
                {form.cookingRelation === cs.value && <Check size={18} />}
              </motion.button>
            ))}
          </div>
        );

      case 'Lifestyle':
        return (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-text-primary mb-3 block">Heures de sommeil</label>
              <div className="space-y-2">
                {[
                  { v: 'less_5', l: 'Moins de 5h', desc: 'Souvent en manque' },
                  { v: '5_6', l: '5 à 6h', desc: 'Un peu insuffisant' },
                  { v: '7_8', l: '7 à 8h', desc: 'Idéal' },
                  { v: '9plus', l: '9h ou plus', desc: 'Vous dormez beaucoup' },
                ].map(o => (
                  <button key={o.v} onClick={() => update('sleepHours', o.v)}
                    className={`w-full p-3 rounded-xl text-left text-sm flex items-center justify-between transition-all ${form.sleepHours === o.v ? 'bg-primary-500 text-white shadow-float' : 'bg-white border border-surface-300'}`}>
                    <span className="font-medium">{o.l}</span>
                    <span className={`text-xs ${form.sleepHours === o.v ? 'text-white/70' : 'text-text-muted'}`}>{o.desc}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-text-primary mb-3 block">Niveau de stress</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { v: 'low', l: 'Faible' }, { v: 'medium', l: 'Modéré' },
                  { v: 'high', l: 'Élevé' }, { v: 'very_high', l: 'Très élevé' },
                ].map(o => (
                  <button key={o.v} onClick={() => update('stressLevel', o.v)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${form.stressLevel === o.v ? 'bg-primary-500 text-white shadow-float' : 'bg-white border border-surface-300 text-text-primary'}`}>
                    {o.l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-text-primary mb-3 block">Hydratation quotidienne</label>
              <div className="space-y-2">
                {[
                  { v: 'low', l: 'Peu hydraté(e)', desc: '< 1L/jour' },
                  { v: 'normal', l: 'Normal', desc: '1 à 1.5L' },
                  { v: 'good', l: 'Bien hydraté(e)', desc: '1.5 à 2L' },
                  { v: 'excellent', l: 'Très bien hydraté(e)', desc: '> 2L' },
                ].map(o => (
                  <button key={o.v} onClick={() => update('waterHabit', o.v)}
                    className={`w-full p-3 rounded-xl text-left text-sm flex items-center justify-between transition-all ${form.waterHabit === o.v ? 'bg-primary-500 text-white shadow-float' : 'bg-white border border-surface-300'}`}>
                    <span className="font-medium">{o.l}</span>
                    <span className={`text-xs ${form.waterHabit === o.v ? 'text-white/70' : 'text-text-muted'}`}>{o.desc}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-text-primary mb-3 block">Alcool</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { v: 'never', l: 'Jamais' }, { v: 'occasional', l: 'Occasionnel' },
                  { v: 'weekly', l: 'Hebdomadaire' }, { v: 'regular', l: 'Régulier' },
                ].map(o => (
                  <button key={o.v} onClick={() => update('alcoholFrequency', o.v)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${form.alcoholFrequency === o.v ? 'bg-primary-500 text-white shadow-float' : 'bg-white border border-surface-300 text-text-primary'}`}>
                    {o.l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'Rythme': {
        const wDiff = form.weightCurrentKg - form.weightGoalKg;
        const calcWeeks = (defPerDay: number) => defPerDay > 0 ? Math.round((Math.abs(wDiff) * 7700) / (defPerDay * 7)) : 0;
        return (
          <div className="space-y-4">
            {form.goal !== 'lose_weight' && (
              <div className="bg-primary-50 rounded-2xl p-4 text-sm text-primary-700">
                Cette étape s'applique surtout à la perte de poids. Votre plan sera optimisé selon vos objectifs.
              </div>
            )}
            <div className="space-y-3">
              {[
                { v: 'slow', l: 'Progressif', icon: 'sparkles', deficit: 250, desc: 'Durable et sans frustration' },
                { v: 'moderate', l: 'Équilibré', icon: 'directHit', deficit: 500, desc: 'Meilleur rapport effort/résultat', recommended: true },
                { v: 'fast', l: 'Intensif', icon: 'fire', deficit: 750, desc: 'Résultats rapides, plus de discipline' },
              ].map(pace => (
                <motion.button key={pace.v} whileTap={{ scale: 0.97 }}
                  onClick={() => update('pace', pace.v)}
                  className={`w-full p-4 rounded-2xl text-left transition-all ${form.pace === pace.v ? 'bg-primary-500 text-white shadow-float' : 'bg-white border border-surface-300'}`}>
                  <div className="flex items-center gap-3 mb-1">
                    <Icon3D name={pace.icon} size={28} />
                    <div className="flex-1">
                      <div className="font-semibold flex items-center gap-2">
                        {pace.l}
                        {(pace as any).recommended && <span className="text-xs bg-green-400 text-white px-2 py-0.5 rounded-full">Recommandé</span>}
                      </div>
                      <div className={`text-xs ${form.pace === pace.v ? 'text-white/70' : 'text-text-muted'}`}>{pace.desc}</div>
                    </div>
                    {form.pace === pace.v && <Check size={18} />}
                  </div>
                  {wDiff > 0 && form.goal === 'lose_weight' && (
                    <div className={`text-xs mt-2 border-t pt-2 ${form.pace === pace.v ? 'text-white/80 border-white/20' : 'text-text-muted border-surface-200'}`}>
                      -{pace.deficit} kcal/jour · Objectif en ~{calcWeeks(pace.deficit)} semaines
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        );
      }

      case 'Engagement':
        return (
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl p-6 text-white text-center">
              <div className="mb-3 flex justify-center"><Icon3D name="sparkles" size={48} /></div>
              <h3 className="text-xl font-bold font-display mb-2">
                {form.name ? `${form.name}, vous y êtes presque !` : 'Vous y êtes presque !'}
              </h3>
              <p className="text-white/80 text-sm">Votre plan personnalisé est prêt à être calculé</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { stat: '94%', label: 'atteignent leur objectif' },
                { stat: '3×', label: 'plus rapide avec un coach IA' },
                { stat: '14j', label: 'pour les premiers résultats' },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-3 text-center border border-surface-200">
                  <div className="text-xl font-black text-primary-500">{s.stat}</div>
                  <div className="text-xs text-text-muted mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-surface-200 p-4 space-y-3">
              {[
                'Je vais suivre mes repas chaque jour',
                'Je suis prêt(e) à faire de petits efforts réguliers',
                'Je vais me peser 1×/semaine pour suivre mes progrès',
              ].map((txt, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-text-primary">
                  <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-primary-500" />
                  </div>
                  {txt}
                </div>
              ))}
            </div>
          </div>
        );

      case 'Calcul':
        return (
          <div className="py-8">
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 size={32} className="text-primary-500" />
              </motion.div>
              <h3 className="text-lg font-bold text-text-primary">Calcul en cours...</h3>
              <p className="text-sm text-text-muted mt-1">NutReal prépare votre plan sur mesure</p>
            </div>
            <div className="space-y-3">
              {CALC_STEPS.map((cs, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0.3 }}
                  animate={i < calcStepsDone ? { opacity: 1 } : { opacity: 0.3 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-surface-200">
                  {i < calcStepsDone ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check size={14} className="text-white" />
                    </motion.div>
                  ) : (
                    <div className="w-6 h-6 bg-surface-200 rounded-full flex-shrink-0" />
                  )}
                  <span className={`text-sm ${i < calcStepsDone ? 'text-text-primary font-medium' : 'text-text-muted'}`}>{cs.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'Résultat': {
        const plan = calculateNutritionPlan(form as any);
        const isGain = form.goal === 'gain_muscle';
        const svgPoints = Array.from({ length: 6 }, (_, i) => {
          const p = i / 5;
          return {
            x: parseFloat((20 + p * 270).toFixed(1)),
            y: parseFloat((isGain ? 100 - p * 80 : 20 + p * 80).toFixed(1)),
          };
        });
        const svgPts = svgPoints.map(pt => `${pt.x},${pt.y}`).join(' ');
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl p-5 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Icon3D name="partyPopper" size={40} />
                <div>
                  <h3 className="font-bold text-lg font-display">{form.name ? `Bravo ${form.name} !` : 'Votre plan est prêt !'}</h3>
                  <p className="text-white/80 text-sm">Plan nutritionnel personnalisé</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/20 rounded-2xl p-3">
                  <div className="text-2xl font-black">{plan.dailyCalorieTarget}</div>
                  <div className="text-xs text-white/70">kcal / jour</div>
                </div>
                <div className="bg-white/20 rounded-2xl p-3">
                  <div className="text-2xl font-black">{plan.macroTargets.protein_g}g</div>
                  <div className="text-xs text-white/70">protéines / jour</div>
                </div>
              </div>
            </div>
            {plan.estimatedWeeksToGoal > 0 && (
              <div className="bg-white rounded-2xl border border-surface-200 p-4">
                <h4 className="text-sm font-semibold text-text-primary mb-3">Votre progression estimée</h4>
                <svg viewBox="0 0 310 125" className="w-full">
                  <defs>
                    <linearGradient id="svgGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#7B5EA7" />
                      <stop offset="100%" stopColor="#2E9E6B" />
                    </linearGradient>
                  </defs>
                  <polyline points={svgPts} fill="none" stroke="url(#svgGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  {svgPoints.map((pt, i) => (
                    <circle key={i} cx={pt.x} cy={pt.y} r={i === 0 || i === 5 ? 5 : 3} fill={i === 5 ? '#2E9E6B' : '#7B5EA7'} />
                  ))}
                  <text x="18" y={isGain ? '118' : '15'} fontSize="9" fill="#9CA3AF">{form.weightCurrentKg}kg</text>
                  <text x="262" y={isGain ? '15' : '118'} fontSize="9" fill="#2E9E6B">{form.weightGoalKg}kg</text>
                </svg>
                <p className="text-xs text-text-muted text-center">Objectif estimé en ~{plan.estimatedWeeksToGoal} semaines</p>
              </div>
            )}
            <div className="bg-white rounded-2xl border border-surface-200 p-4 space-y-2">
              {[
                { label: 'Métabolisme de base', value: `${plan.bmr} kcal` },
                { label: 'Dépense totale', value: `${plan.tdee} kcal` },
                { label: 'Votre objectif', value: `${plan.dailyCalorieTarget} kcal`, highlight: true },
              ].map((row, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-text-muted">{row.label}</span>
                  <span className={row.highlight ? 'font-bold text-primary-500' : 'font-medium text-text-primary'}>{row.value}</span>
                </div>
              ))}
            </div>
            <AnimatedButton onClick={finish}
              className="w-full py-4 text-base font-bold flex items-center justify-center gap-2">
              <Icon3D name="rocket" size={22} /> C'est parti !
            </AnimatedButton>
          </div>
        );
      }

      case 'Aliments':
        return (
          <div>
            <p className="text-sm text-text-secondary mb-3">Sélectionnez vos aliments préférés</p>
            <div className="flex flex-wrap gap-2">
              {FOOD_PREFERENCE_OPTIONS.map(f => (
                <button key={f.value} onClick={() => toggleArr('foodPreferences', f.value)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${form.foodPreferences.includes(f.value) ? 'bg-primary-500 text-white' : 'bg-white border border-surface-300 text-text-primary'}`}>
                  <Icon3D name={f.emoji} size={16} /> {f.label}
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
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 bg-surface-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.round(((step + 1) / steps.length) * 100)}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <span className="text-xs font-semibold text-primary-500 w-9 text-right">
            {Math.round(((step + 1) / steps.length) * 100)}%
          </span>
        </div>
        <p className="text-xs text-text-secondary text-center">{STEP_LABELS[currentStepName] || currentStepName}</p>
      </div>

      <div className="flex-1 px-4 pb-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }} className="max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center">
                <Icon size={24} className="text-primary-500" />
              </div>
              <h2 className="text-xl font-bold text-text-primary font-display">{STEP_LABELS[currentStepName] || currentStepName}</h2>
            </div>

            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation — hidden on Calcul (auto-advance) and Résultat (has its own CTA) */}
      {currentStepName !== 'Calcul' && currentStepName !== 'Résultat' && (
        <div className="px-4 pb-8 pt-2 flex gap-3 max-w-md mx-auto w-full">
          {step > 0 && (
            <AnimatedButton variant="secondary" onClick={() => { haptic('light'); setStep(s => s - 1); }} className="px-6 py-3 text-sm">
              <ChevronLeft size={18} />
            </AnimatedButton>
          )}
          <AnimatedButton onClick={() => { haptic('light'); setStep(s => s + 1); }}
            className="flex-1 py-3.5 text-sm flex items-center justify-center gap-2"
            disabled={currentStepName === 'Motivation' && form.motivation.length === 0}>
            <span>Suivant</span><ChevronRight size={18} />
          </AnimatedButton>
        </div>
      )}
    </div>
  );
}
