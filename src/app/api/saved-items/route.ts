import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { product_id, collection_id, notes } = await request.json();

    if (!product_id || !collection_id) {
      return NextResponse.json(
        { error: 'product_id and collection_id are required' },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid auth token' },
        { status: 401 }
      );
    }

    const { data: savedItem, error: insertError } = await supabase
      .from('saved_items')
      .insert({
        collection_id,
        product_id,
        user_id: user.id,
        notes: notes || null,
      })
      .select(\`
        *,
        product:products(*),
        collection:collections(*)
      \`)
      .single();

    if (insertError) {
      if (insertError.message.includes('LIMIT_REACHED')) {
        return NextResponse.json(
          { 
            error: 'LIMIT_REACHED',
            message: 'Your wardrobe is full. Upgrade to Vara Pass to unlock unlimited space.',
            upgrade_url: '/vara-pass'
          },
          { status: 403 }
        );
      }
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      savedItem,
    });

  } catch (error: any) {
    console.error('❌ Save Item Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save item' },
      { status: 500 }
    );
  }
}
