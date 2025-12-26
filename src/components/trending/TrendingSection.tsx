"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import TrendingGrid from "./TrendingGrid";
import { Product } from "@/types";
import Skeleton from "@/components/ui/Skeleton";

interface TrendingSectionProps {
  showAll?: boolean;
}

export default function TrendingSection({ showAll = false }: TrendingSectionProps) {
  const [topSaved, setTopSaved] = useState<Product[]>([]);
  const [topCompared, setTopCompared] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadTrending = async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const limit = showAll ? 12 : 6;

      const { data: saved } = await supabase
        .from('products')
        .select('*')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('save_count', { ascending: false })
        .limit(limit);

      const { data: compared } = await supabase
        .from('products')
        .select('*')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('compare_count', { ascending: false })
        .limit(limit);

      setTopSaved(saved || []);
      setTopCompared(compared || []);
      setLoading(false);
    };

    loadTrending();
  }, [showAll]);

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {topSaved.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-3xl font-serif text-bridal-charcoal">Most Saved</h2>
          <TrendingGrid products={topSaved} />
        </div>
      )}

      {topCompared.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-3xl font-serif text-bridal-charcoal">Most Compared</h2>
          <TrendingGrid products={topCompared} />
        </div>
      )}

      {topSaved.length === 0 && topCompared.length === 0 && (
        <div className="bridal-card p-12 text-center">
          <p className="text-xl text-bridal-charcoal/70">No trending items yet</p>
          <p className="text-bridal-charcoal/50 mt-2">Start comparing outfits to see trends!</p>
        </div>
      )}
    </div>
  );
}
