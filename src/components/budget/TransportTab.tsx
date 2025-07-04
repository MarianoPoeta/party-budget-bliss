import React, { useMemo } from 'react';
import { Search, Plus, Car, Clock, Users, MapPin, Link, Unlink, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { BudgetItem } from '../../types/EnhancedBudget';
import { TransportTemplate } from '../../types/Budget';
import { Activity } from '../../types/Activity';

interface TransportTabProps {
  templates: TransportTemplate[];
  selectedTransport: BudgetItem[];
  selectedActivities: BudgetItem[];
  searchTerm: string;
  guestCount: number;
  onSearchChange: (value: string) => void;
  onAddItem: (template: TransportTemplate) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateItem: (itemId: string, updates: Partial<BudgetItem>) => void;
}

const TransportTab: React.FC<TransportTabProps> = ({
  templates,
  selectedTransport,
  selectedActivities,
  searchTerm,
  guestCount,
  onSearchChange,
  onAddItem,
  onRemoveItem,
  onUpdateItem
}) => {
  const filteredTemplates = useMemo(() => 
    templates.filter(template =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.type.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [templates, searchTerm]
  );

  const activitiesRequiringTransport = useMemo(() => 
    selectedActivities.filter(item => {
      const activity = item.template as Activity;
      return activity.transportRequired && !item.includeTransport;
    }),
    [selectedActivities]
  );

  const getVehicleIcon = (vehicleType: string) => {
    const icons = {
      car: Car,
      minivan: Car,
      bus: Car,
      limousine: Car,
      boat: Car,
    };
    const IconComponent = icons[vehicleType as keyof typeof icons] || Car;
    return <IconComponent className="h-4 w-4" />;
  };

  const getVehicleColor = (vehicleType: string) => {
    const colors = {
      car: 'bg-blue-100 text-blue-800 border-blue-200',
      minivan: 'bg-green-100 text-green-800 border-green-200',
      bus: 'bg-purple-100 text-purple-800 border-purple-200',
      limousine: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      boat: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    };
    return colors[vehicleType as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const calculateTransportCost = (transport: TransportTemplate, duration: number = 2) => {
    if (transport.pricePerGuest && guestCount > 0) {
      return transport.pricePerGuest * guestCount;
    }
    if (transport.pricePerHour) {
      return transport.pricePerHour * duration;
    }
    return transport.costToCompany || 0;
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input
          placeholder="Buscar servicios de transporte..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Activities Requiring Transport Warning */}
      {activitiesRequiringTransport.length > 0 && (
        <Alert className="border-amber-200 bg-amber-50">
          <MapPin className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <div className="font-medium mb-2">Actividades que requieren transporte:</div>
            <div className="space-y-1">
              {activitiesRequiringTransport.map(item => {
                const activity = item.template as Activity;
                return (
                  <div key={item.id} className="text-sm">
                    • {activity.name} - {activity.location}
                  </div>
                );
              })}
            </div>
            <div className="mt-2 text-sm">
              Considera agregar servicios de transporte o habilitar el transporte incluido en estas actividades.
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Selected Transport */}
      {selectedTransport.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Car className="h-5 w-5 text-orange-600" />
              Transporte Seleccionado ({selectedTransport.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedTransport.map((item) => {
              const transport = item.template as TransportTemplate;
              const duration = (item.customizations?.duration as number) || 2;
              const estimatedCost = calculateTransportCost(transport, duration);
              
              return (
                <div key={item.id} className="p-4 border rounded-lg space-y-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getVehicleIcon(transport.type)}
                        <h4 className="font-medium text-slate-900">{transport.name}</h4>
                        <Badge className={getVehicleColor(transport.type)}>
                          {transport.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{transport.description}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          Hasta {transport.capacity} personas
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {duration} horas estimadas
                        </div>
                        {transport.includesDriver && (
                          <div className="flex items-center gap-1">
                            <Car className="h-4 w-4" />
                            Conductor incluido
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">
                        ${estimatedCost.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-500">
                        {transport.pricePerGuest ? `$${transport.pricePerGuest}/persona` : `$${transport.pricePerHour}/hora`}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={duration}
                        onChange={(e) => onUpdateItem(item.id, { 
                          customizations: { ...item.customizations, duration: parseInt(e.target.value) || 2 }
                        })}
                        min="1"
                        max="24"
                        className="w-20 h-8 text-xs"
                      />
                      <span className="text-xs text-slate-500">horas</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Quitar
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Available Transport */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Car className="h-5 w-5 text-orange-600" />
            Servicios de Transporte Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Car className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p className="font-medium">No se encontraron servicios de transporte</p>
              <p className="text-sm mt-1">Intenta ajustar tu búsqueda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => {
                const isSelected = selectedTransport.some(item => item.templateId === template.id);
                const estimatedCost = calculateTransportCost(template);
                const isCapacitySufficient = template.capacity >= guestCount;
                
                return (
                  <div key={template.id} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getVehicleIcon(template.type)}
                          <h4 className="font-medium text-slate-900">{template.name}</h4>
                          <Badge className={getVehicleColor(template.type)}>
                            {template.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{template.description}</p>
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span className={!isCapacitySufficient ? 'text-red-600 font-medium' : ''}>
                              Hasta {template.capacity} personas
                            </span>
                          </div>
                          {template.includesDriver && (
                            <div className="flex items-center gap-1">
                              <Car className="h-4 w-4" />
                              Conductor incluido
                            </div>
                          )}
                        </div>
                        {!isCapacitySufficient && (
                          <div className="text-xs text-red-600 mt-1">
                            ⚠️ Capacidad insuficiente para {guestCount} invitados
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-sm">
                        <div className="font-medium text-green-600">
                          ${estimatedCost.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500">
                          {template.pricePerGuest 
                            ? `$${template.pricePerGuest}/persona` 
                            : `$${template.pricePerHour}/hora`
                          }
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => onAddItem(template)}
                        disabled={isSelected || !isCapacitySufficient}
                        className={`flex items-center gap-2 ${
                          isSelected 
                            ? 'bg-slate-300 cursor-not-allowed' 
                            : !isCapacitySufficient
                            ? 'bg-red-300 cursor-not-allowed'
                            : 'bg-orange-600 hover:bg-orange-700 text-white'
                        }`}
                      >
                        <Plus className="h-3 w-3" />
                        {isSelected ? 'Agregado' : 'Agregar'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transport Guidelines */}
      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle className="text-sm text-slate-600 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Guías de Transporte
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-600">
          <div className="flex items-start gap-3">
            <Clock className="h-4 w-4 mt-0.5 text-slate-400" />
            <div>
              <p className="font-medium">Consideraciones de Tiempo</p>
              <p>Incluye tiempo de viaje entre venues y actividades. Considera tráfico en horas pico.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="h-4 w-4 mt-0.5 text-slate-400" />
            <div>
              <p className="font-medium">Tamaño del Grupo</p>
              <p>Selecciona vehículos que acomoden cómodamente a todo el grupo con espacio para equipaje.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Car className="h-4 w-4 mt-0.5 text-slate-400" />
            <div>
              <p className="font-medium">Tipos de Vehículo</p>
              <p>Considera opciones de lujo para ocasiones especiales o opciones prácticas para distancias largas.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportTab;
