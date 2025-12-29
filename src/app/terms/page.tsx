export const dynamic = 'force-dynamic'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-6">Last updated: December 29, 2024</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance</h2>
          <p className="text-gray-700 mb-4">By using Vara, you agree to these terms.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Use License</h2>
          <p className="text-gray-700 mb-4">Personal, non-commercial use only.</p>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Contact</h2>
          <p className="text-gray-700 mb-4">Questions: hello@vara.style</p>
        </div>
      </div>
    </div>
  )
}
