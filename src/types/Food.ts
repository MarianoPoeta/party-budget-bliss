export interface Food {
  id: string;
  name: string;
  pricePerGuest: number; // Price that will be added to the budget per guest
  guestsPerUnit: number; // How many guests per unit (e.g., 1 pizza for 2 guests)
  selectedProducts?: string[]; // Product IDs needed to make this food
  productQuantities?: Record<string, number>; // Quantities for each product
  description?: string;
  category?: string;
  pricePerUnit?: number; // Legacy field - use pricePerGuest instead
  unit?: string;
  allergens?: string[]; // Common allergens like 'gluten', 'dairy', 'nuts', 'eggs', 'soy', 'fish', 'shellfish'
  dietaryInfo?: string[]; // 'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo'
  nutritionalInfo?: {
    calories?: number; // per unit
    protein?: number; // grams per unit
    carbs?: number; // grams per unit
    fat?: number; // grams per unit
  };
  preparationTime?: number; // minutes
  storageRequirements?: string; // refrigerated, frozen, dry storage
  supplier?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FoodItem extends Food {
  quantity: number; // How much is needed for a recipe
  notes?: string; // Special preparation notes
} 