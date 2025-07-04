export interface BudgetTemplate {
  id: string;
  name: string;
  description: string;
}

export interface MealItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  notes?: string;
}

export interface MealTemplate extends BudgetTemplate {
  type: 'breakfast' | 'lunch' | 'dinner' | 'brunch' | 'cocktail' | 'catering';
  pricePerPerson: number;
  minPeople: number;
  maxPeople: number;
  restaurant: string;
  items?: MealItem[];
  customizations?: {
    itemsCustomized?: boolean;
    originalTemplate?: MealTemplate;
    guestCount?: number;
  };
}

export interface ActivityTemplate extends BudgetTemplate {
  basePrice: number;
  duration: number;
  maxCapacity: number;
  category: 'outdoor' | 'indoor' | 'nightlife' | 'dining' | 'adventure' | 'cultural';
  transportRequired: boolean;
  transportCost?: number;
  location: string;
}

export interface TransportTemplate extends BudgetTemplate {
  pricePerGuest: number;
  costToCompany: number;
  type: string;
  capacity: number;
  vehicleType?: 'bus' | 'minivan' | 'car' | 'limousine' | 'boat';
  pricePerHour?: number;
  pricePerKm?: number;
  includesDriver?: boolean;
}

export interface StayTemplate extends BudgetTemplate {
  pricePerNight: number;
  maxOccupancy: number;
  roomType: 'single' | 'double' | 'suite' | 'apartment' | 'villa' | 'hostel';
  amenities: string[];
  location: string;
  rating: number;
}

export interface BudgetItem {
  templateId: string;
  customizations: Record<string, any>;
  quantity: number;
  notes?: string;
}

export interface NewBudget {
  clientName: string;
  eventDate: string;
  guestCount: number;
  selectedMeals: BudgetItem[];
  selectedActivities: BudgetItem[];
  selectedTransport: BudgetItem[];
  selectedStay?: BudgetItem;
  totalAmount: number;
}
