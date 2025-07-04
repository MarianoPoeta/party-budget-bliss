import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Search, Plus, Minus, Filter, X } from 'lucide-react';
import { useStore } from '../store';
import { 
  EnhancedConfigurationFormProps,
  SelectedItemWithQuantity,
  ConfigurationFormData,
  AccommodationFormData,
  MenuFormData,
  FoodFormData,
  ProductFormData,
  TransportFormData,
  FormChangeHandler,
  EnhancedSelectorProps,
  FOOD_CATEGORIES,
  PRODUCT_CATEGORIES,
  ACCOMMODATION_ROOM_TYPES,
  TRANSPORT_VEHICLE_TYPES,
  MENU_TYPES
} from '../types/Forms';
import { Food } from '../types/Food';
import { Product } from '../types/Product';

export const EnhancedConfigurationForm: React.FC<EnhancedConfigurationFormProps> = ({
  type,
  item,
  onSave,
  onCancel
}) => {
  const { foods, products } = useStore();
  
  // Enhanced form state with quantity management
  const getInitialData = (): ConfigurationFormData => {
    if (item) {
      // Convert existing data to new format with quantities using type guards
      switch (type) {
        case 'accommodation':
          return { ...item } as AccommodationFormData;
        
        case 'menu': {
          const menuItem = item as any; // TODO: Fix when Menu interface is updated
          const baseData = { ...menuItem };
          if (menuItem.selectedFoods) {
            baseData.selectedFoodsWithQuantity = menuItem.selectedFoods.map((id: string) => ({
              id,
              quantity: menuItem.foodQuantities?.[id] || 1
            }));
          }
          return baseData as MenuFormData;
        }
        
        case 'food': {
          const foodItem = item as any; // TODO: Fix when Food interface is updated
          const baseData = { ...foodItem };
          if (foodItem.selectedProducts) {
            baseData.selectedProductsWithQuantity = foodItem.selectedProducts.map((id: string) => ({
              id,
              quantity: foodItem.productQuantities?.[id] || 1
            }));
          }
          return baseData as FoodFormData;
        }
        
        case 'product':
          return { ...item } as ProductFormData;
        
        case 'transport':
          return { ...item } as TransportFormData;
        
        default:
          return { name: '', isActive: true } as ConfigurationFormData;
      }
    }
    
    // Default form data for new items
    switch (type) {
      case 'accommodation':
        return {
          name: '',
          address: '',
          costPerNight: '',
          pricePerNight: '',
          maxCapacity: '',
          isActive: true
        } as AccommodationFormData;
      case 'menu':
        return {
          name: '',
          selectedFoodsWithQuantity: [],
          isActive: true
        } as MenuFormData;
      case 'food':
        return {
          name: '',
          pricePerGuest: '',
          guestsPerUnit: '',
          selectedProductsWithQuantity: [],
          isActive: true
        } as FoodFormData;
      case 'product':
        return {
          name: '',
          category: '',
          cost: '',
          unit: '',
          isActive: true
        } as ProductFormData;
      case 'transport':
        return {
          name: '',
          pricePerGuest: '',
          costToCompany: '',
          type: '',
          capacity: '',
          isActive: true
        } as TransportFormData;
      default:
        return { name: '', isActive: true } as ConfigurationFormData;
    }
  };

  const [formData, setFormData] = useState<ConfigurationFormData>(getInitialData());
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Enhanced selector states
  const [foodSearch, setFoodSearch] = useState('');
  const [foodFilter, setFoodFilter] = useState('all');
  const [productSearch, setProductSearch] = useState('');
  const [productFilter, setProductFilter] = useState('all');

  const handleInputChange: FormChangeHandler = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Enhanced quantity management
  const handleQuantityChange = (itemId: string, quantity: number, arrayField: string) => {
    const newQuantity = Math.max(0, quantity);
    setFormData(prev => ({
      ...prev,
      [arrayField]: prev[arrayField].map((item: SelectedItemWithQuantity) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    }));
  };

  const addItem = (itemId: string, arrayField: string) => {
    setFormData(prev => ({
      ...prev,
      [arrayField]: [...prev[arrayField], { id: itemId, quantity: 1 }]
    }));
  };

  const removeItem = (itemId: string, arrayField: string) => {
    setFormData(prev => ({
      ...prev,
      [arrayField]: prev[arrayField].filter((item: SelectedItemWithQuantity) => item.id !== itemId)
    }));
  };

  // Filtered and searched items
  const filteredFoods = useMemo(() => {
    return foods.filter(food => {
      const matchesSearch = food.name.toLowerCase().includes(foodSearch.toLowerCase());
      const matchesFilter = foodFilter === 'all' || food.category === foodFilter;
      return matchesSearch && matchesFilter && food.isActive;
    });
  }, [foods, foodSearch, foodFilter]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(productSearch.toLowerCase());
      const matchesFilter = productFilter === 'all' || product.category === productFilter;
      return matchesSearch && matchesFilter && product.isActive;
    });
  }, [products, productSearch, productFilter]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    switch (type) {
      case 'accommodation': {
        const accommodationData = formData as AccommodationFormData;
        if (!accommodationData.name) newErrors.name = 'El nombre es requerido';
        if (!accommodationData.address) newErrors.address = 'La dirección es requerida';
        if (!accommodationData.costPerNight || Number(accommodationData.costPerNight) <= 0) newErrors.costPerNight = 'El costo debe ser mayor a 0';
        if (!accommodationData.pricePerNight || Number(accommodationData.pricePerNight) <= 0) newErrors.pricePerNight = 'El precio debe ser mayor a 0';
        if (!accommodationData.maxCapacity || Number(accommodationData.maxCapacity) <= 0) newErrors.maxCapacity = 'La capacidad debe ser mayor a 0';
        break;
      }
      case 'menu': {
        const menuData = formData as MenuFormData;
        if (!menuData.name) newErrors.name = 'El nombre es requerido';
        if (!menuData.selectedFoodsWithQuantity || menuData.selectedFoodsWithQuantity.length === 0) {
          newErrors.selectedFoods = 'Debe seleccionar al menos una comida';
        }
        break;
      }
      case 'food': {
        const foodData = formData as FoodFormData;
        if (!foodData.name) newErrors.name = 'El nombre es requerido';
        if (!foodData.pricePerGuest || Number(foodData.pricePerGuest) <= 0) newErrors.pricePerGuest = 'El precio debe ser mayor a 0';
        if (!foodData.guestsPerUnit || Number(foodData.guestsPerUnit) <= 0) newErrors.guestsPerUnit = 'Los huéspedes por unidad deben ser mayor a 0';
        break;
      }
      case 'product': {
        const productData = formData as ProductFormData;
        if (!productData.name) newErrors.name = 'El nombre es requerido';
        if (!productData.category) newErrors.category = 'La categoría es requerida';
        if (!productData.cost || Number(productData.cost) <= 0) newErrors.cost = 'El costo debe ser mayor a 0';
        if (!productData.unit) newErrors.unit = 'La unidad es requerida';
        break;
      }
      case 'transport': {
        const transportData = formData as TransportFormData;
        if (!transportData.name) newErrors.name = 'El nombre es requerido';
        if (!transportData.pricePerGuest || Number(transportData.pricePerGuest) <= 0) newErrors.pricePerGuest = 'El precio debe ser mayor a 0';
        if (!transportData.costToCompany || Number(transportData.costToCompany) <= 0) newErrors.costToCompany = 'El costo debe ser mayor a 0';
        if (!transportData.type) newErrors.type = 'El tipo es requerido';
        if (!transportData.capacity || Number(transportData.capacity) <= 0) newErrors.capacity = 'La capacidad debe ser mayor a 0';
        break;
      }
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
      };

      // Convert quantities back to the expected format using type guards
      switch (type) {
        case 'menu': {
          const menuData = formData as MenuFormData;
          if (menuData.selectedFoodsWithQuantity) {
            (submissionData as any).selectedFoods = menuData.selectedFoodsWithQuantity.map(item => item.id);
            (submissionData as any).foodQuantities = menuData.selectedFoodsWithQuantity.reduce((acc: Record<string, number>, item) => {
              acc[item.id] = item.quantity;
              return acc;
            }, {});
          }
          break;
        }
        case 'food': {
          const foodData = formData as FoodFormData;
          if (foodData.selectedProductsWithQuantity) {
            (submissionData as any).selectedProducts = foodData.selectedProductsWithQuantity.map(item => item.id);
            (submissionData as any).productQuantities = foodData.selectedProductsWithQuantity.reduce((acc: Record<string, number>, item) => {
              acc[item.id] = item.quantity;
              return acc;
            }, {});
          }
          break;
        }
      }

      // Convert string numbers to actual numbers using type guards
      switch (type) {
        case 'accommodation': {
          const accommodationData = formData as AccommodationFormData;
          (submissionData as any).costPerNight = Number(accommodationData.costPerNight);
          (submissionData as any).pricePerNight = Number(accommodationData.pricePerNight);
          (submissionData as any).maxCapacity = Number(accommodationData.maxCapacity);
          break;
        }
        case 'food': {
          const foodData = formData as FoodFormData;
          (submissionData as any).pricePerGuest = Number(foodData.pricePerGuest);
          (submissionData as any).guestsPerUnit = Number(foodData.guestsPerUnit);
          break;
        }
        case 'product': {
          const productData = formData as ProductFormData;
          (submissionData as any).cost = Number(productData.cost);
          break;
        }
        case 'transport': {
          const transportData = formData as TransportFormData;
          (submissionData as any).pricePerGuest = Number(transportData.pricePerGuest);
          (submissionData as any).costToCompany = Number(transportData.costToCompany);
          (submissionData as any).capacity = Number(transportData.capacity);
          break;
        }
      }

      onSave(submissionData);
    }
  };

  // Enhanced selector component with search and quantities
  const renderEnhancedSelector = (
    items: any[],
    selectedItems: SelectedItemWithQuantity[],
    searchValue: string,
    onSearchChange: (value: string) => void,
    filterValue: string,
    onFilterChange: (value: string) => void,
    arrayField: string,
    title: string,
    categories: string[]
  ) => (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        
        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-8"
            />
          </div>
          <Select value={filterValue} onValueChange={onFilterChange}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Selected Items */}
        {selectedItems.length > 0 && (
          <div className="mb-4">
            <Label className="text-xs font-medium text-slate-600 mb-2 block">Seleccionados ({selectedItems.length})</Label>
            <div className="space-y-2">
              {selectedItems.map(selectedItem => {
                const item = items.find(i => i.id === selectedItem.id);
                if (!item) return null;
                
                return (
                  <div key={selectedItem.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <span className="text-sm font-medium">{item.name}</span>
                      <div className="text-xs text-slate-500">
                        {item.category && <Badge variant="outline" className="mr-2">{item.category}</Badge>}
                        {item.pricePerGuest && `$${item.pricePerGuest}/huésped`}
                        {item.cost && `$${item.cost}/${item.unit}`}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border rounded">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleQuantityChange(selectedItem.id, selectedItem.quantity - 1, arrayField)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="px-2 text-sm w-8 text-center">{selectedItem.quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleQuantityChange(selectedItem.id, selectedItem.quantity + 1, arrayField)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
                        onClick={() => removeItem(selectedItem.id, arrayField)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            <Separator className="my-4" />
          </div>
        )}

        {/* Available Items */}
        <ScrollArea className="h-48">
          <div className="space-y-1">
            {items.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p className="text-sm">No hay elementos disponibles</p>
              </div>
            ) : (
              items.map(item => {
                const isSelected = selectedItems.some(selected => selected.id === item.id);
                
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-2 rounded hover:bg-slate-50 transition-colors ${
                      isSelected ? 'bg-slate-100' : ''
                    }`}
                  >
                    <div className="flex-1 cursor-pointer" onClick={() => !isSelected && addItem(item.id, arrayField)}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{item.name}</span>
                        {item.category && <Badge variant="secondary" className="text-xs">{item.category}</Badge>}
                      </div>
                      {item.description && (
                        <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                      )}
                      <div className="text-xs text-slate-600 mt-1">
                        {item.pricePerGuest && `$${item.pricePerGuest}/huésped`}
                        {item.cost && `$${item.cost}/${item.unit}`}
                      </div>
                    </div>
                    
                    {!isSelected && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => addItem(item.id, arrayField)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  const renderAccommodationForm = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información Básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <Label htmlFor="address">Dirección Completa *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Dirección completa del alojamiento"
              className={errors.address ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
          </div>

          <div>
            <Label htmlFor="maxCapacity">Capacidad Máxima de Huéspedes *</Label>
            <Input
              id="maxCapacity"
              type="number"
              value={formData.maxCapacity}
              onChange={(e) => handleInputChange('maxCapacity', e.target.value)}
              placeholder="Número de huéspedes"
              className={errors.maxCapacity ? 'border-red-500' : ''}
            />
            {errors.maxCapacity && <p className="text-sm text-red-500 mt-1">{errors.maxCapacity}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información Financiera</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="costPerNight">Costo por Noche (Empresa) *</Label>
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
              <Label htmlFor="pricePerNight">Precio por Noche (Cliente) *</Label>
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
        </CardContent>
      </Card>
    </div>
  );

  const renderMenuForm = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información del Menú</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <div>
        <Label className="text-lg font-medium mb-4 block">Comidas del Menú *</Label>
        {errors.selectedFoods && <p className="text-sm text-red-500 mb-4">{errors.selectedFoods}</p>}
        {renderEnhancedSelector(
          filteredFoods,
          formData.selectedFoodsWithQuantity || [],
          foodSearch,
          setFoodSearch,
          foodFilter,
          setFoodFilter,
          'selectedFoodsWithQuantity',
          'Comidas Disponibles',
          [...new Set(foods.map(f => f.category).filter(Boolean))]
        )}
      </div>
    </div>
  );

  const renderFoodForm = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información de la Comida</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
              <p className="text-xs text-slate-500 mt-1">Precio incluido en el presupuesto</p>
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
        </CardContent>
      </Card>

      <div>
        <Label className="text-lg font-medium mb-4 block">Productos Necesarios (Opcional)</Label>
        {renderEnhancedSelector(
          filteredProducts,
          formData.selectedProductsWithQuantity || [],
          productSearch,
          setProductSearch,
          productFilter,
          setProductFilter,
          'selectedProductsWithQuantity',
          'Productos Disponibles',
          [...new Set(products.map(p => p.category).filter(Boolean))]
        )}
      </div>
    </div>
  );

  const renderProductForm = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información del Producto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                <SelectItem value="meat">Carnes</SelectItem>
                <SelectItem value="dairy">Lácteos</SelectItem>
                <SelectItem value="vegetables">Vegetales</SelectItem>
                <SelectItem value="grains">Granos</SelectItem>
                <SelectItem value="spices">Especias</SelectItem>
                <SelectItem value="beverages">Bebidas</SelectItem>
                <SelectItem value="equipment">Equipamiento</SelectItem>
                <SelectItem value="cleaning">Limpieza</SelectItem>
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
        </CardContent>
      </Card>
    </div>
  );

  const renderTransportForm = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información del Transporte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                  <SelectItem value="limousine">Limousina</SelectItem>
                  <SelectItem value="private">Transporte Privado</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type}</p>}
            </div>

            <div>
              <Label htmlFor="capacity">Capacidad (Pasajeros) *</Label>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información Financiera</CardTitle>
        </CardHeader>
        <CardContent>
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
              <p className="text-xs text-slate-500 mt-1">Precio incluido en el presupuesto</p>
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
        </CardContent>
      </Card>
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

      <div className="flex justify-end gap-3 pt-4 border-t">
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

export default EnhancedConfigurationForm;