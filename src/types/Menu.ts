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
  selectedFoods: string[]; // Food IDs that are part of this menu
  foodQuantities?: Record<string, number>; // Quantities for each food
  description?: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'brunch' | 'cocktail' | 'catering';
  items: MenuItem[]; // Menu items
  pricePerPerson: number;
  minPeople: number;
  maxPeople: number;
  restaurant?: string; // Restaurant or provider name
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  allergens?: string[];
}
