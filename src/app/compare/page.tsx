'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Compare() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const router = useRouter()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return
    
    setLoading(true)
    setStatus('idle')

    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      
      if (!res.ok) {
        if (res.status === 401) {
           alert("Please log in to save items.")
           router.push('/login?return=/compare')
           return
        }
        throw new Error('Failed')
      }

      setStatus('success')
      setUrl('')
      setTimeout(() => router.push('/collections'), 1500)
    } catch (e) {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] bg-[#FFF8F0] flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-5xl font-serif text-gray-900 mb-4">Compare Outfits</h1>
        <p className="text-gray-500 mb-10 text-lg">
          Paste product URLs from your favorite designers and compare them side-by-side
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="relative">
            <input 
              required
              type="url" 
              placeholder="https://shopkynah.com/products/..." 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-5 pl-6 rounded-2xl border-2 border-orange-200/50 shadow-sm focus:border-orange-400 focus:outline-none transition text-lg bg-white"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-6 px-12 py-4 bg-gradient-to-r from-rose-400 to-orange-400 text-white rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Extracting...
              </>
            ) : (
              <>
                ✨ Extract & Compare
              </>
            )}
          </button>
        </form>

        {status === 'success' && (
          <div className="mt-8 p-4 bg-green-50 text-green-700 rounded-xl animate-fade-in-up border border-green-100">
            ✅ Saved! Redirecting you to your collection...
          </div>
        )}
        
        {status === 'error' && (
          <div className="mt-8 p-4 bg-red-50 text-red-600 rounded-xl animate-fade-in-up border border-red-100">
            ⚠️ We couldn't extract that link. Please check the URL and try again.
          </div>
        )}
      </div>
    </div>
  )
}
