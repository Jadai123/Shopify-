import React, { useState, useEffect } from 'react';
import { Heart, X, RotateCcw, Info, ShoppingCart, Percent, Tag, ShieldCheck, MapPin } from 'lucide-react';
import { Product, Vendor, UserPersona } from '../types';

interface SwipeDiscoverProps {
  products: Product[];
  vendors: Vendor[];
  persona: UserPersona;
  wishlist?: string[];
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onStartCheckout: (product: Product) => void;
}

export default function SwipeDiscover({ products, vendors, persona, wishlist = [], onToggleWishlist, onSelectProduct, onStartCheckout }: SwipeDiscoverProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});

  // Reset indices when products load
  useEffect(() => {
    if (products.length > 0) {
      const initialImageIndices: Record<string, number> = {};
      products.forEach(p => {
        initialImageIndices[p.id] = 0;
      });
      setCurrentImageIndex(initialImageIndices);
    }
  }, [products]);

  const activeProduct = products[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex >= products.length) return;
    
    setSwipeDirection(direction);
    setHistory(prev => [...prev, currentIndex]);

    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
    }, 300);
  };

  const handleRewind = () => {
    if (history.length === 0) return;
    const previousIndex = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setCurrentIndex(previousIndex);
  };

  const handleNextImage = (productId: string, imagesCount: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: (prev[productId] + 1) % imagesCount
    }));
  };

  const handlePrevImage = (productId: string, imagesCount: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: (prev[productId] - 1 + imagesCount) % imagesCount
    }));
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
        <p className="text-gray-400 mt-4 text-sm font-mono">LOADING CURATED DISCOVERY STREAM...</p>
      </div>
    );
  }

  // If we've run out of items to swipe, show a helpful summary/restart card
  if (currentIndex >= products.length) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-2xl glass-card text-center border border-white/5 shadow-2xl">
        <div className="inline-flex p-4 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
          <RotateCcw className="w-8 h-8 cursor-pointer" onClick={() => { setCurrentIndex(0); setHistory([]); }} />
        </div>
        <h3 className="font-display text-2xl font-bold text-white mb-2">Discovery Stream Completed</h3>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          You have swiped through all currently curated international assets. Switch categories or talk with the Smart AI Assistant to fetch custom inventories!
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => { setCurrentIndex(0); setHistory([]); }}
            className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-black font-semibold rounded-lg hover:shadow-neon-green transition-shadow cursor-pointer"
          >
            Start Discovering Again
          </button>
        </div>
      </div>
    );
  }

  const matchedVendor = vendors.find(v => v.id === activeProduct.vendor_id);
  const currentImgIdx = currentImageIndex[activeProduct.id] || 0;
  const currentImgUrl = activeProduct.images[currentImgIdx] || activeProduct.images[0];

  // Price calculations
  const originalPriceNgn = activeProduct.price_ngn;
  const discountAmountNgn = originalPriceNgn * (activeProduct.discount_percent / 100);
  const finalPriceNgn = originalPriceNgn - discountAmountNgn;

  const originalPriceUsd = activeProduct.price_usd;
  const discountAmountUsd = originalPriceUsd * (activeProduct.discount_percent / 100);
  const finalPriceUsd = originalPriceUsd - discountAmountUsd;

  return (
    <div className="relative w-full max-w-lg mx-auto px-4 py-6" id="discover-feed-container">
      {/* Persona Header Info */}
      <div className="flex justify-between items-center mb-6 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-mono uppercase">DISCOVERING AS</span>
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
            persona === 'Budget' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-secondary/10 text-secondary border border-secondary/20'
          }`}>
            {persona || 'Value'} Shopper
          </span>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleRewind}
            className="flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-white transition-colors cursor-pointer"
            id="rewind-button"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Rewind
          </button>
        )}
      </div>

      {/* Swipe Card Container */}
      <div className="relative h-[530px] w-full" id="swipe-card-stage">
        <div
          className={`absolute inset-0 rounded-2xl overflow-hidden glass-card border border-white/10 transition-all duration-300 shadow-2xl flex flex-col cursor-pointer ${
            swipeDirection === 'left' ? 'transform -translate-x-full -rotate-12 opacity-0' :
            swipeDirection === 'right' ? 'transform translate-x-full rotate-12 opacity-0' : ''
          }`}
          onClick={() => onSelectProduct(activeProduct)}
          id={`product-card-${activeProduct.id}`}
        >
          {/* Main Visual Image Area */}
          <div className="relative h-[320px] bg-neutral-900 group">
            <img
              src={currentImgUrl}
              alt={activeProduct.name}
              className="w-full h-full object-cover select-none"
              referrerPolicy="no-referrer"
            />
            {/* Dark gradient shadow overlay */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent"></div>

            {/* Multiple Image Arrows */}
            {activeProduct.images.length > 1 && (
              <>
                <button
                  onClick={(e) => handlePrevImage(activeProduct.id, activeProduct.images.length, e)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
                >
                  ‹
                </button>
                <button
                  onClick={(e) => handleNextImage(activeProduct.id, activeProduct.images.length, e)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
                >
                  ›
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                  {activeProduct.images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full ${idx === currentImgIdx ? 'bg-primary' : 'bg-white/40'}`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Wishlist toggle heart icon in top-right corner of card */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(activeProduct.id);
              }}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all hover:scale-110 cursor-pointer border border-white/5"
              title="Add/Remove from wishlist"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  wishlist?.includes(activeProduct.id) ? 'fill-red-500 text-red-500' : 'text-gray-300'
                }`}
              />
            </button>

            {/* Category Badge & Country Indicator */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-2.5 py-1 text-xs font-mono font-bold uppercase rounded-md bg-secondary text-white shadow-lg">
                {activeProduct.category}
              </span>
              {matchedVendor && (
                <span className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono font-bold uppercase rounded-md bg-black/60 border border-white/10 text-white">
                  <MapPin className="w-2.5 h-2.5 text-primary" />
                  {matchedVendor.country}
                </span>
              )}
            </div>

            {/* Stock Status */}
            {activeProduct.stock_status === 'out_of_stock' && (
              <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                <span className="px-4 py-2 border border-red-500 text-red-500 font-mono font-bold tracking-widest uppercase rounded">
                  Out Of Stock
                </span>
              </div>
            )}

            {/* Notch Price Tag Design (Top-Right) */}
            <div className="absolute top-0 right-0 h-10 bg-primary text-black flex items-center px-4 font-mono font-bold notch-tag-right text-sm shadow-md">
              <Tag className="w-3.5 h-3.5 mr-1" />
              ₦{finalPriceNgn.toLocaleString()}
            </div>
          </div>

          {/* Product Info & Personalized Content */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start gap-2 mb-1">
                <h4 className="font-display text-xl font-bold tracking-tight text-white line-clamp-1">
                  {activeProduct.name}
                </h4>
                <div className="text-xs font-mono text-gray-400 shrink-0">
                  ${finalPriceUsd.toFixed(2)}
                </div>
              </div>

              {matchedVendor && (
                <p className="text-xs text-gray-400 mb-3 flex items-center gap-1.5">
                  <span>By <strong>{matchedVendor.name}</strong></span>
                  <span className="text-yellow-400">★ {matchedVendor.rating}</span>
                </p>
              )}

              <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-4">
                {activeProduct.description}
              </p>
            </div>

            {/* Custom UI based on User Persona onboarding choice */}
            {persona === 'Budget' ? (
              /* BUDGET DISCOVERY VIEW: Highlights huge savings and original vs current prices */
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 flex justify-between items-center mb-1">
                <div>
                  <div className="text-[10px] font-mono text-primary uppercase tracking-wider mb-0.5">BUDGET PRICE SLASH</div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs line-through text-gray-500">₦{originalPriceNgn.toLocaleString()}</span>
                    <span className="text-sm font-bold text-white font-mono">₦{finalPriceNgn.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-0.5 px-2 py-1 rounded bg-primary/20 text-primary font-mono text-xs font-extrabold animate-pulse">
                    <Percent className="w-3 h-3" />
                    SAVE {activeProduct.discount_percent}%
                  </span>
                  <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                    Saved ₦{(originalPriceNgn - finalPriceNgn).toLocaleString()}!
                  </div>
                </div>
              </div>
            ) : (
              /* VALUE SEEKER DISCOVERY VIEW: Highlights high specs, certifications & longevity elements */
              <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/20 flex justify-between items-center mb-1">
                <div>
                  <div className="text-[10px] font-mono text-secondary uppercase tracking-wider mb-0.5">VALUE ASSURANCE</div>
                  <div className="flex items-center gap-1 text-xs text-gray-300 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
                    Verified Quality (★ {matchedVendor?.rating || '4.8'})
                  </div>
                </div>
                <div className="text-right font-mono text-[10px] text-gray-400">
                  <div>Stock: <span className="text-white font-bold">{activeProduct.stock_status === 'in_stock' ? 'Excellent' : 'Low'}</span></div>
                  <div>Specs: <span className="text-secondary font-bold">{Object.keys(activeProduct.specs).length} detailed</span></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Swipe Control Buttons */}
      <div className="flex justify-center items-center gap-6 mt-6" id="swipe-button-controls">
        {/* Skip Button (Swipe Left) */}
        <button
          onClick={() => handleSwipe('left')}
          className="w-14 h-14 rounded-full border border-red-500/30 bg-red-500/5 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-black hover:shadow-lg hover:shadow-red-500/20 transition-all transform active:scale-95 cursor-pointer"
          title="Skip"
          id="swipe-left-button"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Info/Inspect Button */}
        <button
          onClick={() => onSelectProduct(activeProduct)}
          className="w-11 h-11 rounded-full border border-gray-700 bg-neutral-900 text-gray-300 flex items-center justify-center hover:bg-white hover:text-black transition-all transform active:scale-95 cursor-pointer"
          title="View Details"
          id="view-details-button"
        >
          <Info className="w-5 h-5" />
        </button>

        {/* Instant Buy Button */}
        <button
          onClick={() => onStartCheckout(activeProduct)}
          className="w-11 h-11 rounded-full border border-primary/30 bg-primary/5 text-primary flex items-center justify-center hover:bg-primary hover:text-black transition-all transform active:scale-95 cursor-pointer"
          title="Instant Checkout"
          id="instant-buy-button"
        >
          <ShoppingCart className="w-5 h-5" />
        </button>

        {/* Interested Button (Swipe Right) */}
        <button
          onClick={() => handleSwipe('right')}
          className="w-14 h-14 rounded-full border border-primary/30 bg-primary/5 text-primary flex items-center justify-center hover:bg-primary hover:text-black hover:shadow-lg hover:shadow-primary/20 transition-all transform active:scale-95 cursor-pointer"
          title="Interested!"
          id="swipe-right-button"
        >
          <Heart className="w-6 h-6 fill-current" />
        </button>
      </div>
    </div>
  );
}
