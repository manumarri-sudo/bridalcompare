import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SaveMetricsSchema = z.object({
  productId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId } = SaveMetricsSchema.parse(body);

    // Get current count
    const { data: product } = await supabase
      .from('products')
      .select('save_count')
      .eq('id', productId)
      .single();

    if (product) {
      // Increment save_count
      const { error } = await supabase
        .from('products')
        .update({ save_count: product.save_count + 1 })
        .eq('id', productId);

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Save metrics error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
