import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { wrapOutboundUrl } from "@/lib/affiliate";

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/');
  }

  const { data: collection, error: collectionError } = await supabase
    .from('collections')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (collectionError || !collection) {
    notFound();
  }

  const { data: items } = await supabase
    .from('collection_items')
    .select('*, product:products(*)')
    .eq('collection_id', id)
    .order('created_at', { ascending: false });

  return (
    <div className="bridal-container py-8 space-y-8">
      <div>
        <Link href="/collections" className="inline-flex items-center gap-2 text-bridal-gold hover:text-bridal-gold/80 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Collections
        </Link>
        <h1 className="text-4xl font-serif text-bridal-charcoal">{collection.name}</h1>
        <p className="text-bridal-charcoal/70 mt-2">
          {items?.length || 0} {items?.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      {items && items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item: any) => (
            <div key={item.id} className="bridal-card overflow-hidden group">
              {item.product.image_url && (
                <div className="relative aspect-[3/4] bg-bridal-rose/20">
                  <Image
                    src={item.product.image_url}
                    alt={item.product.title || 'Product image'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-4 space-y-3">
                <h3 className="font-medium text-bridal-charcoal line-clamp-2">
                  {item.product.title || 'Untitled Product'}
                </h3>
                <p className="text-lg font-serif text-bridal-gold">
                  {formatPrice(item.product.price_number, item.product.currency)}
                </p>
                {item.product.designer && (
                  <p className="text-sm text-bridal-charcoal/60">By {item.product.designer}</p>
                )}
                <a
                  href={wrapOutboundUrl(item.product.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-bridal-gold hover:text-bridal-gold/80 text-sm"
                >
                  View Product <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bridal-card p-12 text-center space-y-4">
          <p className="text-xl text-bridal-charcoal/70">This collection is empty</p>
          <Link href="/compare" className="bridal-btn-primary inline-block">
            Add Items
          </Link>
        </div>
      )}
    </div>
  );
}
