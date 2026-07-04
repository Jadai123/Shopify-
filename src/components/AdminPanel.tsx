import React, { useState, useEffect } from 'react';
import { Shield, Plus, Edit2, Trash2, Settings, ShoppingBag, Users, Check, Lock, RefreshCw, X, HelpCircle } from 'lucide-react';
import { Product, Vendor, AdminSetting, Order } from '../types';

interface AdminPanelProps {
  products: Product[];
  vendors: Vendor[];
  onRefreshData: () => void;
}

export default function AdminPanel({ products, vendors, onRefreshData }: AdminPanelProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Tabs: 'products' | 'vendors' | 'settings' | 'orders'
  const [activeTab, setActiveTab] = useState<'products' | 'vendors' | 'settings' | 'orders'>('products');

  // Admin settings state
  const [settings, setSettings] = useState<AdminSetting | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Form states for creating/editing
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  // Modals / forms triggers
  const [showProductForm, setShowProductForm] = useState(false);
  const [showVendorForm, setShowVendorForm] = useState(false);

  // Product Form Input Values
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPriceNgn, setProdPriceNgn] = useState('');
  const [prodPriceUsd, setProdPriceUsd] = useState('');
  const [prodCategory, setProdCategory] = useState('Electronics');
  const [prodDiscount, setProdDiscount] = useState('0');
  const [prodVendorId, setProdVendorId] = useState('');
  const [prodStock, setProdStock] = useState<'in_stock' | 'out_of_stock'>('in_stock');
  const [prodSpecs, setProdSpecs] = useState<[string, string][]>([['', '']]);
  const [prodImages, setProdImages] = useState<string[]>(['']);

  // Vendor Form Input Values
  const [vendName, setVendName] = useState('');
  const [vendBio, setVendBio] = useState('');
  const [vendWhatsApp, setVendWhatsApp] = useState('');
  const [vendCountry, setVendCountry] = useState('Nigeria');
  const [vendRating, setVendRating] = useState('5.0');
  const [vendLogo, setVendLogo] = useState('');

  // Admin settings inputs
  const [refCode, setRefCode] = useState('');
  const [refDiscount, setRefDiscount] = useState('10');
  const [refWhatsAppLink, setRefWhatsAppLink] = useState('');

  // Local state save
  const [actionSuccess, setActionSuccess] = useState('');

  // Product Search/Filter
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('');

  // Vendor Search/Filter
  const [vendorSearch, setVendorSearch] = useState('');
  const [vendorCountryFilter, setVendorCountryFilter] = useState('');

  // Clickable/expandable order registry
  const [selectedAdminOrder, setSelectedAdminOrder] = useState<Order | null>(null);

  const adminAuthHeader = 'Basic ' + btoa('musajohnjonathan@gmail.com:adminJohn');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'musajohnjonathan@gmail.com' && password === 'adminJohn') {
      setIsLoggedIn(true);
      setAuthError('');
      loadAdminSpecifics();
    } else {
      setAuthError('Access Denied: Invalid primary admin credentials.');
    }
  };

  const loadAdminSpecifics = () => {
    // Fetch settings
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        if (data) {
          setRefCode(data.referral_code);
          setRefDiscount(data.discount_percentage.toString());
          setRefWhatsAppLink(data.whatsapp_link || '');
        }
      });

    // Fetch orders with auth
    fetch('/api/admin/orders', {
      headers: { 'Authorization': adminAuthHeader }
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data || []);
      })
      .catch(err => console.error('[Error loading orders]:', err));
  };

  // Trigger settings update
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/admin/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': adminAuthHeader
      },
      body: JSON.stringify({
        referral_code: refCode,
        discount_percentage: parseInt(refDiscount) || 10,
        whatsapp_link: refWhatsAppLink
      })
    })
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        triggerToast('Admin referral policies updated successfully.');
      });
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': adminAuthHeader
      },
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => res.json())
      .then(() => {
        loadAdminSpecifics();
        triggerToast(`Order status updated to ${newStatus.toUpperCase()}.`);
        if (onRefreshData) onRefreshData();
      })
      .catch(err => console.error('[Error updating order status]:', err));
  };

  const triggerToast = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  // Prepare product states for creation/editing
  const openAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdDesc('');
    setProdPriceNgn('');
    setProdPriceUsd('');
    setProdCategory('Electronics');
    setProdDiscount('0');
    setProdVendorId(vendors[0]?.id || '');
    setProdStock('in_stock');
    setProdSpecs([['Brand', ''], ['Origin', '']]);
    setProdImages(['']);
    setShowProductForm(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdDesc(p.description);
    setProdPriceNgn(p.price_ngn.toString());
    setProdPriceUsd(p.price_usd.toString());
    setProdCategory(p.category);
    setProdDiscount(p.discount_percent.toString());
    setProdVendorId(p.vendor_id);
    setProdStock(p.stock_status);
    setProdSpecs(Object.entries(p.specs));
    setProdImages(p.images);
    setShowProductForm(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const specsObj: Record<string, string> = {};
    prodSpecs.forEach(([k, v]) => {
      if (k.trim()) specsObj[k.trim()] = v.trim();
    });

    const body = {
      vendor_id: prodVendorId,
      name: prodName,
      description: prodDesc,
      price_ngn: parseFloat(prodPriceNgn),
      price_usd: parseFloat(prodPriceUsd),
      discount_percent: parseInt(prodDiscount) || 0,
      category: prodCategory,
      images: prodImages.filter(img => img.trim() !== ''),
      specs: specsObj,
      stock_status: prodStock
    };

    const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': adminAuthHeader
      },
      body: JSON.stringify(body)
    })
      .then(res => {
        if (!res.ok) throw new Error('Action failed');
        return res.json();
      })
      .then(() => {
        setShowProductForm(false);
        onRefreshData();
        triggerToast(editingProduct ? 'Product metadata modified successfully.' : 'New product successfully uploaded.');
      })
      .catch(err => alert(err.message));
  };

  const handleDeleteProduct = (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': adminAuthHeader }
    })
      .then(res => {
        if (!res.ok) throw new Error('Deletion failed');
        onRefreshData();
        triggerToast('Product deleted successfully.');
      })
      .catch(err => alert(err.message));
  };

  // Vendor handling
  const openAddVendor = () => {
    setEditingVendor(null);
    setVendName('');
    setVendBio('');
    setVendWhatsApp('');
    setVendCountry('Nigeria');
    setVendRating('5.0');
    setVendLogo('');
    setShowVendorForm(true);
  };

  const openEditVendor = (v: Vendor) => {
    setEditingVendor(v);
    setVendName(v.name);
    setVendBio(v.bio);
    setVendWhatsApp(v.whatsapp_number);
    setVendCountry(v.country);
    setVendRating(v.rating.toString());
    setVendLogo(v.logo_url);
    setShowVendorForm(true);
  };

  const handleVendorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      name: vendName,
      bio: vendBio,
      whatsapp_number: vendWhatsApp,
      country: vendCountry,
      rating: parseFloat(vendRating) || 5.0,
      logo_url: vendLogo
    };

    const url = editingVendor ? `/api/vendors/${editingVendor.id}` : '/api/vendors';
    const method = editingVendor ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': adminAuthHeader
      },
      body: JSON.stringify(body)
    })
      .then(res => {
        if (!res.ok) throw new Error('Action failed');
        return res.json();
      })
      .then(() => {
        setShowVendorForm(false);
        onRefreshData();
        triggerToast(editingVendor ? 'Vendor metadata modified successfully.' : 'New global vendor established.');
      })
      .catch(err => alert(err.message));
  };

  const handleDeleteVendor = (id: string) => {
    if (!confirm('Warning: Deleting a vendor will delete all products associated with them! Proceed?')) return;
    fetch(`/api/vendors/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': adminAuthHeader }
    })
      .then(res => {
        if (!res.ok) throw new Error('Deletion failed');
        onRefreshData();
        triggerToast('Vendor deleted along with their products.');
      })
      .catch(err => alert(err.message));
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12" id="admin-login-screen">
        <div className="max-w-md w-full p-8 rounded-2xl glass-card border border-primary/20 shadow-2xl text-center">
          <div className="inline-flex p-3 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-2">Primary Admin Gate</h2>
          <p className="text-gray-400 text-xs mb-6 font-mono">SOCIAL SHOPPERFY • CRYPTOGRAPHIC TRUST</p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-primary placeholder-gray-600"
                id="admin-email-field"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Passkey</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-primary placeholder-gray-600"
                id="admin-password-field"
              />
            </div>

            {authError && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-1.5 font-mono">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 mt-6 bg-gradient-to-r from-primary to-secondary text-black font-extrabold rounded-lg hover:shadow-neon-green transition-shadow text-sm cursor-pointer"
              id="admin-auth-submit"
            >
              Sign In to Ledger
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8" id="admin-dashboard">
      {/* Toast Alert */}
      {actionSuccess && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-lg bg-emerald-600 text-white font-mono text-xs flex items-center gap-2 shadow-2xl animate-bounce">
          <Check className="w-4 h-4" />
          {actionSuccess}
        </div>
      )}

      {/* Admin Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-white/5">
        <div>
          <h2 className="font-display text-3xl font-extrabold text-white mb-1 flex items-center gap-2">
            Admin Management Ledger
            <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 text-[10px] font-mono font-bold uppercase tracking-wider">
              AUTHORIZED
            </span>
          </h2>
          <p className="text-gray-400 text-xs font-mono">
            Signed in as: <strong className="text-white">musajohnjonathan@gmail.com</strong>
          </p>
        </div>

        <button
          onClick={() => { onRefreshData(); loadAdminSpecifics(); triggerToast('Ledger data synced.'); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-white/5 rounded-lg hover:border-white/15 text-xs text-white font-mono cursor-pointer transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Sync Data
        </button>
      </div>

      {/* Navigation tabs row */}
      <div className="flex border-b border-white/5 gap-6 mb-8 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'products', label: 'Products & Stock', icon: ShoppingBag },
          { id: 'vendors', label: 'Vendors Registry', icon: Users },
          { id: 'orders', label: 'Completed Sales Log', icon: ShoppingBag },
          { id: 'settings', label: 'Referral & General Rules', icon: Settings }
        ].map(tab => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-4 text-xs font-mono font-bold uppercase border-b-2 tracking-wider cursor-pointer whitespace-nowrap transition-all ${
                isActive ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-white'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ACTIVE PANEL CONTENT */}

      {/* 1. Products Tab */}
      {activeTab === 'products' && (() => {
        const filteredProducts = products.filter(p => {
          const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
            p.id.toLowerCase().includes(productSearch.toLowerCase()) || 
            p.description.toLowerCase().includes(productSearch.toLowerCase());
          const matchesCategory = productCategoryFilter === '' || p.category.toLowerCase() === productCategoryFilter.toLowerCase();
          return matchesSearch && matchesCategory;
        });

        const productCategories = Array.from(new Set(products.map(p => p.category)));

        return (
          <div className="space-y-6" id="panel-products">
            <div className="flex justify-between items-center">
              <h3 className="font-display text-xl font-bold text-white">Marketplace Products ({products.length})</h3>
              <button
                onClick={openAddProduct}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-black font-extrabold text-xs shadow-neon-green cursor-pointer"
                id="btn-add-product"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>

            {/* Search and filter controls */}
            <div className="flex flex-col sm:flex-row gap-4 bg-neutral-900/40 p-4 rounded-xl border border-white/5">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search products by name, description, ID..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-primary placeholder-gray-600"
                  id="admin-product-search"
                />
              </div>
              <div className="w-full sm:w-48">
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-primary"
                  id="admin-product-category-filter"
                >
                  <option value="">All Categories</option>
                  {productCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/5 bg-dark-surface">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-gray-400 font-mono uppercase bg-neutral-950">
                    <th className="p-4 font-normal">Details</th>
                    <th className="p-4 font-normal">Category</th>
                    <th className="p-4 font-normal text-right">Naira Price</th>
                    <th className="p-4 font-normal text-right">USD Price</th>
                    <th className="p-4 font-normal">Stock Status</th>
                    <th className="p-4 font-normal text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="w-10 h-10 rounded object-cover" referrerPolicy="no-referrer" />
                        <div>
                          <div className="font-bold text-white text-sm">{p.name}</div>
                          <div className="text-[10px] text-gray-500 font-mono">ID: {p.id}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-secondary/10 text-secondary border border-secondary/20 text-[10px] font-mono font-bold uppercase">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-white">
                        ₦{p.price_ngn.toLocaleString()}
                        {p.discount_percent > 0 && (
                          <div className="text-[9px] text-primary">-{p.discount_percent}% Discount</div>
                        )}
                      </td>
                      <td className="p-4 text-right font-mono text-gray-400">
                        ${p.price_usd.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          p.stock_status === 'in_stock' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}>
                          {p.stock_status === 'in_stock' ? 'In Stock' : 'Out Of Stock'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditProduct(p)}
                            className="p-1.5 rounded bg-neutral-900 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 rounded bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-black transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500 font-mono">
                        No products found matching active search parameters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {/* 2. Vendors Tab */}
      {activeTab === 'vendors' && (() => {
        const filteredVendors = vendors.filter(v => {
          const matchesSearch = v.name.toLowerCase().includes(vendorSearch.toLowerCase()) || 
            v.bio.toLowerCase().includes(vendorSearch.toLowerCase());
          const matchesCountry = vendorCountryFilter === '' || v.country.toLowerCase() === vendorCountryFilter.toLowerCase();
          return matchesSearch && matchesCountry;
        });

        const vendorCountries = Array.from(new Set(vendors.map(v => v.country)));

        return (
          <div className="space-y-6" id="panel-vendors">
            <div className="flex justify-between items-center">
              <h3 className="font-display text-xl font-bold text-white">Verified Factory Vendors ({vendors.length})</h3>
              <button
                onClick={openAddVendor}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-black font-extrabold text-xs shadow-neon-green cursor-pointer"
                id="btn-add-vendor"
              >
                <Plus className="w-4 h-4" />
                Add Vendor
              </button>
            </div>

            {/* Search and filter controls */}
            <div className="flex flex-col sm:flex-row gap-4 bg-neutral-900/40 p-4 rounded-xl border border-white/5">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search vendors by name, bio..."
                  value={vendorSearch}
                  onChange={(e) => setVendorSearch(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-primary placeholder-gray-600"
                  id="admin-vendor-search"
                />
              </div>
              <div className="w-full sm:w-48">
                <select
                  value={vendorCountryFilter}
                  onChange={(e) => setVendorCountryFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-primary"
                  id="admin-vendor-country-filter"
                >
                  <option value="">All Countries</option>
                  {vendorCountries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/5 bg-dark-surface">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-gray-400 font-mono uppercase bg-neutral-950">
                    <th className="p-4 font-normal">Vendor details</th>
                    <th className="p-4 font-normal">Associated Country</th>
                    <th className="p-4 font-normal">WhatsApp Contact Number</th>
                    <th className="p-4 font-normal text-center">Score</th>
                    <th className="p-4 font-normal text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredVendors.map(v => (
                    <tr key={v.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img src={v.logo_url} alt="" className="w-10 h-10 rounded object-cover" referrerPolicy="no-referrer" />
                        <div>
                          <div className="font-bold text-white text-sm">{v.name}</div>
                          <div className="text-[10px] text-gray-500 max-w-xs truncate">{v.bio}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-mono text-[10px] uppercase">
                          {v.country}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-gray-300">
                        wa.me/{v.whatsapp_number}
                      </td>
                      <td className="p-4 text-center font-bold text-yellow-400 font-mono">
                        ★ {v.rating}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditVendor(v)}
                            className="p-1.5 rounded bg-neutral-900 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteVendor(v.id)}
                            className="p-1.5 rounded bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-black transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredVendors.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500 font-mono">
                        No vendors found matching active search parameters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {/* 3. Orders log tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6" id="panel-orders">
          <div>
            <h3 className="font-display text-xl font-bold text-white mb-1">Fulfillment Ledger (Order Registry)</h3>
            <p className="text-xs text-gray-500">Real-time compilation of global purchases completed via gateways. Click on any row to expand full secure match ledger details.</p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/5 bg-dark-surface">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/5 text-gray-400 font-mono uppercase bg-neutral-950">
                  <th className="p-4 font-normal">Order Identity</th>
                  <th className="p-4 font-normal">Buyer Account</th>
                  <th className="p-4 font-normal">Purchased Asset</th>
                  <th className="p-4 font-normal text-right">Amount (NGN)</th>
                  <th className="p-4 font-normal">Gateway</th>
                  <th className="p-4 font-normal">Applied Vouchers</th>
                  <th className="p-4 font-normal">Date Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {orders.map(o => {
                  const prod = products.find(p => p.id === o.product_id);
                  const vend = prod ? vendors.find(v => v.id === prod.vendor_id) : null;
                  const isExpanded = selectedAdminOrder?.id === o.id;
                  return (
                    <React.Fragment key={o.id}>
                      <tr 
                        onClick={() => setSelectedAdminOrder(isExpanded ? null : o)}
                        className={`hover:bg-white/5 transition-colors text-gray-300 cursor-pointer ${
                          isExpanded ? 'bg-white/10 text-white font-bold' : ''
                        }`}
                        id={`admin-order-row-${o.id}`}
                      >
                        <td className="p-4 font-bold text-white text-xs">{o.id.replace('order-', '#')}</td>
                        <td className="p-4 text-xs">{o.user_email}</td>
                        <td className="p-4 text-xs text-white">
                          {prod ? prod.name : `Product ID: ${o.product_id}`}
                        </td>
                        <td className="p-4 text-right font-bold text-white">
                          ₦{o.amount_ngn.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            o.payment_gateway === 'paystack' ? 'bg-[#00c0f9]/10 text-[#00c0f9]' : 'bg-[#6772e5]/10 text-[#6772e5]'
                          }`}>
                            {o.payment_gateway}
                          </span>
                        </td>
                        <td className="p-4 text-xs">
                          {o.referral_code_used ? (
                            <span className="text-primary font-bold">{o.referral_code_used} (-{o.discount_applied_percent}%)</span>
                          ) : (
                            <span className="text-gray-600">None</span>
                          )}
                        </td>
                        <td className="p-4 text-[10px] text-gray-500">
                          {new Date(o.created_at).toLocaleString()}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-neutral-900/80">
                          <td colSpan={7} className="p-6 border-b border-white/5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs text-gray-400" id={`admin-expanded-order-details-${o.id}`}>
                              {/* Buyer metadata */}
                              <div className="space-y-2">
                                <h4 className="text-xs font-mono font-bold uppercase text-primary tracking-wider">Buyer & Node Metadata</h4>
                                <div className="space-y-1">
                                  <div><strong className="text-white">Email:</strong> {o.user_email}</div>
                                  <div><strong className="text-white">Transaction Date:</strong> {new Date(o.created_at).toLocaleString()}</div>
                                  <div><strong className="text-white">Fulfillment ID:</strong> {o.id}</div>
                                  <div className="mt-2 pt-1 border-t border-white/5">
                                    <strong className="text-white block mb-1 text-[10px] uppercase font-mono tracking-wider">Fulfillment Status:</strong>
                                    <select
                                      value={o.status || 'pending'}
                                      onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                      className="bg-neutral-900 text-primary border border-white/10 rounded px-2 py-1 text-xs font-mono font-bold cursor-pointer hover:border-primary transition-all w-full max-w-[150px]"
                                    >
                                      <option value="pending">⏳ Pending</option>
                                      <option value="processing">⚙️ Processing</option>
                                      <option value="shipped">🚢 Shipped</option>
                                      <option value="delivered">✅ Delivered</option>
                                      <option value="cancelled">❌ Cancelled</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              {/* Asset specifications */}
                              <div className="space-y-2">
                                <h4 className="text-xs font-mono font-bold uppercase text-secondary tracking-wider">Asset Specifications</h4>
                                {prod ? (
                                  <div className="space-y-1">
                                    <div><strong className="text-white">Product Name:</strong> {prod.name}</div>
                                    <div><strong className="text-white">Category Slug:</strong> {prod.category}</div>
                                    <div><strong className="text-white">Stock Allocation:</strong> {prod.stock_status === 'in_stock' ? 'Allocated In-Stock' : 'On-backorder'}</div>
                                    <div><strong className="text-white">USD Clearance Amount:</strong> ${o.amount_usd} USD</div>
                                  </div>
                                ) : (
                                  <div className="text-gray-500 italic">Product details missing from database store.</div>
                                )}
                              </div>

                              {/* Vendor clearance */}
                              <div className="space-y-2">
                                <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider">Vendor Clearance Details</h4>
                                {vend ? (
                                  <div className="space-y-1">
                                    <div><strong className="text-white">Factory Name:</strong> {vend.name}</div>
                                    <div><strong className="text-white">Country of Origin:</strong> {vend.country}</div>
                                    <div><strong className="text-white">Score Tier:</strong> ★ {vend.rating} Verified</div>
                                    <div>
                                      <strong className="text-white">Direct Line:</strong>{' '}
                                      <a 
                                        href={`https://wa.me/${vend.whatsapp_number}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-emerald-400 underline hover:text-emerald-300"
                                      >
                                        +{vend.whatsapp_number} (WhatsApp)
                                      </a>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-gray-500 italic">No associated vendor registered for this asset.</div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500 font-mono">
                      NO SALES REGISTERED IN LEDGER YET
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Settings tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-2xl" id="panel-settings">
          <div>
            <h3 className="font-display text-xl font-bold text-white mb-2">Global Marketplace settings</h3>
            <p className="text-xs text-gray-500">Configure global co-op referral rewards, admin contact WhatsApp URLs, and discount rules.</p>
          </div>

          <form onSubmit={handleSaveSettings} className="p-6 rounded-xl bg-dark-surface border border-white/5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-2">
                  Admin Referral Discount Code
                </label>
                <input
                  type="text"
                  required
                  value={refCode}
                  onChange={(e) => setRefCode(e.target.value.toUpperCase())}
                  placeholder="MUSA2024"
                  className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-primary"
                  id="setting-referral-code"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-2">
                  Voucher Discount Percentage (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={refDiscount}
                  onChange={(e) => setRefDiscount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-primary"
                  id="setting-discount-percentage"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-2">
                Primary Admin WhatsApp wa.me Link
              </label>
              <input
                type="url"
                required
                value={refWhatsAppLink}
                onChange={(e) => setRefWhatsAppLink(e.target.value)}
                placeholder="https://wa.me/2348039999999"
                className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-primary"
                id="setting-whatsapp-link"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-black font-extrabold rounded-lg hover:shadow-neon-green transition-shadow text-xs cursor-pointer"
              id="btn-save-settings"
            >
              Update Global Policies
            </button>
          </form>
        </div>
      )}

      {/* PRODUCT SUBMISSION FORM MODAL */}
      {showProductForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-3xl w-full bg-dark-surface border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto font-sans">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <h4 className="font-display text-lg font-bold text-white">
                {editingProduct ? 'Modify Product Specifications' : 'Upload New Product Asset'}
              </h4>
              <button onClick={() => setShowProductForm(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 font-mono uppercase mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="w-full p-2.5 rounded bg-neutral-900 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-mono uppercase mb-1">Associate Factory Vendor</label>
                  <select
                    value={prodVendorId}
                    onChange={(e) => setProdVendorId(e.target.value)}
                    className="w-full p-2.5 rounded bg-neutral-900 border border-white/10 text-white"
                  >
                    {vendors.map(v => (
                      <option key={v.id} value={v.id}>{v.name} ({v.country})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-mono uppercase mb-1">Asset Description</label>
                <textarea
                  rows={3}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full p-2.5 rounded bg-neutral-900 border border-white/10 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-400 font-mono uppercase mb-1">Price in Naira (NGN)</label>
                  <input
                    type="number"
                    required
                    value={prodPriceNgn}
                    onChange={(e) => setProdPriceNgn(e.target.value)}
                    className="w-full p-2.5 rounded bg-neutral-900 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-mono uppercase mb-1">Price in USD ($)</label>
                  <input
                    type="number"
                    required
                    value={prodPriceUsd}
                    onChange={(e) => setProdPriceUsd(e.target.value)}
                    className="w-full p-2.5 rounded bg-neutral-900 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-mono uppercase mb-1">Voucher Discount %</label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={prodDiscount}
                    onChange={(e) => setProdDiscount(e.target.value)}
                    className="w-full p-2.5 rounded bg-neutral-900 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-mono uppercase mb-1">Catalog Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full p-2.5 rounded bg-neutral-900 border border-white/10 text-white"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                  </select>
                </div>
              </div>

              {/* Specs array */}
              <div>
                <label className="block text-gray-400 font-mono uppercase mb-2">Asset Specifications Sheet</label>
                <div className="space-y-2">
                  {prodSpecs.map(([k, v], idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Specification Key (e.g. Material)"
                        value={k}
                        onChange={(e) => {
                          const newSpecs = [...prodSpecs];
                          newSpecs[idx][0] = e.target.value;
                          setProdSpecs(newSpecs);
                        }}
                        className="flex-1 p-2 rounded bg-neutral-900 border border-white/5 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Specification Value"
                        value={v}
                        onChange={(e) => {
                          const newSpecs = [...prodSpecs];
                          newSpecs[idx][1] = e.target.value;
                          setProdSpecs(newSpecs);
                        }}
                        className="flex-1 p-2 rounded bg-neutral-900 border border-white/5 text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setProdSpecs(prodSpecs.filter((_, i) => i !== idx))}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setProdSpecs([...prodSpecs, ['', '']])}
                    className="py-1 px-3 border border-white/10 hover:border-white/25 rounded text-gray-300 font-mono"
                  >
                    + Add Spec Property
                  </button>
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-gray-400 font-mono uppercase mb-1">Product Showcase Image URLs</label>
                {prodImages.map((img, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/photo-..."
                      value={img}
                      onChange={(e) => {
                        const newImgs = [...prodImages];
                        newImgs[idx] = e.target.value;
                        setProdImages(newImgs);
                      }}
                      className="flex-1 p-2 rounded bg-neutral-900 border border-white/10 text-white"
                    />
                    {prodImages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setProdImages(prodImages.filter((_, i) => i !== idx))}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded"
                      >
                        X
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setProdImages([...prodImages, ''])}
                  className="py-1 px-3 border border-white/10 hover:border-white/25 rounded text-gray-300 font-mono"
                >
                  + Add Additional Image
                </button>
              </div>

              {/* Stock status */}
              <div>
                <label className="block text-gray-400 font-mono uppercase mb-1">Immediate Inventory Availability</label>
                <select
                  value={prodStock}
                  onChange={(e) => setProdStock(e.target.value as any)}
                  className="p-2.5 rounded bg-neutral-900 border border-white/10 text-white"
                >
                  <option value="in_stock">In Stock</option>
                  <option value="out_of_stock">Out Of Stock</option>
                </select>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowProductForm(false)}
                  className="py-2 px-4 rounded bg-neutral-900 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-6 rounded bg-primary text-black font-extrabold shadow-neon-green"
                >
                  Commit Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VENDOR SUBMISSION FORM MODAL */}
      {showVendorForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-md w-full bg-dark-surface border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <h4 className="font-display text-lg font-bold text-white">
                {editingVendor ? 'Modify Vendor Metadata' : 'Establish New Vendor'}
              </h4>
              <button onClick={() => setShowVendorForm(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVendorSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-mono uppercase mb-1">Vendor Identity Name</label>
                <input
                  type="text"
                  required
                  value={vendName}
                  onChange={(e) => setVendName(e.target.value)}
                  className="w-full p-2.5 rounded bg-neutral-900 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-mono uppercase mb-1">Company Biography</label>
                <textarea
                  rows={3}
                  value={vendBio}
                  onChange={(e) => setVendBio(e.target.value)}
                  className="w-full p-2.5 rounded bg-neutral-900 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-mono uppercase mb-1">WhatsApp wa.me Number (With Country Code)</label>
                <input
                  type="text"
                  required
                  placeholder="2348039999999"
                  value={vendWhatsApp}
                  onChange={(e) => setVendWhatsApp(e.target.value)}
                  className="w-full p-2.5 rounded bg-neutral-900 border border-white/10 text-white font-mono"
                />
                <p className="text-[9px] text-gray-500 mt-1">Do not include +, spaces, or leading zeros. E.g. 2348030000000</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 font-mono uppercase mb-1">Associated Region</label>
                  <select
                    value={vendCountry}
                    onChange={(e) => setVendCountry(e.target.value)}
                    className="w-full p-2.5 rounded bg-neutral-900 border border-white/10 text-white"
                  >
                    <option value="Nigeria">Nigeria</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="China">China</option>
                    <option value="UAE">UAE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 font-mono uppercase mb-1">Initial Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={vendRating}
                    onChange={(e) => setVendRating(e.target.value)}
                    className="w-full p-2.5 rounded bg-neutral-900 border border-white/10 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-mono uppercase mb-1">Avatar Logo Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={vendLogo}
                  onChange={(e) => setVendLogo(e.target.value)}
                  className="w-full p-2.5 rounded bg-neutral-900 border border-white/10 text-white font-mono"
                />
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowVendorForm(false)}
                  className="py-2 px-4 rounded bg-neutral-900 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-6 rounded bg-primary text-black font-extrabold shadow-neon-green"
                >
                  Confirm Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
