import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { extractDomain, normalizeUrl, validateUrl } from '@/lib/utils';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ExtractRequestSchema = z.object({
  urls: z.array(z.string()).min(1).max(20),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { urls } = ExtractRequestSchema.parse(body);

    const validUrls = urls
      .filter(validateUrl)
      .map(normalizeUrl)
      .filter((url, index, self) => self.indexOf(url) === index);

    if (validUrls.length === 0) {
      return NextResponse.json({
        products: [],
        errors: [{ url: 'all', message: 'No valid URLs provided' }],
      });
    }

    const products = [];
    const errors = [];

    for (const url of validUrls) {
      try {
        // Check cache
        const { data: cached } = await supabase
          .from('products')
          .select('*')
          .eq('url', url)
          .gte('last_checked', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .single();

        if (cached) {
          await supabase
            .from('products')
            .update({ paste_count: cached.paste_count + 1 })
            .eq('id', cached.id);

          products.push({ ...cached, paste_count: cached.paste_count + 1 });
          continue;
        }

        // Call Firecrawl
        const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
          },
          body: JSON.stringify({
            url: url,
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
          throw new Error(`Firecrawl error: ${response.statusText}`);
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

        const sourceDomain = extractDomain(url);

        const productData = {
          url,
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

        products.push(product);
      } catch (error: any) {
        errors.push({
          url,
          message: error.message || 'Failed to extract product data',
        });
      }
    }

    return NextResponse.json({ products, errors });
  } catch (error: any) {
    console.error('Extract API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
