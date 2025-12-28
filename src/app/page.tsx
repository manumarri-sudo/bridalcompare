import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <section className="text-center space-y-8">
        <div className="inline-block px-4 py-2 bg-vara-emerald/20 rounded-full text-vara-champagne text-sm border border-vara-gold/20">
          ✨ Fashion Intelligence Engine
        </div>
        
        <h1 className="text-6xl font-serif italic text-vara-champagne">
          Digital Couture for
          <span className="block mt-2 bg-gradient-to-r from-vara-champagne to-vara-gold bg-clip-text text-transparent">
            South Asian Weddings
          </span>
        </h1>
        
        <p className="text-xl text-vara-champagne/70 max-w-2xl mx-auto">
          Your Sherpa through luxury fashion. Smart collections, cultural guidance, and price intelligence.
        </p>
        
        <div className="flex gap-4 justify-center pt-6">
          <Link href="/compare" className="vara-btn-primary">
            Start Comparing
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 mt-20">
        <div className="vara-glass-card">
          <h3 className="font-serif italic text-2xl text-vara-champagne mb-4">Smart Caching</h3>
          <p className="text-vara-champagne/60">72-hour intelligent caching saves costs while keeping data fresh.</p>
        </div>
        <div className="vara-glass-card">
          <h3 className="font-serif italic text-2xl text-vara-champagne mb-4">Cultural Intelligence</h3>
          <p className="text-vara-champagne/60">Auto-generate collections based on your wedding culture mix.</p>
        </div>
        <div className="vara-glass-card">
          <h3 className="font-serif italic text-2xl text-vara-champagne mb-4">Vara Pass</h3>
          <p className="text-vara-champagne/60">$29 lifetime access. Unlimited saves, price tracking, trend reports.</p>
        </div>
      </section>
    </div>
  );
}
