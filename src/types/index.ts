export interface Product {
  id: string;
  url: string;
  source_domain: string;
  title: string | null;
  price_number: number | null;
  currency: string | null;
  image_url: string | null;
  designer: string | null;
  color: string | null;
  fabric: string | null;
  shipping_estimate: string | null;
  event_tags: string[];
  raw_json: any;
  last_checked: string;
  paste_count: number;
  compare_count: number;
  save_count: number;
  created_at: string;
}

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface CollectionItem {
  id: string;
  collection_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface ExtractResponse {
  products: Product[];
  errors: { url: string; message: string }[];
}

export interface TrendingData {
  topSaved: Product[];
  topCompared: Product[];
  trendingColors: { color: string; count: number }[];
  trendingPriceBands: { band: string; count: number }[];
}
