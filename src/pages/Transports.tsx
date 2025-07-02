import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { 
  Car, 
  Plus, 
  Search, 
  Edit,
  Trash2,
  ArrowLeft
} from 'lucide-react';
import { useStore } from '../store';
import { TransportTemplate } from '../types/Budget';

const Transports: React.FC = () => {
  const navigate = useNavigate();
  const { transportTemplates, addTransportTemplate, updateTransportTemplate, deleteTransportTemplate } = useStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingTransport, setEditingTransport] = useState<TransportTemplate | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    vehicleType: 'bus' as const,
    capacity: 0,
    pricePerHour: 0,
    pricePerKm: 0,
    includesDriver: true
  });

  const vehicleTypes = [
    { value: 'bus', label: 'Bus' },
    { value: 'minivan', label: 'Minivan' },
    { value: 'car', label: 'Carro' },
    { value: 'limousine', label: 'Limousina' },
    { value: 'boat', label: 'Barco' }
  ];

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingTransport(null);
    setFormData({
      name: '',
      description: '',
      vehicleType: 'bus',
      capacity: 0,
      pricePerHour: 0,
      pricePerKm: 0,
      includesDriver: true
    });
  };

  const handleEdit = (transport: TransportTemplate) => {
    setEditingTransport(transport);
    setIsCreating(false);
    setFormData({
      name: transport.name,
      description: transport.description,
      vehicleType: transport.vehicleType,
      capacity: transport.capacity,
      pricePerHour: transport.pricePerHour,
      pricePerKm: transport.pricePerKm || 0,
      includesDriver: transport.includesDriver
    });
  };

  const handleSave = () => {
    const transportData: TransportTemplate = {
      id: editingTransport?.id || `t${Date.now()}`,
      name: formData.name,
      description: formData.description,
      vehicleType: formData.vehicleType,
      capacity: formData.capacity,
      pricePerHour: formData.pricePerHour,
      pricePerKm: formData.pricePerKm > 0 ? formData.pricePerKm : undefined,
      includesDriver: formData.includesDriver
    };

    if (editingTransport) {
      updateTransportTemplate(transportData);
    } else {
      addTransportTemplate(transportData);
    }

    setIsCreating(false);
    setEditingTransport(null);
    setFormData({
      name: '',
      description: '',
      vehicleType: 'bus',
      capacity: 0,
      pricePerHour: 0,
      pricePerKm: 0,
      includesDriver: true
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingTransport(null);
    setFormData({
      name: '',
      description: '',
      vehicleType: 'bus',
      capacity: 0,
      pricePerHour: 0,
      pricePerKm: 0,
      includesDriver: true
    });
  };

  const handleDelete = (transportId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este transporte?')) {
      deleteTransportTemplate(transportId);
    }
  };

  const filteredTransports = transportTemplates.filter(transport => 
    transport.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transport.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getVehicleTypeColor = (type: string) => {
    switch (type) {
      case 'bus': return 'bg-blue-100 text-blue-800';
      case 'minivan': return 'bg-green-100 text-green-800';
      case 'car': return 'bg-purple-100 text-purple-800';
      case 'limousine': return 'bg-yellow-100 text-yellow-800';
      case 'boat': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVehicleTypeLabel = (type: string) => {
    return vehicleTypes.find(vt => vt.value === type)?.label || type;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/configuration')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Configuración
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Transportes</h1>
              <p className="text-slate-600 mt-2">
                Gestiona las opciones de transporte predefinidas
              </p>
            </div>
          </div>
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Transporte
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar transportes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Create/Edit Form */}
        {(isCreating || editingTransport) && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingTransport ? 'Editar Transporte' : 'Nuevo Transporte'}
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
                    placeholder="Nombre del transporte"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleType">Tipo de Vehículo</Label>
                  <Select value={formData.vehicleType} onValueChange={(value: any) => setFormData({...formData, vehicleType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="capacity">Capacidad</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 0})}
                    placeholder="Número de pasajeros"
                  />
                </div>
                <div>
                  <Label htmlFor="pricePerHour">Precio por Hora</Label>
                  <Input
                    id="pricePerHour"
                    type="number"
                    value={formData.pricePerHour}
                    onChange={(e) => setFormData({...formData, pricePerHour: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="pricePerKm">Precio por Km (opcional)</Label>
                  <Input
                    id="pricePerKm"
                    type="number"
                    value={formData.pricePerKm}
                    onChange={(e) => setFormData({...formData, pricePerKm: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="includesDriver"
                    checked={formData.includesDriver}
                    onCheckedChange={(checked) => setFormData({...formData, includesDriver: checked})}
                  />
                  <Label htmlFor="includesDriver">Incluye Conductor</Label>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descripción del servicio de transporte"
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={handleSave}>
                  {editingTransport ? 'Actualizar' : 'Crear'} Transporte
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transports List */}
        <div className="grid gap-4">
          {filteredTransports.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Car className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  {searchTerm ? 'No se encontraron transportes' : 'No hay transportes configurados'}
                </h3>
                <p className="text-slate-600 mb-4">
                  {searchTerm 
                    ? 'Intenta con otros términos de búsqueda'
                    : 'Comienza creando tu primer transporte'
                  }
                </p>
                <Button onClick={handleCreateNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Transporte
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredTransports.map((transport) => (
              <Card key={transport.id} className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{transport.name}</h3>
                        <Badge className={getVehicleTypeColor(transport.vehicleType)}>
                          {getVehicleTypeLabel(transport.vehicleType)}
                        </Badge>
                      </div>
                      {transport.description && (
                        <p className="text-sm text-slate-600 mb-2">{transport.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="font-medium text-green-600">
                          ${transport.pricePerHour.toLocaleString()}/hora
                        </span>
                        <span>Capacidad: {transport.capacity} personas</span>
                        {transport.pricePerKm && (
                          <span>${transport.pricePerKm}/km</span>
                        )}
                        <span className={transport.includesDriver ? 'text-green-600' : 'text-orange-600'}>
                          {transport.includesDriver ? 'Con conductor' : 'Sin conductor'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(transport)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(transport.id)}
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
    </Layout>
  );
};

export default Transports; 