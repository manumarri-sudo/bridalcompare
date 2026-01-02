import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// REAL FIRECRAWL SCRAPER
async function scrapeUrl(url: string) {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  
  if (!apiKey) {
    console.error("❌ FIRECRAWL_API_KEY is missing in Vercel Environment Variables");
  }

  try {
    if (!apiKey) throw new Error("Missing FIRECRAWL_API_KEY");

    // Call Firecrawl API
    const response = await fetch('https://api.firecrawl.dev/v0/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        url: url,
        pageOptions: {
          onlyMainContent: true,
          includeHtml: false,
          waitFor: 1000
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Firecrawl API Error:", errText);
      throw new Error(`Failed to scrape: ${response.statusText}`);
    }

    const data = await response.json();
    const meta = data.data.metadata || {};

    // Map Firecrawl data to our database schema
    return {
      title: meta.title || data.data.title || "New Saved Item",
      image_url: meta.ogImage || meta.image || "https://placehold.co/600x400?text=No+Image",
      price: 0,
      currency: "USD",
      source: new URL(url).hostname,
      raw_data: data.data 
    };

  } catch (error: any) { // <--- FIXED: Explicitly allow 'any' to access .message
    console.error("Scraping Exception:", error);
    // Fallback if scraping fails entirely
    return {
      title: "Saved Link",
      image_url: "https://placehold.co/600x400?text=Saved+Link",
      price: 0,
      currency: "USD",
      source: new URL(url).hostname,
      raw_data: { error: error?.message || String(error) }
    };
  }
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    const cookieStore = cookies()
    
    // 1. Auth Check
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

    // 2. Check if Product Exists
    let { data: product } = await supabase.from('products').select('id').eq('url', url).single()

    // 3. If New, Scrape & Insert
    if (!product) {
      const metadata = await scrapeUrl(url)
      const { data: newProduct, error: insertError } = await supabase.from('products').insert({
        url,
        title: metadata.title,
        image_url: metadata.image_url,
        price_number: metadata.price,
        currency: metadata.currency,
        source_domain: metadata.source,
        raw_data: metadata.raw_data
      }).select().single()
      
      if (insertError) {
        console.error("Database Insert Error:", insertError);
        throw new Error("Failed to save product to database");
      }
      product = newProduct
    }

    if (!product) throw new Error("Product creation failed");

    // 4. Save to User Collection
    const { error: saveError } = await supabase.from('saved_items').insert({
      user_id: user.id,
      product_id: product.id,
      collection_id: null 
    })

    if (saveError && saveError.code !== '23505') { 
      throw saveError
    }

    return NextResponse.json({ success: true })

  } catch (e: any) {
    console.error("Save Endpoint Error:", e)
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
