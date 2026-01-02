'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import ConfirmModal from '@/components/ConfirmModal'
import { CheckSquare, Square } from 'lucide-react'

export default function Inbox() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSelectMode, setIsSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchData = async () => {
    // Fetch items with NULL collection_id
    const { data: saved } = await supabase
      .from('saved_items')
      .select('id, products (title, image_url, price_number, url, designer)')
      .is('collection_id', null)
      .order('created_at', { ascending: false })
    
    setItems(saved || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const toggleSelection = (itemId: string) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(itemId)) newSet.delete(itemId)
    else newSet.add(itemId)
    setSelectedIds(newSet)
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    await supabase.from('saved_items').delete().in('id', Array.from(selectedIds))
    setSelectedIds(new Set())
    setIsSelectMode(false)
    fetchData()
  }

  if (loading) return <div className="min-h-screen bg-[#FFF8F0] p-12 text-center">Loading...</div>

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-20">
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="flex justify-between items-center mb-8">
           <Link href="/collections" className="text-sm font-bold text-gray-400 hover:text-[#FB7185] uppercase tracking-wide">← Back to Wardrobe</Link>
           
           <div className="flex gap-3">
             {isSelectMode ? (
               <>
                 <button onClick={() => setIsSelectMode(false)} className="px-5 py-2 bg-white text-gray-600 font-bold rounded-full hover:bg-gray-50 text-sm">Cancel</button>
                 <button 
                   onClick={() => setDeleteModalOpen(true)}
                   disabled={selectedIds.size === 0}
                   className="px-5 py-2 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 disabled:opacity-50 text-sm"
                 >
                   Delete ({selectedIds.size})
                 </button>
               </>
             ) : (
               <button onClick={() => setIsSelectMode(true)} className="px-5 py-2 bg-white border border-gray-200 text-gray-600 font-bold rounded-full hover:text-[#FB7185] text-sm">Manage Items</button>
             )}
           </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif text-[#FB7185] mb-2">Inbox / Unsorted</h1>
        <p className="text-gray-500 mb-12">{items.length} items saved from extension</p>

        {items.length === 0 ? (
           <div className="bg-white rounded-3xl p-16 text-center border border-gray-100">
             <p className="text-gray-400 mb-4">Your inbox is empty.</p>
             <a href="https://shopkynah.com" target="_blank" className="text-[#FB7185] font-bold underline">Go shopping!</a>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div 
                key={item.id} 
                onClick={(e) => {
                  if (isSelectMode) { e.preventDefault(); toggleSelection(item.id); }
                }}
                className={`relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group ${isSelectMode ? 'cursor-pointer' : ''}`}
              >
                {!isSelectMode ? (
                   <a href={item.products.url} target="_blank" className="absolute inset-0 z-10"></a>
                ) : (
                   <div className="absolute top-3 right-3 z-20 text-[#FB7185]">
                     {selectedIds.has(item.id) ? <CheckSquare size={24} fill="#FB7185" color="white" /> : <Square size={24} fill="white" color="#D1D5DB" />}
                   </div>
                )}
                
                <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                   {item.products.image_url ? (
                     <img src={item.products.image_url} alt={item.products.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                   )}
                </div>
                <div className="p-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{item.products.designer || 'Unknown'}</p>
                  <h3 className="font-serif font-bold text-gray-800 truncate">{item.products.title || 'Untitled Item'}</h3>
                  <p className="text-[#FB7185] font-bold mt-2">
                    {item.products.price_number ? `₹${item.products.price_number}` : 'Price not found'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <ConfirmModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={handleBulkDelete}
        title={`Delete ${selectedIds.size} Item(s)?`}
        message="Are you sure? You can't undo this action."
        isDeleting={true}
      />
    </div>
  )
}
