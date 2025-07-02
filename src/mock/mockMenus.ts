import { Menu } from '../types/Menu';

export const mockMenus: Menu[] = [
  {
    id: 'm1',
    name: 'Wedding Feast',
    description: 'Elegant 3-course meal perfect for special occasions',
    type: 'dinner',
    pricePerPerson: 45,
    minPeople: 10,
    maxPeople: 50,
    restaurant: 'Grand Palace Restaurant',
    items: [
      { id: '1', name: 'Beef Tenderloin', quantity: 1, unit: 'portion', pricePerUnit: 25, notes: 'Medium rare' },
      { id: '2', name: 'Grilled Salmon', quantity: 1, unit: 'portion', pricePerUnit: 20, notes: 'With herbs' },
      { id: '3', name: 'Chocolate Cake', quantity: 1, unit: 'slice', pricePerUnit: 8, notes: 'Decadent dessert' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'm2',
    name: 'Corporate Lunch',
    description: 'Professional buffet-style lunch for business events',
    type: 'lunch',
    pricePerPerson: 25,
    minPeople: 5,
    maxPeople: 100,
    restaurant: 'Business Center Catering',
    items: [
      { id: '4', name: 'Caesar Salad', quantity: 1, unit: 'portion', pricePerUnit: 12, notes: 'Fresh greens' },
      { id: '5', name: 'Chicken Breast', quantity: 1, unit: 'portion', pricePerUnit: 15, notes: 'Grilled' },
      { id: '6', name: 'Coffee & Tea', quantity: 1, unit: 'cup', pricePerUnit: 3, notes: 'Unlimited refills' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'm3',
    name: 'Bachelor Party BBQ',
    description: 'Casual outdoor BBQ perfect for bachelor parties',
    type: 'dinner',
    pricePerPerson: 35,
    minPeople: 8,
    maxPeople: 30,
    restaurant: 'Outdoor BBQ Co.',
    items: [
      { id: '7', name: 'Beef Ribs', quantity: 1, unit: 'rack', pricePerUnit: 20, notes: 'Smoked' },
      { id: '8', name: 'Grilled Vegetables', quantity: 1, unit: 'portion', pricePerUnit: 8, notes: 'Seasonal' },
      { id: '9', name: 'Beer', quantity: 2, unit: 'bottles', pricePerUnit: 4, notes: 'Local craft beer' }
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]; 