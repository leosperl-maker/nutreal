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
