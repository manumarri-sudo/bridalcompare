"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import Link from "next/link"

export default function CollectionsPage() {
  const [savedItems, setSavedItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    checkAuthAndLoad()
  }, [])

  const checkAuthAndLoad = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      router.push("/login?return=/collections")
      return
    }

    await loadSavedItems()
  }

  const loadSavedItems = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("saved_items")
        .select(`
          id,
          notes,
          created_at,
          product:products(id, url, title, image_url, price_number, currency, designer, source_domain),
          collection:collections(id, title)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setSavedItems(data || [])
    } catch (error) {
      console.error("Failed to load items:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (itemId: string) => {
    if (!confirm("Remove this item?")) return

    try {
      const { error } = await supabase
        .from("saved_items")
        .delete()
        .eq("id", itemId)

      if (error) throw error
      setSavedItems(items => items.filter(item => item.id !== itemId))
    } catch (error) {
      console.error("Delete failed:", error)
    }
  }

  const filteredItems = savedItems.filter(item => {
    if (!searchQuery) return true
    const search = searchQuery.toLowerCase()
    return (
      item.product?.title?.toLowerCase().includes(search) ||
      item.product?.designer?.toLowerCase().includes(search)
    )
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">♥</div>
          <p className="text-gray-600">Loading your collection...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Collections</h1>
          <p className="text-xl text-gray-600">
            {savedItems.length} {savedItems.length === 1 ? "outfit" : "outfits"} saved
          </p>
        </div>

        {savedItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <div className="text-6xl mb-6">🛍️</div>
            <h2 className="text-2xl font-bold mb-4">Start saving outfits</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Use the Vara Chrome extension to save items with one click
            </p>
            <Link
              href="/compare"
              className="inline-block bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-pink-600 hover:to-orange-600"
            >
              Compare Outfits
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search outfits..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
                  <div className="relative aspect-[3/4] bg-gray-100">
                    {item.product?.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        👗
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <a
                        href={item.product?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white rounded-full hover:bg-gray-100"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-3 bg-white rounded-full hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-gray-600 mb-1">
                      {item.product?.designer || item.product?.source_domain}
                    </div>
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {item.product?.title || "Untitled"}
                    </h3>
                    {item.product?.price_number && (
                      <div className="text-lg font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                        {item.product.currency === "INR" ? "₹" : "$"}
                        {item.product.price_number.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
