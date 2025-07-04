import React, { useState } from 'react';
import { Menu, MenuItem } from '../types/Menu';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Plus, X, ChefHat, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MenuFormProps {
  menu?: Menu;
  onSubmit: (menu: Menu) => void;
  onCancel?: () => void;
}

const MenuForm: React.FC<MenuFormProps> = ({ menu, onSubmit, onCancel }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Menu>(
    menu ? {
      ...menu,
      items: menu.items || []  // Ensure items is always an array
    } : {
      id: '',
      name: '',
      selectedFoods: [],
      description: '',
      type: 'dinner',
      pricePerPerson: 0,
      minPeople: 1,
      maxPeople: 100,
      items: [],
      restaurant: '',
      isActive: true,
    }
  );

  const categoryColors = {
    appetizer: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    main: 'bg-blue-50 text-blue-700 border-blue-200',
    dessert: 'bg-pink-50 text-pink-700 border-pink-200',
    beverage: 'bg-amber-50 text-amber-700 border-amber-200',
    special: 'bg-violet-50 text-violet-700 border-violet-200',
  };

  const handleInputChange = (field: keyof Menu, value: string | number | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addMenuItem = () => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: '',
      description: '',
      price: 0,
      category: 'main'
    };
    setFormData(prev => ({
      ...prev,
      items: [...(prev.items || []), newItem]  // Ensure items is always an array
    }));
  };

  const updateMenuItem = (itemId: string, updates: Partial<MenuItem>) => {
    setFormData(prev => ({
      ...prev,
      items: (prev.items || []).map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    }));
  };

  const removeMenuItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      items: (prev.items || []).filter(item => item.id !== itemId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id) {
      formData.id = Date.now().toString();
    }
    onSubmit(formData);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/menus');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {menu ? 'Edit Menu' : 'Create New Menu'}
            </h1>
            <p className="text-slate-600 mt-1">
              {menu ? 'Update your menu details' : 'Design a new menu for your events'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ChefHat className="h-8 w-8 text-slate-600" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Información Básica</CardTitle>
            <p className="text-slate-600">Configura los detalles fundamentales de tu menú</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">Nombre del Menú *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="ej., Cena Premium de Boda"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="type" className="text-sm font-medium">Tipo de Menú *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Desayuno</SelectItem>
                    <SelectItem value="lunch">Almuerzo</SelectItem>
                    <SelectItem value="dinner">Cena</SelectItem>
                    <SelectItem value="brunch">Brunch</SelectItem>
                    <SelectItem value="cocktail">Cóctel</SelectItem>
                    <SelectItem value="catering">Catering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="restaurant" className="text-sm font-medium">Restaurante *</Label>
                <Input
                  id="restaurant"
                  value={formData.restaurant}
                  onChange={(e) => handleInputChange('restaurant', e.target.value)}
                  placeholder="Nombre del restaurante"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="pricePerPerson" className="text-sm font-medium">Precio por Persona ($) *</Label>
                <Input
                  id="pricePerPerson"
                  type="number"
                  value={formData.pricePerPerson}
                  onChange={(e) => handleInputChange('pricePerPerson', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="minPeople" className="text-sm font-medium">Mínimo de Personas *</Label>
                <Input
                  id="minPeople"
                  type="number"
                  value={formData.minPeople}
                  onChange={(e) => handleInputChange('minPeople', parseInt(e.target.value) || 1)}
                  placeholder="1"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="maxPeople" className="text-sm font-medium">Máximo de Personas *</Label>
                <Input
                  id="maxPeople"
                  type="number"
                  value={formData.maxPeople}
                  onChange={(e) => handleInputChange('maxPeople', parseInt(e.target.value) || 1)}
                  placeholder="100"
                  className="mt-1"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-medium">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe tu menú y qué lo hace especial..."
                rows={4}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-slate-900">Elementos del Menú</CardTitle>
                <p className="text-slate-600">Agrega los platos y bebidas a tu menú</p>
              </div>
              <Button 
                type="button"
                onClick={addMenuItem}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Elemento
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {formData.items.length === 0 ? (
              <div className="text-center py-12">
                <ChefHat className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Aún no hay elementos</h3>
                <p className="text-slate-600 mb-4">Comienza a construir tu menú agregando algunos elementos deliciosos</p>
                <Button 
                  type="button"
                  onClick={addMenuItem}
                  variant="outline"
                  className="border-slate-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Primer Elemento
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {formData.items.map((item, index) => (
                  <div key={item.id} className="border border-slate-200 rounded-lg p-6 bg-slate-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-slate-900">Elemento {index + 1}</h4>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeMenuItem(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Nombre *</Label>
                        <Input
                          value={item.name}
                          onChange={(e) => updateMenuItem(item.id, { name: e.target.value })}
                          placeholder="Nombre del elemento"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Categoría</Label>
                        <Select value={item.category} onValueChange={(value) => updateMenuItem(item.id, { category: value as MenuItem['category'] })}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="appetizer">Aperitivo</SelectItem>
                            <SelectItem value="main">Principal</SelectItem>
                            <SelectItem value="dessert">Postre</SelectItem>
                            <SelectItem value="beverage">Bebida</SelectItem>
                            <SelectItem value="special">Especial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Precio ($)</Label>
                        <Input
                          type="number"
                          value={item.price}
                          onChange={(e) => updateMenuItem(item.id, { price: parseFloat(e.target.value) || 0 })}
                          placeholder="0.00"
                          className="mt-1"
                        />
                      </div>
                      <div className="flex items-end">
                        <Badge className={`${categoryColors[item.category]} font-medium`}>
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Label className="text-sm font-medium">Descripción</Label>
                      <Textarea
                        value={item.description}
                        onChange={(e) => updateMenuItem(item.id, { description: e.target.value })}
                        placeholder="Describe este elemento..."
                        rows={2}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Menu Status */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Menu Status</CardTitle>
            <p className="text-slate-600">Control the availability of this menu</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
              />
              <Label htmlFor="isActive" className="text-sm font-medium">
                Active Menu
              </Label>
            </div>
            <p className="text-sm text-slate-500 mt-2">
              Active menus are available for selection in budget creation
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            size="lg"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            className="bg-slate-800 hover:bg-slate-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {menu ? 'Update Menu' : 'Create Menu'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MenuForm;
