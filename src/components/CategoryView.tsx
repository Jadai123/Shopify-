import React, { useState } from 'react';
import { Tag, MapPin, Eye, ShoppingCart, Percent, Heart } from 'lucide-react';
import { Product, Vendor, UserPersona } from '../types';

interface CategoryViewProps {
  products: Product[];
  vendors: Vendor[];
  persona: UserPersona;
  wishlist?: string[];
  onToggleWishlist: (productId: string) => void;
  initialCategory?: string;
  onSelectProduct: (product: Product) => void;
  onStartCheckout: (product: Product) => void;
}

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Beauty & Personal Care'];

export default function CategoryView({ products, vendors, persona, wishlist = [], onToggleWishlist, initialCategory, onSelectProduct, onStartCheckout }: CategoryViewProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(500000);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = p.price_ngn <= maxPrice;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8" id="category-catalog">
      {/* Category Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="font-display text-3xl font-extrabold text-white mb-2">
            Browse global collections
          </h2>
          <p className="text-gray-400 text-sm">
            Discover verified assets from Nigeria, USA, UK, China, and UAE.
          </p>
        </div>

        {/* Dynamic Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 text-sm rounded-lg bg-dark-surface border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full sm:w-60"
            id="product-catalog-search-input"
          />
          
          {/* Price Range Slider */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-mono text-gray-500 shrink-0">MAX PRICE:</span>
            <input
              type="range"
              min="10000"
              max="500000"
              step="10000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="accent-primary w-28 h-1 rounded-lg cursor-pointer bg-neutral-800"
            />
            <span className="text-xs font-mono text-primary font-bold shrink-0">
              ₦{maxPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Category Pill Buttons */}
      <div className="flex overflow-x-auto gap-3 pb-6 mb-8 scrollbar-thin" id="category-pills-row">
        {CATEGORIES.map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary text-black font-extrabold shadow-neon-green border border-primary'
                  : 'bg-dark-surface border border-white/5 text-gray-400 hover:text-white hover:border-white/10'
              }`}
              id={`category-pill-${cat.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Products Catalog Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl glass-card border border-white/5">
          <p className="text-gray-400 text-sm font-mono mb-4">NO CURATED ITEMS MATCH THE SELECTION</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setMaxPrice(500000); }}
            className="px-4 py-2 rounded bg-neutral-800 border border-white/10 text-xs text-white hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="products-catalog-grid">
          {filteredProducts.map(p => {
            const matchedVendor = vendors.find(v => v.id === p.vendor_id);
            const originalPrice = p.price_ngn;
            const discountAmount = originalPrice * (p.discount_percent / 100);
            const finalPrice = originalPrice - discountAmount;
            
            const originalPriceUsd = p.price_usd;
            const discountAmountUsd = originalPriceUsd * (p.discount_percent / 100);
            const finalPriceUsd = originalPriceUsd - discountAmountUsd;

            return (
              <div
                key={p.id}
                className="group flex flex-col rounded-xl overflow-hidden glass-card hover:border-primary/30 transition-all duration-300"
                id={`catalog-product-card-${p.id}`}
              >
                {/* Image Showcase area */}
                <div className="relative h-48 bg-neutral-900 overflow-hidden">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Category notch overlay */}
                  <div className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-secondary text-white">
                    {p.category}
                  </div>

                  {/* Wishlist Toggle Heart Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(p.id);
                    }}
                    className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all hover:scale-110 cursor-pointer border border-white/5"
                    title="Add to Wishlist"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-colors ${
                        wishlist?.includes(p.id) ? 'fill-red-500 text-red-500' : 'text-gray-300'
                      }`}
                    />
                  </button>

                  {/* Savings percentage tag */}
                  {p.discount_percent > 0 && (
                    <div className="absolute top-12 right-3 inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-primary text-black text-[10px] font-extrabold font-mono">
                      <Percent className="w-2.5 h-2.5" />
                      SAVE {p.discount_percent}%
                    </div>
                  )}

                  {/* Rating / Vendor details banner */}
                  {matchedVendor && (
                    <div className="absolute bottom-2 left-2 flex gap-1.5 items-center px-2 py-0.5 bg-black/60 rounded text-[9px] font-mono text-white border border-white/5">
                      <MapPin className="w-2.5 h-2.5 text-primary" />
                      <span>{matchedVendor.country}</span>
                    </div>
                  )}
                </div>

                {/* Product Meta details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-base text-white group-hover:text-primary transition-colors line-clamp-1 mb-1">
                      {p.name}
                    </h3>
                    
                    {matchedVendor && (
                      <p className="text-[10px] text-gray-500 mb-2">
                        Vendor: <strong className="text-gray-300">{matchedVendor.name}</strong>
                      </p>
                    )}

                    <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-4">
                      {p.description}
                    </p>
                  </div>

                  <div>
                    {/* Price calculations */}
                    <div className="flex justify-between items-baseline mb-4">
                      <div>
                        <span className="text-sm font-mono font-bold text-white">
                          ₦{finalPrice.toLocaleString()}
                        </span>
                        {p.discount_percent > 0 && (
                          <span className="text-[10px] line-through text-gray-500 ml-1.5 font-mono">
                            ₦{originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">
                        ${finalPriceUsd.toFixed(2)}
                      </span>
                    </div>

                    {/* Direct action triggers */}
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5">
                      <button
                        onClick={() => onSelectProduct(p)}
                        className="flex items-center justify-center gap-1.5 py-1.5 rounded bg-neutral-900 border border-white/5 hover:border-white/20 text-xs text-white transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </button>
                      <button
                        onClick={() => onStartCheckout(p)}
                        className="flex items-center justify-center gap-1.5 py-1.5 rounded bg-primary text-black font-semibold text-xs hover:shadow-neon-green transition-shadow cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Checkout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
