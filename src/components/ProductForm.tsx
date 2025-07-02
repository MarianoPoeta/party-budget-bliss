import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Product {
  id: string;
  name: string;
  description?: string;
  category: 'meat' | 'vegetables' | 'beverages' | 'condiments' | 'equipment' | 'decorations' | 'other';
  unit: 'kg' | 'units' | 'liters' | 'pieces' | 'boxes' | 'bags' | 'bottles';
  estimatedPrice: number;
  supplier?: string;
  notes?: string;
  isActive: boolean;
}

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSubmit: (product: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  product,
  onSubmit
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    category: 'other',
    unit: 'units',
    estimatedPrice: 0,
    supplier: '',
    notes: '',
    isActive: true
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'other',
        unit: 'units',
        estimatedPrice: 0,
        supplier: '',
        notes: '',
        isActive: true
      });
    }
  }, [product, isOpen]);

  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.estimatedPrice !== undefined) {
      onSubmit({
        id: product?.id || Date.now().toString(),
        ...formData as Product
      });
      onClose();
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      meat: 'Carnes',
      vegetables: 'Verduras',
      beverages: 'Bebidas',
      condiments: 'Condimentos',
      equipment: 'Equipamiento',
      decorations: 'Decoraciones',
      other: 'Otros'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getUnitLabel = (unit: string) => {
    const labels = {
      kg: 'Kilogramos',
      units: 'Unidades',
      liters: 'Litros',
      pieces: 'Piezas',
      boxes: 'Cajas',
      bags: 'Bolsas',
      bottles: 'Botellas'
    };
    return labels[unit as keyof typeof labels] || unit;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Editar Producto' : 'Nuevo Producto'}
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
              <Label htmlFor="supplier">Proveedor</Label>
              <Input
                id="supplier"
                value={formData.supplier || ''}
                onChange={(e) => handleInputChange('supplier', e.target.value)}
                placeholder="Nombre del proveedor"
              />
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
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meat">Carnes</SelectItem>
                  <SelectItem value="vegetables">Verduras</SelectItem>
                  <SelectItem value="beverages">Bebidas</SelectItem>
                  <SelectItem value="condiments">Condimentos</SelectItem>
                  <SelectItem value="equipment">Equipamiento</SelectItem>
                  <SelectItem value="decorations">Decoraciones</SelectItem>
                  <SelectItem value="other">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unidad *</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => handleInputChange('unit', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar unidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilogramos</SelectItem>
                  <SelectItem value="units">Unidades</SelectItem>
                  <SelectItem value="liters">Litros</SelectItem>
                  <SelectItem value="pieces">Piezas</SelectItem>
                  <SelectItem value="boxes">Cajas</SelectItem>
                  <SelectItem value="bags">Bolsas</SelectItem>
                  <SelectItem value="bottles">Botellas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedPrice">Precio Estimado *</Label>
              <Input
                id="estimatedPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.estimatedPrice || ''}
                onChange={(e) => handleInputChange('estimatedPrice', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Notas adicionales sobre el producto..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {product ? 'Actualizar' : 'Crear'} Producto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
  };

export default ProductForm; 