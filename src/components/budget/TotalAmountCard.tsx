
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { DollarSign } from 'lucide-react';

interface TotalAmountCardProps {
  totalAmount: number;
}

const TotalAmountCard: React.FC<TotalAmountCardProps> = ({ totalAmount }) => {
  return (
    <Card className="border-slate-200 bg-slate-50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <DollarSign className="h-6 w-6 text-slate-600 mr-2" />
            <span className="text-lg font-semibold text-slate-700">Total Amount</span>
          </div>
          <span className="text-2xl font-bold text-slate-900">${totalAmount?.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalAmountCard;
