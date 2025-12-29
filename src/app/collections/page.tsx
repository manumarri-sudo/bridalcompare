"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Grid, List, Search, Trash2, ExternalLink } from "lucide-react";

export default function CollectionsPage() {
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  const supabase = createClientComponentClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoSaveUrl = searchParams.get('save');

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login?return=/collections');
      return;
    }
    await loadSavedItems();
  };

  const loadSavedItems = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('saved_items')
        .select(`
          id,
          notes,
          created_at,
          product:products(id, url, title, image_url, price_number, currency, designer, source_domain),
          collection:collections(id, title)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedItems(data || []);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Remove this item?')) return;
    try {
      const { error } = await supabase.from('saved_items').delete().eq('id', itemId);
      if (error) throw error;
      setSavedItems(items => items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const filteredItems = savedItems.filter(item => {
    return !searchQuery || 
      item.product?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product?.designer?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="vara-card p-12 text-center">
          <div className="vara-spinner mb-4"></div>
          <p className="text-vara-warmGray">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-display mb-4">My Collections</h1>
      <p className="text-xl text-vara-warmGray mb-12">
        {savedItems.length} {savedItems.length === 1 ? 'outfit' : 'outfits'} saved
      </p>

      {savedItems.length === 0 ? (
        <div className="vara-card p-16 text-center">
          <div className="text-6xl mb-6">🛍️</div>
          <h2 className="text-2xl font-display mb-4">Start saving outfits</h2>
          <p className="text-vara-warmGray mb-8">Use the Chrome extension to save items</p>
          <Link href="/compare" className="vara-btn-primary">Compare Outfits</Link>
        </div>
      ) : (
        <>
          <div className="vara-card p-6 mb-8">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-vara-marigold focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <div key={item.id} className="vara-card p-0 overflow-hidden group hover:shadow-xl transition-shadow">
                <div className="relative aspect-[3/4] bg-gray-100">
                  {item.product?.image_url ? (
                    <img src={item.product.image_url} alt={item.product.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">👗</div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <a href={item.product?.url} target="_blank" className="p-3 bg-white rounded-full">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                    <button onClick={() => handleDelete(item.id)} className="p-3 bg-white rounded-full hover:bg-red-500 hover:text-white">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-sm text-gray-600 mb-1">{item.product?.designer || item.product?.source_domain}</div>
                  <h3 className="font-medium mb-2">{item.product?.title || 'Untitled'}</h3>
                  {item.product?.price_number && (
                    <div className="text-lg font-bold vara-gradient-text">
                      {item.product.currency === 'INR' ? '₹' : '$'}{item.product.price_number.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
