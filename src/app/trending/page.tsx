import TrendingSection from "@/components/trending/TrendingSection";
import AdSlot from "@/components/layout/AdSlot";

export default function TrendingPage() {
  return (
    <div className="bridal-container py-8">
      <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-serif text-bridal-charcoal">Trending in BridalCompare</h1>
            <p className="text-bridal-charcoal/70">
              Discover what other brides are loving right now
            </p>
          </div>

          <TrendingSection showAll />
        </div>

        <aside className="hidden lg:block space-y-6">
          <AdSlot type="sidebar" />
        </aside>
      </div>
    </div>
  );
}
