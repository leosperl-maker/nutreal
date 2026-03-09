// ============================================
// LOCAL INGREDIENTS DATABASE — ALL FRENCH TERRITORIES
// ============================================

export type Region =
  | 'guadeloupe' | 'martinique' | 'la_desirade' | 'marie_galante' | 'les_saintes'
  | 'saint_martin' | 'saint_barthelemy'
  | 'guyane' | 'reunion' | 'mayotte'
  | 'saint_pierre_miquelon' | 'polynesie' | 'nouvelle_caledonie' | 'wallis_futuna'
  | 'france' | 'usa' | 'other';

// Region groups for price/availability mapping
type PriceRegion = 'antilles' | 'guyane' | 'reunion' | 'mayotte' | 'spm' | 'polynesie' | 'nouvelle_caledonie' | 'wallis_futuna' | 'france' | 'usa' | 'other';

function toPriceRegion(r: Region): PriceRegion {
  switch (r) {
    case 'guadeloupe': case 'martinique': case 'la_desirade': case 'marie_galante':
    case 'les_saintes': case 'saint_martin': case 'saint_barthelemy':
      return 'antilles';
    case 'guyane': return 'guyane';
    case 'reunion': return 'reunion';
    case 'mayotte': return 'mayotte';
    case 'saint_pierre_miquelon': return 'spm';
    case 'polynesie': return 'polynesie';
    case 'nouvelle_caledonie': return 'nouvelle_caledonie';
    case 'wallis_futuna': return 'wallis_futuna';
    case 'france': return 'france';
    case 'usa': return 'usa';
    default: return 'other';
  }
}

export type IngredientCategory =
  | 'Viandes & Poissons'
  | 'Fruits & Légumes'
  | 'Produits laitiers'
  | 'Féculents & Céréales'
  | 'Épicerie'
  | 'Fruits secs & Graines'
  | 'Boissons'
  | 'Autres';

export interface IngredientPrice {
  name: string;
  category: IngredientCategory;
  unit: string;
  quantity: number;
  prices: Record<PriceRegion, number>;
  availability: Record<PriceRegion, 'common' | 'available' | 'rare' | 'unavailable'>;
  alternatives?: string[];
  tags: string[];
}

export interface StoreRecommendation {
  name: string;
  type: 'supermarket' | 'market' | 'discount' | 'specialty';
  priceLevel: 1 | 2 | 3;
  description: string;
  bestFor: string[];
}

// ============================================
// STORES PAR TERRITOIRE — NO GiFi ANYWHERE
// ============================================

export const STORES_BY_REGION: Record<Region, StoreRecommendation[]> = {
  guadeloupe: [
    { name: 'Marché local (Pointe-à-Pitre, Sainte-Anne...)', type: 'market', priceLevel: 1, description: 'Fruits, légumes et poissons frais à prix imbattables', bestFor: ['fruits', 'légumes', 'poisson', 'épices'] },
    { name: 'Leader Price', type: 'discount', priceLevel: 1, description: 'Produits de base à petit prix', bestFor: ['féculents', 'conserves', 'produits laitiers'] },
    { name: 'Super U', type: 'supermarket', priceLevel: 2, description: 'Large choix, bon rapport qualité-prix', bestFor: ['viandes', 'produits frais', 'épicerie'] },
    { name: 'Carrefour', type: 'supermarket', priceLevel: 2, description: 'Grand choix de produits', bestFor: ['tout', 'marques', 'bio'] },
    { name: 'Tierriet', type: 'supermarket', priceLevel: 2, description: 'Supermarché local de confiance', bestFor: ['produits locaux', 'épicerie'] },
    { name: 'Pêcheurs locaux', type: 'market', priceLevel: 1, description: 'Poisson frais du jour', bestFor: ['poisson', 'fruits de mer', 'lambis'] },
  ],
  martinique: [
    { name: 'Marché couvert (Fort-de-France)', type: 'market', priceLevel: 1, description: 'Produits locaux frais et épices créoles', bestFor: ['fruits', 'légumes', 'épices', 'poisson'] },
    { name: 'Leader Price', type: 'discount', priceLevel: 1, description: 'Discount pour les produits de base', bestFor: ['féculents', 'conserves', 'boissons'] },
    { name: 'Super U / Hyper U', type: 'supermarket', priceLevel: 2, description: 'Supermarché complet', bestFor: ['viandes', 'produits frais', 'épicerie'] },
    { name: 'Carrefour Market', type: 'supermarket', priceLevel: 2, description: 'Proximité et choix', bestFor: ['tout', 'bio'] },
    { name: 'Tierriet', type: 'supermarket', priceLevel: 2, description: 'Supermarché local', bestFor: ['produits locaux', 'épicerie'] },
    { name: 'Pêcheurs locaux', type: 'market', priceLevel: 1, description: 'Poisson ultra-frais directement des pêcheurs', bestFor: ['poisson', 'fruits de mer'] },
  ],
  la_desirade: [
    { name: 'Marché local', type: 'market', priceLevel: 1, description: 'Produits frais de l\'île', bestFor: ['fruits', 'légumes', 'poisson'] },
    { name: 'Leader Price', type: 'discount', priceLevel: 1, description: 'Produits de base', bestFor: ['féculents', 'conserves'] },
    { name: 'Super U', type: 'supermarket', priceLevel: 2, description: 'Supermarché principal', bestFor: ['tout'] },
    { name: 'Carrefour', type: 'supermarket', priceLevel: 2, description: 'Grand choix', bestFor: ['tout', 'marques'] },
    { name: 'Tierriet', type: 'supermarket', priceLevel: 2, description: 'Supermarché local', bestFor: ['produits locaux'] },
    { name: 'Pêcheurs locaux', type: 'market', priceLevel: 1, description: 'Poisson frais du jour', bestFor: ['poisson', 'fruits de mer'] },
  ],
  marie_galante: [
    { name: 'Marché local', type: 'market', priceLevel: 1, description: 'Produits frais de Marie-Galante', bestFor: ['fruits', 'légumes', 'poisson'] },
    { name: 'Leader Price', type: 'discount', priceLevel: 1, description: 'Produits de base', bestFor: ['féculents', 'conserves'] },
    { name: 'Super U', type: 'supermarket', priceLevel: 2, description: 'Supermarché principal', bestFor: ['tout'] },
    { name: 'Carrefour', type: 'supermarket', priceLevel: 2, description: 'Grand choix', bestFor: ['tout'] },
    { name: 'Tierriet', type: 'supermarket', priceLevel: 2, description: 'Supermarché local', bestFor: ['produits locaux'] },
    { name: 'Pêcheurs locaux', type: 'market', priceLevel: 1, description: 'Poisson frais', bestFor: ['poisson', 'fruits de mer'] },
  ],
  les_saintes: [
    { name: 'Marché local', type: 'market', priceLevel: 1, description: 'Produits frais des Saintes', bestFor: ['fruits', 'légumes', 'poisson'] },
    { name: 'Leader Price', type: 'discount', priceLevel: 1, description: 'Produits de base', bestFor: ['féculents', 'conserves'] },
    { name: 'Super U', type: 'supermarket', priceLevel: 2, description: 'Supermarché principal', bestFor: ['tout'] },
    { name: 'Carrefour', type: 'supermarket', priceLevel: 2, description: 'Grand choix', bestFor: ['tout'] },
    { name: 'Tierriet', type: 'supermarket', priceLevel: 2, description: 'Supermarché local', bestFor: ['produits locaux'] },
    { name: 'Pêcheurs locaux', type: 'market', priceLevel: 1, description: 'Poisson frais', bestFor: ['poisson', 'fruits de mer'] },
  ],
  saint_martin: [
    { name: 'Marché local', type: 'market', priceLevel: 1, description: 'Produits frais de Saint-Martin', bestFor: ['fruits', 'légumes', 'poisson'] },
    { name: 'Leader Price', type: 'discount', priceLevel: 1, description: 'Produits de base à petit prix', bestFor: ['féculents', 'conserves'] },
    { name: 'Match', type: 'supermarket', priceLevel: 2, description: 'Supermarché avec bon choix', bestFor: ['tout', 'produits frais'] },
    { name: 'Épiceries locales', type: 'specialty', priceLevel: 2, description: 'Produits locaux et importés', bestFor: ['épices', 'produits locaux'] },
  ],
  saint_barthelemy: [
    { name: 'Marché de Gustavia', type: 'market', priceLevel: 2, description: 'Marché principal de l\'île', bestFor: ['fruits', 'légumes', 'poisson'] },
    { name: 'Match', type: 'supermarket', priceLevel: 3, description: 'Supermarché principal', bestFor: ['tout', 'produits importés'] },
    { name: 'Épiceries locales', type: 'specialty', priceLevel: 3, description: 'Produits fins et locaux', bestFor: ['épices', 'spécialités'] },
  ],
  guyane: [
    { name: 'Marché de Cayenne', type: 'market', priceLevel: 1, description: 'Grand marché avec produits locaux et amazoniens', bestFor: ['fruits', 'légumes', 'poisson', 'épices'] },
    { name: 'Marché de Saint-Laurent', type: 'market', priceLevel: 1, description: 'Produits frais du Maroni', bestFor: ['fruits', 'légumes', 'poisson'] },
    { name: 'Super U', type: 'supermarket', priceLevel: 2, description: 'Supermarché complet', bestFor: ['viandes', 'produits frais', 'épicerie'] },
    { name: 'Carrefour', type: 'supermarket', priceLevel: 2, description: 'Grand choix de produits', bestFor: ['tout', 'marques'] },
    { name: 'Leader Price', type: 'discount', priceLevel: 1, description: 'Produits de base à petit prix', bestFor: ['féculents', 'conserves'] },
  ],
  reunion: [
    { name: 'Marché forain (Saint-Denis, Saint-Pierre...)', type: 'market', priceLevel: 1, description: 'Produits frais locaux, fruits tropicaux', bestFor: ['fruits', 'légumes', 'épices', 'brèdes'] },
    { name: 'Leclerc', type: 'supermarket', priceLevel: 2, description: 'Bon rapport qualité-prix', bestFor: ['tout', 'promotions'] },
    { name: 'Carrefour', type: 'supermarket', priceLevel: 2, description: 'Grand choix de produits', bestFor: ['tout', 'marques', 'bio'] },
    { name: 'Leader Price', type: 'discount', priceLevel: 1, description: 'Discount pour les produits de base', bestFor: ['féculents', 'conserves'] },
    { name: 'Super U', type: 'supermarket', priceLevel: 2, description: 'Supermarché de proximité', bestFor: ['produits frais', 'épicerie'] },
  ],
  mayotte: [
    { name: 'Marché de Mamoudzou', type: 'market', priceLevel: 1, description: 'Grand marché avec produits locaux', bestFor: ['fruits', 'légumes', 'poisson', 'épices'] },
    { name: 'Sodifram', type: 'supermarket', priceLevel: 2, description: 'Supermarché principal de Mayotte', bestFor: ['tout', 'produits importés'] },
    { name: 'Score', type: 'supermarket', priceLevel: 2, description: 'Supermarché avec bon choix', bestFor: ['viandes', 'produits frais'] },
  ],
  saint_pierre_miquelon: [
    { name: 'Au Bon Goût', type: 'specialty', priceLevel: 2, description: 'Épicerie fine et produits locaux', bestFor: ['produits locaux', 'spécialités'] },
    { name: 'Leclerc', type: 'supermarket', priceLevel: 2, description: 'Supermarché principal', bestFor: ['tout', 'produits importés'] },
  ],
  polynesie: [
    { name: 'Marché de Papeete', type: 'market', priceLevel: 1, description: 'Grand marché avec poissons et fruits tropicaux', bestFor: ['poisson', 'fruits', 'légumes', 'épices'] },
    { name: 'Carrefour', type: 'supermarket', priceLevel: 2, description: 'Supermarché complet', bestFor: ['tout', 'marques'] },
    { name: 'Champion', type: 'supermarket', priceLevel: 2, description: 'Bon choix de produits', bestFor: ['produits frais', 'épicerie'] },
  ],
  nouvelle_caledonie: [
    { name: 'Marché de Nouméa', type: 'market', priceLevel: 1, description: 'Produits frais locaux et mélanésiens', bestFor: ['fruits', 'légumes', 'poisson', 'igname'] },
    { name: 'Carrefour', type: 'supermarket', priceLevel: 2, description: 'Supermarché complet', bestFor: ['tout', 'marques'] },
    { name: 'Géant Casino', type: 'supermarket', priceLevel: 2, description: 'Grand hypermarché', bestFor: ['tout', 'promotions'] },
  ],
  wallis_futuna: [
    { name: 'Marché local', type: 'market', priceLevel: 1, description: 'Produits frais des îles', bestFor: ['fruits', 'légumes', 'poisson', 'taro'] },
    { name: 'Épiceries locales', type: 'specialty', priceLevel: 2, description: 'Produits de base et importés', bestFor: ['féculents', 'conserves', 'épicerie'] },
  ],
  france: [
    { name: 'Lidl', type: 'discount', priceLevel: 1, description: 'Meilleurs prix sur les produits de base', bestFor: ['féculents', 'produits laitiers', 'fruits', 'légumes'] },
    { name: 'Aldi', type: 'discount', priceLevel: 1, description: 'Discount de qualité', bestFor: ['viandes', 'conserves', 'surgelés'] },
    { name: 'Leclerc', type: 'supermarket', priceLevel: 2, description: 'Bon rapport qualité-prix', bestFor: ['tout', 'promotions'] },
    { name: 'Carrefour', type: 'supermarket', priceLevel: 2, description: 'Large gamme de produits', bestFor: ['tout', 'bio', 'marques'] },
    { name: 'Super U', type: 'supermarket', priceLevel: 2, description: 'Supermarché de proximité', bestFor: ['produits frais', 'épicerie'] },
    { name: 'Marché local', type: 'market', priceLevel: 2, description: 'Produits frais et de saison', bestFor: ['fruits', 'légumes', 'fromage', 'viande'] },
    { name: 'Picard', type: 'specialty', priceLevel: 3, description: 'Surgelés de qualité', bestFor: ['surgelés', 'plats préparés'] },
  ],
  usa: [
    { name: 'Walmart', type: 'discount', priceLevel: 1, description: 'Lowest prices on groceries', bestFor: ['everything', 'bulk', 'basics'] },
    { name: 'Aldi', type: 'discount', priceLevel: 1, description: 'Great value store brand products', bestFor: ['produce', 'dairy', 'staples'] },
    { name: 'Trader Joe\'s', type: 'specialty', priceLevel: 2, description: 'Unique products at fair prices', bestFor: ['specialty', 'snacks', 'frozen'] },
    { name: 'Local Farmers Market', type: 'market', priceLevel: 2, description: 'Fresh local produce', bestFor: ['fruits', 'vegetables', 'eggs'] },
    { name: 'Costco', type: 'supermarket', priceLevel: 1, description: 'Bulk buying for families', bestFor: ['bulk', 'meat', 'pantry'] },
  ],
  other: [
    { name: 'Supermarché local', type: 'supermarket', priceLevel: 2, description: 'Votre supermarché habituel', bestFor: ['tout'] },
    { name: 'Marché local', type: 'market', priceLevel: 1, description: 'Produits frais locaux', bestFor: ['fruits', 'légumes'] },
    { name: 'Magasin discount', type: 'discount', priceLevel: 1, description: 'Produits à petit prix', bestFor: ['féculents', 'conserves'] },
  ],
};

// ============================================
// INGREDIENT PRICE DATABASE — ALL TERRITORIES
// ============================================

const ALL_AVAIL: Record<PriceRegion, 'common'> = {
  antilles: 'common', guyane: 'common', reunion: 'common', mayotte: 'common',
  spm: 'common', polynesie: 'common', nouvelle_caledonie: 'common',
  wallis_futuna: 'common', france: 'common', usa: 'common', other: 'common',
};

const ALL_PRICES_DEFAULT = (base: number, outremer: number = base * 1.3, usa: number = base * 1.1): Record<PriceRegion, number> => ({
  france: base,
  antilles: outremer,
  guyane: outremer * 1.05,
  reunion: outremer * 0.95,
  mayotte: outremer * 1.1,
  spm: outremer * 1.15,
  polynesie: outremer * 1.2,
  nouvelle_caledonie: outremer * 1.15,
  wallis_futuna: outremer * 1.25,
  usa: usa,
  other: base * 1.1,
});

export const INGREDIENT_PRICES: IngredientPrice[] = [
  // ── VIANDES ──
  {
    name: 'blanc de poulet', category: 'Viandes & Poissons', unit: 'kg', quantity: 1000,
    prices: ALL_PRICES_DEFAULT(8.90, 9.50, 8.80),
    availability: { ...ALL_AVAIL },
    alternatives: ['cuisses de poulet', 'poulet entier'], tags: ['poulet'],
  },
  {
    name: 'cuisses de poulet', category: 'Viandes & Poissons', unit: 'kg', quantity: 1000,
    prices: ALL_PRICES_DEFAULT(4.50, 5.50, 3.50),
    availability: { ...ALL_AVAIL }, tags: ['poulet'],
  },
  {
    name: 'poulet entier', category: 'Viandes & Poissons', unit: 'kg', quantity: 1000,
    prices: ALL_PRICES_DEFAULT(5.50, 6.50, 4.50),
    availability: { ...ALL_AVAIL }, tags: ['poulet'],
  },
  {
    name: 'poulet boucané', category: 'Viandes & Poissons', unit: 'kg', quantity: 1000,
    prices: { france: 15.00, antilles: 12.00, guyane: 13.00, reunion: 14.00, mayotte: 16.00, spm: 18.00, polynesie: 18.00, nouvelle_caledonie: 17.00, wallis_futuna: 19.00, usa: 14.00, other: 15.00 },
    availability: { ...ALL_AVAIL, antilles: 'common', france: 'rare', usa: 'rare', guyane: 'available', reunion: 'rare', mayotte: 'rare', spm: 'unavailable', polynesie: 'unavailable', nouvelle_caledonie: 'unavailable', wallis_futuna: 'unavailable', other: 'rare' },
    tags: ['poulet'],
  },
  {
    name: 'bœuf (steak)', category: 'Viandes & Poissons', unit: 'kg', quantity: 1000,
    prices: ALL_PRICES_DEFAULT(16.00, 18.00, 13.00),
    availability: { ...ALL_AVAIL },
    alternatives: ['bœuf haché', 'bœuf à braiser'], tags: ['boeuf'],
  },
  {
    name: 'bœuf haché', category: 'Viandes & Poissons', unit: 'kg', quantity: 1000,
    prices: ALL_PRICES_DEFAULT(9.50, 12.00, 8.00),
    availability: { ...ALL_AVAIL }, tags: ['boeuf'],
  },
  {
    name: 'filet de porc', category: 'Viandes & Poissons', unit: 'kg', quantity: 1000,
    prices: ALL_PRICES_DEFAULT(8.50, 10.00, 7.50),
    availability: { ...ALL_AVAIL, mayotte: 'rare' }, tags: ['porc'],
  },
  {
    name: 'jambon', category: 'Viandes & Poissons', unit: 'kg', quantity: 1000,
    prices: ALL_PRICES_DEFAULT(10.00, 12.00, 9.00),
    availability: { ...ALL_AVAIL, mayotte: 'rare' }, tags: ['porc'],
  },
  {
    name: 'saumon (filet)', category: 'Viandes & Poissons', unit: 'kg', quantity: 1000,
    prices: { france: 18.00, antilles: 22.00, guyane: 24.00, reunion: 20.00, mayotte: 25.00, spm: 16.00, polynesie: 26.00, nouvelle_caledonie: 24.00, wallis_futuna: 28.00, usa: 15.00, other: 18.00 },
    availability: { ...ALL_AVAIL, antilles: 'available', guyane: 'available', mayotte: 'rare', polynesie: 'rare', wallis_futuna: 'rare', spm: 'common' },
    alternatives: ['thon en boîte', 'maquereau', 'sardines', 'poisson frais local'], tags: ['saumon', 'poisson'],
  },
  {
    name: 'saumon fumé', category: 'Viandes & Poissons', unit: 'kg', quantity: 1000,
    prices: { france: 28.00, antilles: 35.00, guyane: 36.00, reunion: 32.00, mayotte: 38.00, spm: 26.00, polynesie: 40.00, nouvelle_caledonie: 38.00, wallis_futuna: 42.00, usa: 25.00, other: 30.00 },
    availability: { ...ALL_AVAIL, antilles: 'available', mayotte: 'rare', polynesie: 'rare', wallis_futuna: 'rare' },
    alternatives: ['thon en boîte', 'sardines'], tags: ['saumon'],
  },
  {
    name: 'thon (frais)', category: 'Viandes & Poissons', unit: 'kg', quantity: 1000,
    prices: { france: 20.00, antilles: 15.00, guyane: 16.00, reunion: 14.00, mayotte: 12.00, spm: 22.00, polynesie: 10.00, nouvelle_caledonie: 12.00, wallis_futuna: 11.00, usa: 18.00, other: 17.00 },
    availability: { ...ALL_AVAIL, antilles: 'common', polynesie: 'common', nouvelle_caledonie: 'common', wallis_futuna: 'common', reunion: 'common', mayotte: 'common' },
    tags: ['thon', 'poisson'],
  },
  {
    name: 'thon en boîte', category: 'Viandes & Poissons', unit: 'unité', quantity: 200,
    prices: ALL_PRICES_DEFAULT(2.00, 2.50, 1.80),
    availability: { ...ALL_AVAIL }, tags: ['thon', 'poisson'],
  },
  {
    name: 'cabillaud', category: 'Viandes & Poissons', unit: 'kg', quantity: 1000,
    prices: ALL_PRICES_DEFAULT(14.00, 16.00, 12.00),
    availability: { ...ALL_AVAIL, antilles: 'available', polynesie: 'rare', wallis_futuna: 'rare', spm: 'common' },
    alternatives: ['tilapia', 'colin', 'poisson frais local'], tags: ['poisson'],
  },
  {
    name: 'morue dessalée', category: 'Viandes & Poissons', unit: 'kg', quantity: 1000,
    prices: { france: 12.00, antilles: 10.00, guyane: 11.00, reunion: 13.00, mayotte: 14.00, spm: 9.00, polynesie: 16.00, nouvelle_caledonie: 15.00, wallis_futuna: 17.00, usa: 14.00, other: 12.00 },
    availability: { ...ALL_AVAIL, antilles: 'common', spm: 'common', france: 'available', polynesie: 'rare', wallis_futuna: 'rare' },
    tags: ['morue', 'poisson'],
  },
  {
    name: 'crevettes', category: 'Viandes & Poissons', unit: 'kg', quantity: 1000,
    prices: ALL_PRICES_DEFAULT(12.00, 14.00, 10.00),
    availability: { ...ALL_AVAIL }, tags: ['crevettes', 'fruits_de_mer'],
  },
  {
    name: 'poisson frais local', category: 'Viandes & Poissons', unit: 'kg', quantity: 1000,
    prices: { france: 12.00, antilles: 8.00, guyane: 7.00, reunion: 9.00, mayotte: 7.00, spm: 8.00, polynesie: 6.00, nouvelle_caledonie: 8.00, wallis_futuna: 6.00, usa: 11.00, other: 10.00 },
    availability: { ...ALL_AVAIL }, tags: ['poisson'],
  },
  {
    name: 'dinde', category: 'Viandes & Poissons', unit: 'kg', quantity: 1000,
    prices: ALL_PRICES_DEFAULT(7.50, 8.50, 6.00),
    availability: { ...ALL_AVAIL }, tags: ['poulet'],
  },
  // Territory-specific proteins
  {
    name: 'lambis', category: 'Viandes & Poissons', unit: 'kg', quantity: 1000,
    prices: { france: 25.00, antilles: 12.00, guyane: 14.00, reunion: 28.00, mayotte: 30.00, spm: 30.00, polynesie: 30.00, nouvelle_caledonie: 28.00, wallis_futuna: 30.00, usa: 20.00, other: 25.00 },
    availability: { ...ALL_AVAIL, antilles: 'common', france: 'rare', usa: 'rare', guyane: 'available', reunion: 'unavailable', mayotte: 'unavailable', spm: 'unavailable', polynesie: 'unavailable', nouvelle_caledonie: 'unavailable', wallis_futuna: 'unavailable', other: 'rare' },
    tags: ['fruits_de_mer'],
  },
  {
    name: 'ouassous', category: 'Viandes & Poissons', unit: 'kg', quantity: 1000,
    prices: { france: 30.00, antilles: 18.00, guyane: 20.00, reunion: 35.00, mayotte: 35.00, spm: 35.00, polynesie: 35.00, nouvelle_caledonie: 35.00, wallis_futuna: 35.00, usa: 28.00, other: 30.00 },
    availability: { ...ALL_AVAIL, antilles: 'common', guyane: 'common', france: 'unavailable', usa: 'unavailable', reunion: 'unavailable', mayotte: 'unavailable', spm: 'unavailable', polynesie: 'unavailable', nouvelle_caledonie: 'unavailable', wallis_futuna: 'unavailable', other: 'unavailable' },
    alternatives: ['crevettes'], tags: ['crevettes'],
  },
  {
    name: 'chatrou (poulpe)', category: 'Viandes & Poissons', unit: 'kg', quantity: 1000,
    prices: { france: 18.00, antilles: 10.00, guyane: 12.00, reunion: 15.00, mayotte: 12.00, spm: 20.00, polynesie: 14.00, nouvelle_caledonie: 14.00, wallis_futuna: 15.00, usa: 16.00, other: 16.00 },
    availability: { ...ALL_AVAIL, antilles: 'common', france: 'available', reunion: 'available', mayotte: 'common', polynesie: 'available', nouvelle_caledonie: 'available' },
    tags: ['fruits_de_mer'],
  },
  {
    name: 'langouste', category: 'Viandes & Poissons', unit: 'kg', quantity: 1000,
    prices: { france: 45.00, antilles: 30.00, guyane: 28.00, reunion: 35.00, mayotte: 20.00, spm: 40.00, polynesie: 25.00, nouvelle_caledonie: 28.00, wallis_futuna: 25.00, usa: 40.00, other: 40.00 },
    availability: { ...ALL_AVAIL, antilles: 'available', mayotte: 'common', polynesie: 'common', nouvelle_caledonie: 'common', wallis_futuna: 'common' },
    alternatives: ['crevettes'], tags: ['fruits_de_mer'],
  },
  {
    name: 'cerf', category: 'Viandes & Poissons', unit: 'kg', quantity: 1000,
    prices: { france: 25.00, antilles: 30.00, guyane: 28.00, reunion: 22.00, mayotte: 30.00, spm: 30.00, polynesie: 30.00, nouvelle_caledonie: 14.00, wallis_futuna: 30.00, usa: 20.00, other: 25.00 },
    availability: { ...ALL_AVAIL, nouvelle_caledonie: 'common', reunion: 'available', france: 'rare', antilles: 'unavailable', guyane: 'unavailable', mayotte: 'unavailable', spm: 'unavailable', polynesie: 'unavailable', wallis_futuna: 'unavailable', usa: 'rare', other: 'rare' },
    alternatives: ['bœuf haché'], tags: ['boeuf'],
  },
  {
    name: 'bichique', category: 'Viandes & Poissons', unit: 'kg', quantity: 1000,
    prices: { france: 50.00, antilles: 50.00, guyane: 50.00, reunion: 35.00, mayotte: 50.00, spm: 50.00, polynesie: 50.00, nouvelle_caledonie: 50.00, wallis_futuna: 50.00, usa: 50.00, other: 50.00 },
    availability: { ...ALL_AVAIL, reunion: 'available', france: 'unavailable', antilles: 'unavailable', guyane: 'unavailable', mayotte: 'unavailable', spm: 'unavailable', polynesie: 'unavailable', nouvelle_caledonie: 'unavailable', wallis_futuna: 'unavailable', usa: 'unavailable', other: 'unavailable' },
    alternatives: ['poisson frais local'], tags: ['poisson'],
  },
  {
    name: 'cochon de lait', category: 'Viandes & Poissons', unit: 'kg', quantity: 1000,
    prices: { france: 12.00, antilles: 10.00, guyane: 11.00, reunion: 11.00, mayotte: 14.00, spm: 15.00, polynesie: 12.00, nouvelle_caledonie: 12.00, wallis_futuna: 8.00, usa: 10.00, other: 12.00 },
    availability: { ...ALL_AVAIL, wallis_futuna: 'common', polynesie: 'common', antilles: 'available', reunion: 'available' },
    tags: ['porc'],
  },

  // ── FRUITS & LÉGUMES ──
  {
    name: 'tomates', category: 'Fruits & Légumes', unit: 'kg', quantity: 1000,
    prices: ALL_PRICES_DEFAULT(2.50, 3.50, 3.00),
    availability: { ...ALL_AVAIL }, tags: ['legumes_verts'],
  },
  {
    name: 'tomates cerises', category: 'Fruits & Légumes', unit: 'barquette', quantity: 250,
    prices: ALL_PRICES_DEFAULT(2.00, 3.00, 3.50),
    availability: { ...ALL_AVAIL }, tags: ['legumes_verts'],
  },
  {
    name: 'carottes', category: 'Fruits & Légumes', unit: 'kg', quantity: 1000,
    prices: ALL_PRICES_DEFAULT(1.50, 2.80, 1.80),
    availability: { ...ALL_AVAIL }, tags: ['legumes_verts'],
  },
  {
    name: 'courgettes', category: 'Fruits & Légumes', unit: 'kg', quantity: 1000,
    prices: ALL_PRICES_DEFAULT(2.00, 3.50, 2.50),
    availability: { ...ALL_AVAIL }, tags: ['legumes_verts'],
  },
  {
    name: 'poivrons', category: 'Fruits & Légumes', unit: 'kg', quantity: 1000,
    prices: ALL_PRICES_DEFAULT(3.50, 4.50, 3.00),
    availability: { ...ALL_AVAIL }, tags: ['legumes_verts'],
  },
  {
    name: 'oignons', category: 'Fruits & Légumes', unit: 'kg', quantity: 1000,
    prices: ALL_PRICES_DEFAULT(1.50, 2.50, 1.50),
    availability: { ...ALL_AVAIL }, tags: ['legumes_verts'],
  },
  {
    name: 'ail', category: 'Fruits & Légumes', unit: 'tête', quantity: 50,
    prices: ALL_PRICES_DEFAULT(0.50, 0.80, 0.50),
    availability: { ...ALL_AVAIL }, tags: ['legumes_verts'],
  },
  {
    name: 'épinards', category: 'Fruits & Légumes', unit: 'sachet', quantity: 200,
    prices: ALL_PRICES_DEFAULT(2.00, 3.50, 2.50),
    availability: { ...ALL_AVAIL, antilles: 'available', polynesie: 'rare', wallis_futuna: 'rare' }, tags: ['legumes_verts'],
  },
  {
    name: 'brocoli', category: 'Fruits & Légumes', unit: 'pièce', quantity: 400,
    prices: ALL_PRICES_DEFAULT(1.80, 3.50, 2.00),
    availability: { ...ALL_AVAIL, antilles: 'available', mayotte: 'rare', polynesie: 'rare', wallis_futuna: 'rare' }, tags: ['legumes_verts'],
  },
  {
    name: 'haricots verts', category: 'Fruits & Légumes', unit: 'kg', quantity: 1000,
    prices: ALL_PRICES_DEFAULT(3.00, 4.00, 3.50),
    availability: { ...ALL_AVAIL }, tags: ['legumes_verts'],
  },
  {
    name: 'aubergines', category: 'Fruits & Légumes', unit: 'kg', quantity: 1000,
    prices: ALL_PRICES_DEFAULT(2.50, 3.00, 3.00),
    availability: { ...ALL_AVAIL }, tags: ['legumes_verts'],
  },
  {
    name: 'champignons', category: 'Fruits & Légumes', unit: 'barquette', quantity: 250,
    prices: ALL_PRICES_DEFAULT(1.80, 3.50, 2.50),
    availability: { ...ALL_AVAIL, antilles: 'available', mayotte: 'rare', polynesie: 'rare', wallis_futuna: 'rare' }, tags: ['legumes_verts'],
  },
  {
    name: 'concombre', category: 'Fruits & Légumes', unit: 'pièce', quantity: 300,
    prices: ALL_PRICES_DEFAULT(0.80, 1.50, 1.00),
    availability: { ...ALL_AVAIL }, tags: ['legumes_verts'],
  },
  {
    name: 'salade / laitue', category: 'Fruits & Légumes', unit: 'pièce', quantity: 200,
    prices: ALL_PRICES_DEFAULT(1.00, 2.00, 1.50),
    availability: { ...ALL_AVAIL }, tags: ['legumes_verts'],
  },
  {
    name: 'roquette', category: 'Fruits & Légumes', unit: 'sachet', quantity: 100,
    prices: ALL_PRICES_DEFAULT(1.50, 3.00, 2.50),
    availability: { ...ALL_AVAIL, antilles: 'available', mayotte: 'rare', polynesie: 'rare', wallis_futuna: 'rare' }, tags: ['legumes_verts'],
  },
  {
    name: 'christophine', category: 'Fruits & Légumes', unit: 'kg', quantity: 1000,
    prices: { france: 5.00, antilles: 2.00, guyane: 2.50, reunion: 3.00, mayotte: 3.50, spm: 6.00, polynesie: 5.00, nouvelle_caledonie: 4.50, wallis_futuna: 5.00, usa: 4.50, other: 4.00 },
    availability: { ...ALL_AVAIL, antilles: 'common', guyane: 'common', reunion: 'available', france: 'rare', usa: 'rare', mayotte: 'available', spm: 'unavailable', polynesie: 'rare', nouvelle_caledonie: 'rare', wallis_futuna: 'rare' },
    tags: ['christophine', 'legumes_verts'],
  },
  {
    name: 'giraumon', category: 'Fruits & Légumes', unit: 'kg', quantity: 1000,
    prices: { france: 4.50, antilles: 2.50, guyane: 2.80, reunion: 3.00, mayotte: 3.00, spm: 5.50, polynesie: 4.00, nouvelle_caledonie: 3.50, wallis_futuna: 4.00, usa: 4.00, other: 3.50 },
    availability: { ...ALL_AVAIL, antilles: 'common', guyane: 'common', reunion: 'available', france: 'rare', usa: 'rare' },
    alternatives: ['potiron', 'butternut'], tags: ['giraumon', 'legumes_verts'],
  },
  {
    name: 'igname', category: 'Fruits & Légumes', unit: 'kg', quantity: 1000,
    prices: { france: 6.00, antilles: 3.00, guyane: 3.50, reunion: 4.00, mayotte: 3.00, spm: 7.00, polynesie: 4.00, nouvelle_caledonie: 3.00, wallis_futuna: 3.00, usa: 5.50, other: 5.00 },
    availability: { ...ALL_AVAIL, antilles: 'common', guyane: 'common', nouvelle_caledonie: 'common', mayotte: 'common', wallis_futuna: 'common', france: 'rare', usa: 'available' },
    alternatives: ['pommes de terre', 'patate douce'], tags: ['igname'],
  },
  {
    name: 'taro', category: 'Fruits & Légumes', unit: 'kg', quantity: 1000,
    prices: { france: 7.00, antilles: 4.00, guyane: 3.50, reunion: 4.00, mayotte: 3.00, spm: 8.00, polynesie: 2.50, nouvelle_caledonie: 3.00, wallis_futuna: 2.00, usa: 5.00, other: 5.00 },
    availability: { ...ALL_AVAIL, polynesie: 'common', nouvelle_caledonie: 'common', wallis_futuna: 'common', mayotte: 'common', antilles: 'available', france: 'rare', usa: 'available' },
    alternatives: ['igname', 'patate douce'], tags: ['igname'],
  },
  {
    name: 'uru (fruit à pain)', category: 'Fruits & Légumes', unit: 'pièce', quantity: 1000,
    prices: { france: 10.00, antilles: 3.00, guyane: 3.50, reunion: 8.00, mayotte: 6.00, spm: 12.00, polynesie: 1.50, nouvelle_caledonie: 3.00, wallis_futuna: 1.50, usa: 8.00, other: 8.00 },
    availability: { ...ALL_AVAIL, polynesie: 'common', wallis_futuna: 'common', antilles: 'common', guyane: 'common', nouvelle_caledonie: 'common', france: 'unavailable', usa: 'rare', spm: 'unavailable', reunion: 'rare', mayotte: 'available' },
    alternatives: ['banane plantain', 'patate douce'], tags: ['banane_plantain'],
  },
  {
    name: 'banane plantain', category: 'Fruits & Légumes', unit: 'kg', quantity: 1000,
    prices: { france: 3.50, antilles: 1.80, guyane: 1.50, reunion: 2.50, mayotte: 2.00, spm: 4.50, polynesie: 3.00, nouvelle_caledonie: 3.00, wallis_futuna: 3.00, usa: 2.50, other: 3.00 },
    availability: { ...ALL_AVAIL, antilles: 'common', guyane: 'common', reunion: 'common', mayotte: 'common', france: 'available', usa: 'common' },
    tags: ['banane_plantain'],
  },
  {
    name: 'banane (fruit)', category: 'Fruits & Légumes', unit: 'kg', quantity: 1000,
    prices: ALL_PRICES_DEFAULT(1.80, 1.50, 1.30),
    availability: { ...ALL_AVAIL }, tags: ['fruits'],
  },
  {
    name: 'avocat', category: 'Fruits & Légumes', unit: 'pièce', quantity: 200,
    prices: { france: 1.50, antilles: 1.00, guyane: 0.80, reunion: 1.50, mayotte: 1.00, spm: 2.00, polynesie: 1.50, nouvelle_caledonie: 1.50, wallis_futuna: 2.00, usa: 1.50, other: 1.50 },
    availability: { ...ALL_AVAIL, antilles: 'common', guyane: 'common' }, tags: ['avocat', 'fruits'],
  },
  {
    name: 'mangue', category: 'Fruits & Légumes', unit: 'pièce', quantity: 300,
    prices: { france: 2.50, antilles: 1.00, guyane: 0.80, reunion: 1.00, mayotte: 0.80, spm: 3.50, polynesie: 1.50, nouvelle_caledonie: 2.00, wallis_futuna: 2.00, usa: 2.00, other: 2.00 },
    availability: { ...ALL_AVAIL, antilles: 'common', guyane: 'common', reunion: 'common', mayotte: 'common', france: 'available' },
    tags: ['fruits'],
  },
  {
    name: 'maracudja (fruit de la passion)', category: 'Fruits & Légumes', unit: 'kg', quantity: 1000,
    prices: { france: 12.00, antilles: 4.00, guyane: 3.50, reunion: 5.00, mayotte: 5.00, spm: 15.00, polynesie: 6.00, nouvelle_caledonie: 7.00, wallis_futuna: 8.00, usa: 10.00, other: 10.00 },
    availability: { ...ALL_AVAIL, antilles: 'common', guyane: 'common', reunion: 'common', france: 'available', usa: 'available' },
    tags: ['fruits'],
  },
  {
    name: 'chadèque (pamplemousse local)', category: 'Fruits & Légumes', unit: 'pièce', quantity: 500,
    prices: { france: 3.00, antilles: 1.00, guyane: 1.00, reunion: 1.50, mayotte: 1.50, spm: 4.00, polynesie: 2.00, nouvelle_caledonie: 2.00, wallis_futuna: 2.50, usa: 2.50, other: 2.50 },
    availability: { ...ALL_AVAIL, antilles: 'common', guyane: 'common', france: 'rare', usa: 'rare' },
    tags: ['fruits'],
  },
  {
    name: 'letchi', category: 'Fruits & Légumes', unit: 'kg', quantity: 1000,
    prices: { france: 8.00, antilles: 6.00, guyane: 7.00, reunion: 3.00, mayotte: 5.00, spm: 10.00, polynesie: 8.00, nouvelle_caledonie: 7.00, wallis_futuna: 9.00, usa: 8.00, other: 8.00 },
    availability: { ...ALL_AVAIL, reunion: 'common', france: 'available', antilles: 'available' },
    tags: ['fruits'],
  },
  {
    name: 'ananas Victoria', category: 'Fruits & Légumes', unit: 'pièce', quantity: 800,
    prices: { france: 3.50, antilles: 2.00, guyane: 2.00, reunion: 1.50, mayotte: 2.50, spm: 5.00, polynesie: 2.00, nouvelle_caledonie: 2.50, wallis_futuna: 3.00, usa: 4.00, other: 3.50 },
    availability: { ...ALL_AVAIL, reunion: 'common', antilles: 'common', guyane: 'common', polynesie: 'common' },
    tags: ['fruits'],
  },
  {
    name: 'kiwi', category: 'Fruits & Légumes', unit: 'pièce', quantity: 100,
    prices: ALL_PRICES_DEFAULT(0.30, 0.80, 0.50),
    availability: { ...ALL_AVAIL, antilles: 'available', polynesie: 'rare', wallis_futuna: 'rare' }, tags: ['fruits'],
  },
  {
    name: 'pomme', category: 'Fruits & Légumes', unit: 'kg', quantity: 1000,
    prices: ALL_PRICES_DEFAULT(2.50, 3.50, 3.00),
    availability: { ...ALL_AVAIL }, tags: ['fruits'],
  },
  {
    name: 'citron / citron vert', category: 'Fruits & Légumes', unit: 'filet', quantity: 500,
    prices: ALL_PRICES_DEFAULT(2.00, 1.50, 2.50),
    availability: { ...ALL_AVAIL }, tags: ['fruits'],
  },
  {
    name: 'fruits rouges', category: 'Fruits & Légumes', unit: 'barquette', quantity: 250,
    prices: ALL_PRICES_DEFAULT(3.00, 5.00, 4.00),
    availability: { ...ALL_AVAIL, antilles: 'rare', guyane: 'rare', mayotte: 'rare', polynesie: 'rare', wallis_futuna: 'rare' },
    alternatives: ['fruits tropicaux', 'banane'], tags: ['fruits'],
  },
  {
    name: 'pommes de terre', category: 'Fruits & Légumes', unit: 'kg', quantity: 1000,
    prices: ALL_PRICES_DEFAULT(1.20, 2.50, 1.50),
    availability: { ...ALL_AVAIL }, tags: ['pommes_de_terre'],
  },
  {
    name: 'patate douce', category: 'Fruits & Légumes', unit: 'kg', quantity: 1000,
    prices: { france: 3.50, antilles: 2.50, guyane: 2.00, reunion: 2.50, mayotte: 2.00, spm: 4.50, polynesie: 2.50, nouvelle_caledonie: 2.50, wallis_futuna: 2.50, usa: 2.50, other: 3.00 },
    availability: { ...ALL_AVAIL }, tags: ['patate_douce'],
  },
  {
    name: 'gingembre', category: 'Fruits & Légumes', unit: 'pièce', quantity: 50,
    prices: ALL_PRICES_DEFAULT(0.80, 0.80, 0.70),
    availability: { ...ALL_AVAIL }, tags: ['legumes_verts'],
  },
  {
    name: 'piment', category: 'Fruits & Légumes', unit: 'pièce', quantity: 20,
    prices: ALL_PRICES_DEFAULT(0.50, 0.30, 0.40),
    availability: { ...ALL_AVAIL }, tags: ['legumes_verts'],
  },
  {
    name: 'herbes fraîches', category: 'Fruits & Légumes', unit: 'botte', quantity: 30,
    prices: ALL_PRICES_DEFAULT(1.00, 1.00, 1.50),
    availability: { ...ALL_AVAIL }, tags: ['legumes_verts'],
  },
  {
    name: 'poireaux', category: 'Fruits & Légumes', unit: 'kg', quantity: 1000,
    prices: ALL_PRICES_DEFAULT(2.50, 4.50, 3.50),
    availability: { ...ALL_AVAIL, antilles: 'rare', polynesie: 'rare', wallis_futuna: 'rare', mayotte: 'rare' }, tags: ['legumes_verts'],
  },
  // Territory-specific vegetables
  {
    name: 'brèdes (mafane, chouchou...)', category: 'Fruits & Légumes', unit: 'botte', quantity: 200,
    prices: { france: 4.00, antilles: 3.00, guyane: 2.50, reunion: 1.50, mayotte: 1.50, spm: 5.00, polynesie: 3.00, nouvelle_caledonie: 3.00, wallis_futuna: 3.00, usa: 5.00, other: 4.00 },
    availability: { ...ALL_AVAIL, reunion: 'common', mayotte: 'common', antilles: 'available', guyane: 'available', france: 'rare', usa: 'rare' },
    tags: ['legumes_verts'],
  },
  {
    name: 'manioc', category: 'Fruits & Légumes', unit: 'kg', quantity: 1000,
    prices: { france: 5.00, antilles: 2.50, guyane: 1.50, reunion: 3.00, mayotte: 1.50, spm: 6.00, polynesie: 3.00, nouvelle_caledonie: 3.00, wallis_futuna: 2.50, usa: 4.00, other: 4.00 },
    availability: { ...ALL_AVAIL, guyane: 'common', mayotte: 'common', antilles: 'common', reunion: 'available', polynesie: 'available', nouvelle_caledonie: 'available', wallis_futuna: 'available', france: 'rare' },
    alternatives: ['patate douce', 'igname'], tags: ['igname'],
  },
  {
    name: 'fafa (feuilles de taro)', category: 'Fruits & Légumes', unit: 'botte', quantity: 200,
    prices: { france: 8.00, antilles: 5.00, guyane: 4.00, reunion: 5.00, mayotte: 4.00, spm: 10.00, polynesie: 1.50, nouvelle_caledonie: 3.00, wallis_futuna: 2.00, usa: 7.00, other: 7.00 },
    availability: { ...ALL_AVAIL, polynesie: 'common', wallis_futuna: 'common', nouvelle_caledonie: 'common', france: 'unavailable', usa: 'rare', antilles: 'rare', spm: 'unavailable' },
    alternatives: ['épinards'], tags: ['legumes_verts'],
  },
  {
    name: 'palmiste', category: 'Fruits & Légumes', unit: 'pièce', quantity: 300,
    prices: { france: 8.00, antilles: 4.00, guyane: 3.00, reunion: 3.50, mayotte: 5.00, spm: 10.00, polynesie: 6.00, nouvelle_caledonie: 5.00, wallis_futuna: 6.00, usa: 8.00, other: 7.00 },
    availability: { ...ALL_AVAIL, reunion: 'common', guyane: 'common', antilles: 'available', france: 'rare', usa: 'rare' },
    tags: ['legumes_verts'],
  },
  {
    name: 'couac (farine de manioc)', category: 'Féculents & Céréales', unit: 'kg', quantity: 1000,
    prices: { france: 8.00, antilles: 5.00, guyane: 3.00, reunion: 7.00, mayotte: 6.00, spm: 10.00, polynesie: 8.00, nouvelle_caledonie: 8.00, wallis_futuna: 9.00, usa: 8.00, other: 7.00 },
    availability: { ...ALL_AVAIL, guyane: 'common', antilles: 'available', france: 'rare', usa: 'rare', reunion: 'rare', mayotte: 'rare', spm: 'unavailable', polynesie: 'unavailable', nouvelle_caledonie: 'unavailable', wallis_futuna: 'unavailable' },
    alternatives: ['farine de blé'], tags: ['quinoa'],
  },

  // ── PRODUITS LAITIERS ──
  {
    name: 'lait', category: 'Produits laitiers', unit: 'litre', quantity: 1000,
    prices: ALL_PRICES_DEFAULT(1.00, 1.50, 1.20),
    availability: { ...ALL_AVAIL }, tags: ['yaourt'],
  },
  {
    name: 'lait d\'amande', category: 'Produits laitiers', unit: 'litre', quantity: 1000,
    prices: ALL_PRICES_DEFAULT(2.00, 3.50, 3.00),
    availability: { ...ALL_AVAIL, antilles: 'available', mayotte: 'rare', wallis_futuna: 'rare' }, tags: ['yaourt'],
  },
  {
    name: 'yaourt grec', category: 'Produits laitiers', unit: 'pot (500g)', quantity: 500,
    prices: ALL_PRICES_DEFAULT(2.50, 3.50, 4.00),
    availability: { ...ALL_AVAIL }, tags: ['yaourt'],
  },
  {
    name: 'yaourt nature', category: 'Produits laitiers', unit: 'lot 4', quantity: 500,
    prices: ALL_PRICES_DEFAULT(1.50, 2.50, 2.50),
    availability: { ...ALL_AVAIL }, tags: ['yaourt'],
  },
  {
    name: 'fromage blanc 0%', category: 'Produits laitiers', unit: 'pot (500g)', quantity: 500,
    prices: ALL_PRICES_DEFAULT(1.50, 3.00, 3.50),
    availability: { ...ALL_AVAIL, antilles: 'available', mayotte: 'rare', polynesie: 'rare', wallis_futuna: 'rare' }, tags: ['yaourt', 'fromage'],
  },
  {
    name: 'fromage (gruyère/emmental)', category: 'Produits laitiers', unit: 'paquet (200g)', quantity: 200,
    prices: ALL_PRICES_DEFAULT(2.00, 3.50, 3.50),
    availability: { ...ALL_AVAIL }, tags: ['fromage'],
  },
  {
    name: 'mozzarella', category: 'Produits laitiers', unit: 'boule (125g)', quantity: 125,
    prices: ALL_PRICES_DEFAULT(1.00, 2.50, 2.00),
    availability: { ...ALL_AVAIL }, tags: ['fromage'],
  },
  {
    name: 'parmesan', category: 'Produits laitiers', unit: 'paquet (100g)', quantity: 100,
    prices: ALL_PRICES_DEFAULT(2.50, 3.50, 4.00),
    availability: { ...ALL_AVAIL }, tags: ['fromage'],
  },
  {
    name: 'fromage de chèvre', category: 'Produits laitiers', unit: 'bûche (150g)', quantity: 150,
    prices: ALL_PRICES_DEFAULT(2.00, 3.50, 4.00),
    availability: { ...ALL_AVAIL, mayotte: 'rare', wallis_futuna: 'rare' }, tags: ['fromage'],
  },
  {
    name: 'fromage frais', category: 'Produits laitiers', unit: 'pot (200g)', quantity: 200,
    prices: ALL_PRICES_DEFAULT(1.50, 2.50, 3.00),
    availability: { ...ALL_AVAIL }, tags: ['fromage'],
  },
  {
    name: 'feta', category: 'Produits laitiers', unit: 'paquet (200g)', quantity: 200,
    prices: ALL_PRICES_DEFAULT(2.50, 3.50, 4.00),
    availability: { ...ALL_AVAIL }, tags: ['fromage'],
  },
  {
    name: 'beurre', category: 'Produits laitiers', unit: 'plaquette (250g)', quantity: 250,
    prices: ALL_PRICES_DEFAULT(2.00, 3.00, 3.50),
    availability: { ...ALL_AVAIL }, tags: ['yaourt'],
  },
  {
    name: 'crème fraîche / crème légère', category: 'Produits laitiers', unit: 'pot (200ml)', quantity: 200,
    prices: ALL_PRICES_DEFAULT(1.00, 2.00, 2.50),
    availability: { ...ALL_AVAIL }, tags: ['yaourt'],
  },
  {
    name: 'œufs', category: 'Produits laitiers', unit: 'boîte de 6', quantity: 360,
    prices: ALL_PRICES_DEFAULT(1.80, 2.50, 2.50),
    availability: { ...ALL_AVAIL }, tags: ['oeufs'],
  },

  // ── FÉCULENTS & CÉRÉALES ──
  {
    name: 'riz basmati', category: 'Féculents & Céréales', unit: 'kg', quantity: 1000,
    prices: ALL_PRICES_DEFAULT(2.00, 2.50, 2.50),
    availability: { ...ALL_AVAIL }, tags: ['riz'],
  },
  {
    name: 'riz complet', category: 'Féculents & Céréales', unit: 'kg', quantity: 1000,
    prices: ALL_PRICES_DEFAULT(2.50, 3.00, 2.50),
    availability: { ...ALL_AVAIL }, tags: ['riz'],
  },
  {
    name: 'pâtes complètes', category: 'Féculents & Céréales', unit: 'paquet (500g)', quantity: 500,
    prices: ALL_PRICES_DEFAULT(1.20, 2.00, 1.80),
    availability: { ...ALL_AVAIL }, tags: ['pates'],
  },
  {
    name: 'pâtes', category: 'Féculents & Céréales', unit: 'paquet (500g)', quantity: 500,
    prices: ALL_PRICES_DEFAULT(0.80, 1.50, 1.20),
    availability: { ...ALL_AVAIL }, tags: ['pates'],
  },
  {
    name: 'quinoa', category: 'Féculents & Céréales', unit: 'paquet (400g)', quantity: 400,
    prices: ALL_PRICES_DEFAULT(3.50, 5.00, 4.00),
    availability: { ...ALL_AVAIL, antilles: 'available', mayotte: 'rare', wallis_futuna: 'rare' },
    alternatives: ['riz complet', 'semoule'], tags: ['quinoa'],
  },
  {
    name: 'lentilles corail', category: 'Féculents & Céréales', unit: 'paquet (500g)', quantity: 500,
    prices: ALL_PRICES_DEFAULT(2.00, 3.00, 2.50),
    availability: { ...ALL_AVAIL }, tags: ['lentilles'],
  },
  {
    name: 'lentilles vertes', category: 'Féculents & Céréales', unit: 'paquet (500g)', quantity: 500,
    prices: ALL_PRICES_DEFAULT(1.80, 2.50, 2.50),
    availability: { ...ALL_AVAIL }, tags: ['lentilles'],
  },
  {
    name: 'pois chiches', category: 'Féculents & Céréales', unit: 'boîte (400g)', quantity: 400,
    prices: ALL_PRICES_DEFAULT(1.00, 1.50, 1.20),
    availability: { ...ALL_AVAIL }, tags: ['pois_chiches'],
  },
  {
    name: 'flocons d\'avoine', category: 'Féculents & Céréales', unit: 'paquet (500g)', quantity: 500,
    prices: ALL_PRICES_DEFAULT(1.20, 2.50, 2.00),
    availability: { ...ALL_AVAIL }, tags: ['quinoa'],
  },
  {
    name: 'pain complet', category: 'Féculents & Céréales', unit: 'pièce', quantity: 400,
    prices: ALL_PRICES_DEFAULT(1.50, 2.00, 3.00),
    availability: { ...ALL_AVAIL }, tags: ['quinoa'],
  },
  {
    name: 'tortilla / wrap', category: 'Féculents & Céréales', unit: 'paquet (6)', quantity: 300,
    prices: ALL_PRICES_DEFAULT(2.00, 2.50, 2.50),
    availability: { ...ALL_AVAIL }, tags: ['pates'],
  },
  {
    name: 'farine', category: 'Féculents & Céréales', unit: 'kg', quantity: 1000,
    prices: ALL_PRICES_DEFAULT(1.50, 2.50, 2.00),
    availability: { ...ALL_AVAIL }, tags: ['quinoa'],
  },
  {
    name: 'granola', category: 'Féculents & Céréales', unit: 'paquet (350g)', quantity: 350,
    prices: ALL_PRICES_DEFAULT(3.00, 4.50, 4.00),
    availability: { ...ALL_AVAIL, antilles: 'available', mayotte: 'rare', wallis_futuna: 'rare' }, tags: ['quinoa'],
  },
  {
    name: 'nouilles de riz', category: 'Féculents & Céréales', unit: 'paquet (250g)', quantity: 250,
    prices: ALL_PRICES_DEFAULT(1.80, 2.50, 2.00),
    availability: { ...ALL_AVAIL }, tags: ['pates'],
  },

  // ── ÉPICERIE ──
  {
    name: 'huile d\'olive', category: 'Épicerie', unit: 'bouteille (500ml)', quantity: 500,
    prices: ALL_PRICES_DEFAULT(4.00, 5.00, 5.00),
    availability: { ...ALL_AVAIL }, tags: [],
  },
  {
    name: 'lait de coco', category: 'Épicerie', unit: 'boîte (400ml)', quantity: 400,
    prices: { france: 1.50, antilles: 1.50, guyane: 1.20, reunion: 1.50, mayotte: 1.20, spm: 2.00, polynesie: 1.00, nouvelle_caledonie: 1.20, wallis_futuna: 1.00, usa: 2.00, other: 1.80 },
    availability: { ...ALL_AVAIL }, tags: [],
  },
  {
    name: 'sauce soja', category: 'Épicerie', unit: 'bouteille (250ml)', quantity: 250,
    prices: ALL_PRICES_DEFAULT(1.50, 2.50, 2.00),
    availability: { ...ALL_AVAIL }, tags: [],
  },
  {
    name: 'pesto basilic', category: 'Épicerie', unit: 'pot (190g)', quantity: 190,
    prices: ALL_PRICES_DEFAULT(2.00, 3.50, 3.50),
    availability: { ...ALL_AVAIL, antilles: 'available', mayotte: 'rare', wallis_futuna: 'rare' }, tags: [],
  },
  {
    name: 'tomates séchées', category: 'Épicerie', unit: 'pot (200g)', quantity: 200,
    prices: ALL_PRICES_DEFAULT(2.50, 3.50, 4.00),
    availability: { ...ALL_AVAIL, antilles: 'available' }, tags: [],
  },
  {
    name: 'miel', category: 'Épicerie', unit: 'pot (250g)', quantity: 250,
    prices: ALL_PRICES_DEFAULT(3.50, 4.00, 5.00),
    availability: { ...ALL_AVAIL }, tags: [],
  },
  {
    name: 'sirop d\'érable', category: 'Épicerie', unit: 'bouteille (250ml)', quantity: 250,
    prices: ALL_PRICES_DEFAULT(5.00, 6.00, 6.00),
    availability: { ...ALL_AVAIL, spm: 'common' },
    alternatives: ['miel'], tags: [],
  },
  {
    name: 'poudre à colombo', category: 'Épicerie', unit: 'sachet (50g)', quantity: 50,
    prices: { france: 3.00, antilles: 1.50, guyane: 2.00, reunion: 2.50, mayotte: 3.00, spm: 4.00, polynesie: 4.00, nouvelle_caledonie: 3.50, wallis_futuna: 4.00, usa: 3.50, other: 3.00 },
    availability: { ...ALL_AVAIL, antilles: 'common', guyane: 'common', france: 'available', usa: 'rare' },
    alternatives: ['curry en poudre'], tags: [],
  },
  {
    name: 'curry en poudre', category: 'Épicerie', unit: 'pot (40g)', quantity: 40,
    prices: ALL_PRICES_DEFAULT(1.50, 2.00, 2.00),
    availability: { ...ALL_AVAIL }, tags: [],
  },
  {
    name: 'épices (curcuma, cannelle...)', category: 'Épicerie', unit: 'pot', quantity: 40,
    prices: ALL_PRICES_DEFAULT(1.50, 2.00, 2.50),
    availability: { ...ALL_AVAIL }, tags: [],
  },
  {
    name: 'bouillon (cube)', category: 'Épicerie', unit: 'boîte (8 cubes)', quantity: 80,
    prices: ALL_PRICES_DEFAULT(1.00, 1.50, 1.50),
    availability: { ...ALL_AVAIL }, tags: [],
  },
  {
    name: 'moutarde', category: 'Épicerie', unit: 'pot (200g)', quantity: 200,
    prices: ALL_PRICES_DEFAULT(1.00, 2.00, 2.50),
    availability: { ...ALL_AVAIL }, tags: [],
  },
  {
    name: 'vinaigre', category: 'Épicerie', unit: 'bouteille (500ml)', quantity: 500,
    prices: ALL_PRICES_DEFAULT(1.00, 2.00, 2.00),
    availability: { ...ALL_AVAIL }, tags: [],
  },
  {
    name: 'chocolat noir', category: 'Épicerie', unit: 'tablette (100g)', quantity: 100,
    prices: ALL_PRICES_DEFAULT(1.50, 2.50, 2.50),
    availability: { ...ALL_AVAIL }, tags: [],
  },
  {
    name: 'protéine en poudre', category: 'Épicerie', unit: 'dose (30g)', quantity: 30,
    prices: ALL_PRICES_DEFAULT(1.00, 1.50, 1.00),
    availability: { ...ALL_AVAIL, antilles: 'available', mayotte: 'rare', wallis_futuna: 'rare' }, tags: [],
  },
  {
    name: 'sauce teriyaki', category: 'Épicerie', unit: 'bouteille (250ml)', quantity: 250,
    prices: ALL_PRICES_DEFAULT(2.50, 3.50, 3.00),
    availability: { ...ALL_AVAIL, antilles: 'available' }, tags: [],
  },
  {
    name: 'olives', category: 'Épicerie', unit: 'pot (200g)', quantity: 200,
    prices: ALL_PRICES_DEFAULT(1.50, 2.50, 3.00),
    availability: { ...ALL_AVAIL }, tags: [],
  },
  {
    name: 'sauce chien', category: 'Épicerie', unit: 'pot (200ml)', quantity: 200,
    prices: { france: 4.50, antilles: 2.50, guyane: 3.00, reunion: 5.00, mayotte: 5.00, spm: 6.00, polynesie: 6.00, nouvelle_caledonie: 5.50, wallis_futuna: 6.00, usa: 5.00, other: 4.00 },
    availability: { ...ALL_AVAIL, antilles: 'common', guyane: 'common', france: 'rare', usa: 'rare' }, tags: [],
  },
  {
    name: 'sauce César', category: 'Épicerie', unit: 'bouteille (250ml)', quantity: 250,
    prices: ALL_PRICES_DEFAULT(2.00, 3.00, 3.00),
    availability: { ...ALL_AVAIL }, tags: [],
  },
  {
    name: 'croûtons', category: 'Épicerie', unit: 'sachet (100g)', quantity: 100,
    prices: ALL_PRICES_DEFAULT(1.00, 2.00, 2.00),
    availability: { ...ALL_AVAIL }, tags: [],
  },
  {
    name: 'edamame', category: 'Épicerie', unit: 'sachet (300g)', quantity: 300,
    prices: ALL_PRICES_DEFAULT(3.00, 4.00, 3.00),
    availability: { ...ALL_AVAIL, antilles: 'rare', mayotte: 'rare', wallis_futuna: 'rare' },
    alternatives: ['haricots verts', 'pois chiches'], tags: [],
  },
  {
    name: 'tofu ferme', category: 'Épicerie', unit: 'bloc (400g)', quantity: 400,
    prices: ALL_PRICES_DEFAULT(2.50, 4.00, 2.50),
    availability: { ...ALL_AVAIL, antilles: 'rare', mayotte: 'rare', wallis_futuna: 'rare' }, tags: ['tofu'],
  },
  {
    name: 'rougail (sauce)', category: 'Épicerie', unit: 'pot (200g)', quantity: 200,
    prices: { france: 4.00, antilles: 3.50, guyane: 4.00, reunion: 2.00, mayotte: 2.50, spm: 5.00, polynesie: 5.00, nouvelle_caledonie: 4.50, wallis_futuna: 5.00, usa: 5.00, other: 4.50 },
    availability: { ...ALL_AVAIL, reunion: 'common', mayotte: 'common', antilles: 'available', france: 'available', guyane: 'available' }, tags: [],
  },

  // ── FRUITS SECS & GRAINES ──
  {
    name: 'amandes', category: 'Fruits secs & Graines', unit: 'sachet (200g)', quantity: 200,
    prices: ALL_PRICES_DEFAULT(3.00, 4.50, 4.00),
    availability: { ...ALL_AVAIL }, tags: ['noix'],
  },
  {
    name: 'noix', category: 'Fruits secs & Graines', unit: 'sachet (200g)', quantity: 200,
    prices: ALL_PRICES_DEFAULT(3.50, 5.00, 4.50),
    availability: { ...ALL_AVAIL }, tags: ['noix'],
  },
  {
    name: 'beurre de cacahuète', category: 'Fruits secs & Graines', unit: 'pot (250g)', quantity: 250,
    prices: ALL_PRICES_DEFAULT(3.00, 4.50, 3.50),
    availability: { ...ALL_AVAIL }, tags: ['noix'],
  },
  {
    name: 'graines de chia', category: 'Fruits secs & Graines', unit: 'sachet (200g)', quantity: 200,
    prices: ALL_PRICES_DEFAULT(2.50, 4.00, 3.50),
    availability: { ...ALL_AVAIL, antilles: 'available', mayotte: 'rare', wallis_futuna: 'rare' }, tags: ['noix'],
  },
  {
    name: 'graines de lin', category: 'Fruits secs & Graines', unit: 'sachet (200g)', quantity: 200,
    prices: ALL_PRICES_DEFAULT(1.50, 3.00, 2.50),
    availability: { ...ALL_AVAIL }, tags: ['noix'],
  },
  {
    name: 'sésame', category: 'Fruits secs & Graines', unit: 'sachet (100g)', quantity: 100,
    prices: ALL_PRICES_DEFAULT(1.00, 2.00, 1.50),
    availability: { ...ALL_AVAIL }, tags: ['noix'],
  },
  {
    name: 'tahini', category: 'Fruits secs & Graines', unit: 'pot (250g)', quantity: 250,
    prices: ALL_PRICES_DEFAULT(3.00, 4.50, 4.00),
    availability: { ...ALL_AVAIL, antilles: 'available', mayotte: 'rare', wallis_futuna: 'rare' }, tags: ['noix'],
  },
  {
    name: 'raisins secs', category: 'Fruits secs & Graines', unit: 'sachet (200g)', quantity: 200,
    prices: ALL_PRICES_DEFAULT(1.50, 2.50, 2.50),
    availability: { ...ALL_AVAIL }, tags: ['noix', 'fruits'],
  },
  {
    name: 'noix de coco (râpée)', category: 'Fruits secs & Graines', unit: 'sachet (100g)', quantity: 100,
    prices: { france: 1.50, antilles: 1.00, guyane: 0.80, reunion: 1.00, mayotte: 0.80, spm: 2.00, polynesie: 0.50, nouvelle_caledonie: 0.80, wallis_futuna: 0.50, usa: 2.00, other: 1.80 },
    availability: { ...ALL_AVAIL }, tags: ['noix'],
  },
  {
    name: 'fruits secs (mélange)', category: 'Fruits secs & Graines', unit: 'sachet (200g)', quantity: 200,
    prices: ALL_PRICES_DEFAULT(3.00, 4.00, 4.00),
    availability: { ...ALL_AVAIL }, tags: ['noix', 'fruits'],
  },
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function findIngredientPrice(ingredientName: string, region: Region): IngredientPrice | null {
  const normalized = ingredientName.toLowerCase().trim();
  const pr = toPriceRegion(region);

  let found = INGREDIENT_PRICES.find(ip => ip.name.toLowerCase() === normalized);
  if (found) return found;

  found = INGREDIENT_PRICES.find(ip =>
    normalized.includes(ip.name.toLowerCase()) || ip.name.toLowerCase().includes(normalized)
  );
  if (found) return found;

  const words = normalized.split(/[\s,]+/).filter(w => w.length > 3);
  for (const word of words) {
    found = INGREDIENT_PRICES.find(ip => ip.name.toLowerCase().includes(word));
    if (found) return found;
  }

  return null;
}

export function estimatePrice(ingredientName: string, quantityG: number, region: Region): {
  price: number; unit: string; basePrice: number; availability: string; alternatives: string[];
} {
  const pr = toPriceRegion(region);
  const ingredient = findIngredientPrice(ingredientName, region);

  if (!ingredient) {
    const defaultPrice = region === 'usa' ? 2.50 : 2.00;
    return { price: Math.round(defaultPrice * (quantityG / 500) * 100) / 100, unit: 'estimé', basePrice: defaultPrice, availability: 'available', alternatives: [] };
  }

  const pricePerUnit = ingredient.prices[pr];
  const ratio = quantityG / ingredient.quantity;
  const estimatedPrice = Math.round(pricePerUnit * ratio * 100) / 100;

  return {
    price: Math.max(0.10, estimatedPrice),
    unit: ingredient.unit,
    basePrice: pricePerUnit,
    availability: ingredient.availability[pr],
    alternatives: ingredient.alternatives || [],
  };
}

export function getStoresForRegion(region: Region): StoreRecommendation[] {
  return STORES_BY_REGION[region] || STORES_BY_REGION.other;
}

export function checkAvailability(ingredientName: string, region: Region): 'common' | 'available' | 'rare' | 'unavailable' {
  const pr = toPriceRegion(region);
  const ingredient = findIngredientPrice(ingredientName, region);
  if (!ingredient) return 'available';
  return ingredient.availability[pr];
}

export function suggestCheaperAlternatives(ingredientName: string, region: Region): {
  original: { name: string; price: number }; alternatives: { name: string; price: number; savings: number }[];
} {
  const pr = toPriceRegion(region);
  const ingredient = findIngredientPrice(ingredientName, region);
  if (!ingredient || !ingredient.alternatives || ingredient.alternatives.length === 0) {
    return { original: { name: ingredientName, price: 0 }, alternatives: [] };
  }

  const originalPrice = ingredient.prices[pr];
  const alternatives = ingredient.alternatives
    .map(altName => {
      const alt = findIngredientPrice(altName, region);
      if (!alt) return null;
      const altPrice = alt.prices[pr];
      return { name: alt.name, price: altPrice, savings: Math.round((originalPrice - altPrice) * 100) / 100 };
    })
    .filter((a): a is NonNullable<typeof a> => a !== null && a.savings > 0)
    .sort((a, b) => b.savings - a.savings);

  return { original: { name: ingredient.name, price: originalPrice }, alternatives };
}
