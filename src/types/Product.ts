export interface Product {
  id: string;
  name: string;
  category: string;
  cost: number;
  unit: string;
  description?: string;
  estimatedPrice?: number;
  supplier?: string;
  notes?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
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