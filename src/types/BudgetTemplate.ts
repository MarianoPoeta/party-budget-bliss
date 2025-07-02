import { ProductRequirement } from './Product';

export interface BudgetTemplate {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  
  // Automatic task generation
  autoGenerateLogisticsTasks: boolean;
  autoGenerateCookTasks: boolean;
  
  // Product requirements for logistics
  logisticsProducts: ProductRequirement[];
  logisticsNotes?: string;
  
  // Product requirements for cook
  cookProducts: ProductRequirement[];
  cookNotes?: string;
  
  // Task templates
  logisticsTasks: LogisticsTaskTemplate[];
  cookTasks: CookTaskTemplate[];
  
  createdAt: string;
  updatedAt: string;
}

export interface LogisticsTaskTemplate {
  id: string;
  title: string;
  description: string;
  dueDateOffset: number; // days before event
  priority: 'low' | 'medium' | 'high';
  estimatedDuration: number; // hours
  requiredProducts?: ProductRequirement[];
}

export interface CookTaskTemplate {
  id: string;
  title: string;
  description: string;
  dueDateOffset: number; // days before event
  priority: 'low' | 'medium' | 'high';
  estimatedDuration: number; // hours
  preparationTime: number; // minutes
  requiredProducts?: ProductRequirement[];
} 