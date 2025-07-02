export interface Product {
  id: string;
  name: string;
  description?: string;
  category: 'meat' | 'vegetables' | 'beverages' | 'condiments' | 'equipment' | 'decorations' | 'other';
  unit: 'kg' | 'units' | 'liters' | 'pieces' | 'boxes' | 'bags' | 'bottles';
  estimatedPrice: number;
  supplier?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequirement {
  productId: string;
  quantity: number;
  notes?: string;
}

export interface TemplateProduct {
  id: string;
  product: Product;
  quantity: number;
  notes?: string;
} 