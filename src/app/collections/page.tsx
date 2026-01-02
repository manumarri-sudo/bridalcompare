'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { EVENT_LABELS, getSmartIcon } from '@/lib/constants'
import CreateCollectionModal from '@/components/CreateCollectionModal'
import ConfirmModal from '@/components/ConfirmModal'
import { Trash2, CheckSquare, Square, Inbox } from 'lucide-react'

export default function Collections() {
  const [collections, setCollections] = useState<any[]>([])
  const [inboxCount, setInboxCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSelectMode, setIsSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchCollections = async () => {
    // 1. Fetch Named Collections
    const { data: cols } = await supabase
      .from('collections')
      .select('*, saved_items(count)')
      .order('created_at', { ascending: true })
    
    // 2. Fetch Inbox Count (Items with NO collection)
    const { count } = await supabase
      .from('saved_items')
      .select('*', { count: 'exact', head: true })
      .is('collection_id', null)

    if (cols) setCollections(cols)
    setInboxCount(count || 0)
    setLoading(false)
  }

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setSelectedIds(newSet)
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    await supabase.from('collections').delete().in('id', Array.from(selectedIds))
    setSelectedIds(new Set())
    setIsSelectMode(false)
    fetchCollections()
  }

  useEffect(() => { fetchCollections() }, [])

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-20">
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#FB7185] mb-2">My Wardrobe</h1>
            <p className="text-gray-500">Organize your looks by event.</p>
          </div>
          
          <div className="flex gap-3">
            {isSelectMode ? (
              <>
                <button onClick={() => setIsSelectMode(false)} className="px-6 py-3 bg-white text-gray-600 font-bold rounded-full hover:bg-gray-50">Cancel</button>
                <button 
                  onClick={() => setDeleteModalOpen(true)}
                  disabled={selectedIds.size === 0}
                  className="px-6 py-3 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 disabled:opacity-50"
                >
                  Delete ({selectedIds.size})
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setIsSelectMode(true)} className="px-6 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-full hover:text-[#FB7185]">Select</button>
                <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-full hover:border-[#FB7185] hover:text-[#FB7185]">+ New Collection</button>
                <Link href="/compare" className="px-6 py-3 bg-[#FB7185] text-white font-bold rounded-full hover:bg-[#F43F5E] shadow-md">+ Add Item</Link>
              </>
            )}
          </div>
        </div>
        
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* --- THE INBOX CARD (Captures Extension Saves) --- */}
            <Link href="/collections/inbox" className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer ring-2 ring-[#FB7185] ring-opacity-10">
              <div className="flex justify-between items-start mb-4">
                <span className="text-4xl text-[#FB7185]">📥</span>
                <span className="bg-pink-50 text-[#FB7185] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {inboxCount} Items
                </span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">Inbox / Unsorted</h3>
              <p className="text-sm text-gray-400 font-medium">Items from Extension go here</p>
            </Link>

            {/* User Collections */}
            {collections.map((col) => (
              <div 
                key={col.id} 
                onClick={() => isSelectMode ? toggleSelection(col.id) : null}
                className={`relative group bg-white p-8 rounded-3xl border shadow-sm transition duration-300 ${isSelectMode ? 'cursor-pointer hover:bg-gray-50' : ''} ${selectedIds.has(col.id) ? 'border-[#FB7185] ring-2 ring-[#FB7185] ring-opacity-20' : 'border-gray-100'}`}
              >
                {!isSelectMode ? (
                  <Link href={`/collections/${col.id}`} className="absolute inset-0 z-0"></Link>
                ) : (
                  <div className="absolute top-6 right-6 z-10 text-[#FB7185]">
                    {selectedIds.has(col.id) ? <CheckSquare size={24} fill="#FB7185" color="white" /> : <Square size={24} color="#D1D5DB" />}
                  </div>
                )}

                <div className="flex justify-between items-start mb-4">
                  <span className="text-4xl">{getSmartIcon ? getSmartIcon(col.title) : '📁'}</span>
                  <span className="bg-pink-50 text-[#FB7185] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {col.saved_items?.[0]?.count || 0} Items
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2 truncate">{col.title}</h3>
                <p className="text-sm text-gray-400 font-medium truncate">{col.event_context}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <CreateCollectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreated={fetchCollections} />
      
      <ConfirmModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={handleBulkDelete}
        title={`Delete ${selectedIds.size} Collection(s)?`}
        message="Are you sure? This will permanently delete these collections and all items inside them."
        isDeleting={true}
      />
    </div>
  )
}
