export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-gray-600 mb-6">Last updated: December 29, 2024</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Information We Collect</h2>
        <p className="text-gray-700 mb-4">When you use Vara, we collect:</p>
        <ul className="list-disc ml-6 text-gray-700 mb-4 space-y-2">
          <li>Email address (for account creation)</li>
          <li>URLs of products you save</li>
          <li>Usage data (number of items saved)</li>
        </ul>
        <h2 className="text-2xl font-bold mt-8 mb-4">Data Security</h2>
        <p className="text-gray-700 mb-4">
          Your data is stored securely using Supabase with encryption at rest and in transit. 
          Passwords are hashed using bcrypt. We never share your personal information with third parties.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Contact</h2>
        <p className="text-gray-700">Email: <a href="mailto:hello@vara.style" className="text-orange-600 hover:underline">hello@vara.style</a></p>
      </div>
    </div>
  )
}
