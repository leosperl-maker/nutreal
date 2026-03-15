import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ScanBarcode, Search, Loader2, AlertTriangle, CheckCircle2,
  ChevronRight, Info, X, ArrowRight, ShieldAlert, ShieldCheck,
  Star, TrendingUp
} from 'lucide-react';
import { fetchProductByBarcode, searchProducts, fetchAlternatives, type OpenFoodFactsProduct } from '../lib/openfoodfacts';
import { calculateProductScore, getScoreLabel, getAdditiveRisk, type Additive } from '../lib/additives';
import ScoreBadge from '../components/ScoreBadge';
import { useStore } from '../store/useStore';

const CATEGORIES = [
  'Chocolat', 'Céréales', 'Biscottes', 'Yaourts', 'Boissons',
  'Biscuits', 'Chips', 'Fromages', 'Jus de fruits', 'Pâtes',
];

export default function ProductScanner() {
  const { addProductScan, productScans, addMeal } = useStore();
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<OpenFoodFactsProduct | null>(null);
  const [score, setScore] = useState<number>(0);
  const [alternatives, setAlternatives] = useState<OpenFoodFactsProduct[]>([]);
  const [error, setError] = useState('');
  const [showAdditiveModal, setShowAdditiveModal] = useState<Additive | null>(null);
  const [view, setView] = useState<'scanner' | 'result' | 'explore'>('scanner');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<OpenFoodFactsProduct[]>([]);
  const [searching, setSearching] = useState(false);

  const handleScan = async () => {
    if (!barcode.trim()) return;
    setLoading(true);
    setError('');

    try {
      const result = await fetchProductByBarcode(barcode.trim());
      if (!result || !result.product_name) {
        setError('Produit non trouvé. Vérifiez le code-barres.');
        setLoading(false);
        return;
      }

      setProduct(result);

      const additives = result.additives_tags || [];
      const nutrients = {
        calories: result.nutriments?.['energy-kcal_100g'],
        sugar: result.nutriments?.['sugars_100g'],
        salt: result.nutriments?.['salt_100g'],
        saturatedFat: result.nutriments?.['saturated-fat_100g'],
        fiber: result.nutriments?.['fiber_100g'],
        protein: result.nutriments?.['proteins_100g'],
      };

      const calculatedScore = calculateProductScore(
        result.nutriscore_grade,
        additives.map((a: string) => a.replace('en:', '')),
        result.nova_group,
        nutrients
      );
      setScore(calculatedScore);

      // Save scan
      addProductScan({
        barcode: barcode.trim(),
        productName: result.product_name,
        brand: result.brands || 'Marque inconnue',
        score: calculatedScore,
        nutriscoreGrade: result.nutriscore_grade || '',
        imageUrl: result.image_front_url || result.image_url || '',
        scannedAt: new Date().toISOString(),
      });

      // Fetch alternatives
      if (result.categories_tags && result.categories_tags.length > 0) {
        const alts = await fetchAlternatives(result.categories_tags[0], barcode.trim());
        setAlternatives(alts);
      }

      setView('result');
    } catch (err) {
      setError('Erreur lors de la recherche. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const results = await searchProducts(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const handleProductSelect = async (selectedProduct: OpenFoodFactsProduct) => {
    setProduct(selectedProduct);
    setBarcode(selectedProduct.code);

    const additives = selectedProduct.additives_tags || [];
    const nutrients = {
      calories: selectedProduct.nutriments?.['energy-kcal_100g'],
      sugar: selectedProduct.nutriments?.['sugars_100g'],
      salt: selectedProduct.nutriments?.['salt_100g'],
      saturatedFat: selectedProduct.nutriments?.['saturated-fat_100g'],
      fiber: selectedProduct.nutriments?.['fiber_100g'],
      protein: selectedProduct.nutriments?.['proteins_100g'],
    };

    const calculatedScore = calculateProductScore(
      selectedProduct.nutriscore_grade,
      additives.map((a: string) => a.replace('en:', '')),
      selectedProduct.nova_group,
      nutrients
    );
    setScore(calculatedScore);

    addProductScan({
      barcode: selectedProduct.code,
      productName: selectedProduct.product_name,
      brand: selectedProduct.brands || 'Marque inconnue',
      score: calculatedScore,
      nutriscoreGrade: selectedProduct.nutriscore_grade || '',
      imageUrl: selectedProduct.image_front_url || selectedProduct.image_url || '',
      scannedAt: new Date().toISOString(),
    });

    if (selectedProduct.categories_tags && selectedProduct.categories_tags.length > 0) {
      const alts = await fetchAlternatives(selectedProduct.categories_tags[0], selectedProduct.code);
      setAlternatives(alts);
    }

    setView('result');
  };

  const addProductToJournal = () => {
    if (!product) return;
    const n = product.nutriments;
    addMeal({
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mealType: 'snack',
      dishName: product.product_name,
      photoUrl: product.image_front_url || product.image_url,
      foods: [{
        name: product.product_name,
        calories: Math.round(n?.['energy-kcal_100g'] || 0),
        protein_g: Math.round(n?.['proteins_100g'] || 0),
        fat_g: Math.round(n?.['fat_100g'] || 0),
        carbs_g: Math.round(n?.['carbohydrates_100g'] || 0),
        fiber_g: Math.round(n?.['fiber_100g'] || 0),
        quantity_g: 100,
      }],
      totalCalories: Math.round(n?.['energy-kcal_100g'] || 0),
      totalProtein: Math.round(n?.['proteins_100g'] || 0),
      totalFat: Math.round(n?.['fat_100g'] || 0),
      totalCarbs: Math.round(n?.['carbohydrates_100g'] || 0),
      totalFiber: Math.round(n?.['fiber_100g'] || 0),
      createdAt: new Date().toISOString(),
    });
  };

  const getDefaults = () => {
    if (!product) return [];
    const n = product.nutriments;
    const defects: { label: string; value: string; color: string }[] = [];
    
    const additives = (product.additives_tags || []).map((a: string) => a.replace('en:', ''));
    const riskyAdditives = additives.filter((a: string) => getAdditiveRisk(a));
    
    if (riskyAdditives.length > 0) {
      defects.push({
        label: `Additifs : ${riskyAdditives.length}`,
        value: 'Présence d\'additifs à éviter',
        color: '#F44336',
      });
    }

    if (n?.['energy-kcal_100g'] && n['energy-kcal_100g'] > 400) {
      defects.push({
        label: `Calories : ${Math.round(n['energy-kcal_100g'])} kcal`,
        value: 'Un peu trop calorique',
        color: '#FF9800',
      });
    }

    if (n?.['sugars_100g'] && n['sugars_100g'] > 10) {
      defects.push({
        label: `Sucre : ${n['sugars_100g']}g`,
        value: 'Un peu trop sucré',
        color: '#FF9800',
      });
    }

    if (n?.['salt_100g'] && n['salt_100g'] > 1) {
      defects.push({
        label: `Sel : ${n['salt_100g']}g`,
        value: 'Teneur en sel élevée',
        color: '#FF9800',
      });
    }

    if (n?.['saturated-fat_100g'] && n['saturated-fat_100g'] > 3) {
      defects.push({
        label: `Graisses saturées : ${n['saturated-fat_100g']}g`,
        value: 'Teneur élevée',
        color: '#FF9800',
      });
    }

    return defects;
  };

  const getQualities = () => {
    if (!product) return [];
    const n = product.nutriments;
    const qualities: { label: string; value: string }[] = [];

    if (n?.['fiber_100g'] && n['fiber_100g'] > 3) {
      qualities.push({
        label: `Fibres : ${n['fiber_100g']}g`,
        value: n['fiber_100g'] > 5 ? 'Excellente quantité' : 'Bonne quantité',
      });
    }

    if (n?.['proteins_100g'] && n['proteins_100g'] > 5) {
      qualities.push({
        label: `Protéines : ${n['proteins_100g']}g`,
        value: 'Bonne source de protéines',
      });
    }

    return qualities;
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Additive Modal */}
      <AnimatePresence>
        {showAdditiveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
            onClick={() => setShowAdditiveModal(null)}
          >
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl p-6 w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-text-primary">{showAdditiveModal.code} - {showAdditiveModal.name}</h3>
                <button onClick={() => setShowAdditiveModal(null)} className="text-text-muted">
                  <X size={20} />
                </button>
              </div>
              <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold text-white mb-3 ${
                showAdditiveModal.risk === 'high' ? 'bg-red-500' :
                showAdditiveModal.risk === 'moderate' ? 'bg-orange-500' : 'bg-yellow-500'
              }`}>
                {showAdditiveModal.risk === 'high' ? 'À risque' :
                 showAdditiveModal.risk === 'moderate' ? 'Risque modéré' : 'Risque faible'}
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{showAdditiveModal.description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* Scanner View */}
        {view === 'scanner' && (
          <motion.div
            key="scanner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 pt-12 max-w-lg mx-auto"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-secondary-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <ScanBarcode size={32} className="text-secondary-500" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary font-display mb-1">Scan Produit</h1>
              <p className="text-sm text-text-muted">Analysez la qualité de vos produits</p>
            </div>

            {/* Barcode Input */}
            <div className="bg-white rounded-2xl p-4 shadow-card mb-4">
              <label className="text-xs font-medium text-text-muted mb-2 block">Code-barres</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="Ex: 3017620422003"
                  className="flex-1 px-4 py-3 bg-surface-100 rounded-xl text-text-primary placeholder-surface-300 focus:outline-none focus:ring-2 focus:ring-secondary-500/30"
                  onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                />
                <button
                  onClick={handleScan}
                  disabled={loading || !barcode.trim()}
                  className="bg-secondary-500 text-white px-5 py-3 rounded-xl font-semibold hover:bg-secondary-600 active:scale-95 transition-all disabled:opacity-40"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                </button>
              </div>
              
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-xs mt-2 flex items-center gap-1"
                >
                  <AlertTriangle size={12} />
                  {error}
                </motion.p>
              )}
            </div>

            {/* Search by Name */}
            <div className="bg-white rounded-2xl p-4 shadow-card mb-4">
              <label className="text-xs font-medium text-text-muted mb-2 block">Ou rechercher par nom</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ex: Nutella, Coca-Cola..."
                  className="flex-1 px-4 py-3 bg-surface-100 rounded-xl text-text-primary placeholder-surface-300 focus:outline-none focus:ring-2 focus:ring-secondary-500/30"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  disabled={searching || !searchQuery.trim()}
                  className="bg-forest text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#082510] active:scale-95 transition-all disabled:opacity-40"
                >
                  {searching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                  {searchResults.slice(0, 8).map((p, i) => (
                    <button
                      key={i}
                      onClick={() => handleProductSelect(p)}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-surface-50 transition-colors text-left"
                    >
                      {p.image_front_url ? (
                        <img src={p.image_front_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-surface-200 flex items-center justify-center text-surface-300">
                          <ScanBarcode size={16} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{p.product_name || 'Produit inconnu'}</p>
                        <p className="text-xs text-text-muted truncate">{p.brands || ''}</p>
                      </div>
                      {p.nutriscore_grade && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${
                          p.nutriscore_grade === 'a' ? 'bg-green-500' :
                          p.nutriscore_grade === 'b' ? 'bg-lime-500' :
                          p.nutriscore_grade === 'c' ? 'bg-yellow-500' :
                          p.nutriscore_grade === 'd' ? 'bg-orange-500' : 'bg-red-500'
                        }`}>
                          {p.nutriscore_grade.toUpperCase()}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Examples */}
            <div className="mb-4">
              <p className="text-xs font-medium text-text-muted mb-2">Essayez ces codes-barres :</p>
              <div className="flex flex-wrap gap-2">
                {['3017620422003', '5449000000996', '3175680011480', '8000500310427'].map(code => (
                  <button
                    key={code}
                    onClick={() => { setBarcode(code); }}
                    className="px-3 py-1.5 bg-white rounded-full text-xs text-text-secondary shadow-card hover:shadow-card transition-all"
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Scans */}
            {productScans.length > 0 && (
              <div>
                <h3 className="font-display font-semibold text-text-primary text-sm mb-2">Scans récents</h3>
                <div className="space-y-2">
                  {productScans.slice(0, 5).map((scan, i) => {
                    const scoreInfo = getScoreLabel(scan.score);
                    return (
                      <button
                        key={i}
                        onClick={() => { setBarcode(scan.barcode); handleScan(); }}
                        className="w-full bg-white rounded-xl p-3 shadow-card flex items-center gap-3 text-left hover:shadow-card-hover transition-all"
                      >
                        {scan.imageUrl ? (
                          <img src={scan.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-surface-200" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">{scan.productName}</p>
                          <p className="text-xs text-text-muted">{scan.brand}</p>
                        </div>
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: scoreInfo.color }}
                        >
                          {scan.score}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Result View */}
        {view === 'result' && product && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="px-4 pt-12 pb-8 max-w-lg mx-auto"
          >
            <button
              onClick={() => { setView('scanner'); setProduct(null); setBarcode(''); }}
              className="flex items-center gap-1 text-text-muted text-sm mb-4 hover:text-text-secondary"
            >
              ← Retour
            </button>

            {/* Product Header */}
            <div className="bg-white rounded-2xl p-5 shadow-card mb-4 flex items-start gap-4">
              {(product.image_front_url || product.image_url) ? (
                <img
                  src={product.image_front_url || product.image_url}
                  alt={product.product_name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-surface-200 flex items-center justify-center">
                  <ScanBarcode size={24} className="text-surface-300" />
                </div>
              )}
              <div className="flex-1">
                <h2 className="font-display font-bold text-text-primary text-lg leading-tight">{product.product_name}</h2>
                <p className="text-sm text-text-muted">{product.brands || 'Marque inconnue'}</p>
                {product.quantity && (
                  <p className="text-xs text-surface-300 mt-1">{product.quantity}</p>
                )}
              </div>
            </div>

            {/* Score */}
            <div className="bg-white rounded-2xl p-6 shadow-card mb-4 flex items-center justify-center">
              <ScoreBadge score={score} size="lg" />
            </div>

            {/* Defects */}
            {getDefaults().length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-card mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldAlert size={18} className="text-red-500" />
                  <h3 className="font-display font-semibold text-text-primary text-sm">Défauts</h3>
                </div>
                <div className="space-y-2">
                  {getDefaults().map((defect, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-red-50/50">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: defect.color }} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">{defect.label}</p>
                        <p className="text-xs text-text-muted">{defect.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Qualities */}
            {getQualities().length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-card mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck size={18} className="text-green-500" />
                  <h3 className="font-display font-semibold text-text-primary text-sm">Qualités</h3>
                </div>
                <div className="space-y-2">
                  {getQualities().map((quality, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-green-50/50">
                      <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">{quality.label}</p>
                        <p className="text-xs text-text-muted">{quality.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additives */}
            {product.additives_tags && product.additives_tags.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-card mb-4">
                <h3 className="font-display font-semibold text-text-primary text-sm mb-3">Composition - Additifs</h3>
                <div className="space-y-2">
                  {product.additives_tags.map((additive: string, i: number) => {
                    const code = additive.replace('en:', '');
                    const info = getAdditiveRisk(code);
                    return (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-surface-50">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          info?.risk === 'high' ? 'bg-red-500' :
                          info?.risk === 'moderate' ? 'bg-orange-500' :
                          info?.risk === 'low' ? 'bg-yellow-500' : 'bg-surface-300'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-text-primary">
                            {info ? `${info.name} ${info.code}` : code.toUpperCase()}
                          </p>
                          {info && (
                            <p className={`text-xs font-medium ${
                              info.risk === 'high' ? 'text-red-500' :
                              info.risk === 'moderate' ? 'text-orange-500' : 'text-yellow-600'
                            }`}>
                              {info.risk === 'high' ? 'À risque' :
                               info.risk === 'moderate' ? 'Risque modéré' : 'Risque faible'}
                            </p>
                          )}
                        </div>
                        {info && (
                          <button
                            onClick={() => setShowAdditiveModal(info)}
                            className="w-7 h-7 rounded-full bg-surface-200 flex items-center justify-center text-text-muted hover:bg-surface-300"
                          >
                            <Info size={14} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Alternatives */}
            {alternatives.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-card mb-4">
                <h3 className="font-display font-semibold text-text-primary text-sm mb-3">Alternatives plus saines</h3>
                <div className="space-y-3">
                  {alternatives.map((alt, i) => {
                    const altAdditives = (alt.additives_tags || []).map((a: string) => a.replace('en:', ''));
                    const altScore = calculateProductScore(
                      alt.nutriscore_grade,
                      altAdditives,
                      alt.nova_group,
                      {
                        calories: alt.nutriments?.['energy-kcal_100g'],
                        sugar: alt.nutriments?.['sugars_100g'],
                        salt: alt.nutriments?.['salt_100g'],
                        saturatedFat: alt.nutriments?.['saturated-fat_100g'],
                        fiber: alt.nutriments?.['fiber_100g'],
                        protein: alt.nutriments?.['proteins_100g'],
                      }
                    );
                    const altScoreInfo = getScoreLabel(altScore);

                    return (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-green-50/50 border border-green-100">
                        {alt.image_front_url ? (
                          <img src={alt.image_front_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-surface-200" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">{alt.product_name}</p>
                          <p className="text-xs text-text-muted">{alt.brands || ''}</p>
                        </div>
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: altScoreInfo.color }}
                        >
                          {altScore}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add to Journal */}
            <button
              onClick={addProductToJournal}
              className="w-full bg-primary-500 text-white py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-600 active:scale-[0.98] transition-all shadow-float"
            >
              <Plus size={20} />
              Ajouter au journal
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Plus({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
