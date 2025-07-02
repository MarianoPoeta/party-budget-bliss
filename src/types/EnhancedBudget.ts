import { PaymentDetails } from './Payment';
import { MealTemplate, ActivityTemplate, TransportTemplate, StayTemplate } from './Budget';
import { Menu, MenuItem } from './Menu';

export interface BudgetItem {
  id: string;
  templateId: string;
  template: any;
  customizations: Record<string, any>;
  quantity: number;
  includeTransport?: boolean;
  calculatedPrice?: number; // Price calculated based on guest count
  guestCount?: number; // Guest count when item was added
}

// New transport management types
export interface TransportAssignment {
  id: string;
  transportTemplateId: string;
  transportTemplate: TransportTemplate;
  activityId?: string; // Links to specific activity
  guestCount: number;
  duration: number; // in hours
  distance?: number; // in km
  calculatedPrice: number;
  pickupLocation?: string;
  dropoffLocation?: string;
  notes?: string;
}

export interface ActivityTransportLink {
  activityId: string;
  transportAssignmentId: string;
  guestCount: number;
  isRequired: boolean;
}

export interface EnhancedBudget {
  id?: string;
  clientName: string;
  eventDate: string;
  guestCount: number;
  selectedMeals: BudgetItem[];
  selectedActivities: BudgetItem[];
  selectedTransport: BudgetItem[];
  transportAssignments: TransportAssignment[]; // New field for detailed transport management
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

// Budget calculation types
export interface BudgetCalculationInput {
  selectedMeals: BudgetItem[];
  selectedActivities: BudgetItem[];
  selectedTransport: BudgetItem[];
  transportAssignments: TransportAssignment[];
  selectedStay?: BudgetItem;
  guestCount: number;
  extras: number;
}

export interface BudgetCalculationResult {
  totalAmount: number;
  breakdown: {
    meals: number;
    activities: number;
    transport: number;
    stay: number;
    extras: number;
  };
}

// Budget workflow types
export type BudgetItemType = 'meals' | 'activities' | 'transport' | 'stay';

export interface BudgetWorkflowState {
  budget: Partial<EnhancedBudget>;
  validationErrors: ValidationError[];
  isLoading: boolean;
  isDirty: boolean;
}

// Search and filter types
export interface SearchFilters {
  searchTerm: string;
  category?: string;
  priceRange?: { min: number; max: number };
  dateRange?: { start: string; end: string };
}

// Template selection types
export interface TemplateSelection {
  templateId: string;
  customizations: Record<string, unknown>;
  quantity: number;
  notes?: string;
}

export interface MenuBudgetItem extends BudgetItem {
  template: Menu;
  customizations: {
    guestCount: number;
    calculatedPrice: number;
    originalPricePerPerson: number;
    customizations?: {
      itemsCustomized?: boolean;
      originalTemplate?: Menu;
      modifiedItems?: MenuItem[];
    };
  };
}
