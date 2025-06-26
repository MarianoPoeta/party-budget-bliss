
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Plus, Minus } from 'lucide-react';

interface ExtrasSectionProps {
  extras: number;
  isOpen: boolean;
  onToggle: () => void;
  onExtrasChange: (value: number) => void;
}

const ExtrasSection: React.FC<ExtrasSectionProps> = ({
  extras,
  isOpen,
  onToggle,
  onExtrasChange
}) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card className="border-slate-200">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-slate-50">
            <CardTitle className="flex items-center justify-between">
              Extras
              {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <div>
              <label className="text-sm font-medium text-slate-700">Additional Costs</label>
              <Input
                type="number"
                value={extras}
                onChange={(e) => onExtrasChange(Number(e.target.value) || 0)}
                className="mt-1"
                placeholder="Enter any additional costs..."
              />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default ExtrasSection;
