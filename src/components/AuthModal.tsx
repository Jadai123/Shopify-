import React, { useState } from 'react';
import { X, Mail, Lock, ShieldCheck, Sparkles, RefreshCw, AlertCircle, User, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (session: any) => void;
  initialTab?: 'signin' | 'signup';
  persona?: 'Budget' | 'Value' | null;
}

export default function AuthModal({ isOpen, onClose, onSuccess, initialTab = 'signin', persona = null }: AuthModalProps) {
  const [tab, setTab] = useState<'signin' | 'signup'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide both your email address and password.');
      return;
    }

    if (tab === 'signup') {
      if (!fullName.trim()) {
        setError('Please provide your full name.');
        return;
      }
      if (!phoneNumber.trim()) {
        setError('Please provide your WhatsApp phone number.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify your password entries.');
        return;
      }
      if (password.length < 5) {
        setError('For security, password must be at least 5 characters long.');
        return;
      }
    }

    setError('');
    setLoading(true);

    try {
      if (tab === 'signup') {
        const { data, error: signUpErr } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: {
              fullName: fullName.trim(),
              phoneNumber: phoneNumber.trim(),
              role: 'user',
              persona: persona
            }
          }
        });
        if (signUpErr) {
          // Fallback to sign in automatically if email is already registered
          if (signUpErr.message && signUpErr.message.toLowerCase().includes('already exists')) {
            const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
              email: email.trim(),
              password: password.trim()
            });
            if (signInErr) {
              throw signUpErr;
            }
            onSuccess(signInData.session);
            onClose();
            return;
          }
          throw signUpErr;
        }
        onSuccess(data.session);
        onClose();
      } else {
        const { data, error: signInErr } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim()
        });
        if (signInErr) throw signInErr;
        onSuccess(data.session);
        onClose();
      }
    } catch (err: any) {
      console.error('[Auth Exception]:', err);
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" id="auth-modal-overlay">
      <div 
        className="relative w-full max-w-md bg-neutral-950 border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        id="auth-modal-container"
      >
        {/* Absolute visual ambient glow behind */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header and Close */}
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <h2 className="font-display text-2xl font-black text-white flex items-center gap-2">
              Social <span className="text-primary">Shopperfy</span>
              <Sparkles className="w-4.5 h-4.5 text-primary animate-pulse" />
            </h2>
            <p className="text-xs text-gray-400 font-mono mt-1">
              {tab === 'signin' ? 'Log in with your email and password' : 'Create a secure shopper account'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full border border-white/5 hover:border-white/10 text-gray-400 hover:text-white bg-neutral-900 transition-colors cursor-pointer"
            id="close-auth-modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 rounded-lg bg-neutral-900 border border-white/5 mb-6 relative z-10" id="auth-tab-group">
          <button
            onClick={() => { setTab('signin'); setError(''); }}
            className={`flex-1 py-2 text-xs font-mono font-bold uppercase rounded-md transition-all cursor-pointer ${
              tab === 'signin' ? 'bg-primary/20 text-primary border border-primary/10' : 'text-gray-400 hover:text-gray-200'
            }`}
            id="tab-signin-trigger"
          >
            Log In
          </button>
          <button
            onClick={() => { setTab('signup'); setError(''); }}
            className={`flex-1 py-2 text-xs font-mono font-bold uppercase rounded-md transition-all cursor-pointer ${
              tab === 'signup' ? 'bg-primary/20 text-primary border border-primary/10' : 'text-gray-400 hover:text-gray-200'
            }`}
            id="tab-signup-trigger"
          >
            Create Account
          </button>
        </div>

        {/* Auth Error Banner */}
        {error && (
          <div className="p-3 mb-5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono flex items-start gap-2 relative z-10" id="auth-error-banner">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10" id="auth-form-node">
          {tab === 'signup' && (
            <>
              <div>
                <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Musa John"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-lg text-sm text-white placeholder-gray-600 font-mono focus:outline-none transition-all"
                    id="auth-fullname-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5">
                  WhatsApp Phone Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. +234 803 999 9999"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-lg text-sm text-white placeholder-gray-600 font-mono focus:outline-none transition-all"
                    id="auth-phone-input"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="buyer@shopperfy.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-lg text-sm text-white placeholder-gray-600 font-mono focus:outline-none transition-all"
                id="auth-email-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5">
              Account Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-lg text-sm text-white placeholder-gray-600 font-mono focus:outline-none transition-all"
                id="auth-password-input"
              />
            </div>
          </div>

          {tab === 'signup' && (
            <div>
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-lg text-sm text-white placeholder-gray-600 font-mono focus:outline-none transition-all"
                  id="auth-confirmpassword-input"
                />
              </div>
            </div>
          )}

          {tab === 'signup' && (
            <div className="p-3 rounded-lg border border-white/5 bg-neutral-900/50 text-[11px] text-gray-400 font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <span>
                Default role will be set to <strong className="text-white">user</strong>. Initial persona choice: <strong className="text-white">{persona || 'Budget'} Shopper</strong>
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-primary to-primary-hover hover:opacity-95 text-black font-mono font-bold uppercase tracking-wider rounded-lg text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-primary/20"
            id="auth-submit-btn"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                Securing connection...
              </>
            ) : (
              tab === 'signin' ? 'Access Account' : 'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
