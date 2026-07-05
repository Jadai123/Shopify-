# Deploy & Test Guide: Social Shopperfy Multi-Vendor Social Commerce Platform
This document provides a comprehensive operational guide to deploying, verifying, and testing the Social Shopperfy application in both local development and production environments.

---

## 1. Prerequisites & Environment Setup

### System Requirements
* **Runtime:** Node.js v18 or higher (v20+ recommended)
* **Package Manager:** npm v9 or higher
* **Platform Support:** Linux, macOS, or Windows (via WSL2 or Git Bash)

### Environment File
Copy the configuration template to establish the secure environment variables:
```bash
cp .env.example .env
```

Open `.env` in your text editor and specify your Google Gemini API Key:
```env
# Google Gemini API Key used server-side for secure negotiations
GEMINI_API_KEY=your_gemini_api_key_here
```
*Note: Do NOT prefix this key with `VITE_` to prevent Vite from packaging it into client-side bundles. The backend custom Express server accesses it via `process.env.GEMINI_API_KEY` for secure operations.*

---

## 2. Local Development & Compilation

To launch the full-stack development environment:

### Step 1: Install Dependencies
Download and install all package requirements from `package.json`:
```bash
npm install
```

### Step 2: Spin Up Dev Server
Start the Express server integrated with Vite development middleware. The application is configured to automatically bind on port `3000` at `0.0.0.0`:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Step 3: Verify with Linter
Ensure there are no syntax errors, type mismatched structures, or unresolved imports:
```bash
npm run lint
```

### Step 4: Production Build
Compile client static assets into `dist/` and bundle the Express backend into `dist/server.cjs` via `esbuild`:
```bash
npm run build
```

### Step 5: Start Production Build
Run the compiled standalone node server:
```bash
npm run start
```

---

## 3. Comprehensive Step-by-Step Testing Workflow

To thoroughly test and verify all business logic, follow these six testing sequences:

### Test Case A: Onboarding & Target Persona Selection
1. Open the application landing page.
2. Select either the **Budget Slash** or **Value Specs** persona on the onboarding welcome card.
3. Verify that:
   * **Budget Slash** filters display markdown percentages, deal banners, and coupon comparison tables.
   * **Value Specs** displays technical specification matrices, origin countries, and manufacturing specifications.
4. Click the "Hunt Selector" button in the navigation bar to dynamically swap personas and confirm that the catalog instantly updates layout attributes.

### Test Case B: Gamified "Swipe to Discover" Deck
1. Navigate to the **Swipe** view (Layers icon in top nav).
2. Swipe cards:
   * Click **Match Sourcing** (or press keyboard Right Arrow) to "Like" the product. It will be saved into your wishlist.
   * Click **Pass / Skip** (or press keyboard Left Arrow) to skip the product.
3. Confirm that the card stack smoothly animates using `motion` transitions.
4. Verify that swiped-right items appear immediately in your local wishlist ledger (accessed via **My Account** tab).

### Test Case C: AI-Powered Negotiation Assistant
1. Click on the floating robot icon in the lower-right corner to open the **AI Chat Assistant**.
2. Type an inquiry such as: *"I need a good deal on the suede loafers."* or *"Can you recommend any high-quality headphones in my budget?"*
3. Verify that the AI Assistant:
   * Performs an API call to the server-side Gemini backend.
   * Invokes the local database tools to search catalog entries without fabricating products.
   * Proposes a customized discount offer based on the active user persona.
   * Displays the discount code or co-op deal terms dynamically inside the chat.

### Test Case D: Escrow Checkout Flow & Pricing Transparency
1. Select any product to open the **Product Detail** page.
2. Click **Initiate Escrow Co-Op Order**.
3. In the Checkout screen:
   * Apply a valid referral code (e.g., `COOP_DIRECT` configured in Settings) and verify the final price decreases.
   * Toggle between **Naira (₦)** and **USD ($)** to confirm dual-currency conversion.
   * Inspect the co-op freight calculation slide (dynamic rate multiplied by weight in KG).
4. Select a payment method (Stripe, Paystack, or Bank Transfer) and submit the transaction.
5. Confirm that the app routes you to the Checkout Success screen with a newly generated Order ID.

### Test Case E: Secure Admin Ledger & Accounts Monitor
1. Access the **Admin Ledger** by clicking "Admin Ledger" in the header.
2. Enter the administrator credentials:
   * **Email:** `musajohnjonathan@gmail.com`
   * **Password:** `adminJohn`
3. Once logged in, navigate the management tabs:
   * **Products & Stock:** Add, edit, or delete items. Toggle inventory levels.
   * **Vendors Registry:** Create and manage factory vendors, and update their physical coordinates and WhatsApp dispatch links.
   * **Completed Sales Log:** Inspect client orders, payment gates, and update shipping statuses (`Pending` to `Delivered`).
   * **Registered Accounts:** Monitor all signed-up users. Check their designated Sourcing Persona, enrollment date, and real-time **Online / Offline** connectivity status (Online if they interacted in the last 2 minutes).
   * **Referral & General Rules:** Edit the global referral code, discount percentages, and configure shipping costs per KG.

### Test Case F: Customer Dashboard
1. Click **My Account** in the top navigation as a standard user.
2. Verify you can:
   * View live order tracking steps (`Pending` ➡️ `Processing` ➡️ `Shipped` ➡️ `Delivered`).
   * See alert notifications when the administrator updates your order shipment status.
   * View your personalized Wishlist ledger.
   * Inspect, create, and delete target Price Alerts.
   * Click **Sourcing Target Selector** to toggle your persona on-the-fly.
