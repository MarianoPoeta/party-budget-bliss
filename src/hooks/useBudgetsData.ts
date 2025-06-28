
import { useState, useEffect, useCallback } from 'react';
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
    try {
      const storedBudgets = localStorage.get(BUDGETS_STORAGE_KEY, defaultBudgets);
      setBudgets(storedBudgets);
    } catch (err) {
      setError('Failed to load budgets');
      setBudgets(defaultBudgets);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save budgets to localStorage whenever budgets change
  useEffect(() => {
    if (!isLoading) {
      localStorage.set(BUDGETS_STORAGE_KEY, budgets);
    }
  }, [budgets, isLoading]);

  const addBudget = useCallback((budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBudget: Budget = {
      ...budget,
      id: `budget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setBudgets(prev => [newBudget, ...prev]);
    return newBudget;
  }, []);

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

  return {
    budgets,
    isLoading,
    error,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetById
  };
};
