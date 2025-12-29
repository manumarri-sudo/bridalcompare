import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const url = body?.url
    if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 })

    const { data: profile } = await supabase.from('profiles').select('usage_count, is_vara_pass_holder').eq('id', session.user.id).maybeSingle()
    if (profile && !profile.is_vara_pass_holder && (profile.usage_count || 0) >= 50) {
      return NextResponse.json({ error: 'LIMIT_REACHED' }, { status: 403 })
    }

    const { data: existingProduct } = await supabase.from('products').select('id').eq('url', url).maybeSingle()
    let productId: string

    if (existingProduct) {
      productId = existingProduct.id
    } else {
      const domain = new URL(url).hostname.replace('www.', '')
      const { data: newProduct, error: productError } = await supabase.from('products').insert({ url, source_domain: domain, title: 'Saved from ' + domain }).select('id').single()
      if (productError || !newProduct) return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
      productId = newProduct.id
    }

    const { data: existingCollection } = await supabase.from('collections').select('id').eq('user_id', session.user.id).eq('title', 'Saved Items').maybeSingle()
    let collectionId: string

    if (existingCollection) {
      collectionId = existingCollection.id
    } else {
      const { data: newCollection, error: collectionError } = await supabase.from('collections').insert({ user_id: session.user.id, title: 'Saved Items' }).select('id').single()
      if (collectionError || !newCollection) return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 })
      collectionId = newCollection.id
    }

    const { data: savedItem, error: saveError } = await supabase.from('saved_items').insert({ user_id: session.user.id, product_id: productId, collection_id: collectionId }).select().single()
    if (saveError) return NextResponse.json({ error: saveError.message }, { status: 500 })

    await supabase.from('profiles').update({ usage_count: (profile?.usage_count || 0) + 1 }).eq('id', session.user.id)

    return NextResponse.json({ success: true, item: savedItem })
  } catch (error: any) {
    console.error('Save error:', error)
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 })
  }
}
