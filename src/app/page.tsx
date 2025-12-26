import Link from "next/link";
import { Sparkles, Heart, TrendingUp } from "lucide-react";
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
