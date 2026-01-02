import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// MOCK SCRAPER (Replace with real Firecrawl call later)
async function scrapeUrl(url: string) {
  if (!process.env.FIRECRAWL_API_KEY) {
    console.warn("Missing FIRECRAWL_API_KEY");
  }

  return {
    title: "New Find via Vara",
    image_url: "https://placehold.co/600x400?text=Product+Image",
    price: 0,
    currency: "USD",
    source: new URL(url).hostname
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
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
          },
          remove(name: string, options: CookieOptions) {
          },
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
        raw_data: metadata 
      }).select().single()
      
      if (insertError) throw insertError
      product = newProduct
    }

    // --- TYPESCRIPT FIX: Explicitly assert product exists ---
    if (!product) {
      throw new Error("Failed to resolve product")
    }

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
    console.error("Save Error:", e)
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
