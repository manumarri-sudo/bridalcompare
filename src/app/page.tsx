import Link from "next/link";
import { Heart, Sparkles, ShoppingBag } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-vara-rose/10 to-vara-marigold/10 rounded-full mb-8 border border-vara-marigold/20">
          <Sparkles className="w-4 h-4 text-vara-marigold" />
          <span className="text-sm font-medium text-vara-warmGray">Your South Asian wardrobe, organized</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-display mb-6 leading-tight">
          Save every outfit you love,<br />
          <span className="vara-gradient-text">all in one beautiful place</span>
        </h1>
        
        <p className="text-xl text-vara-warmGray max-w-2xl mx-auto mb-10 leading-relaxed">
          From wedding lehengas to everyday kurtas - organize outfits from 100+ designers, compare prices, and never lose track of what you love.
        </p>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/compare" className="vara-btn-primary">
            Start Saving Outfits
          </Link>
          <Link href="/about" className="vara-btn-secondary">
            Our Story
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-display text-center mb-16">
          Perfect for every occasion
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-vara-rose to-vara-marigold rounded-2xl flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-display">Wedding Collections</h3>
            <p className="text-vara-warmGray leading-relaxed">
              Organize by event - Sangeet, Mehendi, Reception. Auto-create folders based on your traditions.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-vara-marigold to-vara-sage rounded-2xl flex items-center justify-center mb-6">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-display">Everyday Style</h3>
            <p className="text-vara-warmGray leading-relaxed">
              Diwali outfits, party wear, festive looks - save and compare everything you're eyeing.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-vara-sage to-vara-rose rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-display">Never Miss a Sale</h3>
            <p className="text-vara-warmGray leading-relaxed">
              Track prices across designers. Get alerts when your saved outfits go on sale.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-vara-rose/5 to-vara-marigold/5 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-display mb-6">Works with your favorite designers</h2>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-vara-warmGray">
            <span>Aza Fashions</span>
            <span>Kynah</span>
            <span>Pernia's Pop-Up Shop</span>
            <span>Lashkaraa</span>
            <span>Sabyasachi</span>
            <span>Anita Dongre</span>
            <span>+ 100 more</span>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="vara-card p-12 text-center">
          <h2 className="text-4xl font-display mb-4">Save while you shop</h2>
          <p className="text-vara-warmGray text-lg mb-8 max-w-2xl mx-auto">
            Install our Chrome extension and save outfits with one click as you browse.
          </p>
          <button className="vara-btn-primary">Add to Chrome - It's Free</button>
        </div>
      </section>
    </div>
  );
}
