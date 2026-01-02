
export default function About() {
  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <main className="max-w-3xl mx-auto px-8 py-20 text-center">
        <h1 className="text-5xl font-serif text-[#FB7185] mb-10">Our Story</h1>
        
        <div className="space-y-8 text-lg text-gray-600 leading-relaxed font-light">
          <p>It started with a thousand open tabs.</p>
          <p>
            Planning a South Asian wedding—or even just building a luxury wardrobe—is a journey of chaos and beauty. 
            We found ourselves drowning in screenshots, losing track of designers, and struggling to visualize how 
            it all came together.
          </p>
          <p>
            We realized the modern woman needs more than a folder on her phone. She needs a sanctuary.
          </p>
          <p className="font-medium text-gray-800">Vara is that sanctuary.</p>
          <p>
            A place to save the intricate lehengas, the timeless sarees, and the pieces that make your heart skip a beat. 
            We are building this for you, so you can focus less on the chaos and more on the magic.
          </p>
        </div>
        
        <div className="mt-16 pt-10 border-t border-gray-200">
          <p className="text-gray-400 text-sm mb-2 uppercase tracking-widest">With Love</p>
          {/* Z-Index Fix for Clickability */}
          <a 
            href="mailto:hello@vara.style" 
            className="relative z-20 text-3xl font-serif font-bold text-[#FB7185] hover:text-[#F43F5E] transition inline-block cursor-pointer"
          >
            hello@vara.style
          </a>
        </div>
      </main>
    </div>
  )
}
