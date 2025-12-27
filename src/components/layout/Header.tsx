"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { TrendingUp, Menu, X } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";
import { createClient } from "@/lib/supabase/client";

export default function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <header className="sticky top-0 z-50 bg-vara-base/95 backdrop-blur-sm border-b border-vara-border">
      <nav className="vara-container py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-2xl">✨</span>
            <div>
              <span className="font-serif text-2xl font-semibold text-vara-primary tracking-tight">
                VARA
              </span>
              <span className="block text-xs text-vara-muted tracking-wide">
                WEDDING INTELLIGENCE
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/compare"
              className="text-vara-primary hover:text-vara-gold transition-colors font-medium text-sm"
            >
              Compare
            </Link>
            <Link
              href="/trending"
              className="text-vara-primary hover:text-vara-gold transition-colors font-medium text-sm flex items-center gap-1.5"
            >
              <TrendingUp className="w-4 h-4" />
              Trending
            </Link>
            {user && (
              <Link
                href="/collections"
                className="text-vara-primary hover:text-vara-gold transition-colors font-medium text-sm"
              >
                Collections
              </Link>
            )}
          </div>

          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-vara-muted">{user.email}</span>
                <button onClick={handleSignOut} className="vara-btn-secondary text-sm px-4 py-2">
                  Sign Out
                </button>
              </div>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="vara-btn-primary">
                Sign In
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-vara-border/30 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 space-y-2 border-t border-vara-border mt-4">
            <Link
              href="/compare"
              className="block py-2.5 px-3 rounded-lg text-vara-primary hover:bg-vara-border/30 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Compare
            </Link>
            <Link
              href="/trending"
              className="block py-2.5 px-3 rounded-lg text-vara-primary hover:bg-vara-border/30 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Trending
            </Link>
            {user ? (
              <>
                <Link
                  href="/collections"
                  className="block py-2.5 px-3 rounded-lg text-vara-primary hover:bg-vara-border/30 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Collections
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2.5 px-3 rounded-lg text-vara-primary hover:bg-vara-border/30 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setShowAuthModal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full vara-btn-primary text-left mt-2"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </nav>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </header>
  );
}
