export interface Additive {
  code: string;
  name: string;
  risk: 'high' | 'moderate' | 'low';
  description: string;
}

export const RISKY_ADDITIVES: Record<string, Additive> = {
  'e102': { code: 'E102', name: 'Tartrazine', risk: 'high', description: 'Colorant jaune synthétique. Peut provoquer des réactions allergiques, de l\'hyperactivité chez les enfants et de l\'urticaire.' },
  'e104': { code: 'E104', name: 'Jaune de quinoléine', risk: 'moderate', description: 'Colorant jaune synthétique. Risque modéré de réactions allergiques.' },
  'e110': { code: 'E110', name: 'Jaune orangé S', risk: 'high', description: 'Colorant azoïque. Lié à l\'hyperactivité chez les enfants et aux réactions allergiques.' },
  'e120': { code: 'E120', name: 'Cochenille / Acide carminique', risk: 'moderate', description: 'Colorant rouge naturel extrait d\'insectes. Peut provoquer des réactions allergiques.' },
  'e122': { code: 'E122', name: 'Azorubine', risk: 'high', description: 'Colorant rouge azoïque. Suspecté de provoquer hyperactivité et allergies.' },
  'e124': { code: 'E124', name: 'Ponceau 4R', risk: 'high', description: 'Colorant rouge azoïque. Lié à l\'hyperactivité et aux réactions allergiques.' },
  'e129': { code: 'E129', name: 'Rouge allura AC', risk: 'high', description: 'Colorant rouge synthétique. Suspecté de provoquer hyperactivité chez les enfants.' },
  'e131': { code: 'E131', name: 'Bleu patenté V', risk: 'moderate', description: 'Colorant bleu synthétique. Risque modéré de réactions allergiques.' },
  'e132': { code: 'E132', name: 'Indigotine', risk: 'low', description: 'Colorant bleu synthétique. Risque faible mais peut provoquer des nausées chez certaines personnes.' },
  'e133': { code: 'E133', name: 'Bleu brillant FCF', risk: 'moderate', description: 'Colorant bleu synthétique. Risque modéré, interdit dans certains pays.' },
  'e150c': { code: 'E150c', name: 'Caramel ammoniacal', risk: 'moderate', description: 'Colorant brun. Contient du 4-MEI, potentiellement cancérigène à haute dose.' },
  'e150d': { code: 'E150d', name: 'Caramel au sulfite d\'ammonium', risk: 'moderate', description: 'Colorant brun. Contient du 4-MEI, classé comme possiblement cancérigène.' },
  'e171': { code: 'E171', name: 'Dioxyde de titane', risk: 'high', description: 'Colorant blanc. Interdit en France depuis 2020 dans l\'alimentation. Nanoparticules potentiellement génotoxiques.' },
  'e211': { code: 'E211', name: 'Benzoate de sodium', risk: 'high', description: 'Conservateur. Peut former du benzène (cancérigène) en présence de vitamine C. Lié à l\'hyperactivité.' },
  'e220': { code: 'E220', name: 'Dioxyde de soufre', risk: 'moderate', description: 'Conservateur. Peut provoquer des crises d\'asthme et des réactions allergiques chez les personnes sensibles.' },
  'e250': { code: 'E250', name: 'Nitrite de sodium', risk: 'high', description: 'Conservateur dans les charcuteries. Forme des nitrosamines cancérigènes. Lié au cancer colorectal.' },
  'e251': { code: 'E251', name: 'Nitrate de sodium', risk: 'high', description: 'Conservateur. Se transforme en nitrites dans l\'organisme. Risque de formation de nitrosamines cancérigènes.' },
  'e320': { code: 'E320', name: 'BHA (Butylhydroxyanisole)', risk: 'high', description: 'Antioxydant synthétique. Classé comme possiblement cancérigène par le CIRC. Perturbateur endocrinien suspecté.' },
  'e321': { code: 'E321', name: 'BHT (Butylhydroxytoluène)', risk: 'moderate', description: 'Antioxydant synthétique. Effets controversés sur la santé. Perturbateur endocrinien suspecté.' },
  'e338': { code: 'E338', name: 'Acide phosphorique', risk: 'moderate', description: 'Acidifiant. Présent dans les sodas. Peut affecter l\'absorption du calcium et la santé osseuse.' },
  'e407': { code: 'E407', name: 'Carraghénanes', risk: 'moderate', description: 'Épaississant. Peut provoquer des inflammations intestinales et des troubles digestifs.' },
  'e420': { code: 'E420', name: 'Sorbitol', risk: 'low', description: 'Édulcorant. Peut provoquer des troubles digestifs (ballonnements, diarrhée) en grande quantité.' },
  'e450': { code: 'E450', name: 'Diphosphates', risk: 'moderate', description: 'Émulsifiant. Un excès de phosphates peut perturber l\'équilibre calcium-phosphore et affecter les reins.' },
  'e451': { code: 'E451', name: 'Triphosphates', risk: 'moderate', description: 'Émulsifiant. Mêmes risques que les diphosphates sur l\'équilibre minéral.' },
  'e466': { code: 'E466', name: 'Carboxyméthylcellulose', risk: 'moderate', description: 'Épaississant. Des études récentes suggèrent un impact sur le microbiote intestinal et l\'inflammation.' },
  'e621': { code: 'E621', name: 'Glutamate monosodique', risk: 'moderate', description: 'Exhausteur de goût. Peut provoquer le "syndrome du restaurant chinois" chez les personnes sensibles.' },
  'e627': { code: 'E627', name: 'Guanylate disodique', risk: 'low', description: 'Exhausteur de goût. Généralement bien toléré mais déconseillé aux personnes souffrant de goutte.' },
  'e631': { code: 'E631', name: 'Inosinate disodique', risk: 'low', description: 'Exhausteur de goût. Déconseillé aux personnes souffrant de goutte ou d\'hyperuricémie.' },
  'e950': { code: 'E950', name: 'Acésulfame K', risk: 'moderate', description: 'Édulcorant artificiel. Études contradictoires sur ses effets. Possible perturbateur du microbiote.' },
  'e951': { code: 'E951', name: 'Aspartame', risk: 'high', description: 'Édulcorant artificiel. Classé comme possiblement cancérigène par le CIRC en 2023. Controversé.' },
  'e952': { code: 'E952', name: 'Cyclamate', risk: 'high', description: 'Édulcorant artificiel. Interdit aux USA. Suspecté d\'être cancérigène.' },
  'e955': { code: 'E955', name: 'Sucralose', risk: 'moderate', description: 'Édulcorant artificiel. Des études récentes suggèrent un impact sur le microbiote et la glycémie.' },
  'e960': { code: 'E960', name: 'Glycosides de stéviol', risk: 'low', description: 'Édulcorant naturel extrait de la stévia. Généralement considéré comme sûr.' },
  'e1442': { code: 'E1442', name: 'Amidon modifié', risk: 'low', description: 'Épaississant. Généralement bien toléré mais issu de procédés chimiques.' },
};

export function getAdditiveRisk(code: string): Additive | null {
  const normalized = code.toLowerCase().replace(/[\s-]/g, '');
  return RISKY_ADDITIVES[normalized] || null;
}

export function calculateProductScore(
  nutriscoreGrade: string | null,
  additives: string[],
  novaGroup: number | null,
  nutrients: {
    calories?: number;
    sugar?: number;
    salt?: number;
    saturatedFat?: number;
    fiber?: number;
    protein?: number;
  }
): number {
  let score = 50;

  // Nutri-Score contribution (max 20 points)
  const nutriscorePoints: Record<string, number> = { a: 20, b: 15, c: 10, d: 5, e: 0 };
  if (nutriscoreGrade) {
    score += (nutriscorePoints[nutriscoreGrade.toLowerCase()] || 0) - 10;
  }

  // NOVA group contribution
  if (novaGroup) {
    const novaPoints: Record<number, number> = { 1: 15, 2: 8, 3: 0, 4: -15 };
    score += novaPoints[novaGroup] || 0;
  }

  // Additives penalty
  let riskyCount = 0;
  additives.forEach(additive => {
    const info = getAdditiveRisk(additive);
    if (info) {
      if (info.risk === 'high') { score -= 12; riskyCount++; }
      else if (info.risk === 'moderate') { score -= 6; riskyCount++; }
      else { score -= 2; }
    }
  });

  // Nutrient bonuses/penalties
  if (nutrients.sugar !== undefined) {
    if (nutrients.sugar > 20) score -= 10;
    else if (nutrients.sugar > 10) score -= 5;
    else if (nutrients.sugar < 5) score += 5;
  }

  if (nutrients.salt !== undefined) {
    if (nutrients.salt > 1.5) score -= 8;
    else if (nutrients.salt > 0.8) score -= 4;
  }

  if (nutrients.saturatedFat !== undefined) {
    if (nutrients.saturatedFat > 5) score -= 8;
    else if (nutrients.saturatedFat > 2) score -= 4;
  }

  if (nutrients.fiber !== undefined) {
    if (nutrients.fiber > 5) score += 10;
    else if (nutrients.fiber > 3) score += 5;
  }

  if (nutrients.protein !== undefined) {
    if (nutrients.protein > 10) score += 5;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 75) return { label: 'Excellent', color: '#4CAF50' };
  if (score >= 50) return { label: 'Bon', color: '#8BC34A' };
  if (score >= 25) return { label: 'Médiocre', color: '#FF9800' };
  return { label: 'Mauvais', color: '#F44336' };
}
