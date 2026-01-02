'use client'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    // 1. Check active session immediately
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }
    checkUser()

    // 2. Listen for changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  // Helper to get display name
  const getDisplayName = () => {
    if (!user) return ''
    const meta = user.user_metadata
    if (meta?.first_name) return meta.first_name
    if (meta?.full_name) return meta.full_name.split(' ')[0]
    return 'Friend'
  }

  return (
    <nav className="flex items-center justify-between px-8 py-6 bg-[#FFF8F0]">
      <Link href="/" className="text-3xl font-bold text-[#FB7185] tracking-tight hover:opacity-80 transition">vara</Link>
      
      <div className="flex items-center gap-6">
        <Link href="/collections" className="text-gray-600 hover:text-[#FB7185] transition font-medium">Collections</Link>
        <Link href="/compare" className="text-gray-600 hover:text-[#FB7185] transition font-medium">Compare</Link>
        
        {loading ? (
          <div className="w-20 h-8 bg-gray-100 rounded-full animate-pulse"></div>
        ) : user ? (
          <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
            <span className="text-sm font-medium text-gray-700 hidden sm:block">Hi, {getDisplayName()}</span>
            <div className="h-9 w-9 rounded-full bg-[#FB7185] flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {getDisplayName().charAt(0)}
            </div>
            <button onClick={handleSignOut} className="text-xs text-gray-400 hover:text-gray-600">Sign Out</button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-gray-600 hover:text-[#FB7185] font-medium transition">
              Log In
            </Link>
            <Link href="/signup" className="px-5 py-2.5 bg-[#FB7185] text-white rounded-full font-bold hover:bg-[#F43F5E] transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
