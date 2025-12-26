import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { ExternalLink, Check } from "lucide-react";
import Image from "next/image";
import { wrapOutboundUrl } from "@/lib/affiliate";

interface CompareTableProps {
  products: Product[];
  selectedProducts: Product[];
  onToggleSelect: (product: Product) => void;
}

export default function CompareTable({ products, selectedProducts, onToggleSelect }: CompareTableProps) {
  return (
    <div className="bridal-card overflow-x-auto">
      <table className="w-full">
        <thead className="bg-bridal-gold-light border-b border-bridal-mauve/20">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-bridal-charcoal">Select</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-bridal-charcoal">Image</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-bridal-charcoal">Product</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-bridal-charcoal">Price</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-bridal-charcoal">Designer</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-bridal-charcoal">Details</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-bridal-charcoal">Link</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-bridal-mauve/10">
          {products.map((product) => {
            const isSelected = selectedProducts.some(p => p.id === product.id);
            return (
              <tr key={product.id} className="hover:bg-bridal-rose/5">
                <td className="px-4 py-3">
                  <button
                    onClick={() => onToggleSelect(product)}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-bridal-gold border-bridal-gold'
                        : 'bg-white border-bridal-mauve/50 hover:border-bridal-gold'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </button>
                </td>
                <td className="px-4 py-3">
                  {product.image_url && (
                    <div className="relative w-16 h-20">
                      <Image
                        src={product.image_url}
                        alt={product.title || 'Product'}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-bridal-charcoal">{product.title || 'Untitled'}</p>
                  <p className="text-xs text-bridal-charcoal/50">{product.source_domain}</p>
                </td>
                <td className="px-4 py-3 font-serif text-bridal-gold">
                  {formatPrice(product.price_number, product.currency)}
                </td>
                <td className="px-4 py-3 text-sm text-bridal-charcoal/70">
                  {product.designer || '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-1 text-sm">
                    {product.color && (
                      <p className="text-bridal-charcoal/70">Color: {product.color}</p>
                    )}
                    {product.fabric && (
                      <p className="text-bridal-charcoal/70">Fabric: {product.fabric}</p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={wrapOutboundUrl(product.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-bridal-gold hover:text-bridal-gold/80"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
