import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Menu } from '../types/Menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Plus, 
  Search, 
  UtensilsCrossed, 
  Users, 
  DollarSign, 
  Clock,
  Edit,
  Trash2,
  Copy,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../components/ui/dropdown-menu';
import { LoadingSpinner } from '../components/LoadingSpinner';
import Layout from '../components/Layout';

const Menus = () => {
  const navigate = useNavigate();
  const { menus, deleteMenu } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [isLoading, setIsLoading] = useState(false);

  // Filter and sort menus
  const filteredMenus = useMemo(() => {
    let filtered = menus.filter(menu => {
      const matchesSearch = menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           menu.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || menu.type === typeFilter;
      return matchesSearch && matchesType;
    });

    // Sort menus
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return b.pricePerPerson - a.pricePerPerson;
        case 'guests':
          return b.maxPeople - a.maxPeople;
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return filtered;
  }, [menus, searchTerm, typeFilter, sortBy]);

  const handleDelete = async (menuId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este menú?')) {
      setIsLoading(true);
      try {
        deleteMenu(menuId);
        // Show success message
      } catch (error) {
        console.error('Error al eliminar el menú:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDuplicate = (menu: Menu) => {
    const duplicatedMenu = {
      ...menu,
      id: Date.now().toString(),
      name: `${menu.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    // Add to store
    // addMenu(duplicatedMenu);
  };

  const getTypeColor = (type: string) => {
    const colors = {
      breakfast: 'bg-yellow-100 text-yellow-800',
      lunch: 'bg-green-100 text-green-800',
      dinner: 'bg-blue-100 text-blue-800',
      brunch: 'bg-orange-100 text-orange-800',
      cocktail: 'bg-purple-100 text-purple-800',
      catering: 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || colors.breakfast;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      breakfast: '🌅',
      lunch: '🌞',
      dinner: '🌙',
      brunch: '🥐',
      cocktail: '🍸',
      catering: '🍽️'
    };
    return icons[type as keyof typeof icons] || '🍽️';
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const total = menus.length;
    const totalValue = menus.reduce((sum, m) => sum + (m.pricePerPerson * m.maxPeople), 0);
    const avgPrice = total > 0 ? menus.reduce((sum, m) => sum + m.pricePerPerson, 0) / total : 0;
    const types = [...new Set(menus.map(m => m.type))].length;

    return { total, totalValue, avgPrice, types };
  }, [menus]);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Menús</h1>
            <p className="text-slate-600 mt-2">Administra y personaliza plantillas de menús</p>
          </div>
          <Button onClick={() => navigate('/menus/new')} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Menú
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total de Menús</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UtensilsCrossed className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Tipos</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.types}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Precio Promedio</p>
                  <p className="text-2xl font-bold text-slate-900">${stats.avgPrice.toFixed(0)}</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Value</p>
                  <p className="text-2xl font-bold text-slate-900">${stats.totalValue.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
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
                  placeholder="Buscar menús por nombre, descripción o restaurante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Tipos</SelectItem>
                  <SelectItem value="breakfast">Desayuno</SelectItem>
                  <SelectItem value="lunch">Almuerzo</SelectItem>
                  <SelectItem value="dinner">Cena</SelectItem>
                  <SelectItem value="brunch">Brunch</SelectItem>
                  <SelectItem value="cocktail">Cóctel</SelectItem>
                  <SelectItem value="catering">Catering</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nombre</SelectItem>
                  <SelectItem value="price">Precio</SelectItem>
                  <SelectItem value="guests">Max Guests</SelectItem>
                  <SelectItem value="type">Tipo</SelectItem>
                  <SelectItem value="restaurant">Restaurante</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Menus List */}
        <div className="space-y-4">
          {isLoading && <LoadingSpinner text="Cargando menús..." />}
          
          {filteredMenus.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No se encontraron menús</h3>
                <p className="text-slate-600 mb-4">
                  {searchTerm || typeFilter !== 'all' 
                    ? 'Intenta ajustar tu búsqueda o filtros' 
                    : 'Comienza creando tu primer menú'
                  }
                </p>
                {!searchTerm && typeFilter === 'all' && (
                  <Button onClick={() => navigate('/menus/new')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primer Menú
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMenus.map((menu) => (
                <Card key={menu.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-slate-900 mb-1">
                          {menu.name}
                        </CardTitle>
                        <CardDescription className="text-sm text-slate-600">
                          {menu.description}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/menus/${menu.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/menus/${menu.id}/edit`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar Menú
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(menu)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(menu.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Type and Price */}
                      <div className="flex items-center justify-between">
                        <Badge className={getTypeColor(menu.type)}>
                          <span className="mr-1">{getTypeIcon(menu.type)}</span>
                          {menu.type.charAt(0).toUpperCase() + menu.type.slice(1)}
                        </Badge>
                        <span className="text-sm font-semibold text-slate-900">
                          ${menu.pricePerPerson}/person
                        </span>
                      </div>

                      {/* Menu Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Restaurantes</span>
                          <div className="font-medium text-slate-900">{menu.restaurant}</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Capacity:</span>
                          <div className="font-medium text-slate-900">
                            {menu.minPeople}-{menu.maxPeople} people
                          </div>
                        </div>
                      </div>

                      {/* Menu Items Preview */}
                      {menu.items && menu.items.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-xs font-medium text-slate-500">Elementos del Menú:</span>
                          <div className="flex flex-wrap gap-1">
                            {menu.items.slice(0, 3).map((item, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {item.name}
                              </Badge>
                            ))}
                            {menu.items.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{menu.items.length - 3} más
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => navigate(`/menus/${menu.id}`)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Ver
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => navigate(`/menus/${menu.id}/edit`)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Menus;
