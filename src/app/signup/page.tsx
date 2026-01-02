'use client'
import { createBrowserClient } from '@supabase/ssr'
import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function SignupForm() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return "Password must be at least 8 characters."
    if (!/[A-Z]/.test(pwd)) return "Include at least one uppercase letter."
    if (!/[0-9]/.test(pwd)) return "Include at least one number."
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const pwdError = validatePassword(formData.password)
    if (pwdError) {
      setError(pwdError)
      return
    }

    setLoading(true)
    
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          full_name: `${formData.firstName} ${formData.lastName}`
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/collections?welcome=true')
    }
  }

  return (
    <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif font-bold text-[#FB7185] mb-2">vara</h1>
        <p className="text-gray-500">Create your sanctuary.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input required placeholder="First Name" className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-[#FB7185] outline-none transition"
            onChange={e => setFormData({...formData, firstName: e.target.value})} />
          <input required placeholder="Last Name" className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-[#FB7185] outline-none transition"
            onChange={e => setFormData({...formData, lastName: e.target.value})} />
        </div>
        
        <input type="email" required placeholder="Email Address" className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-[#FB7185] outline-none transition"
          onChange={e => setFormData({...formData, email: e.target.value})} />
        
        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"} 
            required 
            placeholder="Password (8+ chars, 1 Upper, 1 Number)" 
            className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-[#FB7185] outline-none transition pr-10"
            onChange={e => setFormData({...formData, password: e.target.value})} 
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-500 rounded-xl text-sm font-medium">{error}</div>}

        <button type="submit" disabled={loading} className="w-full py-4 bg-[#FB7185] text-white font-bold rounded-xl hover:bg-[#F43F5E] transition disabled:opacity-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
          {loading ? 'Creating Account...' : 'Join Vara'}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-500">
        Already have an account? <Link href="/login" className="font-bold text-[#FB7185] hover:underline">Log In</Link>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0] p-4">
      <Suspense><SignupForm /></Suspense>
    </div>
  )
}
