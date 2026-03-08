import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { analyzeWithGemini, isGeminiConfigured } from '../lib/gemini';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import SuccessCheckmark from '../components/SuccessCheckmark';
import { Camera, Barcode, Upload, Loader2, AlertCircle, Plus, X } from 'lucide-react';

const MEAL_TYPES = [
  { value: 'breakfast', label: '🌅 Petit-déj' },
  { value: 'lunch', label: '☀️ Déjeuner' },
  { value: 'snack', label: '🍎 Collation' },
  { value: 'dinner', label: '🌙 Dîner' },
];

const DEMO_RESULTS = [
  { dishName: 'Colombo de poulet', foods: [{ name: 'Poulet', calories: 250, protein_g: 30, fat_g: 10, carbs_g: 2, fiber_g: 0, quantity_g: 150 }, { name: 'Riz', calories: 200, protein_g: 4, fat_g: 1, carbs_g: 44, fiber_g: 1, quantity_g: 150 }, { name: 'Sauce colombo', calories: 80, protein_g: 2, fat_g: 5, carbs_g: 8, fiber_g: 2, quantity_g: 100 }], tip: 'Excellent apport en protéines ! Ajoutez des légumes pour plus de fibres.' },
  { dishName: 'Accras de morue', foods: [{ name: 'Accras', calories: 320, protein_g: 15, fat_g: 18, carbs_g: 25, fiber_g: 1, quantity_g: 200 }, { name: 'Sauce chien', calories: 30, protein_g: 0.5, fat_g: 2, carbs_g: 3, fiber_g: 0.5, quantity_g: 50 }], tip: 'Plat riche en protéines. Attention aux fritures, préférez la cuisson au four.' },
];

export default function Scanner() {
  const { addMeal, showToast } = useStore();
  const [mode, setMode] = useState<'photo' | 'barcode'>('photo');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [mealType, setMealType] = useState<string>('lunch');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = async (file: File) => {
    setAnalyzing(true); setError(''); setResult(null);
    try {
      if (isGeminiConfigured()) {
        const res = await analyzeWithGemini(file);
        if (res) { setResult(res); setAnalyzing(false); return; }
      }
      // Demo fallback
      await new Promise(r => setTimeout(r, 1500));
      const demo = DEMO_RESULTS[Math.floor(Math.random() * DEMO_RESULTS.length)];
      setResult({ ...demo, totalCalories: demo.foods.reduce((s, f) => s + f.calories, 0), totalProtein: demo.foods.reduce((s, f) => s + f.protein_g, 0), totalFat: demo.foods.reduce((s, f) => s + f.fat_g, 0), totalCarbs: demo.foods.reduce((s, f) => s + f.carbs_g, 0), totalFiber: demo.foods.reduce((s, f) => s + f.fiber_g, 0) });
    } catch (err: any) { setError(err.message || 'Erreur d\'analyse'); }
    setAnalyzing(false);
  };

  const saveMeal = () => {
    if (!result) return;
    const today = new Date().toISOString().split('T')[0];
    addMeal({
      id: Date.now().toString(), date: today, mealType: mealType as any, dishName: result.dishName,
      foods: result.foods, totalCalories: result.totalCalories || result.foods.reduce((s: number, f: any) => s + f.calories, 0),
      totalProtein: result.totalProtein || result.foods.reduce((s: number, f: any) => s + f.protein_g, 0),
      totalFat: result.totalFat || result.foods.reduce((s: number, f: any) => s + f.fat_g, 0),
      totalCarbs: result.totalCarbs || result.foods.reduce((s: number, f: any) => s + f.carbs_g, 0),
      totalFiber: result.totalFiber || result.foods.reduce((s: number, f: any) => s + f.fiber_g, 0),
      aiTip: result.tip, createdAt: new Date().toISOString(),
    });
    setSaved(true); showToast('Repas enregistré ! 🎉');
    setTimeout(() => { setSaved(false); setResult(null); }, 2000);
  };

  const handleBarcode = async () => {
    setAnalyzing(true); setError('');
    await new Promise(r => setTimeout(r, 1500));
    setResult({
      dishName: 'Yaourt nature Danone', foods: [{ name: 'Yaourt nature', calories: 60, protein_g: 4, fat_g: 1.5, carbs_g: 7, fiber_g: 0, quantity_g: 125 }],
      totalCalories: 60, totalProtein: 4, totalFat: 1.5, totalCarbs: 7, totalFiber: 0, tip: 'Bon choix ! Riche en protéines et calcium.',
    });
    setAnalyzing(false);
  };

  return (
    <AnimatedPage className="px-4 pt-12 pb-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-text-primary font-display mb-4">Scanner</h1>

      {/* Mode toggle */}
      <div className="flex bg-surface-200 rounded-xl p-1 mb-6">
        {[{ v: 'photo', l: '📸 Photo IA', i: Camera }, { v: 'barcode', l: '🔍 Code-barres', i: Barcode }].map(m => (
          <button key={m.v} onClick={() => { setMode(m.v as any); setResult(null); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${mode === m.v ? 'bg-white text-primary-500 shadow-card' : 'text-text-secondary'}`}>
            {m.l}
          </button>
        ))}
      </div>

      {/* Meal type */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
        {MEAL_TYPES.map(mt => (
          <button key={mt.value} onClick={() => setMealType(mt.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${mealType === mt.value ? 'bg-primary-500 text-white' : 'bg-white text-text-primary border border-surface-300'}`}>
            {mt.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {saved ? (
          <motion.div key="saved" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-12">
            <SuccessCheckmark size={80} />
            <p className="text-lg font-semibold text-text-primary mt-4">Repas enregistré !</p>
          </motion.div>
        ) : result ? (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <AnimatedCard className="p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-text-primary">{result.dishName}</h3>
                <button onClick={() => setResult(null)}><X size={20} className="text-text-muted" /></button>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[{ l: 'Calories', v: result.totalCalories || result.foods.reduce((s: number, f: any) => s + f.calories, 0), u: 'kcal', c: 'text-primary-500' },
                  { l: 'Prot.', v: Math.round(result.totalProtein || result.foods.reduce((s: number, f: any) => s + f.protein_g, 0)), u: 'g', c: 'text-primary-400' },
                  { l: 'Gluc.', v: Math.round(result.totalCarbs || result.foods.reduce((s: number, f: any) => s + f.carbs_g, 0)), u: 'g', c: 'text-warning-300' },
                  { l: 'Lip.', v: Math.round(result.totalFat || result.foods.reduce((s: number, f: any) => s + f.fat_g, 0)), u: 'g', c: 'text-error-300' }].map(s => (
                  <div key={s.l} className="text-center bg-surface-100 rounded-xl py-2">
                    <p className={`text-lg font-bold ${s.c}`}>{s.v}</p>
                    <p className="text-[10px] text-text-muted">{s.l}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 mb-4">
                {result.foods.map((f: any, i: number) => (
                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-surface-200 last:border-0">
                    <span className="text-sm text-text-primary">{f.name} <span className="text-text-muted">({f.quantity_g}g)</span></span>
                    <span className="text-sm font-medium text-text-secondary">{f.calories} kcal</span>
                  </div>
                ))}
              </div>
              {result.tip && (
                <div className="bg-primary-50 rounded-xl p-3 mb-4">
                  <p className="text-xs text-primary-700">💡 {result.tip}</p>
                </div>
              )}
              <AnimatedButton onClick={saveMeal} className="w-full py-3 text-sm flex items-center justify-center gap-2">
                <Plus size={18} /> Ajouter au journal
              </AnimatedButton>
            </AnimatedCard>
          </motion.div>
        ) : analyzing ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-16">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <Loader2 size={40} className="text-primary-500" />
            </motion.div>
            <p className="text-sm text-text-secondary mt-4">Analyse en cours...</p>
          </motion.div>
        ) : (
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {error && (
              <div className="bg-error-50 rounded-xl p-3 mb-4 flex items-center gap-2">
                <AlertCircle size={16} className="text-error-300" />
                <p className="text-xs text-error-400">{error}</p>
              </div>
            )}
            {mode === 'photo' ? (
              <AnimatedCard className="p-8 text-center" onClick={() => fileRef.current?.click()}>
                <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handlePhoto(f); }} />
                <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Camera size={32} className="text-primary-500" />
                </div>
                <p className="text-lg font-semibold text-text-primary mb-1">Prenez une photo</p>
                <p className="text-sm text-text-secondary">de votre plat pour l'analyser avec l'IA</p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Upload size={14} className="text-text-muted" />
                  <span className="text-xs text-text-muted">ou importez depuis la galerie</span>
                </div>
              </AnimatedCard>
            ) : (
              <AnimatedCard className="p-8 text-center">
                <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Barcode size={32} className="text-primary-500" />
                </div>
                <p className="text-lg font-semibold text-text-primary mb-1">Scanner un code-barres</p>
                <p className="text-sm text-text-secondary mb-4">Analysez un produit alimentaire</p>
                <AnimatedButton onClick={handleBarcode} className="px-6 py-3 text-sm">
                  Simuler un scan
                </AnimatedButton>
              </AnimatedCard>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}
