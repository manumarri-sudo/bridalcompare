"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Heart, ExternalLink, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import SaveToCollectionModal from "@/components/collections/SaveToCollectionModal";
import AuthModal from "@/components/auth/AuthModal";
import { wrapOutboundUrl } from "@/lib/affiliate";

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onToggleSelect: (product: Product) => void;
}

export default function ProductCard({ product, isSelected, onToggleSelect }: ProductCardProps) {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleSave = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowSaveModal(true);
  };

  return (
    <>
      <div className="bridal-card overflow-hidden group relative">
        {/* Selection Checkbox */}
        <button
          onClick={() => onToggleSelect(product)}
          className={`absolute top-4 left-4 z-10 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
            isSelected
              ? 'bg-bridal-gold border-bridal-gold'
              : 'bg-white border-bridal-mauve/50 hover:border-bridal-gold'
          }`}
        >
          {isSelected && <Check className="w-4 h-4 text-white" />}
        </button>

        {/* Image */}
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

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-bridal-charcoal line-clamp-2 flex-1">
              {product.title || 'Untitled Product'}
            </h3>
            <button
              onClick={handleSave}
              className="flex-shrink-0 p-2 hover:bg-bridal-rose/20 rounded-full transition-colors"
            >
              <Heart className="w-5 h-5 text-bridal-gold" />
            </button>
          </div>

          <p className="text-xl font-serif text-bridal-gold">
            {formatPrice(product.price_number, product.currency)}
          </p>

          {product.designer && (
            <p className="text-sm text-bridal-charcoal/60">By {product.designer}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {product.color && (
              <span className="px-2 py-1 bg-bridal-gold-light text-xs rounded-full text-bridal-charcoal/70">
                {product.color}
              </span>
            )}
            {product.fabric && (
              <span className="px-2 py-1 bg-bridal-mauve/30 text-xs rounded-full text-bridal-charcoal/70">
                {product.fabric}
              </span>
            )}
          </div>

          <a
            href={wrapOutboundUrl(product.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-bridal-gold hover:text-bridal-gold/80 text-sm font-medium"
          >
            View on {product.source_domain} <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {showSaveModal && (
        <SaveToCollectionModal
          productId={product.id}
          onClose={() => setShowSaveModal(false)}
        />
      )}

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  );
}
