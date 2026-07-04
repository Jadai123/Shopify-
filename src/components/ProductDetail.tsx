import React, { useState, useEffect } from 'react';
import { ChevronLeft, MessageCircle, ShoppingBag, BarChart3, Tag, Calendar, Package, ArrowRight, ShieldAlert, Award } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Product, Vendor, PriceHistory } from '../types';

interface ProductDetailProps {
  product: Product;
  vendors: Vendor[];
  onBack: () => void;
  onStartCheckout: (product: Product) => void;
}

export default function ProductDetail({ product, vendors, onBack, onStartCheckout }: ProductDetailProps) {
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  
  // Simulated size & color parameters
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [selectedColor, setSelectedColor] = useState('Standard');

  const matchedVendor = vendors.find(v => v.id === product.vendor_id);

  // Fetch product price history from database
  useEffect(() => {
    setActiveImage(product.images[0]);
    setLoadingHistory(true);
    fetch(`/api/products/${product.id}/price-history`)
      .then(res => res.json())
      .then(data => {
        setPriceHistory(data || []);
        setLoadingHistory(false);
      })
      .catch(err => {
        console.error('[Error loading price history]:', err);
        setLoadingHistory(false);
      });
  }, [product]);

  // Format history data for Recharts
  const chartData = priceHistory.map(ph => ({
    date: new Date(ph.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Price: ph.price_ngn
  }));

  // Pricing
  const originalPrice = product.price_ngn;
  const discountAmount = originalPrice * (product.discount_percent / 100);
  const finalPrice = originalPrice - discountAmount;

  const originalPriceUsd = product.price_usd;
  const discountAmountUsd = originalPriceUsd * (product.discount_percent / 100);
  const finalPriceUsd = originalPriceUsd - discountAmountUsd;

  // WhatsApp wa.me deep link formulation
  const getWhatsAppLink = () => {
    if (!matchedVendor) return '#';
    const rawNumber = matchedVendor.whatsapp_number.replace(/\D/g, '');
    const text = encodeURIComponent(
      `Hello! I am interested in your product: "${product.name}" on Social Shopperfy. Price: ₦${finalPrice.toLocaleString()} (${selectedSize} / ${selectedColor}). Let us discuss negotiations and details!`
    );
    return `https://wa.me/${rawNumber}?text=${text}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8" id="product-detail-view">
      {/* Back control */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-white transition-colors mb-8 cursor-pointer"
        id="detail-back-button"
      >
        <ChevronLeft className="w-4 h-4" />
        Back To Marketplace
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Left Side: Images & Gallery */}
        <div className="space-y-4">
          <div className="relative h-[420px] rounded-2xl overflow-hidden bg-neutral-900 border border-white/5">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {product.discount_percent > 0 && (
              <div className="absolute top-4 right-4 inline-flex items-center gap-0.5 px-3 py-1.5 rounded-lg bg-primary text-black text-xs font-extrabold font-mono shadow-lg">
                <Tag className="w-3.5 h-3.5" />
                OFFER {product.discount_percent}% OFF
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border shrink-0 cursor-pointer ${
                    activeImage === img ? 'border-primary' : 'border-white/5 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Description, Direct Contacts & Specs */}
        <div className="flex flex-col justify-between">
          <div>
            {/* Category */}
            <div className="text-xs font-mono text-primary font-bold uppercase tracking-wider mb-2">
              {product.category}
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
              {product.name}
            </h1>

            {/* Vendor Rating */}
            {matchedVendor && (
              <div className="flex flex-wrap gap-4 items-center text-xs text-gray-400 mb-6 pb-6 border-b border-white/5">
                <div className="flex items-center gap-1.5">
                  <span className="text-yellow-400">★</span>
                  <span><strong>{matchedVendor.rating}</strong> Rating</span>
                </div>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-secondary" />
                  Verified Vendor: <strong>{matchedVendor.name}</strong>
                </span>
                <span>•</span>
                <span className="text-gray-400">Originated: <strong>{matchedVendor.country}</strong></span>
              </div>
            )}

            {/* Pricing Section */}
            <div className="mb-6 p-4 rounded-xl bg-dark-surface border border-white/5">
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">DIRECT FROM FACTORY RATES</div>
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-3xl font-mono font-bold text-white">
                  ₦{finalPrice.toLocaleString()}
                </span>
                {product.discount_percent > 0 && (
                  <span className="text-sm font-mono line-through text-gray-500">
                    ₦{originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs text-primary font-mono bg-primary/10 border border-primary/20 px-2 py-0.5 rounded ml-auto">
                  ~ ${finalPriceUsd.toFixed(2)} USD
                </span>
              </div>
              {product.discount_percent > 0 && (
                <p className="text-xs text-primary font-mono mt-1">
                  Absolute Savings: You save ₦{(originalPrice - finalPrice).toLocaleString()} (${(originalPriceUsd - finalPriceUsd).toFixed(2)})!
                </p>
              )}
            </div>

            {/* Full description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Sizes/Options selection simulator */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Select Asset Size</label>
                <div className="flex gap-2">
                  {['Standard', 'Medium', 'Large'].map(sz => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1 text-xs rounded border transition-colors cursor-pointer ${
                        selectedSize === sz ? 'bg-primary text-black border-primary font-bold' : 'bg-neutral-900 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Select Accent Option</label>
                <div className="flex gap-2">
                  {['Standard', 'Cosmic Black', 'Chrome'].map(cl => (
                    <button
                      key={cl}
                      onClick={() => setSelectedColor(cl)}
                      className={`px-3 py-1 text-xs rounded border transition-colors cursor-pointer ${
                        selectedColor === cl ? 'bg-secondary text-white border-secondary font-bold' : 'bg-neutral-900 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {cl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Call buttons */}
          <div className="space-y-3 pt-6 border-t border-white/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WhatsApp WA.ME Link */}
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors text-center shadow-lg hover:shadow-emerald-600/20 cursor-pointer"
                id="contact-vendor-whatsapp-link"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                Contact Vendor on WhatsApp
              </a>

              {/* Instant purchase checkout */}
              <button
                onClick={() => onStartCheckout(product)}
                className="flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-gradient-to-r from-primary to-secondary text-black font-extrabold text-sm transition-all shadow-lg hover:shadow-neon-green/20 hover:-translate-y-0.5 transform active:translate-y-0 cursor-pointer"
                id="detail-checkout-button"
              >
                <ShoppingBag className="w-5 h-5" />
                Secure Checkout Now
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-500 font-mono">
              DIRECT TO VENDOR WA.ME COMMUNICATION • ESCROW FEEL SECURE CO-OP CHECKOUT
            </p>
          </div>
        </div>
      </div>

      {/* Price Trend Analytics Section with Recharts & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-10 border-t border-white/5">
        {/* Trend line chart */}
        <div className="lg:col-span-2 rounded-2xl p-6 bg-dark-surface border border-white/5" id="price-analytics-chart-container">
          <h3 className="flex items-center gap-2 font-display text-lg font-bold text-white mb-6">
            <BarChart3 className="w-5 h-5 text-primary" />
            Naira Price Trend Analytics (30-Day Outlook)
          </h3>

          {loadingHistory ? (
            <div className="h-64 flex items-center justify-center">
              <span className="text-xs font-mono text-gray-500 animate-pulse">COMPILING STATISTICAL HISTORY...</span>
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <span className="text-xs font-mono text-gray-500">NO HISTORIC TRENDS LOGGED YET</span>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis dataKey="date" stroke="#888" fontSize={11} tickLine={false} />
                  <YAxis stroke="#888" fontSize={11} tickFormatter={(val) => `₦${val / 1000}k`} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#121212', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                    labelStyle={{ color: '#fff', fontSize: '12px', fontFamily: 'var(--font-mono)' }}
                    itemStyle={{ color: '#00FFA3', fontSize: '12px', fontFamily: 'var(--font-mono)' }}
                  />
                  <Line type="monotone" dataKey="Price" stroke="#00FFA3" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* History Table */}
        <div className="rounded-2xl p-6 bg-dark-surface border border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-white mb-4">
              <Calendar className="w-4 h-4 text-secondary" />
              Verified Pricing Logs
            </h3>
            
            <div className="overflow-y-auto max-h-52 pr-1 text-xs">
              <table className="w-full text-left border-collapse font-mono">
                <thead>
                  <tr className="border-b border-white/5 text-gray-500 pb-2">
                    <th className="font-normal py-1.5">Recorded At</th>
                    <th className="font-normal text-right py-1.5">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {priceHistory.map((ph, idx) => (
                    <tr key={ph.id || idx} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                      <td className="py-2 text-gray-400">
                        {new Date(ph.recorded_at).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                      </td>
                      <td className="py-2 text-right text-white">
                        ₦{ph.price_ngn.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3 text-[10px] text-gray-400">
            <ShieldAlert className="w-4 h-4 text-primary shrink-0" />
            <p className="leading-tight">
              Pricing is compiled from real-time global manufacturer rates with direct co-op ledger validation.
            </p>
          </div>
        </div>
      </div>

      {/* Product specs bento grid */}
      <div className="rounded-2xl p-8 bg-dark-surface border border-white/5 mb-12">
        <h3 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Technical Specifications Sheet
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(product.specs).map(([key, val]) => (
            <div key={key} className="p-4 rounded-xl bg-neutral-900 border border-white/5">
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">{key}</div>
              <div className="text-sm font-semibold text-white">{val}</div>
            </div>
          ))}
          {Object.keys(product.specs).length === 0 && (
            <div className="col-span-full p-4 text-center text-xs text-gray-500 font-mono">
              SPECIFICATION ENTRIES FOR THIS ASSET ARE EMBEDDED IN ITS USER PORTAL
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
