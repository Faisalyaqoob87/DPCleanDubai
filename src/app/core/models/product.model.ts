export interface Product {
  id: number;
  name: string;
  price: number;
  desc: string;
  category: 'Electrical Services' | 'Plumbing Services' | 'Deep Cleaning Services';
  image: string;
}

export interface CartItem extends Product {
  qty: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}
