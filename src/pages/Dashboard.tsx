
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, DollarSign, Users, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import LoadingSpinner from '../components/LoadingSpinner';
import { useBudgetsData } from '../hooks/useBudgetsData';

const Dashboard = () => {
  const { budgets, isLoading, error } = useBudgetsData();

  const dashboardStats = useMemo(() => {
    const totalRevenue = budgets
      .filter(b => b.status === 'paid')
      .reduce((sum, b) => sum + b.totalAmount, 0);
    
    const pendingRevenue = budgets
      .filter(b => b.status === 'pending')
      .reduce((sum, b) => sum + b.totalAmount, 0);
    
    const totalGuests = budgets.reduce((sum, b) => sum + b.guestCount, 0);
    
    const upcomingEvents = budgets.filter(b => {
      const eventDate = new Date(b.eventDate);
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
      return eventDate >= today && eventDate <= nextMonth;
    }).length;

    return {
      totalRevenue,
      pendingRevenue,
      totalGuests,
      upcomingEvents,
      totalBudgets: budgets.length,
      paidBudgets: budgets.filter(b => b.status === 'paid').length,
      pendingBudgets: budgets.filter(b => b.status === 'pending').length
    };
  }, [budgets]);

  const recentBudgets = useMemo(() => {
    return budgets
      .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
      .slice(0, 5);
  }, [budgets]);

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    return budgets
      .filter(b => new Date(b.eventDate) >= today)
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
      .slice(0, 5);
  }, [budgets]);

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

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      paid: 'bg-green-100 text-green-800 border-green-200',
      canceled: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]} variant="outline">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" text="Loading dashboard..." />
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
              <CardTitle className="text-red-600">Dashboard Error</CardTitle>
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
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Welcome to Bachelor Pro
            </h1>
            <p className="text-slate-600">
              Manage your bachelor party events with ease
            </p>
          </div>
          <Link to="/budgets/new">
            <Button className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors">
              <Plus className="h-4 w-4" />
              New Budget
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {formatCurrency(dashboardStats.totalRevenue)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                From {dashboardStats.paidBudgets} paid events
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Pending Revenue
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {formatCurrency(dashboardStats.pendingRevenue)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                From {dashboardStats.pendingBudgets} pending events
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Guests
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {dashboardStats.totalGuests.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Across {dashboardStats.totalBudgets} events
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Upcoming Events
              </CardTitle>
              <CalendarDays className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {dashboardStats.upcomingEvents}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Next 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/budgets/new" className="group">
            <Card className="hover:shadow-md transition-all duration-200 group-hover:scale-105">
              <CardContent className="p-6 text-center">
                <Plus className="h-8 w-8 mx-auto mb-3 text-slate-600 group-hover:text-slate-900" />
                <h3 className="font-semibold text-slate-900 mb-1">Create Budget</h3>
                <p className="text-sm text-slate-600">Start a new event budget</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/budgets" className="group">
            <Card className="hover:shadow-md transition-all duration-200 group-hover:scale-105">
              <CardContent className="p-6 text-center">
                <CalendarDays className="h-8 w-8 mx-auto mb-3 text-slate-600 group-hover:text-slate-900" />
                <h3 className="font-semibold text-slate-900 mb-1">View Budgets</h3>
                <p className="text-sm text-slate-600">Manage all budgets</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/activities" className="group">
            <Card className="hover:shadow-md transition-all duration-200 group-hover:scale-105">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-3 text-slate-600 group-hover:text-slate-900" />
                <h3 className="font-semibold text-slate-900 mb-1">Activities</h3>
                <p className="text-sm text-slate-600">Browse activities</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/finances" className="group">
            <Card className="hover:shadow-md transition-all duration-200 group-hover:scale-105">
              <CardContent className="p-6 text-center">
                <DollarSign className="h-8 w-8 mx-auto mb-3 text-slate-600 group-hover:text-slate-900" />
                <h3 className="font-semibold text-slate-900 mb-1">Finances</h3>
                <p className="text-sm text-slate-600">Track payments</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity and Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Budgets */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Budgets</CardTitle>
                <CardDescription>Latest budget activities</CardDescription>
              </div>
              <Link to="/budgets">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentBudgets.length > 0 ? (
                <div className="space-y-4">
                  {recentBudgets.map((budget) => (
                    <div key={budget.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-slate-900 truncate">{budget.clientName}</p>
                          {getStatusBadge(budget.status)}
                        </div>
                        <p className="text-sm text-slate-600">
                          {formatDate(budget.eventDate)} • {budget.guestCount} guests
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-semibold text-slate-900">{formatCurrency(budget.totalAmount)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500 mb-4">No budgets created yet</p>
                  <Link to="/budgets/new">
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Budget
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Events scheduled ahead</CardDescription>
              </div>
              <Link to="/budgets">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((budget) => (
                    <div key={budget.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-slate-900 truncate">{budget.clientName}</p>
                          {getStatusBadge(budget.status)}
                        </div>
                        <p className="text-sm text-slate-600">
                          {formatDate(budget.eventDate)} • {budget.guestCount} guests
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-semibold text-slate-900">{formatCurrency(budget.totalAmount)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarDays className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                  <p className="text-slate-500 mb-4">No upcoming events</p>
                  <Link to="/budgets/new">
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Event
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
