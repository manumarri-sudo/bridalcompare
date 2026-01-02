'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { EVENT_LABELS } from '@/lib/constants'
import CreateCollectionModal from '@/components/CreateCollectionModal'

export default function Collections() {
  const [collections, setCollections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchCollections = async () => {
    const { data, error } = await supabase
      .from('collections')
      .select('*, saved_items(count)')
      .order('created_at', { ascending: true })
    
    if (data) setCollections(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchCollections()
  }, [])

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-20">
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#FB7185] mb-2">My Wardrobe</h1>
            <p className="text-gray-500">Organize your looks by event.</p>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-full hover:border-[#FB7185] hover:text-[#FB7185] transition shadow-sm"
            >
              + New Collection
            </button>
            <Link href="/compare" className="px-6 py-3 bg-[#FB7185] text-white font-bold rounded-full hover:bg-[#F43F5E] transition shadow-md">
              + Add Item
            </Link>
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="h-48 bg-white rounded-3xl animate-pulse"></div>
            ))}
          </div>
        )}

        {/* Collection Grid */}
        {!loading && collections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((col) => (
              <div key={col.id} className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-4xl">{getIconForEvent(col.event_context)}</span>
                  <span className="bg-pink-50 text-[#FB7185] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {col.saved_items?.[0]?.count || 0} Items
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2 group-hover:text-[#FB7185] transition">
                  {col.title}
                </h3>
                <p className="text-sm text-gray-400 font-medium">
                  {EVENT_LABELS[col.event_context] || 'Custom Event'}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Empty State (Fallback) */}
        {!loading && collections.length === 0 && (
          <div className="bg-white rounded-3xl p-16 text-center shadow-xl border border-gray-100">
             <h2 className="text-2xl font-serif font-bold text-gray-400">No collections found.</h2>
             <button onClick={() => setIsModalOpen(true)} className="mt-4 text-[#FB7185] font-bold underline">Create one now</button>
          </div>
        )}
      </main>

      <CreateCollectionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onCreated={fetchCollections}
      />
    </div>
  )
}

// Helper for Icons
function getIconForEvent(type: string) {
  if (type?.includes('wedding')) return '💍';
  if (type?.includes('haldi') || type?.includes('pellikuthuru')) return '🌼';
  if (type?.includes('mehendi')) return '🌿';
  if (type?.includes('sangeet') || type?.includes('garba')) return '💃';
  if (type?.includes('reception')) return '🥂';
  if (type?.includes('trousseau')) return '✨';
  return '📁';
}
