import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Package, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  ArrowLeft,
  X
} from 'lucide-react';
import { useStore } from '../store';
import ProductForm from '../components/ProductForm';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Product } from '../types/Product';

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    unit: '',
    estimatedPrice: 0,
    supplier: '',
    notes: ''
  });

  const categories = ['meat', 'vegetables', 'beverages', 'condiments', 'equipment', 'decorations', 'other'];
  const units = ['kg', 'units', 'liters', 'pieces', 'boxes', 'bags', 'bottles'];

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      unit: '',
      estimatedPrice: 0,
      supplier: '',
      notes: ''
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsCreating(false);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      unit: product.unit,
      estimatedPrice: product.estimatedPrice,
      supplier: product.supplier,
      notes: product.notes || ''
    });
  };

  const handleSave = () => {
    const productData = {
      ...formData,
      id: editingProduct?.id || `p${Date.now()}`,
      cost: formData.estimatedPrice, // Map estimatedPrice to required cost field
      isActive: true,
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: formData.category as 'meat' | 'vegetables' | 'beverages' | 'condiments' | 'equipment' | 'decorations' | 'other',
      unit: formData.unit as 'kg' | 'units' | 'liters' | 'pieces' | 'boxes' | 'bags' | 'bottles'
    };

    if (editingProduct) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }

    setIsCreating(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      unit: '',
      estimatedPrice: 0,
      supplier: '',
      notes: ''
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      unit: '',
      estimatedPrice: 0,
      supplier: '',
      notes: ''
    });
  };

  const handleDelete = (productId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      deleteProduct(productId);
    }
  };

  const filteredProducts = products.filter(product => 
    (product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterCategory === 'all' || product.category === filterCategory)
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'meat': return 'bg-red-100 text-red-800';
      case 'vegetables': return 'bg-green-100 text-green-800';
      case 'beverages': return 'bg-blue-100 text-blue-800';
      case 'condiments': return 'bg-yellow-100 text-yellow-800';
      case 'equipment': return 'bg-purple-100 text-purple-800';
      case 'decorations': return 'bg-pink-100 text-pink-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/configuration')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Configuración
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Productos</h1>
            <p className="text-slate-600 mt-2">
              Gestiona los productos y servicios predefinidos
            </p>
          </div>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Form */}
      {(isCreating || editingProduct) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nombre del producto"
                />
              </div>
              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="unit">Unidad</Label>
                <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar unidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map(unit => (
                      <SelectItem key={unit} value={unit}>
                        {unit.charAt(0).toUpperCase() + unit.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">Precio Estimado</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.estimatedPrice}
                  onChange={(e) => setFormData({...formData, estimatedPrice: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="supplier">Proveedor</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                  placeholder="Nombre del proveedor"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descripción del producto"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Notas adicionales"
                rows={2}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleSave}>
                {editingProduct ? 'Actualizar' : 'Crear'} Producto
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products List */}
      <div className="grid gap-4">
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {searchTerm ? 'No se encontraron productos' : 'No hay productos configurados'}
              </h3>
              <p className="text-slate-600 mb-4">
                {searchTerm 
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Comienza creando tu primer producto'
                }
              </p>
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Producto
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-900">{product.name}</h3>
                      <Badge className={getCategoryColor(product.category)}>
                        {product.category}
                      </Badge>
                    </div>
                    {product.description && (
                      <p className="text-sm text-slate-600 mb-2">{product.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="font-medium text-green-600">
                        ${product.estimatedPrice.toLocaleString()}
                      </span>
                      <span>Unidad: {product.unit}</span>
                      {product.supplier && (
                        <span>Proveedor: {product.supplier}</span>
                      )}
                    </div>
                    {product.notes && (
                      <p className="text-xs text-slate-500 mt-2 italic">{product.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Products; 