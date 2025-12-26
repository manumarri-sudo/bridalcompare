import { createClient } from "@/lib/supabase/server";
import CollectionGrid from "@/components/collections/CollectionGrid";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function CollectionsPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/');
  }

  const { data: collections, error } = await supabase
    .from('collections')
    .select('*, collection_items(count)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="bridal-container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-serif text-bridal-charcoal">My Collections</h1>
          <p className="text-bridal-charcoal/70 mt-2">
            Organize your favorite outfits by event
          </p>
        </div>
        <Link href="/compare" className="bridal-btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Items
        </Link>
      </div>

      {collections && collections.length > 0 ? (
        <CollectionGrid collections={collections} />
      ) : (
        <div className="bridal-card p-12 text-center space-y-4">
          <p className="text-xl text-bridal-charcoal/70">No collections yet</p>
          <p className="text-bridal-charcoal/50">Start comparing outfits and save your favorites!</p>
          <Link href="/compare" className="bridal-btn-primary inline-block mt-4">
            Start Comparing
          </Link>
        </div>
      )}
    </div>
  );
}
