
import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import Layout from '../components/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import BudgetsSummaryCards from '../components/budget/BudgetsSummaryCards';
import RevenueBreakdownCard from '../components/budget/RevenueBreakdownCard';
import BudgetsFilters from '../components/budget/BudgetsFilters';
import BudgetsGrid from '../components/budget/BudgetsGrid';
import { useBudgetsData } from '../hooks/useBudgetsData';
import { BudgetStatus } from '../components/BudgetCard';

const Budgets = () => {
  const navigate = useNavigate();
  const { budgets } = useBudgetsData();
  
  // Local state for filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BudgetStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Computed values
  const { filteredBudgets, statusCounts, totalRevenue, pendingRevenue } = useMemo(() => {
    // Filter budgets based on search and filters
    let filtered = budgets.filter(budget => {
      const matchesSearch = budget.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           budget.activities.some(activity => activity.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || budget.status === statusFilter;
      
      const matchesDateRange = (!dateRange.start || budget.eventDate >= dateRange.start) &&
                              (!dateRange.end || budget.eventDate <= dateRange.end);
      
      return matchesSearch && matchesStatus && matchesDateRange;
    });

    // Calculate status counts
    const counts = {
      all: budgets.length,
      pending: budgets.filter(b => b.status === 'pending').length,
      paid: budgets.filter(b => b.status === 'paid').length,
      canceled: budgets.filter(b => b.status === 'canceled').length,
    };

    // Calculate revenue
    const total = budgets
      .filter(b => b.status === 'paid')
      .reduce((sum, b) => sum + b.totalAmount, 0);
    
    const pending = budgets
      .filter(b => b.status === 'pending')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    return {
      filteredBudgets: filtered,
      statusCounts: counts,
      totalRevenue: total,
      pendingRevenue: pending
    };
  }, [budgets, searchTerm, statusFilter, dateRange]);

  const handleBudgetClick = (budgetId: string) => {
    navigate(`/budgets/${budgetId}`);
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
          budgets={filteredBudgets}
          onBudgetClick={handleBudgetClick}
        />
      </div>
    </Layout>
  );
};

export default Budgets;
