
import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Layout from '../components/Layout';
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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Budgets</h1>
            <p className="text-gray-600">Manage all your bachelor party budgets</p>
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Plus className="h-4 w-4" />
            New Budget
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {(['all', 'pending', 'paid', 'canceled'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    statusFilter === status
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
                </button>
              ))}
            </div>
          </div>
        </div>

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
            <p className="text-gray-500 text-lg">No budgets found matching your criteria.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Budgets;
