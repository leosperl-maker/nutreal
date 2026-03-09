// Fluent Emoji 3D by Microsoft — CDN mapping
// https://github.com/microsoft/fluentui-emoji

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@latest/assets';

// Path patterns:
// Objects (no skin tone): {Name}/3D/{name}_3d.png
// People/body (skin tone): {Name}/Default/3D/{name}_3d_default.png

const FLUENT_MAP: Record<string, string> = {
  // ── Fire / Energy ──
  fire: 'Fire/3D/fire_3d.png',
  highVoltage: 'High voltage/3D/high_voltage_3d.png',
  sparkles: 'Sparkles/3D/sparkles_3d.png',
  star: 'Star/3D/star_3d.png',
  glowingStar: 'Glowing star/3D/glowing_star_3d.png',

  // ── Water / Nature ──
  droplet: 'Droplet/3D/droplet_3d.png',
  sweatDroplets: 'Sweat droplets/3D/sweat_droplets_3d.png',
  seedling: 'Seedling/3D/seedling_3d.png',
  cherryBlossom: 'Cherry blossom/3D/cherry_blossom_3d.png',

  // ── Food ──
  redApple: 'Red apple/3D/red_apple_3d.png',
  forkAndKnife: 'Fork and knife with plate/3D/fork_and_knife_with_plate_3d.png',
  egg: 'Egg/3D/egg_3d.png',
  cheeseWedge: 'Cheese wedge/3D/cheese_wedge_3d.png',
  cutOfMeat: 'Cut of meat/3D/cut_of_meat_3d.png',
  peanuts: 'Peanuts/3D/peanuts_3d.png',
  leafyGreen: 'Leafy green/3D/leafy_green_3d.png',
  sheafOfRice: 'Sheaf of rice/3D/sheaf_of_rice_3d.png',
  jar: 'Jar/3D/jar_3d.png',
  beverageBox: 'Beverage box/3D/beverage_box_3d.png',
  shoppingCart: 'Shopping cart/3D/shopping_cart_3d.png',

  // ── Time / Sky ──
  sunrise: 'Sunrise/3D/sunrise_3d.png',
  sunWithFace: 'Sun with face/3D/sun_with_face_3d.png',
  sun: 'Sun/3D/sun_3d.png',
  crescentMoon: 'Crescent moon/3D/crescent_moon_3d.png',
  calendar: 'Calendar/3D/calendar_3d.png',

  // ── Sport / Fitness ──
  personRunning: 'Person running/Default/3D/person_running_3d_default.png',
  personBiking: 'Person biking/Default/3D/person_biking_3d_default.png',
  personSwimming: 'Person swimming/Default/3D/person_swimming_3d_default.png',
  personInLotus: 'Person in lotus position/Default/3D/person_in_lotus_position_3d_default.png',
  personCartwheeling: 'Person cartwheeling/Default/3D/person_cartwheeling_3d_default.png',
  personWalking: 'Person walking/Default/3D/person_walking_3d_default.png',
  personLiftingWeights: 'Person lifting weights/Default/3D/person_lifting_weights_3d_default.png',
  womanDancing: 'Woman dancing/Default/3D/woman_dancing_3d_default.png',
  flexedBiceps: 'Flexed biceps/Default/3D/flexed_biceps_3d_default.png',
  leg: 'Leg/Default/3D/leg_3d_default.png',
  mechanicalLeg: 'Mechanical leg/3D/mechanical_leg_3d.png',
  skippingRope: 'Skipping rope/3D/skipping_rope_3d.png',

  // ── Health / Science ──
  brain: 'Brain/3D/brain_3d.png',
  bone: 'Bone/3D/bone_3d.png',
  pill: 'Pill/3D/pill_3d.png',
  microscope: 'Microscope/3D/microscope_3d.png',
  bullseye: 'Bullseye/3D/bullseye_3d.png',

  // ── Achievements / Gamification ──
  trophy: 'Trophy/3D/trophy_3d.png',
  firstPlace: '1st place medal/3D/1st_place_medal_3d.png',
  secondPlace: '2nd place medal/3D/2nd_place_medal_3d.png',
  thirdPlace: '3rd place medal/3D/3rd_place_medal_3d.png',
  sportsMedal: 'Sports medal/3D/sports_medal_3d.png',
  shield: 'Shield/3D/shield_3d.png',
  crown: 'Crown/3D/crown_3d.png',
  crossedSwords: 'Crossed swords/3D/crossed_swords_3d.png',

  // ── Faces / Moods ──
  slightlySmiling: 'Slightly smiling face/3D/slightly_smiling_face_3d.png',
  neutralFace: 'Neutral face/3D/neutral_face_3d.png',
  pensiveFace: 'Pensive face/3D/pensive_face_3d.png',
  cryingFace: 'Crying face/3D/crying_face_3d.png',
  starStruck: 'Star-struck/3D/star-struck_3d.png',

  // ── Charts / Arrows ──
  chartIncreasing: 'Chart increasing/3D/chart_increasing_3d.png',
  chartDecreasing: 'Chart decreasing/3D/chart_decreasing_3d.png',
  rightArrow: 'Right arrow/3D/right_arrow_3d.png',

  // ── Clothing / Accessories ──
  glasses: 'Glasses/3D/glasses_3d.png',
  sunglasses: 'Sunglasses/3D/sunglasses_3d.png',
  billedCap: 'Billed cap/3D/billed_cap_3d.png',
  watch: 'Watch/3D/watch_3d.png',
  backpack: 'Backpack/3D/backpack_3d.png',
  ribbon: 'Ribbon/3D/ribbon_3d.png',
  headphone: 'Headphone/3D/headphone_3d.png',
  prayerBeads: 'Prayer beads/3D/prayer_beads_3d.png',
  necktie: 'Necktie/3D/necktie_3d.png',
  tShirt: 'T-shirt/3D/t-shirt_3d.png',
  dress: 'Dress/3D/dress_3d.png',
  coat: 'Coat/3D/coat_3d.png',
  personInTuxedo: 'Person in tuxedo/Default/3D/person_in_tuxedo_3d_default.png',

  // ── People ──
  bustInSilhouette: 'Bust in silhouette/3D/bust_in_silhouette_3d.png',
  personGettingHaircut: 'Person getting haircut/Default/3D/person_getting_haircut_3d_default.png',

  // ── Animals ──
  catFace: 'Cat face/3D/cat_face_3d.png',
  dogFace: 'Dog face/3D/dog_face_3d.png',
  parrot: 'Parrot/3D/parrot_3d.png',
  rabbitFace: 'Rabbit face/3D/rabbit_face_3d.png',
  hamster: 'Hamster/3D/hamster_3d.png',

  // ── Misc ──
  artistPalette: 'Artist palette/3D/artist_palette_3d.png',
  eye: 'Eye/3D/eye_3d.png',
  books: 'Books/3D/books_3d.png',
  openBook: 'Open book/3D/open_book_3d.png',
  footprints: 'Footprints/3D/footprints_3d.png',
};

export type FluentEmojiName = keyof typeof FLUENT_MAP;

export function getFluentEmojiUrl(name: string): string {
  const path = FLUENT_MAP[name];
  if (!path) {
    console.warn(`[FluentEmoji] Unknown emoji: "${name}"`);
    return '';
  }
  return `${CDN_BASE}/${path}`;
}

export const FLUENT_EMOJI_NAMES = Object.keys(FLUENT_MAP) as FluentEmojiName[];
