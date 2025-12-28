"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-vara-midnight/95 backdrop-blur-sm border-b border-vara-border">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <span className="font-serif italic text-2xl bg-gradient-to-r from-vara-champagne to-vara-gold bg-clip-text text-transparent">
                VARA
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-8">
            <Link href="/compare" className="text-vara-champagne hover:text-vara-gold transition-colors">
              Compare
            </Link>
            <Link href="/trending" className="text-vara-champagne hover:text-vara-gold transition-colors">
              Trending
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
