'use client'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [displayName, setDisplayName] = useState('')
  const router = useRouter()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      updateUI(session?.user ?? null)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      updateUI(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const updateUI = (currentUser: User | null) => {
    setUser(currentUser)
    setLoading(false)
    
    if (currentUser) {
      const meta = currentUser.user_metadata || {}
      // STRICT LOGIC: If no first name, use Email username. NEVER use 'Friend'.
      if (meta.first_name) {
        setDisplayName(meta.first_name)
      } else if (meta.full_name) {
        setDisplayName(meta.full_name.split(' ')[0])
      } else if (currentUser.email) {
        // "manaswi@gmail.com" -> "Manaswi"
        const emailName = currentUser.email.split('@')[0]
        setDisplayName(emailName.charAt(0).toUpperCase() + emailName.slice(1))
      } else {
        setDisplayName('Stylist') 
      }
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login')
  }

  return (
    <nav className="flex items-center justify-between px-6 md:px-12 py-6 bg-[#FFF8F0]">
      {/* Logo with Gradient Icon */}
      <Link href="/" className="flex items-center gap-2 group">
        <span className="text-2xl text-rose-400">♥</span>
        <span className="text-3xl font-serif font-bold text-orange-400 group-hover:opacity-80 transition">Vara</span>
      </Link>
      
      <div className="flex items-center gap-8">
        <Link href="/compare" className="text-gray-600 hover:text-orange-500 transition text-sm font-medium">Compare</Link>
        <Link href="/about" className="text-gray-600 hover:text-orange-500 transition text-sm font-medium">About</Link>
        
        {loading ? (
          <div className="w-24 h-10 bg-orange-100 rounded-full animate-pulse"></div>
        ) : user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">Hi, {displayName}</span>
            <button onClick={handleSignOut} className="text-sm text-gray-400 hover:text-rose-500">Sign Out</button>
          </div>
        ) : (
          <Link href="/login" className="px-8 py-3 bg-gradient-to-r from-rose-400 to-orange-400 text-white rounded-full font-bold text-sm hover:shadow-lg hover:-translate-y-0.5 transition duration-200">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}
