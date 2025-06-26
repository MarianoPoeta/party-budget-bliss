
import { PaymentDetails } from './Payment';
import { MealTemplate, ActivityTemplate, TransportTemplate, StayTemplate } from './Budget';

export interface BudgetItem {
  id: string;
  templateId: string;
  template: MealTemplate | ActivityTemplate | TransportTemplate | StayTemplate;
  customizations: Record<string, any>;
  quantity: number;
  notes?: string;
  includeTransport?: boolean; // For activities
}

export interface EnhancedBudget {
  id?: string;
  clientName: string;
  eventDate: string;
  guestCount: number;
  selectedMeals: BudgetItem[];
  selectedActivities: BudgetItem[];
  selectedTransport: BudgetItem[];
  selectedStay?: BudgetItem;
  extras: number;
  totalAmount: number;
  isClosed: boolean;
  paymentDetails?: PaymentDetails;
  createdAt?: string;
  updatedAt?: string;
}

export interface ValidationError {
  section: string;
  message: string;
  severity: 'error' | 'warning';
}
