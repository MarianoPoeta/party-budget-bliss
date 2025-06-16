
export interface Accommodation {
  id: string;
  name: string;
  description: string;
  pricePerNight: number;
  maxOccupancy: number;
  roomType: 'single' | 'double' | 'suite' | 'apartment' | 'villa' | 'hostel';
  amenities: string[];
  location: string;
  rating: number; // 1-5 stars
  isActive: boolean;
}
