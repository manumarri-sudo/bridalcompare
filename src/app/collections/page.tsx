'use client'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function Collections() {
  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="flex items-end justify-between mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-[#FB7185]">My Collection</h1>
          <Link href="/compare" className="hidden md:block text-gray-500 hover:text-[#FB7185] transition border-b border-transparent hover:border-[#FB7185]">
            + Add Link Manually
          </Link>
        </div>
        
        {/* Empty State / Dashboard */}
        <div className="bg-white rounded-3xl p-16 text-center shadow-xl border border-gray-100 animate-fade-in-up">
          <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">
            🛍️
          </div>
          <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">Start curating your closet</h2>
          <p className="text-gray-500 mb-10 max-w-lg mx-auto text-lg leading-relaxed font-light">
            Use the Vara Chrome Extension to save items from any store, or add a link manually to start comparing.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <a 
              href="https://chrome.google.com/webstore" 
              target="_blank" 
              className="px-8 py-4 bg-[#FB7185] text-white rounded-full font-bold text-lg hover:bg-[#F43F5E] transition shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Get Chrome Extension
            </a>
            
            {/* --- THE FIX: Explicitly links to /compare --- */}
            <Link 
              href="/compare" 
              className="px-8 py-4 bg-white border border-gray-200 text-gray-600 rounded-full font-bold text-lg hover:border-[#FB7185] hover:text-[#FB7185] transition hover:-translate-y-1"
            >
              + Add Link Manually
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
