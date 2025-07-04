import { Task, TaskType, TaskPriority } from '../types/Task';

export interface SchedulingRule {
  taskType: TaskType;
  defaultDuration: number;
  defaultPriority: TaskPriority;
  idealDaysBefore: number;
  assignedToRole: 'logistics' | 'cook';
}

export const SCHEDULING_RULES: Record<TaskType, SchedulingRule> = {
  shopping: {
    taskType: 'shopping',
    defaultDuration: 3,
    defaultPriority: 'high',
    idealDaysBefore: 2,
    assignedToRole: 'logistics'
  },
  reservation: {
    taskType: 'reservation',
    defaultDuration: 1,
    defaultPriority: 'urgent',
    idealDaysBefore: 7,
    assignedToRole: 'logistics'
  },
  delivery: {
    taskType: 'delivery',
    defaultDuration: 2,
    defaultPriority: 'high',
    idealDaysBefore: 1,
    assignedToRole: 'logistics'
  },
  preparation: {
    taskType: 'preparation',
    defaultDuration: 4,
    defaultPriority: 'medium',
    idealDaysBefore: 1,
    assignedToRole: 'cook'
  },
  cooking: {
    taskType: 'cooking',
    defaultDuration: 6,
    defaultPriority: 'urgent',
    idealDaysBefore: 0,
    assignedToRole: 'cook'
  },
  setup: {
    taskType: 'setup',
    defaultDuration: 2,
    defaultPriority: 'medium',
    idealDaysBefore: 0,
    assignedToRole: 'logistics'
  },
  cleanup: {
    taskType: 'cleanup',
    defaultDuration: 2,
    defaultPriority: 'low',
    idealDaysBefore: 0,
    assignedToRole: 'logistics'
  },
  need: {
    taskType: 'need',
    defaultDuration: 1,
    defaultPriority: 'medium',
    idealDaysBefore: 1,
    assignedToRole: 'logistics'
  }
};

export class TaskScheduler {
  static generateTasksFromBudget(budget: any): Task[] {
    const eventDate = new Date(budget.eventDate);
    const tasks: Task[] = [];
    const now = new Date();

    // Generate basic tasks
    const taskTypes: TaskType[] = ['reservation', 'shopping', 'delivery', 'preparation', 'cooking', 'setup'];
    
    if (budget.guestCount > 20) {
      taskTypes.push('need');
    }

    taskTypes.forEach((taskType, index) => {
      const rule = SCHEDULING_RULES[taskType];
      const dueDate = new Date(eventDate);
      dueDate.setDate(dueDate.getDate() - rule.idealDaysBefore);
      
      const task: Task = {
        id: `${budget.id}_${taskType}_${index}`,
        type: taskType,
        description: this.generateDescription(taskType, budget),
        relatedBudgetId: budget.id,
        assignedToRole: rule.assignedToRole,
        dueDate: dueDate.toISOString(),
        estimatedDuration: rule.defaultDuration,
        status: 'todo',
        priority: rule.defaultPriority,
        dependencies: [],
        autoScheduled: true,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      };

      tasks.push(task);
    });

    return tasks;
  }

  private static generateDescription(taskType: TaskType, budget: any): string {
    const client = budget.clientName;
    const guests = budget.guestCount;

    switch (taskType) {
      case 'reservation':
        return `Confirmar reservas para evento de ${client} (${guests} invitados)`;
      case 'shopping':
        return `Comprar suministros para evento de ${client}`;
      case 'delivery':
        return `Entregar suministros para evento de ${client}`;
      case 'preparation':
        return `Preparar ingredientes para evento de ${client}`;
      case 'cooking':
        return `Cocinar para evento de ${client} (${guests} invitados)`;
      case 'setup':
        return `Montar evento de ${client}`;
      case 'cleanup':
        return `Limpiar después del evento de ${client}`;
      case 'need':
        return `Gestionar necesidades especiales para ${client}`;
      default:
        return `Tarea para evento de ${client}`;
    }
  }

  static getTasksByRole(tasks: Task[], role: 'logistics' | 'cook'): Task[] {
    return tasks
      .filter(task => task.assignedToRole === role)
      .sort((a, b) => {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        
        if (priorityDiff !== 0) return priorityDiff;
        
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
  }
} 