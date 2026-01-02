import Navbar from '@/components/Navbar'

export default function About() {
  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-8 py-16 text-center">
        <h1 className="text-5xl font-serif text-[#FB7185] mb-8">Our Story</h1>
        <p className="text-xl text-gray-600 leading-relaxed mb-8">
          Vara was born out of the chaos of bridal shopping. With thousands of tabs open and screenshots lost in camera rolls, we knew there had to be a better way to organize South Asian luxury fashion.
        </p>
        <p className="text-xl text-gray-600 leading-relaxed mb-12">
          We are building the digital sanctuary for your wardrobe dreams.
        </p>
        
        <div className="border-t border-gray-200 pt-12">
          <p className="text-gray-500 mb-4">Questions? Partnerships? Just want to say hi?</p>
          <a href="mailto:hello@vara.style" className="text-2xl font-bold text-[#FB7185] hover:underline hover:text-[#F43F5E] transition">
            hello@vara.style
          </a>
        </div>
      </main>
    </div>
  )
}
