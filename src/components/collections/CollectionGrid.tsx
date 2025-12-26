import CollectionCard from "./CollectionCard";
import { Collection } from "@/types";

interface CollectionGridProps {
  collections: any[];
}

export default function CollectionGrid({ collections }: CollectionGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
}
