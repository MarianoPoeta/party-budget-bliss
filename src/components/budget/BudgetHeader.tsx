
import React from 'react';
import { DollarSign } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';

interface BudgetHeaderProps {
  budget: any;
  totalAmount: number;
  updateBudgetField: (field: string, value: any) => void;
}

const BudgetHeader: React.FC<BudgetHeaderProps> = ({
  budget,
  totalAmount,
  updateBudgetField
}) => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Client Name</label>
            <Input
              value={budget.clientName || ''}
              onChange={(e) => updateBudgetField('clientName', e.target.value)}
              placeholder="Enter client name"
              className="bg-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Event Date</label>
            <Input
              type="date"
              value={budget.eventDate || ''}
              onChange={(e) => updateBudgetField('eventDate', e.target.value)}
              className="bg-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Guest Count</label>
            <Input
              type="number"
              value={budget.guestCount || 0}
              onChange={(e) => updateBudgetField('guestCount', parseInt(e.target.value) || 0)}
              min="1"
              className="bg-white"
            />
          </div>
          <div className="flex items-end">
            <div className="bg-white p-3 rounded-lg border shadow-sm w-full">
              <div className="text-2xl font-bold text-green-600 flex items-center">
                <DollarSign className="h-5 w-5 mr-1" />
                {totalAmount.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">Total Budget</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetHeader;
