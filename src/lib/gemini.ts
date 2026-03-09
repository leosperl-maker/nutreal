/**
 * Nutreal – Client Gemini
 * ────────────────────────
 * Les appels à l'API Gemini passent par le proxy Express (/api/gemini).
 * La clé API est gérée côté serveur (variable GEMINI_API_KEY sur Railway).
 * Elle n'est JAMAIS exposée dans le bundle frontend.
 */

export interface GeminiAnalysisResult {
  dishName: string;
  foods: {
    name: string;
    calories: number;
    protein_g: number;
    fat_g: number;
    carbs_g: number;
    fiber_g: number;
    quantity_g: number;
  }[];
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  totalFiber: number;
  nutritionalScore?: string;
  tip: string;
}

// ─── Proxy URL ────────────────────────────────────────────────────────────────
// En dev (Vite proxy), /api/gemini est redirigé vers http://localhost:3001
// En production (Railway), /api/gemini est servi par le même serveur Express
const PROXY_URL = '/api/gemini';

/** Construire le body de requête Gemini */
function makeRequestBody(parts: object[], config?: object) {
  return {
    contents: [{ parts }],
    generationConfig: {
      temperature: 0.2,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 8192,
      ...config,
    },
  };
}

/** Appel générique au proxy Gemini */
async function callGemini(body: object, model = 'gemini-2.5-flash'): Promise<string> {
  const res = await fetch(`${PROXY_URL}?model=${model}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Gemini proxy erreur ${res.status}: ${JSON.stringify(err)}`);
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!parts || parts.length === 0) throw new Error('Réponse Gemini vide');
  // gemini-2.5-flash peut renvoyer des parts thinking + réponse : on prend la dernière non-thinking
  const text = parts.filter((p: any) => p.text && !p.thought).pop()?.text
    || parts.filter((p: any) => p.text).pop()?.text;
  if (!text) throw new Error('Réponse Gemini vide');
  return text;
}

/** Nettoyer les éventuels backticks de markdown dans la réponse JSON */
function stripMarkdown(text: string): string {
  let s = text.trim();
  if (s.startsWith('```')) {
    s = s.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?\s*```$/, '').trim();
  }
  return s;
}

// ─── Analyse photo ────────────────────────────────────────────────────────────

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const ANALYZE_PROMPT = `Tu es un nutritionniste expert capable d'analyser tout type de cuisine mondiale.
Analyse cette photo de plat/repas et identifie TOUS les aliments visibles avec précision.
Tu maîtrises les cuisines du monde entier : française, italienne, japonaise, chinoise, indienne, mexicaine, libanaise, marocaine, thaïlandaise, américaine, grecque, espagnole, caribéenne, africaine, et toutes les autres.
Pour chaque aliment, estime les quantités en grammes et les valeurs nutritionnelles.
Retourne UNIQUEMENT un objet JSON valide sans backticks ni commentaires :
{"dishName":"Nom du plat","foods":[{"name":"Aliment","calories":150,"protein_g":10,"fat_g":5,"carbs_g":15,"fiber_g":2,"quantity_g":100}],"nutritionalScore":"good","tip":"Conseil nutritionnel utile en français"}`;

export async function analyzeWithGemini(imageFile: File): Promise<GeminiAnalysisResult | null> {
  try {
    const base64Image = await fileToBase64(imageFile);
    const body = makeRequestBody([
      { text: ANALYZE_PROMPT },
      { inline_data: { mime_type: imageFile.type || 'image/jpeg', data: base64Image } },
    ]);

    const text = await callGemini(body);
    const result: GeminiAnalysisResult = JSON.parse(stripMarkdown(text));

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
    console.error('[Nutreal] Erreur Gemini analyzeWithGemini:', error);
    if (error instanceof Error) throw error;
    throw new Error('Erreur inattendue lors de l\'analyse.');
  }
}

// ─── Plan repas ───────────────────────────────────────────────────────────────

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
  try {
    const prefs = profile.preferences.length > 0 ? profile.preferences.join(', ') : 'cuisine mondiale variée';
    const diet = profile.dietPreferences.length > 0 ? ` Restrictions alimentaires: ${profile.dietPreferences.join(', ')}.` : '';

    const prompt = `Tu es un nutritionniste expert maîtrisant toutes les cuisines du monde entier.
Génère un plan repas hebdomadaire VARIÉ et ÉQUILIBRÉ pour 7 jours. Chaque jour a 4 types de repas (breakfast, lunch, snack, dinner), chacun avec exactement 3 options différentes.
Budget calorique: ${profile.calories} kcal/j. Objectifs: Protéines ${profile.protein}g, Glucides ${profile.carbs}g, Lipides ${profile.fat}g.
Préférences culinaires: ${prefs}.${diet}
RÈGLES IMPORTANTES:
- Aucun plat ne doit se répéter dans le même type de repas sur la semaine
- Varie les cuisines chaque jour : française, italienne, japonaise, indienne, mexicaine, marocaine, thaïlandaise, grecque, libanaise, américaine, caribéenne, coréenne, espagnole, etc.
- Petit-déjeuners variés du monde : bol açaï, shakshuka, avocado toast, porridge, pancakes, granola, yaourt grec, smoothie bowl, crêpes, onigiri, pain perdu...
- Collations légères : fruits, yaourt, noix, houmous, edamame, galettes de riz
- Déjeuners/dîners du monde : ramen, curry tikka masala, paella, tagine, poke bowl, pâtes, buddha bowl, tacos, souvlaki, bibimbap, colombo, ceviche, risotto...
Retourne UNIQUEMENT ce tableau JSON valide (sans backticks, sans commentaires):
[{"dayName":"Lundi","slots":[{"type":"breakfast","options":[{"name":"Nom","ingredients":["ing1","ing2","ing3"],"calories":300,"protein_g":12,"fat_g":8,"carbs_g":45,"fiber_g":3},{"name":"Nom2","ingredients":["ing1","ing2"],"calories":280,"protein_g":10,"fat_g":7,"carbs_g":42,"fiber_g":2},{"name":"Nom3","ingredients":["ing1","ing2"],"calories":320,"protein_g":14,"fat_g":9,"carbs_g":48,"fiber_g":4}]},{"type":"lunch","options":[...]},{"type":"snack","options":[...]},{"type":"dinner","options":[...]}]},{"dayName":"Mardi",...},{"dayName":"Mercredi",...},{"dayName":"Jeudi",...},{"dayName":"Vendredi",...},{"dayName":"Samedi",...},{"dayName":"Dimanche",...}]`;

    const body = makeRequestBody([{ text: prompt }], {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 8192,
    });

    const text = await callGemini(body);
    const result: MealPlanDayRaw[] = JSON.parse(stripMarkdown(text));

    if (!Array.isArray(result) || result.length !== 7) {
      throw new Error('Structure de plan invalide (doit être un tableau de 7 jours)');
    }

    return result;
  } catch (error) {
    console.error('[Nutreal] Erreur génération plan repas Gemini:', error);
    return null;
  }
}


// ─── Génération de recette ────────────────────────────────────────────────────

export interface RecipeResult {
  title: string;
  servings: number;
  prepTime: string;
  cookTime: string;
  difficulty: string;
  ingredients: { quantity: string; item: string }[];
  steps: string[];
  tips: string;
  nutritionalNote: string;
}

export async function generateRecipeWithGemini(
  dishName: string,
  ingredients: string[]
): Promise<RecipeResult | null> {
  try {
    const prompt = `Tu es un chef cuisinier expert international. Génère une recette détaillée et réalisable pour "${dishName}".
Ingrédients principaux disponibles : ${ingredients.join(', ')}.
Retourne UNIQUEMENT un objet JSON valide (sans backticks, sans commentaires) :
{"title":"${dishName}","servings":2,"prepTime":"15 min","cookTime":"25 min","difficulty":"Facile","ingredients":[{"quantity":"200g","item":"nom ingrédient"},{"quantity":"1","item":"autre ingrédient"}],"steps":["Étape détaillée 1.","Étape détaillée 2.","Étape détaillée 3.","Étape détaillée 4."],"tips":"Conseil du chef pour sublimer le plat.","nutritionalNote":"Note sur les apports nutritionnels."}`;

    const body = makeRequestBody([{ text: prompt }], {
      temperature: 0.7,
      maxOutputTokens: 2048,
    });

    const text = await callGemini(body);
    const result: RecipeResult = JSON.parse(stripMarkdown(text));
    return result;
  } catch (error) {
    console.error('[Nutreal] Erreur génération recette:', error);
    return null;
  }
}

// ─── Utilitaires ──────────────────────────────────────────────────────────────

export async function isGeminiConfigured(): Promise<boolean> {
  try {
    const res = await fetch('/api/gemini/health');
    if (!res.ok) return false;
    const data = await res.json();
    return data.configured === true;
  } catch {
    return false;
  }
}

export function isGeminiConfiguredSync(): boolean {
  return true;
}
