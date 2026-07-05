import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Globe, MapPin, Shield, Star, DollarSign, Award, Percent } from 'lucide-react';
import { Product } from '../types';

interface ProductShowcaseCarouselProps {
  products: Product[];
  onUnlock: (product: Product) => void;
}

export default function ProductShowcaseCarousel({ products, onUnlock }: ProductShowcaseCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Map product IDs or indices to global hubs to showcase locations like China Beijing, USA, Canada, Australia, etc.
  const hubs = [
    { city: 'Beijing Sourcing Hub', country: 'China', flag: '🇨🇳', code: 'PEK-A1', shippingDays: '7-10 days' },
    { city: 'California Factory Outpost', country: 'USA', flag: '🇺🇸', code: 'LAX-U5', shippingDays: '5-7 days' },
    { city: 'Toronto Direct Sourced', country: 'Canada', flag: '🇨🇦', code: 'YYZ-C2', shippingDays: '6-8 days' },
    { city: 'Sydney Tech Assemblies', country: 'Australia', flag: '🇦🇺', code: 'SYD-A9', shippingDays: '8-11 days' },
    { city: 'Dubai Trade Logistics', country: 'United Arab Emirates', flag: '🇦🇪', code: 'DXB-M3', shippingDays: '4-6 days' },
  ];

  // Pick up to 8 products for the curated preview
  const showcaseProducts = React.useMemo(() => {
    return products.slice(0, 8).map((p, idx) => {
      const hub = hubs[idx % hubs.length];
      return {
        ...p,
        hub,
        badge: `${hub.flag} Newly Arrived - ${hub.city}`,
        qualityGrade: idx % 2 === 0 ? 'Ultra-Value Sourced' : 'Premium Spec Level',
        rating: 4.8 + (idx % 3) * 0.1
      };
    });
  }, [products]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % showcaseProducts.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + showcaseProducts.length) % showcaseProducts.length);
  };

  if (showcaseProducts.length === 0) return null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8" id="product-showcase-carousel-section">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-mono font-extrabold text-primary uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            Limited Inbound Factory Batches
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-black text-white leading-tight">
            Be the First to Try Our <span className="text-primary">Newly Sourced Sets</span>
          </h2>
          <p className="text-gray-400 text-xs md:text-sm mt-1.5 max-w-xl">
            Inspected and verified by Co-op agents direct from production lines in Beijing, USA, Canada, Australia, and Dubai.
          </p>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/5 hover:border-white/10 hover:text-primary flex items-center justify-center text-gray-400 transition-all cursor-pointer active:scale-95"
            aria-label="Previous newly arrived product"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-mono text-gray-500 font-bold px-1">
            {currentIndex + 1} / {showcaseProducts.length}
          </span>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/5 hover:border-white/10 hover:text-primary flex items-center justify-center text-gray-400 transition-all cursor-pointer active:scale-95"
            aria-label="Next newly arrived product"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Showcase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-neutral-950/40 border border-white/5 rounded-3xl p-6 md:p-8 relative overflow-hidden backdrop-blur-sm">
        {/* Abstract light glow background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        {/* Image Showcase Column */}
        <div className="lg:col-span-5 relative group overflow-hidden rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center min-h-[250px] md:min-h-[350px]">
          <img
            src={showcaseProducts[currentIndex].images[0]}
            alt={showcaseProducts[currentIndex].name}
            className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          
          {/* Location Tag */}
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-neutral-950/85 border border-white/10 backdrop-blur-md flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-mono text-white font-extrabold uppercase tracking-wider">
              {showcaseProducts[currentIndex].hub.city}
            </span>
          </div>

          {/* Sourcing Code Tag */}
          <div className="absolute bottom-4 right-4 px-2 py-1 rounded bg-neutral-950/90 border border-white/5 text-[9px] font-mono text-gray-400 font-bold">
            BATCH CODE: {showcaseProducts[currentIndex].hub.code}
          </div>
        </div>

        {/* Details & Copywriting Column */}
        <div className="lg:col-span-7 flex flex-col justify-between py-2">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-md bg-neutral-900 border border-white/5 text-[9px] font-mono font-black uppercase text-primary">
                {showcaseProducts[currentIndex].category}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 text-[9px] font-mono font-extrabold uppercase text-primary flex items-center gap-1">
                <Award className="w-3 h-3" />
                {showcaseProducts[currentIndex].qualityGrade}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-neutral-900 border border-white/5 text-[9px] font-mono text-gray-400 flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                {showcaseProducts[currentIndex].rating} rating
              </span>
            </div>

            <h3 className="font-display text-xl md:text-2xl font-black text-white tracking-tight">
              {showcaseProducts[currentIndex].name}
            </h3>

            <p className="text-gray-300 text-xs md:text-sm mt-3 leading-relaxed">
              {showcaseProducts[currentIndex].description}
            </p>

            {/* Specifications Box */}
            <div className="mt-5 p-4 rounded-xl bg-neutral-900/50 border border-white/5 font-mono text-xs">
              <div className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">Technical Quality & Specs:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-300">
                {Object.entries(showcaseProducts[currentIndex].specs || {}).slice(0, 4).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b border-white/5 pb-1 gap-4">
                    <span className="text-gray-500 font-medium text-[11px] truncate">{key}:</span>
                    <span className="text-white font-bold text-[11px] text-right truncate">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rates & Direct Sourcing Offers */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <div className="text-[10px] font-mono text-gray-400 uppercase font-bold tracking-wider mb-1">Guaranteed Slashed Rate</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-display font-black text-primary">
                    ₦{(showcaseProducts[currentIndex].price_ngn * 0.85).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-xs text-gray-500 line-through">
                    ₦{showcaseProducts[currentIndex].price_ngn.toLocaleString()}
                  </span>
                </div>
                <p className="text-[9px] font-mono text-primary/70 mt-1 uppercase">Save 15% with Group Consolidation</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/30 border border-white/5 font-mono text-[11px] text-gray-400 space-y-1.5 flex flex-col justify-center">
                <div className="flex justify-between">
                  <span>Transit Class:</span>
                  <strong className="text-white">Fast Air Freight</strong>
                </div>
                <div className="flex justify-between">
                  <span>Est. Port Clearance:</span>
                  <strong className="text-white">{showcaseProducts[currentIndex].hub.shippingDays}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Duty Tariff:</span>
                  <strong className="text-emerald-400">100% Prepaid</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center">
            <button
              onClick={() => onUnlock(showcaseProducts[currentIndex])}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary hover:bg-primary/95 text-black font-mono font-bold uppercase tracking-wider text-xs shadow-lg shadow-primary/10 cursor-pointer active:scale-95 transition-all text-center flex items-center justify-center gap-2"
            >
              <Globe className="w-4.5 h-4.5" />
              Unlock Direct Factory Price & Join Group
            </button>
            <p className="text-[10px] font-mono text-gray-500 uppercase text-center sm:text-left">
              🔒 Free registration. No credit card required to explore.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
