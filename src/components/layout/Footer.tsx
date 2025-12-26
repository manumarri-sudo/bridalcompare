import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-bridal-mauve/20 mt-16">
      <div className="bridal-container py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-serif text-bridal-gold">BridalCompare</h3>
            <p className="text-sm text-bridal-charcoal/70">
              Your bridal shopping companion. Compare outfits from 20+ South Asian fashion marketplaces.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-bridal-charcoal">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/compare" className="text-bridal-charcoal/70 hover:text-bridal-gold">Compare</Link></li>
              <li><Link href="/trending" className="text-bridal-charcoal/70 hover:text-bridal-gold">Trending</Link></li>
              <li><Link href="/collections" className="text-bridal-charcoal/70 hover:text-bridal-gold">Collections</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-bridal-charcoal">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-bridal-charcoal/70 hover:text-bridal-gold">About</a></li>
              <li><a href="#" className="text-bridal-charcoal/70 hover:text-bridal-gold">Contact</a></li>
              <li><a href="#" className="text-bridal-charcoal/70 hover:text-bridal-gold">Privacy</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-bridal-charcoal">Follow Us</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-bridal-charcoal/70 hover:text-bridal-gold">Instagram</a></li>
              <li><a href="#" className="text-bridal-charcoal/70 hover:text-bridal-gold">Pinterest</a></li>
              <li><a href="#" className="text-bridal-charcoal/70 hover:text-bridal-gold">Facebook</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-bridal-mauve/20 text-center text-sm text-bridal-charcoal/60">
          © 2024 BridalCompare. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
