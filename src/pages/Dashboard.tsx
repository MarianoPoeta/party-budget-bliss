
import { Calendar, DollarSign, TrendingUp, Users } from 'lucide-react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import BudgetCard, { BudgetStatus } from '../components/BudgetCard';

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
];

const Dashboard = () => {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your bachelor parties.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value="$45,250"
            icon={DollarSign}
            trend={{ value: 12, label: 'from last month' }}
            color="green"
          />
          <StatCard
            title="Active Budgets"
            value="8"
            icon={Calendar}
            trend={{ value: 25, label: 'from last month' }}
            color="blue"
          />
          <StatCard
            title="Total Guests"
            value="156"
            icon={Users}
            trend={{ value: 8, label: 'from last month' }}
            color="orange"
          />
          <StatCard
            title="Conversion Rate"
            value="78%"
            icon={TrendingUp}
            trend={{ value: -3, label: 'from last month' }}
            color="red"
          />
        </div>

        {/* Recent Budgets */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Budgets</h2>
            <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
              View all
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockBudgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                {...budget}
                onClick={() => console.log('View budget:', budget.id)}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-left">
            <Calendar className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Create New Budget</h3>
            <p className="text-blue-100 text-sm">Start planning a new bachelor party</p>
          </button>
          <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 text-left">
            <Users className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Add Activity</h3>
            <p className="text-orange-100 text-sm">Create new activities for events</p>
          </button>
          <button className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 text-left">
            <DollarSign className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold mb-2">View Finances</h3>
            <p className="text-green-100 text-sm">Check revenue and expenses</p>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
