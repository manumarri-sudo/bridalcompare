import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ScrapeResponse {
  success: boolean;
  product?: any;
  fromCache?: boolean;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ScrapeResponse>> {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    const scrapeHash = crypto.createHash('md5').update(url).digest('hex');
    const cacheWindow = new Date(Date.now() - 72 * 60 * 60 * 1000);

    const { data: cachedProduct, error: cacheError } = await supabase
      .from('products')
      .select('*')
      .eq('scrape_hash', scrapeHash)
      .gte('last_scraped_at', cacheWindow.toISOString())
      .single();

    if (cachedProduct && !cacheError) {
      console.log('✅ Cache HIT - Returning cached data');
      return NextResponse.json({
        success: true,
        product: cachedProduct,
        fromCache: true,
      });
    }

    console.log('❌ Cache MISS - Scraping fresh data');

    const firecrawlResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({
        url,
        formats: ['extract'],
        extract: {
          schema: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              price: { type: 'string' },
              image: { type: 'string' },
              brand: { type: 'string' },
              color: { type: 'string' },
              material: { type: 'string' },
              description: { type: 'string' },
            },
          },
        },
      }),
    });

    if (!firecrawlResponse.ok) {
      throw new Error(`Firecrawl error: ${firecrawlResponse.statusText}`);
    }

    const scrapeData = await firecrawlResponse.json();
    const extracted = scrapeData.data?.extract || {};

    const normalized = normalizeProductData(extracted);
    const sourceDomain = new URL(url).hostname.replace('www.', '');

    let priceNumber: number | null = null;
    let currency = 'INR';
    if (extracted.price) {
      const cleaned = extracted.price.replace(/[₹$,\s]/g, '');
      const parsed = parseFloat(cleaned);
      priceNumber = isNaN(parsed) ? null : parsed;
      currency = extracted.price.includes('₹') ? 'INR' : 'USD';
    }

    const productData = {
      url,
      source_domain: sourceDomain,
      scrape_hash: scrapeHash,
      raw_data: extracted,
      normalized_category: normalized.category,
      normalized_color: normalized.color,
      normalized_occasion: normalized.occasions,
      title: extracted.name || null,
      price_number: priceNumber,
      currency,
      image_url: extracted.image || null,
      designer: extracted.brand || null,
      last_scraped_at: new Date().toISOString(),
    };

    const { data: product, error: upsertError } = await supabase
      .from('products')
      .upsert(productData, { onConflict: 'url' })
      .select()
      .single();

    if (upsertError) {
      throw upsertError;
    }

    return NextResponse.json({
      success: true,
      product,
      fromCache: false,
    });

  } catch (error: any) {
    console.error('❌ Smart Scraper Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to scrape product' },
      { status: 500 }
    );
  }
}

interface NormalizedData {
  category: string | null;
  color: string | null;
  occasions: string[];
}

function normalizeProductData(extracted: any): NormalizedData {
  const text = `${extracted.name || ''} ${extracted.description || ''}`.toLowerCase();
  
  let category: string | null = null;
  if (text.match(/lehenga|ghagra/)) category = 'lehenga';
  else if (text.match(/saree|sari/)) category = 'saree';
  else if (text.match(/sherwani/)) category = 'sherwani';
  else if (text.match(/gown/)) category = 'gown';
  else if (text.match(/suit|blazer/)) category = 'suit';
  else if (text.match(/kurta|kurti/)) category = 'kurta';
  else if (text.match(/anarkali/)) category = 'anarkali';
  else if (text.match(/palazzo/)) category = 'palazzo';
  else if (text.match(/kaftan/)) category = 'kaftan';
  
  let color: string | null = null;
  const colorText = `${text} ${extracted.color || ''}`.toLowerCase();
  
  if (colorText.match(/emerald|teal|sapphire|ruby|jewel/)) color = 'jewel_tone';
  else if (colorText.match(/pastel|blush|mint|lavender|peach/)) color = 'pastel';
  else if (colorText.match(/red|maroon|crimson/)) color = 'red';
  else if (colorText.match(/black/)) color = 'black';
  else if (colorText.match(/white|ivory|cream/)) color = 'white';
  else if (colorText.match(/gold|golden/)) color = 'gold';
  else if (colorText.match(/silver|metallic|bronze/)) color = 'metallic';
  else if (colorText.match(/pink|rose/)) color = 'pink';
  else if (colorText.match(/blue|navy/)) color = 'blue';
  else if (colorText.match(/green/)) color = 'green';
  else if (colorText.match(/yellow/)) color = 'yellow';
  else if (colorText.match(/orange|saffron/)) color = 'orange';
  else if (colorText.match(/purple|violet/)) color = 'purple';
  
  const occasions: string[] = [];
  if (text.match(/bridal|wedding|bride/)) occasions.push('wedding_ceremony');
  if (text.match(/sangeet/)) occasions.push('sangeet');
  if (text.match(/haldi/)) occasions.push('haldi');
  if (text.match(/mehendi|mehndi/)) occasions.push('mehendi');
  if (text.match(/reception/)) occasions.push('reception');
  if (text.match(/engagement/)) occasions.push('engagement');
  if (text.match(/party|cocktail/)) occasions.push('party');
  if (text.match(/diwali/)) occasions.push('diwali');
  if (text.match(/eid/)) occasions.push('eid');
  if (text.match(/festival/)) occasions.push('festival');
  
  if (occasions.length === 0) {
    occasions.push('party');
  }
  
  return { category, color, occasions };
}
