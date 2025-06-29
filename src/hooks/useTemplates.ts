import { useState, useEffect } from 'react';
import { MealTemplate, ActivityTemplate, TransportTemplate, StayTemplate } from '../types/Budget';
import { Menu } from '../types/Menu';

// Mock menu data
const mockMenus: Menu[] = [
  {
    id: '1',
    name: 'Premium BBQ Package',
    description: 'High-quality barbecue experience with premium cuts and craft beer pairings',
    type: 'lunch',
    pricePerPerson: 85,
    minPeople: 8,
    maxPeople: 25,
    items: [
      { id: '1', name: 'Wagyu Beef Brisket', description: 'Slow-smoked for 12 hours', price: 32, category: 'main' },
      { id: '2', name: 'Craft Beer Selection', description: 'Local brewery selection', price: 12, category: 'beverage' },
      { id: '3', name: 'Smoked Wings', description: 'Bourbon glazed chicken wings', price: 18, category: 'appetizer' },
      { id: '4', name: 'Bourbon Pecan Pie', description: 'House-made dessert', price: 14, category: 'dessert' }
    ],
    restaurant: 'Smokehouse Prime',
    isActive: true,
  },
  {
    id: '2',
    name: 'Rooftop Cocktail Experience',
    description: 'Exclusive rooftop cocktail service with city views and premium spirits',
    type: 'cocktail',
    pricePerPerson: 65,
    minPeople: 6,
    maxPeople: 20,
    items: [
      { id: '5', name: 'Signature Old Fashioned', description: 'House bourbon blend', price: 16, category: 'beverage' },
      { id: '6', name: 'Gourmet Sliders', description: 'Wagyu beef mini burgers', price: 22, category: 'appetizer' },
      { id: '7', name: 'Whiskey Flight', description: 'Selection of premium whiskeys', price: 28, category: 'special' }
    ],
    restaurant: 'Sky Lounge',
    isActive: true,
  },
  {
    id: '3',
    name: 'Steakhouse Dinner',
    description: 'Classic steakhouse experience with premium cuts and wine pairings',
    type: 'dinner',
    pricePerPerson: 120,
    minPeople: 4,
    maxPeople: 16,
    items: [
      { id: '8', name: 'Dry-Aged Ribeye', description: '28-day aged prime cut', price: 58, category: 'main' },
      { id: '9', name: 'Lobster Tail', description: 'Canadian cold water lobster', price: 45, category: 'main' },
      { id: '10', name: 'Wine Pairing', description: 'Sommelier selected wines', price: 35, category: 'beverage' },
      { id: '11', name: 'Chocolate Soufflé', description: 'Made to order dessert', price: 18, category: 'dessert' }
    ],
    restaurant: 'Prime Cut Steakhouse',
    isActive: true,
  }
];

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

  const [menus, setMenus] = useState(mockMenus);

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

  const addMenu = (menu: Menu) => {
    setMenus(prev => [...prev, { ...menu, id: Date.now().toString() }]);
  };

  const updateMenu = (id: string, updated: Menu) => {
    setMenus(prev => prev.map(menu => menu.id === id ? { ...menu, ...updated } : menu));
  };

  const deleteMenu = (id: string) => {
    setMenus(prev => prev.filter(menu => menu.id !== id));
  };

  return {
    templates,
    menus,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    addMenu,
    updateMenu,
    deleteMenu
  };
};
