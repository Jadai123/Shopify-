import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { db, Product, Vendor } from './server/db.ts';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini API
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'MOCK_KEY_IF_MISSING',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Session state memory map
const SESSIONS = new Map<string, {
  id: string;
  email: string;
  role: 'user' | 'admin';
  persona: 'Budget' | 'Value' | null;
}>();

// Seed admin session for direct access if necessary
SESSIONS.set('sid-admin-primary', {
  id: 'user-admin',
  email: 'musajohnjonathan@gmail.com',
  role: 'admin',
  persona: 'Value'
});

const getSessionFromRequest = (req: express.Request) => {
  const cookieHeader = req.headers.cookie || '';
  const match = cookieHeader.match(/shopperfy_sid=([^;]+)/);
  if (!match) return null;
  const sid = match[1];
  const session = SESSIONS.get(sid) || null;
  if (session && session.email) {
    db.updateLastActive(session.email);
  }
  return session;
};

// Helper for auth validation
const validateAdminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // 1. Check for logged-in user in SESSIONS via cookie
  const session = getSessionFromRequest(req);
  if (session && session.role === 'admin') {
    return next();
  }

  // 2. Fallback to basic auth header for compatibility
  const authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const token = authHeader.split(' ')[1] || '';
      const [email, password] = Buffer.from(token, 'base64').toString().split(':');
      if (email === 'musajohnjonathan@gmail.com' && password === 'adminJohn') {
        return next();
      }
    } catch (e) {
      // Ignore conversion error
    }
  }

  res.status(403).json({ error: 'Access Denied: Admin privileges required.' });
};

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', database: 'file-backed-sqlite-equivalent', time: new Date().toISOString() });
});

// Authentication APIs
app.post('/api/auth/signup', (req, res) => {
  const { email, password, persona } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }
  
  const { profile } = db.registerUser(email, password, persona);
  
  const sid = `sid-${Date.now()}-${Math.random().toString(36).substring(2)}`;
  const sessionData = {
    id: profile.id,
    email: profile.email,
    role: profile.role,
    persona: profile.persona
  };
  SESSIONS.set(sid, sessionData);

  res.setHeader('Set-Cookie', `shopperfy_sid=${sid}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`);
  res.json({ session: { user: sessionData } });
});

app.post('/api/auth/signin', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const user = db.getUserByEmail(email);
  if (!user || user.passwordHash !== password) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }
  const profile = db.getProfileByEmail(email)!;

  const sid = `sid-${Date.now()}-${Math.random().toString(36).substring(2)}`;
  const sessionData = {
    id: profile.id,
    email: profile.email,
    role: profile.role,
    persona: profile.persona
  };
  SESSIONS.set(sid, sessionData);

  res.setHeader('Set-Cookie', `shopperfy_sid=${sid}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`);
  res.json({ session: { user: sessionData } });
});

app.post('/api/auth/signout', (req, res) => {
  const cookieHeader = req.headers.cookie || '';
  const match = cookieHeader.match(/shopperfy_sid=([^;]+)/);
  if (match) {
    SESSIONS.delete(match[1]);
  }
  res.setHeader('Set-Cookie', 'shopperfy_sid=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
  res.json({ success: true });
});

app.get('/api/auth/session', (req, res) => {
  const session = getSessionFromRequest(req);
  res.json({ session: session ? { user: session } : null });
});

app.post('/api/auth/update-persona', (req, res) => {
  const session = getSessionFromRequest(req);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { persona } = req.body;
  const updated = db.updateProfilePersona(session.email, persona);
  if (!updated) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  session.persona = updated.persona;
  res.json({ session: { user: session } });
});

// Vendors
app.get('/api/vendors', (req, res) => {
  res.json(db.getVendors());
});

app.get('/api/vendors/:id', (req, res) => {
  const v = db.getVendorById(req.params.id);
  if (!v) return res.status(404).json({ error: 'Vendor not found' });
  res.json(v);
});

app.post('/api/vendors', validateAdminAuth, (req, res) => {
  const { name, logo_url, whatsapp_number, country, rating, bio } = req.body;
  if (!name || !whatsapp_number) {
    return res.status(400).json({ error: 'Name and WhatsApp number are required' });
  }
  const vendor = db.createVendor({
    name,
    logo_url: logo_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=60',
    whatsapp_number,
    country: country || 'Nigeria',
    rating: parseFloat(rating) || 5.0,
    bio: bio || ''
  });
  res.status(201).json(vendor);
});

app.put('/api/vendors/:id', validateAdminAuth, (req, res) => {
  const vendor = db.updateVendor(req.params.id, req.body);
  if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
  res.json(vendor);
});

app.delete('/api/vendors/:id', validateAdminAuth, (req, res) => {
  const success = db.deleteVendor(req.params.id);
  if (!success) return res.status(404).json({ error: 'Vendor not found' });
  res.json({ message: 'Vendor deleted successfully along with all associated products' });
});

// Products
app.get('/api/products', (req, res) => {
  res.json(db.getProducts());
});

app.get('/api/products/:id', (req, res) => {
  const p = db.getProductById(req.params.id);
  if (!p) return res.status(404).json({ error: 'Product not found' });
  res.json(p);
});

app.get('/api/products/:id/price-history', (req, res) => {
  res.json(db.getPriceHistoryByProductId(req.params.id));
});

app.post('/api/products', validateAdminAuth, (req, res) => {
  const { vendor_id, name, description, price_ngn, price_usd, discount_percent, category, images, specs, stock_status } = req.body;
  if (!vendor_id || !name || !price_ngn || !price_usd || !category) {
    return res.status(400).json({ error: 'Required fields missing: vendor_id, name, price_ngn, price_usd, category' });
  }
  const product = db.createProduct({
    vendor_id,
    name,
    description: description || '',
    price_ngn: parseFloat(price_ngn),
    price_usd: parseFloat(price_usd),
    discount_percent: parseInt(discount_percent) || 0,
    category,
    images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'],
    specs: specs || {},
    stock_status: stock_status || 'in_stock'
  });
  res.status(201).json(product);
});

app.put('/api/products/:id', validateAdminAuth, (req, res) => {
  const product = db.updateProduct(req.params.id, req.body);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.delete('/api/products/:id', validateAdminAuth, (req, res) => {
  const success = db.deleteProduct(req.params.id);
  if (!success) return res.status(404).json({ error: 'Product not found' });
  res.json({ message: 'Product deleted successfully' });
});

// Admin settings
app.get('/api/admin/settings', (req, res) => {
  res.json(db.getAdminSettings());
});

app.post('/api/admin/settings', validateAdminAuth, (req, res) => {
  const settings = db.updateAdminSettings(req.body);
  res.json(settings);
});

// Admin list registered users
app.get('/api/admin/users', validateAdminAuth, (req, res) => {
  const activeEmails = new Set(Array.from(SESSIONS.values()).map(s => s.email.toLowerCase()));
  const profiles = (db.getProfiles() as any[]).map((profile: any) => {
    const emailLower = profile.email.toLowerCase();
    const isSessionActive = activeEmails.has(emailLower);
    let isRecent = false;
    if (profile.last_active_at) {
      const lastActive = new Date(profile.last_active_at).getTime();
      const diffMs = Date.now() - lastActive;
      isRecent = diffMs < 120000; // 2 minutes
    }
    return {
      ...profile,
      is_online: isSessionActive || isRecent
    };
  });
  res.json(profiles);
});

// Orders
app.get('/api/admin/orders', validateAdminAuth, (req, res) => {
  res.json(db.getOrders());
});

app.get('/api/orders/my-orders', (req, res) => {
  const session = getSessionFromRequest(req);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized: No active session' });
  }
  const userOrders = db.getOrders().filter(
    o => o.user_email.toLowerCase() === session.email.toLowerCase()
  );
  res.json(userOrders);
});

app.post('/api/orders', (req, res) => {
  const { user_email, product_id, amount_ngn, amount_usd, payment_gateway, referral_code, discount_applied_percent } = req.body;
  if (!user_email || !product_id || !payment_gateway) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  const order = db.createOrder({
    user_email,
    product_id,
    amount_ngn: parseFloat(amount_ngn),
    amount_usd: parseFloat(amount_usd),
    payment_gateway,
    referral_code_used: referral_code,
    discount_applied_percent
  });

  res.status(201).json({
    message: 'Order created successfully!',
    order,
    redirect_url: `/checkout/success?order_id=${order.id}`
  });
});

// Admin update order status
app.put('/api/admin/orders/:id/status', validateAdminAuth, (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }
  const updated = db.updateOrderStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(updated);
});

// Wishlist
app.get('/api/wishlist', (req, res) => {
  const session = getSessionFromRequest(req);
  if (!session) {
    return res.json([]); // Return empty list instead of crashing if not logged in
  }
  res.json(db.getWishlist(session.email));
});

app.post('/api/wishlist/toggle', (req, res) => {
  const session = getSessionFromRequest(req);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { productId } = req.body;
  if (!productId) {
    return res.status(400).json({ error: 'productId is required' });
  }
  res.json(db.toggleWishlist(session.email, productId));
});

// Price Alerts
app.get('/api/price-alerts', (req, res) => {
  const session = getSessionFromRequest(req);
  if (!session) {
    return res.json([]);
  }
  res.json(db.getPriceAlerts(session.email));
});

app.post('/api/price-alerts', (req, res) => {
  const session = getSessionFromRequest(req);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { productId, targetPrice } = req.body;
  if (!productId || targetPrice === undefined) {
    return res.status(400).json({ error: 'productId and targetPrice are required' });
  }
  const alert = db.createPriceAlert(session.email, productId, parseFloat(targetPrice));
  res.status(201).json(alert);
});

app.delete('/api/price-alerts/:id', (req, res) => {
  const session = getSessionFromRequest(req);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const success = db.deletePriceAlert(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Price alert not found' });
  }
  res.json({ success: true });
});

// AI Chat tool implementation functions
function search_products_local(args: { query?: string; category?: string; max_price?: number }) {
  let products = db.getProducts();
  if (args.query) {
    const q = args.query.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  if (args.category) {
    const cat = args.category.toLowerCase();
    products = products.filter(p => p.category.toLowerCase() === cat);
  }
  if (args.max_price) {
    products = products.filter(p => p.price_ngn <= args.max_price || p.price_usd <= args.max_price);
  }
  return products;
}

// AI Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  const { messages, userPersona } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  // Define tools for Gemini
  const searchProductsDeclaration = {
    name: 'search_products',
    description: 'Searches the database for real marketplace products based on a query, category, or maximum price filter. Never fabricate products.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: {
          type: Type.STRING,
          description: 'Search query for product name or description, e.g., "headphones", "suede loafers"'
        },
        category: {
          type: Type.STRING,
          description: 'Product category slug, e.g., "Electronics", "Fashion", "Home & Living", "Beauty & Personal Care"'
        },
        max_price: {
          type: Type.NUMBER,
          description: 'Maximum product price in Naira (NGN)'
        }
      }
    }
  };

  const navigateToCategoryDeclaration = {
    name: 'navigate_to_category',
    description: 'Directs the user interface to navigate to a specific category page.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        category_slug: {
          type: Type.STRING,
          description: 'The slug of the category, e.g., "Electronics", "Fashion", "Home & Living", "Beauty & Personal Care"'
        }
      },
      required: ['category_slug']
    }
  };

  // Build the prompt context based on User Persona
  const personaIntro = userPersona === 'Budget'
    ? 'The user is a Budget Shopper (highly focused on price discounts, savings, and the lowest price options).'
    : 'The user is a Value Seeker (highly focused on product specifications, quality-to-price ratio, specs, and vendor ratings).';

  const systemInstruction = `You are the friendly, luxury-styled Social Shopperfy Smart Assistant.
Our platform is a premium, high-tech multi-vendor marketplace connecting buyers with verified global vendors (Nigeria, USA, UK, UAE, China).
${personaIntro}

Your behavior rules:
1. When searching for products, ALWAYS use the 'search_products' tool to query the real database. Do not hallucinate or fabricate products that do not exist in the database!
2. When the user asks to see a category or browse products in a category, call 'navigate_to_category'.
3. Always respond politely, in a luxury/modern tech tone, highlighting custom vendor connection details, price transparency (such as our price-trend charts), and smart discount systems.
4. If you suggest products, list them with their prices (e.g., ₦250,000 / $155) and point out that the buyer can chat directly with the vendor via WhatsApp.
5. If the user mentions shipping info, shipping is available internationally from Nigeria, USA, UK, UAE, and China via DHL and local verified carriers.
6. The admin referral code is 'MUSA2024' (gives 10% discount). Encourage the user to apply it at checkout!`;

  try {
    // Formulate contents from client history
    const geminiContents = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Turn calling or response
    const geminiResponse = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: geminiContents as any,
      config: {
        systemInstruction,
        tools: [{ functionDeclarations: [searchProductsDeclaration, navigateToCategoryDeclaration] }]
      }
    });

    const functionCalls = geminiResponse.functionCalls;
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      let toolResult: any = null;
      let uiAction: any = null;

      if (call.name === 'search_products') {
        const args = call.args as any;
        const productsFound = search_products_local(args);
        toolResult = productsFound;
        uiAction = {
          type: 'search_results',
          products: productsFound,
          query: args.query,
          category: args.category
        };
      } else if (call.name === 'navigate_to_category') {
        const args = call.args as any;
        uiAction = {
          type: 'navigate',
          category: args.category_slug
        };
        toolResult = { status: 'navigating', category: args.category_slug };
      }

      // We send a second turn back to Gemini so it can generate the textual explanation of what it did
      const secondContents = [
        ...geminiContents,
        {
          role: 'model',
          parts: [{
            functionCall: {
              name: call.name,
              args: call.args
            }
          }]
        },
        {
          role: 'user', // representing the tool output
          parts: [{
            text: JSON.stringify({
              output: toolResult
            })
          }]
        }
      ];

      const secondResponse = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: secondContents as any,
        config: { systemInstruction }
      });

      return res.json({
        role: 'assistant',
        content: secondResponse.text || 'I retrieved that information for you.',
        uiAction
      });
    }

    // Normal text response
    res.json({
      role: 'assistant',
      content: geminiResponse.text || 'How can I assist you with shopping today?'
    });

  } catch (error: any) {
    console.error('[AI Chat Error]:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate AI response' });
  }
});

// Serve frontend assets in production or mount Vite middleware in development
async function start() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Social Shopperfy full-stack running on http://localhost:${PORT}`);
  });
}

start();
