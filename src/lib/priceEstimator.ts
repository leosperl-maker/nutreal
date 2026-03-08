// ============================================
// PRICE ESTIMATOR ENGINE — ALL TERRITORIES
// ============================================

import type { Region } from './localIngredients';
import { estimatePrice, suggestCheaperAlternatives, checkAvailability } from './localIngredients';
import type { GroceryItem } from '../store/useStore';

export interface PricedGroceryItem extends GroceryItem {
  estimatedPrice: number;
  priceUnit: string;
  availability: string;
  isOverBudgetItem: boolean;
  alternatives: { name: string; price: number; savings: number }[];
}

export interface GroceryCategorySummary {
  category: string;
  items: PricedGroceryItem[];
  subtotal: number;
  itemCount: number;
}

export interface GroceryBudgetAnalysis {
  categories: GroceryCategorySummary[];
  totalEstimatedCost: number;
  weeklyBudget: number;
  isOverBudget: boolean;
  overBudgetAmount: number;
  savingsAvailable: number;
  currency: string;
  topExpensiveItems: PricedGroceryItem[];
  cheaperAlternatives: { original: string; alternative: string; savings: number }[];
}

export function analyzeGroceryBudget(
  groceryList: GroceryItem[],
  region: Region,
  weeklyBudget: number,
  currency: string,
  frequency: string
): GroceryBudgetAnalysis {
  const freqMultiplier = frequency === 'monthly' ? 4 : frequency === 'biweekly' ? 2 : 1;
  const effectiveBudget = weeklyBudget * freqMultiplier;

  const pricedItems: PricedGroceryItem[] = groceryList.map(item => {
    const quantityG = parseQuantityToGrams(item.quantity, item.unit);
    const priceInfo = estimatePrice(item.name, quantityG, region);
    const altInfo = suggestCheaperAlternatives(item.name, region);
    const avail = checkAvailability(item.name, region);

    return {
      ...item,
      estimatedPrice: priceInfo.price,
      priceUnit: priceInfo.unit,
      availability: avail,
      isOverBudgetItem: false,
      alternatives: altInfo.alternatives,
    };
  });

  const categoryMap = new Map<string, PricedGroceryItem[]>();
  for (const item of pricedItems) {
    const cat = item.category;
    if (!categoryMap.has(cat)) categoryMap.set(cat, []);
    categoryMap.get(cat)!.push(item);
  }

  const categories: GroceryCategorySummary[] = Array.from(categoryMap.entries())
    .map(([category, items]) => ({
      category,
      items: items.sort((a, b) => b.estimatedPrice - a.estimatedPrice),
      subtotal: Math.round(items.reduce((sum, i) => sum + i.estimatedPrice, 0) * 100) / 100,
      itemCount: items.length,
    }))
    .sort((a, b) => a.category.localeCompare(b.category));

  const totalEstimatedCost = Math.round(categories.reduce((sum, cat) => sum + cat.subtotal, 0) * 100) / 100;
  const isOverBudget = effectiveBudget > 0 && totalEstimatedCost > effectiveBudget;
  const overBudgetAmount = isOverBudget ? Math.round((totalEstimatedCost - effectiveBudget) * 100) / 100 : 0;

  const sortedByPrice = [...pricedItems].sort((a, b) => b.estimatedPrice - a.estimatedPrice);
  const topExpensiveItems = sortedByPrice.slice(0, 5);

  if (isOverBudget) {
    let remaining = overBudgetAmount;
    for (const item of sortedByPrice) {
      if (remaining <= 0) break;
      if (item.alternatives.length > 0) {
        item.isOverBudgetItem = true;
        remaining -= item.alternatives[0].savings;
      }
    }
  }

  const cheaperAlternatives: { original: string; alternative: string; savings: number }[] = [];
  let totalSavingsAvailable = 0;

  for (const item of pricedItems) {
    if (item.alternatives.length > 0) {
      const best = item.alternatives[0];
      cheaperAlternatives.push({ original: item.name, alternative: best.name, savings: best.savings });
      totalSavingsAvailable += best.savings;
    }
  }

  cheaperAlternatives.sort((a, b) => b.savings - a.savings);

  return {
    categories,
    totalEstimatedCost,
    weeklyBudget: effectiveBudget,
    isOverBudget,
    overBudgetAmount,
    savingsAvailable: Math.round(totalSavingsAvailable * 100) / 100,
    currency,
    topExpensiveItems,
    cheaperAlternatives: cheaperAlternatives.slice(0, 10),
  };
}

export function estimateRecipeCost(
  ingredients: { name: string; quantity: string; unit: string }[],
  region: Region,
  currency: string
): { totalCost: number; perServing: number; items: { name: string; cost: number }[] } {
  const items = ingredients.map(ing => {
    const quantityG = parseQuantityToGrams(ing.quantity, ing.unit);
    const priceInfo = estimatePrice(ing.name, quantityG, region);
    return { name: ing.name, cost: priceInfo.price };
  });

  const totalCost = Math.round(items.reduce((sum, i) => sum + i.cost, 0) * 100) / 100;
  return { totalCost, perServing: totalCost, items };
}

function parseQuantityToGrams(quantity: string, unit: string): number {
  const num = parseFloat(quantity) || 100;
  switch (unit.toLowerCase()) {
    case 'kg': return num * 1000;
    case 'g': return num;
    case 'l': case 'litre': return num * 1000;
    case 'ml': return num;
    default: return num * 200;
  }
}
