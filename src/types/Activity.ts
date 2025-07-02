import { ProductRequirement } from './Product';

export interface Activity {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  duration: number; // in hours
  maxCapacity: number;
  category: 'adventure' | 'outdoor' | 'nightlife' | 'dining' | 'indoor' | 'cultural';
  transportRequired: boolean;
  transportCost?: number;
  location: string;
  isActive: boolean;
  productRequirements?: ProductRequirement[];
  logisticsNotes?: string;
  cookNotes?: string;
}
