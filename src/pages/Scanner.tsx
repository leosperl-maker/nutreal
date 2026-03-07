import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Image, Loader2, Check, X, Plus, Minus, Lightbulb,
  ChevronDown, Sparkles, AlertCircle, Flame, Zap, ScanBarcode,
  Search, Star, ShieldAlert, ArrowRight
} from 'lucide-react';
import { useStore, type FoodItem, type Meal } from '../store/useStore';
import { getNutritionalScore } from '../lib/nutrition';
import { analyzeWithGemini, isGeminiConfigured } from '../lib/gemini';

type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner';
type ScannerMode = 'photo' | 'barcode';

const mealTypes: { value: MealType; label: string; emoji: string }[] = [
  { value: 'breakfast', label: 'Petit-déjeuner', emoji: '🌅' },
  { value: 'lunch', label: 'Déjeuner', emoji: '☀️' },
  { value: 'snack', label: 'Goûter', emoji: '🍪' },
  { value: 'dinner', label: 'Dîner', emoji: '🌙' },
];

function simulateAIAnalysis(): Promise<{
  dishName: string;
  foods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  totalFiber: number;
  nutritionalScore?: string;
  tip: string;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const hour = new Date().getHours();
      let result;
      if (hour < 11) {
        result = {
          dishName: 'Tartines avocat et œuf poché',
          foods: [
            { name: 'Pain complet', calories: 140, protein_g: 5, fat_g: 1.5, carbs_g: 26, fiber_g: 3, quantity_g: 60 },
            { name: 'Avocat', calories: 120, protein_g: 1.5, fat_g: 11, carbs_g: 6, fiber_g: 5, quantity_g: 75 },
            { name: 'Œuf poché', calories: 70, protein_g: 6, fat_g: 5, carbs_g: 0.5, fiber_g: 0, quantity_g: 50 },
            { name: 'Tomates cerises', calories: 15, protein_g: 0.5, fat_g: 0.2, carbs_g: 3, fiber_g: 1, quantity_g: 50 },
          ],
          totalCalories: 345, totalProtein: 13, totalFat: 17.7, totalCarbs: 35.5, totalFiber: 9,
          nutritionalScore: 'excellent',
          tip: '🔬 Mode démo — Excellent petit-déjeuner ! Riche en fibres et en bonnes graisses.',
        };
      } else if (hour < 15) {
        result = {
          dishName: 'Colombo de poulet et riz',
          foods: [
            { name: 'Poulet (cuisse)', calories: 200, protein_g: 26, fat_g: 10, carbs_g: 0, fiber_g: 0, quantity_g: 150 },
            { name: 'Riz basmati', calories: 180, protein_g: 3.5, fat_g: 0.5, carbs_g: 40, fiber_g: 0.5, quantity_g: 150 },
            { name: 'Sauce colombo (lait de coco, épices)', calories: 90, protein_g: 1, fat_g: 8, carbs_g: 4, fiber_g: 1, quantity_g: 80 },
            { name: 'Aubergines', calories: 20, protein_g: 0.8, fat_g: 0.2, carbs_g: 4, fiber_g: 2.5, quantity_g: 80 },
          ],
          totalCalories: 490, totalProtein: 31.3, totalFat: 18.7, totalCarbs: 48, totalFiber: 4,
          nutritionalScore: 'good',
          tip: '🔬 Mode démo — Le colombo est un plat antillais riche en protéines. Le curcuma dans les épices a des propriétés anti-inflammatoires.',
        };
      } else {
        result = {
          dishName: 'Salade composée au saumon',
          foods: [
            { name: 'Saumon fumé', calories: 180, protein_g: 22, fat_g: 10, carbs_g: 0, fiber_g: 0, quantity_g: 100 },
            { name: 'Mesclun', calories: 15, protein_g: 1.5, fat_g: 0.2, carbs_g: 2, fiber_g: 1.5, quantity_g: 80 },
            { name: 'Quinoa', calories: 120, protein_g: 4.4, fat_g: 1.9, carbs_g: 21, fiber_g: 2.8, quantity_g: 100 },
            { name: 'Concombre', calories: 8, protein_g: 0.3, fat_g: 0.1, carbs_g: 1.8, fiber_g: 0.5, quantity_g: 50 },
            { name: 'Vinaigrette', calories: 60, protein_g: 0, fat_g: 6, carbs_g: 2, fiber_g: 0, quantity_g: 15 },
          ],
          totalCalories: 383, totalProtein: 28.2, totalFat: 18.2, totalCarbs: 26.8, totalFiber: 4.8,
          nutritionalScore: 'excellent',
          tip: '🔬 Mode démo — Le saumon est riche en oméga-3, excellents pour le cerveau et le cœur.',
        };
      }
      resolve(result);
    }, 2500);
  });
}

// ─── Barcode Product Scanner Sub-component ───
function BarcodeScanner() {
  const { addProductScan, showToast } = useStore();
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState('');
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const startCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      setCameraError('Impossible d\'accéder à la caméra. Entrez le code-barres manuellement.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const searchProduct = async (code: string) => {
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    setProduct(null);

    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json`);
      const data = await res.json();

      if (data.status === 0 || !data.product) {
        setError('Produit non trouvé. Vérifiez le code-barres.');
        setLoading(false);
        return;
      }

      const p = data.product;
      const nutriments = p.nutriments || {};
      const productData = {
        barcode: code,
        name: p.product_name || 'Produit inconnu',
        brand: p.brands || 'Marque inconnue',
        image: p.image_url || p.image_front_url || '',
        nutriscoreGrade: (p.nutriscore_grade || 'e').toUpperCase(),
        novaGroup: p.nova_group || 4,
        calories: Math.round(nutriments['energy-kcal_100g'] || 0),
        protein: Math.round((nutriments.proteins_100g || 0) * 10) / 10,
        fat: Math.round((nutriments.fat_100g || 0) * 10) / 10,
        carbs: Math.round((nutriments.carbohydrates_100g || 0) * 10) / 10,
        fiber: Math.round((nutriments.fiber_100g || 0) * 10) / 10,
        sugar: Math.round((nutriments.sugars_100g || 0) * 10) / 10,
        salt: Math.round((nutriments.salt_100g || 0) * 100) / 100,
        saturatedFat: Math.round((nutriments['saturated-fat_100g'] || 0) * 10) / 10,
        ingredients: p.ingredients_text_fr || p.ingredients_text || '',
        allergens: p.allergens_tags?.map((a: string) => a.replace('en:', '')) || [],
        categories: p.categories || '',
      };

      setProduct(productData);
      addProductScan({
        barcode: code,
        productName: productData.name,
        brand: productData.brand,
        score: productData.nutriscoreGrade === 'A' ? 90 : productData.nutriscoreGrade === 'B' ? 70 : productData.nutriscoreGrade === 'C' ? 50 : productData.nutriscoreGrade === 'D' ? 30 : 15,
        nutriscoreGrade: productData.nutriscoreGrade,
        imageUrl: productData.image,
        scannedAt: new Date().toISOString(),
      });
      setRecentScans(prev => [productData, ...prev].slice(0, 5));
    } catch {
      setError('Erreur de connexion. Vérifiez votre réseau.');
    }
    setLoading(false);
  };

  const nutriscoreColors: Record<string, string> = {
    A: '#038141', B: '#85BB2F', C: '#FECB02', D: '#EE8100', E: '#E63E11',
  };

  const novaLabels: Record<number, { label: string; color: string }> = {
    1: { label: 'Non transformé', color: '#038141' },
    2: { label: 'Peu transformé', color: '#85BB2F' },
    3: { label: 'Transformé', color: '#EE8100' },
    4: { label: 'Ultra-transformé', color: '#E63E11' },
  };

  return (
    <div className="px-4 pt-6 pb-8">
      {/* Camera View */}
      <div className="relative mb-4">
        <div className="bg-gray-900 rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center">
          {cameraActive ? (
            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
          ) : (
            <div className="text-center p-6">
              <ScanBarcode size={48} className="text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400 text-sm mb-3">Scannez un code-barres</p>
              <button
                onClick={startCamera}
                className="bg-primary-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-600 active:scale-[0.98] transition-all"
              >
                <Camera size={16} className="inline mr-2" />
                Activer la caméra
              </button>
            </div>
          )}
          {cameraActive && (
            <>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-32 border-2 border-white/50 rounded-xl">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary-400 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary-400 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary-400 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary-400 rounded-br-lg" />
                </div>
              </div>
              <button
                onClick={stopCamera}
                className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white"
              >
                <X size={16} />
              </button>
            </>
          )}
        </div>
        {cameraError && (
          <p className="text-xs text-amber-600 mt-2 text-center">{cameraError}</p>
        )}
      </div>

      {/* Manual Entry */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            type="text"
            inputMode="numeric"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchProduct(barcode)}
            placeholder="Code-barres (ex: 3017620422003)"
            className="w-full bg-white rounded-xl pl-10 pr-4 py-3 text-sm border border-gray-100 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none shadow-card"
          />
        </div>
        <button
          onClick={() => searchProduct(barcode)}
          disabled={loading || !barcode.trim()}
          className="bg-primary-500 text-white px-5 rounded-xl font-semibold text-sm hover:bg-primary-600 active:scale-[0.98] transition-all disabled:opacity-50 shadow-float"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
        </button>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4 flex items-center gap-2">
          <AlertCircle size={16} className="text-red-500" />
          <p className="text-xs text-red-600">{error}</p>
        </motion.div>
      )}

      {/* Product Result */}
      {product && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          {/* Product Header */}
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            {product.image && (
              <div className="h-40 bg-gray-50 flex items-center justify-center">
                <img src={product.image} alt={product.name} className="h-full object-contain" />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-bold text-gray-800 text-base">{product.name}</h3>
              <p className="text-xs text-gray-400">{product.brand}</p>

              <div className="flex items-center gap-3 mt-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: nutriscoreColors[product.nutriscoreGrade] || '#999' }}
                >
                  {product.nutriscoreGrade}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">Nutri-Score</p>
                  <p className="text-[10px] text-gray-400">
                    {product.nutriscoreGrade === 'A' ? 'Excellent' : product.nutriscoreGrade === 'B' ? 'Bon' : product.nutriscoreGrade === 'C' ? 'Moyen' : product.nutriscoreGrade === 'D' ? 'Médiocre' : 'Mauvais'}
                  </p>
                </div>

                <div className="ml-auto">
                  <span
                    className="text-[10px] font-semibold px-2 py-1 rounded-full text-white"
                    style={{ backgroundColor: novaLabels[product.novaGroup]?.color || '#999' }}
                  >
                    NOVA {product.novaGroup}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Nutrition per 100g */}
          <div className="bg-white rounded-2xl shadow-card p-4">
            <h4 className="font-semibold text-gray-800 text-sm mb-3">Valeurs pour 100g</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Calories', value: `${product.calories} kcal`, color: '#FF9800' },
                { label: 'Protéines', value: `${product.protein}g`, color: '#EF5350' },
                { label: 'Lipides', value: `${product.fat}g`, color: '#FFC107' },
                { label: 'Glucides', value: `${product.carbs}g`, color: '#FF9800' },
                { label: 'Sucres', value: `${product.sugar}g`, color: '#E91E63' },
                { label: 'Fibres', value: `${product.fiber}g`, color: '#4CAF50' },
                { label: 'Sel', value: `${product.salt}g`, color: '#607D8B' },
                { label: 'Graisses sat.', value: `${product.saturatedFat}g`, color: '#795548' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between bg-surface-50 rounded-lg px-3 py-2">
                  <span className="text-xs text-gray-500">{item.label}</span>
                  <span className="text-xs font-bold" style={{ color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Allergens */}
          {product.allergens.length > 0 && (
            <div className="bg-red-50 rounded-2xl p-4 flex gap-3">
              <ShieldAlert size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-red-700 mb-1">Allergènes</p>
                <div className="flex flex-wrap gap-1">
                  {product.allergens.map((a: string) => (
                    <span key={a} className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full capitalize">{a}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => { setProduct(null); setBarcode(''); }}
            className="w-full bg-white text-gray-600 py-3 rounded-xl font-medium text-sm shadow-card hover:bg-surface-50 active:scale-[0.98] transition-all"
          >
            Scanner un autre produit
          </button>
        </motion.div>
      )}

      {/* Recent Scans */}
      {!product && recentScans.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Scans récents</h3>
          <div className="space-y-2">
            {recentScans.map((scan, i) => (
              <button
                key={i}
                onClick={() => { setBarcode(scan.barcode); searchProduct(scan.barcode); }}
                className="w-full bg-white rounded-xl p-3 shadow-card flex items-center gap-3 hover:bg-surface-50 transition-colors text-left"
              >
                {scan.image && <img src={scan.image} alt="" className="w-10 h-10 object-contain rounded-lg bg-gray-50" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{scan.name}</p>
                  <p className="text-[10px] text-gray-400">{scan.brand}</p>
                </div>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                  style={{ backgroundColor: nutriscoreColors[scan.nutriscoreGrade] || '#999' }}
                >
                  {scan.nutriscoreGrade}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Scanner Component ───
export default function Scanner() {
  const { addMeal, showToast } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<ScannerMode>('photo');
  const [step, setStep] = useState<'capture' | 'analyzing' | 'result'>('capture');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<MealType>('lunch');
  const [showMealTypeSelector, setShowMealTypeSelector] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [editedFoods, setEditedFoods] = useState<FoodItem[]>([]);
  const [saved, setSaved] = useState(false);
  const [usedGemini, setUsedGemini] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const geminiReady = isGeminiConfigured();

  const handleImageCapture = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setStep('analyzing');
    setAnalysisError(null);

    try {
      let result = null;
      if (geminiReady) {
        result = await analyzeWithGemini(file);
        if (result) setUsedGemini(true);
      }
      if (!result) {
        setUsedGemini(false);
        result = await simulateAIAnalysis();
      }
      setAnalysisResult(result);
      setEditedFoods([...result.foods]);
      setStep('result');
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisError('L\'analyse a échoué. Veuillez réessayer.');
      setStep('capture');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageCapture(file);
  };

  const updateFoodQuantity = (index: number, delta: number) => {
    setEditedFoods(prev => {
      const updated = [...prev];
      const food = updated[index];
      const newQuantity = food.quantity_g + delta;
      if (newQuantity <= 0) return prev;
      const ratio = newQuantity / food.quantity_g;
      updated[index] = {
        ...food, quantity_g: newQuantity,
        calories: Math.round(food.calories * ratio),
        protein_g: Math.round(food.protein_g * ratio * 10) / 10,
        fat_g: Math.round(food.fat_g * ratio * 10) / 10,
        carbs_g: Math.round(food.carbs_g * ratio * 10) / 10,
        fiber_g: Math.round(food.fiber_g * ratio * 10) / 10,
      };
      return updated;
    });
  };

  const removeFood = (index: number) => setEditedFoods(prev => prev.filter((_, i) => i !== index));

  const getTotals = () => ({
    calories: editedFoods.reduce((sum, f) => sum + f.calories, 0),
    protein: editedFoods.reduce((sum, f) => sum + f.protein_g, 0),
    fat: editedFoods.reduce((sum, f) => sum + f.fat_g, 0),
    carbs: editedFoods.reduce((sum, f) => sum + f.carbs_g, 0),
    fiber: editedFoods.reduce((sum, f) => sum + f.fiber_g, 0),
  });

  const handleSave = () => {
    const totals = getTotals();
    const meal: Meal = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mealType: selectedMealType,
      dishName: analysisResult.dishName,
      photoUrl: imagePreview || undefined,
      foods: editedFoods,
      totalCalories: totals.calories,
      totalProtein: Math.round(totals.protein),
      totalFat: Math.round(totals.fat),
      totalCarbs: Math.round(totals.carbs),
      totalFiber: Math.round(totals.fiber),
      aiTip: analysisResult.tip,
      createdAt: new Date().toISOString(),
    };
    addMeal(meal);
    setSaved(true);
    showToast(`✅ "${meal.dishName}" enregistré dans le journal`);
    setTimeout(() => {
      setStep('capture');
      setImagePreview(null);
      setAnalysisResult(null);
      setEditedFoods([]);
      setSaved(false);
      setUsedGemini(false);
    }, 2000);
  };

  const handleReset = () => {
    setStep('capture');
    setImagePreview(null);
    setAnalysisResult(null);
    setEditedFoods([]);
    setSaved(false);
    setUsedGemini(false);
    setAnalysisError(null);
  };

  const totals = editedFoods.length > 0 ? getTotals() : null;
  const score = totals ? getNutritionalScore(totals.calories, totals.protein, totals.fiber, totals.fat) : null;

  return (
    <div className="min-h-screen pb-24">
      {/* Mode Toggle - always visible at top */}
      <div className="sticky top-0 z-40 bg-surface-100/80 backdrop-blur-lg pt-12 pb-3 px-4">
        <div className="bg-white rounded-2xl p-1 shadow-card flex max-w-sm mx-auto">
          <button
            onClick={() => { setMode('photo'); handleReset(); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              mode === 'photo' ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Camera size={16} />
            Photo plat
          </button>
          <button
            onClick={() => { setMode('barcode'); handleReset(); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              mode === 'barcode' ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ScanBarcode size={16} />
            Code-barres
          </button>
        </div>
      </div>

      {/* Barcode Mode */}
      {mode === 'barcode' && <BarcodeScanner />}

      {/* Photo Mode */}
      {mode === 'photo' && (
        <AnimatePresence mode="wait">
          {step === 'capture' && (
            <motion.div key="capture" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center px-6 pt-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Camera size={28} className="text-primary-500" />
                </div>
                <h1 className="text-xl font-bold text-gray-800 font-display mb-1">Scanner IA</h1>
                <p className="text-gray-400 text-xs">Photographiez votre plat pour une analyse nutritionnelle</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-50 border border-gray-100">
                  {geminiReady ? (
                    <><Zap size={12} className="text-blue-500" /><span className="text-[10px] font-medium text-gray-500">Gemini 2.0 Flash • Cuisine antillaise</span></>
                  ) : (
                    <><AlertCircle size={12} className="text-amber-500" /><span className="text-[10px] font-medium text-gray-500">Mode démo</span></>
                  )}
                </div>
              </div>

              {analysisError && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm mb-4 bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                  <p className="text-xs text-red-600">{analysisError}</p>
                </motion.div>
              )}

              {/* Meal Type */}
              <div className="w-full max-w-sm mb-5">
                <button onClick={() => setShowMealTypeSelector(!showMealTypeSelector)} className="w-full bg-white rounded-xl p-3 shadow-card flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{mealTypes.find(m => m.value === selectedMealType)?.emoji}</span>
                    <span className="font-medium text-gray-700 text-sm">{mealTypes.find(m => m.value === selectedMealType)?.label}</span>
                  </div>
                  <ChevronDown size={18} className="text-gray-400" />
                </button>
                <AnimatePresence>
                  {showMealTypeSelector && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-xl shadow-card mt-1 overflow-hidden">
                      {mealTypes.map(type => (
                        <button key={type.value} onClick={() => { setSelectedMealType(type.value); setShowMealTypeSelector(false); }}
                          className={`w-full p-3 flex items-center gap-2 hover:bg-surface-50 transition-colors ${selectedMealType === type.value ? 'bg-primary-50' : ''}`}>
                          <span>{type.emoji}</span>
                          <span className="text-sm font-medium text-gray-700">{type.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-full max-w-sm space-y-3">
                <button onClick={() => cameraInputRef.current?.click()} className="w-full bg-primary-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:bg-primary-600 active:scale-[0.98] transition-all shadow-float">
                  <Camera size={22} /> Prendre une photo
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="w-full bg-white text-gray-700 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:bg-surface-50 active:scale-[0.98] transition-all shadow-card">
                  <Image size={22} /> Choisir depuis la galerie
                </button>
              </div>

              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

              <p className="text-[10px] text-gray-300 mt-5 text-center max-w-xs">
                {geminiReady ? 'Gemini analysera votre plat avec reconnaissance des plats antillais' : 'Mode démo : résultats simulés'}
              </p>
            </motion.div>
          )}

          {step === 'analyzing' && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center px-6 pt-16">
              {imagePreview && (
                <div className="w-44 h-44 rounded-3xl overflow-hidden mb-6 shadow-xl">
                  <img src={imagePreview} alt="Plat" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex items-center gap-3 mb-3">
                <Loader2 size={24} className="text-primary-500 animate-spin" />
                <Sparkles size={20} className="text-secondary-500 animate-pulse" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 font-display mb-1">
                {geminiReady ? 'Gemini analyse votre plat...' : 'Analyse en cours...'}
              </h2>
              <p className="text-sm text-gray-400 text-center">Identification des aliments et calcul nutritionnel</p>
              <div className="mt-5 w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div className="h-full bg-primary-500 rounded-full" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: geminiReady ? 6 : 2.5, ease: 'easeInOut' }} />
              </div>
              {geminiReady && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-500">
                  <Zap size={12} /><span>Gemini 2.0 Flash</span>
                </div>
              )}
            </motion.div>
          )}

          {step === 'result' && analysisResult && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="px-4 pt-4 pb-32 max-w-lg mx-auto">
              <div className="relative mb-4">
                {imagePreview && (
                  <div className="w-full h-44 rounded-2xl overflow-hidden shadow-card">
                    <img src={imagePreview} alt="Plat" className="w-full h-full object-cover" />
                  </div>
                )}
                <button onClick={handleReset} className="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur rounded-full flex items-center justify-center text-white">
                  <X size={16} />
                </button>
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                  {usedGemini ? (
                    <><Zap size={11} className="text-blue-400" /><span className="text-[10px] font-medium text-white">Gemini IA</span></>
                  ) : (
                    <><AlertCircle size={11} className="text-amber-400" /><span className="text-[10px] font-medium text-white">Démo</span></>
                  )}
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-800 font-display mb-1">{analysisResult.dishName}</h2>

              <div className="flex items-center gap-4 mb-4">
                {score && (
                  <div className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: score.color }}>{score.label}</div>
                )}
                <div className="flex items-center gap-1">
                  <Flame size={16} className="text-secondary-500" />
                  <span className="text-lg font-bold text-gray-800">{totals?.calories}</span>
                  <span className="text-sm text-gray-400">kcal</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { label: 'Protéines', value: totals?.protein, color: '#EF5350' },
                  { label: 'Lipides', value: totals?.fat, color: '#FFC107' },
                  { label: 'Glucides', value: totals?.carbs, color: '#FF9800' },
                  { label: 'Fibres', value: totals?.fiber, color: '#4CAF50' },
                ].map(macro => (
                  <div key={macro.label} className="bg-white rounded-xl p-3 shadow-card text-center">
                    <div className="w-10 h-10 rounded-full mx-auto mb-1 flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: macro.color }}>
                      {Math.round(macro.value || 0)}
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium">{macro.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl shadow-card p-4 mb-4">
                <h3 className="font-semibold text-gray-800 text-sm mb-3">Aliments détectés</h3>
                <div className="space-y-3">
                  {editedFoods.map((food, index) => (
                    <div key={index} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-700 text-sm truncate">{food.name}</p>
                        <p className="text-xs text-gray-400">{food.calories} kcal • {food.quantity_g}g</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateFoodQuantity(index, -10)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 active:scale-90"><Minus size={12} /></button>
                        <span className="text-xs font-medium text-gray-600 w-8 text-center">{food.quantity_g}g</span>
                        <button onClick={() => updateFoodQuantity(index, 10)} className="w-7 h-7 rounded-full bg-primary-50 flex items-center justify-center text-primary-500 hover:bg-primary-100 active:scale-90"><Plus size={12} /></button>
                        <button onClick={() => removeFood(index)} className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 active:scale-90 ml-1"><X size={12} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {analysisResult.tip && (
                <div className="bg-primary-50 rounded-2xl p-4 mb-4 flex gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lightbulb size={16} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary-700 mb-1">{usedGemini ? 'Conseil Gemini IA' : 'Conseil NutriLens'}</p>
                    <p className="text-xs text-primary-600 leading-relaxed">{analysisResult.tip}</p>
                  </div>
                </div>
              )}

              <AnimatePresence>
                {saved ? (
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-green-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2">
                    <Check size={22} /> Enregistré !
                  </motion.div>
                ) : (
                  <button onClick={handleSave} className="w-full bg-primary-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-600 active:scale-[0.98] transition-all shadow-float">
                    <Check size={20} /> Confirmer et enregistrer
                  </button>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
