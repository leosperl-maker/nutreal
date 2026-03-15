import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { MealPlanDay, MealPlanOption } from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedCard from '../components/AnimatedCard';
import SuccessCheckmark from '../components/SuccessCheckmark';
import Icon3D from '../components/Icon3D';
import { ChefHat, ShoppingCart, Check, Sparkles, RefreshCw, UtensilsCrossed, Clock, ChevronRight, Filter, X as XIcon, Flame, ChevronLeft } from 'lucide-react';
import { HEALTHY_FAST_FOOD } from '../data/healthyFastFood';

const SLOT_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  breakfast: { label: 'Petit-déj', emoji: 'sunrise', color: 'from-amber-400 to-orange-500' },
  lunch: { label: 'Déjeuner', emoji: 'sun', color: 'from-primary-400 to-primary-600' },
  snack: { label: 'Collation', emoji: 'redApple', color: 'from-green-400 to-emerald-500' },
  dinner: { label: 'Dîner', emoji: 'crescentMoon', color: 'from-primary-700 to-primary-900' },
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

type PoolItem = Omit<MealPlanOption, 'recipe'> & { tags?: string[] };

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
  { name: 'Tartines ricotta miel figues', ingredients: ['pain complet', 'ricotta', 'miel', 'figues fraîches', 'pistaches'], calories: 340, protein_g: 12, fat_g: 10, carbs_g: 52, fiber_g: 4, imageUrl: IMG.bread, prepTime: '5 min', benefitsNote: 'Les figues sont riches en calcium et fibres, la ricotta apporte des protéines légères.', tags: ['vegetarian', 'halal'] },
  { name: 'Muesli maison noix', ingredients: ['flocons d\'avoine', 'amandes', 'noix', 'raisins secs', 'graines de tournesol', 'lait'], calories: 390, protein_g: 11, fat_g: 14, carbs_g: 56, fiber_g: 6, imageUrl: IMG.grains, prepTime: '5 min', benefitsNote: 'Mélange de céréales non transformées, riches en fibres et acides gras essentiels.', tags: ['vegetarian', 'halal'] },
  { name: 'Œufs brouillés avocat toast', ingredients: ['œufs', 'avocat', 'ciboulette', 'huile d\'olive', 'pain complet'], calories: 380, protein_g: 20, fat_g: 22, carbs_g: 24, fiber_g: 5, imageUrl: IMG.eggs, prepTime: '10 min', benefitsNote: 'Les œufs apportent tous les acides aminés essentiels, l\'avocat les bons lipides.', tags: ['vegetarian', 'halal', 'high-protein'] },
  { name: 'Bagel saumon cream cheese', ingredients: ['bagel complet', 'saumon fumé', 'cream cheese allégé', 'câpres', 'tomate', 'aneth'], calories: 430, protein_g: 24, fat_g: 16, carbs_g: 48, fiber_g: 3, imageUrl: IMG.fish, prepTime: '5 min', benefitsNote: 'Riche en oméga-3 DHA et EPA, idéal pour la concentration et la mémoire.', tags: ['halal'] },
  { name: 'Gaufres protéinées myrtilles', ingredients: ['farine d\'avoine', 'œufs', 'protéine vanille', 'banane', 'myrtilles'], calories: 360, protein_g: 25, fat_g: 8, carbs_g: 48, fiber_g: 6, imageUrl: IMG.bread, prepTime: '15 min', benefitsNote: 'Gaufres riches en protéines complètes, idéales post-entraînement.', tags: ['vegetarian', 'halal', 'high-protein'] },
  { name: 'Chia pudding mangue coco', ingredients: ['chia', 'lait de coco', 'mangue', 'granola', 'citron vert'], calories: 330, protein_g: 9, fat_g: 12, carbs_g: 48, fiber_g: 10, imageUrl: IMG.smoothie, prepTime: '5 min', benefitsNote: 'Préparé la veille, les graines de chia gonflées sont ultra-digestibles et riches en fibres.', tags: ['vegetarian', 'vegan', 'gluten-free', 'halal'] },
  { name: 'Toast beurre cacahuète banane', ingredients: ['pain complet', 'beurre de cacahuète', 'banane', 'miel', 'graines de chanvre'], calories: 420, protein_g: 14, fat_g: 16, carbs_g: 58, fiber_g: 5, imageUrl: IMG.bread, prepTime: '3 min', benefitsNote: 'Le beurre de cacahuète apporte magnésium et vitamine E, parfait avant l\'effort.', tags: ['vegetarian', 'halal'] },
  { name: 'Congee riz gingembre œuf', ingredients: ['riz', 'bouillon de légumes', 'gingembre frais', 'sésame', 'ciboulette', 'œuf poché'], calories: 280, protein_g: 10, fat_g: 6, carbs_g: 48, fiber_g: 2, imageUrl: IMG.grains, prepTime: '20 min', benefitsNote: 'Bouillie de riz asiatique très digeste, le gingembre soulage les nausées et favorise la digestion.', tags: ['vegetarian', 'gluten-free', 'halal'] },
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
  { name: 'Falafel wrap houmous', ingredients: ['falafel', 'pain pita', 'houmous', 'salade', 'tomate', 'oignon', 'tahini'], calories: 470, protein_g: 16, fat_g: 18, carbs_g: 62, fiber_g: 10, imageUrl: IMG.bowl, prepTime: '15 min', benefitsNote: 'Protéines végétales des pois chiches, le houmous est riche en acides aminés.', tags: ['vegetarian', 'vegan', 'halal'] },
  { name: 'Ceviche crevettes avocat', ingredients: ['crevettes', 'citron vert', 'oignon rouge', 'coriandre', 'piment', 'avocat'], calories: 280, protein_g: 26, fat_g: 10, carbs_g: 12, fiber_g: 4, imageUrl: IMG.fish, prepTime: '20 min', benefitsNote: 'Très pauvre en calories, riche en protéines maigres. Le citron cuit les crevettes.', tags: ['halal', 'gluten-free', 'high-protein'] },
  { name: 'Souvlaki pita grec', ingredients: ['poulet', 'pain pita', 'tzatziki', 'tomate', 'concombre', 'oignon'], calories: 460, protein_g: 32, fat_g: 14, carbs_g: 52, fiber_g: 3, imageUrl: IMG.chicken, prepTime: '20 min', benefitsNote: 'Poulet mariné aux herbes méditerranéennes, le tzatziki apporte probiotiques et fraîcheur.', tags: ['halal', 'high-protein'] },
  { name: 'Chirashi saumon thon', ingredients: ['riz sushi', 'saumon', 'thon', 'avocat', 'edamame', 'sauce soja', 'sésame'], calories: 520, protein_g: 34, fat_g: 18, carbs_g: 55, fiber_g: 5, imageUrl: IMG.fish, prepTime: '15 min', benefitsNote: 'Double apport en oméga-3 avec le saumon et le thon, excellent pour la santé cardiovasculaire.', tags: ['halal', 'gluten-free', 'high-protein'] },
  { name: 'Salade César poulet grillé', ingredients: ['romaine', 'poulet grillé', 'croûtons', 'parmesan', 'sauce César allégée'], calories: 430, protein_g: 35, fat_g: 18, carbs_g: 28, fiber_g: 5, imageUrl: IMG.salad, prepTime: '15 min', benefitsNote: 'Classique équilibré, la romaine est riche en vitamine K et folates.', tags: ['halal', 'high-protein'] },
  { name: 'Burrito bowl quinoa', ingredients: ['quinoa', 'haricots noirs', 'poulet', 'avocat', 'maïs', 'salsa', 'fromage'], calories: 540, protein_g: 34, fat_g: 16, carbs_g: 62, fiber_g: 12, imageUrl: IMG.bowl, prepTime: '20 min', benefitsNote: 'Quinoa = protéine végétale complète, association parfaite avec les haricots noirs.', tags: ['halal', 'gluten-free', 'high-protein'] },
  { name: 'Tom kha gaï crevettes', ingredients: ['crevettes', 'lait de coco', 'citronnelle', 'galanga', 'champignons', 'riz jasmin'], calories: 430, protein_g: 26, fat_g: 18, carbs_g: 42, fiber_g: 3, imageUrl: IMG.curry, prepTime: '25 min', benefitsNote: 'Soupe thaïe réconfortante, la citronnelle et le galanga ont des propriétés anti-inflammatoires.', tags: ['halal', 'gluten-free'] },
  { name: 'Quiche légumes chèvre', ingredients: ['pâte brisée', 'œufs', 'fromage de chèvre', 'courgette', 'poivron', 'crème légère'], calories: 460, protein_g: 18, fat_g: 26, carbs_g: 38, fiber_g: 3, imageUrl: IMG.eggs, prepTime: '35 min', benefitsNote: 'Version végétarienne de la quiche, les légumes apportent vitamines et fibres.', tags: ['vegetarian', 'halal'] },
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
  { name: 'Barre protéinée maison', ingredients: ['flocons d\'avoine', 'beurre de cacahuète', 'protéine vanille', 'miel', 'chocolat noir 70%'], calories: 220, protein_g: 15, fat_g: 9, carbs_g: 24, fiber_g: 3, imageUrl: IMG.misc, prepTime: '15 min', benefitsNote: 'Sans additifs ni conservateurs, contrôle total des ingrédients vs barres industrielles.', tags: ['vegetarian', 'halal', 'high-protein'] },
  { name: 'Popcorn épices naturel', ingredients: ['maïs à popcorn', 'huile de coco', 'paprika', 'sel'], calories: 110, protein_g: 3, fat_g: 4, carbs_g: 18, fiber_g: 3, imageUrl: IMG.misc, prepTime: '5 min', benefitsNote: 'Collation légère et pauvre en calories, les fibres des grains de maïs rassasient.', tags: ['vegetarian', 'vegan', 'gluten-free', 'halal'] },
  { name: 'Bruschettas tomate basilic', ingredients: ['pain grillé', 'tomates', 'basilic', 'ail', 'huile d\'olive'], calories: 190, protein_g: 5, fat_g: 8, carbs_g: 24, fiber_g: 3, imageUrl: IMG.bread, prepTime: '8 min', benefitsNote: 'Le lycopène des tomates est libéré par la chaleur, excellent antioxydant.', tags: ['vegetarian', 'vegan', 'halal'] },
  { name: 'Dattes fourrées amandes', ingredients: ['dattes Medjool', 'amandes', 'beurre de cacahuète'], calories: 160, protein_g: 4, fat_g: 6, carbs_g: 26, fiber_g: 3, imageUrl: IMG.misc, prepTime: '5 min', benefitsNote: 'Les dattes Medjool sont riches en potassium et magnésium naturels.', tags: ['vegetarian', 'vegan', 'gluten-free', 'halal'] },
  { name: 'Muffin banane avoine', ingredients: ['banane', 'flocons d\'avoine', 'œuf', 'miel', 'cannelle', 'noix'], calories: 200, protein_g: 6, fat_g: 6, carbs_g: 32, fiber_g: 3, imageUrl: IMG.misc, prepTime: '25 min', benefitsNote: 'Sucré naturellement par la banane, pauvre en sucres raffinés, riche en fibres.', tags: ['vegetarian', 'halal'] },
  { name: 'Granola bar maison', ingredients: ['flocons d\'avoine', 'miel', 'amandes', 'graines de tournesol', 'canneberges'], calories: 210, protein_g: 5, fat_g: 8, carbs_g: 30, fiber_g: 4, imageUrl: IMG.grains, prepTime: '20 min', benefitsNote: 'Énergie soutenue grâce aux glucides complexes et aux graisses des noix.', tags: ['vegetarian', 'vegan', 'halal'] },
  { name: 'Smoothie vert kale pomme', ingredients: ['kale', 'pomme', 'gingembre', 'citron', 'eau de coco'], calories: 130, protein_g: 3, fat_g: 1, carbs_g: 28, fiber_g: 4, imageUrl: IMG.smoothie, prepTime: '5 min', benefitsNote: 'Le kale est l\'un des aliments les plus denses en nutriments : fer, calcium, vitamines K, C, A.', tags: ['vegetarian', 'vegan', 'gluten-free', 'halal'] },
  { name: 'Tartare algues avocat', ingredients: ['algues nori', 'avocat', 'concombre', 'sauce tamari', 'sésame', 'citron vert'], calories: 150, protein_g: 4, fat_g: 9, carbs_g: 12, fiber_g: 5, imageUrl: IMG.misc, prepTime: '10 min', benefitsNote: 'Les algues sont la source végétale la plus riche en iode et minéraux marins.', tags: ['vegetarian', 'vegan', 'gluten-free', 'halal'] },
  { name: 'Olives feta menthe', ingredients: ['olives Kalamata', 'feta', 'menthe fraîche', 'huile d\'olive', 'citron'], calories: 170, protein_g: 5, fat_g: 14, carbs_g: 6, fiber_g: 2, imageUrl: IMG.misc, prepTime: '3 min', benefitsNote: 'Les olives sont riches en polyphénols et vitamine E, la feta en calcium.', tags: ['vegetarian', 'gluten-free', 'halal'] },
  { name: 'Crackers houmous légumes', ingredients: ['crackers de riz', 'houmous', 'carottes', 'céleri', 'radis'], calories: 180, protein_g: 6, fat_g: 7, carbs_g: 24, fiber_g: 5, imageUrl: IMG.salad, prepTime: '5 min', benefitsNote: 'Snack équilibré glucides/protéines/fibres, le houmous est riche en acides aminés essentiels.', tags: ['vegetarian', 'vegan', 'gluten-free', 'halal'] },
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
  { name: 'Ratatouille provençale', ingredients: ['aubergine', 'courgette', 'poivron', 'tomate', 'oignon', 'herbes de Provence', 'huile d\'olive'], calories: 220, protein_g: 6, fat_g: 10, carbs_g: 28, fiber_g: 8, imageUrl: IMG.salad, prepTime: '45 min', benefitsNote: 'Plat de légumes du Midi, riche en fibres et pauvre en calories, excellent pour la digestion.', tags: ['vegetarian', 'vegan', 'gluten-free', 'halal'] },
  { name: 'Teriyaki saumon brocoli', ingredients: ['saumon', 'sauce teriyaki', 'brocoli', 'riz blanc', 'sésame', 'gingembre'], calories: 510, protein_g: 38, fat_g: 16, carbs_g: 48, fiber_g: 5, imageUrl: IMG.fish, prepTime: '20 min', benefitsNote: 'Le saumon laqué teriyaki est ultra-savoureux tout en restant riche en oméga-3.', tags: ['halal', 'gluten-free', 'high-protein'] },
  { name: 'Moussaka végétarienne', ingredients: ['aubergine', 'lentilles', 'tomates pelées', 'oignon', 'cannelle', 'béchamel légère'], calories: 420, protein_g: 18, fat_g: 16, carbs_g: 48, fiber_g: 10, imageUrl: IMG.curry, prepTime: '50 min', benefitsNote: 'Version végétarienne de la moussaka, les lentilles remplacent la viande tout en apportant des protéines.', tags: ['vegetarian', 'halal'] },
  { name: 'Enchiladas poulet haricots', ingredients: ['tortillas', 'poulet', 'haricots rouges', 'sauce enchilada', 'fromage râpé', 'crème légère'], calories: 550, protein_g: 34, fat_g: 18, carbs_g: 62, fiber_g: 8, imageUrl: IMG.chicken, prepTime: '35 min', benefitsNote: 'Les haricots rouges doublent l\'apport en fibres et protéines végétales.', tags: ['halal', 'high-protein'] },
  { name: 'Bouillabaisse simplifiée', ingredients: ['poisson blanc', 'crevettes', 'moules', 'tomate', 'safran', 'fenouil', 'pain grillé'], calories: 380, protein_g: 34, fat_g: 12, carbs_g: 28, fiber_g: 4, imageUrl: IMG.fish, prepTime: '40 min', benefitsNote: 'Soupe de poisson marseillaise riche en protéines et minéraux marins, légère en calories.', tags: ['halal', 'gluten-free', 'high-protein'] },
  { name: 'Dahl de lentilles corail', ingredients: ['lentilles corail', 'lait de coco', 'curcuma', 'cumin', 'gingembre', 'épinards', 'riz basmati'], calories: 440, protein_g: 20, fat_g: 12, carbs_g: 62, fiber_g: 12, imageUrl: IMG.curry, prepTime: '25 min', benefitsNote: 'Plat indien végétarien riche en fer, le curcuma est un puissant anti-inflammatoire naturel.', tags: ['vegetarian', 'vegan', 'gluten-free', 'halal'] },
  { name: 'Poulet basquaise', ingredients: ['poulet', 'poivrons', 'tomates', 'oignon', 'ail', 'piment d\'Espelette', 'riz'], calories: 490, protein_g: 38, fat_g: 16, carbs_g: 44, fiber_g: 6, imageUrl: IMG.chicken, prepTime: '40 min', benefitsNote: 'Poulet mijoté aux légumes du pays Basque, riche en vitamine C grâce aux poivrons.', tags: ['halal', 'gluten-free', 'high-protein'] },
  { name: 'Soupe minestrone', ingredients: ['haricots blancs', 'courgette', 'carotte', 'céleri', 'tomate', 'pâtes complètes', 'parmesan'], calories: 360, protein_g: 14, fat_g: 8, carbs_g: 56, fiber_g: 10, imageUrl: IMG.salad, prepTime: '30 min', benefitsNote: 'Soupe italienne complète riche en fibres et légumes, réconfortante et nourrissante.', tags: ['vegetarian', 'halal'] },
];

// ─── Filter matching ─────────────────────────────────────────────────────────
function matchesFilters(item: PoolItem, filters: string[]): boolean {
  if (filters.length === 0) return true;
  return filters.every(f => {
    if (f === 'high-protein') return item.protein_g >= 20;
    if (!item.tags) return false; // untagged items excluded when filters active
    return item.tags.includes(f);
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Tire 3 items distincts du pool, en evitant les repetitions avec les jours precedents */
function getThreeDistinct<T extends { name: string }>(pool: T[], dayIndex: number, usedNames: Set<string>): T[] {
  // Prioritize items not used in previous days
  const fresh = pool.filter(p => !usedNames.has(p.name));
  const source = fresh.length >= 3 ? fresh : pool;
  const s = shuffle(source);
  const picked: T[] = [];
  const pickedNames = new Set<string>();
  for (const item of s) {
    if (picked.length >= 3) break;
    if (!pickedNames.has(item.name)) {
      picked.push(item);
      pickedNames.add(item.name);
    }
  }
  // Fallback if pool too small
  while (picked.length < 3 && picked.length < pool.length) {
    const item = pool[picked.length % pool.length];
    if (!pickedNames.has(item.name)) {
      picked.push(item);
      pickedNames.add(item.name);
    } else {
      picked.push(pool[(dayIndex * 3 + picked.length) % pool.length]);
      break;
    }
  }
  return picked;
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

function generateLocalVariedPlan(startDate: Date, numDays: number, filters: string[] = []): MealPlanDay[] {
  const applyFilter = (pool: PoolItem[]) => {
    const filtered = pool.filter(i => matchesFilters(i, filters));
    return filtered.length >= 3 ? filtered : pool; // fallback to full pool if too few
  };
  const bkPool = applyFilter(BREAKFAST_POOL);
  const luPool = applyFilter(LUNCH_POOL);
  const snPool = applyFilter(SNACK_POOL);
  const diPool = applyFilter(DINNER_POOL);

  // Track used dishes per slot type to maximize diversity across days
  const usedBreakfast = new Set<string>();
  const usedLunch = new Set<string>();
  const usedSnack = new Set<string>();
  const usedDinner = new Set<string>();

  return Array.from({ length: numDays }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dayName = DAYS_FR[d.getDay() === 0 ? 6 : d.getDay() - 1];
    const toOptions = (items: PoolItem[]): MealPlanOption[] =>
      items.map(opt => ({ ...opt, price: getMealPrice(opt.name, opt.ingredients) }));

    const bk = getThreeDistinct(bkPool, i, usedBreakfast);
    bk.forEach(b => usedBreakfast.add(b.name));
    const lu = getThreeDistinct(luPool, i, usedLunch);
    lu.forEach(l => usedLunch.add(l.name));
    const sn = getThreeDistinct(snPool, i, usedSnack);
    sn.forEach(s => usedSnack.add(s.name));
    const di = getThreeDistinct(diPool, i, usedDinner);
    di.forEach(d => usedDinner.add(d.name));

    // Reset tracking when pool is exhausted (for longer plans)
    if (usedBreakfast.size >= bkPool.length - 2) usedBreakfast.clear();
    if (usedLunch.size >= luPool.length - 2) usedLunch.clear();
    if (usedSnack.size >= snPool.length - 2) usedSnack.clear();
    if (usedDinner.size >= diPool.length - 2) usedDinner.clear();

    return {
      date: d.toISOString().split('T')[0], dayName,
      slots: [
        { type: 'breakfast' as const, options: toOptions(bk), selectedIndex: null },
        { type: 'lunch' as const,     options: toOptions(lu), selectedIndex: null },
        { type: 'snack' as const,     options: toOptions(sn), selectedIndex: null },
        { type: 'dinner' as const,    options: toOptions(di), selectedIndex: null },
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
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [fastFoodIdx, setFastFoodIdx] = useState(0);

  const DIETARY_FILTERS = [
    { id: 'vegetarian', label: 'Végétarien' },
    { id: 'vegan', label: 'Végan' },
    { id: 'gluten-free', label: 'Sans gluten' },
    { id: 'halal', label: 'Halal' },
    { id: 'high-protein', label: 'Protéiné' },
  ];
  const toggleFilter = (id: string) =>
    setActiveFilters(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  const generatePlan = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 800));
    const today = new Date();
    const monday = new Date(today); monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    const days = generateLocalVariedPlan(monday, selectedDuration, activeFilters);
    setMealPlan({
      weekStart: monday.toISOString().split('T')[0], days,
      calorieBudget: profile?.dailyCalorieTarget || 2000,
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
        <h1 className="font-display text-3xl font-black text-text-primary tracking-tight mb-2">Plan repas</h1>
        <p className="text-sm text-text-muted mb-8">Vos repas personnalisés selon vos objectifs</p>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 p-6 shadow-float mb-6">
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
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${selectedDuration === opt.days ? 'bg-white text-primary-600 shadow-float' : 'bg-white/15 text-white/80'}`}>
                  {opt.label}
                </motion.button>
              ))}
            </div>

            {/* Dietary filters */}
            <div className="mb-4">
              <p className="text-white/60 text-xs font-medium mb-2 flex items-center gap-1.5"><Filter size={11} /> Filtres alimentaires</p>
              <div className="flex flex-wrap gap-1.5">
                {DIETARY_FILTERS.map(f => (
                  <motion.button key={f.id} whileTap={{ scale: 0.93 }} onClick={() => toggleFilter(f.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${activeFilters.includes(f.id) ? 'bg-white text-primary-600' : 'bg-white/20 text-white/80'}`}>
                    {activeFilters.includes(f.id) && <XIcon size={10} />}{f.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.button whileTap={{ scale: 0.97 }} onClick={generatePlan} disabled={generating}
              className="w-full py-3.5 bg-white text-primary-600 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-float disabled:opacity-60">
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
            { emoji: 'forkAndKnife', title: 'Cuisine mondiale', desc: 'Japonais, italien, indien, mexicain...' },
            { emoji: 'bullseye', title: 'Objectifs macros', desc: 'Adapté à vos besoins caloriques' },
            { emoji: 'openBook', title: 'Recettes détaillées', desc: 'Instructions pas à pas' },
            { emoji: 'shoppingCart', title: 'Liste de courses', desc: 'Générée automatiquement' },
          ].map((f, i) => (
            <AnimatedCard key={i} className="p-3">
              <Icon3D name={f.emoji} size={28} />
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
            <h1 className="font-display text-3xl font-black text-text-primary tracking-tight">Plan repas</h1>
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

      {/* Dietary filters - compact row */}
      <div className="px-4 mb-3 flex gap-1.5 overflow-x-auto scrollbar-hide">
        {DIETARY_FILTERS.map(f => (
          <motion.button key={f.id} whileTap={{ scale: 0.93 }} onClick={() => toggleFilter(f.id)}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all ${activeFilters.includes(f.id) ? 'bg-primary-500 text-white' : 'bg-surface-100 text-text-muted border border-surface-200'}`}>
            {f.label}
          </motion.button>
        ))}
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
                className={`flex-shrink-0 w-14 rounded-2xl py-2.5 flex flex-col items-center gap-1 transition-all ${active ? 'bg-text-primary text-white shadow-float' : 'bg-white border border-surface-200 text-text-primary'}`}>
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
            <h2 className="font-display text-lg font-black text-text-primary">{selectedDay?.dayName}</h2>
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
                    <Icon3D name={slotInfo.emoji} size={18} />
                  </div>
                  <h3 className="text-sm font-bold text-text-primary">{slotInfo.label}</h3>
                </div>
                <motion.div whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/meal-plan/dish/${expandedDay}/${si}`)}
                  className="rounded-2xl overflow-hidden shadow-card bg-white border border-surface-200 cursor-pointer">
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
                  <Icon3D name={slotInfo.emoji} size={18} />
                </div>
                <h3 className="text-sm font-bold text-text-primary">{slotInfo.label}</h3>
              </div>

              <div className="space-y-2">
                {slot.options.map((opt, oi) => {
                  const isSelected = slot.selectedIndex === oi;
                  return (
                    <motion.div key={oi} whileTap={{ scale: 0.98 }}
                      className={`relative rounded-2xl overflow-hidden transition-all ${isSelected ? 'ring-2 ring-primary-500 shadow-float' : 'shadow-card'}`}>
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

      {/* Fast Food Réinventé */}
      {(() => {
        const recipe = HEALTHY_FAST_FOOD[fastFoodIdx];
        return (
          <div className="px-4 mt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Flame size={14} className="text-orange-500" />
                <p className="text-xs font-bold text-text-primary uppercase tracking-wide">Fast food réinventé</p>
              </div>
              <div className="flex items-center gap-1">
                <motion.button whileTap={{ scale: 0.9 }}
                  onClick={() => setFastFoodIdx((fastFoodIdx - 1 + HEALTHY_FAST_FOOD.length) % HEALTHY_FAST_FOOD.length)}
                  className="w-6 h-6 rounded-full bg-surface-100 flex items-center justify-center">
                  <ChevronLeft size={12} className="text-text-muted" />
                </motion.button>
                <span className="text-[10px] text-text-muted">{fastFoodIdx + 1}/{HEALTHY_FAST_FOOD.length}</span>
                <motion.button whileTap={{ scale: 0.9 }}
                  onClick={() => setFastFoodIdx((fastFoodIdx + 1) % HEALTHY_FAST_FOOD.length)}
                  className="w-6 h-6 rounded-full bg-surface-100 flex items-center justify-center">
                  <ChevronRight size={12} className="text-text-muted" />
                </motion.button>
              </div>
            </div>
            <AnimatedCard className="overflow-hidden">
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl">
                    <Icon3D name={recipe.emoji} size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-text-primary">{recipe.name}</p>
                    <p className="text-[10px] text-text-muted mb-1">Inspiré de : {recipe.originalInspiration}</p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">{recipe.calories} kcal</span>
                      <span className="text-[10px] text-text-muted bg-surface-100 px-2 py-0.5 rounded-full">P {recipe.protein_g}g</span>
                      <span className="text-[10px] text-text-muted bg-surface-100 px-2 py-0.5 rounded-full">⏱ {recipe.prepTime} min</span>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-text-muted mt-2 leading-relaxed">{recipe.tips}</p>
              </div>
            </AnimatedCard>
          </div>
        );
      })()}

      {/* Validate button */}
      {!mealPlan.validated && (
        <div className="px-4 mt-6">
          <motion.button whileTap={{ scale: 0.97 }} onClick={handleValidate}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-float">
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
