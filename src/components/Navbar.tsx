'use client'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState<string>('')
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        // Get name from metadata
        const meta = session.user.user_metadata
        if (meta?.first_name) setName(meta.first_name)
        else if (meta?.full_name) setName(meta.full_name.split(' ')[0])
        else setName('Friend')
      }
    }
    getUser()
  }, [])

  return (
    <nav className="flex items-center justify-between px-8 py-6 bg-[#FFF8F0]">
      <Link href="/" className="text-3xl font-bold text-[#FB7185] tracking-tight">vara</Link>
      
      <div className="flex items-center gap-6">
        <Link href="/collections" className="text-gray-600 hover:text-[#FB7185] transition">Collections</Link>
        <Link href="/compare" className="text-gray-600 hover:text-[#FB7185] transition">Compare</Link>
        
        {user ? (
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <span className="text-sm font-medium text-gray-700">Hi, {name}</span>
            <div className="h-8 w-8 rounded-full bg-[#FB7185] flex items-center justify-center text-white text-xs">
              {name.charAt(0)}
            </div>
          </div>
        ) : (
          <Link href="/login" className="px-5 py-2 bg-[#FB7185] text-white rounded-full font-medium hover:bg-[#F43F5E] transition">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}
