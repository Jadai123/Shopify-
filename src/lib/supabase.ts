import dbStore from '../../db_store.json';

export interface Session {
  user: {
    id: string;
    email: string;
    role: 'user' | 'admin';
    persona: 'Budget' | 'Value' | null;
    fullName?: string;
    phoneNumber?: string;
  } | null;
}

type AuthStateChangeCallback = (event: 'SIGNED_IN' | 'SIGNED_OUT' | 'INITIAL_SESSION', session: Session | null) => void;

// ----------------------------------------------------
// LOCAL STORAGE CLIENT DATABASE FALLBACK ENGINE
// ----------------------------------------------------
const getLocalCollection = <T>(key: string, defaultData: T): T => {
  try {
    const saved = localStorage.getItem(`shopperfy_local_${key}`);
    return saved ? JSON.parse(saved) : defaultData;
  } catch (e) {
    return defaultData;
  }
};

const saveLocalCollection = (key: string, data: any) => {
  try {
    localStorage.setItem(`shopperfy_local_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save collection to localStorage', e);
  }
};

export const localDb = {
  getVendors: () => getLocalCollection('vendors', dbStore.vendors),
  getProducts: () => getLocalCollection('products', dbStore.products),
  getAdminSettings: () => getLocalCollection('admin_settings', dbStore.admin_settings),
  saveAdminSettings: (settings: any) => saveLocalCollection('admin_settings', settings),
  
  getOrders: () => getLocalCollection<any[]>('orders', dbStore.orders || []),
  saveOrders: (orders: any[]) => saveLocalCollection('orders', orders),
  
  getWishlist: (email: string) => {
    const wishlists = getLocalCollection<any[]>('wishlists', dbStore.wishlists || []);
    return wishlists.filter(w => w.email.toLowerCase() === email.toLowerCase());
  },
  toggleWishlist: (email: string, productId: string) => {
    const wishlists = getLocalCollection<any[]>('wishlists', dbStore.wishlists || []);
    const index = wishlists.findIndex(w => w.email.toLowerCase() === email.toLowerCase() && w.product_id === productId);
    let status = 'added';
    if (index > -1) {
      wishlists.splice(index, 1);
      status = 'removed';
    } else {
      wishlists.push({
        id: `wish-${Date.now()}-${Math.random().toString(36).substring(2)}`,
        email,
        product_id: productId,
        created_at: new Date().toISOString()
      });
    }
    saveLocalCollection('wishlists', wishlists);
    return { status, wishlist: wishlists.filter(w => w.email.toLowerCase() === email.toLowerCase()) };
  },
  
  getPriceAlerts: (email: string) => {
    const alerts = getLocalCollection<any[]>('price_alerts', dbStore.price_alerts || []);
    return alerts.filter(a => a.email.toLowerCase() === email.toLowerCase());
  },
  createPriceAlert: (email: string, productId: string, targetPrice: number) => {
    const alerts = getLocalCollection<any[]>('price_alerts', dbStore.price_alerts || []);
    const newAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substring(2)}`,
      email,
      product_id: productId,
      target_price: targetPrice,
      created_at: new Date().toISOString(),
      active: true
    };
    alerts.push(newAlert);
    saveLocalCollection('price_alerts', alerts);
    return newAlert;
  },
  deletePriceAlert: (id: string) => {
    let alerts = getLocalCollection<any[]>('price_alerts', dbStore.price_alerts || []);
    const initialLen = alerts.length;
    alerts = alerts.filter(a => a.id !== id);
    saveLocalCollection('price_alerts', alerts);
    return alerts.length < initialLen;
  },
  
  getUsers: () => getLocalCollection<any[]>('users', dbStore.users || []),
  saveUsers: (users: any[]) => saveLocalCollection('users', users),
  
  getProfiles: () => getLocalCollection<any[]>('profiles', dbStore.profiles || []),
  saveProfiles: (profiles: any[]) => saveLocalCollection('profiles', profiles),
};

// Track current session in local storage for fallback
let currentSession: any = (() => {
  try {
    const saved = localStorage.getItem('shopperfy_local_session');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
})();

const saveSession = (session: any) => {
  currentSession = session;
  try {
    if (session) {
      localStorage.setItem('shopperfy_local_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('shopperfy_local_session');
    }
  } catch (e) {}
};

// Fallback Detection Flag
export let isFallbackActive = false;

if (typeof window !== 'undefined') {
  const hostname = window.location.hostname;
  if (hostname.includes('vercel.app') || hostname.includes('github.io') || localStorage.getItem('shopperfy_force_fallback') === 'true') {
    isFallbackActive = true;
    console.log('[Self-Healing] Detected static hosting deployment. Forcing offline client-side fallback mode.');
  }
}

// ----------------------------------------------------
// UNIFIED RETRY & FALLBACK FETCH INTERCEPTOR
// ----------------------------------------------------
export async function apiFetch(url: string, options?: RequestInit): Promise<Response> {
  if (isFallbackActive) {
    return mockResponse(url, options);
  }

  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    
    // Switch to fallback if server response indicates an HTML page instead of JSON
    if (!res.ok && contentType.includes('text/html')) {
      console.warn(`[Self-Healing] HTTP ${res.status} returned HTML on ${url}. Activating client-side fallback.`);
      isFallbackActive = true;
      return mockResponse(url, options);
    }
    
    // Check if 200 OK is returned but the response is actually an HTML page (Vercel catch-all router redirect)
    if (res.ok && (url.startsWith('/api/') || url.includes('/api'))) {
      const clone = res.clone();
      try {
        const text = await clone.text();
        const textTrim = text.trim();
        if (textTrim.startsWith('<!DOCTYPE') || textTrim.startsWith('<html') || textTrim.startsWith('The page')) {
          console.warn(`[Self-Healing] Static router redirected API route ${url} to HTML index. Activating client-side fallback.`);
          isFallbackActive = true;
          return mockResponse(url, options);
        }
      } catch (err) {}
    }

    return res;
  } catch (err) {
    console.warn(`[Self-Healing] Connection failed for ${url}. Activating client-side fallback.`, err);
    isFallbackActive = true;
    return mockResponse(url, options);
  }
}

// Intercept window.fetch globally to make fallback transparent for all components (safely wrapped)
if (typeof window !== 'undefined') {
  try {
    const originalFetch = window.fetch;
    if (originalFetch) {
      try {
        Object.defineProperty(window, 'fetch', {
          value: async function (input: any, init: any) {
            const url = typeof input === 'string' ? input : (input && (input as any).url) || '';
            if (url && (url.startsWith('/api/') || url.includes('/api'))) {
              return apiFetch(url, init);
            }
            return originalFetch.apply(this, arguments as any);
          },
          writable: true,
          configurable: true
        });
      } catch (err) {
        console.warn('[Self-Healing] Object.defineProperty on window.fetch failed:', err);
        // Fallback standard assignment in case Object.defineProperty is blocked but assignment is possible
        (window as any).fetch = async function (input: any, init: any) {
          const url = typeof input === 'string' ? input : (input && (input as any).url) || '';
          if (url && (url.startsWith('/api/') || url.includes('/api'))) {
            return apiFetch(url, init);
          }
          return originalFetch.apply(this, arguments as any);
        };
      }
    }
  } catch (e) {
    console.warn('[Self-Healing] Could not override window.fetch globally:', e);
  }
}

// Mock Response Router for Client-Side Operations
async function mockResponse(url: string, options?: RequestInit): Promise<Response> {
  const method = options?.method?.toUpperCase() || 'GET';
  let body: any = {};
  if (options?.body) {
    try {
      body = JSON.parse(options.body as string);
    } catch (e) {}
  }

  const currentUserEmail = currentSession?.user?.email || '';
  let status = 200;
  let data: any = {};

  // Extract path
  let path = url;
  if (url.startsWith('http')) {
    try {
      path = new URL(url).pathname;
    } catch (e) {}
  } else {
    // strip query parameters
    path = url.split('?')[0];
  }

  if (path === '/api/auth/session') {
    data = { session: currentSession };
  } 
  else if (path === '/api/auth/signup') {
    const { email, password, persona, fullName, phoneNumber } = body;
    const users = localDb.getUsers();
    const profiles = localDb.getProfiles();

    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      status = 400;
      data = { error: 'An account with this email already exists' };
    } else {
      const newUserId = `user-${Date.now()}`;
      const newUser = { id: newUserId, email, passwordHash: password, created_at: new Date().toISOString() };
      const newProfile = { 
        id: newUserId, 
        email, 
        role: email.toLowerCase() === 'musajohnjonathan@gmail.com' ? 'admin' : 'user', 
        persona: persona || 'Value', 
        fullName: fullName || '',
        phoneNumber: phoneNumber || '',
        created_at: new Date().toISOString() 
      };

      users.push(newUser);
      profiles.push(newProfile);
      localDb.saveUsers(users);
      localDb.saveProfiles(profiles);

      const session = { user: newProfile };
      saveSession(session);
      data = { session };
    }
  } 
  else if (path === '/api/auth/signin') {
    const { email, password } = body;
    const users = localDb.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user || user.passwordHash !== password) {
      status = 400;
      data = { error: 'Invalid email or password' };
    } else {
      const profiles = localDb.getProfiles();
      let profile = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
      if (!profile) {
        profile = {
          id: user.id,
          email: user.email,
          role: user.email.toLowerCase() === 'musajohnjonathan@gmail.com' ? 'admin' : 'user',
          persona: 'Value',
          fullName: '',
          phoneNumber: '',
          created_at: user.created_at
        };
        profiles.push(profile);
        localDb.saveProfiles(profiles);
      }
      const session = { user: profile };
      saveSession(session);
      data = { session };
    }
  } 
  else if (path === '/api/auth/signout') {
    saveSession(null);
    data = { success: true };
  } 
  else if (path === '/api/auth/update-persona') {
    const { persona } = body;
    if (!currentSession?.user) {
      status = 401;
      data = { error: 'Unauthorized' };
    } else {
      const profiles = localDb.getProfiles();
      const profile = profiles.find(p => p.email.toLowerCase() === currentUserEmail.toLowerCase());
      if (profile) {
        profile.persona = persona;
        localDb.saveProfiles(profiles);
      }
      currentSession.user.persona = persona;
      saveSession(currentSession);
      data = { session: currentSession };
    }
  } 
  else if (path === '/api/products') {
    data = localDb.getProducts();
  } 
  else if (path === '/api/vendors') {
    data = localDb.getVendors();
  } 
  else if (path === '/api/admin/settings') {
    if (method === 'POST') {
      localDb.saveAdminSettings(body);
      data = body;
    } else {
      data = localDb.getAdminSettings();
    }
  } 
  else if (path === '/api/wishlist') {
    data = currentUserEmail ? localDb.getWishlist(currentUserEmail) : [];
  } 
  else if (path === '/api/wishlist/toggle') {
    if (!currentUserEmail) {
      status = 401;
      data = { error: 'Unauthorized' };
    } else {
      data = localDb.toggleWishlist(currentUserEmail, body.productId);
    }
  } 
  else if (path === '/api/price-alerts') {
    if (method === 'POST') {
      if (!currentUserEmail) {
        status = 401;
        data = { error: 'Unauthorized' };
      } else {
        data = localDb.createPriceAlert(currentUserEmail, body.productId, body.targetPrice);
      }
    } else {
      data = currentUserEmail ? localDb.getPriceAlerts(currentUserEmail) : [];
    }
  } 
  else if (path.startsWith('/api/price-alerts/')) {
    const id = path.split('/').pop();
    const success = localDb.deletePriceAlert(id || '');
    data = { success };
  } 
  else if (path === '/api/orders/my-orders') {
    data = currentUserEmail ? localDb.getOrders().filter((o: any) => o.user_email.toLowerCase() === currentUserEmail.toLowerCase()) : [];
  } 
  else if (path === '/api/orders') {
    const orderId = `order-${Date.now()}`;
    const newOrder = {
      id: orderId,
      user_email: body.user_email,
      product_id: body.product_id,
      amount_ngn: parseFloat(body.amount_ngn),
      amount_usd: parseFloat(body.amount_usd),
      status: 'pending',
      payment_gateway: body.payment_gateway,
      created_at: new Date().toISOString(),
      referral_code_used: body.referral_code,
      discount_applied_percent: body.discount_applied_percent
    };
    const orders = localDb.getOrders();
    orders.push(newOrder);
    localDb.saveOrders(orders);
    
    data = {
      message: 'Order created successfully!',
      order: newOrder,
      redirect_url: `/checkout/success?order_id=${orderId}`
    };
  } 
  else if (path === '/api/admin/orders') {
    data = localDb.getOrders();
  } 
  else if (path.startsWith('/api/admin/orders/') && path.endsWith('/status')) {
    const parts = path.split('/');
    const orderId = parts[parts.length - 2];
    const orders = localDb.getOrders();
    const order = orders.find((o: any) => o.id === orderId);
    if (order) {
      order.status = body.status;
      localDb.saveOrders(orders);
    }
    data = order || {};
  } 
  else if (path === '/api/admin/users') {
    const profiles = localDb.getProfiles();
    data = profiles.map(p => ({ ...p, is_online: p.email.toLowerCase() === currentUserEmail.toLowerCase() }));
  } 
  else if (path === '/api/ai/chat') {
    const query = body.messages?.[body.messages.length - 1]?.content || '';
    const userPersona = body.userPersona || 'Value';
    const personaIntro = userPersona === 'Budget'
      ? 'The user is a Budget Shopper (focused on discounts, lowest prices, and code MUSA2024).'
      : 'The user is a Value Seeker (focused on product specs, quality, rating, and direct sourcing).';

    let matchedProducts = localDb.getProducts().slice(0, 3);
    if (query) {
      const q = query.toLowerCase();
      const filtered = localDb.getProducts().filter((p: any) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      if (filtered.length > 0) {
        matchedProducts = filtered.slice(0, 3);
      }
    }

    const productsListing = matchedProducts.map((p: any) => `• **${p.name}** - ₦${p.price_ngn.toLocaleString()} / $${p.price_usd} (from verified factory with custom 30-day historic price trend)`).join('\n');

    const content = `Welcome to Social Shopperfy's elite concierge service. ${userPersona === 'Budget' ? 'I highly recommend applying our exclusive admin co-op discount code **MUSA2024** to slash 10% off your active order at checkout!' : 'I have analyzed our co-op directories for certified factory-direct products that meet your exact specifications.'}

Here are some top-tier verified options from our distributed directories:
${productsListing}

You can toggle price alerts, view detailed spec comparisons, or initiate direct, authenticated WhatsApp channels with the factory representatives listed under each product. Let me know if you would like me to refine this search or guide you to checkout!`;

    data = {
      role: 'assistant',
      content
    };
  }

  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Bad Request',
    headers: new Headers({ 'content-type': 'application/json' }),
    json: async () => data,
    text: async () => JSON.stringify(data),
    clone: function() { return this; }
  } as any;
}

// ----------------------------------------------------
// EXPORT COMPATIBLE SUPABASE AUTH CLIENT INTERFACE
// ----------------------------------------------------
class SupabaseAuthClient {
  private listeners: AuthStateChangeCallback[] = [];
  private currentSession: Session | null = null;
  private isInitialized = false;

  constructor() {
    this.fetchSession();
  }

  async fetchSession() {
    try {
      const res = await apiFetch('/api/auth/session');
      if (res.ok) {
        const data = await res.json();
        if (data.session) {
          this.currentSession = data.session;
          this.isInitialized = true;
          this.triggerListeners('INITIAL_SESSION', this.currentSession);
          return this.currentSession;
        }
      }
      this.currentSession = null;
      this.isInitialized = true;
      this.triggerListeners('INITIAL_SESSION', null);
      return null;
    } catch (e) {
      this.currentSession = null;
      this.isInitialized = true;
      this.triggerListeners('INITIAL_SESSION', null);
      return null;
    }
  }

  private triggerListeners(event: 'SIGNED_IN' | 'SIGNED_OUT' | 'INITIAL_SESSION', session: Session | null) {
    this.listeners.forEach(cb => cb(event, session));
  }

  async signUp({ email, password, options }: any) {
    const persona = options?.data?.persona || null;
    const fullName = options?.data?.fullName || '';
    const phoneNumber = options?.data?.phoneNumber || '';
    try {
      const res = await apiFetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, persona, fullName, phoneNumber })
      });
      const data = await res.json();
      if (!res.ok) {
        return { data: { user: null, session: null }, error: new Error(data.error || 'Sign up failed') };
      }
      this.currentSession = data.session;
      this.triggerListeners('SIGNED_IN', this.currentSession);
      return { data: { user: data.session?.user || null, session: data.session || null }, error: null };
    } catch (err: any) {
      return { data: { user: null, session: null }, error: err };
    }
  }

  async signInWithPassword({ email, password }: any) {
    try {
      const res = await apiFetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { data: { user: null, session: null }, error: new Error(data.error || 'Sign in failed') };
      }
      this.currentSession = data.session;
      this.triggerListeners('SIGNED_IN', this.currentSession);
      return { data: { user: data.session?.user || null, session: data.session || null }, error: null };
    } catch (err: any) {
      return { data: { user: null, session: null }, error: err };
    }
  }

  async signOut() {
    try {
      await apiFetch('/api/auth/signout', { method: 'POST' });
      this.currentSession = null;
      this.triggerListeners('SIGNED_OUT', null);
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  }

  async getSession() {
    if (!this.isInitialized) {
      const s = await this.fetchSession();
      return { data: { session: s }, error: null };
    }
    return { data: { session: this.currentSession }, error: null };
  }

  async updateUserPersona(persona: 'Budget' | 'Value' | null) {
    if (!this.currentSession?.user) return { error: new Error('Not logged in') };
    try {
      const res = await apiFetch('/api/auth/update-persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona })
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: new Error(data.error || 'Failed to update persona') };
      }
      this.currentSession = data.session;
      this.triggerListeners('SIGNED_IN', this.currentSession);
      return { data, error: null };
    } catch (err: any) {
      return { error: err };
    }
  }

  onAuthStateChange(callback: AuthStateChangeCallback) {
    this.listeners.push(callback);
    if (this.isInitialized) {
      callback('INITIAL_SESSION', this.currentSession);
    } else {
      this.fetchSession();
    }
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
          }
        }
      }
    };
  }
}

export const supabase = {
  auth: new SupabaseAuthClient()
};
