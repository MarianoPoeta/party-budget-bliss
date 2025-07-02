import React from 'react';
import { Truck, Users, DollarSign, Clock } from 'lucide-react';
import { TransportTemplate as TransportTemplateType } from '../types/Budget';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface TransportTemplateProps {
  items: TransportTemplateType[];
  onSelect?: (item: TransportTemplateType) => void;
  editable?: boolean;
  editableItem?: TransportTemplateType;
  onChange?: (updated: TransportTemplateType) => void;
  onRemove?: () => void;
}

const TransportTemplate: React.FC<TransportTemplateProps> = ({
  items,
  onSelect,
  editable = false,
  editableItem,
  onChange,
  onRemove
}) => {
  const vehicleColors = {
    bus: 'bg-blue-100 text-blue-800',
    minivan: 'bg-green-100 text-green-800',
    car: 'bg-gray-100 text-gray-800',
    limousine: 'bg-purple-100 text-purple-800',
    boat: 'bg-cyan-100 text-cyan-800',
  };

  if (editable && editableItem) {
    return (
      <Card className="border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">Editar Transporte</CardTitle>
          {onRemove && (
            <Button variant="ghost" size="sm" onClick={onRemove}>
              Eliminar
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-600">Nombre</label>
              <Input
                value={editableItem.name}
                onChange={(e) => onChange?.({ ...editableItem, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Capacidad</label>
              <Input
                type="number"
                value={editableItem.capacity}
                onChange={(e) => onChange?.({ ...editableItem, capacity: Number(e.target.value) })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Precio por Hora</label>
              <Input
                type="number"
                value={editableItem.pricePerHour}
                onChange={(e) => onChange?.({ ...editableItem, pricePerHour: Number(e.target.value) })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Precio por Km</label>
              <Input
                type="number"
                value={editableItem.pricePerKm || 0}
                onChange={(e) => onChange?.({ ...editableItem, pricePerKm: Number(e.target.value) })}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Seleccionar Transporte</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((transport) => (
          <Card key={transport.id} className="hover:shadow-md transition-shadow cursor-pointer border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 mb-1">{transport.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${vehicleColors[transport.vehicleType]}`}>
                    {transport.vehicleType.charAt(0).toUpperCase() + transport.vehicleType.slice(1)}
                  </span>
                </div>
                <Truck className="h-5 w-5 text-slate-400" />
              </div>
              
              <p className="text-sm text-slate-600 mb-3">{transport.description}</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4">
                <div className="flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" />
                  ${transport.pricePerHour}/hora
                </div>
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {transport.capacity} personas
                </div>
                <div className="flex items-center col-span-2">
                  <span className="text-xs">
                    {transport.includesDriver ? '✓ Conductor incluido' : '✗ Conductor no incluido'}
                  </span>
                </div>
              </div>
              
              <Button 
                size="sm" 
                className="w-full bg-slate-800 hover:bg-slate-700"
                onClick={() => onSelect?.(transport)}
              >
                Seleccionar Transporte
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TransportTemplate;
