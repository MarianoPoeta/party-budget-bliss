
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DollarSign } from 'lucide-react';

interface TotalAmountCardProps {
  totalAmount: number;
}

const TotalAmountCard: React.FC<TotalAmountCardProps> = ({ totalAmount }) => {
  return (
    <Card className="border-slate-200 bg-slate-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Total Amount
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-slate-900">
          ${totalAmount.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalAmountCard;
