import React, { useState, useEffect } from 'react';
import { Sparkles, ShoppingBag, X, ArrowRight, Percent } from 'lucide-react';
import { Product } from '../types';

interface AbandonmentPromptProps {
  products: Product[];
  onResumeCheckout: (product: Product, extraDiscount: number) => void;
}

export default function AbandonmentPrompt({ products, onResumeCheckout }: AbandonmentPromptProps) {
  const [abandonedProduct, setAbandonedProduct] = useState<Product | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isCheckoutActive = localStorage.getItem('shopperfy_checkout_active');
    const abandonedProductId = localStorage.getItem('shopperfy_checkout_product_id');

    if (isCheckoutActive === 'true' && abandonedProductId) {
      const prod = products.find(p => p.id === abandonedProductId);
      if (prod) {
        // Trigger prompt after a short delay for smooth onboarding entry
        const timer = setTimeout(() => {
          setAbandonedProduct(prod);
          setIsOpen(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [products]);

  const handleResume = () => {
    if (abandonedProduct) {
      // Award extra 5% discount for resuming!
      onResumeCheckout(abandonedProduct, 5);
      setIsOpen(false);
    }
  };

  const handleDecline = () => {
    localStorage.removeItem('shopperfy_checkout_active');
    localStorage.removeItem('shopperfy_checkout_product_id');
    setIsOpen(false);
  };

  if (!isOpen || !abandonedProduct) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 font-sans" id="abandonment-reengagement-modal">
      <div className="max-w-md w-full rounded-2xl glass-card border border-primary/30 p-6 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Absolute X button */}
        <button
          onClick={handleDecline}
          className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex gap-2.5 items-center">
          <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <ShoppingBag className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest flex items-center gap-1">
              Welcome back
              <Sparkles className="w-3 h-3 animate-pulse" />
            </span>
            <h3 className="font-display text-lg font-bold text-white leading-tight">Resume secure checkout</h3>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          We noticed you left the premium <strong className="text-white">"{abandonedProduct.name}"</strong> in your secure checkout desk!
        </p>

        {/* Incentive offer */}
        <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/30 flex gap-3 items-center">
          <div className="w-9 h-9 rounded-full bg-primary text-black font-extrabold flex items-center justify-center font-mono text-sm shadow-md shrink-0">
            +5%
          </div>
          <div>
            <div className="text-xs font-bold text-white">Special Returning Client Reward</div>
            <div className="text-[10px] text-gray-400 font-mono">Unlocks an extra 5% discount if you complete checkout now!</div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleDecline}
            className="py-2.5 text-xs font-mono text-gray-400 hover:text-white border border-white/5 hover:border-white/10 rounded-lg bg-neutral-900 transition-colors cursor-pointer"
          >
            Decline Offer
          </button>
          <button
            onClick={handleResume}
            className="py-2.5 px-4 text-xs font-extrabold bg-gradient-to-r from-primary to-secondary text-black rounded-lg hover:shadow-neon-green transition-all flex items-center justify-center gap-1 cursor-pointer"
            id="btn-resume-checkout"
          >
            Resume Checkout
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
