/**
 * Gemini 2.0 Flash API integration for food photo analysis.
 * Specialized for French Caribbean cuisine (Guadeloupe/Martinique).
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

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

function getApiKey(): string | null {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key || key === 'your_gemini_api_key_here' || key.trim() === '') {
    return null;
  }
  return key.trim();
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const CARIBBEAN_ANALYSIS_PROMPT = `Tu es un nutritionniste expert spécialisé dans la cuisine antillaise et caribéenne. Analyse cette photo de plat/repas prise aux Antilles françaises (Guadeloupe/Martinique).

Identifie TOUS les plats et aliments visibles, y compris les plats locaux caribéens tels que :
- Colombo (poulet, cabri, porc)
- Accras (morue, crevettes)
- Riz djon djon
- Gratin (christophine, banane, igname)
- Boudin créole (noir, blanc)
- Bokits
- Court-bouillon de poisson
- Fricassée de lambi/chatrou
- Dombrés
- Féroce d'avocat
- Poulet boucané
- Ti-nain morue (banane verte et morue)
- Matoutou de crabe
- Calalou
- Chiquetaille de morue
- Pâté en pot
- Trempage
- Blanc-manger coco
- Sorbet coco
- Dachine, igname, fruit à pain, banane plantain, patate douce, madère, christophine, giraumon

Retourne UNIQUEMENT un JSON valide (sans markdown, sans backticks, sans texte avant ou après) avec cette structure exacte :

{
  "dishName": "Nom du plat en français (nom créole si applicable)",
  "foods": [
    {
      "name": "Nom de l'aliment",
      "calories": 150,
      "protein_g": 10.5,
      "fat_g": 5.2,
      "carbs_g": 15.0,
      "fiber_g": 2.0,
      "quantity_g": 100
    }
  ],
  "totalCalories": 450,
  "totalProtein": 30.5,
  "totalFat": 15.2,
  "totalCarbs": 45.0,
  "totalFiber": 6.0,
  "nutritionalScore": "excellent",
  "tip": "Un conseil nutritionnel personnalisé en français sur ce repas (2-3 phrases max)"
}

Règles :
- Identifie TOUS les aliments visibles dans l'assiette
- Estime les quantités en grammes de manière réaliste
- Les valeurs nutritionnelles doivent être précises et basées sur des données nutritionnelles réelles
- Pour les plats créoles, utilise les valeurs nutritionnelles spécifiques (ex: colombo avec épices, lait de coco, etc.)
- Le nutritionalScore doit être "excellent", "good", "average" ou "poor"
- Le tip doit être un conseil utile et encourageant en français, adapté au contexte antillais
- Les totaux doivent être la somme des aliments individuels
- Retourne UNIQUEMENT le JSON, rien d'autre`;

export async function analyzeWithGemini(imageFile: File): Promise<GeminiAnalysisResult | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn('[NutriLens] Clé Gemini non configurée — utilisation du mode simulation');
    return null;
  }

  try {
    const base64Image = await fileToBase64(imageFile);
    const mimeType = imageFile.type || 'image/jpeg';

    const requestBody = {
      contents: [
        {
          parts: [
            { text: CARIBBEAN_ANALYSIS_PROMPT },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Image,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      },
    };

    console.info('[NutriLens] Envoi de la photo à Gemini 2.0 Flash...');

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[NutriLens] Erreur Gemini API:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      console.error('[NutriLens] Réponse Gemini vide');
      return null;
    }

    let cleanJson = textResponse.trim();
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    }

    const result: GeminiAnalysisResult = JSON.parse(cleanJson);

    if (!result.dishName || !Array.isArray(result.foods) || result.foods.length === 0) {
      console.error('[NutriLens] Structure de réponse Gemini invalide');
      return null;
    }

    // Recalculate totals
    result.totalCalories = result.foods.reduce((sum, f) => sum + f.calories, 0);
    result.totalProtein = Math.round(result.foods.reduce((sum, f) => sum + f.protein_g, 0) * 10) / 10;
    result.totalFat = Math.round(result.foods.reduce((sum, f) => sum + f.fat_g, 0) * 10) / 10;
    result.totalCarbs = Math.round(result.foods.reduce((sum, f) => sum + f.carbs_g, 0) * 10) / 10;
    result.totalFiber = Math.round(result.foods.reduce((sum, f) => sum + f.fiber_g, 0) * 10) / 10;

    console.info('[NutriLens] Analyse Gemini réussie:', result.dishName);
    return result;
  } catch (error) {
    console.error('[NutriLens] Erreur analyse Gemini:', error);
    return null;
  }
}

export function isGeminiConfigured(): boolean {
  return getApiKey() !== null;
}
