
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Plus, Minus } from 'lucide-react';

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
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card className="border-slate-200">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-slate-50">
            <CardTitle className="flex items-center justify-between">
              Basic Information
              {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Client Name</label>
                <Input
                  value={clientName}
                  onChange={(e) => onClientNameChange(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Event Date</label>
                <Input
                  type="date"
                  value={eventDate}
                  onChange={(e) => onEventDateChange(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Guest Count</label>
                <Input
                  type="number"
                  value={guestCount || ''}
                  onChange={(e) => onGuestCountChange(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default BasicInfoSection;
