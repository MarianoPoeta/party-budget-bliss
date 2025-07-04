import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { 
  DollarSign, 
  Users, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  ArrowRight,
  BarChart3,
  Activity,
  CalendarDays,
  ShoppingCart,
  ChefHat,
  MapPin,
  Truck,
  Settings
} from 'lucide-react';
import { useStore } from '../store';

import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    budgets, 
    tasks, 
    currentUser, 
    setCurrentUser,
    notifications 
  } = useStore();
  
  const [activeTab, setActiveTab] = useState('workflow');

  // Calculate dashboard metrics
  const totalBudgets = budgets.length;
  const activeBudgets = budgets.filter(b => b.status === 'pending').length;
  const completedBudgets = budgets.filter(b => b.status === 'completed').length;
  const reservaBudgets = budgets.filter(b => b.status === 'reserva').length;
  const totalRevenue = budgets.reduce((sum, b) => sum + b.totalAmount, 0);
  const pendingTasks = tasks.filter(t => t.status === 'todo').length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const totalTasks = tasks.length;
  const overdueTasks = tasks.filter(t => {
    if (t.dueDate && t.status !== 'done') {
      return new Date(t.dueDate) < new Date();
    }
    return false;
  }).length;

  // Get upcoming events (next 7 days)
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const weekFromNow = new Date();
    weekFromNow.setDate(now.getDate() + 7);
    
    return budgets
      .filter(b => new Date(b.eventDate) >= now && new Date(b.eventDate) <= weekFromNow)
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
      .slice(0, 5);
  }, [budgets]);

  // Get urgent tasks
  const urgentTasks = useMemo(() => {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    
    return tasks
      .filter(t => {
        if (t.status === 'done') return false;
        if (t.assignedToRole !== currentUser.role && currentUser.role !== 'admin') return false;
        return new Date(t.dueDate) <= tomorrow;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  }, [tasks, currentUser.role]);

  // Get role-specific stats and workflow
  const getRoleWorkflow = () => {
    switch (currentUser.role) {
      case 'admin':
        return {
          title: 'Panel de Administración',
          description: 'Gestión completa del sistema y supervisión de operaciones',
          stats: [
            { label: 'Presupuestos Totales', value: totalBudgets, icon: DollarSign, color: 'text-blue-600', trend: '+12%' },
            { label: 'En Reserva', value: reservaBudgets, icon: Calendar, color: 'text-indigo-600', trend: '+5%' },
            { label: 'Tareas Pendientes', value: pendingTasks, icon: Clock, color: 'text-orange-600', trend: '-8%' },
            { label: 'Ingresos Totales', value: `$${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', trend: '+15%' }
          ],
          workflow: [
            { title: 'Presupuestos Pendientes', count: activeBudgets, action: 'Revisar', href: '/budgets', icon: DollarSign },
            { title: 'Clientes', count: 0, action: 'Gestionar', href: '/clients', icon: Users },
            { title: 'Configuración', count: 0, action: 'Gestionar', href: '/configuration', icon: Settings },
            { title: 'Eventos Próximos', count: upcomingEvents.length, action: 'Ver', href: '/budgets', icon: CalendarDays }
          ]
        };
      case 'sales':
        return {
          title: 'Panel de Ventas',
          description: 'Gestión de presupuestos y seguimiento de clientes',
          stats: [
            { label: 'Presupuestos Activos', value: activeBudgets, icon: DollarSign, color: 'text-blue-600', trend: '+8%' },
            { label: 'En Reserva', value: reservaBudgets, icon: Calendar, color: 'text-indigo-600', trend: '+12%' },
            { label: 'Completados', value: completedBudgets, icon: CheckCircle, color: 'text-green-600', trend: '+3%' },
            { label: 'Ingresos Generados', value: `$${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', trend: '+18%' }
          ],
          workflow: [
            { title: 'Presupuestos por Aprobar', count: activeBudgets, action: 'Revisar', href: '/budgets', icon: DollarSign },
            { title: 'Clientes en Espera', count: budgets.filter(b => b.status === 'pending').length, action: 'Contactar', href: '/clients', icon: Users },
            { title: 'Eventos Próximos', count: upcomingEvents.length, action: 'Preparar', href: '/budgets', icon: CalendarDays },
            { title: 'Configuración', count: 0, action: 'Gestionar', href: '/configuration', icon: Settings }
          ]
        };
      default:
        return {
          title: 'Panel Principal',
          description: 'Vista general del sistema Magnus',
          stats: [
            { label: 'Presupuestos', value: totalBudgets, icon: DollarSign, color: 'text-blue-600', trend: '+10%' },
            { label: 'Clientes', value: 0, icon: Users, color: 'text-purple-600', trend: '+5%' },
            { label: 'Completados', value: completedTasks, icon: CheckCircle, color: 'text-green-600', trend: '+15%' },
            { label: 'Ingresos', value: `$${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', trend: '+12%' }
          ],
          workflow: [
            { title: 'Presupuestos', count: totalBudgets, action: 'Ver', href: '/budgets', icon: DollarSign },
            { title: 'Clientes', count: 0, action: 'Gestionar', href: '/clients', icon: Users },
            { title: 'Configuración', count: 0, action: 'Gestionar', href: '/configuration', icon: Settings },
            { title: 'Eventos', count: upcomingEvents.length, action: 'Ver', href: '/budgets', icon: CalendarDays }
          ]
        };
    }
  };

  const roleWorkflow = getRoleWorkflow();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'todo': return 'bg-yellow-100 text-yellow-800';
      case 'reserva': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'done': return 'Completada';
      case 'in_progress': return 'En Progreso';
      case 'todo': return 'Pendiente';
      case 'reserva': return 'Reserva';
      default: return status;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'delivery': return Truck;
      case 'cooking': return ChefHat;
      case 'shopping': return ShoppingCart;
      case 'reservation': return MapPin;
      case 'need': return Activity;
      default: return Activity;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{roleWorkflow.title}</h1>
          <p className="text-slate-600 mt-2">{roleWorkflow.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="capitalize">
            {currentUser.role === 'admin' ? 'Administrador' : 
             currentUser.role === 'sales' ? 'Ventas' : 'Principal'}
          </Badge>
          <Button onClick={() => navigate('/new-budget')} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Presupuesto
          </Button>
        </div>
      </div>

      {/* Stats Cards with Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roleWorkflow.stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                  <Badge variant="outline" className={`text-xs ${stat.trend?.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Workflow Overview */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-blue-600" />
            Flujo de Trabajo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roleWorkflow.workflow.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-200 hover:border-blue-300 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${index === 0 ? 'bg-red-100' : index === 1 ? 'bg-orange-100' : index === 2 ? 'bg-blue-100' : 'bg-green-100'}`}>
                      <Icon className={`h-5 w-5 ${index === 0 ? 'text-red-600' : index === 1 ? 'text-orange-600' : index === 2 ? 'text-blue-600' : 'text-green-600'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-600">{item.count} items</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate(item.href)}
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="workflow">Flujo de Trabajo</TabsTrigger>
          <TabsTrigger value="urgent">Urgente</TabsTrigger>
          <TabsTrigger value="upcoming">Próximos Eventos</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
        </TabsList>

        {/* Workflow Tab */}
        <TabsContent value="workflow" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Budgets */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  Presupuestos Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgets.slice(0, 5).map((budget) => (
                    <div key={budget.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-200 hover:border-blue-300 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <DollarSign className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{budget.clientName}</p>
                          <p className="text-sm text-slate-600">{budget.eventType}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">${budget.totalAmount.toLocaleString()}</p>
                        <Badge variant={budget.status === 'completed' ? 'default' : 'secondary'}>
                          {budget.status === 'completed' ? 'Completado' : 
                           budget.status === 'pending' ? 'Activo' : 
                           budget.status === 'reserva' ? 'Reserva' : 'Borrador'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigate('/budgets')}
                >
                  Ver Todos los Presupuestos
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Recent Tasks */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Tareas Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks
                    .filter(t => t.assignedToRole === currentUser.role || currentUser.role === 'admin')
                    .slice(0, 5)
                    .map((task) => {
                      const CategoryIcon = getCategoryIcon(task.type);
                      return (
                        <div key={task.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-200 hover:border-green-300 transition-all duration-300">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <CategoryIcon className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{task.description}</p>
                              <p className="text-sm text-slate-600">{new Date(task.dueDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(task.status)}>
                            {getStatusText(task.status)}
                          </Badge>
                        </div>
                      );
                    })}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigate('/tasks')}
                >
                  Ver Todas las Tareas
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Urgent Tab */}
        <TabsContent value="urgent" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Tareas Urgentes ({urgentTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {urgentTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-slate-900 mb-2">¡Excelente trabajo!</p>
                    <p className="text-slate-600">No hay tareas urgentes pendientes.</p>
                  </div>
                ) : (
                  urgentTasks.map((task) => {
                    const CategoryIcon = getCategoryIcon(task.type);
                    const isOverdue = new Date(task.dueDate) < new Date();
                    return (
                      <div key={task.id} className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 ${
                        isOverdue 
                          ? 'bg-red-50 border-red-200 hover:border-red-300' 
                          : 'bg-orange-50 border-orange-200 hover:border-orange-300'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isOverdue ? 'bg-red-100' : 'bg-orange-100'}`}>
                            <CategoryIcon className={`h-4 w-4 ${isOverdue ? 'text-red-600' : 'text-orange-600'}`} />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{task.description}</p>
                            <p className="text-sm text-slate-600">
                              Vence: {new Date(task.dueDate).toLocaleDateString()}
                              {isOverdue && <span className="text-red-600 ml-2">(Vencida)</span>}
                            </p>
                          </div>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => navigate(`/tasks/${task.id}`)}
                          className={isOverdue ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'}
                        >
                          {isOverdue ? 'Urgente' : 'Atender'}
                        </Button>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upcoming Events Tab */}
        <TabsContent value="upcoming" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-indigo-600" />
                Próximos Eventos ({upcomingEvents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-slate-900 mb-2">Sin eventos próximos</p>
                    <p className="text-slate-600">No hay eventos programados para los próximos 7 días.</p>
                  </div>
                ) : (
                  upcomingEvents.map((budget) => {
                    const daysUntil = Math.ceil((new Date(budget.eventDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={budget.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-white rounded-lg border border-indigo-200 hover:border-indigo-300 transition-all duration-300">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <Calendar className="h-4 w-4 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{budget.clientName}</p>
                            <p className="text-sm text-slate-600">{budget.eventType} • {budget.guestCount} invitados</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">${budget.totalAmount.toLocaleString()}</p>
                          <Badge variant={daysUntil <= 1 ? 'destructive' : daysUntil <= 3 ? 'secondary' : 'outline'}>
                            {daysUntil === 0 ? 'Hoy' : daysUntil === 1 ? 'Mañana' : `En ${daysUntil} días`}
                          </Badge>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Métricas de Rendimiento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">Tareas Completadas</span>
                    <span className="text-sm text-slate-600">{completedTasks}/{totalTasks}</span>
                  </div>
                  <Progress value={(completedTasks / (completedTasks + pendingTasks)) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">Presupuestos Aprobados</span>
                    <span className="text-sm text-slate-600">{reservaBudgets}/{totalBudgets}</span>
                  </div>
                  <Progress value={(reservaBudgets / totalBudgets) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">Eficiencia General</span>
                    <span className="text-sm text-slate-600">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Sistema Overview */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  Sistema Magnus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Gestión de Presupuestos</span>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => navigate('/budgets')}
                    >
                      Ver
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Gestión de Clientes</span>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => navigate('/clients')}
                    >
                      Ver
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Settings className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Configuración</span>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => navigate('/configuration')}
                    >
                      Ver
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
