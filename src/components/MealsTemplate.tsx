import React from 'react';
import { UtensilsCrossed, Users, DollarSign, Clock, MapPin } from 'lucide-react';
import { MealTemplate } from '../types/Budget';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface MealsTemplateProps {
  items: MealTemplate[];
  onSelect?: (item: MealTemplate) => void;
  editable?: boolean;
  editableItem?: MealTemplate;
  onChange?: (updated: MealTemplate) => void;
  onRemove?: () => void;
}

const MealsTemplate: React.FC<MealsTemplateProps> = ({
  items,
  onSelect,
  editable = false,
  editableItem,
  onChange,
  onRemove
}) => {
  const typeColors = {
    breakfast: 'bg-yellow-100 text-yellow-800',
    lunch: 'bg-blue-100 text-blue-800',
    dinner: 'bg-purple-100 text-purple-800',
    brunch: 'bg-green-100 text-green-800',
    cocktail: 'bg-pink-100 text-pink-800',
    catering: 'bg-orange-100 text-orange-800',
  };

  if (editable && editableItem) {
    return (
      <Card className="border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">Editar Comida</CardTitle>
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
              <label className="text-xs font-medium text-slate-600">Restaurante</label>
              <Input
                value={editableItem.restaurant}
                onChange={(e) => onChange?.({ ...editableItem, restaurant: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Precio por Persona</label>
              <Input
                type="number"
                value={editableItem.pricePerPerson}
                onChange={(e) => onChange?.({ ...editableItem, pricePerPerson: Number(e.target.value) })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Min Personas</label>
              <Input
                type="number"
                value={editableItem.minPeople}
                onChange={(e) => onChange?.({ ...editableItem, minPeople: Number(e.target.value) })}
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
      <h3 className="text-lg font-semibold text-slate-900">Seleccionar Comidas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((meal) => (
          <Card key={meal.id} className="hover:shadow-md transition-shadow cursor-pointer border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 mb-1">{meal.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[meal.type]}`}>
                    {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
                  </span>
                </div>
                <UtensilsCrossed className="h-5 w-5 text-slate-400" />
              </div>
              
              <p className="text-sm text-slate-600 mb-3">{meal.description}</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4">
                <div className="flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" />
                  ${meal.pricePerPerson}/persona
                </div>
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {meal.minPeople}-{meal.maxPeople} personas
                </div>
                <div className="flex items-center col-span-2">
                  <MapPin className="h-3 w-3 mr-1" />
                  {meal.restaurant}
                </div>
              </div>
              
              <Button 
                size="sm" 
                className="w-full bg-slate-800 hover:bg-slate-700"
                onClick={() => onSelect?.(meal)}
              >
                Seleccionar Comida
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MealsTemplate;
