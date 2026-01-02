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
    supabase.auth.getSession().then(({ data: { session } }) => {
      updateUserInterface(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      updateUserInterface(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const updateUserInterface = (currentUser: User | null) => {
    setUser(currentUser)
    setLoading(false)
    
    if (currentUser) {
      const meta = currentUser.user_metadata || {}
      
      // LOGIC: Name > Full Name > Email > fallback
      if (meta.first_name && meta.first_name.trim() !== '') {
        setDisplayName(meta.first_name)
      } else if (meta.full_name && meta.full_name.trim() !== '') {
        setDisplayName(meta.full_name.split(' ')[0])
      } else if (currentUser.email) {
        // Fallback to email username if no name exists
        setDisplayName(currentUser.email.split('@')[0])
      } else {
        // Absolute last resort, but practically impossible if logged in
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
    <nav className="flex items-center justify-between px-6 md:px-12 py-6 bg-[#FFF8F0] sticky top-0 z-50 bg-opacity-95 backdrop-blur-sm border-b border-pink-50/50">
      <Link href="/" className="text-3xl font-serif font-bold text-[#FB7185] tracking-tight hover:opacity-80 transition">vara</Link>
      
      <div className="flex items-center gap-4 md:gap-8">
        <Link href="/collections" className="text-gray-600 hover:text-[#FB7185] transition text-sm font-bold tracking-wide uppercase">Collections</Link>
        <Link href="/compare" className="text-gray-600 hover:text-[#FB7185] transition text-sm font-bold tracking-wide uppercase">Compare</Link>
        
        {loading ? (
          <div className="w-24 h-8 bg-pink-100 rounded-full animate-pulse"></div>
        ) : user ? (
          <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-gray-800 capitalize">Hi, {displayName}</span>
            </div>
            <button onClick={handleSignOut} className="text-xs font-medium text-gray-400 hover:text-[#FB7185] transition uppercase tracking-wide">
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-[#FB7185] text-sm font-bold transition uppercase tracking-wide">
              Log In
            </Link>
            <Link href="/signup" className="px-6 py-2.5 bg-[#FB7185] text-white rounded-full text-sm font-bold hover:bg-[#F43F5E] transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Join
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
