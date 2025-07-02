export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  company?: string;
  taxId?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientStats {
  totalBudgets: number;
  totalSpent: number;
  averageBudget: number;
  lastEventDate?: string;
} 