import { Food } from '../types/Food';

export const mockFoodItems: Food[] = [
  {
    id: 'f1',
    name: 'Empanadas Argentinas',
    pricePerGuest: 8.5,
    guestsPerUnit: 1,
    selectedProducts: ['p1', 'p3'],
    description: 'Empanadas tradicionales argentinas con carne, cebolla y especias',
    category: 'meat',
    pricePerUnit: 8.5,
    unit: 'portions',
    allergens: ['gluten'],
    dietaryInfo: [],
    nutritionalInfo: {
      calories: 320,
      protein: 18,
      carbs: 35,
      fat: 12
    },
    preparationTime: 45,
    storageRequirements: 'Refrigerar hasta su consumo',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'f2',
    name: 'Asado Completo',
    pricePerGuest: 22.0,
    guestsPerUnit: 1,
    selectedProducts: ['p1', 'p2'],
    description: 'Asado argentino tradicional con cortes premium y chimichurri',
    category: 'meat',
    pricePerUnit: 22.0,
    unit: 'portions',
    allergens: [],
    dietaryInfo: [],
    nutritionalInfo: {
      calories: 650,
      protein: 45,
      carbs: 5,
      fat: 28
    },
    preparationTime: 180,
    storageRequirements: 'Carne fresca, mantener en frío',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'f3',
    name: 'Milanesa Napolitana',
    pricePerGuest: 15.0,
    guestsPerUnit: 1,
    selectedProducts: ['p1'],
    description: 'Milanesa de ternera con jamón, queso y salsa de tomate',
    category: 'meat',
    pricePerUnit: 15.0,
    unit: 'portions',
    allergens: ['gluten', 'dairy', 'eggs'],
    dietaryInfo: [],
    nutritionalInfo: {
      calories: 580,
      protein: 38,
      carbs: 25,
      fat: 35
    },
    preparationTime: 60,
    storageRequirements: 'Refrigerar, consumir en 24h',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'f4',
    name: 'Pizza Argentina',
    pricePerGuest: 12.0,
    guestsPerUnit: 2,
    selectedProducts: ['p1'],
    description: 'Pizza estilo argentino con muzarela, jamón y aceitunas',
    category: 'dairy',
    pricePerUnit: 24.0,
    unit: 'pieces',
    allergens: ['gluten', 'dairy'],
    dietaryInfo: [],
    nutritionalInfo: {
      calories: 450,
      protein: 20,
      carbs: 55,
      fat: 18
    },
    preparationTime: 30,
    storageRequirements: 'Consumir caliente',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'f5',
    name: 'Locro Argentino',
    pricePerGuest: 18.0,
    guestsPerUnit: 1,
    selectedProducts: ['p1'],
    description: 'Guiso tradicional argentino con zapallo, maíz, carne y chorizo',
    category: 'meat',
    pricePerUnit: 18.0,
    unit: 'portions',
    allergens: [],
    dietaryInfo: [],
    nutritionalInfo: {
      calories: 520,
      protein: 25,
      carbs: 45,
      fat: 22
    },
    preparationTime: 120,
    storageRequirements: 'Se puede congelar hasta 1 mes',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export default mockFoodItems; 