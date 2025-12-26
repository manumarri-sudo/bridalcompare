"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Product, ExtractResponse } from "@/types";

interface URLInputProps {
  onProductsExtracted: (products: Product[]) => void;
}

export default function URLInput({ onProductsExtracted }: URLInputProps) {
  const [urls, setUrls] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ url: string; message: string }[]>([]);

  const handleExtract = async () => {
    const urlList = urls
      .split('\n')
      .map(u => u.trim())
      .filter(u => u.length > 0);

    if (urlList.length === 0) {
      alert("Please enter at least one URL");
      return;
    }

    if (urlList.length > 20) {
      alert("Maximum 20 URLs allowed at once");
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: urlList }),
      });

      const data: ExtractResponse = await response.json();

      if (data.products && data.products.length > 0) {
        onProductsExtracted(data.products);
      }

      if (data.errors && data.errors.length > 0) {
        setErrors(data.errors);
      }

      if (data.products.length === 0 && data.errors.length > 0) {
        alert("Could not extract any products. Please check the URLs and try again.");
      }
    } catch (error) {
      console.error('Extract error:', error);
      alert("Failed to extract product data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bridal-card p-8 space-y-6">
      <div className="space-y-3">
        <label htmlFor="urls" className="block text-lg font-medium text-bridal-charcoal">
          Paste Product URLs
        </label>
        <p className="text-sm text-bridal-charcoal/70">
          Add 1-20 product URLs from any bridal site (one per line)
        </p>
        <textarea
          id="urls"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder="https://www.aza.com/...&#10;https://www.kynah.com/...&#10;https://www.lashkaraa.com/..."
          rows={6}
          className="bridal-input font-mono text-sm resize-none"
          disabled={loading}
        />
      </div>

      {errors.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-red-600">Some URLs failed to extract:</p>
          <ul className="space-y-1">
            {errors.map((error, i) => (
              <li key={i} className="text-xs text-red-500">
                {error.url}: {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleExtract}
        disabled={loading || !urls.trim()}
        className="bridal-btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Extracting...
          </>
        ) : (
          'Extract & Compare'
        )}
      </button>
    </div>
  );
}
