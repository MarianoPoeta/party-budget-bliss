import React from 'react';
import { Users, DollarSign, Clock, MapPin, Truck } from 'lucide-react';
import { ActivityTemplate } from '../types/Budget';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ActivitiesTemplateProps {
  items: ActivityTemplate[];
  onSelect?: (item: ActivityTemplate) => void;
  editable?: boolean;
  editableItem?: ActivityTemplate;
  onChange?: (updated: ActivityTemplate) => void;
  onRemove?: () => void;
}

const ActivitiesTemplate: React.FC<ActivitiesTemplateProps> = ({
  items,
  onSelect,
  editable = false,
  editableItem,
  onChange,
  onRemove
}) => {
  const categoryColors = {
    outdoor: 'bg-green-100 text-green-800',
    indoor: 'bg-blue-100 text-blue-800',
    nightlife: 'bg-purple-100 text-purple-800',
    dining: 'bg-orange-100 text-orange-800',
    adventure: 'bg-red-100 text-red-800',
    cultural: 'bg-indigo-100 text-indigo-800',
  };

  if (editable && editableItem) {
    return (
      <Card className="border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">Editar Actividad</CardTitle>
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
              <label className="text-xs font-medium text-slate-600">Ubicación</label>
              <Input
                value={editableItem.location}
                onChange={(e) => onChange?.({ ...editableItem, location: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Precio Base</label>
              <Input
                type="number"
                value={editableItem.basePrice}
                onChange={(e) => onChange?.({ ...editableItem, basePrice: Number(e.target.value) })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Duración (horas)</label>
              <Input
                type="number"
                value={editableItem.duration}
                onChange={(e) => onChange?.({ ...editableItem, duration: Number(e.target.value) })}
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
      <h3 className="text-lg font-semibold text-slate-900">Seleccionar Actividades</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((activity) => (
          <Card key={activity.id} className="hover:shadow-md transition-shadow cursor-pointer border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 mb-1">{activity.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[activity.category]}`}>
                    {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
                  </span>
                </div>
                {activity.transportRequired && <Truck className="h-4 w-4 text-slate-400" />}
              </div>
              
              <p className="text-sm text-slate-600 mb-3">{activity.description}</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4">
                <div className="flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" />
                  ${activity.basePrice}
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {activity.duration}h
                </div>
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  Max {activity.maxCapacity}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {activity.location}
                </div>
              </div>
              
              <Button 
                size="sm" 
                className="w-full bg-slate-800 hover:bg-slate-700"
                onClick={() => onSelect?.(activity)}
              >
                Seleccionar Actividad
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActivitiesTemplate;
