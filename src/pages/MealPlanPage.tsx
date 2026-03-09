import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { MealPlanDay, MealPlanOption } from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedCard from '../components/AnimatedCard';
import SuccessCheckmark from '../components/SuccessCheckmark';
import { ChefHat, ShoppingCart, Check, Sparkles, RefreshCw, UtensilsCrossed, Clock, ChevronRight } from 'lucide-react';

const SLOT_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  breakfast: { label: 'Petit-déj', emoji: '🌅', color: 'from-amber-400 to-orange-500' },
  lunch: { label: 'Déjeuner', emoji: '☀️', color: 'from-blue-400 to-cyan-500' },
  snack: { label: 'Collation', emoji: '🍎', color: 'from-green-400 to-emerald-500' },
  dinner: { label: 'Dîner', emoji: '🌙', color: 'from-indigo-400 to-purple-500' },
};

const DAY_SHORT: Record<string, string> = {
  'Lundi': 'Lun', 'Mardi': 'Mar', 'Mercredi': 'Mer', 'Jeudi': 'Jeu',
  'Vendredi': 'Ven', 'Samedi': 'Sam', 'Dimanche': 'Dim',
};

// ─── Images ──────────────────────────────────────────────────────────────────
const IMG = {
  chicken: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400',
  salad:   'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
  bowl:    'https://images.pexels.com/photos/1095550/pexels-photo-1095550.jpeg?auto=compress&cs=tinysrgb&w=400',
  eggs:    'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=400',
  fish:    'https://images.pexels.com/photos/1640769/pexels-photo-1640769.jpeg?auto=compress&cs=tinysrgb&w=400',
  smoothie:'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400',
  misc:    'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400',
  grains:  'https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg?auto=compress&cs=tinysrgb&w=400',
  curry:   'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=400',
  fruits:  'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400',
  pasta:   'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
  bread:   'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
};

type PoolItem = Omit<MealPlanOption, 'recipe'>;

// ─── Food pools (with prepTime & benefitsNote) ──────────────────────────────
const BREAKFAST_POOL: PoolItem[] = [
  { name: 'Bol açaï fruits frais', ingredients: ['açaï', 'banane', 'fraises', 'granola', 'miel', 'myrtilles'], calories: 340, protein_g: 8, fat_g: 11, carbs_g: 54, fiber_g: 8, imageUrl: IMG.fruits, prepTime: '10 min', benefitsNote: 'Riche en antioxydants et fibres, parfait pour un petit-déjeuner énergisant.' },
  { name: 'Shakshuka œufs tomate', ingredients: ['œufs', 'tomates pelées', 'poivron', 'oignon', 'cumin', 'paprika', 'pain pita'], calories: 420, protein_g: 22, fat_g: 18, carbs_g: 38, fiber_g: 5, imageUrl: IMG.eggs, prepTime: '25 min', benefitsNote: 'Excellent apport en protéines et lycopène, idéal pour la récupération musculaire.' },
  { name: 'Avocado toast œuf poché', ingredients: ['pain complet', 'avocat', 'œufs', 'citron', 'graines de sésame'], calories: 410, protein_g: 18, fat_g: 24, carbs_g: 35, fiber_g: 8, imageUrl: IMG.eggs, prepTime: '15 min', benefitsNote: 'Acides gras mono-insaturés de l\'avocat favorisent la santé cardiovasculaire.' },
  { name: 'Porridge avoine baies', ingredients: ['flocons d\'avoine', 'lait', 'myrtilles', 'fraises', 'miel', 'cannelle'], calories: 380, protein_g: 12, fat_g: 8, carbs_g: 65, fiber_g: 7, imageUrl: IMG.grains, prepTime: '10 min', benefitsNote: 'L\'avoine est riche en bêta-glucanes qui réduisent le cholestérol.' },
  { name: 'Pancakes myrtilles sirop', ingredients: ['farine', 'œufs', 'lait', 'beurre', 'myrtilles', 'sirop d\'érable'], calories: 450, protein_g: 11, fat_g: 12, carbs_g: 75, fiber_g: 3, imageUrl: IMG.bread, prepTime: '20 min', benefitsNote: 'Énergie rapide grâce aux glucides, les myrtilles apportent des vitamines C et K.' },
  { name: 'Granola yaourt grec', ingredients: ['granola', 'yaourt grec', 'miel', 'noix', 'raisins secs'], calories: 370, protein_g: 16, fat_g: 13, carbs_g: 50, fiber_g: 4, imageUrl: IMG.grains, prepTime: '5 min', benefitsNote: 'Le yaourt grec est riche en protéines et probiotiques pour la flore intestinale.' },
  { name: 'Smoothie bowl mangue chia', ingredients: ['mangue', 'banane', 'lait de coco', 'chia', 'kiwi'], calories: 320, protein_g: 7, fat_g: 9, carbs_g: 56, fiber_g: 9, imageUrl: IMG.smoothie, prepTime: '10 min', benefitsNote: 'Les graines de chia sont riches en oméga-3 et en fibres solubles.' },
  { name: 'Crêpes fromage blanc fruits', ingredients: ['farine', 'œufs', 'lait', 'fromage blanc', 'fruits rouges'], calories: 400, protein_g: 14, fat_g: 10, carbs_g: 62, fiber_g: 3, imageUrl: IMG.bread, prepTime: '20 min', benefitsNote: 'Le fromage blanc apporte du calcium et des protéines de caséine à digestion lente.' },
  { name: 'Œufs bénédicte saumon', ingredients: ['pain anglais', 'œufs', 'épinards', 'sauce hollandaise', 'saumon'], calories: 480, protein_g: 26, fat_g: 26, carbs_g: 32, fiber_g: 4, imageUrl: IMG.eggs, prepTime: '25 min', benefitsNote: 'Le saumon est une excellente source d\'oméga-3 DHA pour le cerveau.' },
  { name: 'Smoothie vert épinards', ingredients: ['épinards', 'banane', 'pomme', 'gingembre', 'lait végétal', 'chia'], calories: 290, protein_g: 8, fat_g: 5, carbs_g: 55, fiber_g: 8, imageUrl: IMG.smoothie, prepTime: '5 min', benefitsNote: 'Les épinards apportent du fer et de l\'acide folique, essentiels à la vitalité.' },
  { name: 'Toast saumon fumé cream cheese', ingredients: ['pain de seigle', 'saumon fumé', 'cream cheese', 'câpres', 'aneth'], calories: 360, protein_g: 20, fat_g: 16, carbs_g: 34, fiber_g: 4, imageUrl: IMG.fish, prepTime: '5 min', benefitsNote: 'Combinaison parfaite de protéines et oméga-3 pour bien démarrer la journée.' },
  { name: 'Overnight oats chocolat', ingredients: ['flocons d\'avoine', 'lait', 'cacao', 'banane', 'beurre de cacahuète'], calories: 420, protein_g: 14, fat_g: 15, carbs_g: 58, fiber_g: 6, imageUrl: IMG.grains, prepTime: '5 min', benefitsNote: 'Préparé la veille, ce petit-déjeuner riche en fibres régule la glycémie toute la matinée.' },
];

const LUNCH_POOL: PoolItem[] = [
  { name: 'Ramen miso poulet', ingredients: ['nouilles', 'bouillon miso', 'poulet', 'œuf', 'champignons', 'nori'], calories: 520, protein_g: 32, fat_g: 16, carbs_g: 60, fiber_g: 5, imageUrl: IMG.bowl, prepTime: '30 min', benefitsNote: 'Le miso est fermenté et riche en probiotiques, bon pour la digestion.' },
  { name: 'Poke bowl saumon avocat', ingredients: ['saumon', 'riz sushi', 'avocat', 'concombre', 'edamame'], calories: 540, protein_g: 30, fat_g: 22, carbs_g: 55, fiber_g: 7, imageUrl: IMG.fish, prepTime: '15 min', benefitsNote: 'Équilibre parfait entre protéines, bons gras et glucides complexes.' },
  { name: 'Pâtes carbonara', ingredients: ['spaghetti', 'pancetta', 'œufs', 'parmesan', 'poivre noir'], calories: 610, protein_g: 26, fat_g: 24, carbs_g: 72, fiber_g: 3, imageUrl: IMG.pasta, prepTime: '20 min', benefitsNote: 'Source dense d\'énergie, le parmesan apporte du calcium et des protéines.' },
  { name: 'Buddha bowl falafel', ingredients: ['pois chiches', 'houmous', 'quinoa', 'salade', 'tahini'], calories: 480, protein_g: 18, fat_g: 20, carbs_g: 58, fiber_g: 12, imageUrl: IMG.bowl, prepTime: '25 min', benefitsNote: 'Repas 100% végétal riche en fibres et protéines végétales complètes.' },
  { name: 'Curry tikka masala', ingredients: ['poulet', 'sauce tikka', 'riz basmati', 'crème', 'gingembre'], calories: 580, protein_g: 36, fat_g: 20, carbs_g: 65, fiber_g: 4, imageUrl: IMG.curry, prepTime: '35 min', benefitsNote: 'Les épices comme le curcuma et le gingembre ont des propriétés anti-inflammatoires.' },
  { name: 'Tacos poulet guacamole', ingredients: ['tortillas', 'poulet grillé', 'avocat', 'coriandre', 'citron vert'], calories: 490, protein_g: 28, fat_g: 22, carbs_g: 52, fiber_g: 7, imageUrl: IMG.chicken, prepTime: '20 min', benefitsNote: 'Riche en protéines maigres et en graisses saines de l\'avocat.' },
  { name: 'Pad thai crevettes', ingredients: ['nouilles de riz', 'crevettes', 'œuf', 'sauce poisson', 'arachides'], calories: 520, protein_g: 26, fat_g: 18, carbs_g: 65, fiber_g: 4, imageUrl: IMG.fish, prepTime: '20 min', benefitsNote: 'Les crevettes sont faibles en calories et riches en sélénium antioxydant.' },
  { name: 'Salade niçoise thon', ingredients: ['thon', 'haricots verts', 'œuf dur', 'tomate', 'olives'], calories: 390, protein_g: 30, fat_g: 20, carbs_g: 22, fiber_g: 7, imageUrl: IMG.salad, prepTime: '15 min', benefitsNote: 'Repas léger et complet, riche en protéines et pauvre en glucides.' },
  { name: 'Bibimbap légumes', ingredients: ['riz', 'tempeh', 'épinards', 'carotte', 'gochujang', 'œuf'], calories: 500, protein_g: 22, fat_g: 16, carbs_g: 70, fiber_g: 8, imageUrl: IMG.bowl, prepTime: '25 min', benefitsNote: 'Plat coréen équilibré, le tempeh fermenté est très digestible.' },
  { name: 'Risotto champignons', ingredients: ['riz arborio', 'champignons', 'parmesan', 'vin blanc', 'bouillon'], calories: 560, protein_g: 16, fat_g: 18, carbs_g: 80, fiber_g: 5, imageUrl: IMG.grains, prepTime: '35 min', benefitsNote: 'Les champignons sont riches en vitamine D et en antioxydants.' },
  { name: 'Wrap poulet Caesar', ingredients: ['tortilla blé', 'poulet grillé', 'romaine', 'parmesan', 'sauce Caesar'], calories: 480, protein_g: 32, fat_g: 20, carbs_g: 42, fiber_g: 3, imageUrl: IMG.chicken, prepTime: '10 min', benefitsNote: 'Pratique à emporter, bon ratio protéines/calories pour un déjeuner actif.' },
  { name: 'Soupe pho vietnamienne', ingredients: ['bouillon bœuf', 'nouilles de riz', 'bœuf', 'herbes fraîches', 'germes soja'], calories: 420, protein_g: 28, fat_g: 10, carbs_g: 55, fiber_g: 3, imageUrl: IMG.bowl, prepTime: '40 min', benefitsNote: 'Bouillon riche en collagène, les herbes fraîches apportent vitamines et minéraux.' },
];

const SNACK_POOL: PoolItem[] = [
  { name: 'Edamame sel de mer', ingredients: ['edamame', 'sel de mer'], calories: 120, protein_g: 10, fat_g: 4, carbs_g: 10, fiber_g: 5, imageUrl: IMG.misc, prepTime: '5 min', benefitsNote: 'Protéines végétales complètes et fibres pour une collation rassasiante.' },
  { name: 'Houmous crudités', ingredients: ['houmous', 'carotte', 'concombre', 'poivron'], calories: 180, protein_g: 6, fat_g: 8, carbs_g: 22, fiber_g: 6, imageUrl: IMG.salad, prepTime: '5 min', benefitsNote: 'Les pois chiches apportent fer et fibres, les crudités des vitamines.' },
  { name: 'Yaourt grec miel noix', ingredients: ['yaourt grec', 'miel', 'noix', 'cannelle'], calories: 210, protein_g: 14, fat_g: 10, carbs_g: 18, fiber_g: 1, imageUrl: IMG.misc, prepTime: '3 min', benefitsNote: 'Riche en protéines et probiotiques, les noix apportent des oméga-3.' },
  { name: 'Pomme beurre amande', ingredients: ['pomme', 'beurre d\'amande'], calories: 200, protein_g: 5, fat_g: 9, carbs_g: 28, fiber_g: 4, imageUrl: IMG.fruits, prepTime: '2 min', benefitsNote: 'Combinaison glucides lents + bons gras pour une énergie durable.' },
  { name: 'Smoothie protéines', ingredients: ['banane', 'lait', 'protéines', 'beurre de cacahuète'], calories: 280, protein_g: 20, fat_g: 8, carbs_g: 35, fiber_g: 4, imageUrl: IMG.smoothie, prepTime: '5 min', benefitsNote: 'Idéal après le sport, apporte protéines pour la récupération musculaire.' },
  { name: 'Rice cakes avocat', ingredients: ['galettes de riz', 'avocat', 'saumon fumé'], calories: 220, protein_g: 12, fat_g: 10, carbs_g: 22, fiber_g: 3, imageUrl: IMG.fish, prepTime: '5 min', benefitsNote: 'Léger et nutritif, combine glucides rapides et graisses saines.' },
  { name: 'Fruits de saison', ingredients: ['fraises', 'kiwi', 'raisins', 'melon'], calories: 140, protein_g: 2, fat_g: 0.5, carbs_g: 32, fiber_g: 4, imageUrl: IMG.fruits, prepTime: '5 min', benefitsNote: 'Vitamines C et antioxydants naturels, parfait pour un coup de boost.' },
  { name: 'Noix et fruits secs', ingredients: ['amandes', 'noix de cajou', 'raisins secs'], calories: 230, protein_g: 7, fat_g: 16, carbs_g: 20, fiber_g: 3, imageUrl: IMG.grains, prepTime: '1 min', benefitsNote: 'Source concentrée d\'énergie, magnésium et acides gras essentiels.' },
  { name: 'Tartine ricotta miel', ingredients: ['pain complet', 'ricotta', 'miel', 'pistaches'], calories: 240, protein_g: 10, fat_g: 9, carbs_g: 30, fiber_g: 3, imageUrl: IMG.bread, prepTime: '3 min', benefitsNote: 'La ricotta est riche en protéines de lactosérum, facilement assimilables.' },
  { name: 'Energy balls dattes cacao', ingredients: ['dattes', 'cacao', 'flocons d\'avoine', 'beurre de cacahuète'], calories: 190, protein_g: 5, fat_g: 8, carbs_g: 26, fiber_g: 3, imageUrl: IMG.misc, prepTime: '10 min', benefitsNote: 'Énergie naturelle des dattes sans sucres ajoutés, riche en magnésium.' },
];

const DINNER_POOL: PoolItem[] = [
  { name: 'Saumon grillé brocoli riz', ingredients: ['saumon', 'brocoli', 'riz brun', 'citron', 'herbes'], calories: 480, protein_g: 40, fat_g: 18, carbs_g: 42, fiber_g: 6, imageUrl: IMG.fish, prepTime: '25 min', benefitsNote: 'Le saumon est la meilleure source d\'oméga-3 DHA et EPA pour le cœur.' },
  { name: 'Tagine agneau pruneaux', ingredients: ['agneau', 'pruneaux', 'oignons', 'cumin', 'couscous'], calories: 560, protein_g: 34, fat_g: 20, carbs_g: 58, fiber_g: 6, imageUrl: IMG.curry, prepTime: '45 min', benefitsNote: 'Les pruneaux sont riches en fibres et potassium, l\'agneau en fer héminique.' },
  { name: 'Pasta arrabiata', ingredients: ['penne', 'tomates pelées', 'piment', 'ail', 'parmesan'], calories: 490, protein_g: 16, fat_g: 14, carbs_g: 76, fiber_g: 6, imageUrl: IMG.pasta, prepTime: '20 min', benefitsNote: 'Le piment contient de la capsaïcine qui booste le métabolisme.' },
  { name: 'Poulet tikka masala naan', ingredients: ['poulet', 'sauce tikka', 'crème de coco', 'naan', 'riz'], calories: 600, protein_g: 38, fat_g: 22, carbs_g: 65, fiber_g: 4, imageUrl: IMG.curry, prepTime: '35 min', benefitsNote: 'Le curcuma du tikka masala est un puissant anti-inflammatoire naturel.' },
  { name: 'Paella fruits de mer', ingredients: ['riz', 'crevettes', 'moules', 'calamars', 'safran'], calories: 520, protein_g: 34, fat_g: 14, carbs_g: 65, fiber_g: 4, imageUrl: IMG.fish, prepTime: '40 min', benefitsNote: 'Les fruits de mer sont riches en zinc et iode, essentiels au système immunitaire.' },
  { name: 'Bœuf stir-fry légumes', ingredients: ['bœuf', 'brocoli', 'poivron', 'sauce soja', 'riz jasmin'], calories: 510, protein_g: 36, fat_g: 18, carbs_g: 52, fiber_g: 6, imageUrl: IMG.chicken, prepTime: '20 min', benefitsNote: 'Le bœuf est la meilleure source de fer héminique et de vitamine B12.' },
  { name: 'Tom yum crevettes', ingredients: ['crevettes', 'citronnelle', 'champignons', 'piment', 'riz'], calories: 380, protein_g: 28, fat_g: 10, carbs_g: 44, fiber_g: 4, imageUrl: IMG.fish, prepTime: '25 min', benefitsNote: 'Soupe légère et parfumée, la citronnelle a des propriétés digestives.' },
  { name: 'Colombo poulet riz', ingredients: ['poulet', 'riz', 'lait de coco', 'colombo', 'pomme de terre'], calories: 520, protein_g: 35, fat_g: 18, carbs_g: 55, fiber_g: 4, imageUrl: IMG.chicken, prepTime: '40 min', benefitsNote: 'Plat antillais complet, les épices colombo favorisent la digestion.' },
  { name: 'Gnocchi pesto', ingredients: ['gnocchi', 'pesto', 'tomates cerises', 'parmesan', 'pignons'], calories: 530, protein_g: 14, fat_g: 24, carbs_g: 66, fiber_g: 4, imageUrl: IMG.pasta, prepTime: '15 min', benefitsNote: 'Le basilic du pesto est riche en vitamine K et antioxydants.' },
  { name: 'Poulet citron herbes', ingredients: ['poulet', 'courgette', 'poivron', 'citron', 'thym'], calories: 420, protein_g: 40, fat_g: 16, carbs_g: 22, fiber_g: 6, imageUrl: IMG.chicken, prepTime: '30 min', benefitsNote: 'Repas riche en protéines et pauvre en glucides, idéal pour la sèche.' },
  { name: 'Curry vert thaï crevettes', ingredients: ['crevettes', 'lait de coco', 'pâte curry vert', 'bambou', 'riz jasmin'], calories: 490, protein_g: 30, fat_g: 20, carbs_g: 50, fiber_g: 4, imageUrl: IMG.curry, prepTime: '25 min', benefitsNote: 'Le lait de coco contient des MCT, acides gras facilement convertis en énergie.' },
  { name: 'Gratin dauphinois poulet rôti', ingredients: ['poulet', 'pommes de terre', 'crème', 'ail', 'gruyère'], calories: 580, protein_g: 38, fat_g: 24, carbs_g: 52, fiber_g: 4, imageUrl: IMG.chicken, prepTime: '50 min', benefitsNote: 'Repas réconfortant, les pommes de terre sont riches en potassium et vitamine C.' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function getThreeDistinct<T>(pool: T[], dayIndex: number): T[] {
  const s = shuffle(pool);
  return [s[dayIndex % s.length], s[(dayIndex + Math.floor(s.length / 3)) % s.length], s[(dayIndex + Math.floor(s.length * 2 / 3)) % s.length]];
}

function getMealPrice(name: string, ingredients: string[]): number {
  const n = name.toLowerCase();
  const premium = ['saumon', 'thon', 'crevette'].some(w => n.includes(w));
  const medium = ['poulet', 'bœuf', 'agneau'].some(w => n.includes(w));
  const base = 1.80 + ingredients.length * 0.22;
  const mult = premium ? 2.2 : medium ? 1.5 : 1.1;
  const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return Math.round((base * mult + (hash % 12) * 0.09) * 100) / 100;
}

function getIngredientPrice(name: string, quantity: number, unit: string): number {
  const n = name.toLowerCase();
  const prices: Record<string, number> = {
    'saumon': 3.5, 'poulet': 2.2, 'bœuf': 3.8, 'agneau': 4.5, 'thon': 2.8, 'crevettes': 4.0, 'œuf': 0.3,
    'riz': 0.4, 'pâtes': 0.6, 'quinoa': 1.2, 'farine': 0.3, 'pain': 0.5, 'avoine': 0.6,
    'avocat': 1.2, 'tomate': 0.5, 'oignon': 0.2, 'brocoli': 0.8, 'épinards': 0.7,
    'banane': 0.3, 'pomme': 0.4, 'mangue': 1.0, 'fraises': 1.5, 'myrtilles': 2.0,
    'yaourt': 0.6, 'fromage': 1.2, 'parmesan': 2.0, 'beurre': 0.5, 'lait': 0.4,
    'huile d\'olive': 0.8, 'noix': 1.5, 'amandes': 1.8, 'miel': 0.7,
  };
  const found = Object.entries(prices).find(([k]) => n.includes(k));
  const unitPrice = found ? found[1] : 0.5;
  const qty = unit === 'kg' ? quantity : unit === 'g' ? quantity / 1000 : quantity;
  return Math.round(unitPrice * Math.max(qty, 0.5) * 100) / 100;
}

function getImageForDish(name: string, type: string): string {
  const n = name.toLowerCase();
  if (['saumon', 'morue', 'thon', 'crevette', 'poisson', 'poke', 'paella'].some(w => n.includes(w))) return IMG.fish;
  if (['poulet', 'bœuf', 'agneau', 'porc', 'colombo', 'tikka'].some(w => n.includes(w))) return IMG.chicken;
  if (['pasta', 'pâtes', 'spaghetti', 'penne', 'gnocchi', 'risotto'].some(w => n.includes(w))) return IMG.pasta;
  if (['curry', 'tagine', 'tikka', 'ramen', 'thai'].some(w => n.includes(w))) return IMG.curry;
  if (['smoothie', 'soupe', 'açaï'].some(w => n.includes(w))) return IMG.smoothie;
  if (['bowl', 'buddha', 'bibimbap', 'burrito'].some(w => n.includes(w))) return IMG.bowl;
  if (['œuf', 'shakshuka', 'pancake', 'crêpe'].some(w => n.includes(w))) return IMG.eggs;
  if (['pain', 'tartine', 'toast'].some(w => n.includes(w))) return IMG.bread;
  if (['fruits', 'granola', 'porridge', 'yaourt'].some(w => n.includes(w))) return IMG.fruits;
  if (type === 'breakfast') return IMG.eggs;
  if (type === 'snack') return IMG.fruits;
  return IMG.misc;
}

const DAYS_FR = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

function generateLocalVariedPlan(startDate: Date, numDays: number): MealPlanDay[] {
  return Array.from({ length: numDays }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dayName = DAYS_FR[d.getDay() === 0 ? 6 : d.getDay() - 1];
    const toOptions = (items: PoolItem[]): MealPlanOption[] =>
      items.map(opt => ({ ...opt, price: getMealPrice(opt.name, opt.ingredients) }));
    return {
      date: d.toISOString().split('T')[0], dayName,
      slots: [
        { type: 'breakfast' as const, options: toOptions(getThreeDistinct(BREAKFAST_POOL, i)), selectedIndex: null },
        { type: 'lunch' as const,     options: toOptions(getThreeDistinct(LUNCH_POOL, i)),     selectedIndex: null },
        { type: 'snack' as const,     options: toOptions(getThreeDistinct(SNACK_POOL, i)),     selectedIndex: null },
        { type: 'dinner' as const,    options: toOptions(getThreeDistinct(DINNER_POOL, i)),    selectedIndex: null },
      ],
    };
  });
}

const DURATION_OPTIONS = [
  { label: '1 semaine', days: 7 },
  { label: '2 semaines', days: 14 },
  { label: '1 mois', days: 28 },
];

// ─── Composant principal ─────────────────────────────────────────────────────
export default function MealPlanPage() {
  const { profile, mealPlan, setMealPlan, selectMealOption, validateMealPlan, toggleGroceryItem, showToast } = useStore();
  const navigate = useNavigate();
  const [expandedDay, setExpandedDay] = useState(0);
  const [showGrocery, setShowGrocery] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [validated, setValidated] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(7);

  const generatePlan = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 800));
    const today = new Date();
    const monday = new Date(today); monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    const days = generateLocalVariedPlan(monday, selectedDuration);
    setMealPlan({
      weekStart: monday.toISOString().split('T')[0], days,
      calorieBudget: profile?.dailyCalorieBudget || 2000,
      validated: false, recipes: [], groceryList: [],
      duration: selectedDuration,
    });
    setGenerating(false);
    showToast('Plan repas généré !');
  };

  const handleValidate = () => {
    validateMealPlan();
    setValidated(true);
    showToast('Plan validé ! Liste de courses prête');
    setTimeout(() => setValidated(false), 2000);
  };

  // ─── Empty state ─────────────────────────────────────────────────────────────
  if (!mealPlan) {
    return (
      <AnimatedPage className="px-4 pt-12 pb-4 max-w-lg mx-auto">
        <h1 className="text-3xl font-black text-text-primary tracking-tight mb-2">Plan repas</h1>
        <p className="text-sm text-text-muted mb-8">Vos repas personnalisés selon vos objectifs</p>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 p-6 shadow-xl mb-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-6 -translate-x-6" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mb-4">
              <UtensilsCrossed size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Cuisines du monde entier</h3>
            <p className="text-white/70 text-sm mb-5">
              Nutreal crée un plan équilibré avec 3 options par repas, adapté à vos objectifs nutritionnels.
            </p>

            {/* Duration selector */}
            <div className="flex gap-2 mb-5">
              {DURATION_OPTIONS.map(opt => (
                <motion.button key={opt.days} whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDuration(opt.days)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${selectedDuration === opt.days ? 'bg-white text-primary-600 shadow-lg' : 'bg-white/15 text-white/80'}`}>
                  {opt.label}
                </motion.button>
              ))}
            </div>

            <motion.button whileTap={{ scale: 0.97 }} onClick={generatePlan} disabled={generating}
              className="w-full py-3.5 bg-white text-primary-600 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-60">
              {generating ? (
                <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Sparkles size={18} /></motion.div> Génération...</>
              ) : (
                <><ChefHat size={18} /> Générer mon plan</>
              )}
            </motion.button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { emoji: '🌍', title: 'Cuisine mondiale', desc: 'Japonais, italien, indien, mexicain...' },
            { emoji: '🎯', title: 'Objectifs macros', desc: 'Adapté à vos besoins caloriques' },
            { emoji: '📖', title: 'Recettes détaillées', desc: 'Instructions pas à pas' },
            { emoji: '🛒', title: 'Liste de courses', desc: 'Générée automatiquement' },
          ].map((f, i) => (
            <AnimatedCard key={i} className="p-3">
              <span className="text-2xl">{f.emoji}</span>
              <p className="text-xs font-bold text-text-primary mt-2">{f.title}</p>
              <p className="text-[10px] text-text-muted mt-0.5">{f.desc}</p>
            </AnimatedCard>
          ))}
        </div>
      </AnimatedPage>
    );
  }

  // ─── Plan exists ─────────────────────────────────────────────────────────────
  const grouped = mealPlan.groceryList.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof mealPlan.groceryList>);

  const selectedDay = mealPlan.days[expandedDay];
  const dayCalories = selectedDay?.slots.reduce((sum, slot) => {
    const sel = slot.selectedIndex !== null ? slot.options[slot.selectedIndex] : null;
    return sum + (sel?.calories || 0);
  }, 0) || 0;
  const selectedCount = selectedDay?.slots.filter(s => s.selectedIndex !== null).length || 0;

  return (
    <AnimatedPage className="pb-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="px-4 pt-12 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-text-primary tracking-tight">Plan repas</h1>
            <p className="text-sm text-text-muted">
              {mealPlan.days.length} jours · Semaine du {new Date(mealPlan.weekStart).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="flex gap-2">
            {mealPlan.validated && (
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowGrocery(!showGrocery)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${showGrocery ? 'bg-primary-500 text-white' : 'bg-white border border-surface-200 text-text-secondary'}`}>
                <ShoppingCart size={18} />
              </motion.button>
            )}
            <motion.button whileTap={{ scale: 0.95 }} onClick={generatePlan} disabled={generating}
              className="w-10 h-10 rounded-xl bg-white border border-surface-200 flex items-center justify-center text-text-secondary">
              {generating ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }}><RefreshCw size={16} /></motion.div>
              ) : <RefreshCw size={16} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Day selector - horizontal scroll */}
      <div className="px-4 mb-5">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {mealPlan.days.map((day, di) => {
            const active = expandedDay === di;
            const completedSlots = day.slots.filter(s => s.selectedIndex !== null).length;
            const isToday = day.date === new Date().toISOString().split('T')[0];
            return (
              <motion.button key={di} whileTap={{ scale: 0.95 }} onClick={() => setExpandedDay(di)}
                className={`flex-shrink-0 w-14 rounded-2xl py-2.5 flex flex-col items-center gap-1 transition-all ${active ? 'bg-text-primary text-white shadow-lg' : 'bg-white border border-surface-200 text-text-primary'}`}>
                <span className={`text-[10px] font-medium ${active ? 'text-white/60' : 'text-text-muted'}`}>
                  {DAY_SHORT[day.dayName] || day.dayName.slice(0, 3)}
                </span>
                <span className={`text-lg font-black ${active ? 'text-white' : ''}`}>
                  {new Date(day.date).getDate()}
                </span>
                {isToday && <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white' : 'bg-primary-500'}`} />}
                {!isToday && completedSlots > 0 && (
                  <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white/50' : completedSlots === 4 ? 'bg-green-500' : 'bg-amber-400'}`} />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Grocery list */}
      <AnimatePresence>
        {showGrocery && mealPlan.validated && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="px-4">
            <AnimatedCard className="p-4 mb-4">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                <ShoppingCart size={14} className="text-primary-500" /> Liste de courses
              </h3>
              {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat} className="mb-3">
                  <p className="text-xs font-semibold text-text-secondary mb-1">{cat}</p>
                  {items.map((item) => {
                    const idx = mealPlan.groceryList.indexOf(item);
                    const price = getIngredientPrice(item.name, Number(item.quantity), item.unit);
                    return (
                      <motion.div key={idx} whileTap={{ scale: 0.98 }} onClick={() => toggleGroceryItem(idx)}
                        className={`flex items-center gap-2 py-1.5 cursor-pointer ${item.checked ? 'opacity-40' : ''}`}>
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${item.checked ? 'bg-green-500 border-green-500' : 'border-surface-300'}`}>
                          {item.checked && <Check size={12} className="text-white" />}
                        </div>
                        <span className={`text-sm flex-1 ${item.checked ? 'line-through text-text-muted' : 'text-text-primary'}`}>{item.name}</span>
                        <span className="text-xs text-text-muted">{item.quantity} {item.unit}</span>
                        {price > 0 && <span className="text-xs text-primary-400 font-medium">~{price.toFixed(2)}€</span>}
                      </motion.div>
                    );
                  })}
                </div>
              ))}
              {mealPlan.groceryList.length > 0 && (
                <div className="mt-3 pt-3 border-t border-surface-200 flex justify-between">
                  <span className="text-xs text-text-muted">Budget estimé</span>
                  <span className="text-sm font-bold text-primary-500">
                    ~{mealPlan.groceryList.reduce((sum, item) => sum + getIngredientPrice(item.name, Number(item.quantity), item.unit), 0).toFixed(2)}€
                  </span>
                </div>
              )}
            </AnimatedCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Day header */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-text-primary">{selectedDay?.dayName}</h2>
            <p className="text-xs text-text-muted">
              {new Date(selectedDay?.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
              {dayCalories > 0 && ` · ${dayCalories} kcal`}
            </p>
          </div>
          {!mealPlan.validated && (
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${selectedCount === 4 ? 'bg-green-100 text-green-700' : 'bg-surface-100 text-text-muted'}`}>
              {selectedCount}/4 choisis
            </span>
          )}
        </div>
      </div>

      {/* Meal slots */}
      <div className="px-4 space-y-5">
        {selectedDay?.slots.map((slot, si) => {
          const slotInfo = SLOT_LABELS[slot.type];

          // Confirmed view: show only selected meal
          if (mealPlan.validated) {
            if (slot.selectedIndex === null) return null;
            const opt = slot.options[slot.selectedIndex];
            return (
              <div key={si}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${slotInfo.color} flex items-center justify-center text-sm`}>
                    {slotInfo.emoji}
                  </div>
                  <h3 className="text-sm font-bold text-text-primary">{slotInfo.label}</h3>
                </div>
                <motion.div whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/meal-plan/dish/${expandedDay}/${si}`)}
                  className="rounded-2xl overflow-hidden shadow-sm bg-white border border-surface-200 cursor-pointer">
                  <div className="flex items-center gap-3 p-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={opt.imageUrl} alt={opt.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">{opt.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium text-primary-500">{opt.calories} kcal</span>
                        <span className="text-[10px] text-text-muted">P:{opt.protein_g}g · G:{opt.carbs_g}g · L:{opt.fat_g}g</span>
                      </div>
                      {opt.prepTime && (
                        <span className="text-[10px] text-text-muted flex items-center gap-1 mt-0.5"><Clock size={10} /> {opt.prepTime}</span>
                      )}
                    </div>
                    <ChevronRight size={18} className="text-text-muted flex-shrink-0" />
                  </div>
                </motion.div>
              </div>
            );
          }

          // Selection view: show all options
          return (
            <div key={si}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${slotInfo.color} flex items-center justify-center text-sm`}>
                  {slotInfo.emoji}
                </div>
                <h3 className="text-sm font-bold text-text-primary">{slotInfo.label}</h3>
              </div>

              <div className="space-y-2">
                {slot.options.map((opt, oi) => {
                  const isSelected = slot.selectedIndex === oi;
                  return (
                    <motion.div key={oi} whileTap={{ scale: 0.98 }}
                      className={`relative rounded-2xl overflow-hidden transition-all ${isSelected ? 'ring-2 ring-primary-500 shadow-lg' : 'shadow-sm'}`}>
                      <button onClick={() => selectMealOption(expandedDay, si, oi)} className="w-full text-left">
                        <div className="flex items-center gap-3 bg-white p-3">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                            <img src={opt.imageUrl} alt={opt.name} className="w-full h-full object-cover" />
                            {isSelected && (
                              <div className="absolute inset-0 bg-primary-500/60 flex items-center justify-center">
                                <Check size={20} className="text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text-primary truncate">{opt.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-medium text-primary-500">{opt.calories} kcal</span>
                              <span className="text-[10px] text-text-muted">P:{opt.protein_g}g · G:{opt.carbs_g}g · L:{opt.fat_g}g</span>
                            </div>
                            <div className="flex items-center gap-3 mt-0.5">
                              {opt.prepTime && (
                                <span className="text-[10px] text-text-muted flex items-center gap-1"><Clock size={10} /> {opt.prepTime}</span>
                              )}
                              {(opt as any).price !== undefined && (
                                <span className="text-[10px] text-text-muted">~{((opt as any).price as number).toFixed(2)}€</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Validate button */}
      {!mealPlan.validated && (
        <div className="px-4 mt-6">
          <motion.button whileTap={{ scale: 0.97 }} onClick={handleValidate}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xl">
            <Check size={18} /> Valider & générer les courses
          </motion.button>
        </div>
      )}

      {/* Validation success overlay */}
      <AnimatePresence>
        {validated && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-8 text-center mx-4">
              <SuccessCheckmark size={64} />
              <p className="text-lg font-semibold text-text-primary mt-4">Plan validé !</p>
              <p className="text-sm text-text-secondary mt-1">Votre liste de courses est prête</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}
