import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json({ error: 'URL required' }, { status: 400 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('usage_count, is_vara_pass_holder')
      .eq('id', session.user.id)
      .single()

    if (profile && !profile.is_vara_pass_holder && profile.usage_count >= 50) {
      return NextResponse.json({ 
        error: 'LIMIT_REACHED',
        message: 'Upgrade to Vara Pass' 
      }, { status: 403 })
    }

    let { data: product } = await supabase
      .from('products')
      .select('id')
      .eq('url', url)
      .single()

    if (!product) {
      const domain = new URL(url).hostname.replace('www.', '')
      const { data: newProduct } = await supabase
        .from('products')
        .insert({
          url,
          source_domain: domain,
          title: 'Product from ' + domain,
        })
        .select('id')
        .single()
      
      product = newProduct
    }

    if (!product) {
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
    }

    let { data: collection } = await supabase
      .from('collections')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('title', 'Saved Items')
      .single()

    if (!collection) {
      const { data: newCollection } = await supabase
        .from('collections')
        .insert({
          user_id: session.user.id,
          title: 'Saved Items',
        })
        .select('id')
        .single()
      
      collection = newCollection
    }

    const { data: savedItem, error: saveError } = await supabase
      .from('saved_items')
      .insert({
        user_id: session.user.id,
        product_id: product.id,
        collection_id: collection!.id,
      })
      .select()
      .single()

    if (saveError) {
      return NextResponse.json({ error: saveError.message }, { status: 500 })
    }

    await supabase
      .from('profiles')
      .update({ 
        usage_count: (profile?.usage_count || 0) + 1 
      })
      .eq('id', session.user.id)

    return NextResponse.json({ 
      success: true, 
      item: savedItem 
    })

  } catch (error: any) {
    console.error('Save product error:', error)
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 })
  }
}
