import { useState, useEffect, useCallback, useMemo } from 'react';
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
    description: 'Exciting white water rafting experience on the Mendoza River',
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
    description: 'VIP casino experience with dinner and entertainment',
    basePrice: 120,
    duration: 6,
    maxCapacity: 20,
    category: 'nightlife',
    transportRequired: false,
    location: 'Casino Central'
  },
  {
    id: '3',
    name: 'Wine Valley Tour',
    description: 'Guided tour through the famous Mendoza wine region',
    basePrice: 95,
    duration: 8,
    maxCapacity: 12,
    category: 'cultural',
    transportRequired: true,
    transportCost: 30,
    location: 'Valle de Uco'
  },
  {
    id: '4',
    name: 'Mountain Hiking',
    description: 'Scenic hiking adventure in the Andes mountains',
    basePrice: 65,
    duration: 6,
    maxCapacity: 15,
    category: 'outdoor',
    transportRequired: true,
    transportCost: 20,
    location: 'Cerro Aconcagua'
  },
  {
    id: '5',
    name: 'Spa & Wellness Day',
    description: 'Relaxing spa treatment and wellness activities',
    basePrice: 150,
    duration: 5,
    maxCapacity: 10,
    category: 'indoor',
    transportRequired: false,
    location: 'Luxury Spa Resort'
  },
  {
    id: '6',
    name: 'Beach Club Party',
    description: 'Exclusive beach club experience with pool and entertainment',
    basePrice: 110,
    duration: 8,
    maxCapacity: 25,
    category: 'nightlife',
    transportRequired: true,
    transportCost: 35,
    location: 'Playa del Sol'
  }
];

const mockTransport: TransportTemplate[] = [
  {
    id: '1',
    name: 'Luxury Minivan',
    description: 'Comfortable transport for small groups with premium amenities',
    vehicleType: 'minivan',
    capacity: 8,
    pricePerHour: 45,
    pricePerKm: 2,
    includesDriver: true
  },
  {
    id: '2',
    name: 'Party Bus',
    description: 'Large bus with entertainment system, perfect for group celebrations',
    vehicleType: 'bus',
    capacity: 25,
    pricePerHour: 120,
    pricePerKm: 3,
    includesDriver: true
  },
  {
    id: '3',
    name: 'Luxury Limousine',
    description: 'Premium limousine service for special occasions',
    vehicleType: 'limousine',
    capacity: 6,
    pricePerHour: 80,
    pricePerKm: 4,
    includesDriver: true
  },
  {
    id: '4',
    name: 'Adventure SUV',
    description: 'Rugged SUV perfect for outdoor activities and off-road adventures',
    vehicleType: 'car',
    capacity: 6,
    pricePerHour: 35,
    pricePerKm: 1.5,
    includesDriver: true
  },
  {
    id: '5',
    name: 'Speedboat Charter',
    description: 'Exclusive boat service for waterfront activities and scenic tours',
    vehicleType: 'boat',
    capacity: 12,
    pricePerHour: 150,
    pricePerKm: 5,
    includesDriver: true
  },
  {
    id: '6',
    name: 'Shuttle Service',
    description: 'Reliable shuttle for airport transfers and group transportation',
    vehicleType: 'bus',
    capacity: 20,
    pricePerHour: 90,
    pricePerKm: 2.5,
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

export type TemplateType = 'meals' | 'activities' | 'transport' | 'stay';

export interface TemplatesState {
  meals: MealTemplate[];
  activities: ActivityTemplate[];
  transport: TransportTemplate[];
  stay: StayTemplate[];
}

export const useTemplates = () => {
  const [templates, setTemplates] = useState<TemplatesState>({
    meals: mockMeals,
    activities: mockActivities,
    transport: mockTransport,
    stay: mockStay
  });

  const [menus, setMenus] = useState<Menu[]>(mockMenus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized template counts
  const templateCounts = useMemo(() => ({
    meals: templates.meals.length,
    activities: templates.activities.length,
    transport: templates.transport.length,
    stay: templates.stay.length,
    menus: menus.length
  }), [templates, menus]);

  const generateTemplateId = useCallback(() => {
    return Date.now().toString();
  }, []);

  const addTemplate = useCallback(<T extends MealTemplate | ActivityTemplate | TransportTemplate | StayTemplate>(
    type: TemplateType, 
    template: Omit<T, 'id'>
  ) => {
    try {
      const newTemplate = { ...template, id: generateTemplateId() } as T;
    setTemplates(prev => ({
      ...prev,
        [type]: [...prev[type], newTemplate]
      }));
      return newTemplate;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to add ${type} template`;
      setError(errorMessage);
      console.error(`Error adding ${type} template:`, err);
      return null;
    }
  }, [generateTemplateId]);

  const updateTemplate = useCallback(<T extends MealTemplate | ActivityTemplate | TransportTemplate | StayTemplate>(
    type: TemplateType, 
    id: string, 
    updated: Partial<T>
  ) => {
    try {
    setTemplates(prev => ({
      ...prev,
        [type]: (prev[type] as T[]).map(item => 
        item.id === id ? { ...item, ...updated } : item
      )
    }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to update ${type} template`;
      setError(errorMessage);
      console.error(`Error updating ${type} template:`, err);
    }
  }, []);

  const deleteTemplate = useCallback((type: TemplateType, id: string) => {
    try {
    setTemplates(prev => ({
      ...prev,
        [type]: (prev[type] as any[]).filter(item => item.id !== id)
    }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to delete ${type} template`;
      setError(errorMessage);
      console.error(`Error deleting ${type} template:`, err);
    }
  }, []);

  const addMenu = useCallback((menu: Omit<Menu, 'id'>) => {
    try {
      const newMenu = { ...menu, id: generateTemplateId() };
      setMenus(prev => [...prev, newMenu]);
      return newMenu;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add menu';
      setError(errorMessage);
      console.error('Error adding menu:', err);
      return null;
    }
  }, [generateTemplateId]);

  const updateMenu = useCallback((id: string, updated: Partial<Menu>) => {
    try {
    setMenus(prev => prev.map(menu => menu.id === id ? { ...menu, ...updated } : menu));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update menu';
      setError(errorMessage);
      console.error('Error updating menu:', err);
    }
  }, []);

  const deleteMenu = useCallback((id: string) => {
    try {
    setMenus(prev => prev.filter(menu => menu.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete menu';
      setError(errorMessage);
      console.error('Error deleting menu:', err);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    templates,
    menus,
    templateCounts,
    isLoading,
    error,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    addMenu,
    updateMenu,
    deleteMenu,
    clearError
  };
};
