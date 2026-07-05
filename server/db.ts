import fs from 'fs';
import path from 'path';
import {
  SEED_VENDORS,
  getSeededProducts,
  getSeededPriceHistory,
  SEED_ADMIN_SETTINGS
} from './seed_data.ts';

export interface Vendor {
  id: string;
  name: string;
  logo_url: string;
  whatsapp_number: string;
  country: string;
  rating: number;
  bio: string;
  created_at: string;
}

export interface Product {
  id: string;
  vendor_id: string;
  name: string;
  description: string;
  price_ngn: number;
  price_usd: number;
  discount_percent: number;
  category: string;
  images: string[];
  specs: Record<string, string>;
  stock_status: 'in_stock' | 'out_of_stock';
  created_at: string;
}

export interface PriceHistory {
  id: string;
  product_id: string;
  price_ngn: number;
  recorded_at: string;
}

export interface AdminSetting {
  id: number;
  admin_email: string;
  referral_code: string;
  discount_percentage: number;
  whatsapp_link: string;
  app_name?: string;
  hero_title?: string;
  hero_subtitle?: string;
  shipping_rate_kg?: number;
}

export interface Order {
  id: string;
  user_email: string;
  product_id: string;
  amount_ngn: number;
  amount_usd: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_gateway: 'paystack' | 'stripe';
  created_at: string;
  referral_code_used?: string;
  discount_applied_percent?: number;
}

export interface WishlistItem {
  id: string;
  email: string;
  product_id: string;
  created_at: string;
}

export interface PriceAlert {
  id: string;
  email: string;
  product_id: string;
  target_price: number;
  created_at: string;
  active: boolean;
}

export interface Profile {
  id: string;
  email: string;
  role: 'user' | 'admin';
  persona: 'Budget' | 'Value' | null;
  created_at: string;
  last_active_at?: string;
  fullName?: string;
  phoneNumber?: string;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  created_at: string;
}

const DB_FILE = path.join(process.cwd(), 'db_store.json');

const freshSeededProducts = getSeededProducts();

const INITIAL_STORE_STATE = {
  vendors: SEED_VENDORS,
  products: freshSeededProducts,
  price_history: getSeededPriceHistory(freshSeededProducts),
  admin_settings: SEED_ADMIN_SETTINGS,
  orders: [] as Order[],
  wishlists: [] as WishlistItem[],
  price_alerts: [] as PriceAlert[],
  users: [
    {
      id: 'user-admin',
      email: 'musajohnjonathan@gmail.com',
      passwordHash: 'adminJohn',
      created_at: new Date().toISOString()
    }
  ] as User[],
  profiles: [
    {
      id: 'user-admin',
      email: 'musajohnjonathan@gmail.com',
      role: 'admin' as const,
      persona: 'Value' as const,
      created_at: new Date().toISOString()
    }
  ] as Profile[]
};

export class Database {
  private data: typeof INITIAL_STORE_STATE;

  constructor() {
    this.data = INITIAL_STORE_STATE;
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        
        // Defensive check: If database is loaded but is thin or missing user profiles (old DB),
        // we upgrade/re-seed the store state to ensure all 60+ products and user profiles exist.
        if (!parsed.users || !parsed.profiles || !parsed.products || parsed.products.length < 50) {
          console.log('[DB] Older DB detected. Migrating/seeding up to latest spec...');
          this.data = {
            ...INITIAL_STORE_STATE,
            orders: parsed.orders || [],
            admin_settings: parsed.admin_settings || SEED_ADMIN_SETTINGS
          };
          this.save();
        } else {
          this.data = parsed;
          if (!this.data.wishlists) this.data.wishlists = [];
          if (!this.data.price_alerts) this.data.price_alerts = [];
          console.log('[DB] Database loaded successfully from:', DB_FILE, `(${this.data.products.length} products, ${this.data.profiles.length} profiles)`);
        }
      } else {
        this.save();
        console.log('[DB] No database found, initialized new store with comprehensive seed data.');
      }
    } catch (err) {
      console.error('[DB] Error loading database:', err);
      this.data = INITIAL_STORE_STATE;
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB] Error saving database:', err);
    }
  }

  // Auth Operations
  getProfiles(): Profile[] {
    return this.data.profiles || [];
  }

  getProfileByEmail(email: string): Profile | undefined {
    let profile = this.getProfiles().find(p => p.email.toLowerCase() === email.toLowerCase());
    if (!profile) {
      const user = this.getUserByEmail(email);
      if (user) {
        profile = {
          id: user.id,
          email: user.email,
          role: user.email.toLowerCase() === 'musajohnjonathan@gmail.com' ? 'admin' : 'user',
          persona: null,
          created_at: user.created_at || new Date().toISOString()
        };
        if (!this.data.profiles) this.data.profiles = [];
        this.data.profiles.push(profile);
        this.save();
      }
    }
    return profile;
  }

  getProfileById(id: string): Profile | undefined {
    return this.getProfiles().find(p => p.id === id);
  }

  updateLastActive(email: string) {
    const profile = this.getProfileByEmail(email) as any;
    if (profile) {
      profile.last_active_at = new Date().toISOString();
      this.save();
    }
  }

  getUserByEmail(email: string): User | undefined {
    return (this.data.users || []).find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  registerUser(email: string, passwordHash: string, persona: 'Budget' | 'Value' | null, fullName?: string, phoneNumber?: string): { user: User; profile: Profile } {
    const userId = `user-${Date.now()}`;
    const now = new Date().toISOString();

    const newUser: User = {
      id: userId,
      email,
      passwordHash,
      created_at: now
    };

    const newProfile: Profile = {
      id: userId,
      email,
      role: email.toLowerCase() === 'musajohnjonathan@gmail.com' ? 'admin' : 'user',
      persona,
      created_at: now,
      fullName,
      phoneNumber
    };

    if (!this.data.users) this.data.users = [];
    if (!this.data.profiles) this.data.profiles = [];

    this.data.users.push(newUser);
    this.data.profiles.push(newProfile);
    this.save();

    return { user: newUser, profile: newProfile };
  }

  updateProfilePersona(email: string, persona: 'Budget' | 'Value' | null): Profile | undefined {
    const profile = this.getProfileByEmail(email);
    if (profile) {
      profile.persona = persona;
      this.save();
    }
    return profile;
  }

  // Vendors
  getVendors(): Vendor[] {
    return this.data.vendors;
  }

  getVendorById(id: string): Vendor | undefined {
    return this.data.vendors.find(v => v.id === id);
  }

  createVendor(vendor: Omit<Vendor, 'id' | 'created_at'>): Vendor {
    const newVendor: Vendor = {
      ...vendor,
      id: `vendor-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.data.vendors.push(newVendor);
    this.save();
    return newVendor;
  }

  updateVendor(id: string, updates: Partial<Vendor>): Vendor | undefined {
    const index = this.data.vendors.findIndex(v => v.id === id);
    if (index === -1) return undefined;
    this.data.vendors[index] = { ...this.data.vendors[index], ...updates };
    this.save();
    return this.data.vendors[index];
  }

  deleteVendor(id: string): boolean {
    const initialLen = this.data.vendors.length;
    this.data.vendors = this.data.vendors.filter(v => v.id !== id);
    // Cascade delete products
    this.data.products = this.data.products.filter(p => p.vendor_id !== id);
    this.save();
    return this.data.vendors.length < initialLen;
  }

  // Products
  getProducts(): Product[] {
    return this.data.products;
  }

  getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  createProduct(product: Omit<Product, 'id' | 'created_at'>): Product {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.data.products.push(newProduct);

    // Seed price history
    const newHistory: PriceHistory = {
      id: `ph-${newProduct.id}-${Date.now()}`,
      product_id: newProduct.id,
      price_ngn: newProduct.price_ngn,
      recorded_at: new Date().toISOString()
    };
    this.data.price_history.push(newHistory);

    this.save();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    const oldProduct = this.data.products[index];
    const updatedProduct = { ...oldProduct, ...updates };
    this.data.products[index] = updatedProduct as Product;

    // If price changed, record in history
    if (updates.price_ngn && updates.price_ngn !== oldProduct.price_ngn) {
      this.data.price_history.push({
        id: `ph-${id}-${Date.now()}`,
        product_id: id,
        price_ngn: updates.price_ngn,
        recorded_at: new Date().toISOString()
      });
    }

    this.save();
    return updatedProduct as Product;
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    this.data.price_history = this.data.price_history.filter(ph => ph.product_id !== id);
    this.save();
    return this.data.products.length < initialLen;
  }

  // Price History
  getPriceHistoryByProductId(productId: string): PriceHistory[] {
    return this.data.price_history
      .filter(ph => ph.product_id === productId)
      .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime());
  }

  // Admin Settings
  getAdminSettings(): AdminSetting {
    return this.data.admin_settings;
  }

  updateAdminSettings(updates: Partial<AdminSetting>): AdminSetting {
    this.data.admin_settings = { ...this.data.admin_settings, ...updates };
    this.save();
    return this.data.admin_settings;
  }

  // Orders
  getOrders(): Order[] {
    return this.data.orders;
  }

  createOrder(order: Omit<Order, 'id' | 'created_at' | 'status'>): Order {
    const newOrder: Order = {
      ...order,
      id: `order-${Date.now()}`,
      status: 'pending', // Starts in pending for rich user tracking visualization!
      created_at: new Date().toISOString()
    };
    this.data.orders.push(newOrder);
    this.save();
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: Order['status']): Order | undefined {
    const index = this.data.orders.findIndex(o => o.id === orderId);
    if (index === -1) return undefined;
    this.data.orders[index].status = status;
    this.save();
    return this.data.orders[index];
  }

  // Wishlist
  getWishlist(email: string): string[] {
    return (this.data.wishlists || [])
      .filter(w => w.email.toLowerCase() === email.toLowerCase())
      .map(w => w.product_id);
  }

  toggleWishlist(email: string, productId: string): { active: boolean } {
    if (!this.data.wishlists) this.data.wishlists = [];
    const index = this.data.wishlists.findIndex(
      w => w.email.toLowerCase() === email.toLowerCase() && w.product_id === productId
    );
    if (index !== -1) {
      this.data.wishlists.splice(index, 1);
      this.save();
      return { active: false };
    } else {
      this.data.wishlists.push({
        id: `wish-${Date.now()}`,
        email,
        product_id: productId,
        created_at: new Date().toISOString()
      });
      this.save();
      return { active: true };
    }
  }

  // Price Alerts
  getPriceAlerts(email: string): PriceAlert[] {
    return (this.data.price_alerts || [])
      .filter(a => a.email.toLowerCase() === email.toLowerCase());
  }

  createPriceAlert(email: string, productId: string, targetPrice: number): PriceAlert {
    if (!this.data.price_alerts) this.data.price_alerts = [];
    const index = this.data.price_alerts.findIndex(
      a => a.email.toLowerCase() === email.toLowerCase() && a.product_id === productId
    );
    const newAlert: PriceAlert = {
      id: index !== -1 ? this.data.price_alerts[index].id : `alert-${Date.now()}`,
      email,
      product_id: productId,
      target_price: targetPrice,
      created_at: new Date().toISOString(),
      active: true
    };
    if (index !== -1) {
      this.data.price_alerts[index] = newAlert;
    } else {
      this.data.price_alerts.push(newAlert);
    }
    this.save();
    return newAlert;
  }

  deletePriceAlert(id: string): boolean {
    if (!this.data.price_alerts) return false;
    const initialLen = this.data.price_alerts.length;
    this.data.price_alerts = this.data.price_alerts.filter(a => a.id !== id);
    this.save();
    return this.data.price_alerts.length < initialLen;
  }
}

export const db = new Database();
