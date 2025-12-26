import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { X, ExternalLink } from "lucide-react";
import Image from "next/image";
import Modal from "@/components/ui/Modal";
import { wrapOutboundUrl } from "@/lib/affiliate";
import { useEffect } from "react";

interface SideBySideCompareProps {
  products: Product[];
  onClose: () => void;
}

export default function SideBySideCompare({ products, onClose }: SideBySideCompareProps) {
  useEffect(() => {
    // Track compare metric
    const productIds = products.map(p => p.id);
    fetch('/api/metrics/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productIds }),
    });
  }, [products]);

  return (
    <Modal onClose={onClose} size="full">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-serif text-bridal-charcoal">Compare Side-by-Side</h2>
          <button onClick={onClose} className="p-2 hover:bg-bridal-rose/20 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto">
          {products.map((product) => (
            <div key={product.id} className="bridal-card overflow-hidden">
              {product.image_url && (
                <div className="relative aspect-[3/4] bg-bridal-rose/20">
                  <Image
                    src={product.image_url}
                    alt={product.title || 'Product'}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4 space-y-3">
                <h3 className="font-medium text-bridal-charcoal line-clamp-2">
                  {product.title || 'Untitled Product'}
                </h3>
                <p className="text-lg font-serif text-bridal-gold">
                  {formatPrice(product.price_number, product.currency)}
                </p>
                {product.designer && (
                  <p className="text-xs text-bridal-charcoal/60">By {product.designer}</p>
                )}
                <div className="space-y-1 text-xs text-bridal-charcoal/70">
                  {product.color && <p>Color: {product.color}</p>}
                  {product.fabric && <p>Fabric: {product.fabric}</p>}
                </div>
                <a
                  href={wrapOutboundUrl(product.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-bridal-gold hover:text-bridal-gold/80 text-sm"
                >
                  View <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
