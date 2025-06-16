
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage' | 'special';
}

export interface Menu {
  id: string;
  name: string;
  description: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'brunch' | 'cocktail' | 'catering';
  pricePerPerson: number;
  minPeople: number;
  maxPeople: number;
  items: MenuItem[];
  restaurant: string;
  isActive: boolean;
}
