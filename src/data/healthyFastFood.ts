export interface HealthyRecipe {
  name: string;
  originalInspiration: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  prepTime: number; // minutes
  ingredients: string[];
  steps: string[];
  tips: string;
  emoji: string;
}

export const HEALTHY_FAST_FOOD: HealthyRecipe[] = [
  {
    name: 'Smash Burger Healthy',
    originalInspiration: 'Burger classique',
    calories: 380, protein_g: 35, carbs_g: 28, fat_g: 14, fiber_g: 4, prepTime: 15,
    ingredients: ['150g dinde hachée 5% MG', '1 pain complet burger', 'Laitue, tomate, oignon rouge', '1 tranche cheddar allégé', 'Sauce : yaourt grec + moutarde + cornichons hachés'],
    steps: ['Former un steak fin, saler, poivrer', 'Cuire à la poêle antiadhésive 2min/face (bien écraser = smash)', 'Toaster le pain complet', 'Assembler : sauce, laitue, steak, fromage, tomate, oignon'],
    tips: '380 kcal vs 550+ pour un burger fast food. Le secret : dinde + pain complet + sauce yaourt.',
    emoji: 'hamburger',
  },
  {
    name: 'Pizza Chou-Fleur Margherita',
    originalInspiration: 'Pizza',
    calories: 320, protein_g: 22, carbs_g: 18, fat_g: 16, fiber_g: 5, prepTime: 30,
    ingredients: ['300g chou-fleur râpé', '1 œuf', '30g parmesan râpé', '50g mozzarella light', 'Sauce tomate maison, basilic frais', 'Origan, ail en poudre'],
    steps: ['Mixer chou-fleur, micro-ondes 5min, essorer dans un torchon', 'Mélanger avec œuf + parmesan, étaler en cercle sur plaque', 'Cuire 15min à 200°C', 'Ajouter sauce, mozzarella, cuire 10min', 'Basilic frais au service'],
    tips: '320 kcal vs 800+ pour 2 parts de pizza. Base chou-fleur = riche en fibres, pauvre en glucides.',
    emoji: 'pizza',
  },
  {
    name: 'Wings Croustillantes au Four',
    originalInspiration: 'Wings frites',
    calories: 280, protein_g: 32, carbs_g: 8, fat_g: 12, fiber_g: 1, prepTime: 35,
    ingredients: ['500g ailes de poulet', '2 cs yaourt grec', 'Paprika fumé, ail, cayenne', '30g chapelure panko complète', 'Sauce : sriracha + miel (1cs chaque) + citron vert'],
    steps: ['Mariner ailes dans yaourt + épices 30min', 'Rouler dans panko', 'Cuire au four 200°C, 25min, retourner à mi-cuisson', 'Badigeonner de sauce sriracha-miel en sortie de four'],
    tips: '280 kcal vs 450+ pour des wings frites. Cuisson four + marinade yaourt = croustillant sans friture.',
    emoji: 'poultryLeg',
  },
  {
    name: 'Bowl Tacos Healthy',
    originalInspiration: 'Tacos/Burrito',
    calories: 410, protein_g: 30, carbs_g: 42, fat_g: 12, fiber_g: 9, prepTime: 20,
    ingredients: ['150g poulet émincé', '80g riz complet cuit', 'Haricots noirs (80g)', 'Maïs, poivrons grillés, oignon', 'Avocat (1/4), salsa fraîche, coriandre', 'Jus de citron vert'],
    steps: ['Assaisonner poulet : cumin, paprika, ail, piment', 'Griller poulet à la poêle', 'Assembler le bowl : riz, haricots, maïs, poivrons', 'Topper avec poulet, avocat, salsa, coriandre'],
    tips: '410 kcal vs 700+ pour un burrito. Pas de tortilla = moins de glucides, plus de légumes.',
    emoji: 'burrito',
  },
  {
    name: 'Wrap Kebab Light',
    originalInspiration: 'Kebab/Döner',
    calories: 360, protein_g: 28, carbs_g: 35, fat_g: 11, fiber_g: 4, prepTime: 15,
    ingredients: ['120g escalope de dinde marinée (cumin, paprika, yaourt)', '1 tortilla complète', 'Chou rouge râpé, tomate, oignon', 'Sauce blanche light : yaourt grec + ail + menthe + citron', 'Quelques feuilles de menthe fraîche'],
    steps: ['Griller dinde marinée à la poêle', 'Chauffer tortilla 30sec', 'Assembler : sauce, crudités, viande, menthe', 'Rouler serré'],
    tips: '360 kcal vs 700+ pour un kebab classique. Dinde + sauce yaourt = protéines sans les graisses.',
    emoji: 'stuffedFlatbread',
  },
];
