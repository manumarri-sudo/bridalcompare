"use client";

import { useState } from "react";
import { Plus, X, Sparkles } from "lucide-react";

export default function ComparePage() {
  const [urls, setUrls] = useState<string[]>([""]);

  const addUrl = () => {
    if (urls.length < 20) {
      setUrls([...urls, ""]);
    }
  };

  const removeUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-display mb-4">Compare Outfits</h1>
        <p className="text-vara-warmGray text-lg">
          Paste product URLs from your favorite designers and compare them side-by-side
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {urls.map((url, index) => (
          <div
            key={index}
            className="group relative"
          >
            <input
              type="url"
              value={url}
              onChange={(e) => updateUrl(index, e.target.value)}
              placeholder="https://www.azafashions.com/..."
              className="w-full px-6 py-4 pr-12 rounded-2xl border-2 border-gray-200 focus:border-vara-marigold focus:outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
            />
            {urls.length > 1 && (
              <button
                onClick={() => removeUrl(index)}
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-vara-deepRose" />
              </button>
            )}
          </div>
        ))}

        {urls.length < 20 && (
          <button
            onClick={addUrl}
            className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl hover:border-vara-marigold hover:bg-vara-marigold/5 transition-all flex items-center justify-center gap-2 text-vara-warmGray hover:text-vara-marigold"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add another URL</span>
          </button>
        )}
      </div>

      <div className="text-center">
        <button className="vara-btn-primary inline-flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Extract & Compare
        </button>
      </div>
    </div>
  );
}
