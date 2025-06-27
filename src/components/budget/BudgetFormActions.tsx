
import React from 'react';
import { Button } from '../ui/button';

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
    <div className="flex items-center justify-end gap-4 pt-6 border-t">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button
        onClick={onSave}
        className="bg-green-600 hover:bg-green-700 px-8"
        disabled={hasErrors}
      >
        Save Budget
      </Button>
    </div>
  );
};

export default BudgetFormActions;
