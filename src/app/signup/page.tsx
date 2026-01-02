'use client'
import { createBrowserClient } from '@supabase/ssr'
import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'

function SignupForm() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#FB7185] mb-2">vara</h1>
        <p className="text-gray-500">Create your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input required placeholder="First Name" className="w-full p-3 border rounded-lg focus:border-[#FB7185] outline-none"
            onChange={e => setFormData({...formData, firstName: e.target.value})} />
          <input required placeholder="Last Name" className="w-full p-3 border rounded-lg focus:border-[#FB7185] outline-none"
            onChange={e => setFormData({...formData, lastName: e.target.value})} />
        </div>
        
        <input type="email" required placeholder="Email" className="w-full p-3 border rounded-lg focus:border-[#FB7185] outline-none"
          onChange={e => setFormData({...formData, email: e.target.value})} />
        
        <input type="password" required placeholder="Password" className="w-full p-3 border rounded-lg focus:border-[#FB7185] outline-none"
          onChange={e => setFormData({...formData, password: e.target.value})} />

        {error && <div className="p-3 bg-red-50 text-red-500 rounded-lg text-sm">{error}</div>}

        <button type="submit" disabled={loading} className="w-full py-3 bg-[#FB7185] text-white font-bold rounded-lg hover:bg-[#F43F5E] transition disabled:opacity-50">
          {loading ? 'Creating...' : 'Join Vara'}
        </button>
      </form>
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
