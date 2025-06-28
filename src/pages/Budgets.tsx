
import { useState, useMemo } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import Layout from '../components/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { 
  ResponsiveTable, 
  ResponsiveTableHeader, 
  ResponsiveTableBody, 
  ResponsiveTableRow, 
  ResponsiveTableCell,
  ResponsiveTableHeaderCell
} from '../components/ui/responsive-table';
import BudgetsSummaryCards from '../components/budget/BudgetsSummaryCards';
import RevenueBreakdownCard from '../components/budget/RevenueBreakdownCard';
import { useBudgetsData } from '../hooks/useBudgetsData';
import { BudgetStatus } from '../components/BudgetCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Budgets = () => {
  const navigate = useNavigate();
  const { budgets, isLoading, error } = useBudgetsData();
  
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

  const getStatusBadge = (status: BudgetStatus) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      paid: 'bg-green-100 text-green-800 border-green-200',
      canceled: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <Badge className={variants[status]} variant="outline">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" text="Loading budgets..." />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Error Loading Budgets</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Budgets</h1>
            <p className="text-slate-600">Manage all your bachelor party budgets</p>
          </div>
          <Link to="/budgets/new">
            <Button className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search budgets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  aria-label="Search budgets by client name or activities"
                />
              </div>
              
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as BudgetStatus | 'all')}>
                <SelectTrigger aria-label="Filter by status">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ({statusCounts.all})</SelectItem>
                  <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
                  <SelectItem value="paid">Paid ({statusCounts.paid})</SelectItem>
                  <SelectItem value="canceled">Canceled ({statusCounts.canceled})</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Date Range */}
              <Input
                type="date"
                placeholder="Start date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                aria-label="Filter by start date"
              />
              
              <Input
                type="date"
                placeholder="End date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                aria-label="Filter by end date"
              />
            </div>
          </CardContent>
        </Card>

        {/* Budgets Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Budgets ({filteredBudgets.length})
            </CardTitle>
            <CardDescription>
              {filteredBudgets.length === 0 ? 'No budgets match your current filters.' : 'Click on any budget to view details.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {filteredBudgets.length > 0 ? (
              <ResponsiveTable>
                <ResponsiveTableHeader>
                  <ResponsiveTableRow>
                    <ResponsiveTableHeaderCell>Client</ResponsiveTableHeaderCell>
                    <ResponsiveTableHeaderCell>Event Date</ResponsiveTableHeaderCell>
                    <ResponsiveTableHeaderCell>Guests</ResponsiveTableHeaderCell>
                    <ResponsiveTableHeaderCell>Amount</ResponsiveTableHeaderCell>
                    <ResponsiveTableHeaderCell>Status</ResponsiveTableHeaderCell>
                    <ResponsiveTableHeaderCell>Activities</ResponsiveTableHeaderCell>
                  </ResponsiveTableRow>
                </ResponsiveTableHeader>
                <ResponsiveTableBody>
                  {filteredBudgets.map((budget) => (
                    <ResponsiveTableRow
                      key={budget.id}
                      onClick={() => handleBudgetClick(budget.id)}
                    >
                      <ResponsiveTableCell label="Client">
                        <div className="font-medium">{budget.clientName}</div>
                      </ResponsiveTableCell>
                      <ResponsiveTableCell label="Event Date">
                        {formatDate(budget.eventDate)}
                      </ResponsiveTableCell>
                      <ResponsiveTableCell label="Guests">
                        {budget.guestCount} guests
                      </ResponsiveTableCell>
                      <ResponsiveTableCell label="Amount">
                        <span className="font-semibold">{formatCurrency(budget.totalAmount)}</span>
                      </ResponsiveTableCell>
                      <ResponsiveTableCell label="Status">
                        {getStatusBadge(budget.status)}
                      </ResponsiveTableCell>
                      <ResponsiveTableCell label="Activities">
                        <div className="flex flex-wrap gap-1">
                          {budget.activities.slice(0, 2).map((activity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {activity}
                            </Badge>
                          ))}
                          {budget.activities.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{budget.activities.length - 2}
                            </Badge>
                          )}
                        </div>
                      </ResponsiveTableCell>
                    </ResponsiveTableRow>
                  ))}
                </ResponsiveTableBody>
              </ResponsiveTable>
            ) : (
              <div className="p-8 text-center">
                <p className="text-slate-500 mb-4">No budgets found matching your criteria.</p>
                <Link to="/budgets/new">
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Budget
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Budgets;
