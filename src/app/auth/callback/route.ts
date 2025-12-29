import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const returnUrl = requestUrl.searchParams.get('return')
  const shouldSave = requestUrl.searchParams.get('save') === 'true'

  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  const origin = requestUrl.origin

  if (returnUrl && shouldSave) {
    return NextResponse.redirect(`${origin}/collections?save=${encodeURIComponent(returnUrl)}`)
  } else if (returnUrl) {
    return NextResponse.redirect(returnUrl)
  } else {
    return NextResponse.redirect(`${origin}/collections`)
  }
}
