
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface RevenueBreakdownCardProps {
  totalRevenue: number;
  pendingRevenue: number;
}

const RevenueBreakdownCard: React.FC<RevenueBreakdownCardProps> = ({
  totalRevenue,
  pendingRevenue
}) => {
  const totalAmount = totalRevenue + pendingRevenue;

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Revenue Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Paid Budgets</span>
            <span className="text-sm text-slate-600">${totalRevenue.toLocaleString()}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full" 
              style={{ width: `${(totalRevenue / totalAmount) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Pending Budgets</span>
            <span className="text-sm text-slate-600">${pendingRevenue.toLocaleString()}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-orange-600 h-2 rounded-full" 
              style={{ width: `${(pendingRevenue / totalAmount) * 100}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueBreakdownCard;
