export interface GeminiAnalysisResult {
  dishName: string;
  foods: { name: string; calories: number; protein_g: number; fat_g: number; carbs_g: number; fiber_g: number; quantity_g: number; }[];
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  totalFiber: number;
  nutritionalScore?: string;
  tip: string;
}

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

function getApiKey(): string | null {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key || key === 'your_gemini_api_key_here' || key.trim() === '') return null;
  return key.trim();
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const PROMPT = `Tu es un nutritionniste expert spécialisé dans la cuisine antillaise et caribéenne.
Analyse cette photo de plat/repas. Identifie TOUS les aliments visibles.
Tu connais les plats locaux caribéens : Colombo, Accras, Boudin créole, Court-bouillon, Fricassée de lambi, Dombrés, Féroce d'avocat, Poulet boucané, Ti-nain morue, Matoutou, Rougail saucisse, Carry, Poisson cru au lait de coco, Bougna, Bokits, Chiquetaille, etc.
Retourne UNIQUEMENT un objet JSON valide sans backticks :
{"dishName":"Nom","foods":[{"name":"Aliment","calories":150,"protein_g":10,"fat_g":5,"carbs_g":15,"fiber_g":2,"quantity_g":100}],"nutritionalScore":"good","tip":"Conseil en français"}`;

export async function analyzeWithGemini(imageFile: File): Promise<GeminiAnalysisResult | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  try {
    const base64Image = await fileToBase64(imageFile);
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: PROMPT }, { inline_data: { mime_type: imageFile.type || 'image/jpeg', data: base64Image } }] }],
        generationConfig: { temperature: 0.2, topP: 0.8, topK: 40, maxOutputTokens: 2048 },
      }),
    });
    if (!response.ok) throw new Error(`Gemini API erreur ${response.status}`);
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Pas de réponse');
    let clean = text.trim();
    if (clean.startsWith('```')) clean = clean.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?\s*```$/, '').trim();
    const result: GeminiAnalysisResult = JSON.parse(clean);
    result.foods = result.foods.map((f, i) => ({
      name: f.name || `Aliment ${i + 1}`,
      calories: Math.round(Number(f.calories) || 0),
      protein_g: Math.round((Number(f.protein_g) || 0) * 10) / 10,
      fat_g: Math.round((Number(f.fat_g) || 0) * 10) / 10,
      carbs_g: Math.round((Number(f.carbs_g) || 0) * 10) / 10,
      fiber_g: Math.round((Number(f.fiber_g) || 0) * 10) / 10,
      quantity_g: Math.round(Number(f.quantity_g) || 100),
    }));
    result.totalCalories = result.foods.reduce((s, f) => s + f.calories, 0);
    result.totalProtein = Math.round(result.foods.reduce((s, f) => s + f.protein_g, 0) * 10) / 10;
    result.totalFat = Math.round(result.foods.reduce((s, f) => s + f.fat_g, 0) * 10) / 10;
    result.totalCarbs = Math.round(result.foods.reduce((s, f) => s + f.carbs_g, 0) * 10) / 10;
    result.totalFiber = Math.round(result.foods.reduce((s, f) => s + f.fiber_g, 0) * 10) / 10;
    if (!result.tip) result.tip = 'Analyse réalisée par Nutreal IA.';
    return result;
  } catch (error) {
    console.error('[Nutreal] Erreur Gemini:', error);
    if (error instanceof Error) throw error;
    throw new Error('Erreur inattendue.');
  }
}

export function isGeminiConfigured(): boolean { return getApiKey() !== null; }

export interface MealPlanDayRaw {
  dayName: string;
  slots: {
    type: 'breakfast' | 'lunch' | 'snack' | 'dinner';
    options: {
      name: string;
      ingredients: string[];
      calories: number;
      protein_g: number;
      fat_g: number;
      carbs_g: number;
      fiber_g: number;
    }[];
  }[];
}

export async function generateMealPlanWithGemini(profile: {
  location: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  preferences: string[];
  dietPreferences: string[];
}): Promise<MealPlanDayRaw[] | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const loc = profile.location || 'guadeloupe';
  const prefs = profile.preferences.length > 0 ? profile.preferences.join(', ') : 'cuisine créole antillaise';
  const diet = profile.dietPreferences.length > 0 ? ` Restrictions: ${profile.dietPreferences.join(', ')}.` : '';

  const prompt = `Tu es un nutritionniste expert spécialisé en cuisine antillaise et caribéenne (région: ${loc}).
Génère un plan repas hebdomadaire VARIÉ pour 7 jours. Chaque jour a 4 types de repas (breakfast, lunch, snack, dinner), chacun avec exactement 3 options différentes.
Budget calorique: ${profile.calories} kcal/j. Objectifs: Protéines ${profile.protein}g, Glucides ${profile.carbs}g, Lipides ${profile.fat}g.
Préférences: ${prefs}.${diet}
RÈGLES IMPORTANTES:
- Aucun plat ne doit se répéter dans le même type de repas sur la semaine
- Privilégie les ingrédients locaux caribéens et antillais
- Petit-déjeuners variés: céréales, fruits tropicaux, œufs, pain créole, smoothies, yaourts
- Collations légères: fruits, yaourt, noix, smoothie
- Déjeuners/dîners: plats créoles variés (Colombo, court-bouillon, fricassée, rougail, carry, dombrés, féroce...)
Retourne UNIQUEMENT ce tableau JSON valide (sans backticks, sans commentaires):
[{"dayName":"Lundi","slots":[{"type":"breakfast","options":[{"name":"Nom","ingredients":["ing1","ing2","ing3"],"calories":300,"protein_g":12,"fat_g":8,"carbs_g":45,"fiber_g":3},{"name":"Nom2","ingredients":["ing1","ing2"],"calories":280,"protein_g":10,"fat_g":7,"carbs_g":42,"fiber_g":2},{"name":"Nom3","ingredients":["ing1","ing2"],"calories":320,"protein_g":14,"fat_g":9,"carbs_g":48,"fiber_g":4}]},{"type":"lunch","options":[...]},{"type":"snack","options":[...]},{"type":"dinner","options":[...]}]},{"dayName":"Mardi",...},{"dayName":"Mercredi",...},{"dayName":"Jeudi",...},{"dayName":"Vendredi",...},{"dayName":"Samedi",...},{"dayName":"Dimanche",...}]`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, topP: 0.9, topK: 40, maxOutputTokens: 8192 },
      }),
    });
    if (!response.ok) throw new Error(`Gemini API error ${response.status}`);
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No response');
    let clean = text.trim();
    if (clean.startsWith('```')) clean = clean.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?\s*```$/, '').trim();
    const result: MealPlanDayRaw[] = JSON.parse(clean);
    if (!Array.isArray(result) || result.length !== 7) throw new Error('Invalid plan structure');
    return result;
  } catch (error) {
    console.error('[Nutreal] Erreur génération plan repas Gemini:', error);
    return null;
  }
}
