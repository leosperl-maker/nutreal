import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Image, Loader2, Check, X, Plus, Minus, Lightbulb,
  ChevronDown, Sparkles, AlertCircle, Flame
} from 'lucide-react';
import { useStore, type FoodItem, type Meal } from '../store/useStore';
import { getNutritionalScore } from '../lib/nutrition';

type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner';

const mealTypes: { value: MealType; label: string; emoji: string }[] = [
  { value: 'breakfast', label: 'Petit-déjeuner', emoji: '🌅' },
  { value: 'lunch', label: 'Déjeuner', emoji: '☀️' },
  { value: 'snack', label: 'Goûter', emoji: '🍪' },
  { value: 'dinner', label: 'Dîner', emoji: '🌙' },
];

// Simulated AI analysis for demo
function simulateAIAnalysis(imageFile: File): Promise<{
  dishName: string;
  foods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  totalFiber: number;
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
          totalCalories: 345,
          totalProtein: 13,
          totalFat: 17.7,
          totalCarbs: 35.5,
          totalFiber: 9,
          tip: 'Excellent petit-déjeuner ! Riche en fibres et en bonnes graisses. L\'avocat apporte des acides gras mono-insaturés bénéfiques pour le cœur.',
        };
      } else if (hour < 15) {
        result = {
          dishName: 'Poulet grillé avec riz et légumes',
          foods: [
            { name: 'Blanc de poulet grillé', calories: 165, protein_g: 31, fat_g: 3.6, carbs_g: 0, fiber_g: 0, quantity_g: 150 },
            { name: 'Riz basmati', calories: 180, protein_g: 3.5, fat_g: 0.5, carbs_g: 40, fiber_g: 0.5, quantity_g: 150 },
            { name: 'Brocoli vapeur', calories: 35, protein_g: 3, fat_g: 0.4, carbs_g: 7, fiber_g: 3, quantity_g: 100 },
            { name: 'Carottes', calories: 25, protein_g: 0.6, fat_g: 0.1, carbs_g: 6, fiber_g: 2, quantity_g: 60 },
            { name: 'Huile d\'olive', calories: 45, protein_g: 0, fat_g: 5, carbs_g: 0, fiber_g: 0, quantity_g: 5 },
          ],
          totalCalories: 450,
          totalProtein: 38.1,
          totalFat: 9.6,
          totalCarbs: 53,
          totalFiber: 5.5,
          tip: 'Très bon ratio protéines/calories ! Le brocoli apporte des vitamines C et K. Pensez à ajouter une source de fibres supplémentaire comme des lentilles.',
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
          totalCalories: 383,
          totalProtein: 28.2,
          totalFat: 18.2,
          totalCarbs: 26.8,
          totalFiber: 4.8,
          tip: 'Le saumon est riche en oméga-3, excellents pour le cerveau et le cœur. Le quinoa complète bien avec ses protéines végétales.',
        };
      }

      resolve(result);
    }, 2500);
  });
}

export default function Scanner() {
  const { addMeal } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<'capture' | 'analyzing' | 'result'>('capture');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<MealType>('lunch');
  const [showMealTypeSelector, setShowMealTypeSelector] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [editedFoods, setEditedFoods] = useState<FoodItem[]>([]);
  const [saved, setSaved] = useState(false);

  const handleImageCapture = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setStep('analyzing');

    try {
      const result = await simulateAIAnalysis(file);
      setAnalysisResult(result);
      setEditedFoods([...result.foods]);
      setStep('result');
    } catch (error) {
      console.error('Analysis failed:', error);
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
      const ratio = (food.quantity_g + delta) / food.quantity_g;
      if (food.quantity_g + delta <= 0) return prev;

      updated[index] = {
        ...food,
        quantity_g: food.quantity_g + delta,
        calories: Math.round(food.calories * ratio),
        protein_g: Math.round(food.protein_g * ratio * 10) / 10,
        fat_g: Math.round(food.fat_g * ratio * 10) / 10,
        carbs_g: Math.round(food.carbs_g * ratio * 10) / 10,
        fiber_g: Math.round(food.fiber_g * ratio * 10) / 10,
      };
      return updated;
    });
  };

  const removeFood = (index: number) => {
    setEditedFoods(prev => prev.filter((_, i) => i !== index));
  };

  const getTotals = () => {
    return {
      calories: editedFoods.reduce((sum, f) => sum + f.calories, 0),
      protein: editedFoods.reduce((sum, f) => sum + f.protein_g, 0),
      fat: editedFoods.reduce((sum, f) => sum + f.fat_g, 0),
      carbs: editedFoods.reduce((sum, f) => sum + f.carbs_g, 0),
      fiber: editedFoods.reduce((sum, f) => sum + f.fiber_g, 0),
    };
  };

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

    setTimeout(() => {
      setStep('capture');
      setImagePreview(null);
      setAnalysisResult(null);
      setEditedFoods([]);
      setSaved(false);
    }, 2000);
  };

  const handleReset = () => {
    setStep('capture');
    setImagePreview(null);
    setAnalysisResult(null);
    setEditedFoods([]);
    setSaved(false);
  };

  const totals = editedFoods.length > 0 ? getTotals() : null;
  const score = totals ? getNutritionalScore(totals.calories, totals.protein, totals.fiber, totals.fat) : null;

  return (
    <div className="min-h-screen pb-24">
      <AnimatePresence mode="wait">
        {/* Capture Step */}
        {step === 'capture' && (
          <motion.div
            key="capture"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen px-6"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Camera size={36} className="text-primary-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 font-display mb-2">Scanner IA</h1>
              <p className="text-gray-400 text-sm">Photographiez votre plat pour une analyse nutritionnelle instantanée</p>
            </div>

            {/* Meal Type Selector */}
            <div className="w-full max-w-sm mb-6">
              <button
                onClick={() => setShowMealTypeSelector(!showMealTypeSelector)}
                className="w-full bg-white rounded-xl p-3 shadow-card flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span>{mealTypes.find(m => m.value === selectedMealType)?.emoji}</span>
                  <span className="font-medium text-gray-700 text-sm">
                    {mealTypes.find(m => m.value === selectedMealType)?.label}
                  </span>
                </div>
                <ChevronDown size={18} className="text-gray-400" />
              </button>

              <AnimatePresence>
                {showMealTypeSelector && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white rounded-xl shadow-card mt-1 overflow-hidden"
                  >
                    {mealTypes.map(type => (
                      <button
                        key={type.value}
                        onClick={() => {
                          setSelectedMealType(type.value);
                          setShowMealTypeSelector(false);
                        }}
                        className={`w-full p-3 flex items-center gap-2 hover:bg-surface-50 transition-colors ${
                          selectedMealType === type.value ? 'bg-primary-50' : ''
                        }`}
                      >
                        <span>{type.emoji}</span>
                        <span className="text-sm font-medium text-gray-700">{type.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="w-full max-w-sm space-y-3">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="w-full bg-primary-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:bg-primary-600 active:scale-[0.98] transition-all shadow-float"
              >
                <Camera size={22} />
                Prendre une photo
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-white text-gray-700 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:bg-surface-50 active:scale-[0.98] transition-all shadow-card"
              >
                <Image size={22} />
                Choisir depuis la galerie
              </button>
            </div>

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <p className="text-xs text-gray-300 mt-6 text-center max-w-xs">
              L'IA analysera votre plat et estimera les calories et macronutriments
            </p>
          </motion.div>
        )}

        {/* Analyzing Step */}
        {step === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen px-6"
          >
            {imagePreview && (
              <div className="w-48 h-48 rounded-3xl overflow-hidden mb-8 shadow-xl">
                <img src={imagePreview} alt="Plat" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <Loader2 size={24} className="text-primary-500 animate-spin" />
              <Sparkles size={20} className="text-secondary-500 animate-pulse" />
            </div>

            <h2 className="text-lg font-bold text-gray-800 font-display mb-2">
              NutriLens analyse votre plat...
            </h2>
            <p className="text-sm text-gray-400 text-center">
              Identification des aliments et calcul nutritionnel en cours
            </p>

            <div className="mt-6 w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.5, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        )}

        {/* Result Step */}
        {step === 'result' && analysisResult && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="px-4 pt-12 pb-32 max-w-lg mx-auto"
          >
            {/* Image & Title */}
            <div className="relative mb-4">
              {imagePreview && (
                <div className="w-full h-48 rounded-2xl overflow-hidden shadow-card">
                  <img src={imagePreview} alt="Plat" className="w-full h-full object-cover" />
                </div>
              )}
              <button
                onClick={handleReset}
                className="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur rounded-full flex items-center justify-center text-white"
              >
                <X size={16} />
              </button>
            </div>

            <h2 className="text-xl font-bold text-gray-800 font-display mb-1">
              {analysisResult.dishName}
            </h2>

            {/* Score & Calories */}
            <div className="flex items-center gap-4 mb-4">
              {score && (
                <div
                  className="px-3 py-1 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: score.color }}
                >
                  {score.label}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Flame size={16} className="text-secondary-500" />
                <span className="text-lg font-bold text-gray-800">{totals?.calories}</span>
                <span className="text-sm text-gray-400">kcal</span>
              </div>
            </div>

            {/* Macro Circles */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { label: 'Protéines', value: totals?.protein, color: '#EF5350', unit: 'g' },
                { label: 'Lipides', value: totals?.fat, color: '#FFC107', unit: 'g' },
                { label: 'Glucides', value: totals?.carbs, color: '#FF9800', unit: 'g' },
                { label: 'Fibres', value: totals?.fiber, color: '#4CAF50', unit: 'g' },
              ].map(macro => (
                <div key={macro.label} className="bg-white rounded-xl p-3 shadow-card text-center">
                  <div
                    className="w-10 h-10 rounded-full mx-auto mb-1 flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: macro.color }}
                  >
                    {Math.round(macro.value || 0)}
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">{macro.label}</p>
                </div>
              ))}
            </div>

            {/* Foods List */}
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
                      <button
                        onClick={() => updateFoodQuantity(index, -10)}
                        className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 active:scale-90"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-medium text-gray-600 w-8 text-center">{food.quantity_g}g</span>
                      <button
                        onClick={() => updateFoodQuantity(index, 10)}
                        className="w-7 h-7 rounded-full bg-primary-50 flex items-center justify-center text-primary-500 hover:bg-primary-100 active:scale-90"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => removeFood(index)}
                        className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 active:scale-90 ml-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Tip */}
            {analysisResult.tip && (
              <div className="bg-primary-50 rounded-2xl p-4 mb-4 flex gap-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb size={16} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary-700 mb-1">Conseil NutriLens</p>
                  <p className="text-xs text-primary-600 leading-relaxed">{analysisResult.tip}</p>
                </div>
              </div>
            )}

            {/* Save Button */}
            <AnimatePresence>
              {saved ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-primary-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2"
                >
                  <Check size={22} />
                  Enregistré !
                </motion.div>
              ) : (
                <button
                  onClick={handleSave}
                  className="w-full bg-primary-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-600 active:scale-[0.98] transition-all shadow-float"
                >
                  <Check size={20} />
                  Confirmer et enregistrer
                </button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
