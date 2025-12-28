import Link from "next/link";
import { Heart, Sparkles, Calendar } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Emotional & Warm */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-vara-rose/10 to-vara-marigold/10 rounded-full mb-8 border border-vara-marigold/20">
          <Sparkles className="w-4 h-4 text-vara-marigold" />
          <span className="text-sm font-medium text-vara-warmGray">Your wedding wardrobe, simplified</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-display mb-6 leading-tight">
          Find your perfect outfit,<br />
          <span className="vara-gradient-text">without the overwhelm</span>
        </h1>
        
        <p className="text-xl text-vara-warmGray max-w-2xl mx-auto mb-10 leading-relaxed">
          Save outfits from 100+ designers in one beautiful space. Compare prices, get cultural guidance, and feel confident in your choices.
        </p>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/compare" className="vara-btn-primary">
            Start Your Collection
          </Link>
          <Link href="/trending" className="vara-btn-secondary">
            See What's Trending
          </Link>
        </div>
      </section>

      {/* How It Works - Simple & Visual */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-display text-center mb-16">
          Wedding shopping,<br />the way it should be
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-vara-rose to-vara-marigold rounded-2xl flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-display">Save what you love</h3>
            <p className="text-vara-warmGray leading-relaxed">
              One click to save from any designer site. Works with Aza, Kynah, Pernia's, and 100+ more.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-vara-marigold to-vara-sage rounded-2xl flex items-center justify-center mb-6">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-display">Organize by event</h3>
            <p className="text-vara-warmGray leading-relaxed">
              Sangeet, Mehendi, Reception - we auto-create folders based on your wedding traditions.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-vara-sage to-vara-rose rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-display">Never miss a sale</h3>
            <p className="text-vara-warmGray leading-relaxed">
              Get alerts when your saved outfits drop in price. Because wedding budgets matter.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof - Trust Building */}
      <section className="bg-gradient-to-br from-vara-rose/5 to-vara-marigold/5 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-vara-warmGray mb-8 text-lg">Trusted by brides and wedding guests planning celebrations across</p>
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-vara-warmGray">
            <span>🇮🇳 India</span>
            <span>🇺🇸 United States</span>
            <span>🇬🇧 United Kingdom</span>
            <span>🇨🇦 Canada</span>
            <span>🇦🇺 Australia</span>
          </div>
        </div>
      </section>

      {/* Extension CTA - Friendly & Simple */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="vara-card p-12 text-center">
          <h2 className="text-4xl font-display mb-4">
            Save while you shop
          </h2>
          <p className="text-vara-warmGray text-lg mb-8 max-w-2xl mx-auto">
            Install our Chrome extension and save outfits with one click as you browse your favorite designers.
          </p>
          <button className="vara-btn-primary">
            Add to Chrome - It's Free
          </button>
        </div>
      </section>
    </div>
  );
}
