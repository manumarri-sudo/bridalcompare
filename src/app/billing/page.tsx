"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"

export const dynamic = 'force-dynamic'

export default function BillingPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      router.push("/login")
      return
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single()

    setProfile(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  const usageCount = profile?.usage_count || 0
  const usagePercent = Math.min((usageCount / 50) * 100, 100)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Billing</h1>

        {profile?.is_vara_pass_holder ? (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">👑</span>
              <div>
                <h2 className="text-2xl font-bold">Vara Pass</h2>
                <p className="text-gray-600">Unlimited saves</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-4">Usage</h2>
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Saved outfits</span>
                <span className="font-semibold">{usageCount} / 50</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-pink-500 to-orange-500 h-2 rounded-full"
                  style={{ width: usagePercent + '%' }}
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-xl font-bold mb-2">Upgrade to Vara Pass</h3>
              <div className="text-3xl font-bold mb-4">
                $29 <span className="text-lg font-normal text-gray-600">one-time</span>
              </div>
              <button 
                className="bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold py-3 px-8 rounded-lg"
                onClick={() => alert('Coming soon!')}
              >
                Upgrade Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
