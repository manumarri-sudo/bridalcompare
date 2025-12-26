"use client";

import { useState } from "react";
import URLInput from "@/components/compare/URLInput";
import ProductGrid from "@/components/compare/ProductGrid";
import CompareTable from "@/components/compare/CompareTable";
import SideBySideCompare from "@/components/compare/SideBySideCompare";
import AdSlot from "@/components/layout/AdSlot";
import { Product } from "@/types";
import { LayoutGrid, Table } from "lucide-react";

export default function ComparePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showSideBySide, setShowSideBySide] = useState(false);

  const handleProductsExtracted = (newProducts: Product[]) => {
    setProducts(newProducts);
  };

  const handleToggleSelect = (product: Product) => {
    setSelectedProducts(prev => {
      const isSelected = prev.some(p => p.id === product.id);
      if (isSelected) {
        return prev.filter(p => p.id !== product.id);
      } else {
        if (prev.length >= 6) {
          alert("You can compare up to 6 items at once");
          return prev;
        }
        return [...prev, product];
      }
    });
  };

  const handleCompare = () => {
    if (selectedProducts.length < 2) {
      alert("Please select at least 2 items to compare");
      return;
    }
    setShowSideBySide(true);
  };

  return (
    <div className="bridal-container py-8">
      <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
        {/* Main Content */}
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-serif text-bridal-charcoal">Compare Outfits</h1>
            <p className="text-bridal-charcoal/70">
              Paste product URLs from your favorite bridal sites and compare them side-by-side
            </p>
          </div>

          {/* URL Input */}
          <URLInput onProductsExtracted={handleProductsExtracted} />

          {/* Results */}
          {products.length > 0 && (
            <div className="space-y-4">
              {/* View Toggle & Compare Button */}
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-bridal-gold text-white'
                        : 'bg-white border border-bridal-mauve/30 text-bridal-charcoal hover:bg-bridal-gold/5'
                    }`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'table'
                        ? 'bg-bridal-gold text-white'
                        : 'bg-white border border-bridal-mauve/30 text-bridal-charcoal hover:bg-bridal-gold/5'
                    }`}
                  >
                    <Table className="w-5 h-5" />
                  </button>
                </div>

                {selectedProducts.length > 0 && (
                  <button
                    onClick={handleCompare}
                    className="bridal-btn-primary"
                  >
                    Compare Selected ({selectedProducts.length})
                  </button>
                )}
              </div>

              {/* Products Display */}
              {viewMode === 'grid' ? (
                <ProductGrid
                  products={products}
                  selectedProducts={selectedProducts}
                  onToggleSelect={handleToggleSelect}
                />
              ) : (
                <CompareTable
                  products={products}
                  selectedProducts={selectedProducts}
                  onToggleSelect={handleToggleSelect}
                />
              )}
            </div>
          )}
        </div>

        {/* Sidebar - Desktop Only */}
        <aside className="hidden lg:block space-y-6">
          <AdSlot type="sidebar" />
        </aside>
      </div>

      {/* Side-by-Side Modal */}
      {showSideBySide && (
        <SideBySideCompare
          products={selectedProducts}
          onClose={() => setShowSideBySide(false)}
        />
      )}
    </div>
  );
}
