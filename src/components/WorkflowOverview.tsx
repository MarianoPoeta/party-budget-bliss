import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  DollarSign, 
  Clock, 
  CalendarDays, 
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
            action: 'Gestionar',
            href: '/configuration',
            icon: AlertTriangle,
            priority: 'high',
            color: 'bg-orange-100 text-orange-600'
          },
          {
            title: 'Eventos Próximos',
            count: stats.upcomingEvents,
            action: 'Ver',
            href: '/budgets',
            icon: CalendarDays,
            priority: 'medium',
            color: 'bg-blue-100 text-blue-600'
          },
          {
            title: 'Configuración',
            count: 0,
            action: 'Gestionar',
            href: '/configuration',
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
            href: '/budgets',
            icon: CalendarDays,
            priority: 'medium',
            color: 'bg-blue-100 text-blue-600'
          },
          {
            title: 'Tareas Pendientes',
            count: stats.pendingTasks,
            action: 'Gestionar',
            href: '/configuration',
            icon: Clock,
            priority: 'low',
            color: 'bg-green-100 text-green-600'
          }
        ];
      default:
        return [
          {
            title: 'Presupuestos',
            count: stats.activeBudgets,
            action: 'Ver',
            href: '/budgets',
            icon: DollarSign,
            priority: 'high',
            color: 'bg-blue-100 text-blue-600'
          },
          {
            title: 'Clientes',
            count: 0,
            action: 'Gestionar',
            href: '/clients',
            icon: Users,
            priority: 'medium',
            color: 'bg-green-100 text-green-600'
          },
          {
            title: 'Configuración',
            count: 0,
            action: 'Gestionar',
            href: '/configuration',
            icon: Bell,
            priority: 'low',
            color: 'bg-purple-100 text-purple-600'
          }
        ];
    }
  };

  const workflowItems = getWorkflowItems();

  const getPriorityBadge = (priority: string) => {
    const styles = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700'
    };
    return styles[priority as keyof typeof styles] || styles.low;
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-blue-600" />
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
                    <p className="font-medium text-slate-900 text-sm">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.count} pendientes</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityBadge(item.priority)}>
                    {item.action}
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}; 