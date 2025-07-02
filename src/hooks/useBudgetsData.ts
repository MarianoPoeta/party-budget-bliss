import { useState, useEffect, useCallback, useMemo } from 'react';
import { localStorage } from '../utils/localStorage';

export interface Budget {
  id: string;
  clientName: string;
  eventDate: string;
  totalAmount: number;
  guestCount: number;
  status: 'pending' | 'paid' | 'canceled';
  activities: string[];
  createdAt?: string;
  updatedAt?: string;
}

const BUDGETS_STORAGE_KEY = 'bachelor-pro-budgets';

const defaultBudgets: Budget[] = [
  {
    id: '1',
    clientName: 'Mike Johnson',
    eventDate: '2024-03-15',
    totalAmount: 8500,
    guestCount: 12,
    status: 'pending',
    activities: ['Go-Karting', 'Strip Club', 'Dinner'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    clientName: 'David Smith',
    eventDate: '2024-03-22',
    totalAmount: 12000,
    guestCount: 15,
    status: 'paid',
    activities: ['Paintball', 'Brewery Tour', 'BBQ', 'Hotel Suite'],
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-20T09:15:00Z'
  },
  {
    id: '3',
    clientName: 'Alex Brown',
    eventDate: '2024-03-08',
    totalAmount: 6500,
    guestCount: 8,
    status: 'canceled',
    activities: ['Casino Night', 'Steakhouse'],
    createdAt: '2024-01-05T16:45:00Z',
    updatedAt: '2024-01-25T11:20:00Z'
  }
];

export const useBudgetsData = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load budgets from localStorage on mount
  useEffect(() => {
    const loadBudgets = () => {
      try {
        const storedBudgets = localStorage.get(BUDGETS_STORAGE_KEY, defaultBudgets);
        setBudgets(storedBudgets);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load budgets';
        setError(errorMessage);
        setBudgets(defaultBudgets);
        console.error('Error loading budgets:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadBudgets();
  }, []);

  // Save budgets to localStorage whenever budgets change
  useEffect(() => {
    if (!isLoading && budgets.length > 0) {
      try {
        localStorage.set(BUDGETS_STORAGE_KEY, budgets);
      } catch (err) {
        console.error('Error saving budgets:', err);
        setError('Failed to save budgets');
      }
    }
  }, [budgets, isLoading]);

  // Memoized computed values
  const budgetStats = useMemo(() => {
    const totalRevenue = budgets
      .filter(b => b.status === 'paid')
      .reduce((sum, b) => sum + b.totalAmount, 0);
    
    const pendingRevenue = budgets
      .filter(b => b.status === 'pending')
      .reduce((sum, b) => sum + b.totalAmount, 0);
    
    const totalGuests = budgets.reduce((sum, b) => sum + b.guestCount, 0);
    
    const statusCounts = {
      all: budgets.length,
      pending: budgets.filter(b => b.status === 'pending').length,
      paid: budgets.filter(b => b.status === 'paid').length,
      canceled: budgets.filter(b => b.status === 'canceled').length,
    };

    return {
      totalRevenue,
      pendingRevenue,
      totalGuests,
      statusCounts
    };
  }, [budgets]);

  const generateBudgetId = useCallback(() => {
    return `budget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const addBudget = useCallback((budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBudget: Budget = {
      ...budget,
      id: generateBudgetId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setBudgets(prev => [newBudget, ...prev]);
    return newBudget;
  }, [generateBudgetId]);

  const updateBudget = useCallback((id: string, updates: Partial<Budget>) => {
    setBudgets(prev => prev.map(budget => 
      budget.id === id 
        ? { ...budget, ...updates, updatedAt: new Date().toISOString() }
        : budget
    ));
  }, []);

  const deleteBudget = useCallback((id: string) => {
    setBudgets(prev => prev.filter(budget => budget.id !== id));
  }, []);

  const getBudgetById = useCallback((id: string) => {
    return budgets.find(budget => budget.id === id);
  }, [budgets]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    budgets,
    isLoading,
    error,
    budgetStats,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetById,
    clearError
  };
};
