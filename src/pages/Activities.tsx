import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Activity } from '../types/Activity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Plus, 
  Search, 
  Users, 
  MapPin, 
  DollarSign, 
  Clock,
  Edit,
  Trash2,
  Copy,
  Eye,
  MoreHorizontal,
  Car,
  Star
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

const Activities = () => {
  const navigate = useNavigate();
  const { activities, deleteActivity } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [isLoading, setIsLoading] = useState(false);

  // Filter and sort activities
  const filteredActivities = useMemo(() => {
    let filtered = activities.filter(activity => {
      const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           activity.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || activity.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    // Sort activities
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return b.basePrice - a.basePrice;
        case 'duration':
          return b.duration - a.duration;
        case 'capacity':
          return b.maxCapacity - a.maxCapacity;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [activities, searchTerm, categoryFilter, sortBy]);

  const handleDelete = async (activityId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
      setIsLoading(true);
      try {
        deleteActivity(activityId);
        // Show success message
      } catch (error) {
        console.error('Error al eliminar la actividad:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDuplicate = (activity: Activity) => {
    const duplicatedActivity = {
      ...activity,
      id: Date.now().toString(),
      name: `${activity.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    // Add to store
    // addActivity(duplicatedActivity);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      outdoor: 'bg-green-100 text-green-800',
      indoor: 'bg-blue-100 text-blue-800',
      nightlife: 'bg-purple-100 text-purple-800',
      dining: 'bg-orange-100 text-orange-800',
      adventure: 'bg-red-100 text-red-800',
      cultural: 'bg-yellow-100 text-yellow-800'
    };
    return colors[category as keyof typeof colors] || colors.outdoor;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      outdoor: '🌲',
      indoor: '🏠',
      nightlife: '🌙',
      dining: '🍽️',
      adventure: '🏔️',
      cultural: '🎭'
    };
    return icons[category as keyof typeof icons] || '🎯';
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const total = activities.length;
    const totalValue = activities.reduce((sum, a) => sum + (a.basePrice * a.maxCapacity), 0);
    const avgPrice = total > 0 ? activities.reduce((sum, a) => sum + a.basePrice, 0) / total : 0;
    const categories = [...new Set(activities.map(a => a.category))].length;
    const withTransport = activities.filter(a => a.transportRequired).length;

    return { total, totalValue, avgPrice, categories, withTransport };
  }, [activities]);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Actividades</h1>
            <p className="text-slate-600 mt-2">Administra y personaliza plantillas de actividad</p>
          </div>
          <Button onClick={() => navigate('/activities/new')} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Actividad
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total de Actividades</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Categorías</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.categories}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-green-600" />
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
                  <p className="text-sm font-medium text-slate-600">Con Transporte</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.withTransport}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Car className="h-6 w-6 text-purple-600" />
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
                  placeholder="Buscar actividades por nombre, descripción o ubicación..."
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
                  <SelectItem value="outdoor">Exterior</SelectItem>
                  <SelectItem value="indoor">Interior</SelectItem>
                  <SelectItem value="nightlife">Vida Nocturna</SelectItem>
                  <SelectItem value="dining">Comida</SelectItem>
                  <SelectItem value="adventure">Aventura</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nombre</SelectItem>
                  <SelectItem value="price">Precio</SelectItem>
                  <SelectItem value="duration">Duración</SelectItem>
                  <SelectItem value="capacity">Capacidad</SelectItem>
                  <SelectItem value="category">Categoría</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Activities List */}
        <div className="space-y-4">
          {isLoading && <LoadingSpinner text="Cargando actividades..." />}
          
          {filteredActivities.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No se encontraron actividades</h3>
                <p className="text-slate-600 mb-4">
                  {searchTerm || categoryFilter !== 'all' 
                    ? 'Intenta ajustar tu búsqueda o filtros' 
                    : 'Comienza creando tu primera actividad'
                  }
                </p>
                {!searchTerm && categoryFilter === 'all' && (
                  <Button onClick={() => navigate('/activities/new')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primera Actividad
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredActivities.map((activity) => (
                <Card key={activity.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-slate-900 mb-1">
                          {activity.name}
                        </CardTitle>
                        <CardDescription className="text-sm text-slate-600">
                          {activity.description}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/activities/${activity.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/activities/${activity.id}/edit`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar Actividad
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(activity)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(activity.id)}
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
                      {/* Category and Price */}
                      <div className="flex items-center justify-between">
                        <Badge className={getCategoryColor(activity.category)}>
                          <span className="mr-1">{getCategoryIcon(activity.category)}</span>
                          {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
                        </Badge>
                        <span className="text-sm font-semibold text-slate-900">
                          ${activity.basePrice}/persona
                        </span>
                      </div>

                      {/* Activity Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Ubicación:</span>
                          <div className="font-medium text-slate-900 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {activity.location}
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-500">Duración:</span>
                          <div className="font-medium text-slate-900 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {activity.duration}h
                          </div>
                        </div>
                      </div>

                      {/* Capacity and Transport */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Capacidad Máxima:</span>
                          <div className="font-medium text-slate-900">{activity.maxCapacity} personas</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Transporte:</span>
                          <div className="font-medium text-slate-900 flex items-center gap-1">
                            {activity.transportRequired ? (
                              <>
                                <Car className="h-3 w-3 text-green-600" />
                                Requerido
                                {activity.transportCost && (
                                  <span className="text-xs text-slate-500">
                                    (+${activity.transportCost})
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-slate-400">No requerido</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => navigate(`/activities/${activity.id}`)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Ver
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => navigate(`/activities/${activity.id}/edit`)}
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

export default Activities;
