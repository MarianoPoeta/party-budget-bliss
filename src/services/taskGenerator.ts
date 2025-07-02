import { Task, TaskStatus } from '../types/Task';
import { Budget } from '../store';
import { BudgetTemplate } from '../types/BudgetTemplate';
import { Product } from '../types/Product';

export interface TaskGenerationResult {
  logisticsTasks: Task[];
  cookTasks: Task[];
  logisticsProducts: { product: Product; quantity: number }[];
  cookProducts: { product: Product; quantity: number }[];
}

export class TaskGenerator {
  static generateTasksFromBudget(
    budget: Budget,
    template: BudgetTemplate,
    products: Product[]
  ): TaskGenerationResult {
    const eventDate = new Date(budget.eventDate);
    const logisticsTasks: Task[] = [];
    const cookTasks: Task[] = [];
    
    // Generate logistics tasks
    if (template.autoGenerateLogisticsTasks) {
      template.logisticsTasks.forEach(taskTemplate => {
        const dueDate = new Date(eventDate);
        dueDate.setDate(dueDate.getDate() - taskTemplate.dueDateOffset);
        
        logisticsTasks.push({
          id: `logistics-${Date.now()}-${Math.random()}`,
          type: 'shopping',
          description: taskTemplate.description,
          assignedToRole: 'logistics',
          status: 'todo' as TaskStatus,
          dueDate: dueDate.toISOString().split('T')[0],
          relatedBudgetId: budget.id,
          notes: taskTemplate.title,
          needs: taskTemplate.requiredProducts?.map(req => ({
            id: `need-${Date.now()}-${Math.random()}`,
            description: `Need ${req.quantity} ${this.getProductName(req.productId, products)}`,
            quantity: req.quantity,
            status: 'todo' as TaskStatus,
            requestedBy: 'system',
            notes: req.notes
          }))
        });
      });
    }
    
    // Generate cook tasks
    if (template.autoGenerateCookTasks) {
      template.cookTasks.forEach(taskTemplate => {
        const dueDate = new Date(eventDate);
        dueDate.setDate(dueDate.getDate() - taskTemplate.dueDateOffset);
        
        cookTasks.push({
          id: `cook-${Date.now()}-${Math.random()}`,
          type: 'cooking',
          description: taskTemplate.description,
          assignedToRole: 'cook',
          status: 'todo' as TaskStatus,
          dueDate: dueDate.toISOString().split('T')[0],
          relatedBudgetId: budget.id,
          notes: taskTemplate.title,
          needs: taskTemplate.requiredProducts?.map(req => ({
            id: `need-${Date.now()}-${Math.random()}`,
            description: `Need ${req.quantity} ${this.getProductName(req.productId, products)}`,
            quantity: req.quantity,
            status: 'todo' as TaskStatus,
            requestedBy: 'system',
            notes: req.notes
          }))
        });
      });
    }
    
    // Get product requirements
    const logisticsProducts = template.logisticsProducts.map(req => ({
      product: products.find(p => p.id === req.productId)!,
      quantity: req.quantity
    })).filter(item => item.product);
    
    const cookProducts = template.cookProducts.map(req => ({
      product: products.find(p => p.id === req.productId)!,
      quantity: req.quantity
    })).filter(item => item.product);
    
    return {
      logisticsTasks,
      cookTasks,
      logisticsProducts,
      cookProducts
    };
  }
  
  private static getProductName(productId: string, products: Product[]): string {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  }
} 