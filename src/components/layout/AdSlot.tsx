interface AdSlotProps {
  type: 'sidebar' | 'inline';
}

export default function AdSlot({ type }: AdSlotProps) {
  if (type === 'sidebar') {
    return (
      <div className="bridal-card p-6 space-y-4 sticky top-24">
        <p className="text-xs text-bridal-charcoal/50 uppercase tracking-wide">Sponsored</p>
        <div className="aspect-square bg-bridal-gold-light rounded-lg flex items-center justify-center">
          <p className="text-bridal-charcoal/40 text-sm">Ad Space</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-bridal-charcoal">Your Brand Here</h4>
          <p className="text-sm text-bridal-charcoal/70">
            Reach thousands of brides shopping for their dream outfits.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bridal-card p-4 my-4">
      <p className="text-xs text-bridal-charcoal/50 uppercase tracking-wide mb-3">Sponsored</p>
      <div className="flex gap-4">
        <div className="w-24 h-24 bg-bridal-gold-light rounded-lg flex items-center justify-center flex-shrink-0">
          <p className="text-bridal-charcoal/40 text-xs">Ad</p>
        </div>
        <div className="space-y-1">
          <h4 className="font-medium text-bridal-charcoal text-sm">Featured Brand</h4>
          <p className="text-xs text-bridal-charcoal/70 line-clamp-2">
            Discover beautiful bridal collections
          </p>
        </div>
      </div>
    </div>
  );
}
