import React, { useState, useEffect } from 'react';
import { CreditCard, Tag, Mail, CheckCircle, ArrowLeft, ArrowRight, ShieldCheck, ShoppingCart, Percent, Loader2 } from 'lucide-react';
import { Product, Vendor, AdminSetting } from '../types';

interface CheckoutFlowProps {
  product: Product;
  vendors: Vendor[];
  onBackToMarket: () => void;
  onOrderCompleted: () => void;
}

export default function CheckoutFlow({ product, vendors, onBackToMarket, onOrderCompleted }: CheckoutFlowProps) {
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [referralSuccess, setReferralSuccess] = useState('');
  const [referralError, setReferralError] = useState('');
  
  // Choose currency: 'NGN' | 'USD'
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');

  // Stages: 'input' | 'processing' | 'success'
  const [checkoutStage, setCheckoutStage] = useState<'input' | 'processing' | 'success'>('input');
  const [processingMessage, setProcessingMessage] = useState('');
  const [completedOrderDetails, setCompletedOrderDetails] = useState<any>(null);

  const matchedVendor = vendors.find(v => v.id === product.vendor_id);

  // Auto-detect currency based on vendor country
  useEffect(() => {
    if (matchedVendor) {
      if (matchedVendor.country === 'Nigeria') {
        setCurrency('NGN');
      } else {
        setCurrency('USD');
      }
    }
    
    // Save that checkout has started (for abandonment handling!)
    localStorage.setItem('shopperfy_checkout_active', 'true');
    localStorage.setItem('shopperfy_checkout_product_id', product.id);
  }, [product, matchedVendor]);

  // Handle referral coupon application
  const handleApplyReferral = async () => {
    setReferralSuccess('');
    setReferralError('');
    if (!referralCode.trim()) return;

    try {
      const res = await fetch('/api/admin/settings');
      const settings: AdminSetting = await res.json();
      
      if (settings && referralCode.toUpperCase() === settings.referral_code.toUpperCase()) {
        setDiscountPercent(settings.discount_percentage);
        setReferralSuccess(`Success: "${settings.referral_code}" applied! ${settings.discount_percentage}% discount credited.`);
      } else {
        setReferralError('Invalid voucher / referral code.');
        setDiscountPercent(0);
      }
    } catch (err) {
      console.error(err);
      setReferralError('Failed to validate referral code.');
    }
  };

  // Price arithmetic
  const priceBase = currency === 'NGN' ? product.price_ngn : product.price_usd;
  const priceBeforeReferral = priceBase * (1 - product.discount_percent / 100);
  const referralDiscountValue = priceBeforeReferral * (discountPercent / 100);
  const finalPrice = priceBeforeReferral - referralDiscountValue;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setCheckoutStage('processing');
    const gateway = currency === 'NGN' ? 'paystack' : 'stripe';
    setProcessingMessage(`Connecting securely with ${currency === 'NGN' ? 'Paystack NGN API...' : 'Stripe USD Terminal...'}`);

    // Simulate cryptographic escrow authorization delay
    setTimeout(async () => {
      setProcessingMessage(`Confirming secure payment records and checking security credentials...`);
      
      setTimeout(async () => {
        try {
          const body = {
            user_email: email,
            product_id: product.id,
            amount_ngn: currency === 'NGN' ? finalPrice : finalPrice * 1600, // Naira translation if Stripe
            amount_usd: currency === 'USD' ? finalPrice : finalPrice / 1600, // NGN translation if Paystack
            payment_gateway: gateway,
            referral_code: discountPercent > 0 ? referralCode.toUpperCase() : undefined,
            discount_applied_percent: discountPercent > 0 ? discountPercent : undefined
          };

          const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Server error creating order');

          setCompletedOrderDetails(data.order);
          setCheckoutStage('success');
          
          // Clear abandonment flag since order completed successfully!
          localStorage.removeItem('shopperfy_checkout_active');
          localStorage.removeItem('shopperfy_checkout_product_id');

        } catch (err: any) {
          alert('Failed to log order: ' + err.message);
          setCheckoutStage('input');
        }
      }, 1500);
    }, 1500);
  };

  if (checkoutStage === 'processing') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center" id="checkout-processing">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
        <h3 className="font-display text-2xl font-bold text-white mb-2">Escrow-Style Checkout Secure Gateway</h3>
        <p className="text-gray-400 font-mono text-xs max-w-sm mx-auto leading-relaxed uppercase tracking-wider animate-pulse">
          {processingMessage}
        </p>
      </div>
    );
  }

  if (checkoutStage === 'success' && completedOrderDetails) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-2xl glass-card-neon text-center border border-primary/20 shadow-2xl" id="checkout-success">
        <div className="inline-flex p-4 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h3 className="font-display text-3xl font-extrabold text-white mb-2">Purchase Finalized!</h3>
        <p className="text-gray-400 font-mono text-xs uppercase tracking-widest mb-6">Order Reference: {completedOrderDetails.id}</p>
        
        <div className="p-4 rounded-xl bg-neutral-900 border border-white/5 text-left text-xs mb-8 space-y-2.5">
          <div className="flex justify-between">
            <span className="text-gray-500 font-mono">Customer Account:</span>
            <span className="text-white font-mono">{completedOrderDetails.user_email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-mono">Settlement Amount:</span>
            <span className="text-primary font-mono font-bold">₦{completedOrderDetails.amount_ngn.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-mono">Fulfillment Router:</span>
            <span className="text-white font-mono uppercase font-bold">{completedOrderDetails.payment_gateway} Gateway</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-8 leading-relaxed">
          The verified merchant has been notified of your order. You will receive package tracking information directly on your email shortly.
        </p>

        <button
          onClick={() => { onOrderCompleted(); onBackToMarket(); }}
          className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-black font-extrabold rounded-lg hover:shadow-neon-green transition-shadow cursor-pointer"
        >
          Back to Discover Feed
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8" id="checkout-form-container">
      {/* Back button */}
      <button
        onClick={onBackToMarket}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-white transition-colors mb-8 cursor-pointer"
        id="checkout-back-button"
      >
        <ArrowLeft className="w-4 h-4" />
        Cancel Checkout
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form Specifications & Inputs */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="font-display text-3xl font-extrabold text-white">Escrow Settlement Desk</h2>
          
          <form onSubmit={handleCheckoutSubmit} className="space-y-6 p-6 rounded-2xl bg-dark-surface border border-white/5">
            {/* Currency select indicators */}
            <div className="space-y-3">
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider">Choose Settlement Gateway Currency</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setCurrency('NGN')}
                  className={`py-3 rounded-lg border flex flex-col items-center justify-center cursor-pointer transition-all ${
                    currency === 'NGN' ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-white/10 bg-neutral-900 text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="text-sm font-mono font-bold">Paystack (NGN Naira)</span>
                  <span className="text-[10px] opacity-60">Nigerian local cards & bank app transfers</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`py-3 rounded-lg border flex flex-col items-center justify-center cursor-pointer transition-all ${
                    currency === 'USD' ? 'border-secondary bg-secondary/5 text-secondary font-bold' : 'border-white/10 bg-neutral-900 text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="text-sm font-mono font-bold">Stripe (USD International)</span>
                  <span className="text-[10px] opacity-60">Visa, Mastercard & Apple Pay globally</span>
                </button>
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                Receipt Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="buyer@example.com"
                className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-primary placeholder-gray-600"
                id="checkout-email-field"
              />
            </div>

            {/* Referral / Voucher system */}
            <div>
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-gray-400" />
                Admin Referral Code (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="E.g., MUSA2024"
                  className="flex-1 px-4 py-3 rounded-lg bg-neutral-900 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-primary placeholder-gray-600 uppercase"
                  id="checkout-referral-input"
                />
                <button
                  type="button"
                  onClick={handleApplyReferral}
                  className="px-5 bg-neutral-800 border border-white/10 text-white text-xs font-mono rounded-lg hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  Apply Code
                </button>
              </div>
              {referralSuccess && (
                <p className="text-xs text-primary font-mono mt-2 flex items-center gap-1.5 bg-primary/10 border border-primary/20 p-2 rounded">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  {referralSuccess}
                </p>
              )}
              {referralError && (
                <p className="text-xs text-red-500 font-mono mt-2 p-2 rounded bg-red-500/10 border border-red-500/20">
                  {referralError}
                </p>
              )}
            </div>

            {/* Submit checkout payment gateway */}
            <button
              type="submit"
              className={`w-full py-4 rounded-lg font-extrabold flex items-center justify-center gap-2 text-sm shadow-lg transition-all transform active:translate-y-0.5 hover:-translate-y-0.5 cursor-pointer ${
                currency === 'NGN' ? 'bg-primary text-black hover:shadow-neon-green/30' : 'bg-secondary text-white hover:shadow-neon-purple/30'
              }`}
              id="checkout-submit-button"
            >
              <CreditCard className="w-5 h-5" />
              Pay {currency === 'NGN' ? '₦' : '$'}{finalPrice.toLocaleString()} via {currency === 'NGN' ? 'Paystack' : 'Stripe'}
            </button>
          </form>
        </div>

        {/* Right 1 Col: Product Card Summary Card */}
        <div className="space-y-6">
          <h3 className="font-display text-lg font-bold text-white">Your Selections</h3>
          
          <div className="rounded-2xl border border-white/5 bg-dark-surface p-5 space-y-4">
            <div className="flex gap-4 pb-4 border-b border-white/5">
              <img src={product.images[0]} alt="" className="w-16 h-16 rounded-lg object-cover" referrerPolicy="no-referrer" />
              <div className="min-w-0">
                <span className="px-2 py-0.5 rounded bg-secondary/10 text-secondary border border-secondary/20 text-[9px] font-mono font-bold uppercase">
                  {product.category}
                </span>
                <h4 className="font-bold text-white text-sm truncate mt-1">{product.name}</h4>
                {matchedVendor && (
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">By {matchedVendor.name}</p>
                )}
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between text-gray-400">
                <span>Direct Catalog Rate:</span>
                <span>{currency === 'NGN' ? '₦' : '$'}{priceBase.toLocaleString()}</span>
              </div>
              {product.discount_percent > 0 && (
                <div className="flex justify-between text-primary">
                  <span>Factory Discount ({product.discount_percent}%):</span>
                  <span>-{currency === 'NGN' ? '₦' : '$'}{(priceBase * (product.discount_percent / 100)).toLocaleString()}</span>
                </div>
              )}
              {discountPercent > 0 && (
                <div className="flex justify-between text-primary font-bold">
                  <span>Admin Referral ({discountPercent}%):</span>
                  <span>-{currency === 'NGN' ? '₦' : '$'}{referralDiscountValue.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-3 border-t border-white/5 flex justify-between text-sm text-white font-bold font-mono">
                <span>Net Total Payable:</span>
                <span className="text-primary font-bold text-base">
                  {currency === 'NGN' ? '₦' : '$'}{finalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex gap-2 items-center text-[10px] text-gray-500 leading-tight">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <span>We utilize industry certified bank-level SSL encryption logic across Paystack & Stripe integrations.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
