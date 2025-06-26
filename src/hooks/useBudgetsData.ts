
import { useState, useMemo } from 'react';
import { BudgetStatus } from '../components/BudgetCard';

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

export const useBudgetsData = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BudgetStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const filteredBudgets = useMemo(() => {
    return mockBudgets.filter(budget => {
      const matchesSearch = budget.clientName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || budget.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const statusCounts = useMemo(() => ({
    all: mockBudgets.length,
    pending: mockBudgets.filter(b => b.status === 'pending').length,
    paid: mockBudgets.filter(b => b.status === 'paid').length,
    canceled: mockBudgets.filter(b => b.status === 'canceled').length,
  }), []);

  const totalRevenue = useMemo(() => 
    mockBudgets
      .filter(b => b.status === 'paid')
      .reduce((sum, b) => sum + b.totalAmount, 0)
  , []);

  const pendingRevenue = useMemo(() => 
    mockBudgets
      .filter(b => b.status === 'pending')
      .reduce((sum, b) => sum + b.totalAmount, 0)
  , []);

  return {
    budgets: filteredBudgets,
    statusCounts,
    totalRevenue,
    pendingRevenue,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
  };
};
