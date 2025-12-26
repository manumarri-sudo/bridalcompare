"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { Loader2, Check, X } from "lucide-react";
import SaveToCollectionModal from "@/components/collections/SaveToCollectionModal";
import AuthModal from "@/components/auth/AuthModal";

function AddPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    const url = searchParams.get('url');
    
    if (!url) {
      setError('No URL provided');
      setLoading(false);
      return;
    }

    const addProduct = async () => {
      try {
        const response = await fetch('/api/add-single', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to add product');
        }

        setProduct(data.product);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    addProduct();
  }, [searchParams]);

  const handleSave = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowSaveModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bridal-cream">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-bridal-gold mx-auto" />
          <p className="text-bridal-charcoal">Adding product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bridal-cream">
        <div className="bridal-card p-8 max-w-md text-center space-y-4">
          <X className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-2xl font-serif text-bridal-charcoal">Oops!</h2>
          <p className="text-bridal-charcoal/70">{error}</p>
          <button onClick={() => router.push('/compare')} className="bridal-btn-primary">
            Go to Compare Page
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bridal-cream py-12">
      <div className="bridal-container max-w-2xl">
        <div className="bridal-card overflow-hidden">
          <div className="bg-bridal-gold/10 p-6 text-center">
            <Check className="w-12 h-12 text-bridal-gold mx-auto mb-3" />
            <h1 className="text-2xl font-serif text-bridal-charcoal">Product Added!</h1>
          </div>

          <div className="p-6 space-y-6">
            {product.image_url && (
              <div className="relative aspect-[3/4] bg-bridal-rose/20 rounded-lg overflow-hidden">
                <Image
                  src={product.image_url}
                  alt={product.title || 'Product'}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="space-y-3">
              <h2 className="text-xl font-medium text-bridal-charcoal">
                {product.title || 'Untitled Product'}
              </h2>
              <p className="text-2xl font-serif text-bridal-gold">
                {formatPrice(product.price_number, product.currency)}
              </p>
              {product.designer && (
                <p className="text-bridal-charcoal/70">By {product.designer}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {product.color && (
                  <span className="px-3 py-1 bg-bridal-gold-light text-sm rounded-full">
                    {product.color}
                  </span>
                )}
                {product.fabric && (
                  <span className="px-3 py-1 bg-bridal-mauve/30 text-sm rounded-full">
                    {product.fabric}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={handleSave} className="bridal-btn-primary flex-1">
                Save to Collection
              </button>
              <button 
                onClick={() => router.push('/compare')} 
                className="bridal-btn-secondary flex-1"
              >
                View All
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-bridal-charcoal/60">
          <p>💡 Tip: Bookmark the button below to quickly add products while shopping!</p>
        </div>
      </div>

      {showSaveModal && product && (
        <SaveToCollectionModal
          productId={product.id}
          onClose={() => setShowSaveModal(false)}
        />
      )}

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}

export default function AddPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-bridal-cream">
        <Loader2 className="w-12 h-12 animate-spin text-bridal-gold" />
      </div>
    }>
      <AddPageContent />
    </Suspense>
  );
}
