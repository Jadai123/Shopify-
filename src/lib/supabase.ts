export interface Session {
  user: {
    id: string;
    email: string;
    role: 'user' | 'admin';
    persona: 'Budget' | 'Value' | null;
    fullName?: string;
    phoneNumber?: string;
  } | null;
}

type AuthStateChangeCallback = (event: 'SIGNED_IN' | 'SIGNED_OUT' | 'INITIAL_SESSION', session: Session | null) => void;

class SupabaseAuthClient {
  private listeners: AuthStateChangeCallback[] = [];
  private currentSession: Session | null = null;
  private isInitialized = false;

  constructor() {
    this.fetchSession();
  }

  async fetchSession() {
    try {
      const res = await fetch('/api/auth/session');
      if (res.ok) {
        const data = await res.json();
        if (data.session) {
          this.currentSession = data.session;
          this.isInitialized = true;
          this.triggerListeners('INITIAL_SESSION', this.currentSession);
          return this.currentSession;
        }
      }
      this.currentSession = null;
      this.isInitialized = true;
      this.triggerListeners('INITIAL_SESSION', null);
      return null;
    } catch (e) {
      this.currentSession = null;
      this.isInitialized = true;
      this.triggerListeners('INITIAL_SESSION', null);
      return null;
    }
  }

  private triggerListeners(event: 'SIGNED_IN' | 'SIGNED_OUT' | 'INITIAL_SESSION', session: Session | null) {
    this.listeners.forEach(cb => cb(event, session));
  }

  async signUp({ email, password, options }: any) {
    const persona = options?.data?.persona || null;
    const fullName = options?.data?.fullName || '';
    const phoneNumber = options?.data?.phoneNumber || '';
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, persona, fullName, phoneNumber })
      });
      const data = await res.json();
      if (!res.ok) {
        return { data: { user: null, session: null }, error: new Error(data.error || 'Sign up failed') };
      }
      this.currentSession = data.session;
      this.triggerListeners('SIGNED_IN', this.currentSession);
      return { data: { user: data.session?.user || null, session: data.session || null }, error: null };
    } catch (err: any) {
      return { data: { user: null, session: null }, error: new Error('Something went wrong, please try again') };
    }
  }

  async signInWithPassword({ email, password }: any) {
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { data: { user: null, session: null }, error: new Error(data.error || 'Sign in failed') };
      }
      this.currentSession = data.session;
      this.triggerListeners('SIGNED_IN', this.currentSession);
      return { data: { user: data.session?.user || null, session: data.session || null }, error: null };
    } catch (err: any) {
      return { data: { user: null, session: null }, error: new Error('Something went wrong, please try again') };
    }
  }

  async signOut() {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      this.currentSession = null;
      this.triggerListeners('SIGNED_OUT', null);
      return { error: null };
    } catch (err: any) {
      return { error: new Error('Something went wrong, please try again') };
    }
  }

  async getSession() {
    if (!this.isInitialized) {
      const s = await this.fetchSession();
      return { data: { session: s }, error: null };
    }
    return { data: { session: this.currentSession }, error: null };
  }

  async updateUserPersona(persona: 'Budget' | 'Value' | null) {
    if (!this.currentSession?.user) return { error: new Error('Not logged in') };
    try {
      const res = await fetch('/api/auth/update-persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona })
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: new Error(data.error || 'Failed to update persona') };
      }
      this.currentSession = data.session;
      this.triggerListeners('SIGNED_IN', this.currentSession);
      return { data, error: null };
    } catch (err: any) {
      return { error: new Error('Something went wrong, please try again') };
    }
  }

  onAuthStateChange(callback: AuthStateChangeCallback) {
    this.listeners.push(callback);
    if (this.isInitialized) {
      callback('INITIAL_SESSION', this.currentSession);
    } else {
      this.fetchSession();
    }
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
          }
        }
      }
    };
  }
}

export const supabase = {
  auth: new SupabaseAuthClient()
};
