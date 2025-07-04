import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Plus, 
  Search, 
  ChefHat, 
  Edit, 
  Trash2,
  Filter,
  ArrowLeft,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Food } from '../types/Food';

// Foods page for managing food items
const Foods: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, foods, deleteFood } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [showForm, setShowForm] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);

  // Check admin access
  if (currentUser?.role !== 'admin') {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <ChefHat className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Acceso Restringido</h2>
              <p className="text-slate-600 mb-4">
                Solo los administradores pueden gestionar las comidas.
              </p>
              <Button onClick={() => navigate('/dashboard')}>
                Volver al Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleCreateNew = () => {
    setEditingFood(null);
    setShowForm(true);
  };

  const handleEdit = (food: Food) => {
    setEditingFood(food);
    setShowForm(true);
  };

  const handleSave = () => {
    // TODO: Implement save logic
    setShowForm(false);
    setEditingFood(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingFood(null);
  };

  const handleDelete = (foodId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta comida?')) {
      deleteFood(foodId);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      meat: 'bg-red-100 text-red-800',
      seafood: 'bg-blue-100 text-blue-800',
      vegetables: 'bg-green-100 text-green-800',
      grains: 'bg-yellow-100 text-yellow-800',
      dairy: 'bg-purple-100 text-purple-800',
      fruits: 'bg-pink-100 text-pink-800',
      beverages: 'bg-cyan-100 text-cyan-800',
      spices: 'bg-orange-100 text-orange-800',
      desserts: 'bg-indigo-100 text-indigo-800',
      other: 'bg-slate-100 text-slate-800'
    };
    return colors[category] || colors.other;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      meat: 'Carnes',
      seafood: 'Mariscos',
      vegetables: 'Vegetales',
      grains: 'Granos',
      dairy: 'Lácteos',
      fruits: 'Frutas',
      beverages: 'Bebidas',
      spices: 'Especias',
      desserts: 'Postres',
      other: 'Otros'
    };
    return labels[category] || category;
  };

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         food.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || food.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (showForm) {
    return <FoodForm food={editingFood} onSave={handleSave} onCancel={handleCancel} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/configuration')}
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Configuración
          </Button>
          <div className="h-4 w-px bg-slate-300" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestión de Comidas</h1>
            <p className="text-slate-600">Administra las comidas preparadas disponibles para crear menús</p>
          </div>
        </div>
        <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Comida
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Comidas</p>
                <p className="text-2xl font-bold text-slate-900">{foods.length}</p>
              </div>
              <ChefHat className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Activos</p>
                <p className="text-2xl font-bold text-green-600">{foods.filter(f => f.isActive).length}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="h-3 w-3 bg-green-600 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Categorías</p>
                <p className="text-2xl font-bold text-purple-600">
                  {new Set(foods.map(f => f.category)).size}
                </p>
              </div>
              <Filter className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Con Alérgenos</p>
                <p className="text-2xl font-bold text-orange-600">
                  {foods.filter(f => f.allergens && f.allergens.length > 0).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar comidas por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Categorías</SelectItem>
                <SelectItem value="meat">Carnes</SelectItem>
                <SelectItem value="seafood">Mariscos</SelectItem>
                <SelectItem value="vegetables">Vegetales</SelectItem>
                <SelectItem value="grains">Granos</SelectItem>
                <SelectItem value="dairy">Lácteos</SelectItem>
                <SelectItem value="fruits">Frutas</SelectItem>
                <SelectItem value="beverages">Bebidas</SelectItem>
                <SelectItem value="spices">Especias</SelectItem>
                <SelectItem value="desserts">Postres</SelectItem>
                <SelectItem value="other">Otros</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nombre</SelectItem>
                <SelectItem value="category">Categoría</SelectItem>
                <SelectItem value="price">Precio</SelectItem>
                <SelectItem value="created">Fecha de Creación</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Foods List */}
      <div className="space-y-4">
        {isLoading && <LoadingSpinner text="Cargando alimentos..." />}
        
        {filteredFoods.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ChefHat className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No se encontraron comidas</h3>
              <p className="text-slate-600 mb-4">
                {searchTerm || categoryFilter !== 'all' 
                  ? 'Intenta ajustar tu búsqueda o filtros' 
                  : 'Comienza agregando comidas preparadas para crear menús'
                }
              </p>
              {!searchTerm && categoryFilter === 'all' && (
                <Button onClick={handleCreateNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primera Comida
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredFoods.map((food) => (
              <Card key={food.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-slate-900 mb-1">
                        {food.name}
                      </CardTitle>
                      {food.description && (
                        <p className="text-sm text-slate-600">{food.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(food)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(food.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Category and Status */}
                    <div className="flex items-center justify-between">
                      <Badge className={getCategoryColor(food.category)}>
                        {getCategoryLabel(food.category)}
                      </Badge>
                      {food.isActive && (
                        <Badge variant="outline" className="text-green-600">
                          Activo
                        </Badge>
                      )}
                    </div>

                    {/* Price and Unit */}
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <div className="text-2xl font-bold text-slate-900">
                        ${food.pricePerUnit.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-600">por {food.unit}</div>
                    </div>

                    {/* Allergens */}
                    {food.allergens && food.allergens.length > 0 && (
                      <div>
                        <div className="text-xs font-medium text-slate-700 mb-1">Alérgenos:</div>
                        <div className="flex flex-wrap gap-1">
                          {food.allergens.map((allergen, index) => (
                            <Badge 
                              key={index} 
                              variant="destructive" 
                              className="text-xs"
                            >
                              {allergen}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Dietary Info */}
                    {food.dietaryInfo && food.dietaryInfo.length > 0 && (
                      <div>
                        <div className="text-xs font-medium text-slate-700 mb-1">Información Dietética:</div>
                        <div className="flex flex-wrap gap-1">
                          {food.dietaryInfo.map((info, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="text-xs"
                            >
                              {info}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Preparation Time */}
                    {food.preparationTime && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="h-4 w-4" />
                        Tiempo de preparación: {food.preparationTime} min
                      </div>
                    )}

                    {/* Supplier */}
                    {food.supplier && (
                      <div className="text-sm text-slate-600">
                        <span className="font-medium">Proveedor:</span> {food.supplier}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Placeholder for FoodForm component
const FoodForm: React.FC<{ food: Food | null; onSave: () => void; onCancel: () => void }> = ({ 
  food, 
  onSave, 
  onCancel 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">
          {food ? 'Editar Comida' : 'Nueva Comida'}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={onSave}>
            Guardar
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <ChefHat className="h-12 w-12 mx-auto mb-4 text-slate-400" />
            <p className="text-slate-600">Formulario de comida en desarrollo...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Foods; 