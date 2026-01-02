import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const ALLOWED_CATEGORIES = ['lehenga', 'saree', 'sherwani', 'gown', 'suit', 'kurta', 'anarkali', 'palazzo', 'kaftan', 'indo_western', 'jewelry', 'accessories', 'footwear', 'dhoti', 'half_saree'];

function sanitizeCategory(rawCategory: string | undefined): string {
  if (!rawCategory) return 'accessories';
  
  const normalized = rawCategory.toLowerCase().trim().replace(/[\s-_]/g, '');
  
  // Map common variations
  const mapping: Record<string, string> = {
    'lehengacholi': 'lehenga',
    'lehenga': 'lehenga',
    'saree': 'saree',
    'sari': 'saree',
    'sherwani': 'sherwani',
    'gown': 'gown',
    'suit': 'suit',
    'kurta': 'kurta',
    'kurtaset': 'kurta',
    'anarkali': 'anarkali',
    'palazzo': 'palazzo',
    'palazzoset': 'palazzo',
    'kaftan': 'kaftan',
    'indowestern': 'indo_western',
    'jewelry': 'jewelry',
    'jewellery': 'jewelry',
    'accessories': 'accessories',
    'footwear': 'footwear',
    'shoes': 'footwear',
    'dhoti': 'dhoti',
    'halfsaree': 'half_saree'
  };
  
  return mapping[normalized] || 'accessories';
}

function extractDesigner(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    // Remove .com, .in, etc.
    const name = hostname.split('.')[0];
    // Capitalize first letter
    return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    return 'Designer';
  }
}

function extractPriceFromText(text: string): number {
  // Look for price patterns: ₹1,234 or Rs 1234 or $123
  const patterns = [
    /₹\s*([0-9,]+)/,
    /Rs\.?\s*([0-9,]+)/i,
    /INR\s*([0-9,]+)/i,
    /\$\s*([0-9,]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const numStr = match[1].replace(/,/g, '');
      const num = parseFloat(numStr);
      if (!isNaN(num) && num > 0) return num;
    }
  }
  
  return 0;
}

async function scrapeUrl(url: string) {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  
  // Default fallback data
  const fallback = {
    title: extractDesigner(url) + " - Saved Item",
    image_url: "https://placehold.co/600x400?text=No+Preview",
    price_number: 0,
    designer: extractDesigner(url),
    category: 'accessories',
    description: ''
  };
  
  if (!apiKey) {
    console.warn("FIRECRAWL_API_KEY not set - using fallback data");
    return fallback;
  }
  
  try {
    const response = await fetch('https://api.firecrawl.dev/v0/scrape', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${apiKey}` 
      },
      body: JSON.stringify({ 
        url, 
        pageOptions: { 
          onlyMainContent: false, 
          includeHtml: false 
        } 
      })
    });
    
    if (!response.ok) {
      console.error("Firecrawl API error:", response.status);
      return fallback;
    }
    
    const json = await response.json();
    const data = json.data || {};
    const meta = data.metadata || {};
    
    // Extract title
    const title = meta.title || meta.ogTitle || data.title || fallback.title;
    
    // Extract image
    const image_url = meta.ogImage || meta.image || fallback.image_url;
    
    // Extract price
    let price_number = 0;
    if (meta.price) {
      price_number = parseFloat(String(meta.price).replace(/[^0-9.]/g, ''));
    } else if (meta.ogPrice) {
      price_number = parseFloat(String(meta.ogPrice).replace(/[^0-9.]/g, ''));
    } else if (data.markdown) {
      // Try to extract from page text
      price_number = extractPriceFromText(data.markdown);
    }
    
    // Extract category from metadata or title
    const rawCategory = meta.category || meta.productType || '';
    const category = sanitizeCategory(rawCategory);
    
    // Extract designer
    const designer = meta.brand || extractDesigner(url);
    
    return {
      title: title.substring(0, 255), // Limit length
      image_url,
      price_number: isNaN(price_number) ? 0 : price_number,
      designer,
      category,
      description: (meta.description || '').substring(0, 500)
    };
    
  } catch (e) {
    console.error("Scrape Error:", e);
    return fallback;
  }
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid URL" 
      }, { status: 400 })
    }
    
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
    
    // Check auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: "Unauthorized" 
      }, { status: 401 })
    }
    
    // Check if product already exists
    let { data: product } = await supabase
      .from('products')
      .select('id, title, image_url, price_number, designer')
      .eq('url', url)
      .single()
    
    // Create product if doesn't exist
    if (!product) {
      const metadata = await scrapeUrl(url)
      
      const { data: newProduct, error: insertError } = await supabase
        .from('products')
        .insert({
          url,
          title: metadata.title,
          image_url: metadata.image_url,
          price_number: metadata.price_number,
          currency: 'INR', 
          designer: metadata.designer,
          source_domain: new URL(url).hostname,
          normalized_category: metadata.category,
          normalized_color: 'neutral'
        })
        .select()
        .single()
      
      if (insertError) {
        console.error("Product insert error:", insertError);
        if (insertError.code === '42501') {
          return NextResponse.json({ 
            success: false, 
            error: "Database permission error" 
          }, { status: 500 })
        }
        return NextResponse.json({ 
          success: false, 
          error: "Failed to save product" 
        }, { status: 500 })
      }
      
      product = newProduct
    }
    
    // TypeScript null check
    if (!product) {
      return NextResponse.json({ 
        success: false, 
        error: "Product creation failed" 
      }, { status: 500 })
    }
    
    // Save to user's collection (null = Inbox)
    const { error: saveError } = await supabase
      .from('saved_items')
      .insert({
        user_id: user.id,
        product_id: product.id,
        collection_id: null 
      })
    
    // Ignore duplicate errors (already saved)
    if (saveError && saveError.code !== '23505') {
      console.error("Save error:", saveError);
      
      // Check if it's a usage limit error
      if (saveError.message && saveError.message.includes('limit')) {
        return NextResponse.json({ 
          success: false, 
          error: "LIMIT_REACHED",
          message: "Free tier limit reached. Upgrade to Vara Pass for unlimited saves."
        }, { status: 403 })
      }
      
      throw saveError
    }
    
    // Return the saved product data
    return NextResponse.json({ 
      success: true,
      product: {
        id: product.id,
        title: product.title,
        image_url: product.image_url,
        price_number: product.price_number,
        designer: product.designer
      }
    })
    
  } catch (e: any) {
    console.error("API Error:", e)
    return NextResponse.json({ 
      success: false, 
      error: e.message || "Internal server error" 
    }, { status: 500 })
  }
}
