import { Product } from '../types/Product';

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Beef Ribs',
    description: 'Premium beef ribs for asado',
    category: 'food',
    price: 25.00,
    unit: 'kg',
    stock: 50,
    supplier: 'Carnes Premium',
    notes: 'Order 24h in advance',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'p2',
    name: 'Charcoal',
    description: 'High-quality charcoal for grilling',
    category: 'equipment',
    price: 15.00,
    unit: 'bags',
    stock: 100,
    supplier: 'BBQ Supplies',
    notes: 'Get 2 bags minimum',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'p3',
    name: 'Red Wine',
    description: 'Premium red wine for dinner',
    category: 'food',
    price: 18.00,
    unit: 'bottles',
    stock: 75,
    supplier: 'Wine & Spirits',
    notes: 'Aged 2 years',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'p4',
    name: 'Transport Van',
    description: '12-passenger van for group transport',
    category: 'transport',
    price: 150.00,
    unit: 'day',
    stock: 5,
    supplier: 'City Transport',
    notes: 'Includes driver',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'p5',
    name: 'Paintball Equipment',
    description: 'Complete paintball gear set',
    category: 'equipment',
    price: 45.00,
    unit: 'set',
    stock: 20,
    supplier: 'Adventure Gear',
    notes: 'Includes mask and gun',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]; 