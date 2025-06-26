
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface BudgetsSummaryCardsProps {
  totalBudgets: number;
  totalRevenue: number;
  pendingRevenue: number;
  statusCounts: {
    pending: number;
    paid: number;
    canceled: number;
  };
}

const BudgetsSummaryCards: React.FC<BudgetsSummaryCardsProps> = ({
  totalBudgets,
  totalRevenue,
  pendingRevenue,
  statusCounts
}) => {
  const conversionRate = Math.round((statusCounts.paid / totalBudgets) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Total Budgets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">{totalBudgets}</div>
          <p className="text-xs text-slate-500 mt-1">All time</p>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Confirmed Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">{statusCounts.paid} paid budgets</p>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Pending Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">${pendingRevenue.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">{statusCounts.pending} pending budgets</p>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Conversion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{conversionRate}%</div>
          <p className="text-xs text-slate-500 mt-1">Paid vs total</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetsSummaryCards;
