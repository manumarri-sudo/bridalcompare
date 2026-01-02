'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('return') || '/collections'

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError("We couldn't find an account with those details. Please try again.")
      setLoading(false)
    } else {
      router.push(returnUrl)
      router.refresh()
    }
  }

  return (
    <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif font-bold text-[#FB7185] mb-2">vara</h1>
        <p className="text-gray-500">Welcome back.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <input 
          type="email" 
          required 
          placeholder="Email Address" 
          value={email}
          className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-[#FB7185] outline-none transition"
          onChange={(e) => setEmail(e.target.value)} 
        />
        
        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"} 
            required 
            placeholder="Password" 
            value={password}
            className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-[#FB7185] outline-none transition pr-10"
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-500 rounded-xl text-sm font-medium">{error}</div>}

        <button type="submit" disabled={loading} className="w-full py-4 bg-[#FB7185] text-white font-bold rounded-xl hover:bg-[#F43F5E] transition disabled:opacity-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
          {loading ? 'Logging In...' : 'Log In'}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-500">
        Don't have an account? <Link href="/signup" className="font-bold text-[#FB7185] hover:underline">Join</Link>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0] p-4">
      <Suspense><LoginForm /></Suspense>
    </div>
  )
}
