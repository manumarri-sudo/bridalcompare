import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { extractDomain, normalizeUrl, validateUrl } from '@/lib/utils';
import { fixBridalUrl, cleanProductUrl } from '@/lib/domain-mapper';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    console.log('=== ADD SINGLE API CALLED ===');
    
    const body = await request.json();
    let { url } = body;
    
    console.log('Original URL:', url);

    if (!url || !validateUrl(url)) {
      console.error('Invalid URL provided:', url);
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    // Clean and fix the URL
    url = cleanProductUrl(url);
    console.log('After cleanProductUrl:', url);
    
    url = fixBridalUrl(url);
    console.log('After fixBridalUrl:', url);
    
    const normalizedUrl = normalizeUrl(url);
    console.log('After normalizeUrl:', normalizedUrl);

    // Check cache first
    console.log('Checking cache...');
    const { data: cached, error: cacheError } = await supabase
      .from('products')
      .select('*')
      .eq('url', normalizedUrl)
      .gte('last_checked', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .single();

    if (cacheError) {
      console.log('Cache check error (this is OK if product not found):', cacheError.message);
    }

    if (cached) {
      console.log('Found in cache:', cached.id);
      await supabase
        .from('products')
        .update({ paste_count: cached.paste_count + 1 })
        .eq('id', cached.id);

      return NextResponse.json({ 
        success: true, 
        product: { ...cached, paste_count: cached.paste_count + 1 } 
      });
    }

    // Extract with Firecrawl
    console.log('Calling Firecrawl API...');
    const firecrawlResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({
        url: normalizedUrl,
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
            },
          },
        },
      }),
    });

    console.log('Firecrawl status:', firecrawlResponse.status);

    if (!firecrawlResponse.ok) {
      const errorText = await firecrawlResponse.text();
      console.error('Firecrawl error response:', errorText);
      throw new Error(`Firecrawl returned ${firecrawlResponse.status}: ${errorText}`);
    }

    const data = await firecrawlResponse.json();
    console.log('Firecrawl response:', JSON.stringify(data, null, 2));
    
    // Check if we got redirected to a parking/sale page
    const actualUrl = data?.data?.metadata?.url || data?.data?.metadata?.sourceURL;
    console.log('Actual scraped URL:', actualUrl);
    
    if (actualUrl && (
      actualUrl.includes('afternic.com') || 
      actualUrl.includes('forsale') ||
      actualUrl.includes('parked') ||
      actualUrl.includes('godaddy')
    )) {
      throw new Error('Domain appears to be parked or for sale. Please check the URL.');
    }
    
    const extracted = data.data?.extract || {};
    console.log('Extracted data:', extracted);
    
    // Validate we got actual product data
    if (!extracted.name || extracted.name.includes('forsale') || extracted.name.includes('parked')) {
      throw new Error('Could not find product information on this page. Please verify the URL.');
    }

    // Parse price
    let priceNumber: number | null = null;
    let currency = 'USD';
    if (extracted.price) {
      const cleaned = extracted.price.replace(/[₹$,\s]/g, '');
      const parsed = parseFloat(cleaned);
      priceNumber = isNaN(parsed) ? null : parsed;
      currency = extracted.price.includes('₹') ? 'INR' : 'USD';
    }

    const sourceDomain = extractDomain(normalizedUrl);

    const productData = {
      url: normalizedUrl,
      source_domain: sourceDomain,
      title: extracted.name || null,
      price_number: priceNumber,
      currency,
      image_url: extracted.image || null,
      designer: extracted.brand || null,
      color: extracted.color || null,
      fabric: extracted.material || null,
      shipping_estimate: null,
      raw_json: extracted,
      last_checked: new Date().toISOString(),
      paste_count: 1,
    };

    console.log('Saving to database:', productData);

    const { data: product, error: upsertError } = await supabase
      .from('products')
      .upsert(productData, { onConflict: 'url' })
      .select()
      .single();

    if (upsertError) {
      console.error('Database error:', upsertError);
      throw upsertError;
    }

    console.log('Product saved successfully:', product.id);
    return NextResponse.json({ success: true, product });
    
  } catch (error: any) {
    console.error('=== ADD SINGLE ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { error: error.message || 'Failed to add product' },
      { status: 500 }
    );
  }
}
