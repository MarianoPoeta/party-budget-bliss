
import { Plus } from 'lucide-react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import BudgetsSummaryCards from '../components/budget/BudgetsSummaryCards';
import RevenueBreakdownCard from '../components/budget/RevenueBreakdownCard';
import BudgetsFilters from '../components/budget/BudgetsFilters';
import BudgetsGrid from '../components/budget/BudgetsGrid';
import { useBudgetsData } from '../hooks/useBudgetsData';

const Budgets = () => {
  const {
    budgets,
    statusCounts,
    totalRevenue,
    pendingRevenue,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
  } = useBudgetsData();

  const handleBudgetClick = (budgetId: string) => {
    console.log('View budget:', budgetId);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Budgets</h1>
            <p className="text-slate-600">Manage all your bachelor party budgets</p>
          </div>
          <Link to="/budgets/new">
            <Button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
              <Plus className="h-4 w-4" />
              New Budget
            </Button>
          </Link>
        </div>

        {/* Summary Dashboard */}
        <BudgetsSummaryCards
          totalBudgets={budgets.length}
          totalRevenue={totalRevenue}
          pendingRevenue={pendingRevenue}
          statusCounts={statusCounts}
        />

        {/* Revenue Breakdown */}
        <RevenueBreakdownCard
          totalRevenue={totalRevenue}
          pendingRevenue={pendingRevenue}
        />

        {/* Filters */}
        <BudgetsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateRange={dateRange}
          setDateRange={setDateRange}
          statusCounts={statusCounts}
        />

        {/* Budgets Grid */}
        <BudgetsGrid
          budgets={budgets}
          onBudgetClick={handleBudgetClick}
        />
      </div>
    </Layout>
  );
};

export default Budgets;
