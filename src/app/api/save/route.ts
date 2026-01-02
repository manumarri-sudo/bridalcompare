import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

function sanitizeEnum(val: string, allowed: string[], fallback: string) {
  if (!val) return fallback;
  const normalized = val.toLowerCase().trim().replace(/ /g, '_');
  return allowed.includes(normalized) ? normalized : fallback;
}

const ALLOWED_CATEGORIES = ['lehenga', 'saree', 'sherwani', 'gown', 'suit', 'kurta', 'anarkali', 'palazzo', 'kaftan', 'indo_western', 'jewelry', 'accessories', 'footwear', 'dhoti', 'half_saree'];

async function scrapeUrl(url: string) {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    return { title: "New Saved Item", image: "https://placehold.co/600x400?text=Saved+Link", price: 0 };
  }

  try {
    const response = await fetch('https://api.firecrawl.dev/v0/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ 
        url, 
        pageOptions: { onlyMainContent: false, includeHtml: false } 
      })
    });
    
    if (!response.ok) throw new Error("Scraper failed");
    const json = await response.json();
    const data = json.data || {};
    const meta = data.metadata || {};

    let price = 0;
    if (meta.price) price = parseFloat(meta.price);
    else if (meta.ogPrice) price = parseFloat(meta.ogPrice);

    return {
      title: meta.title || data.title || "New Saved Item",
      image_url: meta.ogImage || meta.image || "https://placehold.co/600x400?text=No+Image",
      price: price || 0,
      description: meta.description || ""
    };
  } catch (e) {
    console.error("Scrape Error:", e);
    return { title: "Saved Link", image_url: "https://placehold.co/600x400?text=Saved+Link", price: 0 };
  }
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    const cookieStore = cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: CookieOptions) {},
          remove(name: string, options: CookieOptions) {},
        },
      }
    )
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

    let { data: product } = await supabase.from('products').select('id').eq('url', url).single()

    if (!product) {
      const metadata = await scrapeUrl(url)
      const safeCategory = sanitizeEnum(metadata.title, ALLOWED_CATEGORIES, 'accessories');
      
      const { data: newProduct, error: insertError } = await supabase.from('products').insert({
        url,
        title: metadata.title,
        image_url: metadata.image_url,
        price_number: metadata.price,
        currency: 'INR', 
        source_domain: new URL(url).hostname,
        normalized_category: safeCategory, 
        normalized_color: 'neutral'
      }).select().single()
      
      if (insertError) {
        if (insertError.code === '42501') throw new Error("Database Permission Error: Please run the SQL fix.");
        throw new Error("Failed to save product details");
      }
      product = newProduct
    }

    // --- TYPESCRIPT FIX: Explicitly check for null before proceeding ---
    if (!product) {
      throw new Error("Critical Error: Product could not be resolved.");
    }

    const { error: saveError } = await supabase.from('saved_items').insert({
      user_id: user.id,
      product_id: product.id,
      collection_id: null 
    })

    if (saveError && saveError.code !== '23505') throw saveError

    return NextResponse.json({ success: true })

  } catch (e: any) {
    console.error("API Error:", e)
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
