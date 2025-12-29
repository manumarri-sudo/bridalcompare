export const dynamic = 'force-dynamic'

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Support</h1>

        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-4">
            Email: <a href="mailto:hello@vara.style" className="text-orange-600 font-medium">hello@vara.style</a>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6">FAQ</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-2">How do I save outfits?</h3>
              <p className="text-gray-700">Install the Chrome extension and click it on designer websites.</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">What is the free limit?</h3>
              <p className="text-gray-700">50 outfits. Upgrade to Vara Pass for unlimited.</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">How do I delete my account?</h3>
              <p className="text-gray-700">Go to Settings and click Delete Account.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
