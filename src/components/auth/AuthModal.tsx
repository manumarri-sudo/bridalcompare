"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  const handleSignIn = async () => {
    if (!email) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}`,
        },
      });

      if (error) throw error;
      
      setSent(true);
    } catch (error: any) {
      console.error('Auth error:', error);
      alert(error.message || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose} size="small">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-bridal-charcoal">Sign In</h2>
          <p className="text-bridal-charcoal/70 mt-2">
            {sent 
              ? "Check your email for the magic link!" 
              : "Save your favorite outfits to collections"}
          </p>
        </div>

        {!sent ? (
          <>
            <Input
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              onKeyPress={(e) => e.key === 'Enter' && handleSignIn()}
            />
            <Button 
              onClick={handleSignIn} 
              loading={loading}
              disabled={!email}
              className="w-full"
            >
              Send Magic Link
            </Button>
          </>
        ) : (
          <div className="bridal-card p-6 text-center space-y-3">
            <p className="text-bridal-gold font-medium">✉️ Email sent!</p>
            <p className="text-sm text-bridal-charcoal/70">
              Click the link in your email to sign in. You can close this window.
            </p>
            <Button onClick={onClose} variant="secondary" className="w-full">
              Close
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
