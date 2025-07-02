import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Zap, 
  DollarSign, 
  Clock, 
  CalendarDays, 
  ShoppingCart, 
  ChefHat, 
  Truck, 
  Package,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Users,
  Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WorkflowItem {
  title: string;
  count: number;
  action: string;
  href: string;
  icon: React.ComponentType<any>;
  priority: 'high' | 'medium' | 'low';
  color: string;
}

interface WorkflowOverviewProps {
  role: string;
  stats: {
    activeBudgets: number;
    pendingTasks: number;
    upcomingEvents: number;
    notifications: number;
    urgentTasks: number;
    completedTasks: number;
  };
}

export const WorkflowOverview: React.FC<WorkflowOverviewProps> = ({ role, stats }) => {
  const navigate = useNavigate();

  const getWorkflowItems = (): WorkflowItem[] => {
    switch (role) {
      case 'admin':
        return [
          {
            title: 'Presupuestos Pendientes',
            count: stats.activeBudgets,
            action: 'Revisar',
            href: '/budgets',
            icon: DollarSign,
            priority: 'high',
            color: 'bg-red-100 text-red-600'
          },
          {
            title: 'Tareas Urgentes',
            count: stats.urgentTasks,
            action: 'Asignar',
            href: '/tasks',
            icon: AlertTriangle,
            priority: 'high',
            color: 'bg-orange-100 text-orange-600'
          },
          {
            title: 'Eventos Próximos',
            count: stats.upcomingEvents,
            action: 'Ver',
            href: '/calendar',
            icon: CalendarDays,
            priority: 'medium',
            color: 'bg-blue-100 text-blue-600'
          },
          {
            title: 'Notificaciones',
            count: stats.notifications,
            action: 'Revisar',
            href: '/notifications',
            icon: Bell,
            priority: 'low',
            color: 'bg-green-100 text-green-600'
          }
        ];
      case 'sales':
        return [
          {
            title: 'Presupuestos por Aprobar',
            count: stats.activeBudgets,
            action: 'Revisar',
            href: '/budgets',
            icon: DollarSign,
            priority: 'high',
            color: 'bg-red-100 text-red-600'
          },
          {
            title: 'Clientes en Espera',
            count: stats.activeBudgets,
            action: 'Contactar',
            href: '/clients',
            icon: Users,
            priority: 'high',
            color: 'bg-orange-100 text-orange-600'
          },
          {
            title: 'Eventos Próximos',
            count: stats.upcomingEvents,
            action: 'Preparar',
            href: '/calendar',
            icon: CalendarDays,
            priority: 'medium',
            color: 'bg-blue-100 text-blue-600'
          },
          {
            title: 'Tareas Pendientes',
            count: stats.pendingTasks,
            action: 'Asignar',
            href: '/tasks',
            icon: Clock,
            priority: 'low',
            color: 'bg-green-100 text-green-600'
          }
        ];
      case 'logistics':
        return [
          {
            title: 'Compras Urgentes',
            count: stats.urgentTasks,
            action: 'Comprar',
            href: '/logistics',
            icon: ShoppingCart,
            priority: 'high',
            color: 'bg-red-100 text-red-600'
          },
          {
            title: 'Entregas Pendientes',
            count: stats.pendingTasks,
            action: 'Entregar',
            href: '/logistics',
            icon: Truck,
            priority: 'high',
            color: 'bg-orange-100 text-orange-600'
          },
          {
            title: 'Eventos Próximos',
            count: stats.upcomingEvents,
            action: 'Preparar',
            href: '/calendar',
            icon: CalendarDays,
            priority: 'medium',
            color: 'bg-blue-100 text-blue-600'
          },
          {
            title: 'Inventario',
            count: 0,
            action: 'Revisar',
            href: '/inventory',
            icon: Package,
            priority: 'low',
            color: 'bg-green-100 text-green-600'
          }
        ];
      case 'cook':
        return [
          {
            title: 'Preparaciones Urgentes',
            count: stats.urgentTasks,
            action: 'Cocinar',
            href: '/cook',
            icon: ChefHat,
            priority: 'high',
            color: 'bg-red-100 text-red-600'
          },
          {
            title: 'Menús por Planificar',
            count: stats.pendingTasks,
            action: 'Planificar',
            href: '/cook',
            icon: ChefHat,
            priority: 'high',
            color: 'bg-orange-100 text-orange-600'
          },
          {
            title: 'Eventos Próximos',
            count: stats.upcomingEvents,
            action: 'Preparar',
            href: '/calendar',
            icon: CalendarDays,
            priority: 'medium',
            color: 'bg-blue-100 text-blue-600'
          },
          {
            title: 'Inventario Cocina',
            count: 0,
            action: 'Revisar',
            href: '/kitchen-inventory',
            icon: Package,
            priority: 'low',
            color: 'bg-green-100 text-green-600'
          }
        ];
      default:
        return [];
    }
  };

  const workflowItems = getWorkflowItems();

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">Alta</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-xs">Media</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs">Baja</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-600" />
          Flujo de Trabajo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {workflowItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-200 hover:border-blue-300 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(item.href)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${item.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-slate-600">{item.count} items</p>
                      {getPriorityBadge(item.priority)}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="hover:bg-blue-50 hover:text-blue-600"
                >
                  {item.action}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}; 