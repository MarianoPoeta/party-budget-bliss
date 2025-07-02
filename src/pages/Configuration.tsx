import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Settings, 
  MapPin, 
  Users, 
  Package, 
  Car, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter
} from 'lucide-react';
import { useStore } from '../store';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const Configuration: React.FC = () => {
  const navigate = useNavigate();
  const { 
    accommodations, 
    activities, 
    products, 
    transportTemplates,
    currentUser 
  } = useStore();
  
  const [activeTab, setActiveTab] = useState('accommodations');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Check if user has admin access
  if (currentUser?.role !== 'admin') {
    return (
      <Layout>
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
      </Layout>
    );
  }

  // Configuration sections
  const configSections = [
    {
      id: 'accommodations',
      title: 'Alojamientos',
      description: 'Gestionar opciones de alojamiento predefinidas',
      icon: MapPin,
      count: accommodations.length,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'activities',
      title: 'Actividades',
      description: 'Gestionar actividades y experiencias predefinidas',
      icon: Users,
      count: activities.length,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'products',
      title: 'Productos',
      description: 'Gestionar productos y servicios predefinidos',
      icon: Package,
      count: products.length,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 'transports',
      title: 'Transportes',
      description: 'Gestionar opciones de transporte predefinidas',
      icon: Car,
      count: transportTemplates.length,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  const handleCreateNew = (section: string) => {
    navigate(`/configuration/${section}/new`);
  };

  const handleEdit = (section: string, id: string) => {
    navigate(`/configuration/${section}/${id}/edit`);
  };

  const handleView = (section: string, id: string) => {
    navigate(`/configuration/${section}/${id}`);
  };

  const handleDelete = (section: string, id: string) => {
    // TODO: Implement delete functionality
    console.log(`Delete ${section} with id: ${id}`);
  };

  const renderItemsList = (items: any[], section: string) => {
    const filteredItems = items.filter(item => 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredItems.length === 0) {
      return (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            {searchTerm ? 'No se encontraron resultados' : 'No hay elementos configurados'}
          </h3>
          <p className="text-slate-600 mb-4">
            {searchTerm 
              ? 'Intenta con otros términos de búsqueda'
              : 'Comienza creando tu primer elemento de configuración'
            }
          </p>
          <Button onClick={() => handleCreateNew(section)}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Nuevo
          </Button>
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900">{item.name}</h3>
                    {item.category && (
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-sm text-slate-600 mb-2">{item.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    {item.price && (
                      <span className="font-medium text-green-600">
                        ${item.price.toLocaleString()}
                      </span>
                    )}
                    {item.capacity && (
                      <span>Capacidad: {item.capacity}</span>
                    )}
                    {item.duration && (
                      <span>Duración: {item.duration}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleView(section, item.id)}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(section, item.id)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(section, item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Configuración</h1>
            <p className="text-slate-600 mt-2">
              Gestiona las opciones predefinidas para presupuestos y eventos
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Volver al Dashboard
            </Button>
          </div>
        </div>

        {/* Configuration Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {configSections.map((section) => (
            <Card 
              key={section.id}
              className={`cursor-pointer hover:shadow-lg transition-all duration-200 border-2 ${section.borderColor} hover:scale-105`}
              onClick={() => setActiveTab(section.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${section.bgColor}`}>
                    <section.icon className={`h-6 w-6 ${section.color}`} />
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {section.count}
                  </Badge>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{section.title}</h3>
                <p className="text-sm text-slate-600">{section.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Configuration Tabs */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-slate-600" />
                Gestión de Configuración
              </CardTitle>
              <Button onClick={() => handleCreateNew(activeTab)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Nuevo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                {configSections.map((section) => (
                  <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-2">
                    <section.icon className="h-4 w-4" />
                    {section.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Search and Filter Bar */}
              <div className="flex items-center gap-4 mt-6 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Buscar elementos..."
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
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="standard">Estándar</SelectItem>
                    <SelectItem value="basic">Básico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tab Contents */}
              <TabsContent value="accommodations" className="space-y-4">
                {renderItemsList(accommodations, 'accommodations')}
              </TabsContent>

              <TabsContent value="activities" className="space-y-4">
                {renderItemsList(activities, 'activities')}
              </TabsContent>

              <TabsContent value="products" className="space-y-4">
                {renderItemsList(products, 'products')}
              </TabsContent>

              <TabsContent value="transports" className="space-y-4">
                {renderItemsList(transportTemplates, 'transports')}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Configuration; 