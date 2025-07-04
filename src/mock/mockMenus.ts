import { Menu } from '../types/Menu';

export const mockMenus: Menu[] = [
  {
    id: 'm1',
    name: 'Menú Asado Tradicional',
    selectedFoods: ['f1', 'f2'], // Empanadas + Asado
    description: 'Menú tradicional argentino con empanadas de entrada y asado completo',
    type: 'lunch',
    pricePerPerson: 35,
    minPeople: 8,
    maxPeople: 50,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    items: [], // Initialize empty items array
    restaurant: 'Parrilla Don Carlos'
  },
  {
    id: 'm2',
    name: 'Menú Familiar',
    selectedFoods: ['f3', 'f4'], // Milanesa + Pizza
    description: 'Menú perfecto para familias con milanesas napolitanas y pizza argentina',
    type: 'dinner',
    pricePerPerson: 28,
    minPeople: 4,
    maxPeople: 20,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    items: [], // Initialize empty items array
    restaurant: 'La Trattoria Familiar'
  },
  {
    id: 'm3',
    name: 'Menú Ejecutivo',
    selectedFoods: ['f1', 'f5'], // Empanadas + Locro
    description: 'Menú ejecutivo con entrada de empanadas y locro argentino principal',
    type: 'lunch',
    pricePerPerson: 32,
    minPeople: 6,
    maxPeople: 30,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    items: [], // Initialize empty items array
    restaurant: 'Restaurant El Ejecutivo'
  },
  {
    id: 'm4',
    name: 'Menú Premium BBQ',
    selectedFoods: ['f1', 'f2'],
    description: 'Experiencia premium de parrilla con cortes selectos y maridaje de vinos',
    type: 'dinner',
    pricePerPerson: 65,
    minPeople: 10,
    maxPeople: 40,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    items: [
      { id: 'i1', name: 'Bife de Chorizo Premium', description: 'Corte premium a la parrilla', price: 25, category: 'main' },
      { id: 'i2', name: 'Empanadas Gourmet', description: 'Empanadas artesanales variadas', price: 8, category: 'appetizer' },
      { id: 'i3', name: 'Vino Malbec', description: 'Copa de Malbec premium', price: 12, category: 'beverage' }
    ],
    restaurant: 'Parrilla Premium'
  },
  {
    id: 'm5',
    name: 'Menú Cocktail',
    selectedFoods: ['f3'],
    description: 'Selección de canapés y bebidas para eventos cocktail',
    type: 'cocktail',
    pricePerPerson: 22,
    minPeople: 15,
    maxPeople: 100,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    items: [
      { id: 'i4', name: 'Canapés Variados', description: 'Selección de canapés gourmet', price: 12, category: 'appetizer' },
      { id: 'i5', name: 'Copa de Espumante', description: 'Brindis con espumante nacional', price: 10, category: 'beverage' }
    ],
    restaurant: 'Catering Premium'
  }
]; 