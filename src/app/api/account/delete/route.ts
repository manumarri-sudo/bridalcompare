import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await supabase.from('saved_items').delete().eq('user_id', session.user.id)
    await supabase.from('collections').delete().eq('user_id', session.user.id)
    await supabase.from('profiles').delete().eq('id', session.user.id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || 'Failed' 
    }, { status: 500 })
  }
}
