import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Plus, X } from 'lucide-react';

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

interface FoodItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  foodItem?: FoodItem | null;
  onSubmit: (foodItem: FoodItem) => void;
}

const FoodItemForm: React.FC<FoodItemFormProps> = ({
  isOpen,
  onClose,
  foodItem,
  onSubmit
}) => {
  const [formData, setFormData] = useState<Partial<FoodItem>>({
    name: '',
    description: '',
    category: 'main',
    price: 0,
    allergens: [],
    dietaryInfo: [],
    guestsPerUnit: 1,
    maxUnits: undefined,
    isActive: true
  });

  const [newAllergen, setNewAllergen] = useState('');
  const [newDietaryInfo, setNewDietaryInfo] = useState('');

  useEffect(() => {
    if (foodItem) {
      setFormData(foodItem);
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'main',
        price: 0,
        allergens: [],
        dietaryInfo: [],
        guestsPerUnit: 1,
        maxUnits: undefined,
        isActive: true
      });
    }
  }, [foodItem, isOpen]);

  const handleInputChange = (field: keyof FoodItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.price !== undefined) {
      onSubmit({
        id: foodItem?.id || Date.now().toString(),
        ...formData as FoodItem
      });
      onClose();
    }
  };

  const addAllergen = () => {
    if (newAllergen.trim() && !formData.allergens?.includes(newAllergen.trim())) {
      setFormData(prev => ({
        ...prev,
        allergens: [...(prev.allergens || []), newAllergen.trim()]
      }));
      setNewAllergen('');
    }
  };

  const removeAllergen = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens?.filter(a => a !== allergen) || []
    }));
  };

  const addDietaryInfo = () => {
    if (newDietaryInfo.trim() && !formData.dietaryInfo?.includes(newDietaryInfo.trim())) {
      setFormData(prev => ({
        ...prev,
        dietaryInfo: [...(prev.dietaryInfo || []), newDietaryInfo.trim()]
      }));
      setNewDietaryInfo('');
    }
  };

  const removeDietaryInfo = (info: string) => {
    setFormData(prev => ({
      ...prev,
      dietaryInfo: prev.dietaryInfo?.filter(d => d !== info) || []
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {foodItem ? 'Editar Producto Alimentario' : 'Nuevo Producto Alimentario'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nombre del producto"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appetizer">Entrada</SelectItem>
                  <SelectItem value="main">Plato Principal</SelectItem>
                  <SelectItem value="dessert">Postre</SelectItem>
                  <SelectItem value="beverage">Bebida</SelectItem>
                  <SelectItem value="special">Especial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descripción del producto..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Precio *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price || ''}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guestsPerUnit">Huéspedes por Unidad *</Label>
              <Input
                id="guestsPerUnit"
                type="number"
                min="1"
                value={formData.guestsPerUnit || ''}
                onChange={(e) => handleInputChange('guestsPerUnit', parseInt(e.target.value) || 1)}
                placeholder="1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxUnits">Máx. Unidades</Label>
              <Input
                id="maxUnits"
                type="number"
                min="1"
                value={formData.maxUnits || ''}
                onChange={(e) => handleInputChange('maxUnits', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Sin límite"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Alérgenos</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newAllergen}
                onChange={(e) => setNewAllergen(e.target.value)}
                placeholder="Agregar alérgeno..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergen())}
              />
              <Button type="button" onClick={addAllergen} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.allergens?.map((allergen, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer">
                  {allergen}
                  <X 
                    className="h-3 w-3 ml-1" 
                    onClick={() => removeAllergen(allergen)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Información Dietética</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newDietaryInfo}
                onChange={(e) => setNewDietaryInfo(e.target.value)}
                placeholder="Agregar información dietética..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDietaryInfo())}
              />
              <Button type="button" onClick={addDietaryInfo} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.dietaryInfo?.map((info, index) => (
                <Badge key={index} variant="outline" className="cursor-pointer">
                  {info}
                  <X 
                    className="h-3 w-3 ml-1" 
                    onClick={() => removeDietaryInfo(info)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {foodItem ? 'Actualizar' : 'Crear'} Producto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FoodItemForm; 