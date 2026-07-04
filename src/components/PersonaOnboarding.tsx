import React from 'react';
import { Sparkles, Percent, ShieldCheck, TrendingDown } from 'lucide-react';
import { UserPersona } from '../types';

interface OnboardingProps {
  onSelect: (persona: UserPersona) => void;
}

export default function PersonaOnboarding({ onSelect }: OnboardingProps) {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12" id="persona-onboarding">
      <div className="max-w-3xl w-full text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-xs font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          AI-POWERED MULTI-VENDOR CO-OP
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Social Shopperfy</span>
        </h1>
        <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto">
          Tailor your global marketplace discovery feed. Choose your shopper profile to begin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Budget Persona */}
        <button
          onClick={() => onSelect('Budget')}
          className="group relative flex flex-col items-start text-left p-8 rounded-2xl glass-card hover:glass-card-neon transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
          id="select-budget-persona"
        >
          <div className="absolute top-4 right-4 text-primary opacity-40 group-hover:opacity-100 transition-opacity">
            <Percent className="w-8 h-8" />
          </div>
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary mb-6">
            <TrendingDown className="w-6 h-6" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
            Budget Shopper
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Focus on instant price tags, massive discounts, voucher savings, and the lowest rates across direct-to-factory vendors.
          </p>
          <div className="mt-auto w-full flex items-center justify-between pt-4 border-t border-white/5 text-xs font-mono text-primary">
            <span>PRIORITIZES: SAVINGS & OFFERS</span>
            <span className="group-hover:translate-x-1 transition-transform">Configure →</span>
          </div>
        </button>

        {/* Value Seeker Persona */}
        <button
          onClick={() => onSelect('Value')}
          className="group relative flex flex-col items-start text-left p-8 rounded-2xl glass-card hover:glass-card-purple transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
          id="select-value-persona"
        >
          <div className="absolute top-4 right-4 text-secondary opacity-40 group-hover:opacity-100 transition-opacity">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20 text-secondary mb-6">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-2 group-hover:text-secondary transition-colors">
            Value Seeker
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Focus on high-quality technical specifications, brand authenticity reports, extensive ratings, and premium longevity metrics.
          </p>
          <div className="mt-auto w-full flex items-center justify-between pt-4 border-t border-white/5 text-xs font-mono text-secondary">
            <span>PRIORITIZES: SPECS & QUALITY</span>
            <span className="group-hover:translate-x-1 transition-transform">Configure →</span>
          </div>
        </button>
      </div>

      <div className="mt-16 flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-50">
        <span className="text-xs font-mono tracking-widest text-gray-500">ASSOCIATED COUNTRIES:</span>
        <span className="text-xs font-semibold tracking-wider">NIGERIA (HQ)</span>
        <span className="text-xs font-semibold tracking-wider">UNITED STATES</span>
        <span className="text-xs font-semibold tracking-wider">UNITED KINGDOM</span>
        <span className="text-xs font-semibold tracking-wider">CHINA</span>
        <span className="text-xs font-semibold tracking-wider">UNITED ARAB EMIRATES</span>
      </div>
    </div>
  );
}
