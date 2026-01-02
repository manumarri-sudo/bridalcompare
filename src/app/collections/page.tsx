'use client'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function Collections() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-8 py-12">
        <h1 className="text-4xl font-serif text-gray-900 mb-8">My Collection</h1>
        
        {/* Empty State / Dashboard */}
        <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
          <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
            🛍️
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4 font-serif">Start curating your closet</h2>
          <p className="text-gray-500 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
            Use the Vara Chrome Extension to save items from any store, or add a link manually to start comparing.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="https://chrome.google.com/webstore" target="_blank" className="px-8 py-4 bg-[#FB7185] text-white rounded-xl font-bold text-lg hover:bg-[#F43F5E] transition shadow-lg hover:shadow-xl hover:-translate-y-1">
              Get Chrome Extension
            </a>
            {/* FIXED: Links to /compare now */}
            <Link href="/compare" className="px-8 py-4 bg-white border-2 border-gray-100 text-gray-700 rounded-xl font-bold text-lg hover:border-[#FB7185] hover:text-[#FB7185] transition hover:-translate-y-1">
              + Add Link Manually
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
