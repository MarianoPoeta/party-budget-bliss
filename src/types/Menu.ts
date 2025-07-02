import { ProductRequirement } from './Product';

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage' | 'special';
  price: number;
  allergens?: string[];
  dietaryInfo?: string[];
}

export interface Menu {
  id: string;
  name: string;
  description: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'brunch' | 'cocktail' | 'catering';
  pricePerPerson: number;
  restaurant: string;
  minPeople: number;
  maxPeople: number;
  items: MenuItem[];
  productRequirements?: ProductRequirement[];
  cookNotes?: string;
  preparationTime?: number; // in minutes
  isActive: boolean;
}
