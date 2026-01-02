'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { EVENT_LABELS } from '@/lib/constants'

export default function CreateCollectionModal({ isOpen, onClose, onCreated }: any) {
  const [title, setTitle] = useState('')
  const [eventContext, setEventContext] = useState('wedding_pheras')
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('collections').insert({
      title,
      event_context: eventContext,
      user_id: user.id,
      is_system_generated: false
    })

    setLoading(false)
    if (!error) {
      setTitle('')
      onCreated()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-gray-800">New Collection</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Collection Name</label>
            <input 
              required
              placeholder="e.g. My Dream Pellikuthuru Look"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#FB7185] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Event / Occasion</label>
            <select 
              value={eventContext}
              onChange={(e) => setEventContext(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#FB7185] outline-none transition appearance-none"
            >
              {Object.entries(EVENT_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-4 bg-[#FB7185] text-white font-bold rounded-xl hover:bg-[#F43F5E] transition disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Collection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
