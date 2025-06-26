
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

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
    <Card className="border-slate-200">
      <CardHeader 
        className="cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Extras</h2>
          {isOpen ? (
            <ChevronDown className="h-5 w-5 text-slate-600" />
          ) : (
            <ChevronRight className="h-5 w-5 text-slate-600" />
          )}
        </div>
      </CardHeader>
      
      {isOpen && (
        <CardContent>
          <div className="max-w-sm">
            <Label htmlFor="extras">Additional Costs</Label>
            <Input
              id="extras"
              type="number"
              value={extras || ''}
              onChange={(e) => onExtrasChange(parseFloat(e.target.value) || 0)}
              placeholder="Enter additional costs"
              min="0"
              step="0.01"
            />
            <p className="text-sm text-slate-600 mt-1">
              Any additional costs not covered by templates
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ExtrasSection;
