export interface Vendor {
  id: string;
  name: string;
  logo_url: string;
  whatsapp_number: string;
  country: string;
  rating: number;
  bio: string;
  created_at: string;
}

export interface Product {
  id: string;
  vendor_id: string;
  name: string;
  description: string;
  price_ngn: number;
  price_usd: number;
  discount_percent: number;
  category: string;
  images: string[];
  specs: Record<string, string>;
  stock_status: 'in_stock' | 'out_of_stock';
  created_at: string;
}

export interface PriceHistory {
  id: string;
  product_id: string;
  price_ngn: number;
  recorded_at: string;
}

export interface AdminSetting {
  id: number;
  admin_email: string;
  referral_code: string;
  discount_percentage: number;
  whatsapp_link: string;
}

export interface Order {
  id: string;
  user_email: string;
  product_id: string;
  amount_ngn: number;
  amount_usd: number;
  status: 'pending' | 'completed' | 'cancelled';
  payment_gateway: 'paystack' | 'stripe';
  created_at: string;
  referral_code_used?: string;
  discount_applied_percent?: number;
}

export type UserPersona = 'Budget' | 'Value' | null;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
