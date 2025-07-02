import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Plus, Edit, Trash2, Package, UtensilsCrossed, MapPin, Users, DollarSign, AlertTriangle, CheckCircle, Settings, Database, FileText, Save } from 'lucide-react';
import { useStore } from '../store';
import { Product, ProductRequirement } from '../types/Product';
import { Activity } from '../types/Activity';
import { Menu } from '../types/Menu';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Separator } from '../components/ui/separator';

const AdminConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    activities,
    addActivity,
    updateActivity,
    deleteActivity,
    menus,
    addMenu,
    updateMenu,
    deleteMenu
  } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'equipment' as Product['category'],
    estimatedPrice: '',
    unit: '',
    supplier: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const productData = {
        id: editingProduct?.id || Date.now().toString(),
        ...formData,
        estimatedPrice: parseFloat(formData.estimatedPrice),
        isActive: true,
        createdAt: editingProduct?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingProduct) {
        updateProduct(productData);
      } else {
        addProduct(productData);
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'equipment',
      estimatedPrice: '',
      unit: '',
      supplier: '',
      notes: ''
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      category: product.category,
      estimatedPrice: product.estimatedPrice.toString(),
      unit: product.unit,
      supplier: product.supplier || '',
      notes: product.notes || ''
    });
  };

  const handleDelete = async (productId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setIsLoading(true);
      try {
        deleteProduct(productId);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
        console.error('Error deleting product:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const categoryColors = {
    meat: 'bg-red-50 text-red-700 border-red-200',
    vegetables: 'bg-green-50 text-green-700 border-green-200',
    beverages: 'bg-blue-50 text-blue-700 border-blue-200',
    condiments: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    equipment: 'bg-purple-50 text-purple-700 border-purple-200',
    decorations: 'bg-pink-50 text-pink-700 border-pink-200',
    other: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  const getCategoryColor = (category: Product['category']) => {
    const colors = {
      equipment: 'bg-blue-100 text-blue-800',
      food: 'bg-green-100 text-green-800',
      transport: 'bg-purple-100 text-purple-800',
      accommodation: 'bg-orange-100 text-orange-800',
      activity: 'bg-red-100 text-red-800'
    };
    return colors[category];
  };

  const getCategoryIcon = (category: Product['category']) => {
    const icons = {
      equipment: '🔧',
      food: '🍽️',
      transport: '🚗',
      accommodation: '🏨',
      activity: '🎯'
    };
    return icons[category];
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Configuración de Administrador</h1>
            <p className="text-slate-600 mt-2">Gestionar plantillas, productos y configuraciones del sistema</p>
          </div>
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-slate-500" />
            <Badge variant="secondary">Acceso de Administrador</Badge>
          </div>
        </div>

        {showSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {editingProduct ? '¡Producto actualizado exitosamente!' : '¡Producto agregado exitosamente!'}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Productos
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Actividades
            </TabsTrigger>
            <TabsTrigger value="menus" className="flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              Menús
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Plantillas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Catálogo de Productos</CardTitle>
                <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingProduct(null);
                      setFormData({
                        name: '',
                        description: '',
                        category: 'equipment',
                        estimatedPrice: '',
                        unit: '',
                        supplier: '',
                        notes: ''
                      });
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Producto
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Nombre del Producto</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="ej., Costillas de Res"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Categoría</Label>
                          <Select 
                            value={formData.category} 
                            onValueChange={(value) => setFormData({ ...formData, category: value as Product['category'] })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="meat">Carne</SelectItem>
                              <SelectItem value="vegetables">Verduras</SelectItem>
                              <SelectItem value="beverages">Bebidas</SelectItem>
                              <SelectItem value="condiments">Condimentos</SelectItem>
                              <SelectItem value="equipment">Equipamiento</SelectItem>
                              <SelectItem value="decorations">Decoraciones</SelectItem>
                              <SelectItem value="other">Otros</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="unit">Unidad</Label>
                          <Select 
                            value={formData.unit} 
                            onValueChange={(value) => setFormData({ ...formData, unit: value as Product['unit'] })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kg">Kilogramos</SelectItem>
                              <SelectItem value="units">Unidades</SelectItem>
                              <SelectItem value="liters">Litros</SelectItem>
                              <SelectItem value="pieces">Piezas</SelectItem>
                              <SelectItem value="boxes">Cajas</SelectItem>
                              <SelectItem value="bags">Bolsas</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="estimatedPrice">Precio Estimado ($)</Label>
                          <Input
                            id="estimatedPrice"
                            type="number"
                            value={formData.estimatedPrice}
                            onChange={(e) => setFormData({ ...formData, estimatedPrice: e.target.value })}
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Descripción del producto..."
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="supplier">Proveedor</Label>
                          <Input
                            id="supplier"
                            value={formData.supplier}
                            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                            placeholder="Nombre del proveedor"
                          />
                        </div>
                        <div>
                          <Label htmlFor="notes">Notas</Label>
                          <Input
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Notas adicionales"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                      <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSubmit}>
                        {isLoading ? (
                          <LoadingSpinner size="sm" text="" />
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            {editingProduct ? 'Actualizar Producto' : 'Agregar Producto'}
                          </>
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <Card key={product.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900">{product.name}</h3>
                            <Badge className={`mt-1 ${categoryColors[product.category]}`}>
                              {product.category === 'meat' ? 'Carne' :
                               product.category === 'vegetables' ? 'Verduras' :
                               product.category === 'beverages' ? 'Bebidas' :
                               product.category === 'condiments' ? 'Condimentos' :
                               product.category === 'equipment' ? 'Equipamiento' :
                               product.category === 'decorations' ? 'Decoraciones' : 'Otros'}
                            </Badge>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(product.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {product.description && (
                          <p className="text-sm text-slate-600 mb-3">{product.description}</p>
                        )}
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Precio:</span>
                            <span className="font-medium">${product.estimatedPrice}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Unidad:</span>
                            <span className="font-medium">{product.unit}</span>
                          </div>
                          {product.supplier && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">Proveedor:</span>
                              <span className="font-medium">{product.supplier}</span>
                            </div>
                          )}
                        </div>
                        
                        {product.notes && (
                          <p className="text-xs text-slate-500 mt-3 italic">{product.notes}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plantillas de Actividades</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Configurar plantillas de actividades con requisitos de productos para logística.</p>
                {/* La configuración de actividades irá aquí */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menus" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plantillas de Menús</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Configurar plantillas de menús con requisitos de productos para cocineros.</p>
                {/* La configuración de menús irá aquí */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plantillas de Presupuestos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Crear y gestionar plantillas de presupuestos que asignen tareas automáticamente.</p>
                {/* La configuración de plantillas irá aquí */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminConfig; 