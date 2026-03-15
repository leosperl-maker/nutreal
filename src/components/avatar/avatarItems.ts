// ── Avatar Items Catalogue ──
// Modular slot-based system: top, outerwear, bottom, shoes, accessories (multi)

export type AvatarItemType = 'hairstyle' | 'top' | 'outerwear' | 'bottom' | 'shoes' | 'accessory' | 'pet';

export interface AvatarItem {
  id: string;
  name: string;
  emoji: string;
  type: AvatarItemType;
  requiredLevel: number; // 0 = free/default
  isPremium: boolean; // legendary shop-only items
  price: number; // coin price (0 = free with level)
  category?: string; // subcategory for filtering
  cameraTarget?: 'head' | 'body' | 'feet'; // for 3D preview framing
}

// ── GLB Model Mapping (ithappy Creative Characters FREE pack) ──
// Maps avatar item IDs to mesh node names inside base.glb

export const ALL_CHARACTER_MESHES = [
  'Body_010', 'Clown_nose_001', 'Costume_10_001', 'Costume_6_001',
  'Glasses_004', 'Glasses_006', 'Gloves_006', 'Gloves_014',
  'Hairstyle_male_010', 'Hairstyle_male_012',
  'Hat_010', 'Hat_049', 'Hat_057', 'Headphones_002',
  'Male_emotion_angry_003', 'Male_emotion_happy_002', 'Male_emotion_usual_001',
  'Moustache_001', 'Moustache_002',
  'Outerwear_029', 'Outerwear_036', 'Pacifier_001',
  'Pants_010', 'Pants_014',
  'Shoe_Slippers_002', 'Shoe_Slippers_005', 'Shoe_Sneakers_009',
  'Shorts_003', 'Socks_008', 'T_Shirt_009',
];

export const ALWAYS_VISIBLE_MESHES = ['Body_010', 'Male_emotion_usual_001'];

// ── Individual item → mesh mapping ──
export const GLB_MESH_MAP: Record<string, string[]> = {
  // Hairstyles
  hair_short: ['Hairstyle_male_010'],
  hair_medium: ['Hairstyle_male_012'],

  // Tops
  top_tshirt: ['T_Shirt_009'],

  // Outerwear (optional layer over top)
  ow_none: [],
  ow_pullover: ['Outerwear_029'],
  ow_jacket: ['Outerwear_036'],
  ow_costume1: ['Costume_10_001'],
  ow_costume2: ['Costume_6_001'],

  // Bottoms
  bot_pants: ['Pants_010'],
  bot_pants2: ['Pants_014'],
  bot_shorts: ['Shorts_003'],

  // Shoes
  shoes_sneakers: ['Shoe_Sneakers_009', 'Socks_008'],
  shoes_slippers: ['Shoe_Slippers_002'],
  shoes_slippers2: ['Shoe_Slippers_005'],

  // Accessories (individual, can be combined)
  acc_none: [],
  acc_glasses: ['Glasses_004'],
  acc_sunglasses: ['Glasses_006'],
  acc_cap: ['Hat_010'],
  acc_hat: ['Hat_049'],
  acc_bandana: ['Hat_057'],
  acc_headphones: ['Headphones_002'],
  acc_gloves: ['Gloves_006'],
  acc_gloves_sport: ['Gloves_014'],
  acc_moustache: ['Moustache_001'],
  acc_moustache2: ['Moustache_002'],
  acc_clownnose: ['Clown_nose_001'],
  acc_pacifier: ['Pacifier_001'],
};

// ── Accessory conflict groups (only one item per group) ──
export const ACCESSORY_CONFLICT_GROUPS: string[][] = [
  ['acc_cap', 'acc_hat', 'acc_bandana'],        // 1 hat
  ['acc_glasses', 'acc_sunglasses'],              // 1 pair of glasses
  ['acc_moustache', 'acc_moustache2'],            // 1 moustache
  ['acc_gloves', 'acc_gloves_sport'],             // 1 glove type
  ['acc_clownnose', 'acc_pacifier'],              // 1 mouth/nose item
];

/** Remove conflicting accessories when adding a new one */
export function resolveAccessoryConflicts(current: string[], adding: string): string[] {
  const group = ACCESSORY_CONFLICT_GROUPS.find(g => g.includes(adding));
  if (!group) return [...current, adding];
  const filtered = current.filter(id => !group.includes(id));
  return [...filtered, adding];
}

export const PET_GLB_MAP: Record<string, string> = {
  pet_cat: '/models/animals/kitty_001.glb',
  pet_dog: '/models/animals/dog_001.glb',
  pet_chicken: '/models/animals/chicken_001.glb',
  pet_deer: '/models/animals/deer_001.glb',
  pet_horse: '/models/animals/horse_001.glb',
  pet_penguin: '/models/animals/pinguin_001.glb',
  pet_tiger: '/models/animals/tiger_001.glb',
};

// ── Hairstyles (2 GLB) ──
export const HAIRSTYLES: AvatarItem[] = [
  { id: 'hair_short', name: 'Coupe courte', emoji: 'personGettingHaircut', type: 'hairstyle', requiredLevel: 0, isPremium: false, price: 0, cameraTarget: 'head' },
  { id: 'hair_medium', name: 'Cheveux longs', emoji: 'personGettingHaircut', type: 'hairstyle', requiredLevel: 0, isPremium: false, price: 0, cameraTarget: 'head' },
];

// ── Tops (1 GLB) ──
export const TOPS: AvatarItem[] = [
  { id: 'top_tshirt', name: 'T-shirt', emoji: 'tShirt', type: 'top', requiredLevel: 0, isPremium: false, price: 0, cameraTarget: 'body' },
];

// ── Outerwear (4 GLB) ──
export const OUTERWEAR: AvatarItem[] = [
  { id: 'ow_none', name: 'Aucun', emoji: 'sparkles', type: 'outerwear', requiredLevel: 0, isPremium: false, price: 0 },
  { id: 'ow_pullover', name: 'Pull', emoji: 'coat', type: 'outerwear', requiredLevel: 3, isPremium: false, price: 200, cameraTarget: 'body' },
  { id: 'ow_jacket', name: 'Veste', emoji: 'coat', type: 'outerwear', requiredLevel: 5, isPremium: false, price: 500, cameraTarget: 'body' },
  { id: 'ow_costume1', name: 'Costume', emoji: 'personInTuxedo', type: 'outerwear', requiredLevel: 8, isPremium: false, price: 1000, cameraTarget: 'body' },
  { id: 'ow_costume2', name: 'Déguisement', emoji: 'dress', type: 'outerwear', requiredLevel: 10, isPremium: true, price: 2500, cameraTarget: 'body' },
];

// ── Bottoms (3 GLB) ──
export const BOTTOMS: AvatarItem[] = [
  { id: 'bot_pants', name: 'Jean', emoji: 'jeans', type: 'bottom', requiredLevel: 0, isPremium: false, price: 0, cameraTarget: 'feet' },
  { id: 'bot_pants2', name: 'Pantalon', emoji: 'jeans', type: 'bottom', requiredLevel: 2, isPremium: false, price: 200, cameraTarget: 'feet' },
  { id: 'bot_shorts', name: 'Short', emoji: 'shorts', type: 'bottom', requiredLevel: 0, isPremium: false, price: 0, cameraTarget: 'feet' },
];

// ── Shoes (3 GLB) ──
export const SHOES: AvatarItem[] = [
  { id: 'shoes_sneakers', name: 'Baskets', emoji: 'runningShoe', type: 'shoes', requiredLevel: 0, isPremium: false, price: 0, cameraTarget: 'feet' },
  { id: 'shoes_slippers', name: 'Mocassins', emoji: 'flatShoe', type: 'shoes', requiredLevel: 2, isPremium: false, price: 200, cameraTarget: 'feet' },
  { id: 'shoes_slippers2', name: 'Sandales', emoji: 'thongSandal', type: 'shoes', requiredLevel: 4, isPremium: false, price: 500, cameraTarget: 'feet' },
];

// ── Accessories (12 GLB) — can equip multiple simultaneously ──
export const ACCESSORIES: AvatarItem[] = [
  { id: 'acc_glasses', name: 'Lunettes', emoji: 'glasses', type: 'accessory', requiredLevel: 0, isPremium: false, price: 0, cameraTarget: 'head' },
  { id: 'acc_sunglasses', name: 'Lunettes de soleil', emoji: 'sunglasses', type: 'accessory', requiredLevel: 2, isPremium: false, price: 200, cameraTarget: 'head' },
  { id: 'acc_cap', name: 'Chapeau', emoji: 'billedCap', type: 'accessory', requiredLevel: 3, isPremium: false, price: 200, cameraTarget: 'head' },
  { id: 'acc_hat', name: 'Haut-de-forme', emoji: 'topHat', type: 'accessory', requiredLevel: 4, isPremium: false, price: 500, cameraTarget: 'head' },
  { id: 'acc_bandana', name: 'Bandana', emoji: 'ribbon', type: 'accessory', requiredLevel: 5, isPremium: false, price: 500, cameraTarget: 'head' },
  { id: 'acc_headphones', name: 'Casque audio', emoji: 'headphone', type: 'accessory', requiredLevel: 6, isPremium: false, price: 500, cameraTarget: 'head' },
  { id: 'acc_gloves', name: 'Gants', emoji: 'gloves', type: 'accessory', requiredLevel: 7, isPremium: false, price: 500, cameraTarget: 'body' },
  { id: 'acc_gloves_sport', name: 'Gants sport', emoji: 'gloves', type: 'accessory', requiredLevel: 8, isPremium: false, price: 1000, cameraTarget: 'body' },
  { id: 'acc_moustache', name: 'Moustache', emoji: 'disguisedFace', type: 'accessory', requiredLevel: 9, isPremium: false, price: 1000, cameraTarget: 'head' },
  { id: 'acc_moustache2', name: 'Grande moustache', emoji: 'disguisedFace', type: 'accessory', requiredLevel: 10, isPremium: false, price: 1000, cameraTarget: 'head' },
  { id: 'acc_clownnose', name: 'Nez de clown', emoji: 'clownFace', type: 'accessory', requiredLevel: 12, isPremium: false, price: 2500, cameraTarget: 'head' },
  { id: 'acc_pacifier', name: 'Tétine', emoji: 'baby', type: 'accessory', requiredLevel: 15, isPremium: true, price: 2500, cameraTarget: 'head' },
];

// ── Pets (8 GLB) ──
export const PETS: AvatarItem[] = [
  { id: 'pet_none', name: 'Aucun', emoji: 'sparkles', type: 'pet', requiredLevel: 0, isPremium: false, price: 0 },
  { id: 'pet_cat', name: 'Chat', emoji: 'catFace', type: 'pet', requiredLevel: 5, isPremium: false, price: 500 },
  { id: 'pet_dog', name: 'Chien', emoji: 'dogFace', type: 'pet', requiredLevel: 6, isPremium: false, price: 500 },
  { id: 'pet_chicken', name: 'Poule', emoji: 'chicken', type: 'pet', requiredLevel: 8, isPremium: false, price: 1000 },
  { id: 'pet_penguin', name: 'Pingouin', emoji: 'penguin', type: 'pet', requiredLevel: 9, isPremium: false, price: 1000 },
  { id: 'pet_deer', name: 'Cerf', emoji: 'deer', type: 'pet', requiredLevel: 10, isPremium: false, price: 1000 },
  { id: 'pet_horse', name: 'Cheval', emoji: 'horse', type: 'pet', requiredLevel: 12, isPremium: false, price: 2500 },
  { id: 'pet_tiger', name: 'Tigre', emoji: 'tiger', type: 'pet', requiredLevel: 15, isPremium: true, price: 2500 },
];

// ── Color palettes ──
export const SKIN_COLORS = [
  { id: 'skin_1', name: 'Clair', value: '#FDDBB4' },
  { id: 'skin_2', name: 'Pêche', value: '#E8B89D' },
  { id: 'skin_3', name: 'Moyen', value: '#C68642' },
  { id: 'skin_4', name: 'Doré', value: '#B07430' },
  { id: 'skin_5', name: 'Brun', value: '#8D5524' },
  { id: 'skin_6', name: 'Foncé', value: '#6B3A20' },
  { id: 'skin_7', name: 'Ébène', value: '#3C2415' },
];

export const HAIR_COLORS = [
  { id: 'hc_black', name: 'Noir', value: '#1A1A1A' },
  { id: 'hc_brown', name: 'Brun', value: '#4A2912' },
  { id: 'hc_dark_brown', name: 'Châtain', value: '#6B3A2A' },
  { id: 'hc_auburn', name: 'Auburn', value: '#922B05' },
  { id: 'hc_red', name: 'Roux', value: '#C75000' },
  { id: 'hc_blonde', name: 'Blond', value: '#D4A937' },
  { id: 'hc_platinum', name: 'Platine', value: '#E8DCC8' },
  { id: 'hc_gray', name: 'Gris', value: '#9E9E9E' },
  { id: 'hc_blue', name: 'Bleu', value: '#3B82F6', requiredLevel: 5 },
  { id: 'hc_pink', name: 'Rose', value: '#EC4899', requiredLevel: 7 },
  { id: 'hc_green', name: 'Vert', value: '#22C55E', requiredLevel: 9 },
];

export const EYE_COLORS = [
  { id: 'eye_brown', name: 'Brun', value: '#5C3317' },
  { id: 'eye_hazel', name: 'Noisette', value: '#8B6914' },
  { id: 'eye_green', name: 'Vert', value: '#2E8B57' },
  { id: 'eye_blue', name: 'Bleu', value: '#4682B4' },
  { id: 'eye_gray', name: 'Gris', value: '#708090' },
  { id: 'eye_amber', name: 'Ambre', value: '#FFBF00' },
];

export const SLOT_COLORS = [
  { id: 'sc_white', name: 'Blanc', value: '#FFFFFF' },
  { id: 'sc_black', name: 'Noir', value: '#1A1A1A' },
  { id: 'sc_navy', name: 'Marine', value: '#1E3A5F' },
  { id: 'sc_red', name: 'Rouge', value: '#DC2626' },
  { id: 'sc_green', name: 'Vert', value: '#16A34A' },
  { id: 'sc_blue', name: 'Bleu', value: '#3B82F6' },
  { id: 'sc_purple', name: 'Violet', value: '#7C3AED' },
  { id: 'sc_pink', name: 'Rose', value: '#EC4899' },
  { id: 'sc_orange', name: 'Orange', value: '#EA580C' },
  { id: 'sc_teal', name: 'Sarcelle', value: '#0D9488' },
];

// ── All wearable items combined ──
export const ALL_ITEMS: AvatarItem[] = [...HAIRSTYLES, ...TOPS, ...OUTERWEAR, ...BOTTOMS, ...SHOES, ...ACCESSORIES, ...PETS];

// ── Rarity system ──
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface RarityInfo {
  name: string;
  nameShort: string;
  bgFrom: string;
  bgTo: string;
  border: string;
  glow: string;
  textColor: string;
}

export const RARITY_MAP: Record<Rarity, RarityInfo> = {
  common:    { name: 'Commun',      nameShort: 'C',  bgFrom: '#9CA3AF', bgTo: '#D1D5DB', border: '#9CA3AF', glow: '',                    textColor: '#6B7280' },
  uncommon:  { name: 'Peu commun',  nameShort: 'PC', bgFrom: '#22C55E', bgTo: '#86EFAC', border: '#22C55E', glow: 'rgba(34,197,94,0.25)', textColor: '#16A34A' },
  rare:      { name: 'Rare',        nameShort: 'R',  bgFrom: '#3B82F6', bgTo: '#93C5FD', border: '#3B82F6', glow: 'rgba(59,130,246,0.25)', textColor: '#2563EB' },
  epic:      { name: 'Epique',      nameShort: 'E',  bgFrom: '#8B5CF6', bgTo: '#C4B5FD', border: '#8B5CF6', glow: 'rgba(139,92,246,0.3)',  textColor: '#7C3AED' },
  legendary: { name: 'Legendaire',  nameShort: 'L',  bgFrom: '#F59E0B', bgTo: '#FDE68A', border: '#F59E0B', glow: 'rgba(245,158,11,0.35)', textColor: '#D97706' },
};

export function getItemRarity(item: AvatarItem): Rarity {
  if (item.isPremium || item.requiredLevel >= 15) return 'legendary';
  if (item.requiredLevel >= 8) return 'epic';
  if (item.requiredLevel >= 4) return 'rare';
  if (item.requiredLevel >= 2) return 'uncommon';
  return 'common';
}

// ── Helper: get items unlocked at a given level ──
export function getUnlockedItems(level: number): AvatarItem[] {
  return ALL_ITEMS.filter(item => item.requiredLevel <= level && !item.isPremium);
}

// ── Helper: get items newly unlocked at a specific level ──
export function getNewItemsAtLevel(level: number): AvatarItem[] {
  return ALL_ITEMS.filter(item => item.requiredLevel === level && !item.isPremium);
}

// ── Helper: check if an item is accessible ──
export function isItemUnlocked(itemId: string, level: number, purchasedItems: string[] = []): boolean {
  const item = ALL_ITEMS.find(i => i.id === itemId);
  if (!item) return false;
  if (purchasedItems.includes(itemId)) return true;
  if (item.isPremium) return false;
  return level >= item.requiredLevel;
}

// ── Helper: get item price for shop ──
export function getItemPrice(itemId: string): number {
  const item = ALL_ITEMS.find(i => i.id === itemId);
  return item?.price ?? 0;
}

// ── Default avatar config (multi-slot format) ──
export const DEFAULT_AVATAR_CONFIG = {
  skinColor: '#E8B89D',
  hairColor: '#4A2912',
  hairStyle: 'hair_short',
  eyeColor: '#5C3317',
  top: 'top_tshirt',
  outerwear: null as string | null,
  bottom: 'bot_pants',
  shoes: 'shoes_sneakers',
  topColor: '#FFFFFF',
  outerwearColor: '#FFFFFF',
  bottomColor: '#FFFFFF',
  shoesColor: '#FFFFFF',
  accessories: [] as string[],
  pet: null as string | null,
  unlockedItems: [
    'hair_short', 'hair_medium',
    'top_tshirt',
    'ow_none',
    'bot_pants', 'bot_shorts',
    'shoes_sneakers',
    'acc_glasses',
    'pet_none',
  ],
};
