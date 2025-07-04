export interface Accommodation {
  id: string;
  name: string;
  address: string;
  costPerNight: number; // Cost to the company
  pricePerNight: number; // Price charged to client
  maxCapacity: number; // Maximum guests
  description?: string;
  roomType?: string;
  maxOccupancy?: number; // Legacy field - use maxCapacity instead
  amenities?: string[];
  location?: string;
  rating?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
