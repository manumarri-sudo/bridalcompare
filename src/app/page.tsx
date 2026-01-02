'use client'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
      setLoading(false)
    }
    checkSession()
  }, [])

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isLoggedIn) {
      router.push('/collections')
    } else {
      router.push('/signup')
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto pb-20 mt-10">
        <div className="mb-8 opacity-0 animate-fade-in-up" style={{animationDelay: '0.1s', animationFillMode: 'forwards'}}>
           <span className="px-5 py-2 rounded-full bg-white border border-pink-100 text-[#FB7185] text-xs font-bold tracking-widest uppercase shadow-sm">
             The Future of South Asian Fashion
           </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-serif text-[#FB7185] mb-6 leading-tight tracking-tight opacity-0 animate-fade-in-up" style={{animationDelay: '0.2s', animationFillMode: 'forwards'}}>
          Curate your <br/>
          <span className="text-gray-800 italic">dream wardrobe.</span>
        </h1>
        
        {/* --- RESTORED TEXT --- */}
        <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl leading-relaxed font-light opacity-0 animate-fade-in-up" style={{animationDelay: '0.3s', animationFillMode: 'forwards'}}>
          Save items from any website, compare them side-by-side, and keep everything in one organized place. 
          No more lost screenshots or open tabs.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 opacity-0 animate-fade-in-up" style={{animationDelay: '0.4s', animationFillMode: 'forwards'}}>
          <button 
            onClick={handleCtaClick}
            className="px-10 py-4 bg-[#FB7185] text-white rounded-full font-bold text-lg hover:bg-[#F43F5E] transition shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            {loading ? "Loading..." : isLoggedIn ? "Go to Dashboard" : "Start Curating Free"}
          </button>
          
          <Link href="/about" className="px-10 py-4 bg-white text-gray-600 border border-gray-200 rounded-full font-medium text-lg hover:bg-gray-50 transition hover:border-gray-300">
            Our Story
          </Link>
        </div>
      </main>
    </div>
  )
}
