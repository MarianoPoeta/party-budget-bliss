export interface FoodItem {
  id: string;
  name: string;
  description: string;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage' | 'special';
  basePrice: number;
  baseCost?: number;
  servingSize: string;
  guestsPerUnit: number;
  maxUnits?: number;
  allergens: string[];
  dietaryInfo: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const mockFoodItems: FoodItem[] = [
  {
    id: 'food-1',
    name: 'Empanadas Argentinas',
    description: 'Empanadas tradicionales de carne, pollo o verdura con masa casera',
    category: 'appetizer',
    basePrice: 15.00,
    baseCost: 8.50,
    servingSize: '3 unidades',
    guestsPerUnit: 1,
    maxUnits: 50,
    allergens: ['gluten', 'huevo'],
    dietaryInfo: ['disponible sin gluten', 'opción vegetariana'],
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'food-2',
    name: 'Asado Completo',
    description: 'Parrillada completa con chorizo, morcilla, vacío, pollo y acompañamientos',
    category: 'main',
    basePrice: 45.00,
    baseCost: 28.00,
    servingSize: '400g',
    guestsPerUnit: 1,
    maxUnits: 30,
    allergens: [],
    dietaryInfo: ['sin gluten', 'alto en proteína'],
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'food-3',
    name: 'Provoleta',
    description: 'Queso provolone a la parrilla con orégano y aceite de oliva',
    category: 'appetizer',
    basePrice: 12.00,
    baseCost: 7.00,
    servingSize: '150g',
    guestsPerUnit: 2,
    maxUnits: 20,
    allergens: ['lactosa'],
    dietaryInfo: ['vegetariano', 'sin gluten'],
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'food-4',
    name: 'Milanesa Napolitana',
    description: 'Milanesa de carne con jamón, queso y salsa de tomate',
    category: 'main',
    basePrice: 28.00,
    baseCost: 18.00,
    servingSize: '350g',
    guestsPerUnit: 1,
    maxUnits: 25,
    allergens: ['gluten', 'huevo', 'lactosa'],
    dietaryInfo: [],
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'food-5',
    name: 'Dulce de Leche con Flan',
    description: 'Flan casero con dulce de leche y crema chantilly',
    category: 'dessert',
    basePrice: 18.00,
    baseCost: 9.00,
    servingSize: '120g',
    guestsPerUnit: 1,
    maxUnits: 40,
    allergens: ['lactosa', 'huevo'],
    dietaryInfo: ['vegetariano'],
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'food-6',
    name: 'Vino Malbec',
    description: 'Vino tinto Malbec de Mendoza, 750ml',
    category: 'beverage',
    basePrice: 25.00,
    baseCost: 15.00,
    servingSize: '750ml',
    guestsPerUnit: 3,
    maxUnits: 20,
    allergens: ['sulfitos'],
    dietaryInfo: ['vegano', 'sin gluten'],
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'food-7',
    name: 'Choripán',
    description: 'Chorizo criollo en pan francés con chimichurri',
    category: 'main',
    basePrice: 14.00,
    baseCost: 8.50,
    servingSize: '1 unidad',
    guestsPerUnit: 1,
    maxUnits: 50,
    allergens: ['gluten'],
    dietaryInfo: [],
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'food-8',
    name: 'Ensalada Mixta',
    description: 'Ensalada de lechuga, tomate, cebolla, zanahoria y aceitunas',
    category: 'appetizer',
    basePrice: 8.00,
    baseCost: 4.50,
    servingSize: '150g',
    guestsPerUnit: 1,
    maxUnits: 30,
    allergens: [],
    dietaryInfo: ['vegano', 'sin gluten', 'bajo en calorías'],
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'food-9',
    name: 'Agua Saborizada',
    description: 'Agua saborizada con gas, varios sabores',
    category: 'beverage',
    basePrice: 3.50,
    baseCost: 1.80,
    servingSize: '500ml',
    guestsPerUnit: 1,
    maxUnits: 100,
    allergens: [],
    dietaryInfo: ['vegano', 'sin gluten', 'sin azúcar'],
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'food-10',
    name: 'Menú Especial Quinceañera',
    description: 'Plato especial para quinceañeras con decoración temática',
    category: 'special',
    basePrice: 55.00,
    baseCost: 32.00,
    servingSize: 'plato completo',
    guestsPerUnit: 1,
    maxUnits: 15,
    allergens: ['gluten', 'lactosa', 'huevo'],
    dietaryInfo: ['disponible vegetariano'],
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
];

export default mockFoodItems; 