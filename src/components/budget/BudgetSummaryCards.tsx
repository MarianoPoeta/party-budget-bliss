
import React from 'react';
import { Card, CardContent } from '../ui/card';

interface Budget {
  id: string;
  clientName: string;
  eventDate: string;
  totalAmount: number;
  guestCount: number;
  status: 'pending' | 'paid' | 'canceled';
  isClosed: boolean;
  paymentStatus: 'unpaid' | 'partially_paid' | 'paid';
  activities: string[];
  createdAt: string;
}

interface BudgetSummaryCardsProps {
  budgets: Budget[];
}

const BudgetSummaryCards: React.FC<BudgetSummaryCardsProps> = ({ budgets }) => {
  const totalRevenue = budgets
    .filter(b => b.status === 'paid' || b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const pendingRevenue = budgets
    .filter(b => b.status === 'pending' || b.paymentStatus === 'unpaid')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const closedBudgets = budgets.filter(b => b.isClosed).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-slate-900">{budgets.length}</div>
          <p className="text-sm text-slate-600">Total Budgets</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div>
          <p className="text-sm text-slate-600">Confirmed Revenue</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-orange-600">${pendingRevenue.toLocaleString()}</div>
          <p className="text-sm text-slate-600">Pending Revenue</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-600">{closedBudgets}</div>
          <p className="text-sm text-slate-600">Closed Budgets</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetSummaryCards;
