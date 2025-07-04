import { Budget } from '../store';
import { Task } from '../types/Task';
import { Product } from '../types/Product';
import { Menu } from '../types/Menu';
import { Activity } from '../types/Activity';
import { TaskScheduler } from './taskScheduler';

export interface WorkflowTrigger {
  budgetId: string;
  previousStatus: string;
  newStatus: string;
  triggerDate: string;
}

export interface WorkflowResult {
  tasks: Task[];
  notifications: Array<{
    id: number;
    text: string;
    time: string;
    read: boolean;
    role: 'admin' | 'sales' | 'logistics' | 'cook';
  }>;
}

export class WorkflowAutomation {
  static generateTasksFromReserva(
    budget: Budget,
    products: Product[],
    menus: Menu[],
    activities: Activity[]
  ): WorkflowResult {
    // Use the TaskScheduler to generate auto-scheduled tasks
    const tasks = TaskScheduler.generateTasksFromBudget(budget);
    
    const notifications = [];

    // Generate notifications for the different roles
    notifications.push({
      id: Date.now(),
      text: `Se han generado ${tasks.length} tareas automáticamente para el evento de ${budget.clientName}`,
      time: new Date().toISOString(),
      read: false,
      role: 'admin' as const
    });

    // Notify logistics role about their tasks
    const logisticsTasks = TaskScheduler.getTasksByRole(tasks, 'logistics');
    if (logisticsTasks.length > 0) {
      notifications.push({
        id: Date.now() + 1,
        text: `${logisticsTasks.length} tareas de logística asignadas para evento de ${budget.clientName}`,
        time: new Date().toISOString(),
        read: false,
        role: 'logistics' as const
      });
    }

    // Notify cook role about their tasks
    const cookTasks = TaskScheduler.getTasksByRole(tasks, 'cook');
    if (cookTasks.length > 0) {
      notifications.push({
        id: Date.now() + 2,
        text: `${cookTasks.length} tareas de cocina asignadas para evento de ${budget.clientName}`,
        time: new Date().toISOString(),
        read: false,
        role: 'cook' as const
      });
    }

    return { tasks, notifications };
  }



  static handleStatusChange(
    trigger: WorkflowTrigger,
    budget: Budget,
    products: Product[],
    menus: Menu[],
    activities: Activity[]
  ): WorkflowResult | null {
    // Only trigger on status change to 'reserva'
    if (trigger.newStatus === 'reserva' && trigger.previousStatus !== 'reserva') {
      return this.generateTasksFromReserva(budget, products, menus, activities);
    }

    return null;
  }
} 