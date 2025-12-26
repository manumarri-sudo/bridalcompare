"use client";

import { useState } from "react";
import { Bookmark, Copy, Check } from "lucide-react";

export default function Bookmarklet() {
  const [copied, setCopied] = useState(false);

  const bookmarkletCode = `javascript:(function(){window.open('${process.env.NEXT_PUBLIC_APP_URL || 'https://bridalcompare.vercel.app'}/add?url='+encodeURIComponent(window.location.href),'_blank');})();`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bookmarkletCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bridal-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-bridal-gold/10 rounded-full flex items-center justify-center">
          <Bookmark className="w-5 h-5 text-bridal-gold" />
        </div>
        <div>
          <h3 className="font-medium text-bridal-charcoal">Quick Add Bookmarklet</h3>
          <p className="text-sm text-bridal-charcoal/60">Save products with one click</p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-bridal-charcoal/70">
          Drag this button to your bookmarks bar, then click it on any product page to instantly save:
        </p>

        <div className="flex gap-3">
          <a
            href={bookmarkletCode}
            className="bridal-btn-primary text-sm px-4 py-2 cursor-move inline-block"
            onClick={(e) => e.preventDefault()}
          >
            ➕ Add to BridalCompare
          </a>

          <button
            onClick={handleCopy}
            className="p-2 hover:bg-bridal-gold/10 rounded-lg transition-colors"
            title="Copy bookmarklet code"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <Copy className="w-5 h-5 text-bridal-charcoal/60" />
            )}
          </button>
        </div>

        <div className="bg-bridal-gold-light p-3 rounded-lg text-xs text-bridal-charcoal/70 space-y-1">
          <p className="font-medium">How to use:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Drag the button above to your bookmarks bar</li>
            <li>Browse any bridal site (Aza, Kynah, etc.)</li>
            <li>When you find a product you like, click the bookmark</li>
            <li>The product opens in BridalCompare - save to your collection!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
