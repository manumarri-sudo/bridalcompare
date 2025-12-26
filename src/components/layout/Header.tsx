"use client";

import Link from "next/link";
import { Heart, TrendingUp, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import AuthModal from "@/components/auth/AuthModal";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <header className="bg-white border-b border-bridal-mauve/20 sticky top-0 z-40">
        <nav className="bridal-container">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="text-2xl font-serif text-bridal-gold">
              BridalCompare
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/compare" className="text-bridal-charcoal hover:text-bridal-gold transition-colors">
                Compare
              </Link>
              <Link href="/trending" className="flex items-center gap-2 text-bridal-charcoal hover:text-bridal-gold transition-colors">
                <TrendingUp className="w-4 h-4" />
                Trending
              </Link>
              {user && (
                <Link href="/collections" className="flex items-center gap-2 text-bridal-charcoal hover:text-bridal-gold transition-colors">
                  <Heart className="w-4 h-4" />
                  Collections
                </Link>
              )}
            </div>

            {/* Auth */}
            <div className="hidden md:block">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-bridal-charcoal/70">{user.email}</span>
                  <button onClick={handleSignOut} className="text-sm text-bridal-gold hover:text-bridal-gold/80">
                    Sign Out
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowAuthModal(true)} className="bridal-btn-primary">
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4 border-t border-bridal-mauve/20">
              <Link href="/compare" className="block text-bridal-charcoal hover:text-bridal-gold">
                Compare
              </Link>
              <Link href="/trending" className="block text-bridal-charcoal hover:text-bridal-gold">
                Trending
              </Link>
              {user && (
                <Link href="/collections" className="block text-bridal-charcoal hover:text-bridal-gold">
                  Collections
                </Link>
              )}
              <div className="pt-4 border-t border-bridal-mauve/20">
                {user ? (
                  <button onClick={handleSignOut} className="text-bridal-gold">
                    Sign Out
                  </button>
                ) : (
                  <button onClick={() => setShowAuthModal(true)} className="bridal-btn-primary w-full">
                    Sign In
                  </button>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}
