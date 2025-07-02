import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface BasicInfoSectionProps {
  clientName: string;
  eventDate: string;
  guestCount: number;
  isOpen: boolean;
  onToggle: () => void;
  onClientNameChange: (value: string) => void;
  onEventDateChange: (value: string) => void;
  onGuestCountChange: (value: number) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  clientName,
  eventDate,
  guestCount,
  isOpen,
  onToggle,
  onClientNameChange,
  onEventDateChange,
  onGuestCountChange
}) => {
  return (
    <Card className="border-slate-200">
      <CardHeader 
        className="cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Información Básica</h2>
          {isOpen ? (
            <ChevronDown className="h-5 w-5 text-slate-600" />
          ) : (
            <ChevronRight className="h-5 w-5 text-slate-600" />
          )}
        </div>
      </CardHeader>
      
      {isOpen && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="clientName">Nombre del Cliente</Label>
              <Input
                id="clientName"
                type="text"
                value={clientName}
                onChange={(e) => onClientNameChange(e.target.value)}
                placeholder="Ingresa el nombre del cliente"
              />
            </div>
            
            <div>
              <Label htmlFor="eventDate">Fecha del Evento</Label>
              <Input
                id="eventDate"
                type="date"
                value={eventDate}
                onChange={(e) => onEventDateChange(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="guestCount">Cantidad de Invitados</Label>
              <Input
                id="guestCount"
                type="number"
                value={guestCount || ''}
                onChange={(e) => onGuestCountChange(parseInt(e.target.value) || 0)}
                placeholder="Número de invitados"
                min="1"
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default BasicInfoSection;
