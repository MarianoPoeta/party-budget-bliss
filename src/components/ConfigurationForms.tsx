import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { X, Plus } from 'lucide-react';
import { useStore } from '../store';

interface ConfigurationFormProps {
  type: 'accommodation' | 'menu' | 'food' | 'product' | 'transport';
  item?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export const ConfigurationForm: React.FC<ConfigurationFormProps> = ({
  type,
  item,
  onSave,
  onCancel
}) => {
  const { foods, products } = useStore();
  
  // Initialize form data based on type
  const getInitialData = () => {
    if (item) return { ...item };
    
    switch (type) {
      case 'accommodation':
        return {
          name: '',
          address: '',
          costPerNight: '',
          pricePerNight: '',
          maxCapacity: '',
          isActive: true
        };
      case 'menu':
        return {
          name: '',
          selectedFoods: [],
          isActive: true
        };
      case 'food':
        return {
          name: '',
          pricePerGuest: '',
          guestsPerUnit: '',
          selectedProducts: [],
          isActive: true
        };
      case 'product':
        return {
          name: '',
          category: '',
          cost: '',
          unit: '',
          isActive: true
        };
      case 'transport':
        return {
          name: '',
          pricePerGuest: '',
          costToCompany: '',
          type: '',
          capacity: '',
          isActive: true
        };
      default:
        return {};
    }
  };

  const [formData, setFormData] = useState(getInitialData());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    switch (type) {
      case 'accommodation':
        if (!formData.name) newErrors.name = 'El nombre es requerido';
        if (!formData.address) newErrors.address = 'La dirección es requerida';
        if (!formData.costPerNight || formData.costPerNight <= 0) newErrors.costPerNight = 'El costo debe ser mayor a 0';
        if (!formData.pricePerNight || formData.pricePerNight <= 0) newErrors.pricePerNight = 'El precio debe ser mayor a 0';
        if (!formData.maxCapacity || formData.maxCapacity <= 0) newErrors.maxCapacity = 'La capacidad debe ser mayor a 0';
        break;
      case 'menu':
        if (!formData.name) newErrors.name = 'El nombre es requerido';
        if (!formData.selectedFoods || formData.selectedFoods.length === 0) newErrors.selectedFoods = 'Debe seleccionar al menos una comida';
        break;
      case 'food':
        if (!formData.name) newErrors.name = 'El nombre es requerido';
        if (!formData.pricePerGuest || formData.pricePerGuest <= 0) newErrors.pricePerGuest = 'El precio debe ser mayor a 0';
        if (!formData.guestsPerUnit || formData.guestsPerUnit <= 0) newErrors.guestsPerUnit = 'Los huéspedes por unidad deben ser mayor a 0';
        break;
      case 'product':
        if (!formData.name) newErrors.name = 'El nombre es requerido';
        if (!formData.category) newErrors.category = 'La categoría es requerida';
        if (!formData.cost || formData.cost <= 0) newErrors.cost = 'El costo debe ser mayor a 0';
        if (!formData.unit) newErrors.unit = 'La unidad es requerida';
        break;
      case 'transport':
        if (!formData.name) newErrors.name = 'El nombre es requerido';
        if (!formData.pricePerGuest || formData.pricePerGuest <= 0) newErrors.pricePerGuest = 'El precio debe ser mayor a 0';
        if (!formData.costToCompany || formData.costToCompany <= 0) newErrors.costToCompany = 'El costo debe ser mayor a 0';
        if (!formData.type) newErrors.type = 'El tipo es requerido';
        if (!formData.capacity || formData.capacity <= 0) newErrors.capacity = 'La capacidad debe ser mayor a 0';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const submissionData = {
        ...formData,
        id: item?.id || `${type}_${Date.now()}`,
        createdAt: item?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Convert string numbers to actual numbers
        ...(type === 'accommodation' && {
          costPerNight: Number(formData.costPerNight),
          pricePerNight: Number(formData.pricePerNight),
          maxCapacity: Number(formData.maxCapacity)
        }),
        ...(type === 'food' && {
          pricePerGuest: Number(formData.pricePerGuest),
          guestsPerUnit: Number(formData.guestsPerUnit)
        }),
        ...(type === 'product' && {
          cost: Number(formData.cost)
        }),
        ...(type === 'transport' && {
          pricePerGuest: Number(formData.pricePerGuest),
          costToCompany: Number(formData.costToCompany),
          capacity: Number(formData.capacity)
        })
      };
      onSave(submissionData);
    }
  };

  const toggleFoodSelection = (foodId: string) => {
    const currentSelection = formData.selectedFoods || [];
    const newSelection = currentSelection.includes(foodId)
      ? currentSelection.filter((id: string) => id !== foodId)
      : [...currentSelection, foodId];
    handleInputChange('selectedFoods', newSelection);
  };

  const toggleProductSelection = (productId: string) => {
    const currentSelection = formData.selectedProducts || [];
    const newSelection = currentSelection.includes(productId)
      ? currentSelection.filter((id: string) => id !== productId)
      : [...currentSelection, productId];
    handleInputChange('selectedProducts', newSelection);
  };

  const renderAccommodationForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre del Alojamiento *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Ej: Hotel Grand Plaza"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div>
        <Label htmlFor="address">Dirección *</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="Dirección completa del alojamiento"
          className={errors.address ? 'border-red-500' : ''}
        />
        {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="costPerNight">Costo por Noche (para la empresa) *</Label>
          <Input
            id="costPerNight"
            type="number"
            value={formData.costPerNight}
            onChange={(e) => handleInputChange('costPerNight', e.target.value)}
            placeholder="0"
            className={errors.costPerNight ? 'border-red-500' : ''}
          />
          {errors.costPerNight && <p className="text-sm text-red-500 mt-1">{errors.costPerNight}</p>}
          <p className="text-xs text-slate-500 mt-1">Costo real que paga la empresa</p>
        </div>

        <div>
          <Label htmlFor="pricePerNight">Precio por Noche (para el cliente) *</Label>
          <Input
            id="pricePerNight"
            type="number"
            value={formData.pricePerNight}
            onChange={(e) => handleInputChange('pricePerNight', e.target.value)}
            placeholder="0"
            className={errors.pricePerNight ? 'border-red-500' : ''}
          />
          {errors.pricePerNight && <p className="text-sm text-red-500 mt-1">{errors.pricePerNight}</p>}
          <p className="text-xs text-slate-500 mt-1">Precio que se incluye en el presupuesto</p>
        </div>
      </div>

      <div>
        <Label htmlFor="maxCapacity">Capacidad Máxima de Huéspedes *</Label>
        <Input
          id="maxCapacity"
          type="number"
          value={formData.maxCapacity}
          onChange={(e) => handleInputChange('maxCapacity', e.target.value)}
          placeholder="0"
          className={errors.maxCapacity ? 'border-red-500' : ''}
        />
        {errors.maxCapacity && <p className="text-sm text-red-500 mt-1">{errors.maxCapacity}</p>}
      </div>
    </div>
  );

  const renderMenuForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre del Menú *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Ej: Menú Asado Argentino"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div>
        <Label>Comidas Incluidas *</Label>
        {errors.selectedFoods && <p className="text-sm text-red-500 mb-2">{errors.selectedFoods}</p>}
        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto border rounded-lg p-3">
          {foods.map((food) => (
            <div key={food.id} className="flex items-center space-x-2">
              <Checkbox
                id={`food-${food.id}`}
                checked={formData.selectedFoods?.includes(food.id)}
                onCheckedChange={() => toggleFoodSelection(food.id)}
              />
              <Label htmlFor={`food-${food.id}`} className="flex-1 cursor-pointer">
                <div className="flex justify-between items-center">
                  <span>{food.name}</span>
                  <span className="text-sm text-slate-500">${food.pricePerUnit}</span>
                </div>
              </Label>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Selecciona las comidas que formarán parte de este menú
        </p>
      </div>
    </div>
  );

  const renderFoodForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre de la Comida *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Ej: Pizza Margherita"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pricePerGuest">Precio por Huésped *</Label>
          <Input
            id="pricePerGuest"
            type="number"
            value={formData.pricePerGuest}
            onChange={(e) => handleInputChange('pricePerGuest', e.target.value)}
            placeholder="0"
            className={errors.pricePerGuest ? 'border-red-500' : ''}
          />
          {errors.pricePerGuest && <p className="text-sm text-red-500 mt-1">{errors.pricePerGuest}</p>}
          <p className="text-xs text-slate-500 mt-1">Precio que se incluye en el presupuesto</p>
        </div>

        <div>
          <Label htmlFor="guestsPerUnit">Huéspedes por Unidad *</Label>
          <Input
            id="guestsPerUnit"
            type="number"
            value={formData.guestsPerUnit}
            onChange={(e) => handleInputChange('guestsPerUnit', e.target.value)}
            placeholder="Ej: 2 (1 pizza para 2 personas)"
            className={errors.guestsPerUnit ? 'border-red-500' : ''}
          />
          {errors.guestsPerUnit && <p className="text-sm text-red-500 mt-1">{errors.guestsPerUnit}</p>}
          <p className="text-xs text-slate-500 mt-1">¿Para cuántas personas alcanza una unidad?</p>
        </div>
      </div>

      <div>
        <Label>Productos Necesarios (opcional)</Label>
        <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3 mt-2">
          {products.map((product) => (
            <div key={product.id} className="flex items-center space-x-2">
              <Checkbox
                id={`product-${product.id}`}
                checked={formData.selectedProducts?.includes(product.id)}
                onCheckedChange={() => toggleProductSelection(product.id)}
              />
              <Label htmlFor={`product-${product.id}`} className="flex-1 cursor-pointer">
                <div className="flex justify-between items-center">
                  <span>{product.name}</span>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
              </Label>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Selecciona los productos necesarios para preparar esta comida
        </p>
      </div>
    </div>
  );

  const renderProductForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre del Producto *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Ej: Harina de Trigo"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div>
        <Label htmlFor="category">Categoría *</Label>
        <Select 
          value={formData.category} 
          onValueChange={(value) => handleInputChange('category', value)}
        >
          <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="food">Alimentos</SelectItem>
            <SelectItem value="beverage">Bebidas</SelectItem>
            <SelectItem value="dairy">Lácteos</SelectItem>
            <SelectItem value="meat">Carnes</SelectItem>
            <SelectItem value="vegetables">Vegetales</SelectItem>
            <SelectItem value="spices">Especias</SelectItem>
            <SelectItem value="grains">Granos</SelectItem>
            <SelectItem value="cleaning">Limpieza</SelectItem>
            <SelectItem value="equipment">Equipamiento</SelectItem>
            <SelectItem value="other">Otros</SelectItem>
          </SelectContent>
        </Select>
        {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cost">Costo (para la empresa) *</Label>
          <Input
            id="cost"
            type="number"
            value={formData.cost}
            onChange={(e) => handleInputChange('cost', e.target.value)}
            placeholder="0"
            className={errors.cost ? 'border-red-500' : ''}
          />
          {errors.cost && <p className="text-sm text-red-500 mt-1">{errors.cost}</p>}
          <p className="text-xs text-slate-500 mt-1">Costo real de compra</p>
        </div>

        <div>
          <Label htmlFor="unit">Unidad de Medida *</Label>
          <Select 
            value={formData.unit} 
            onValueChange={(value) => handleInputChange('unit', value)}
          >
            <SelectTrigger className={errors.unit ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecciona unidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">Kilogramos (kg)</SelectItem>
              <SelectItem value="g">Gramos (g)</SelectItem>
              <SelectItem value="L">Litros (L)</SelectItem>
              <SelectItem value="ml">Mililitros (ml)</SelectItem>
              <SelectItem value="units">Unidades</SelectItem>
              <SelectItem value="pieces">Piezas</SelectItem>
              <SelectItem value="packs">Paquetes</SelectItem>
              <SelectItem value="bottles">Botellas</SelectItem>
              <SelectItem value="cans">Latas</SelectItem>
            </SelectContent>
          </Select>
          {errors.unit && <p className="text-sm text-red-500 mt-1">{errors.unit}</p>}
        </div>
      </div>
    </div>
  );

  const renderTransportForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre del Transporte *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Ej: Minibus Premium"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pricePerGuest">Precio por Huésped *</Label>
          <Input
            id="pricePerGuest"
            type="number"
            value={formData.pricePerGuest}
            onChange={(e) => handleInputChange('pricePerGuest', e.target.value)}
            placeholder="0"
            className={errors.pricePerGuest ? 'border-red-500' : ''}
          />
          {errors.pricePerGuest && <p className="text-sm text-red-500 mt-1">{errors.pricePerGuest}</p>}
          <p className="text-xs text-slate-500 mt-1">Precio que se incluye en el presupuesto</p>
        </div>

        <div>
          <Label htmlFor="costToCompany">Costo para la Empresa *</Label>
          <Input
            id="costToCompany"
            type="number"
            value={formData.costToCompany}
            onChange={(e) => handleInputChange('costToCompany', e.target.value)}
            placeholder="0"
            className={errors.costToCompany ? 'border-red-500' : ''}
          />
          {errors.costToCompany && <p className="text-sm text-red-500 mt-1">{errors.costToCompany}</p>}
          <p className="text-xs text-slate-500 mt-1">Costo real que paga la empresa</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Tipo de Vehículo *</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => handleInputChange('type', value)}
          >
            <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecciona tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bus">Autobús</SelectItem>
              <SelectItem value="minibus">Minibús</SelectItem>
              <SelectItem value="van">Van</SelectItem>
              <SelectItem value="car">Automóvil</SelectItem>
              <SelectItem value="taxi">Taxi</SelectItem>
              <SelectItem value="shuttle">Shuttle</SelectItem>
              <SelectItem value="private">Transporte Privado</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type}</p>}
        </div>

        <div>
          <Label htmlFor="capacity">Capacidad *</Label>
          <Input
            id="capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => handleInputChange('capacity', e.target.value)}
            placeholder="Número de pasajeros"
            className={errors.capacity ? 'border-red-500' : ''}
          />
          {errors.capacity && <p className="text-sm text-red-500 mt-1">{errors.capacity}</p>}
        </div>
      </div>
    </div>
  );

  const renderForm = () => {
    switch (type) {
      case 'accommodation':
        return renderAccommodationForm();
      case 'menu':
        return renderMenuForm();
      case 'food':
        return renderFoodForm();
      case 'product':
        return renderProductForm();
      case 'transport':
        return renderTransportForm();
      default:
        return <div>Tipo de formulario no válido</div>;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {renderForm()}
      
      <div className="flex items-center space-x-2 pt-4 border-t">
        <Checkbox
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => handleInputChange('isActive', checked)}
        />
        <Label htmlFor="isActive">Activo</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {item ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
};

export default ConfigurationForm;