"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"

export const dynamic = 'force-dynamic'

export default function CollectionsPage() {
  const [savedItems, setSavedItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => { checkAuthAndLoad() }, [])

  const checkAuthAndLoad = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push("/login"); return }
    await loadSavedItems()
  }

  const loadSavedItems = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data, error } = await supabase
        .from("saved_items")
        .select("id, created_at, products!inner(id, url, title, image_url, price_number, currency, designer, source_domain)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
      if (error) {
        console.error("Load error:", error)
        setSavedItems([])
      } else {
        setSavedItems(data || [])
      }
    } catch (error) {
      console.error("Failed:", error)
      setSavedItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (itemId: string) => {
    if (!confirm("Remove?")) return
    try {
      const { error } = await supabase.from("saved_items").delete().eq("id", itemId)
      if (error) throw error
      setSavedItems(items => items.filter(item => item.id !== itemId))
    } catch (error) {
      console.error("Delete failed:", error)
    }
  }

  const filteredItems = savedItems.filter(item => {
    if (!searchQuery) return true
    const search = searchQuery.toLowerCase()
    const product = item.products
    return (
      product?.title?.toLowerCase().includes(search) ||
      product?.designer?.toLowerCase().includes(search)
    )
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">♥</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">My Collections</h1>
        {savedItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <div className="text-6xl mb-6">🛍️</div>
            <h2 className="text-2xl font-bold mb-4">Start saving</h2>
            <p className="text-gray-600">Use the Chrome extension</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map(item => {
                const product = item.products
                return (
                  <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="relative aspect-[3/4] bg-gray-100">
                      {product?.image_url ? (
                        <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">👗</div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-sm text-gray-600 mb-1">{product?.designer || product?.source_domain}</div>
                      <h3 className="font-semibold mb-2">{product?.title || "Untitled"}</h3>
                      {product?.price_number && (
                        <div className="text-lg font-bold text-orange-600">
                          {product.currency === "INR" ? "₹" : "$"}
                          {product.price_number.toLocaleString()}
                        </div>
                      )}
                      <button onClick={() => handleDelete(item.id)} className="mt-3 w-full text-sm text-red-600">Delete</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
