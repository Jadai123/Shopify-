import React, { useState } from 'react';
import { Mail, MapPin, ShieldCheck, Heart, Sparkles, AlertCircle, Percent, BarChart3, HelpCircle, X, Scale } from 'lucide-react';

interface GlobalFooterProps {
  onNavigateToCategory: (cat: string) => void;
  onSetView: (view: 'discover' | 'catalog' | 'admin') => void;
}

export default function GlobalFooter({ onNavigateToCategory, onSetView }: GlobalFooterProps) {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'escrow' | 'returns' | 'help' | null>(null);

  const openModal = (e: React.MouseEvent, type: 'privacy' | 'terms' | 'escrow' | 'returns' | 'help') => {
    e.preventDefault();
    setActiveModal(type);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = 'unset';
  };
  return (
    <footer className="w-full bg-neutral-950 border-t border-white/5 pt-16 pb-8 font-sans" id="marketplace-footer">
      {/* Brand & Competitive Advantages "Why Us" */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-white mb-4">
            Social <span className="text-primary">Shopperfy</span>
          </h2>
          <p className="text-gray-400 text-xs leading-relaxed mb-6">
            Establishing the absolute frontier of high-tech global multi-vendor trading. Discover direct factory inventories with real price tracking and complete transparency.
          </p>
          <div className="space-y-2 text-xs text-gray-400 font-mono">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-primary" />
              <a href="mailto:musajohnjonathan@gmail.com" className="hover:text-white transition-colors">musajohnjonathan@gmail.com</a>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-secondary" />
              <span>Co-Op Headquarters, Lagos, Nigeria</span>
            </div>
          </div>
        </div>

        {/* Competitive Advantage Grid column */}
        <div className="lg:col-span-2">
          <h3 className="font-display text-sm font-bold text-white uppercase tracking-widest mb-6">WHY SHOPPERFY CO-OP?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-dark-surface border border-white/5">
              <h4 className="font-bold text-white flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                Verified Global Merchants
              </h4>
              <p className="text-gray-400 leading-relaxed">Direct factory pricing from Nigeria, UK, USA, UAE, and China.</p>
            </div>
            <div className="p-3 rounded-lg bg-dark-surface border border-white/5">
              <h4 className="font-bold text-white flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-secondary" />
                Discovery Personas
              </h4>
              <p className="text-gray-400 leading-relaxed">Tailored interfaces depending on if you hunt for discounts or specs.</p>
            </div>
            <div className="p-3 rounded-lg bg-dark-surface border border-white/5">
              <h4 className="font-bold text-white flex items-center gap-1.5 mb-1">
                <BarChart3 className="w-3.5 h-3.5 text-primary" />
                Price Analytics Charts
              </h4>
              <p className="text-gray-400 leading-relaxed">High-precision 30-day historic charts tracking actual market values.</p>
            </div>
            <div className="p-3 rounded-lg bg-dark-surface border border-white/5">
              <h4 className="font-bold text-white flex items-center gap-1.5 mb-1">
                <Percent className="w-3.5 h-3.5 text-secondary" />
                AI Smart Search Routing
              </h4>
              <p className="text-gray-400 leading-relaxed">Conversational AI searches products and triggers real catalog filters.</p>
            </div>
          </div>
        </div>

        {/* Global Presence Map / Country listing list */}
        <div>
          <h3 className="font-display text-sm font-bold text-white uppercase tracking-widest mb-6">GLOBAL PRESENCE</h3>
          <div className="space-y-3">
            {[
              { code: 'NG', name: 'NIGERIA (HQ)', role: 'Fulfillment & Escrow' },
              { code: 'US', name: 'UNITED STATES', role: 'Premium Beauty & Sound' },
              { code: 'GB', name: 'UNITED KINGDOM', role: 'Gourmet Homeware' },
              { code: 'CN', name: 'CHINA', role: 'Smart Micro-Tech' },
              { code: 'AE', name: 'UNITED ARAB EMIRATES', role: 'Luxury Materials' }
            ].map(country => (
              <div key={country.code} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-neutral-900 border border-white/10 flex items-center justify-center font-mono text-[10px] text-primary font-bold">
                  {country.code}
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-none">{country.name}</div>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">{country.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories & Catalog Shortcuts */}
      <div className="max-w-7xl mx-auto px-4 py-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-xs font-mono">
        <div>
          <h4 className="text-gray-500 uppercase tracking-wider mb-3">Market Catalog</h4>
          <ul className="space-y-2">
            {['Electronics', 'Fashion', 'Home & Living', 'Beauty & Personal Care'].map(cat => (
              <li key={cat}>
                <button
                  onClick={() => onNavigateToCategory(cat)}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  {cat} Directory
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-gray-500 uppercase tracking-wider mb-3">Legal Guidelines</h4>
          <ul className="space-y-2 text-gray-400">
            <li><button onClick={(e) => openModal(e, 'privacy')} className="hover:text-white transition-colors cursor-pointer text-left">Privacy Policy</button></li>
            <li><button onClick={(e) => openModal(e, 'terms')} className="hover:text-white transition-colors cursor-pointer text-left">Terms of Service</button></li>
            <li><button onClick={(e) => openModal(e, 'escrow')} className="hover:text-white transition-colors cursor-pointer text-left">Co-Op Escrow Policy</button></li>
            <li><button onClick={(e) => openModal(e, 'returns')} className="hover:text-white transition-colors cursor-pointer text-left">Merchant Return Rules</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gray-500 uppercase tracking-wider mb-3">Support & Help</h4>
          <ul className="space-y-2 text-gray-400 font-mono text-xs">
            <li><button onClick={(e) => openModal(e, 'help')} className="hover:text-white transition-colors cursor-pointer text-left">How to Order</button></li>
            <li><a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp Negotiation</a></li>
            <li><button onClick={(e) => openModal(e, 'escrow')} className="hover:text-white transition-colors cursor-pointer text-left">International Rates</button></li>
            <li><button onClick={(e) => onSetView('admin')} className="hover:text-white transition-colors cursor-pointer text-left">Become a Vendor</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gray-500 uppercase tracking-wider mb-3">System Hub</h4>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => onSetView('discover')}
                className="text-gray-400 hover:text-primary transition-colors cursor-pointer"
              >
                Tinder Swipe Discover
              </button>
            </li>
            <li>
              <button
                onClick={() => onSetView('catalog')}
                className="text-gray-400 hover:text-primary transition-colors cursor-pointer"
              >
                Browse Grid Catalog
              </button>
            </li>
            <li>
              <button
                onClick={() => onSetView('admin')}
                className="text-gray-400 hover:text-secondary transition-colors cursor-pointer"
              >
                Secure Admin Login
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Copy & Legal Details */}
      <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
        <p>© 2026 Social Shopperfy Co-Op. Proprietary Commercial Product. All rights reserved.</p>
        <div className="flex gap-4">
          <span className="flex items-center gap-1 text-emerald-500">
            <ShieldCheck className="w-4 h-4" />
            Core System Online
          </span>
          <span>•</span>
          <span>Security Level: Bank Grade Escrow</span>
        </div>
      </div>

      {/* High-Fidelity Interactive Overlay Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fade-in" id="legal-overlay">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto glass-card border border-white/10 rounded-2xl p-6 md:p-8 text-left text-gray-300">
            {/* Modal Header */}
            <div className="sticky top-0 bg-neutral-900/90 backdrop-blur-md pb-4 border-b border-white/5 flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <Scale className="w-5 h-5 text-primary" />
                <h3 className="font-display text-lg font-extrabold text-white tracking-tight uppercase">
                  {activeModal === 'privacy' && 'Privacy Policy (Starter Draft)'}
                  {activeModal === 'terms' && 'Terms of Service (Starter Draft)'}
                  {activeModal === 'escrow' && 'Co-Op Escrow Protocol'}
                  {activeModal === 'returns' && 'Merchant Return Rules'}
                  {activeModal === 'help' && 'System Instructions & Help'}
                </h3>
              </div>
              <button 
                onClick={closeModal} 
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Legal / Operational Warning Banner */}
            <div className="p-3.5 mb-6 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">ADMIN & LEGAL NOTICE:</strong> This is a commercial baseline draft for Social Shopperfy. Before conducting live payment operations, please secure formal legal review.
              </div>
            </div>

            {/* Modal Scrollable Text Content */}
            <div className="space-y-4 text-xs md:text-sm leading-relaxed text-gray-400 font-sans">
              {activeModal === 'privacy' && (
                <>
                  <p className="font-bold text-white text-base">1. User Personalization Telemetry</p>
                  <p>Social Shopperfy operates a specialized multi-vendor social commerce system. We collect shopper preferences and "swipe to match" feedback logs to generate customized discounts and technical comparison layouts.</p>
                  
                  <p className="font-bold text-white text-base">2. Cross-Border Data Transfers</p>
                  <p>To support factory-direct fulfillment channels, customer contact and delivery details are transferred securely to verified Co-Op merchant warehouses and shipping partners in Nigeria, USA, UK, China, and the UAE.</p>
                  
                  <p className="font-bold text-white text-base">3. Data Retainment</p>
                  <p>Your session swipes and preferences are saved locally. You may completely reset your onboarding history at any time by clicking the "Onboard" button in the navigation header.</p>
                </>
              )}

              {activeModal === 'terms' && (
                <>
                  <p className="font-bold text-white text-base">1. Co-Op Trading Terms</p>
                  <p>All listings and user registrations represent a legal membership with the Social Shopperfy decentralized marketplace network. The Platform connects you with direct-to-factory suppliers.</p>
                  
                  <p className="font-bold text-white text-base">2. Escrow Account Placement</p>
                  <p>When executing a purchase, funds are held securely inside the central Co-Op Escrow trust fund. Funds are only transferred to individual merchant accounts upon delivery confirmation.</p>
                  
                  <p className="font-bold text-white text-base">3. Intellectual Property Rights</p>
                  <p>Social Shopperfy and its underlying source code are governed by a strict proprietary license. Sublicensing, copying, or public release under unauthorized MIT/Apache open-source frameworks is prohibited.</p>
                </>
              )}

              {activeModal === 'escrow' && (
                <>
                  <p className="font-bold text-white text-base">1. Double-Sided Secure Escrow</p>
                  <p>Social Shopperfy protects both consumers and wholesale factory merchants via state-of-the-art escrow processing. Once you finish checkout, funds are flagged as "Escrow Locked" inside our secure system records.</p>
                  
                  <p className="font-bold text-white text-base">2. Shipment Validation Corridor</p>
                  <p>The vendor is automatically notified via our WhatsApp transaction integration. They are allocated a 3 to 7-day corridor to dispatch inventory and provide valid tracking. If the vendor fails to submit proof of shipment, funds are instantly refunded to the buyer.</p>
                  
                  <p className="font-bold text-white text-base">3. Confirmation and Release</p>
                  <p>Once tracking records demonstrate successful delivery, the buyer is requested to release the funds. Uncontested delivery records will trigger automatic fund releases to the merchant after 14 days.</p>
                </>
              )}

              {activeModal === 'returns' && (
                <>
                  <p className="font-bold text-white text-base">1. Direct Factory Return Guidelines</p>
                  <p>Because goods on Social Shopperfy are shipped direct-to-consumer from factories in Nigeria, China, UAE, and the West, return corridors are governed by strict verification requirements to prevent shipping overhead fraud.</p>
                  
                  <p className="font-bold text-white text-base">2. Valid Return Claims</p>
                  <p>Returns are only accepted if the item suffers from critical manufacturing defects, structural shipping damage, or deviates completely from the technical specifications listed under the "Value Specs" comparison sheet.</p>
                  
                  <p className="font-bold text-white text-base">3. Mediation & Refund Payouts</p>
                  <p>If a merchant disputes a return claim, the Social Shopperfy administrative office will arbitrate. Return shipping fees are determined on a case-by-case basis based on shipping origin.</p>
                </>
              )}

              {activeModal === 'help' && (
                <>
                  <p className="font-bold text-white text-base">How to Browse and Order</p>
                  <p>1. <strong className="text-white">Swipe Discover:</strong> Swipe left or right on the product showcase. Swiping right automatically catalogs items you find interesting.</p>
                  <p>2. <strong className="text-white">Active Targeting:</strong> Toggle the "Budget Slash" or "Value Specs" personas in the header to filter items based on your focus.</p>
                  <p>3. <strong className="text-white">Micro-Negotiation:</strong> Click any product to check detailed specs. You can trigger WhatsApp chats directly with verified vendors or consult our AI Chat Assistant drawer at the bottom right for automatic discount codes!</p>
                  <p>4. <strong className="text-white">Bank-Grade Checkout:</strong> Finish the secure multi-stage checkout with our escrow protocol to guarantee a secure transaction.</p>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-8 pt-4 border-t border-white/5 flex justify-end">
              <button 
                onClick={closeModal} 
                className="px-5 py-2 rounded-xl bg-primary text-black font-mono font-bold text-xs hover:bg-primary/90 transition-all cursor-pointer"
              >
                Acknowledge Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
