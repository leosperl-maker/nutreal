export interface OpenFoodFactsProduct {
  code: string;
  product_name: string;
  brands: string;
  image_url: string;
  image_front_url: string;
  nutriscore_grade: string;
  nova_group: number;
  categories_tags: string[];
  additives_tags: string[];
  nutriments: {
    'energy-kcal_100g'?: number;
    'sugars_100g'?: number;
    'salt_100g'?: number;
    'saturated-fat_100g'?: number;
    'fiber_100g'?: number;
    'proteins_100g'?: number;
    'fat_100g'?: number;
    'carbohydrates_100g'?: number;
  };
  ingredients_text_fr?: string;
  quantity?: string;
}

export async function fetchProductByBarcode(barcode: string): Promise<OpenFoodFactsProduct | null> {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`
    );
    const data = await response.json();
    if (data.status === 1 && data.product) {
      return data.product;
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function searchProducts(query: string, page = 1): Promise<OpenFoodFactsProduct[]> {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page=${page}&page_size=20&lc=fr`
    );
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

export async function fetchAlternatives(category: string, currentBarcode: string): Promise<OpenFoodFactsProduct[]> {
  try {
    const categorySlug = category.split(':').pop() || category;
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?tagtype_0=categories&tag_contains_0=contains&tag_0=${encodeURIComponent(categorySlug)}&sort_by=nutriscore_score&page_size=10&json=1&lc=fr`
    );
    const data = await response.json();
    const products = (data.products || []) as OpenFoodFactsProduct[];
    return products
      .filter((p: OpenFoodFactsProduct) => p.code !== currentBarcode && p.nutriscore_grade && p.product_name)
      .slice(0, 3);
  } catch (error) {
    console.error('Error fetching alternatives:', error);
    return [];
  }
}

export async function fetchTopProducts(category: string): Promise<OpenFoodFactsProduct[]> {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?tagtype_0=categories&tag_contains_0=contains&tag_0=${encodeURIComponent(category)}&sort_by=nutriscore_score&page_size=5&json=1&lc=fr`
    );
    const data = await response.json();
    return (data.products || []).filter((p: OpenFoodFactsProduct) => p.product_name && p.nutriscore_grade);
  } catch (error) {
    console.error('Error fetching top products:', error);
    return [];
  }
}
