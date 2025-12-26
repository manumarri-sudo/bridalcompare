import Link from "next/link";
import { Heart } from "lucide-react";

interface CollectionCardProps {
  collection: any;
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  const itemCount = collection.collection_items?.[0]?.count || 0;

  return (
    <Link href={`/collections/${collection.id}`}>
      <div className="bridal-card p-6 hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-bridal-gold/10 rounded-full flex items-center justify-center group-hover:bg-bridal-gold/20 transition-colors">
            <Heart className="w-6 h-6 text-bridal-gold" />
          </div>
          <span className="text-sm text-bridal-charcoal/60">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </div>
        <h3 className="text-xl font-serif text-bridal-charcoal group-hover:text-bridal-gold transition-colors">
          {collection.name}
        </h3>
        <p className="text-sm text-bridal-charcoal/50 mt-2">
          Created {new Date(collection.created_at).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
}
