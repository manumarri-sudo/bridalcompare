import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const returnUrl = requestUrl.searchParams.get('return');
  const shouldSave = requestUrl.searchParams.get('save') === 'true';

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  if (returnUrl && shouldSave) {
    return NextResponse.redirect(`${requestUrl.origin}/collections?save=${encodeURIComponent(returnUrl)}`);
  } else if (returnUrl) {
    return NextResponse.redirect(returnUrl);
  } else {
    return NextResponse.redirect(`${requestUrl.origin}/collections`);
  }
}
