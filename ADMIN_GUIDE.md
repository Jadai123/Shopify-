# Social Shopperfy — Day-to-Day Admin Guide
**Operational Manual for Managing the Social Shopperfy Multi-Vendor Social Commerce Platform**

Welcome to the central admin guide. This document explains how to access, configure, and manage the Social Shopperfy platform's admin capabilities on a daily basis.

---

## 1. Login & Security Credentials

The Admin Panel is a secure gateway built into the web application to control global inventories, merchant records, dynamic discount rates, and customer orders.

* **Admin Portal Link:** Click **Admin Ledger** in the main header navigation or select **Secure Admin Login** in the footer.
* **Primary Admin Email:** `musajohnjonathan@gmail.com`
* **Primary Admin Password:** `adminJohn`
* **Authentication Method:** Basic Authentication via administrative header headers (`Basic bXVzYWpvaG5qb25hdGhhbkBnbWFpbC5jb206YWRtaW5Kb2hu`).

*⚠️ **Security Note:** Keep these credentials strictly confidential. Never share them on public slack channels, public forums, or insecure files.*

---

## 2. Platform Dashboard Tabs

Once logged in, the administrative panel is divided into four main management hubs:

### A. Products Hub (`Products` Tab)
Use this tab to control the Social Shopperfy distributed inventory catalog.
* **Adding a Product:** Click **Add Product** in the top right.
  * Enter Product Name, Description, Categories (Electronics, Fashion, Home & Living, Beauty & Personal Care).
  * **Dual Currency Pricing:** Set prices in both Nigerian Naira (NGN) and US Dollars (USD). The platform automatically displays the appropriate unit depending on the buyer's localized view.
  * **Spec Matrix:** Add custom technical specs (e.g. `Processor`, `Battery`, `Origin`, `Material`). This controls what "Value Specs" customers see in the comparison grids.
  * **Discounts:** Specify an initial markdown percentage (e.g. `10` or `15`).
* **Editing a Product:** Click the **Edit** icon on any product row. Update stock levels (`In Stock` vs `Out of Stock`) to prevent over-orders.
* **Deleting a Product:** Click the **Trash** icon to purge stale or deprecated factory inventory.

### B. Vendors Hub (`Vendors` Tab)
Social Shopperfy operates a distributed multi-vendor co-op structure with suppliers in Nigeria, USA, UK, China, and UAE.
* **Adding a Vendor:** Click **Add Vendor**.
  * Enter Vendor Name, Bio, Flag/Logo image, rating, and physical country origin.
  * **WhatsApp Negotiation Link:** Provide their standard WhatsApp contact number in international format. This enables direct customer-to-vendor direct-chat negotiation in our product details.
* **Editing a Vendor:** Click **Edit** to adjust vendor rating stars (e.g. `4.9` or `5.0`) or update their warehouse dispatch country location.

### C. Settings & Policies Hub (`Settings` Tab)
This regulates the global AI assistant's incentives and referral policy behavior.
* **Referral Code:** Configure the default platform-wide referral code (e.g. `COOP_DIRECT` or `LAGOS_PROMO`).
* **Referral Discount Percentage:** Set the exact discount awarded to buyers using a valid referral code (e.g. `10%` or `12%`).
* **Central WhatsApp Support Link:** Enter the link for the primary customer support channel to route general escrow dispute cases.

### D. Orders & Escrow Ledger (`Orders` Tab)
This tracks all live and completed buyer transactions.
* **Order Fields:** View the unique order ID, timestamp, customer name, shipping address, specific product bought, raw total price, and final price (after any applied referral or AI-negotiated discounts).
* **Escrow Tracker:** Displays the selected payment method (e.g., "Bank Transfer", "Crypto Wallet", or "Card Escrow").
* **Fulfillment Monitoring:** Direct vendors to ship within their international corridors once payment is flagged inside the co-op escrow trust wallet.

---

## 3. Daily Workflow Checklist

To ensure high-performance operations and customer retention:
1. **Morning Ledger Check:** Access the `Orders` tab to compile active orders. Notify relevant vendors (via their registered WhatsApp links) to dispatch items immediately.
2. **Dynamic Stock Updates:** Mark products as `Out of Stock` the moment a vendor indicates direct factory constraints.
3. **Escrow Dispute Management:** In case a customer reaches out regarding delayed cross-border delivery, verify the tracking ID, mediate via WhatsApp, and manually adjust the escrow ledger values.
4. **Referral Optimization:** Regularly update the referral percentage during regional holidays (e.g. National Day, Co-Op anniversaries) to stimulate organic customer sharing.

---
**Social Shopperfy Co-Op Admin Support Office**  
Direct escalation: `musajohnjonathan@gmail.com`
