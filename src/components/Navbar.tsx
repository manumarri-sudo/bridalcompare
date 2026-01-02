'use client'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const router = useRouter()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      updateUser(session?.user ?? null)
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      updateUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const updateUser = (currentUser: User | null) => {
    setUser(currentUser)
    setLoading(false)
    if (currentUser) {
      const meta = currentUser.user_metadata
      if (meta?.first_name) setName(meta.first_name)
      else if (meta?.full_name) setName(meta.full_name.split(' ')[0])
      else if (currentUser.email) setName(currentUser.email.split('@')[0])
      else setName('Friend')
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <nav className="flex items-center justify-between px-6 md:px-12 py-6 bg-[#FFF8F0]">
      <Link href="/" className="text-3xl font-serif font-bold text-[#FB7185] tracking-tight hover:opacity-80 transition">vara</Link>
      
      <div className="flex items-center gap-6">
        <Link href="/collections" className="text-gray-600 hover:text-[#FB7185] transition text-sm font-medium tracking-wide">COLLECTIONS</Link>
        <Link href="/compare" className="text-gray-600 hover:text-[#FB7185] transition text-sm font-medium tracking-wide">COMPARE</Link>
        <Link href="/about" className="hidden sm:block text-gray-600 hover:text-[#FB7185] transition text-sm font-medium tracking-wide">OUR STORY</Link>
        
        {loading ? (
          <div className="w-20 h-8 bg-pink-50 rounded-full animate-pulse"></div>
        ) : user ? (
          <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
            <span className="text-sm font-medium text-gray-700 hidden sm:block">Hi, {name}</span>
            <button onClick={handleSignOut} className="text-xs text-gray-400 hover:text-[#FB7185] transition">SIGN OUT</button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-[#FB7185] text-sm font-medium transition">
              LOG IN
            </Link>
            <Link href="/signup" className="px-6 py-2 bg-[#FB7185] text-white rounded-full text-sm font-bold hover:bg-[#F43F5E] transition shadow-md hover:shadow-lg">
              JOIN
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
