import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { 
  Settings, 
  MapPin, 
  UtensilsCrossed, 
  ChefHat,
  Package, 
  Car, 
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Grid3X3,
  List,
  Users,
  DollarSign,
  Clock,
  Star,
  TrendingUp
} from 'lucide-react';
import { useStore } from '../store';
import { EnhancedConfigurationForm } from '../components/EnhancedConfigurationForms';
import { ConfigurationItem, ConfigurationFormData } from '../types/Forms';
import { Accommodation } from '../types/Accommodation';
import { Menu } from '../types/Menu';
import { Food } from '../types/Food';
import { Product } from '../types/Product';
import { TransportTemplate } from '../types/Budget';

const EnhancedConfiguration: React.FC = () => {
  const navigate = useNavigate();
  const { 
    accommodations, 
    menus,
    foods,
    products, 
    transportTemplates,
    currentUser,
    addAccommodation,
    updateAccommodation,
    deleteAccommodation,
    addMenu,
    updateMenu,
    deleteMenu,
    addFood,
    updateFood,
    deleteFood,
    addProduct,
    updateProduct,
    deleteProduct,
    addTransportTemplate,
    updateTransportTemplate,
    deleteTransportTemplate
  } = useStore();
  
  // Enhanced state management
  const [activeTab, setActiveTab] = useState('accommodations');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'accommodation' | 'menu' | 'food' | 'product' | 'transport'>('accommodation');
  const [editingItem, setEditingItem] = useState<ConfigurationItem | null>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Enhanced handlers
  const handleCreateNew = (type: 'accommodation' | 'menu' | 'food' | 'product' | 'transport') => {
    setDialogType(type);
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleEdit = (type: 'accommodation' | 'menu' | 'food' | 'product' | 'transport', item: ConfigurationItem) => {
    setDialogType(type);
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleSave = (formData: ConfigurationFormData) => {
    // Convert form data to entity data
    const data = {
      ...formData,
      id: formData.id || Date.now().toString(),
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as ConfigurationItem;
    if (editingItem) {
      switch (dialogType) {
        case 'accommodation':
          updateAccommodation(data as Accommodation);
          break;
        case 'menu':
          updateMenu(data as Menu);
          break;
        case 'food':
          updateFood(data as Food);
          break;
        case 'product':
          updateProduct(data as Product);
          break;
        case 'transport':
          updateTransportTemplate(data as TransportTemplate);
          break;
      }
    } else {
      switch (dialogType) {
        case 'accommodation':
          addAccommodation(data as Accommodation);
          break;
        case 'menu':
          addMenu(data as Menu);
          break;
        case 'food':
          addFood(data as Food);
          break;
        case 'product':
          addProduct(data as Product);
          break;
        case 'transport':
          addTransportTemplate(data as TransportTemplate);
          break;
      }
    }
    setDialogOpen(false);
    setEditingItem(null);
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setEditingItem(null);
  };

  // Enhanced filtering logic
  const getFilteredData = (data: ConfigurationItem[], type: string) => {
    return data.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && (item as any).isActive) ||
        (statusFilter === 'inactive' && !(item as any).isActive);
      const matchesCategory = categoryFilter === 'all' || 
        (item as any).category === categoryFilter ||
        (item as any).type === categoryFilter ||
        (item as any).roomType === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  };

  // Enhanced UI components
  const TabHeader = ({ title, subtitle, count, onCreateNew }: {
    title: string;
    subtitle: string;
    count: number;
    onCreateNew: () => void;
  }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <p className="text-slate-600">{subtitle}</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary" className="text-xs">
            {count} total
          </Badge>
          <Badge variant="outline" className="text-xs">
            {getFilteredData(getCurrentData(), activeTab).length} mostrados
          </Badge>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center border rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-8 w-8 p-0"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        
        <Button onClick={onCreateNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Crear {title.slice(0, -1)}
        </Button>
      </div>
    </div>
  );

  const FilterBar = () => {
    const categories = getCurrentCategories();
    
    return (
      <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>
          
          {categories.length > 0 && (
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorías</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    );
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'accommodations': return accommodations;
      case 'menus': return menus;
      case 'foods': return foods;
      case 'products': return products;
      case 'transports': return transportTemplates;
      default: return [];
    }
  };

  const getCurrentCategories = () => {
    const data = getCurrentData();
    const categoryField = activeTab === 'accommodations' ? 'roomType' : 
                         activeTab === 'transports' ? 'type' : 'category';
    return [...new Set(data.map(item => item[categoryField]).filter(Boolean))];
  };

  // Enhanced card components
  const AccommodationCard = ({ accommodation, onEdit, onDelete }: {
    accommodation: Accommodation;
    onEdit: (item: Accommodation) => void;
    onDelete: (id: string) => void;
  }) => (
    <Card className="hover:shadow-lg transition-all duration-200 border-slate-200 hover:border-slate-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{accommodation.name}</CardTitle>
              {accommodation.isActive ? (
                <Badge variant="outline" className="text-green-600">Activo</Badge>
              ) : (
                <Badge variant="secondary">Inactivo</Badge>
              )}
            </div>
            {accommodation.roomType && (
              <Badge variant="secondary" className="text-xs">{accommodation.roomType}</Badge>
            )}
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(accommodation)} className="h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(accommodation.id)} className="h-8 w-8 p-0 text-red-500">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-slate-600 line-clamp-2">{accommodation.address || accommodation.description}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="font-medium text-green-600">${accommodation.pricePerNight?.toLocaleString()}</p>
                <p className="text-xs text-slate-500">por noche</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="font-medium">{accommodation.maxCapacity || accommodation.maxOccupancy}</p>
                <p className="text-xs text-slate-500">huéspedes</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-xs text-slate-500">
              Costo: ${accommodation.costPerNight?.toLocaleString()}
            </span>
            {accommodation.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-xs">{accommodation.rating}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const MenuCard = ({ menu, onEdit, onDelete }: {
    menu: Menu;
    onEdit: (item: Menu) => void;
    onDelete: (id: string) => void;
  }) => (
    <Card className="hover:shadow-lg transition-all duration-200 border-slate-200 hover:border-slate-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{menu.name}</CardTitle>
              {menu.isActive ? (
                <Badge variant="outline" className="text-green-600">Activo</Badge>
              ) : (
                <Badge variant="secondary">Inactivo</Badge>
              )}
            </div>
            {menu.type && (
              <Badge variant="secondary" className="text-xs">{menu.type}</Badge>
            )}
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(menu)} className="h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(menu.id)} className="h-8 w-8 p-0 text-red-500">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-slate-600 line-clamp-2">{menu.description}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="font-medium text-green-600">${menu.pricePerPerson?.toLocaleString()}</p>
                <p className="text-xs text-slate-500">por persona</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <ChefHat className="h-4 w-4 text-orange-600" />
              <div>
                <p className="font-medium">{menu.selectedFoods?.length || 0}</p>
                <p className="text-xs text-slate-500">comidas</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-xs text-slate-500">
              {menu.minPeople}-{menu.maxPeople} personas
            </span>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const FoodCard = ({ food, onEdit, onDelete }: {
    food: Food;
    onEdit: (item: Food) => void;
    onDelete: (id: string) => void;
  }) => (
    <Card className="hover:shadow-lg transition-all duration-200 border-slate-200 hover:border-slate-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{food.name}</CardTitle>
              {food.isActive ? (
                <Badge variant="outline" className="text-green-600">Activo</Badge>
              ) : (
                <Badge variant="secondary">Inactivo</Badge>
              )}
            </div>
            {food.category && (
              <Badge variant="secondary" className="text-xs">{food.category}</Badge>
            )}
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(food)} className="h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(food.id)} className="h-8 w-8 p-0 text-red-500">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-slate-600 line-clamp-2">{food.description}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="font-medium text-green-600">${food.pricePerGuest?.toLocaleString()}</p>
                <p className="text-xs text-slate-500">por huésped</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="font-medium">{food.guestsPerUnit}</p>
                <p className="text-xs text-slate-500">por unidad</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-xs text-slate-500">
              {food.selectedProducts?.length || 0} productos
            </span>
            {food.preparationTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-slate-400" />
                <span className="text-xs">{food.preparationTime}min</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProductCard = ({ product, onEdit, onDelete }: {
    product: Product;
    onEdit: (item: Product) => void;
    onDelete: (id: string) => void;
  }) => (
    <Card className="hover:shadow-lg transition-all duration-200 border-slate-200 hover:border-slate-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              {product.isActive ? (
                <Badge variant="outline" className="text-green-600">Activo</Badge>
              ) : (
                <Badge variant="secondary">Inactivo</Badge>
              )}
            </div>
            {product.category && (
              <Badge variant="secondary" className="text-xs">{product.category}</Badge>
            )}
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(product)} className="h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(product.id)} className="h-8 w-8 p-0 text-red-500">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="font-medium text-green-600">${product.cost?.toLocaleString()}</p>
                <p className="text-xs text-slate-500">por {product.unit}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-purple-600" />
              <div>
                <p className="font-medium">{product.unit}</p>
                <p className="text-xs text-slate-500">unidad</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-xs text-slate-500">
              {product.supplier || 'Sin proveedor'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const TransportCard = ({ transport, onEdit, onDelete }: {
    transport: TransportTemplate;
    onEdit: (item: TransportTemplate) => void;
    onDelete: (id: string) => void;
  }) => (
    <Card className="hover:shadow-lg transition-all duration-200 border-slate-200 hover:border-slate-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{transport.name}</CardTitle>
              <Badge variant="outline" className="text-blue-600">Transporte</Badge>
            </div>
            {transport.type && (
              <Badge variant="secondary" className="text-xs">{transport.type}</Badge>
            )}
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(transport)} className="h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(transport.id)} className="h-8 w-8 p-0 text-red-500">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-slate-600 line-clamp-2">{transport.description}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="font-medium text-green-600">${transport.pricePerHour?.toLocaleString() || transport.pricePerGuest?.toLocaleString()}</p>
                <p className="text-xs text-slate-500">{transport.pricePerHour ? 'por hora' : 'por huésped'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="font-medium">{transport.capacity}</p>
                <p className="text-xs text-slate-500">pasajeros</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-xs text-slate-500">
              Costo: ${transport.costToCompany?.toLocaleString() || transport.pricePerHour?.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = ({ icon: Icon, title, subtitle, onCreateNew }: {
    icon: React.ElementType;
    title: string;
    subtitle: string;
    onCreateNew: () => void;
  }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-slate-100 rounded-full p-6 mb-4">
        <Icon className="h-12 w-12 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-center mb-6 max-w-md">{subtitle}</p>
      <Button onClick={onCreateNew} className="bg-blue-600 hover:bg-blue-700">
        <Plus className="h-4 w-4 mr-2" />
        Crear Elemento
      </Button>
    </div>
  );

  const renderCards = () => {
    const filteredData = getFilteredData(getCurrentData(), activeTab);
    
    if (filteredData.length === 0) {
      const configs = {
        accommodations: {
          icon: MapPin,
          title: 'No hay alojamientos',
          subtitle: 'Comienza agregando opciones de alojamiento para tus eventos'
        },
        menus: {
          icon: UtensilsCrossed,
          title: 'No hay menús',
          subtitle: 'Crea menús combinando comidas para ofrecer en tus eventos'
        },
        foods: {
          icon: ChefHat,
          title: 'No hay comidas',
          subtitle: 'Agrega comidas preparadas que se usarán en los menús'
        },
        products: {
          icon: Package,
          title: 'No hay productos',
          subtitle: 'Agrega productos necesarios para preparar las comidas'
        },
        transports: {
          icon: Car,
          title: 'No hay transportes',
          subtitle: 'Agrega opciones de transporte para tus eventos'
        }
      };
      
      const config = configs[activeTab as keyof typeof configs];
      return (
        <EmptyState
          icon={config.icon}
          title={config.title}
          subtitle={config.subtitle}
          onCreateNew={() => handleCreateNew(activeTab as any)}
        />
      );
    }

    const gridClasses = viewMode === 'grid' 
      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      : 'space-y-4';

    return (
      <div className={gridClasses}>
        {filteredData.map((item) => {
          const cardProps = {
            onEdit: (editItem: ConfigurationItem) => {
              handleEdit(activeTab as any, editItem);
            },
            onDelete: (id: string) => {
              const deleteMethod = {
                accommodations: deleteAccommodation,
                menus: deleteMenu,
                foods: deleteFood,
                products: deleteProduct,
                transports: deleteTransportTemplate
              }[activeTab];
              deleteMethod?.(id);
            }
          };

          switch (activeTab) {
            case 'accommodations':
              return <AccommodationCard key={item.id} accommodation={item as Accommodation} {...cardProps} />;
            case 'menus':
              return <MenuCard key={item.id} menu={item as Menu} {...cardProps} />;
            case 'foods':
              return <FoodCard key={item.id} food={item as Food} {...cardProps} />;
            case 'products':
              return <ProductCard key={item.id} product={item as Product} {...cardProps} />;
            case 'transports':
              return <TransportCard key={item.id} transport={item as TransportTemplate} {...cardProps} />;
            default:
              return null;
          }
        })}
      </div>
    );
  };

  // Check if user has admin access
  if (currentUser?.role !== 'admin') {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <Settings className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Acceso Restringido</h2>
              <p className="text-slate-600 mb-4">
                Solo los administradores pueden acceder a la configuración del sistema.
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Configuración</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Enhanced Tab List */}
          <TabsList className="grid w-full grid-cols-5 h-12 bg-white border border-slate-200">
            <TabsTrigger value="accommodations" className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Alojamientos</span>
              <span className="sm:hidden">Aloj.</span>
            </TabsTrigger>
            <TabsTrigger value="menus" className="flex items-center gap-2 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700">
              <UtensilsCrossed className="h-4 w-4" />
              <span className="hidden sm:inline">Menús</span>
              <span className="sm:hidden">Menús</span>
            </TabsTrigger>
            <TabsTrigger value="foods" className="flex items-center gap-2 data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
              <ChefHat className="h-4 w-4" />
              <span className="hidden sm:inline">Comidas</span>
              <span className="sm:hidden">Com.</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Productos</span>
              <span className="sm:hidden">Prod.</span>
            </TabsTrigger>
            <TabsTrigger value="transports" className="flex items-center gap-2 data-[state=active]:bg-cyan-50 data-[state=active]:text-cyan-700">
              <Car className="h-4 w-4" />
              <span className="hidden sm:inline">Transportes</span>
              <span className="sm:hidden">Trans.</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="accommodations" className="space-y-6">
            <TabHeader
              title="Alojamientos"
              subtitle="Gestiona las opciones de alojamiento disponibles"
              count={accommodations.length}
              onCreateNew={() => handleCreateNew('accommodation')}
            />
            <FilterBar />
            {renderCards()}
          </TabsContent>

          <TabsContent value="menus" className="space-y-6">
            <TabHeader
              title="Menús"
              subtitle="Gestiona los menús disponibles y sus comidas"
              count={menus.length}
              onCreateNew={() => handleCreateNew('menu')}
            />
            <FilterBar />
            {renderCards()}
          </TabsContent>

          <TabsContent value="foods" className="space-y-6">
            <TabHeader
              title="Comidas"
              subtitle="Gestiona las comidas preparadas disponibles"
              count={foods.length}
              onCreateNew={() => handleCreateNew('food')}
            />
            <FilterBar />
            {renderCards()}
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <TabHeader
              title="Productos"
              subtitle="Gestiona los productos necesarios para las comidas"
              count={products.length}
              onCreateNew={() => handleCreateNew('product')}
            />
            <FilterBar />
            {renderCards()}
          </TabsContent>

          <TabsContent value="transports" className="space-y-6">
            <TabHeader
              title="Transportes"
              subtitle="Gestiona las opciones de transporte disponibles"
              count={transportTemplates.length}
              onCreateNew={() => handleCreateNew('transport')}
            />
            <FilterBar />
            {renderCards()}
          </TabsContent>
        </Tabs>

        {/* Enhanced Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="border-b pb-4">
              <DialogTitle className="text-xl">
                {editingItem ? 'Editar' : 'Crear'} {' '}
                {dialogType === 'accommodation' && 'Alojamiento'}
                {dialogType === 'menu' && 'Menú'}
                {dialogType === 'food' && 'Comida'}
                {dialogType === 'product' && 'Producto'}
                {dialogType === 'transport' && 'Transporte'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto py-4">
              <EnhancedConfigurationForm
                type={dialogType}
                item={editingItem}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EnhancedConfiguration;