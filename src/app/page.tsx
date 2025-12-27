import Link from "next/link";
import { Sparkles, TrendingUp, Chrome, Heart, Shield } from "lucide-react";
import TrendingSection from "@/components/trending/TrendingSection";

export default function HomePage() {
  return (
    <div className="vara-container">
      <section className="text-center py-20 md:py-32 space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-vara-gold/10 rounded-full text-vara-gold text-sm font-medium border border-vara-gold/20">
          <Sparkles className="w-4 h-4" />
          <span>Wedding Intelligence Engine</span>
        </div>
        
        <h1 className="font-serif text-vara-primary max-w-4xl mx-auto">
          Your Sherpa for
          <span className="block mt-2">South Asian Weddings</span>
        </h1>
        
        <p className="text-xl text-vara-muted max-w-2xl mx-auto leading-relaxed">
          Compare outfits across 100+ designers. Get cultural guidance. Never miss a price drop.
          <span className="block mt-2">For brides who need organization. For guests who need translation.</span>
        </p>
        
        <div className="flex gap-4 justify-center pt-6 flex-wrap">
          <Link href="/compare" className="vara-btn-primary">
            Start Comparing
          </Link>
          <Link href="/trending" className="vara-btn-secondary">
            <TrendingUp className="w-4 h-4 inline mr-2" />
            See What's Trending
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 py-16">
        <div className="vara-card-flat p-8 space-y-4">
          <div className="w-12 h-12 bg-vara-gold/10 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-vara-gold" />
          </div>
          <h3 className="font-serif text-vara-primary">Joyful Clarity</h3>
          <p className="text-vara-muted leading-relaxed">
            No spinning loaders. No error codes. Just calm, beautiful organization while we curate your collection.
          </p>
        </div>

        <div className="vara-card-flat p-8 space-y-4">
          <div className="w-12 h-12 bg-vara-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-vara-primary" />
          </div>
          <h3 className="font-serif text-vara-primary">Cultural Safety</h3>
          <p className="text-vara-muted leading-relaxed">
            Not sure if red is okay for a guest? We'll gently guide you with cultural context for every event.
          </p>
        </div>

        <div className="vara-card-flat p-8 space-y-4">
          <div className="w-12 h-12 bg-vara-gold/10 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-vara-gold" />
          </div>
          <h3 className="font-serif text-vara-primary">Smart Collections</h3>
          <p className="text-vara-muted leading-relaxed">
            Tell us your wedding culture mix. We'll create the perfect folder structure automatically.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto py-16">
        <div className="vara-card p-10 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-vara-primary/5 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Chrome className="w-8 h-8 text-vara-primary" />
            </div>
            <div>
              <h3 className="font-serif text-2xl text-vara-primary mb-2">Save While You Shop</h3>
              <p className="text-vara-muted leading-relaxed">
                One click to save from any designer site. Works with Aza, Kynah, Pernia's, and 100+ more.
              </p>
            </div>
          </div>

          <a 
            href="https://github.com/manumarri-sudo/bridalcompare/releases" 
            target="_blank"
            rel="noopener noreferrer"
            className="vara-btn-primary inline-block text-center w-full"
          >
            Download Extension
          </a>
        </div>
      </section>

      <section className="py-16">
        <TrendingSection />
      </section>

      <section className="text-center py-20 space-y-6">
        <h2 className="font-serif text-vara-primary">Ready to organize your wedding wardrobe?</h2>
        <p className="text-vara-muted max-w-xl mx-auto">
          Join brides and guests who've stopped juggling browser tabs and started making confident decisions.
        </p>
        <Link href="/compare" className="vara-btn-gold inline-block">
          Start Your First Collection
        </Link>
      </section>
    </div>
  );
}
