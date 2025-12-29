import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    return NextResponse.json({ authenticated: !!session, user: session?.user || null });
  } catch (error) {
    return NextResponse.json({ authenticated: false, user: null });
  }
}
