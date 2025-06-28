
import React from 'react';
import { Save, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface BudgetFormActionsProps {
  onCancel: () => void;
  onSave: () => void;
  hasErrors: boolean;
}

const BudgetFormActions: React.FC<BudgetFormActionsProps> = ({
  onCancel,
  onSave,
  hasErrors
}) => {
  return (
    <Card className="border-t-2 border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            {hasErrors ? (
              <span className="text-red-600 font-medium">
                Please fix all errors before saving
              </span>
            ) : (
              <span>
                Review your budget and save when ready
              </span>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            
            <Button
              onClick={onSave}
              disabled={hasErrors}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700"
            >
              <Save className="h-4 w-4" />
              Save Budget
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetFormActions;
