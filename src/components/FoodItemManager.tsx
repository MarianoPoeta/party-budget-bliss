import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import FoodItemForm from './FoodItemForm';

interface FoodItem {
  id: string;
  name: string;
  description: string;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage' | 'special';
  price: number;
  allergens: string[];
  dietaryInfo: string[];
  guestsPerUnit: number;
  maxUnits?: number;
  isActive: boolean;
}

const FoodItemManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([
    {
      id: '1',
      name: 'Empanadas Argentinas',
      description: 'Empanadas tradicionales de carne, pollo o verdura',
      category: 'appetizer',
      price: 15.00,
      allergens: ['gluten'],
      dietaryInfo: ['disponible sin gluten'],
      guestsPerUnit: 3,
      maxUnits: 20,
      isActive: true
    },
    {
      id: '2',
      name: 'Asado Completo',
      description: 'Parrillada completa con chorizo, morcilla, vacío y pollo',
      category: 'main',
      price: 45.00,
      allergens: [],
      dietaryInfo: ['sin gluten'],
      guestsPerUnit: 1,
      maxUnits: 50,
      isActive: true
    }
  ]);

  const handleCreateNew = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: FoodItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleSubmit = (foodItem: FoodItem) => {
    if (editingItem) {
      setFoodItems(prev => prev.map(item => 
        item.id === editingItem.id ? foodItem : item
      ));
    } else {
      setFoodItems(prev => [...prev, foodItem]);
    }
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    setFoodItems(prev => prev.filter(item => item.id !== id));
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      appetizer: 'bg-orange-100 text-orange-800',
      main: 'bg-red-100 text-red-800',
      dessert: 'bg-pink-100 text-pink-800',
      beverage: 'bg-blue-100 text-blue-800',
      special: 'bg-purple-100 text-purple-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Productos Alimentarios</h2>
          <p className="text-gray-600">Administra los productos alimentarios para los menús</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <CardTitle>Productos Alimentarios</CardTitle>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="appetizer">Entradas</SelectItem>
                  <SelectItem value="main">Principales</SelectItem>
                  <SelectItem value="dessert">Postres</SelectItem>
                  <SelectItem value="beverage">Bebidas</SelectItem>
                  <SelectItem value="special">Especiales</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <Badge className={getCategoryColor(item.category)}>
                        {item.category === 'appetizer' && 'Entrada'}
                        {item.category === 'main' && 'Principal'}
                        {item.category === 'dessert' && 'Postre'}
                        {item.category === 'beverage' && 'Bebida'}
                        {item.category === 'special' && 'Especial'}
                      </Badge>
                      <Badge variant={item.isActive ? "default" : "secondary"}>
                        {item.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{item.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div><strong>Precio:</strong> ${item.price.toFixed(2)}</div>
                      <div><strong>Por:</strong> {item.guestsPerUnit} persona{item.guestsPerUnit > 1 ? 's' : ''}</div>
                      <div><strong>Máximo:</strong> {item.maxUnits || 'Sin límite'}</div>
                      <div><strong>Precio p/p:</strong> ${(item.price / item.guestsPerUnit).toFixed(2)}</div>
                    </div>
                    {(item.allergens.length > 0 || item.dietaryInfo.length > 0) && (
                      <div className="mt-3">
                        {item.allergens.length > 0 && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-red-600">Alérgenos:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.allergens.map((allergen, index) => (
                                <Badge key={index} variant="destructive" className="text-xs">
                                  {allergen}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {item.dietaryInfo.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-green-600">Info Dietética:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.dietaryInfo.map((info, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {info}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {filteredItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron productos que coincidan con los filtros.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <FoodItemForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        foodItem={editingItem}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default FoodItemManager; 