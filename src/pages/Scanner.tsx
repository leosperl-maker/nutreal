import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { analyzeWithGemini, isGeminiConfiguredSync } from '../lib/gemini';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import SuccessCheckmark from '../components/SuccessCheckmark';
import Icon3D from '../components/Icon3D';
import { Camera, CameraOff, Barcode, Upload, Loader2, AlertCircle, Plus, X, Pencil, Trash2, Check, MessageSquare } from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/browser';

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Petit-déj', icon: 'sunrise' },
  { value: 'lunch', label: 'Déjeuner', icon: 'sun' },
  { value: 'snack', label: 'Collation', icon: 'redApple' },
  { value: 'dinner', label: 'Dîner', icon: 'crescentMoon' },
];

const DEMO_RESULTS = [
  {
    dishName: 'Colombo de poulet',
    foods: [
      { name: 'Poulet', calories: 250, protein_g: 30, fat_g: 10, carbs_g: 2, fiber_g: 0, quantity_g: 150 },
      { name: 'Riz', calories: 200, protein_g: 4, fat_g: 1, carbs_g: 44, fiber_g: 1, quantity_g: 150 },
      { name: 'Sauce colombo', calories: 80, protein_g: 2, fat_g: 5, carbs_g: 8, fiber_g: 2, quantity_g: 100 },
    ],
    tip: 'Excellent apport en protéines ! Ajoutez des légumes pour plus de fibres.',
  },
  {
    dishName: 'Accras de morue',
    foods: [
      { name: 'Accras', calories: 320, protein_g: 15, fat_g: 18, carbs_g: 25, fiber_g: 1, quantity_g: 200 },
      { name: 'Sauce chien', calories: 30, protein_g: 0.5, fat_g: 2, carbs_g: 3, fiber_g: 0.5, quantity_g: 50 },
    ],
    tip: 'Plat riche en protéines. Attention aux fritures, préférez la cuisson au four.',
  },
];

const NUTRISCORE_COLORS: Record<string, string> = {
  A: 'bg-green-500', B: 'bg-lime-500', C: 'bg-yellow-400', D: 'bg-orange-400', E: 'bg-red-500',
};

const NUTRISCORE_TIPS: Record<string, string> = {
  A: 'Excellent Nutri-Score A — produit très sain.',
  B: 'Bon Nutri-Score B — bonne qualité nutritionnelle.',
  C: 'Nutri-Score C — qualité nutritionnelle moyenne.',
  D: 'Nutri-Score D — à consommer avec modération.',
  E: 'Nutri-Score E — qualité nutritionnelle faible.',
};

async function fetchFromOpenFoodFacts(barcode: string): Promise<any> {
  const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
  if (!res.ok) throw new Error('Erreur réseau Open Food Facts');
  const data = await res.json();
  if (data.status !== 1) throw new Error(`Produit non trouvé dans la base de données (${barcode})`);

  const p = data.product;
  const n = p.nutriments || {};
  const servingQty = parseFloat(p.serving_quantity || '') || 100;
  const ratio = servingQty / 100;
  const safe = (val: any) => Math.round((parseFloat(val || '0') || 0) * ratio);

  const calories = safe(n['energy-kcal_100g']);
  const protein = safe(n.proteins_100g);
  const fat = safe(n.fat_100g);
  const carbs = safe(n.carbohydrates_100g);
  const fiber = safe(n.fiber_100g);

  const productName = p.product_name_fr || p.product_name || 'Produit inconnu';
  const brand = p.brands ? p.brands.split(',')[0].trim() : '';
  const nutriscore = p.nutriscore_grade?.toUpperCase() || null;

  return {
    dishName: brand ? `${productName} — ${brand}` : productName,
    nutriscore,
    foods: [{ name: productName, calories, protein_g: protein, fat_g: fat, carbs_g: carbs, fiber_g: fiber, quantity_g: servingQty }],
    totalCalories: calories, totalProtein: protein, totalFat: fat, totalCarbs: carbs, totalFiber: fiber,
    tip: nutriscore ? NUTRISCORE_TIPS[nutriscore] : `Données nutritionnelles pour ${servingQty}g / portion.`,
  };
}

// ─── Inline food editor ──────────────────────────────────────────────────────
interface FoodItem {
  name: string; calories: number; protein_g: number; fat_g: number; carbs_g: number; fiber_g: number; quantity_g: number;
}

function FoodEditor({ food, onChange, onRemove }: { food: FoodItem; onChange: (f: FoodItem) => void; onRemove: () => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(food);

  useEffect(() => { setDraft(food); }, [food]);

  if (!editing) {
    return (
      <div className="flex items-center gap-2 py-2 border-b border-surface-200 last:border-0 group">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-primary">{food.name} <span className="text-text-muted">({food.quantity_g}g)</span></p>
          <p className="text-xs text-text-muted">P:{food.protein_g}g · G:{food.carbs_g}g · L:{food.fat_g}g</p>
        </div>
        <span className="text-sm font-medium text-text-secondary whitespace-nowrap">{food.calories} kcal</span>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setEditing(true)}
          className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
          <Pencil size={13} className="text-primary-500" />
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onRemove}
          className="w-7 h-7 rounded-lg bg-error-50 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
          <Trash2 size={13} className="text-error-300" />
        </motion.button>
      </div>
    );
  }

  const save = () => { onChange(draft); setEditing(false); };

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="py-2 border-b border-surface-200 last:border-0">
      <div className="bg-surface-50 rounded-xl p-3 space-y-2">
        <input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })}
          className="w-full text-sm font-medium text-text-primary bg-white rounded-lg px-3 py-2 border border-surface-200 focus:border-primary-300 focus:outline-none" placeholder="Nom de l'aliment" />
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Calories', key: 'calories' as const, unit: 'kcal' },
            { label: 'Quantité', key: 'quantity_g' as const, unit: 'g' },
            { label: 'Protéines', key: 'protein_g' as const, unit: 'g' },
            { label: 'Glucides', key: 'carbs_g' as const, unit: 'g' },
            { label: 'Lipides', key: 'fat_g' as const, unit: 'g' },
            { label: 'Fibres', key: 'fiber_g' as const, unit: 'g' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-[10px] text-text-muted block mb-0.5">{f.label}</label>
              <input type="number" value={draft[f.key]} onChange={e => setDraft({ ...draft, [f.key]: Number(e.target.value) || 0 })}
                className="w-full text-xs text-text-primary bg-white rounded-lg px-2 py-1.5 border border-surface-200 focus:border-primary-300 focus:outline-none" />
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-1">
          <motion.button whileTap={{ scale: 0.95 }} onClick={save}
            className="flex-1 py-2 bg-primary-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1">
            <Check size={14} /> Valider
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setDraft(food); setEditing(false); }}
            className="px-4 py-2 bg-surface-200 text-text-secondary text-xs font-semibold rounded-lg">
            Annuler
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Add food form ───────────────────────────────────────────────────────────
function AddFoodForm({ onAdd }: { onAdd: (f: FoodItem) => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<FoodItem>({ name: '', calories: 0, protein_g: 0, fat_g: 0, carbs_g: 0, fiber_g: 0, quantity_g: 100 });

  if (!open) {
    return (
      <motion.button whileTap={{ scale: 0.97 }} onClick={() => setOpen(true)}
        className="w-full py-2 border-2 border-dashed border-surface-300 rounded-xl text-xs font-medium text-text-muted flex items-center justify-center gap-1 hover:border-primary-300 hover:text-primary-500 transition-colors">
        <Plus size={14} /> Ajouter un aliment manquant
      </motion.button>
    );
  }

  const add = () => {
    if (!draft.name.trim()) return;
    onAdd(draft);
    setDraft({ name: '', calories: 0, protein_g: 0, fat_g: 0, carbs_g: 0, fiber_g: 0, quantity_g: 100 });
    setOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-primary-50 rounded-xl p-3 space-y-2">
      <p className="text-xs font-semibold text-primary-700">Ajouter un aliment</p>
      <input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} placeholder="Ex: Sauce piquante"
        className="w-full text-sm text-text-primary bg-white rounded-lg px-3 py-2 border border-primary-200 focus:border-primary-400 focus:outline-none" />
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Calories', key: 'calories' as const },
          { label: 'Quantité (g)', key: 'quantity_g' as const },
          { label: 'Protéines (g)', key: 'protein_g' as const },
          { label: 'Glucides (g)', key: 'carbs_g' as const },
          { label: 'Lipides (g)', key: 'fat_g' as const },
          { label: 'Fibres (g)', key: 'fiber_g' as const },
        ].map(f => (
          <div key={f.key}>
            <label className="text-[10px] text-text-muted">{f.label}</label>
            <input type="number" value={draft[f.key]} onChange={e => setDraft({ ...draft, [f.key]: Number(e.target.value) || 0 })}
              className="w-full text-xs bg-white rounded-lg px-2 py-1.5 border border-primary-200 focus:border-primary-400 focus:outline-none" />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <motion.button whileTap={{ scale: 0.95 }} onClick={add}
          className="flex-1 py-2 bg-primary-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1">
          <Plus size={14} /> Ajouter
        </motion.button>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setOpen(false)}
          className="px-4 py-2 bg-white text-text-secondary text-xs font-semibold rounded-lg border border-surface-200">
          Annuler
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Feedback banner ─────────────────────────────────────────────────────────
function FeedbackBanner({ onCorrect }: { onCorrect: () => void }) {
  return (
    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-3">
      <MessageSquare size={14} className="text-amber-500 flex-shrink-0" />
      <p className="text-xs text-amber-700 flex-1">Un aliment est faux ou il en manque ?</p>
      <motion.button whileTap={{ scale: 0.95 }} onClick={onCorrect}
        className="px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-lg whitespace-nowrap">
        Corriger
      </motion.button>
    </div>
  );
}

// ─── Main Scanner ────────────────────────────────────────────────────────────
export default function Scanner() {
  const { addMeal, showToast } = useStore();
  const [mode, setMode] = useState<'photo' | 'barcode'>('photo');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [mealType, setMealType] = useState<string>('lunch');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [correcting, setCorrecting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const detectedRef = useRef(false);

  useEffect(() => () => { stopScan(); }, []);

  const stopScan = () => {
    try {
      controlsRef.current?.stop();
      controlsRef.current = null;
      if (videoRef.current?.srcObject instanceof MediaStream) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
        videoRef.current.srcObject = null;
      }
      BrowserMultiFormatReader.releaseAllStreams();
    } catch {}
    setScanning(false);
    detectedRef.current = false;
  };

  const startScan = async () => {
    detectedRef.current = false;
    setError(''); setResult(null); setScanning(true);
    try {
      const reader = new BrowserMultiFormatReader();
      const controls = await reader.decodeFromVideoDevice(
        undefined, videoRef.current!,
        async (res, _err) => {
          if (res && !detectedRef.current) {
            detectedRef.current = true;
            controlsRef.current?.stop();
            controlsRef.current = null;
            if (videoRef.current?.srcObject instanceof MediaStream) {
              (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
            }
            setScanning(false);
            setAnalyzing(true);
            try {
              const product = await fetchFromOpenFoodFacts(res.getText());
              setResult(product);
            } catch (e: any) {
              setError(e.message || 'Produit introuvable sur Open Food Facts');
            }
            setAnalyzing(false);
          }
        }
      );
      controlsRef.current = controls as { stop: () => void };
    } catch (e: any) {
      setError("Impossible d'accéder à la caméra. Autorisez l'accès dans votre navigateur.");
      setScanning(false);
    }
  };

  const handlePhoto = async (file: File) => {
    setAnalyzing(true); setError(''); setResult(null); setCorrecting(false);
    try {
      if (isGeminiConfiguredSync()) {
        const res = await analyzeWithGemini(file);
        if (res) { setResult(res); setAnalyzing(false); return; }
      }
      await new Promise(r => setTimeout(r, 1500));
      const demo = DEMO_RESULTS[Math.floor(Math.random() * DEMO_RESULTS.length)];
      setResult({
        ...demo,
        totalCalories: demo.foods.reduce((s, f) => s + f.calories, 0),
        totalProtein: demo.foods.reduce((s, f) => s + f.protein_g, 0),
        totalFat: demo.foods.reduce((s, f) => s + f.fat_g, 0),
        totalCarbs: demo.foods.reduce((s, f) => s + f.carbs_g, 0),
        totalFiber: demo.foods.reduce((s, f) => s + f.fiber_g, 0),
      });
    } catch (err: any) { setError(err.message || "Erreur d'analyse"); }
    setAnalyzing(false);
  };

  // ─── Correction handlers ───────────────────────────────────────────────────
  const updateFood = (index: number, updated: FoodItem) => {
    if (!result) return;
    const foods = [...result.foods];
    foods[index] = updated;
    recalcResult(foods);
  };

  const removeFood = (index: number) => {
    if (!result) return;
    const foods = result.foods.filter((_: any, i: number) => i !== index);
    if (foods.length === 0) { setResult(null); setCorrecting(false); return; }
    recalcResult(foods);
  };

  const addFood = (food: FoodItem) => {
    if (!result) return;
    recalcResult([...result.foods, food]);
  };

  const recalcResult = (foods: FoodItem[]) => {
    setResult({
      ...result,
      foods,
      totalCalories: foods.reduce((s: number, f: FoodItem) => s + f.calories, 0),
      totalProtein: Math.round(foods.reduce((s: number, f: FoodItem) => s + f.protein_g, 0) * 10) / 10,
      totalFat: Math.round(foods.reduce((s: number, f: FoodItem) => s + f.fat_g, 0) * 10) / 10,
      totalCarbs: Math.round(foods.reduce((s: number, f: FoodItem) => s + f.carbs_g, 0) * 10) / 10,
      totalFiber: Math.round(foods.reduce((s: number, f: FoodItem) => s + f.fiber_g, 0) * 10) / 10,
    });
  };

  const saveMeal = () => {
    if (!result) return;
    const today = new Date().toISOString().split('T')[0];
    addMeal({
      id: Date.now().toString(), date: today, mealType: mealType as any, dishName: result.dishName,
      foods: result.foods,
      totalCalories: result.totalCalories || result.foods.reduce((s: number, f: any) => s + f.calories, 0),
      totalProtein: result.totalProtein || result.foods.reduce((s: number, f: any) => s + f.protein_g, 0),
      totalFat: result.totalFat || result.foods.reduce((s: number, f: any) => s + f.fat_g, 0),
      totalCarbs: result.totalCarbs || result.foods.reduce((s: number, f: any) => s + f.carbs_g, 0),
      totalFiber: result.totalFiber || result.foods.reduce((s: number, f: any) => s + f.fiber_g, 0),
      aiTip: result.tip, createdAt: new Date().toISOString(),
    });
    setSaved(true); showToast('Repas enregistré !');
    setTimeout(() => { setSaved(false); setResult(null); setCorrecting(false); }, 2000);
  };

  return (
    <AnimatedPage className="px-4 pt-12 pb-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-text-primary font-display mb-4">Scanner</h1>

      {/* Mode toggle */}
      <div className="flex bg-surface-200 rounded-xl p-1 mb-6">
        {[{ v: 'photo', l: 'Photo IA' }, { v: 'barcode', l: 'Code-barres' }].map(m => (
          <button key={m.v}
            onClick={() => { setMode(m.v as any); setResult(null); setError(''); stopScan(); setCorrecting(false); }}
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
            <Icon3D name={mt.icon} size={14} /> {mt.label}
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
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 mr-2">
                  <h3 className="text-base font-bold text-text-primary leading-tight">{result.dishName}</h3>
                  {result.nutriscore && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-white text-xs font-bold mt-1 ${NUTRISCORE_COLORS[result.nutriscore] || 'bg-gray-400'}`}>
                      Nutri-Score {result.nutriscore}
                    </span>
                  )}
                </div>
                <button onClick={() => { setResult(null); setCorrecting(false); }}>
                  <X size={20} className="text-text-muted flex-shrink-0" />
                </button>
              </div>

              {/* Macros summary */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { l: 'Calories', v: result.totalCalories || 0, c: 'text-primary-500' },
                  { l: 'Prot.', v: Math.round(result.totalProtein || 0), c: 'text-primary-400' },
                  { l: 'Gluc.', v: Math.round(result.totalCarbs || 0), c: 'text-warning-300' },
                  { l: 'Lip.', v: Math.round(result.totalFat || 0), c: 'text-error-300' },
                ].map(s => (
                  <div key={s.l} className="text-center bg-surface-100 rounded-xl py-2">
                    <p className={`text-lg font-bold ${s.c}`}>{s.v}</p>
                    <p className="text-[10px] text-text-muted">{s.l}</p>
                  </div>
                ))}
              </div>

              {/* Feedback banner */}
              {!correcting && (
                <FeedbackBanner onCorrect={() => setCorrecting(true)} />
              )}

              {/* Food list - editable or read-only */}
              <div className="mb-4">
                {correcting ? (
                  <div className="space-y-0">
                    {result.foods.map((f: FoodItem, i: number) => (
                      <FoodEditor key={i} food={f} onChange={updated => updateFood(i, updated)} onRemove={() => removeFood(i)} />
                    ))}
                    <div className="pt-3">
                      <AddFoodForm onAdd={addFood} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {result.foods.map((f: any, i: number) => (
                      <div key={i} className="flex justify-between items-center py-1.5 border-b border-surface-200 last:border-0">
                        <span className="text-sm text-text-primary">{f.name} <span className="text-text-muted">({f.quantity_g}g)</span></span>
                        <span className="text-sm font-medium text-text-secondary">{f.calories} kcal</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {result.tip && (
                <div className="bg-primary-50 rounded-xl p-3 mb-4">
                  <p className="text-xs text-primary-700">{result.tip}</p>
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
              <AnimatedCard className="p-4">
                <div className="relative mb-4 overflow-hidden rounded-xl bg-black">
                  <video ref={videoRef} autoPlay playsInline muted
                    className="w-full aspect-video object-cover" style={{ display: scanning ? 'block' : 'none' }} />
                  {!scanning && (
                    <div className="w-full aspect-video flex flex-col items-center justify-center bg-surface-100 rounded-xl">
                      <Barcode size={56} className="text-primary-300 mb-3" />
                      <p className="text-sm font-medium text-text-secondary">Scanner un code-barres</p>
                      <p className="text-xs text-text-muted mt-1">+3 millions de produits disponibles</p>
                    </div>
                  )}
                  {scanning && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="relative border-2 border-primary-400 rounded-lg w-52 h-28">
                        <motion.div className="absolute left-0 right-0 h-0.5 bg-primary-400 opacity-80"
                          animate={{ top: ['5%', '90%', '5%'] }}
                          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                          style={{ position: 'absolute' }} />
                        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-primary-500 rounded-tl-sm" />
                        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-primary-500 rounded-tr-sm" />
                        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-primary-500 rounded-bl-sm" />
                        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-primary-500 rounded-br-sm" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {scanning ? (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={stopScan}
                      className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-red-400 to-red-500 text-white shadow-md">
                      <CameraOff size={18} /> Arrêter le scan
                    </motion.button>
                  ) : (
                    <AnimatedButton onClick={startScan} className="w-full py-3 text-sm flex items-center justify-center gap-2">
                      <Camera size={18} /> Démarrer le scanner
                    </AnimatedButton>
                  )}
                  <p className="text-[11px] text-text-muted text-center">Propulsé par Open Food Facts</p>
                </div>
              </AnimatedCard>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}
