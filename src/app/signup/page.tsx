"use client"
import { Suspense } from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import Link from "next/link"

function SignupForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => { checkSession() }, [])

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) router.push("/collections")
  }

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return "Password must be at least 8 characters"
    if (!/[A-Z]/.test(pwd)) return "Password must contain an uppercase letter"
    if (!/[a-z]/.test(pwd)) return "Password must contain a lowercase letter"
    if (!/[0-9]/.test(pwd)) return "Password must contain a number"
    if (!/[!@#$%^&*]/.test(pwd)) return "Password must contain a special character (!@#$%^&*)"
    return null
  }

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
    if (error) setError(error.message)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }
    setLoading(true)
    setError("")
    try {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: window.location.origin + "/auth/callback" }
      })
      if (error) throw error
      setSuccess(true)
      if (data.session) {
        const returnUrl = searchParams.get("return")
        router.push(returnUrl || "/collections")
      }
    } catch (err: any) {
      setError(err.message || "Failed")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="text-5xl mb-4">✉️</div>
          <h1 className="text-3xl font-bold mb-4">Check your email</h1>
          <p className="text-gray-600 mb-2">We sent a confirmation link to</p>
          <p className="font-semibold text-gray-900 mb-4">{email}</p>
          <p className="text-sm text-gray-500">Click the link to start saving your favorite outfits!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">♥</div>
          <h1 className="text-3xl font-bold mb-2">Join Vara</h1>
          <p className="text-gray-600">Save and organize your dream outfits</p>
        </div>
        <button onClick={handleGoogleSignup} className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors mb-4">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">or</span></div>
        </div>
        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 border rounded-lg" />
            <p className="text-xs text-gray-500 mt-1">Min 8 characters, include uppercase, lowercase, number, and special character</p>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold py-3 rounded-lg disabled:opacity-50">
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account? <Link href="/login" className="text-orange-600 font-medium">Log in</Link>
        </p>
        <p className="text-center text-xs text-gray-500 mt-4">
          By signing up, you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}><SignupForm /></Suspense>
}
