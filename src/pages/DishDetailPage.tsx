import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ArrowLeft, Clock, Flame, Drumstick, Wheat, Droplet, Leaf } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import { generateRecipeWithGemini } from '../lib/gemini';
import type { RecipeResult } from '../lib/gemini';

const SLOT_LABELS: Record<string, { label: string; emoji: string }> = {
  breakfast: { label: 'Petit-d\u00e9j', emoji: '\uD83C\uDF05' },
  lunch:     { label: 'D\u00e9jeuner',  emoji: '\u2600\uFE0F' },
  snack:     { label: 'Collation',  emoji: '\uD83C\uDF4E' },
  dinner:    { label: 'D\u00eener',     emoji: '\uD83C\uDF19' },
};

export default function DishDetailPage() {
  const { dayIndex, slotIndex } = useParams<{ dayIndex: string; slotIndex: string }>();
  const navigate = useNavigate();
  const { mealPlan } = useStore();

  const [recipe, setRecipe] = useState<RecipeResult | null>(null);
  const [loadingRecipe, setLoadingRecipe] = useState(true);

  const di = Number(dayIndex);
  const si = Number(slotIndex);

  // Validate data availability
  const day = mealPlan?.days?.[di];
  const slot = day?.slots?.[si];
  const opt = slot && slot.selectedIndex !== null ? slot.options[slot.selectedIndex] : null;

  useEffect(() => {
    if (!mealPlan || !opt) {
      navigate('/meal-plan', { replace: true });
    }
  }, [mealPlan, opt, navigate]);

  // Load recipe from Gemini on mount
  useEffect(() => {
    if (!opt) return;

    let cancelled = false;
    setLoadingRecipe(true);

    generateRecipeWithGemini(opt.name, opt.ingredients).then((result) => {
      if (!cancelled) {
        setRecipe(result);
        setLoadingRecipe(false);
      }
    }).catch(() => {
      if (!cancelled) setLoadingRecipe(false);
    });

    return () => { cancelled = true; };
  }, [opt?.name]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mealPlan || !slot || !opt) return null;

  const slotInfo = SLOT_LABELS[slot.type] || { label: slot.type, emoji: '' };

  // Macro helpers
  const macroMax = {
    protein: (mealPlan.calorieBudget * 0.3) / 4,  // ~30% from protein
    carbs:   (mealPlan.calorieBudget * 0.45) / 4,  // ~45% from carbs
    fat:     (mealPlan.calorieBudget * 0.25) / 9,  // ~25% from fat
    fiber:   35,
  };

  const macros = [
    { label: 'Prot\u00e9ines', value: opt.protein_g, unit: 'g', icon: Drumstick, color: 'blue',  max: macroMax.protein },
    { label: 'Glucides',   value: opt.carbs_g,   unit: 'g', icon: Wheat,     color: 'amber', max: macroMax.carbs },
    { label: 'Lipides',    value: opt.fat_g,     unit: 'g', icon: Droplet,   color: 'rose',  max: macroMax.fat },
    { label: 'Fibres',     value: opt.fiber_g,   unit: 'g', icon: Leaf,      color: 'green', max: macroMax.fiber },
  ];

  const colorMap: Record<string, { bg: string; fill: string; text: string; iconBg: string }> = {
    blue:  { bg: 'bg-blue-100',  fill: 'bg-blue-500',  text: 'text-blue-600',  iconBg: 'bg-blue-50' },
    amber: { bg: 'bg-amber-100', fill: 'bg-amber-500', text: 'text-amber-600', iconBg: 'bg-amber-50' },
    rose:  { bg: 'bg-rose-100',  fill: 'bg-rose-500',  text: 'text-rose-600',  iconBg: 'bg-rose-50' },
    green: { bg: 'bg-green-100', fill: 'bg-green-500', text: 'text-green-600', iconBg: 'bg-green-50' },
  };

  return (
    <AnimatedPage className="pb-8 max-w-lg mx-auto">
      {/* ── Hero image ─────────────────────────────────────────────────────────── */}
      <div className="relative w-full h-56 overflow-hidden">
        <img
          src={opt.imageUrl}
          alt={opt.name}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Back button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
        >
          <ArrowLeft size={20} className="text-white" />
        </motion.button>

        {/* Dish name & slot label at bottom */}
        <div className="absolute bottom-4 left-4 right-4">
          <span className="inline-block text-xs font-semibold text-white/80 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 mb-2">
            {slotInfo.emoji} {slotInfo.label}
          </span>
          <h1 className="text-2xl font-black text-white leading-tight">{opt.name}</h1>
        </div>
      </div>

      {/* ── Quick info bar ─────────────────────────────────────────────────────── */}
      <div className="mx-4 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-around">
          <div className="flex flex-col items-center gap-1">
            <Clock size={18} className="text-text-secondary" />
            <span className="text-xs font-bold text-text-primary">{opt.prepTime || '~20 min'}</span>
            <span className="text-[10px] text-text-muted">Pr\u00e9paration</span>
          </div>
          <div className="w-px h-10 bg-surface-200" />
          <div className="flex flex-col items-center gap-1">
            <Flame size={18} className="text-orange-500" />
            <span className="text-xs font-bold text-text-primary">{opt.calories} kcal</span>
            <span className="text-[10px] text-text-muted">Calories</span>
          </div>
          <div className="w-px h-10 bg-surface-200" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg">{slotInfo.emoji}</span>
            <span className="text-xs font-bold text-text-primary">{slotInfo.label}</span>
            <span className="text-[10px] text-text-muted">Repas</span>
          </div>
        </div>
      </div>

      {/* ── Macros section ─────────────────────────────────────────────────────── */}
      <div className="px-4 mt-6">
        <h2 className="text-sm font-bold text-text-primary mb-3">Macronutriments</h2>
        <div className="grid grid-cols-2 gap-3">
          {macros.map((m) => {
            const colors = colorMap[m.color];
            const Icon = m.icon;
            const pct = Math.min((m.value / m.max) * 100, 100);
            return (
              <div key={m.label} className="bg-white rounded-2xl p-3 shadow-sm border border-surface-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-xl ${colors.iconBg} flex items-center justify-center`}>
                    <Icon size={16} className={colors.text} />
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted">{m.label}</p>
                    <p className={`text-sm font-bold ${colors.text}`}>{m.value}{m.unit}</p>
                  </div>
                </div>
                <div className={`w-full h-1.5 rounded-full ${colors.bg}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={`h-full rounded-full ${colors.fill}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Ingredients list ───────────────────────────────────────────────────── */}
      <div className="px-4 mt-6">
        <h2 className="text-sm font-bold text-text-primary mb-3">Ingr\u00e9dients</h2>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-surface-200">
          <ul className="space-y-2">
            {opt.ingredients.map((ing, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />
                <span className="text-sm text-text-secondary">{ing}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Recipe section ─────────────────────────────────────────────────────── */}
      <div className="px-4 mt-6">
        <h2 className="text-sm font-bold text-text-primary mb-3">Recette</h2>

        {loadingRecipe ? (
          /* Shimmer skeleton */
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-surface-200 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-1/3 rounded-lg bg-gradient-to-r from-surface-200 via-surface-100 to-surface-200 animate-shimmer bg-[length:200%_100%]" />
                <div className="h-3 w-full rounded-lg bg-gradient-to-r from-surface-200 via-surface-100 to-surface-200 animate-shimmer bg-[length:200%_100%]" />
                <div className="h-3 w-5/6 rounded-lg bg-gradient-to-r from-surface-200 via-surface-100 to-surface-200 animate-shimmer bg-[length:200%_100%]" />
              </div>
            ))}
          </div>
        ) : recipe ? (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-surface-200">
            {/* Recipe meta */}
            <div className="flex flex-wrap gap-3 mb-4">
              {recipe.prepTime && (
                <span className="text-[10px] bg-surface-100 text-text-secondary rounded-full px-2.5 py-1 font-medium">
                  Pr\u00e9p: {recipe.prepTime}
                </span>
              )}
              {recipe.cookTime && (
                <span className="text-[10px] bg-surface-100 text-text-secondary rounded-full px-2.5 py-1 font-medium">
                  Cuisson: {recipe.cookTime}
                </span>
              )}
              {recipe.difficulty && (
                <span className="text-[10px] bg-surface-100 text-text-secondary rounded-full px-2.5 py-1 font-medium">
                  {recipe.difficulty}
                </span>
              )}
              {recipe.servings && (
                <span className="text-[10px] bg-surface-100 text-text-secondary rounded-full px-2.5 py-1 font-medium">
                  {recipe.servings} pers.
                </span>
              )}
            </div>

            {/* Recipe ingredients with quantities */}
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Ingr\u00e9dients</h3>
            <ul className="space-y-1.5 mb-5">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-text-secondary">
                    <span className="font-medium text-text-primary">{ing.quantity}</span> {ing.item}
                  </span>
                </li>
              ))}
            </ul>

            {/* Recipe steps */}
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">\u00c9tapes</h3>
            <ol className="space-y-3">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary-600">{i + 1}</span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>

            {/* Tips */}
            {recipe.tips && (
              <div className="mt-4 p-3 bg-amber-50 rounded-xl">
                <p className="text-xs text-amber-700">
                  <span className="font-bold">Astuce du chef :</span> {recipe.tips}
                </p>
              </div>
            )}

            {/* Nutritional note */}
            {recipe.nutritionalNote && (
              <p className="text-[10px] text-text-muted mt-3">{recipe.nutritionalNote}</p>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-surface-200">
            <p className="text-sm text-text-muted text-center">Impossible de charger la recette. R\u00e9essayez plus tard.</p>
          </div>
        )}
      </div>

      {/* ── "Pourquoi c'est bon" section ───────────────────────────────────────── */}
      {opt.benefitsNote && (
        <div className="px-4 mt-6">
          <h2 className="text-sm font-bold text-text-primary mb-3">Pourquoi c'est bon pour vous</h2>
          <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <Leaf size={16} className="text-green-600" />
              </div>
              <p className="text-sm text-green-700 leading-relaxed">{opt.benefitsNote}</p>
            </div>
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}
