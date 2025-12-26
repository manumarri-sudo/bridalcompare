interface FeaturedSlotProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  link?: string;
}

export default function FeaturedSlot({ 
  title = "Featured Collection",
  description = "Exclusive bridal designs",
  imageUrl,
  link = "#"
}: FeaturedSlotProps) {
  return (
    <div className="bridal-card overflow-hidden">
      <div className="bg-gradient-to-br from-bridal-gold/20 to-bridal-rose/20 p-4">
        <p className="text-xs text-bridal-gold uppercase tracking-wide font-medium">Featured</p>
      </div>
      {imageUrl && (
        <div className="relative aspect-square bg-bridal-gold-light">
          {/* Placeholder for featured image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-bridal-charcoal/40">Featured Image</p>
          </div>
        </div>
      )}
      <div className="p-6 space-y-3">
        <h3 className="text-lg font-serif text-bridal-charcoal">{title}</h3>
        <p className="text-sm text-bridal-charcoal/70">{description}</p>
        <a 
          href={link}
          className="inline-block bridal-btn-primary text-sm"
        >
          Explore Now
        </a>
      </div>
    </div>
  );
}
