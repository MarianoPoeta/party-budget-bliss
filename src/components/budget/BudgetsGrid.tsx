
import React from 'react';
import BudgetCard from '../BudgetCard';

interface Budget {
  id: string;
  clientName: string;
  eventDate: string;
  totalAmount: number;
  guestCount: number;
  status: 'pending' | 'paid' | 'canceled';
  activities: string[];
}

interface BudgetsGridProps {
  budgets: Budget[];
  onBudgetClick: (budgetId: string) => void;
}

const BudgetsGrid: React.FC<BudgetsGridProps> = ({ budgets, onBudgetClick }) => {
  if (budgets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 text-lg">No budgets found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {budgets.map((budget) => (
        <BudgetCard
          key={budget.id}
          {...budget}
          onClick={() => onBudgetClick(budget.id)}
        />
      ))}
    </div>
  );
};

export default BudgetsGrid;
