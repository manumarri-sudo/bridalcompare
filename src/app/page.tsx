import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <Navbar />
      
      <main className="flex flex-col items-center justify-center px-4 py-20 text-center max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-7xl font-serif text-[#FB7185] mb-6 tracking-tight">
          curate your <br/> <span className="text-gray-800">dream wardrobe.</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
          The ultimate tool for South Asian fashion. Save items from any website, compare outfits side-by-side, and build your perfect collection.
        </p>

        <div className="flex gap-4">
          <Link href="/signup" className="px-8 py-4 bg-[#FB7185] text-white rounded-full font-bold text-lg hover:bg-[#F43F5E] transition shadow-xl hover:scale-105 duration-200">
            Start Curating Free
          </Link>
          <Link href="/about" className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-medium text-lg hover:bg-gray-50 transition">
            Our Story
          </Link>
        </div>

        {/* Hero Image / Visual would go here */}
        <div className="mt-16 p-4 bg-white rounded-3xl shadow-2xl border border-gray-100 rotate-2 hover:rotate-0 transition duration-500">
           <div className="w-full h-64 md:h-96 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
             <span className="text-lg">✨ App Preview / Dashboard Image ✨</span>
           </div>
        </div>
      </main>
    </div>
  )
}
