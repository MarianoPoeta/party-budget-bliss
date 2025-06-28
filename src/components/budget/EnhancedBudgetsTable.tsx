
import React from 'react';
import { useSearch } from '../../hooks/useSearch';
import BudgetSummaryCards from './BudgetSummaryCards';
import BudgetTableFilters from './BudgetTableFilters';
import BudgetTable from './BudgetTable';

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

interface EnhancedBudgetsTableProps {
  budgets: Budget[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const EnhancedBudgetsTable: React.FC<EnhancedBudgetsTableProps> = ({
  budgets,
  onView,
  onEdit,
  onDelete
}) => {
  const {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    filteredItems
  } = useSearch(budgets, ['clientName', 'activities']);

  return (
    <div className="space-y-6">
      <BudgetSummaryCards budgets={filteredItems} />
      <BudgetTableFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        updateFilter={updateFilter}
        clearFilters={clearFilters}
      />
      <BudgetTable
        budgets={filteredItems}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};

export default EnhancedBudgetsTable;
