import { Product } from "@/types";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { ExternalLink, TrendingUp } from "lucide-react";
import { wrapOutboundUrl } from "@/lib/affiliate";

interface TrendingGridProps {
  products: Product[];
}

export default function TrendingGrid({ products }: TrendingGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bridal-card overflow-hidden group relative">
          <div className="absolute top-4 right-4 z-10 bg-bridal-gold text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Trending
          </div>

          {product.image_url && (
            <div className="relative aspect-[3/4] bg-bridal-rose/20">
              <Image
                src={product.image_url}
                alt={product.title || 'Product image'}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          <div className="p-4 space-y-3">
            <h3 className="font-medium text-bridal-charcoal line-clamp-2">
              {product.title || 'Untitled Product'}
            </h3>
            <p className="text-xl font-serif text-bridal-gold">
              {formatPrice(product.price_number, product.currency)}
            </p>
            {product.designer && (
              <p className="text-sm text-bridal-charcoal/60">By {product.designer}</p>
            )}
            <div className="flex items-center gap-4 text-xs text-bridal-charcoal/50">
              <span>{product.save_count} saves</span>
              <span>{product.compare_count} compares</span>
            </div>
            <a
              href={wrapOutboundUrl(product.url)}
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
  );
}
