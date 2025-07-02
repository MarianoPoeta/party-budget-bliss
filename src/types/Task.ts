export type TaskType = 'shopping' | 'reservation' | 'delivery' | 'cooking' | 'need';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: string;
  type: TaskType;
  description: string;
  relatedBudgetId: string;
  relatedMealId?: string;
  relatedActivityId?: string;
  assignedToRole: 'logistics' | 'cook';
  assignedTo?: string;
  dueDate: string;
  status: TaskStatus;
  notes?: string;
  invoiceUrl?: string;
  needs?: Need[];
}

export type Need = {
  id: string;
  description: string;
  quantity: number;
  requestedBy: string;
  status: TaskStatus;
  fulfilledBy?: string;
}; 