# Academic Project Submission Report: Social Shopperfy Multi-Vendor Social Commerce Platform
**Course Project: Enterprise Full-Stack Web Systems & Social E-Commerce Systems**  
**Submitted by:** Musa John Jonathan (Project Group Lead)  
**Language of Implementation:** TypeScript (Full-Stack)

---

## 1. Abstract & Executive Summary

The modern cross-border e-commerce landscape is plagued by high procurement overheads, opaque pricing margins, and fragmented supply chains, particularly for buyers in emerging markets (e.g., Nigeria) sourcing directly from manufacturing hubs (e.g., China, UAE, US, UK). **Social Shopperfy** resolves these inefficiencies by introducing a full-stack, secure, multi-vendor social commerce system. 

By combining:
1. A gamified **"Swipe-to-Match"** discovery interface,
2. Cognitive buyer personas (**Budget Slash** vs. **Value Specs**),
3. A server-side **Google Gemini AI Negotiation Agent**, and
4. An integrated **Co-Op Escrow Payment & Cargo System**,

the platform bridges the trust gap between buyers and foreign factories. This report details the architecture, data schemas, API implementations, and user-centered design paradigms of Social Shopperfy.

---

## 2. Problem Statement & Sourcing Strategy

Standard e-commerce platforms do not cater to the nuances of global sourcing. Direct factory buyers face:
* **Trust Deficits:** Buyers are hesitant to send funds directly to offshore factories.
* **Complex Pricing Mechanics:** Prices must dynamically convert between localized currencies (Naira `₦` and US Dollars `$`) and account for dynamic co-op bulk cargo freight rates.
* **Inflexible Negotiations:** Offline factory procurement relies heavily on human-to-human negotiation, which does not scale.

### The Social Shopperfy Solution:
* **The Escrow Ledger:** Funds are deposited securely in a localized escrow wallet and only released once factory dispatch is certified by co-op clearance admins.
* **AI-as-a-Negotiator:** A server-side Large Language Model (LLM) simulates real-time factory bargaining, matching the buyer's targeting persona to generate authorized discount vouchers dynamically.

---

## 3. Technology Stack & Architecture

Social Shopperfy is engineered as a secure, high-performance, full-stack application built entirely on **TypeScript** to enforce compile-time type safety across client and server boundaries.

```text
+-------------------------------------------------------+
|                 CLIENT LAYER (React 19)              |
|  - Swipe Card Matcher (Motion)                       |
|  - Interactive Spec Comparison Grid                  |
|  - Customer Dashboard (Wishlist, Alerts, Notifications) |
|  - AI Interactive Consultation Panel                  |
+-------------------------------------------------------+
                           |
                           v (Secure HTTPS JSON REST APIs)
+-------------------------------------------------------+
|               BACKEND SERVER (Express.js)             |
|  - Dynamic Route Dispatchers                          |
|  - Basic Credentials Authentication Middleware         |
|  - Session Memory Store (Memory State Engine)         |
|  - Google Gen AI Server-Side Proxy (Gemini 2.5/1.5)   |
+-------------------------------------------------------+
                           |
                           v (Local File I/O Synchronization)
+-------------------------------------------------------+
|                PERSISTENCE LAYER (JSON DB)            |
|  - db_store.json (Self-Healing Persistent Database)   |
|  - Complete transaction log, orders & user profiles   |
+-------------------------------------------------------+
```

### Key Technical Stack:
* **Programming Language:** **TypeScript (ES6+)** for unified client-server definitions.
* **Frontend Library:** **React 19** with functional hooks (`useState`, `useEffect`, `useMemo`).
* **Styling Framework:** **Tailwind CSS** implementing a cohesive, sophisticated dark Slate palette.
* **Animation Engine:** **Motion** (imported from `motion/react`) for smooth spring-physics transitions.
* **Backend Framework:** **Express (Node.js)** for high-throughput JSON endpoint delivery.
* **AI Integration:** Modern **Google Gen AI SDK (`@google/genai`)** implemented purely server-side.
* **Database Engine:** File-based structural JSON Ledger Store (`db_store.json`) with automatic schema validation and self-healing.

---

## 4. Key Architectural Modules

### A. Dual-Persona Targeting System
Upon entry, the system dynamically tailors its visual information density and promotional structures:
* **Budget Slash Persona:** Targets price-sensitive users. Highlights bargain discounts, coupon offsets, and dynamic pricing cards.
* **Value Specs Persona:** Targets detail-oriented buyers. Replaces generic marketing slogans with precise specification grids, manufacturing origins, material density ratings, and certificates.

### B. Gamified Swipe Matching Engine
To drive buyer engagement, products are served as a card stack.
* Users can swipe right (approve/wishlist) or swipe left (skip).
* Interactive spring physics and rotational inertia are handled smoothly by `motion` components, providing tactile feedback.

### C. Server-Side AI Negotiator (Gemini Integration)
Unlike standard e-commerce chatbots, our implementation uses a **Secure Server-Side Proxy API** structure:
1. **API Key Security:** The API key is kept completely on the server.
2. **Context-Aware Tool Calling:** The AI assistant uses system instructions and schema definitions. It utilizes local tool declarations (such as `search_products`) to query the real database in real-time.
3. **Dynamic Bargaining Logic:** The AI evaluates the customer's active persona and generates authorized price markdown incentives that are valid during checkout.

### D. Multi-Vendor Escrow & Cargo Flow
* **Co-Op Cargo Calculations:** Incorporates an administrator-adjustable weight variable (Naira per KG) to estimate air and ocean freight during checkout.
* **Escrow Ledger:** Displays order pipelines clearly (`Pending` -> `Processing` -> `Shipped` -> `Delivered`).
* **Referral Discount Engine:** Integrates global settings so users can share custom referral handles to claim multi-tier pricing markdowns.

---

## 5. Database Schema Structure

The persistent state is maintained inside `./db_store.json` using structured collections:

### 1. `Profile` Schema (Registered User Accounts)
```typescript
interface Profile {
  id: string;               // Unique user ID
  email: string;            // Encrypted identifier
  role: 'user' | 'admin';   // Access control permissions
  persona: 'Budget' | 'Value' | null; // Selected buying strategy
  created_at: string;       // Enrollment ISO timestamp
  last_active_at?: string;  // Last heartbeat check-in
}
```

### 2. `Product` Schema (Factory Inventory)
```typescript
interface Product {
  id: string;
  vendor_id: string;        // Foreign key relation to Vendor
  name: string;
  description: string;
  price_ngn: number;        // Primary Naira cost
  price_usd: number;        // USD conversion value
  discount_percent: number; // Promotional markdown
  category: string;         // Electronics, Fashion, etc.
  images: string[];         // Image array
  specs: Record<string, string>; // Dynamic specification dictionary
  stock_status: 'in_stock' | 'out_of_stock';
  created_at: string;
}
```

### 3. `Order` Schema (Co-Op Transactions)
```typescript
interface Order {
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
```

---

## 6. Secure RESTful API Registry

The backend server exposes the following endpoints:

| Method | Endpoint | Access Level | Description |
|--------|----------|--------------|-------------|
| **POST** | `/api/auth/signup` | Public | Registers a new account, setting default role to 'user' |
| **POST** | `/api/auth/signin` | Public | Authenticates credentials and sets a secure HTTP-Only session cookie |
| **POST** | `/api/api/auth/signout` | Public | Clear active session cookie |
| **GET** | `/api/auth/session` | Public | Resolves cookie to current session profile |
| **GET** | `/api/products` | Public | Downloads full active co-op product catalog |
| **GET** | `/api/vendors` | Public | Downloads full verified multi-vendor registry |
| **GET** | `/api/wishlist` | Authorized | Returns saved item IDs for the active session |
| **POST** | `/api/wishlist/toggle` | Authorized | Adds or removes a product from user's wishlist |
| **GET** | `/api/price-alerts` | Authorized | Retrieves price alerts registered by user |
| **POST** | `/api/price-alerts` | Authorized | Configures a new target price alert |
| **GET** | `/api/admin/users` | Admin Only | Retrieves all accounts, including dynamic **online/offline** connectivity status |
| **GET** | `/api/admin/orders` | Admin Only | Retrieves all global customer orders |
| **POST** | `/api/admin/settings` | Admin Only | Modifies global referral values, shipping weights, and headers |

---

## 7. Visual Design & User Psychology

The user interface is crafted to evoke **premium professional trust** through:
* **Sophisticated Slate Palette:** Utilizing deep charcoal grays (`#0a0a0a`, `#171717`) contrasted with an energetic **Sourcing Lime Green** accent (`#c5f82a`).
* **High Contrast Typography:** Pairing bold display headings (**Space Grotesk** / **Inter**) with technical monospace tags (**JetBrains Mono**).
* **Spring-Physics Animations:** Card swipes, modal transitions, and dashboard lists use dynamic, fluid spring transitions instead of jarring instant cuts.
* **Intentional Data Hierarchy:** Prominent rating indicators and factory origin flags clearly highlight supply chain transparency.
