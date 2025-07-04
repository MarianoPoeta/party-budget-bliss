import React, { useMemo } from 'react';
import { Search, Plus, Bed, MapPin, Star, Wifi, Car, Coffee, Waves, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { BudgetItem } from '../../types/EnhancedBudget';
import { Accommodation } from '../../types/Accommodation';

interface StayTabProps {
  templates: Accommodation[];
  selectedStay?: BudgetItem;
  searchTerm: string;
  guestCount: number;
  onSearchChange: (value: string) => void;
  onAddItem: (template: Accommodation) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateItem: (itemId: string, updates: Partial<BudgetItem>) => void;
}

const StayTab: React.FC<StayTabProps> = ({
  templates,
  selectedStay,
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
      template.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.roomType.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [templates, searchTerm]
  );

  const amenityIcons = {
    'WiFi': Wifi,
    'Wifi': Wifi,
    'Desayuno': Coffee,
    'Breakfast': Coffee,
    'Piscina': Waves,
    'Pool': Waves,
    'Estacionamiento': Car,
    'Parking': Car,
    'Gimnasio': Bed,
    'Gym': Bed,
    'Spa': Star,
    'Restaurante': Coffee,
    'Restaurant': Coffee,
    'Bar': Coffee,
    'Playa Privada': Waves,
    'Parrilla': Coffee,
    'Jacuzzi': Waves,
    'Terraza': MapPin
  };

  const getRoomTypeColor = (roomType: string) => {
    const colors = {
      single: 'bg-blue-100 text-blue-800 border-blue-200',
      double: 'bg-green-100 text-green-800 border-green-200',
      suite: 'bg-purple-100 text-purple-800 border-purple-200',
      apartment: 'bg-orange-100 text-orange-800 border-orange-200',
      villa: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      hostel: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[roomType as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRoomTypeIcon = (roomType: string) => {
    const icons = {
      single: '🛏️',
      double: '🛏️🛏️',
      suite: '🏨',
      apartment: '🏢',
      villa: '🏡',
      hostel: '🏠',
    };
    return icons[roomType as keyof typeof icons] || '🏨';
  };

  const calculateStayCost = (accommodation: Accommodation, nights: number = 1) => {
    const roomsNeeded = Math.ceil(guestCount / accommodation.maxCapacity);
    return accommodation.pricePerNight * nights * roomsNeeded;
  };

  const calculateRoomsNeeded = (accommodation: Accommodation) => {
    return Math.ceil(guestCount / accommodation.maxCapacity);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input
          placeholder="Buscar alojamientos por nombre, ubicación o tipo..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Guest Count Info */}
      {guestCount > 0 && (
        <Alert className="border-blue-200 bg-blue-50">
          <Users className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <span className="font-medium">Calculando para {guestCount} invitados.</span> Las habitaciones se calculan automáticamente según la capacidad máxima de cada alojamiento.
          </AlertDescription>
        </Alert>
      )}

      {/* Selected Stay */}
      {selectedStay && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bed className="h-5 w-5 text-purple-600" />
              Alojamiento Seleccionado
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const accommodation = selectedStay.template as Accommodation;
              const nights = (selectedStay.customizations?.nights as number) || 1;
              const roomsNeeded = calculateRoomsNeeded(accommodation);
              const totalCost = calculateStayCost(accommodation, nights);

              return (
                <div className="p-4 border rounded-lg space-y-4 bg-purple-50 border-purple-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{getRoomTypeIcon(accommodation.roomType)}</span>
                        <h4 className="font-medium text-slate-900">{accommodation.name}</h4>
                        <Badge className={getRoomTypeColor(accommodation.roomType)}>
                          {accommodation.roomType}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {[...Array(accommodation.rating)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{accommodation.description}</p>
                      <div className="flex items-center gap-1 text-sm text-slate-500 mb-2">
                        <MapPin className="h-4 w-4" />
                        {accommodation.location}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          Hasta {accommodation.maxCapacity} por habitación
                        </div>
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          {roomsNeeded} habitación{roomsNeeded !== 1 ? 'es' : ''} necesaria{roomsNeeded !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ${totalCost.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-500">
                        ${accommodation.pricePerNight}/noche × {nights} noche{nights !== 1 ? 's' : ''} × {roomsNeeded} habitación{roomsNeeded !== 1 ? 'es' : ''}
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-slate-700">Amenidades:</div>
                    <div className="flex flex-wrap gap-2">
                      {accommodation.amenities.map((amenity, index) => {
                        const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons];
                        return (
                          <div key={index} className="flex items-center gap-1 bg-white px-2 py-1 rounded text-xs text-slate-600 border">
                            {IconComponent && <IconComponent className="h-3 w-3" />}
                            {amenity}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-purple-200">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <Input
                        type="number"
                        value={nights}
                        onChange={(e) => onUpdateItem(selectedStay.id, { 
                          customizations: { ...selectedStay.customizations, nights: parseInt(e.target.value) || 1 }
                        })}
                        min="1"
                        max="30"
                        className="w-20 h-8 text-xs"
                      />
                      <span className="text-xs text-slate-500">noche{nights !== 1 ? 's' : ''}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onRemoveItem(selectedStay.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Quitar Alojamiento
                    </Button>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Available Accommodations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bed className="h-5 w-5 text-purple-600" />
            Alojamientos Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Bed className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p className="font-medium">No se encontraron alojamientos</p>
              <p className="text-sm mt-1">Intenta ajustar tu búsqueda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTemplates.map((template) => {
                const isSelected = selectedStay?.templateId === template.id;
                const roomsNeeded = calculateRoomsNeeded(template);
                const estimatedCost = calculateStayCost(template);
                
                return (
                  <div key={template.id} className="border rounded-lg p-4 space-y-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{getRoomTypeIcon(template.roomType)}</span>
                          <h4 className="font-medium text-slate-900">{template.name}</h4>
                          <Badge className={getRoomTypeColor(template.roomType)}>
                            {template.roomType}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            {[...Array(template.rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="text-sm text-slate-500">({template.rating} estrellas)</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{template.description}</p>
                        <div className="flex items-center gap-1 text-sm text-slate-500 mb-3">
                          <MapPin className="h-4 w-4" />
                          {template.location}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            Hasta {template.maxCapacity} por habitación
                          </div>
                          <div className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            {roomsNeeded} habitación{roomsNeeded !== 1 ? 'es' : ''} necesaria{roomsNeeded !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-slate-700">Amenidades:</div>
                      <div className="flex flex-wrap gap-2">
                        {template.amenities.slice(0, 6).map((amenity, index) => {
                          const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons];
                          return (
                            <div key={index} className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded text-xs text-slate-600">
                              {IconComponent && <IconComponent className="h-3 w-3" />}
                              {amenity}
                            </div>
                          );
                        })}
                        {template.amenities.length > 6 && (
                          <div className="bg-slate-100 px-2 py-1 rounded text-xs text-slate-600">
                            +{template.amenities.length - 6} más
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="text-sm">
                        <div className="font-bold text-green-600 text-lg">
                          ${estimatedCost.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500">
                          ${template.pricePerNight}/noche × {roomsNeeded} habitación{roomsNeeded !== 1 ? 'es' : ''}
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => onAddItem(template)}
                        disabled={isSelected}
                        className={`flex items-center gap-2 ${
                          isSelected 
                            ? 'bg-slate-300 cursor-not-allowed' 
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                      >
                        <Plus className="h-3 w-3" />
                        {isSelected ? 'Seleccionado' : 'Seleccionar'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Accommodation Guidelines */}
      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle className="text-sm text-slate-600 flex items-center gap-2">
            <Bed className="h-4 w-4" />
            Guías de Alojamiento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-600">
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 mt-0.5 text-slate-400" />
            <div>
              <p className="font-medium">Ubicación</p>
              <p>Selecciona ubicaciones cerca de las actividades planificadas para minimizar tiempo de viaje.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Bed className="h-4 w-4 mt-0.5 text-slate-400" />
            <div>
              <p className="font-medium">Configuración de Habitaciones</p>
              <p>Considera la dinámica del grupo al seleccionar alojamientos individuales, dobles o compartidos.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Star className="h-4 w-4 mt-0.5 text-slate-400" />
            <div>
              <p className="font-medium">Amenidades</p>
              <p>Busca amenidades que mejoren la experiencia de la despedida de soltero.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="h-4 w-4 mt-0.5 text-slate-400" />
            <div>
              <p className="font-medium">Capacidad y Habitaciones</p>
              <p>El número de habitaciones se calcula automáticamente basado en la capacidad máxima y el número de invitados.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StayTab; 