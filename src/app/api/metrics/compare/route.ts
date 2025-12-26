import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CompareMetricsSchema = z.object({
  productIds: z.array(z.string()).min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productIds } = CompareMetricsSchema.parse(body);

    // Increment compare_count for all products
    for (const productId of productIds) {
      await supabase
        .from('products')
        .update({ compare_count: supabase.raw('compare_count + 1') })
        .eq('id', productId);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Compare metrics error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
