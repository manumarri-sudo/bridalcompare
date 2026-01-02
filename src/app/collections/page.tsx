'use client'
import Navbar from '@/components/Navbar'

export default function Collections() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-8 py-12">
        <h1 className="text-4xl font-serif text-gray-900 mb-8">My Collection</h1>
        
        {/* Empty State / Dashboard */}
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
          <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            🛍️
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Start curating your closet</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Use the Vara Chrome Extension to save items from any store, or add a link manually to start comparing.
          </p>
          
          <div className="flex justify-center gap-4">
            <a href="https://chrome.google.com/webstore" target="_blank" className="px-6 py-3 bg-[#FB7185] text-white rounded-xl font-medium hover:bg-[#F43F5E] transition">
              Get Chrome Extension
            </a>
            <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">
              + Add Link Manually
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
