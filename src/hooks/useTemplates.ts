
import { useState, useEffect } from 'react';
import { MealTemplate, ActivityTemplate, TransportTemplate, StayTemplate } from '../types/Budget';

// Mock data - in a real app, these would come from your API
const mockMeals: MealTemplate[] = [
  {
    id: '1',
    name: 'Asado Premium',
    description: 'Traditional Argentine BBQ with premium cuts',
    type: 'dinner',
    pricePerPerson: 45,
    minPeople: 8,
    maxPeople: 30,
    restaurant: 'La Parrilla del Chef'
  },
  {
    id: '2',
    name: 'Wine Tasting Lunch',
    description: 'Gourmet lunch with local wine pairing',
    type: 'lunch',
    pricePerPerson: 35,
    minPeople: 6,
    maxPeople: 20,
    restaurant: 'Bodega Vista Andina'
  }
];

const mockActivities: ActivityTemplate[] = [
  {
    id: '1',
    name: 'Rafting Adventure',
    description: 'Exciting white water rafting experience',
    basePrice: 80,
    duration: 4,
    maxCapacity: 16,
    category: 'adventure',
    transportRequired: true,
    transportCost: 25,
    location: 'Rio Mendoza'
  },
  {
    id: '2',
    name: 'Casino Night',
    description: 'VIP casino experience with dinner',
    basePrice: 120,
    duration: 6,
    maxCapacity: 20,
    category: 'nightlife',
    transportRequired: false,
    location: 'Casino Central'
  }
];

const mockTransport: TransportTemplate[] = [
  {
    id: '1',
    name: 'Luxury Minivan',
    description: 'Comfortable transport for small groups',
    vehicleType: 'minivan',
    capacity: 8,
    pricePerHour: 45,
    pricePerKm: 2,
    includesDriver: true
  },
  {
    id: '2',
    name: 'Party Bus',
    description: 'Large bus with entertainment system',
    vehicleType: 'bus',
    capacity: 25,
    pricePerHour: 120,
    pricePerKm: 3,
    includesDriver: true
  }
];

const mockStay: StayTemplate[] = [
  {
    id: '1',
    name: 'Mountain Lodge',
    description: 'Cozy lodge with mountain views',
    pricePerNight: 150,
    maxOccupancy: 4,
    roomType: 'suite',
    amenities: ['WiFi', 'Breakfast', 'Pool', 'Spa'],
    location: 'Las Leñas',
    rating: 4.5
  },
  {
    id: '2',
    name: 'Downtown Hotel',
    description: 'Modern hotel in city center',
    pricePerNight: 120,
    maxOccupancy: 2,
    roomType: 'double',
    amenities: ['WiFi', 'Gym', 'Restaurant', 'Bar'],
    location: 'Mendoza Centro',
    rating: 4.2
  }
];

export const useTemplates = () => {
  const [templates, setTemplates] = useState({
    meals: mockMeals,
    activities: mockActivities,
    transport: mockTransport,
    stay: mockStay
  });

  const addTemplate = (type: string, template: any) => {
    setTemplates(prev => ({
      ...prev,
      [type]: [...prev[type as keyof typeof prev], { ...template, id: Date.now().toString() }]
    }));
  };

  const updateTemplate = (type: string, id: string, updated: any) => {
    setTemplates(prev => ({
      ...prev,
      [type]: (prev[type as keyof typeof prev] as any[]).map(item => 
        item.id === id ? { ...item, ...updated } : item
      )
    }));
  };

  const deleteTemplate = (type: string, id: string) => {
    setTemplates(prev => ({
      ...prev,
      [type]: (prev[type as keyof typeof prev] as any[]).filter(item => item.id !== id)
    }));
  };

  return {
    templates,
    addTemplate,
    updateTemplate,
    deleteTemplate
  };
};
