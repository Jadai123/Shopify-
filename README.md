# Social Shopperfy Multi-Vendor Social Commerce Platform

Social Shopperfy is an elite, high-performance social commerce platform designed to establish the absolute frontier of high-tech global multi-vendor trading. Combining the gamified "swipe to discover" mechanic with comprehensive pricing ledger transparency, localized dual-currency systems (Naira & Dollars), and automated AI negotiations, the platform empowers consumers across Nigeria, the US, the UK, the UAE, and China to engage in direct-from-factory commerce with complete safety.

---

## 🚀 Key Features

* **Gamified "Swipe" Discovery:** Swipe right to save/request items, and swipe left to skip, training the personal taste engine.
* **Dual-Target Shopper Personas:** Real-time tailoring between **Budget Slash** (focused on markdown values, deals, and coupon offsets) and **Value Specs** (focusing on raw technical attributes, materials, and origin matrices).
* **AI-Powered Negotiation Assistant:** Integrated server-side Gemini conversational helper that queries live databases, explains merchant ratings, and constructs tailored discount offers.
* **Integrated Co-Op Escrow Flow:** High-fidelity checkout process allowing buyers to route payments safely into escrow wallets until factory shipments are verified.
* **Secure Admin Ledger Panel:** Complete vendor-specific and catalog-level management control panel including transaction tracking and policy adjustments.
* **Dynamic Cart-Abandonment Engine:** Smart overlays triggering personalized flash incentives if a shopper tries to navigate away from an active checkout session.

---

## 🛠️ Technology Stack

* **Frontend:** React 19, TypeScript, Tailwind CSS (Custom "Sophisticated Dark" UI palette), Lucide React (vector assets), Motion (interactive card animations).
* **Backend:** Express (Node.js), serving dynamic API routes for co-op assets.
* **AI Engine:** Google Gen AI SDK (`@google/genai`) utilized purely server-side for maximum API key security.
* **Development Tooling:** Vite 6, `tsx` (TypeScript execute on the fly), and `esbuild` for production compilation.

---

## 📂 Directory Layout

```text
├── assets/                    # Platform icons and offline visuals
├── server/                    # Backend database mocks and utilities
│   └── db.ts                  # Persistent state ledger mock data
├── src/                       # Frontend application code
│   ├── components/            # Modular UI React components
│   │   ├── PersonaOnboarding.tsx  # Initial user targeting onboarding
│   │   ├── SwipeDiscover.tsx      # Gamified swipe-to-match cards
│   │   ├── CategoryView.tsx       # Standard search catalog browser
│   │   ├── ProductDetail.tsx      # Multi-spec compare & WhatsApp neg
│   │   ├── AIChatAssistant.tsx    # Conversational server-side Gemini assistant
│   │   ├── CheckoutFlow.tsx       # Multi-step checkout & payment escrow
│   │   ├── AdminPanel.tsx         # Secure admin gateway
│   │   ├── AbandonmentPrompt.tsx  # Smart re-engagement overlay
│   │   └── GlobalFooter.tsx       # Brand index, co-op info & disclosures
│   ├── App.tsx                # Main Router and context state provider
│   ├── index.css              # Global custom Tailwind CSS variables
│   ├── main.tsx               # Primary browser entrypoint
│   └── types.ts               # Shared TypeScript structures
├── .env.example               # Documentation of required secret keys
├── server.ts                  # Custom Express entrypoint with Vite middleware
├── package.json               # Manifest dependencies & bundle scripts
└── LICENSE.txt                # Commercial Proprietary Software License
```

---

## ⚙️ Environment Configuration

To run Social Shopperfy, copy `.env.example` to `.env` in your workspace root:

```bash
cp .env.example .env
```

And define the following server-side secret key:

```env
# Google Gemini API key used server-side for secure negotiations
GEMINI_API_KEY=your_gemini_api_key_here
```

*Note: The system automatically hides this key from client-side bundles. Never prefix this variable with `VITE_`.*

---

## 💻 Local Development Setup

To boot the system locally inside your terminal:

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Development Mode
This spins up the development server on **port 3000** binding on `0.0.0.0`:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the live interface.

### 3. Run Linter
Verify code style and type safety:
```bash
npm run lint
```

### 4. Build for Production
This compiles the client static assets to `dist/` and bundles the Express server-side code into a standalone CommonJS (`.cjs`) bundle using `esbuild` to bypass relative import path issues:
```bash
npm run build
```

### 5. Launch Production Server
```bash
npm run start
```

---

## 🛡️ Administrative Authentication

To test or manage active product and vendor settings:
* **Admin Portal Route:** In-app via the **Admin Ledger** header link.
* **Email:** `musajohnjonathan@gmail.com`
* **Password:** `adminJohn`

---

## ⚖️ License & Proprietary Rights

This software is licensed under a **Commercial Proprietary License**. See `LICENSE.txt` for the full terms of use. 
**MIT/Apache licenses do not apply.** Convertibility to open source is strictly prohibited.

*Copyright (c) 2026 Social Shopperfy Co-Op. All Rights Reserved.*
