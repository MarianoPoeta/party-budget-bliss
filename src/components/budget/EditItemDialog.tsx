import React, { useState, useEffect } from 'react';
import { X, Save, Users, DollarSign, Clock, MapPin } from 'lucide-react';
import { BudgetItem, MenuBudgetItem } from '../../types/EnhancedBudget';
import { Menu } from '../../types/Menu';
import { ActivityTemplate, TransportTemplate, StayTemplate } from '../../types/Budget';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

interface EditItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem: { item: BudgetItem; type: string; index: number } | null;
  onSave: (type: string, index: number, updatedItem: BudgetItem) => void;
  guestCount: number;
}

const EditItemDialog: React.FC<EditItemDialogProps> = ({
  isOpen,
  onClose,
  editingItem,
  onSave,
  guestCount
}) => {
  const [editedItem, setEditedItem] = useState<BudgetItem | null>(null);
  const [customizations, setCustomizations] = useState<Record<string, any>>({});

  useEffect(() => {
    if (editingItem) {
      setEditedItem(editingItem.item);
      setCustomizations(editingItem.item.customizations || {});
    }
  }, [editingItem]);

  const handleSave = () => {
    if (editingItem && editedItem) {
      const updatedItem = {
        ...editedItem,
        customizations: { ...customizations }
      };
      onSave(editingItem.type, editingItem.index, updatedItem);
      onClose();
    }
  };

  const renderMenuEdit = () => {
    if (!editedItem) return null;
    const menu = editedItem.template as Menu;
    const menuItem = editedItem as MenuBudgetItem;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Nombre del Menú</Label>
            <Input value={menu.name} disabled className="mt-1 bg-slate-50" />
          </div>
          <div>
            <Label>Restaurante</Label>
            <Input value={menu.restaurant} disabled className="mt-1 bg-slate-50" />
          </div>
          <div>
            <Label>Cantidad de Invitados</Label>
            <Input 
              type="number"
              value={menuItem.customizations?.guestCount || guestCount}
              onChange={(e) => {
                const newGuestCount = parseInt(e.target.value) || 0;
                const newCalculatedPrice = menu.pricePerPerson * newGuestCount;
                setCustomizations(prev => ({
                  ...prev,
                  guestCount: newGuestCount,
                  calculatedPrice: newCalculatedPrice
                }));
              }}
              className="mt-1"
              min="1"
            />
          </div>
          <div>
            <Label>Precio Calculado</Label>
            <Input 
              value={`$${(menuItem.customizations?.calculatedPrice || menu.pricePerPerson * guestCount).toLocaleString()}`}
              disabled
              className="mt-1 bg-slate-50"
            />
          </div>
        </div>
        
        <div>
          <Label>Descripción</Label>
          <Textarea value={menu.description} disabled className="mt-1 bg-slate-50" rows={3} />
        </div>

        <div>
          <Label>Elementos del Menú</Label>
          <div className="mt-2 space-y-2">
            {menu.items?.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
                <Badge variant="outline">${item.price}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderActivityEdit = () => {
    if (!editedItem) return null;
    const activity = editedItem.template as ActivityTemplate;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Nombre de la Actividad</Label>
            <Input value={activity.name} disabled className="mt-1 bg-slate-50" />
          </div>
          <div>
            <Label>Ubicación</Label>
            <Input value={activity.location} disabled className="mt-1 bg-slate-50" />
          </div>
          <div>
            <Label>Precio Base</Label>
            <Input value={`$${activity.basePrice}`} disabled className="mt-1 bg-slate-50" />
          </div>
          <div>
            <Label>Duración (horas)</Label>
            <Input value={activity.duration} disabled className="mt-1 bg-slate-50" />
          </div>
          <div>
            <Label>Capacidad Máxima</Label>
            <Input value={activity.maxCapacity} disabled className="mt-1 bg-slate-50" />
          </div>
          <div>
            <Label>Categoría</Label>
            <Input value={activity.category} disabled className="mt-1 bg-slate-50" />
          </div>
        </div>
        
        <div>
          <Label>Descripción</Label>
          <Textarea value={activity.description} disabled className="mt-1 bg-slate-50" rows={3} />
        </div>

        <div className="flex items-center gap-2">
          <Label>Transporte Requerido</Label>
          <Badge variant={activity.transportRequired ? "destructive" : "secondary"}>
            {activity.transportRequired ? "Sí" : "No"}
          </Badge>
        </div>

        {activity.transportRequired && (
          <div>
            <Label>Costo de Transporte</Label>
            <Input value={`$${activity.transportCost || 0}`} disabled className="mt-1 bg-slate-50" />
          </div>
        )}

        <div>
          <Label>Notas</Label>
          <Textarea 
            value={customizations.notes || ''}
            onChange={(e) => setCustomizations(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Agregar cualquier requisito especial o notas..."
            className="mt-1"
            rows={3}
          />
        </div>
      </div>
    );
  };

  const renderTransportEdit = () => {
    if (!editedItem) return null;
    const transport = editedItem.template as TransportTemplate;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Nombre del Transporte</Label>
            <Input value={transport.name} disabled className="mt-1 bg-slate-50" />
          </div>
          <div>
            <Label>Tipo de Vehículo</Label>
            <Input value={transport.vehicleType} disabled className="mt-1 bg-slate-50" />
          </div>
          <div>
            <Label>Capacidad</Label>
            <Input value={transport.capacity} disabled className="mt-1 bg-slate-50" />
          </div>
          <div>
            <Label>Precio por Hora</Label>
            <Input value={`$${transport.pricePerHour}`} disabled className="mt-1 bg-slate-50" />
          </div>
          <div>
            <Label>Horas Estimadas</Label>
            <Input 
              type="number"
              value={customizations.estimatedHours || 2}
              onChange={(e) => setCustomizations(prev => ({ 
                ...prev, 
                estimatedHours: parseInt(e.target.value) || 2 
              }))}
              className="mt-1"
              min="1"
            />
          </div>
          <div>
            <Label>Precio Calculado</Label>
            <Input 
              value={`$${(transport.pricePerHour * (customizations.estimatedHours || 2)).toLocaleString()}`}
              disabled
              className="mt-1 bg-slate-50"
            />
          </div>
        </div>
        
        <div>
          <Label>Descripción</Label>
          <Textarea value={transport.description} disabled className="mt-1 bg-slate-50" rows={3} />
        </div>

        <div>
          <Label>Notas</Label>
          <Textarea 
            value={customizations.notes || ''}
            onChange={(e) => setCustomizations(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Agregar cualquier requisito especial o notas..."
            className="mt-1"
            rows={3}
          />
        </div>
      </div>
    );
  };

  const renderStayEdit = () => {
    if (!editedItem) return null;
    const stay = editedItem.template as StayTemplate;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Nombre del Alojamiento</Label>
            <Input value={stay.name} disabled className="mt-1 bg-slate-50" />
          </div>
          <div>
            <Label>Ubicación</Label>
            <Input value={stay.location} disabled className="mt-1 bg-slate-50" />
          </div>
          <div>
            <Label>Precio por Noche</Label>
            <Input value={`$${stay.pricePerNight}`} disabled className="mt-1 bg-slate-50" />
          </div>
          <div>
            <Label>Ocupación Máxima</Label>
            <Input value={stay.maxOccupancy} disabled className="mt-1 bg-slate-50" />
          </div>
          <div>
            <Label>Tipo de Habitación</Label>
            <Input value={stay.roomType} disabled className="mt-1 bg-slate-50" />
          </div>
          <div>
            <Label>Calificación</Label>
            <Input value={stay.rating} disabled className="mt-1 bg-slate-50" />
          </div>
          <div>
            <Label>Número de Noches</Label>
            <Input 
              type="number"
              value={customizations.nights || 1}
              onChange={(e) => setCustomizations(prev => ({ 
                ...prev, 
                nights: parseInt(e.target.value) || 1 
              }))}
              className="mt-1"
              min="1"
            />
          </div>
          <div>
            <Label>Precio Calculado</Label>
            <Input 
              value={`$${(stay.pricePerNight * Math.ceil(guestCount / stay.maxOccupancy) * (customizations.nights || 1)).toLocaleString()}`}
              disabled
              className="mt-1 bg-slate-50"
            />
          </div>
        </div>
        
        <div>
          <Label>Descripción</Label>
          <Textarea value={stay.description} disabled className="mt-1 bg-slate-50" rows={3} />
        </div>

        <div>
          <Label>Amenidades</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {stay.amenities.map((amenity, index) => (
              <Badge key={index} variant="outline">{amenity}</Badge>
            ))}
          </div>
        </div>

        <div>
          <Label>Notas</Label>
          <Textarea 
            value={customizations.notes || ''}
            onChange={(e) => setCustomizations(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Agregar cualquier requisito especial o notas..."
            className="mt-1"
            rows={3}
          />
        </div>
      </div>
    );
  };

  const getEditContent = () => {
    if (!editingItem || !editedItem) return null;

    switch (editingItem.type) {
      case 'meals':
        return renderMenuEdit();
      case 'activities':
        return renderActivityEdit();
      case 'transport':
        return renderTransportEdit();
      case 'stay':
        return renderStayEdit();
      default:
        return <div>Tipo de elemento desconocido</div>;
    }
  };

  const getDialogTitle = () => {
    if (!editingItem) return 'Editar Elemento';
    
    switch (editingItem.type) {
      case 'meals':
        return 'Editar Menú';
      case 'activities':
        return 'Editar Actividad';
      case 'transport':
        return 'Editar Transporte';
      case 'stay':
        return 'Editar Alojamiento';
      default:
        return 'Editar Elemento';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getDialogTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {getEditContent()}
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemDialog; 