import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { extractProductData, parsePrice } from '@/lib/firecrawl';
import { extractDomain, normalizeUrl, validateUrl } from '@/lib/utils';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ExtractRequestSchema = z.object({
  urls: z.array(z.string()).min(1).max(20),
});

// Simple in-memory rate limiting
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimits.get(ip);

  if (!limit || now > limit.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + 3600000 }); // 1 hour
    return true;
  }

  if (limit.count >= 100) {
    return false;
  }

  limit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { urls } = ExtractRequestSchema.parse(body);

    // Validate and normalize URLs
    const validUrls = urls
      .filter(validateUrl)
      .map(normalizeUrl)
      .filter((url, index, self) => self.indexOf(url) === index); // Dedupe

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
        // Check cache (24 hours)
        const { data: cached } = await supabase
          .from('products')
          .select('*')
          .eq('url', url)
          .gte('last_checked', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .single();

        if (cached) {
          // Increment paste count
          await supabase
            .from('products')
            .update({ paste_count: cached.paste_count + 1 })
            .eq('id', cached.id);

          products.push({ ...cached, paste_count: cached.paste_count + 1 });
          continue;
        }

        // Extract with timeout
        const extractPromise = extractProductData(url);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Extraction timeout')), 30000)
        );

        const extracted = await Promise.race([extractPromise, timeoutPromise]);

        // Parse and store
        const { number: priceNumber, currency } = parsePrice(extracted.price);
        const sourceDomain = extractDomain(url);

        const productData = {
          url,
          source_domain: sourceDomain,
          title: extracted.name || null,
          price_number: priceNumber,
          currency: currency || 'USD',
          image_url: extracted.image || null,
          designer: extracted.brand || null,
          color: extracted.color || null,
          fabric: extracted.material || null,
          shipping_estimate: null,
          raw_json: extracted,
          last_checked: new Date().toISOString(),
          paste_count: 1,
        };

        // Upsert product
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
