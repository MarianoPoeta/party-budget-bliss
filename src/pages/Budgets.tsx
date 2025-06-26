
import { useState } from 'react';
import { Plus, Search, Calendar, TrendingUp } from 'lucide-react';
import Layout from '../components/Layout';
import BudgetCard, { BudgetStatus } from '../components/BudgetCard';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

// Mock data
const mockBudgets = [
  {
    id: '1',
    clientName: 'Mike Johnson',
    eventDate: 'March 15, 2024',
    totalAmount: 8500,
    guestCount: 12,
    status: 'pending' as BudgetStatus,
    activities: ['Go-Karting', 'Strip Club', 'Dinner'],
  },
  {
    id: '2',
    clientName: 'David Smith',
    eventDate: 'March 22, 2024',
    totalAmount: 12000,
    guestCount: 15,
    status: 'paid' as BudgetStatus,
    activities: ['Paintball', 'Brewery Tour', 'BBQ', 'Hotel Suite'],
  },
  {
    id: '3',
    clientName: 'Alex Brown',
    eventDate: 'March 8, 2024',
    totalAmount: 6500,
    guestCount: 8,
    status: 'canceled' as BudgetStatus,
    activities: ['Casino Night', 'Steakhouse'],
  },
  {
    id: '4',
    clientName: 'Chris Wilson',
    eventDate: 'April 5, 2024',
    totalAmount: 15000,
    guestCount: 20,
    status: 'paid' as BudgetStatus,
    activities: ['Yacht Charter', 'Fine Dining', 'VIP Club', 'Luxury Hotel'],
  },
  {
    id: '5',
    clientName: 'Robert Davis',
    eventDate: 'April 12, 2024',
    totalAmount: 7800,
    guestCount: 10,
    status: 'pending' as BudgetStatus,
    activities: ['Golf Tournament', 'Steakhouse', 'Sports Bar'],
  },
];

const Budgets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BudgetStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const filteredBudgets = mockBudgets.filter(budget => {
    const matchesSearch = budget.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || budget.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: mockBudgets.length,
    pending: mockBudgets.filter(b => b.status === 'pending').length,
    paid: mockBudgets.filter(b => b.status === 'paid').length,
    canceled: mockBudgets.filter(b => b.status === 'canceled').length,
  };

  const totalRevenue = mockBudgets
    .filter(b => b.status === 'paid')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const pendingRevenue = mockBudgets
    .filter(b => b.status === 'pending')
    .reduce((sum, b) => sum + b.totalAmount, 0);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Budgets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{mockBudgets.length}</div>
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
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((statusCounts.paid / statusCounts.all) * 100)}%
              </div>
              <p className="text-xs text-slate-500 mt-1">Paid vs total</p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Breakdown */}
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
                  style={{ width: `${(totalRevenue / (totalRevenue + pendingRevenue)) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Pending Budgets</span>
                <span className="text-sm text-slate-600">${pendingRevenue.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full" 
                  style={{ width: `${(pendingRevenue / (totalRevenue + pendingRevenue)) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Date Range */}
              <div className="flex gap-2">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    type="date"
                    placeholder="Start date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    type="date"
                    placeholder="End date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                {(['all', 'pending', 'paid', 'canceled'] as const).map((status) => (
                  <Button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    variant={statusFilter === status ? "default" : "outline"}
                    size="sm"
                    className={statusFilter === status ? "bg-slate-800 hover:bg-slate-700" : ""}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBudgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              {...budget}
              onClick={() => console.log('View budget:', budget.id)}
            />
          ))}
        </div>

        {filteredBudgets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No budgets found matching your criteria.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Budgets;
