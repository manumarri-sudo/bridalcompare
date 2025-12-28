"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-vara-cream/95 backdrop-blur-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-vara-rose fill-vara-rose" />
            <span className="text-2xl font-display font-semibold vara-gradient-text">
              Vara
            </span>
          </Link>

          <div className="flex items-center gap-8">
            <Link href="/compare" className="text-vara-warmGray hover:text-vara-rose transition-colors font-medium">
              Compare
            </Link>
            <Link href="/trending" className="text-vara-warmGray hover:text-vara-marigold transition-colors font-medium">
              Trending
            </Link>
            <button className="px-6 py-2 bg-gradient-to-r from-vara-rose to-vara-marigold text-white rounded-full font-medium hover:opacity-90 transition-opacity">
              Sign In
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
