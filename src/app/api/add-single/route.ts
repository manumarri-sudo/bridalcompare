import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { extractDomain, normalizeUrl, validateUrl } from '@/lib/utils';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || !validateUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    const normalizedUrl = normalizeUrl(url);

    // Check cache first
    const { data: cached } = await supabase
      .from('products')
      .select('*')
      .eq('url', normalizedUrl)
      .gte('last_checked', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .single();

    if (cached) {
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
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
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

    if (!response.ok) {
      throw new Error('Failed to extract product data');
    }

    const data = await response.json();
    const extracted = data.data?.extract || {};

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

    const { data: product, error: upsertError } = await supabase
      .from('products')
      .upsert(productData, { onConflict: 'url' })
      .select()
      .single();

    if (upsertError) throw upsertError;

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Add single error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add product' },
      { status: 500 }
    );
  }
}
