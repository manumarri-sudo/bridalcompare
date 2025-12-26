import { Product } from "@/types";
import ProductCard from "./ProductCard";
import AdSlot from "@/components/layout/AdSlot";

interface ProductGridProps {
  products: Product[];
  selectedProducts: Product[];
  onToggleSelect: (product: Product) => void;
}

export default function ProductGrid({ products, selectedProducts, onToggleSelect }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <>
          <ProductCard
            key={product.id}
            product={product}
            isSelected={selectedProducts.some(p => p.id === product.id)}
            onToggleSelect={onToggleSelect}
          />
          {/* Insert ad after every 6 products on mobile */}
          {(index + 1) % 6 === 0 && (
            <div key={`ad-${index}`} className="md:hidden">
              <AdSlot type="inline" />
            </div>
          )}
        </>
      ))}
    </div>
  );
}
