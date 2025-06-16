
export interface Activity {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  duration: number; // in hours
  maxCapacity: number;
  category: 'outdoor' | 'indoor' | 'nightlife' | 'dining' | 'adventure' | 'cultural';
  transportRequired: boolean;
  transportCost?: number;
  location: string;
  isActive: boolean;
}
