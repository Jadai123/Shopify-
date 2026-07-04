import React, { useState, useEffect } from 'react';
import { Sparkles, ShoppingBag, Grid, Shield, RefreshCw, Layers, Percent, ShieldCheck } from 'lucide-react';
import { Product, Vendor, UserPersona } from './types';
import { supabase } from './lib/supabase';

// Modular components
import PersonaOnboarding from './components/PersonaOnboarding';
import SwipeDiscover from './components/SwipeDiscover';
import CategoryView from './components/CategoryView';
import ProductDetail from './components/ProductDetail';
import AIChatAssistant from './components/AIChatAssistant';
import AdminPanel from './components/AdminPanel';
import CustomerDashboard from './components/CustomerDashboard';
import CheckoutFlow from './components/CheckoutFlow';
import GlobalFooter from './components/GlobalFooter';
import AbandonmentPrompt from './components/AbandonmentPrompt';
import AuthModal from './components/AuthModal';

export default function App() {
  const [persona, setPersona] = useState<UserPersona>(null);
  
  // Views: 'discover' | 'catalog' | 'admin' | 'checkout' | 'detail'
  const [view, setView] = useState<'discover' | 'catalog' | 'admin' | 'checkout' | 'detail'>('discover');

  // Shared state
  const [products, setProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [extraDiscount, setExtraDiscount] = useState(0);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Auth specific state
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [pendingCheckoutProduct, setPendingCheckoutProduct] = useState<Product | null>(null);

  // Load auth state & session listeners on boot
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        if (session.user.persona) {
          setPersona(session.user.persona);
          localStorage.setItem('shopperfy_persona', session.user.persona);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load state & Persona from localStorage on boot
  useEffect(() => {
    const savedPersona = localStorage.getItem('shopperfy_persona') as UserPersona;
    if (savedPersona) {
      setPersona(savedPersona);
    }
    fetchMarketData();
  }, [refreshTrigger]);

  const fetchMarketData = async () => {
    setLoading(true);
    setError('');
    try {
      const [prodRes, vendRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/vendors')
      ]);

      if (!prodRes.ok || !vendRes.ok) {
        throw new Error('Failed to download co-op marketplace directories.');
      }

      const prods: Product[] = await prodRes.json();
      const vends: Vendor[] = await vendRes.json();

      setProducts(prods);
      setVendors(vends);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error sync data');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPersona = async (p: UserPersona) => {
    setPersona(p);
    if (p) {
      localStorage.setItem('shopperfy_persona', p);
      if (currentUser) {
        try {
          await supabase.auth.updateUserPersona(p);
        } catch (err) {
          console.error("Failed to sync persona to DB:", err);
        }
      }
    } else {
      localStorage.removeItem('shopperfy_persona');
    }
    setView('discover');
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartCheckout = (product: Product, incentiveDiscount = 0) => {
    if (!currentUser) {
      setPendingCheckoutProduct(product);
      setExtraDiscount(incentiveDiscount);
      setAuthTab('signup'); // Default to register for guest buyers
      setIsAuthOpen(true);
      return;
    }
    setCheckoutProduct(product);
    setExtraDiscount(incentiveDiscount);
    setView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigating categories (e.g., from footer or AI assistant commands)
  const handleNavigateToCategory = (categoryName: string) => {
    setView('catalog');
    // We can filter inside CategoryView since it responds to prop initialCategory
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  // If loading the initial schema data
  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-dark-bg text-white flex flex-col items-center justify-center font-mono">
        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 shadow-neon-green mb-6 flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-primary animate-spin" />
          <span>Synchronizing Social Shopperfy Distributed Ledger...</span>
        </div>
        <p className="text-xs text-gray-500 uppercase tracking-widest">Nigeria • US • UK • UAE • China</p>
      </div>
    );
  }

  // If no onboarding persona is established, show Onboarding selection view first
  if (!persona) {
    return (
      <div className="min-h-screen bg-dark-bg text-white flex flex-col justify-between">
        <header className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-neutral-950">
          <div className="font-display text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Social <span className="text-primary">Shopperfy</span>
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </div>
        </header>
        <PersonaOnboarding onSelect={handleSelectPersona} />
        <footer className="py-6 text-center text-xs text-gray-600 font-mono border-t border-white/5">
          © 2026 Social Shopperfy Co-Op. Secure Ledger Enabled.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col justify-between" id="app-root">
      
      {/* Dynamic Abandonment Re-engagement prompt */}
      <AbandonmentPrompt
        products={products}
        onResumeCheckout={(prod, bonus) => handleStartCheckout(prod, bonus)}
      />

      {/* Persistent App Header */}
      <header className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur-md border-b border-white/5 px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        {/* Brand identity */}
        <div
          onClick={() => { setView('discover'); setSelectedProduct(null); }}
          className="font-display text-xl md:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2 cursor-pointer"
        >
          Social <span className="text-primary">Shopperfy</span>
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
        </div>

        {/* View Selection Controls */}
        <nav className="flex items-center gap-1.5 md:gap-4 text-xs font-mono font-bold uppercase tracking-wider">
          <button
            onClick={() => { setView('discover'); setSelectedProduct(null); }}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              view === 'discover' ? 'text-primary bg-primary/10 border border-primary/20' : 'text-gray-400 hover:text-white'
            }`}
            id="nav-discover"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Swipe</span> Discover
          </button>

          <button
            onClick={() => { setView('catalog'); setSelectedProduct(null); }}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              view === 'catalog' ? 'text-primary bg-primary/10 border border-primary/20' : 'text-gray-400 hover:text-white'
            }`}
            id="nav-catalog"
          >
            <Grid className="w-3.5 h-3.5" />
            Browse <span className="hidden sm:inline">Catalog</span>
          </button>

          <button
            onClick={() => {
              if (!currentUser) {
                setAuthTab('signin');
                setIsAuthOpen(true);
              } else {
                setView('admin');
                setSelectedProduct(null);
              }
            }}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              view === 'admin' ? 'text-secondary bg-secondary/10 border border-secondary/20' : 'text-gray-400 hover:text-white'
            }`}
            id="nav-admin"
          >
            <Shield className="w-3.5 h-3.5" />
            {currentUser ? (currentUser.role === 'admin' ? 'Admin Ledger' : 'My Account') : 'My Account'}
          </button>
        </nav>

        {/* Profile switches and Refresh info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-white/5">
            <span className="text-[10px] font-mono text-gray-500 uppercase">Hunt:</span>
            <button
              onClick={() => handleSelectPersona(persona === 'Budget' ? 'Value' : 'Budget')}
              className={`text-[10px] font-mono font-bold uppercase rounded-full px-2 py-0.5 flex items-center gap-1 transition-all cursor-pointer ${
                persona === 'Budget' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-secondary/20 text-secondary border border-secondary/30'
              }`}
              title="Click to switch onboarding profile"
              id="header-persona-switcher"
            >
              {persona === 'Budget' ? (
                <>
                  <Percent className="w-2.5 h-2.5" />
                  Budget Slash
                </>
              ) : (
                <>
                  <ShieldCheck className="w-2.5 h-2.5" />
                  Value Specs
                </>
              )}
            </button>
          </div>
          
          {currentUser ? (
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                setView('discover');
              }}
              className="text-[10px] font-mono text-red-400 hover:text-red-300 border border-red-500/10 px-2 py-1.5 rounded bg-neutral-900 cursor-pointer"
              id="signout-btn"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => {
                setAuthTab('signin');
                setIsAuthOpen(true);
              }}
              className="text-[10px] font-mono text-primary hover:text-white border border-primary/20 px-2.5 py-1.5 rounded bg-neutral-900 font-bold cursor-pointer"
              id="signin-btn"
            >
              Sign In
            </button>
          )}

          <button
            onClick={() => handleSelectPersona(null)}
            className="text-[10px] font-mono text-gray-500 hover:text-white border border-white/5 px-2 py-1.5 rounded bg-neutral-900 cursor-pointer"
            id="reset-persona-btn"
          >
            Onboard
          </button>
        </div>
      </header>

      {/* Main Views Container */}
      <main className="flex-1 pb-16">
        {error && (
          <div className="max-w-xl mx-auto my-6 p-4 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono text-center">
            {error}
          </div>
        )}

        {view === 'discover' && !selectedProduct && (
          <div className="space-y-16">
            {/* 1. Hero / Title Section */}
            <div className="text-center max-w-4xl mx-auto px-4 pt-10 pb-4 animate-fade-in">
              <span className="text-[10px] font-mono font-bold tracking-widest text-primary uppercase bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                Global B2B2C Factory Direct Sourcing Co-Op
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mt-5 tracking-tight leading-none">
                Social Shopperfy: Alibaba <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Meets Jumia</span>
              </h1>
              <p className="text-gray-400 text-sm md:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
                Connect directly with certified international factories. Unlock group buy discounts, engage our intelligent AI negotiation agent, and complete secure checkouts in Naira or US Dollars.
              </p>
              <div className="flex justify-center gap-3 mt-6">
                <button 
                  onClick={() => handleNavigateToCategory('Electronics')} 
                  className="px-5 py-2.5 rounded-lg bg-primary text-black font-extrabold text-xs tracking-wider uppercase hover:shadow-neon-green transition-shadow cursor-pointer"
                >
                  Explore Factory Tech
                </button>
                <button 
                  onClick={() => { setView('catalog'); }} 
                  className="px-5 py-2.5 rounded-lg bg-neutral-900 border border-white/10 text-gray-300 font-extrabold text-xs tracking-wider uppercase hover:border-white/20 transition-all cursor-pointer"
                >
                  Browse Catalog Directory
                </button>
              </div>
            </div>

            {/* Live Stats Bar */}
            {(() => {
              const liveCategoriesCount = Array.from(new Set(products.map(p => p.category))).length;
              const liveCountriesCount = Array.from(new Set(vendors.map(v => v.country))).length;
              return (
                <div className="max-w-5xl mx-auto px-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-neutral-950/60 p-6 rounded-2xl border border-white/5 font-mono text-center">
                    <div>
                      <div className="text-2xl md:text-3xl font-extrabold text-white">{products.length}+</div>
                      <div className="text-[10px] text-gray-500 uppercase mt-1">Live Factory Products</div>
                    </div>
                    <div>
                      <div className="text-2xl md:text-3xl font-extrabold text-primary">{vendors.length}+</div>
                      <div className="text-[10px] text-gray-500 uppercase mt-1">Verified Factory Partners</div>
                    </div>
                    <div>
                      <div className="text-2xl md:text-3xl font-extrabold text-secondary">{liveCountriesCount}</div>
                      <div className="text-[10px] text-gray-500 uppercase mt-1">Sourcing Countries</div>
                    </div>
                    <div>
                      <div className="text-2xl md:text-3xl font-extrabold text-white">{liveCategoriesCount}</div>
                      <div className="text-[10px] text-gray-500 uppercase mt-1">Sourcing Categories</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 2. Interactive Curated Swipe Deck */}
            <div className="max-w-md mx-auto px-4">
              <div className="text-center mb-6">
                <h2 className="font-display text-xs font-extrabold text-primary uppercase tracking-widest font-mono">FACTORY HIGHLIGHT DECK</h2>
                <p className="text-[10px] text-gray-500 font-mono uppercase mt-1">Swipe cards to review, like, and custom negotiate</p>
              </div>
              <SwipeDiscover
                products={products}
                vendors={vendors}
                persona={persona}
                onSelectProduct={handleSelectProduct}
                onStartCheckout={(p) => handleStartCheckout(p)}
              />
            </div>

            {/* Featured Categories Row */}
            <div className="max-w-5xl mx-auto px-4">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">Direct Sourcing Sectors</h3>
                  <p className="text-xs text-gray-500">Uncompromised quality straight from verified factory assemblies.</p>
                </div>
                <button onClick={() => setView('catalog')} className="text-xs text-primary hover:underline font-mono uppercase tracking-wider">View All</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Array.from(new Set(products.map(p => p.category as string))).slice(0, 4).map(cat => {
                  const catProds = products.filter(p => p.category === cat);
                  const sampleImg = catProds[0]?.images[0] || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80';
                  return (
                    <div 
                      key={cat}
                      onClick={() => handleNavigateToCategory(cat as string)}
                      className="group relative h-40 rounded-xl overflow-hidden border border-white/5 bg-neutral-900 cursor-pointer hover:border-primary/40 transition-all"
                    >
                      <img src={sampleImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="text-[9px] font-mono font-bold uppercase text-primary mb-1">{catProds.length} ASSETS</div>
                        <h4 className="text-xs font-bold text-white font-display uppercase tracking-wider">{cat}</h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Why Us section with full copy */}
            <div className="max-w-5xl mx-auto px-4 py-8 border-y border-white/5">
              <div className="text-center mb-10">
                <h3 className="font-display text-2xl font-extrabold text-white">Why Co-Op Sourcing Beats Traditional Retail Markup</h3>
                <p className="text-xs text-gray-500 font-mono mt-1 uppercase">Eliminate intermediaries, pay manufacturing cost direct.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-xl bg-neutral-900/40 border border-white/5">
                  <div className="text-primary font-mono text-sm font-bold mb-3">01 / SMART AI AGENTS</div>
                  <h4 className="text-white font-bold text-xs mb-1">Algorithmic Sourcing & Negotiating</h4>
                  <p className="text-gray-400 text-[11px] leading-relaxed font-sans">
                    Our server-side AI model connects directly with manufacturing endpoints to simulate bulk bargaining, securing volume-tier price catalogs even for individual orders.
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-neutral-900/40 border border-white/5">
                  <div className="text-secondary font-mono text-sm font-bold mb-3">02 / LOCAL GATEWAY CLARITY</div>
                  <h4 className="text-white font-bold text-xs mb-1">Zero Foreign Currency Friction</h4>
                  <p className="text-gray-400 text-[11px] leading-relaxed font-sans">
                    Settle international wholesale catalog purchases seamlessly with your active local cards or transfers (Paystack, Stripe) without incurring high forex margins.
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-neutral-900/40 border border-white/5">
                  <div className="text-white font-mono text-sm font-bold mb-3">03 / CONSOLIDATED FREIGHT</div>
                  <h4 className="text-white font-bold text-xs mb-1">Low-Tariff Custom Paths</h4>
                  <p className="text-gray-400 text-[11px] leading-relaxed font-sans">
                    By aggregating community packages together, we execute micro-bulk air cargo clearances, reducing shipping rates by up to 60% with complete local delivery.
                  </p>
                </div>
              </div>
            </div>

            {/* Global Presence Section showing vendor counts per country */}
            <div className="max-w-5xl mx-auto px-4 pb-8">
              <div className="text-center mb-8">
                <h3 className="font-display text-xl font-bold text-white">Global Trade Footprint</h3>
                <p className="text-xs text-gray-500 mt-1">Direct shipping validation paths established from global manufacturing hubs.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {(() => {
                  const countryMapping = [
                    { country: 'Nigeria', flag: '🇳🇬', region: 'West Africa Hub' },
                    { country: 'United States', flag: '🇺🇸', region: 'North America Direct' },
                    { country: 'United Arab Emirates', flag: '🇦🇪', region: 'Middle East Hub' },
                    { country: 'China', flag: '🇨🇳', region: 'East Asia Manufacturing' },
                    { country: 'United Kingdom', flag: '🇬🇧', region: 'Western Europe Hub' }
                  ];
                  return countryMapping.map(({ country, flag, region }) => {
                    const count = vendors.filter(v => v.country.toLowerCase().includes(country.toLowerCase()) || country.toLowerCase().includes(v.country.toLowerCase())).length;
                    return (
                      <div key={country} className="p-4 rounded-xl bg-neutral-900/30 border border-white/5 text-center font-mono">
                        <div className="text-3xl mb-2">{flag}</div>
                        <div className="text-white text-xs font-bold truncate">{country}</div>
                        <div className="text-[9px] text-gray-500 mt-0.5">{region}</div>
                        <div className="inline-block px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[9px] mt-3 font-extrabold">
                          {count || 2} VENDORS
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        )}

        {view === 'catalog' && !selectedProduct && (
          <CategoryView
            products={products}
            vendors={vendors}
            persona={persona}
            onSelectProduct={handleSelectProduct}
            onStartCheckout={(p) => handleStartCheckout(p)}
          />
        )}

        {view === 'detail' && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            vendors={vendors}
            onBack={() => setView('discover')}
            onStartCheckout={(p) => handleStartCheckout(p)}
          />
        )}

        {view === 'checkout' && checkoutProduct && (
          <CheckoutFlow
            product={checkoutProduct}
            vendors={vendors}
            onBackToMarket={() => setView('discover')}
            onOrderCompleted={() => setRefreshTrigger(prev => prev + 1)}
          />
        )}

        {view === 'admin' && currentUser && (
          currentUser.role === 'admin' ? (
            <AdminPanel
              products={products}
              vendors={vendors}
              onRefreshData={() => setRefreshTrigger(prev => prev + 1)}
            />
          ) : (
            <CustomerDashboard
              user={currentUser}
              products={products}
              vendors={vendors}
              onSignOut={async () => {
                await supabase.auth.signOut();
                setView('discover');
              }}
              onRefreshData={() => setRefreshTrigger(prev => prev + 1)}
            />
          )
        )}
      </main>

      {/* Floating AI Chat widget drawer */}
      <AIChatAssistant
        userPersona={persona}
        onNavigateToCategory={handleNavigateToCategory}
        onSelectProduct={handleSelectProduct}
        onStartCheckout={(p) => handleStartCheckout(p)}
      />

      {/* Global Brand Footer */}
      <GlobalFooter
        onNavigateToCategory={handleNavigateToCategory}
        onSetView={(v) => { setView(v); setSelectedProduct(null); }}
      />

      {/* Auth Modal Overlay */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialTab={authTab}
        onSuccess={(session) => {
          if (session?.user) {
            setCurrentUser(session.user);
            if (session.user.persona) {
              setPersona(session.user.persona);
              localStorage.setItem('shopperfy_persona', session.user.persona);
            }
            
            // Resume guest checkout if product queued
            if (pendingCheckoutProduct) {
              setCheckoutProduct(pendingCheckoutProduct);
              setPendingCheckoutProduct(null);
              setView('checkout');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              // Direct normal login to the appropriate panel or homepage
              setView('admin');
            }
          }
        }}
      />
    </div>
  );
}
