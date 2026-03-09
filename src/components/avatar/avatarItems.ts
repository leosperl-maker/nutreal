// ── Avatar Items Catalogue ──
// ~50 items across categories: hairstyles, outfits, accessories, pets, colors

export type AvatarItemType = 'hairstyle' | 'outfit' | 'accessory' | 'pet';

export interface AvatarItem {
  id: string;
  name: string;
  emoji: string;
  type: AvatarItemType;
  requiredLevel: number; // 0 = free/default
  isPremium: boolean; // future paid items
  category?: string; // subcategory for filtering
}

// ── Hairstyles (10) ──
export const HAIRSTYLES: AvatarItem[] = [
  { id: 'hair_short', name: 'Court classique', emoji: 'personGettingHaircut', type: 'hairstyle', requiredLevel: 0, isPremium: false },
  { id: 'hair_medium', name: 'Mi-long', emoji: 'personGettingHaircut', type: 'hairstyle', requiredLevel: 0, isPremium: false },
  { id: 'hair_long', name: 'Long lisse', emoji: 'personGettingHaircut', type: 'hairstyle', requiredLevel: 0, isPremium: false },
  { id: 'hair_curly', name: 'Bouclé', emoji: 'personGettingHaircut', type: 'hairstyle', requiredLevel: 2, isPremium: false },
  { id: 'hair_afro', name: 'Afro', emoji: 'personGettingHaircut', type: 'hairstyle', requiredLevel: 3, isPremium: false },
  { id: 'hair_braids', name: 'Tresses', emoji: 'personGettingHaircut', type: 'hairstyle', requiredLevel: 5, isPremium: false },
  { id: 'hair_mohawk', name: 'Mohawk', emoji: 'personGettingHaircut', type: 'hairstyle', requiredLevel: 7, isPremium: false },
  { id: 'hair_bun', name: 'Chignon', emoji: 'personGettingHaircut', type: 'hairstyle', requiredLevel: 8, isPremium: false },
  { id: 'hair_dreads', name: 'Dreadlocks', emoji: 'personGettingHaircut', type: 'hairstyle', requiredLevel: 10, isPremium: false },
  { id: 'hair_crown', name: 'Couronne tressée', emoji: 'crown', type: 'hairstyle', requiredLevel: 15, isPremium: false },
];

// ── Outfits (10) ──
export const OUTFITS: AvatarItem[] = [
  { id: 'outfit_tshirt', name: 'T-shirt', emoji: 'tShirt', type: 'outfit', requiredLevel: 0, isPremium: false },
  { id: 'outfit_sport', name: 'Tenue sport', emoji: 'personRunning', type: 'outfit', requiredLevel: 0, isPremium: false },
  { id: 'outfit_casual', name: 'Casual chic', emoji: 'necktie', type: 'outfit', requiredLevel: 0, isPremium: false },
  { id: 'outfit_hoodie', name: 'Hoodie', emoji: 'coat', type: 'outfit', requiredLevel: 3, isPremium: false },
  { id: 'outfit_jacket', name: 'Veste en jean', emoji: 'coat', type: 'outfit', requiredLevel: 4, isPremium: false },
  { id: 'outfit_dress', name: 'Robe élégante', emoji: 'dress', type: 'outfit', requiredLevel: 6, isPremium: false },
  { id: 'outfit_suit', name: 'Costume', emoji: 'personInTuxedo', type: 'outfit', requiredLevel: 8, isPremium: false },
  { id: 'outfit_gym', name: 'Tenue gym pro', emoji: 'flexedBiceps', type: 'outfit', requiredLevel: 10, isPremium: false },
  { id: 'outfit_royal', name: 'Tenue royale', emoji: 'crown', type: 'outfit', requiredLevel: 13, isPremium: false },
  { id: 'outfit_legend', name: 'Armure légendaire', emoji: 'crossedSwords', type: 'outfit', requiredLevel: 15, isPremium: true },
];

// ── Accessories (12) ──
export const ACCESSORIES: AvatarItem[] = [
  { id: 'acc_none', name: 'Aucun', emoji: 'sparkles', type: 'accessory', requiredLevel: 0, isPremium: false },
  { id: 'acc_glasses', name: 'Lunettes', emoji: 'glasses', type: 'accessory', requiredLevel: 0, isPremium: false },
  { id: 'acc_sunglasses', name: 'Lunettes de soleil', emoji: 'sunglasses', type: 'accessory', requiredLevel: 2, isPremium: false },
  { id: 'acc_cap', name: 'Casquette', emoji: 'billedCap', type: 'accessory', requiredLevel: 3, isPremium: false },
  { id: 'acc_watch', name: 'Montre sport', emoji: 'watch', type: 'accessory', requiredLevel: 4, isPremium: false },
  { id: 'acc_bracelet', name: 'Bracelet', emoji: 'prayerBeads', type: 'accessory', requiredLevel: 5, isPremium: false },
  { id: 'acc_headband', name: 'Bandana', emoji: 'ribbon', type: 'accessory', requiredLevel: 6, isPremium: false },
  { id: 'acc_earbuds', name: 'Écouteurs', emoji: 'headphone', type: 'accessory', requiredLevel: 7, isPremium: false },
  { id: 'acc_necklace', name: 'Collier', emoji: 'prayerBeads', type: 'accessory', requiredLevel: 8, isPremium: false },
  { id: 'acc_backpack', name: 'Sac à dos', emoji: 'backpack', type: 'accessory', requiredLevel: 9, isPremium: false },
  { id: 'acc_smartwatch', name: 'Montre connectée', emoji: 'watch', type: 'accessory', requiredLevel: 11, isPremium: false },
  { id: 'acc_crown', name: 'Couronne dorée', emoji: 'crown', type: 'accessory', requiredLevel: 15, isPremium: true },
];

// ── Pets (5) ──
export const PETS: AvatarItem[] = [
  { id: 'pet_none', name: 'Aucun', emoji: 'sparkles', type: 'pet', requiredLevel: 0, isPremium: false },
  { id: 'pet_cat', name: 'Chat', emoji: 'catFace', type: 'pet', requiredLevel: 10, isPremium: false },
  { id: 'pet_dog', name: 'Chien', emoji: 'dogFace', type: 'pet', requiredLevel: 11, isPremium: false },
  { id: 'pet_parrot', name: 'Perroquet', emoji: 'parrot', type: 'pet', requiredLevel: 12, isPremium: false },
  { id: 'pet_rabbit', name: 'Lapin', emoji: 'rabbitFace', type: 'pet', requiredLevel: 13, isPremium: false },
  { id: 'pet_hamster', name: 'Hamster', emoji: 'hamster', type: 'pet', requiredLevel: 15, isPremium: false },
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

export const OUTFIT_COLORS = [
  { id: 'oc_black', name: 'Noir', value: '#1A1A1A' },
  { id: 'oc_white', name: 'Blanc', value: '#F5F5F5' },
  { id: 'oc_navy', name: 'Marine', value: '#1E3A5F' },
  { id: 'oc_red', name: 'Rouge', value: '#DC2626' },
  { id: 'oc_green', name: 'Vert', value: '#16A34A' },
  { id: 'oc_blue', name: 'Bleu', value: '#3B82F6' },
  { id: 'oc_purple', name: 'Violet', value: '#7C3AED' },
  { id: 'oc_pink', name: 'Rose', value: '#EC4899' },
  { id: 'oc_orange', name: 'Orange', value: '#EA580C' },
  { id: 'oc_teal', name: 'Sarcelle', value: '#0D9488' },
];

// ── All wearable items combined ──
export const ALL_ITEMS: AvatarItem[] = [...HAIRSTYLES, ...OUTFITS, ...ACCESSORIES, ...PETS];

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
  if (item.isPremium) return purchasedItems.includes(itemId);
  return level >= item.requiredLevel;
}

// ── Default avatar config ──
export const DEFAULT_AVATAR_CONFIG = {
  skinColor: '#E8B89D',
  hairColor: '#4A2912',
  hairStyle: 'hair_short',
  eyeColor: '#5C3317',
  outfit: 'outfit_tshirt',
  outfitColor: '#3B82F6',
  accessory: null as string | null,
  pet: null as string | null,
  unlockedItems: ['hair_short', 'hair_medium', 'hair_long', 'outfit_tshirt', 'outfit_sport', 'outfit_casual', 'acc_none', 'acc_glasses', 'pet_none'],
  avatarUrl: null,
};
