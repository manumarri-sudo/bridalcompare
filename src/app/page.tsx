'use client'
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
    <div className="flex-grow flex flex-col items-center justify-center px-4 text-center max-w-6xl mx-auto pb-20 mt-8">
        <div className="mb-8 animate-fade-in-up">
           <span className="px-5 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-sm font-medium tracking-wide shadow-sm flex items-center gap-2 mx-auto w-fit">
             ✨ Your South Asian wardrobe, organized
           </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-serif text-gray-900 mb-6 leading-tight tracking-tight">
          Save every outfit you love, <br/>
          <span className="bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
            all in one beautiful place
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl leading-relaxed font-light">
          From wedding lehengas to everyday kurtas - organize outfits from 100+ 
          designers, compare prices, and never lose track of what you love.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 items-center">
          <button 
            onClick={handleCtaClick}
            className="px-10 py-4 bg-gradient-to-r from-rose-400 to-orange-400 text-white rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition duration-200 shadow-lg"
          >
            {loading ? "Loading..." : isLoggedIn ? "Go to Dashboard" : "Start Saving Outfits"}
          </button>
          
          <Link href="/about" className="px-10 py-4 bg-white text-gray-700 rounded-full font-medium text-lg hover:bg-gray-50 transition shadow-md border border-gray-100">
            Our Story
          </Link>
        </div>

        <div className="mt-24">
            <h3 className="text-3xl font-serif text-gray-800">Perfect for every occasion</h3>
        </div>
    </div>
  )
}
