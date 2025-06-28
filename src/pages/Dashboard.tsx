
import React from 'react';
import { Calendar, DollarSign, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import BudgetCard, { BudgetStatus } from '../components/BudgetCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useBudgetsData } from '../hooks/useBudgetsData';
import { Alert, AlertDescription } from '../components/ui/alert';

const Dashboard = () => {
  const { budgets, isLoading, error } = useBudgetsData();

  // Calculate stats from actual data
  const stats = React.useMemo(() => {
    const totalRevenue = budgets
      .filter(b => b.status === 'paid')
      .reduce((sum, b) => sum + b.totalAmount, 0);
    
    const activeBudgets = budgets.filter(b => b.status === 'pending').length;
    const totalGuests = budgets.reduce((sum, b) => sum + b.guestCount, 0);
    const conversionRate = budgets.length > 0 
      ? Math.round((budgets.filter(b => b.status === 'paid').length / budgets.length) * 100)
      : 0;

    return { totalRevenue, activeBudgets, totalGuests, conversionRate };
  }, [budgets]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" text="Loading dashboard..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your bachelor parties.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            trend={{ value: 12, label: 'from last month' }}
            color="green"
          />
          <StatCard
            title="Active Budgets"
            value={stats.activeBudgets.toString()}
            icon={Calendar}
            trend={{ value: 25, label: 'from last month' }}
            color="blue"
          />
          <StatCard
            title="Total Guests"
            value={stats.totalGuests.toString()}
            icon={Users}
            trend={{ value: 8, label: 'from last month' }}
            color="orange"
          />
          <StatCard
            title="Conversion Rate"
            value={`${stats.conversionRate}%`}
            icon={TrendingUp}
            trend={{ value: -3, label: 'from last month' }}
            color="red"
          />
        </div>

        {/* Recent Budgets */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Budgets</h2>
            <Link 
              to="/budgets/enhanced" 
              className="text-orange-600 hover:text-orange-700 font-medium text-sm"
            >
              View all
            </Link>
          </div>
          
          {budgets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No budgets yet</p>
              <p className="text-sm mt-1">Create your first budget to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.slice(0, 6).map((budget) => (
                <BudgetCard
                  key={budget.id}
                  {...budget}
                  status={budget.status as BudgetStatus}
                  eventDate={new Date(budget.eventDate).toLocaleDateString()}
                  onClick={() => window.location.href = `/budgets/${budget.id}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            to="/budgets/enhanced"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-left block"
          >
            <Calendar className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Create New Budget</h3>
            <p className="text-blue-100 text-sm">Start planning a new bachelor party</p>
          </Link>
          
          <Link 
            to="/activities"
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 text-left block"
          >
            <Users className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Add Activity</h3>
            <p className="text-orange-100 text-sm">Create new activities for events</p>
          </Link>
          
          <Link 
            to="/finances"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 text-left block"
          >
            <DollarSign className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold mb-2">View Finances</h3>
            <p className="text-green-100 text-sm">Check revenue and expenses</p>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
