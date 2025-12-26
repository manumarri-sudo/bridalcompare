import Link from "next/link";
import { Sparkles, Heart, TrendingUp, Chrome } from "lucide-react";
import TrendingSection from "@/components/trending/TrendingSection";

export default function HomePage() {
  return (
    <div className="bridal-container py-12 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-5xl md:text-6xl font-serif text-bridal-charcoal">
          Your Bridal Shopping,
          <span className="block text-bridal-gold">Simplified</span>
        </h1>
        <p className="text-xl text-bridal-charcoal/70 max-w-2xl mx-auto">
          Compare outfits from Aza, Kynah, Lashkaraa, Pernia's Pop-Up and 20+ more sites in one beautiful place.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link href="/compare" className="bridal-btn-primary">
            Start Comparing
          </Link>
          <Link href="/trending" className="bridal-btn-secondary">
            See What's Trending
          </Link>
        </div>
      </section>

      {/* Chrome Extension Section */}
      <section className="max-w-2xl mx-auto">
        <div className="bridal-card p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-bridal-gold/10 rounded-full flex items-center justify-center">
              <Chrome className="w-7 h-7 text-bridal-gold" />
            </div>
            <div>
              <h3 className="text-xl font-serif text-bridal-charcoal">Chrome Extension Available!</h3>
              <p className="text-sm text-bridal-charcoal/60">Save products with one click while shopping</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-bridal-charcoal/70">
              Install our Chrome extension to instantly save products from any bridal site:
            </p>

            <div className="bg-bridal-gold-light p-4 rounded-lg space-y-3">
              <p className="font-medium text-bridal-charcoal">How to Install:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-bridal-charcoal/70 ml-2">
                <li>Download the BridalCompare Chrome Extension</li>
                <li>Go to <code className="bg-white px-2 py-1 rounded">chrome://extensions/</code></li>
                <li>Enable "Developer mode" (top right)</li>
                <li>Click "Load unpacked" and select the extension folder</li>
                <li>Start shopping - click the extension icon to save products!</li>
              </ol>
            </div>

            <a 
              href="https://github.com/manumarri-sudo/bridalcompare/releases" 
              target="_blank"
              rel="noopener noreferrer"
              className="bridal-btn-primary inline-block text-center"
            >
              Download Chrome Extension
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bridal-card p-8 text-center space-y-4">
          <div className="w-12 h-12 mx-auto bg-bridal-gold/10 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-bridal-gold" />
          </div>
          <h3 className="text-xl font-serif">Paste & Compare</h3>
          <p className="text-bridal-charcoal/70">
            Paste product URLs from any bridal site. We'll extract details and show them side-by-side.
          </p>
        </div>

        <div className="bridal-card p-8 text-center space-y-4">
          <div className="w-12 h-12 mx-auto bg-bridal-rose/30 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-xl font-serif">Save to Collections</h3>
          <p className="text-bridal-charcoal/70">
            Organize your favorites by event: Wedding, Sangeet, Mehendi, Reception, and more.
          </p>
        </div>

        <div className="bridal-card p-8 text-center space-y-4">
          <div className="w-12 h-12 mx-auto bg-bridal-gold-light rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-bridal-gold" />
          </div>
          <h3 className="text-xl font-serif">Discover Trends</h3>
          <p className="text-bridal-charcoal/70">
            See what other brides are loving. Real data, real trends, real inspiration.
          </p>
        </div>
      </section>

      {/* Trending Section */}
      <TrendingSection />
    </div>
  );
}
