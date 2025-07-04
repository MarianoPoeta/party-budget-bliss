import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  PlayCircle,
  Calendar,
  Users,
  ArrowRight,
  Filter
} from 'lucide-react';
import { TaskScheduler } from '../services/taskScheduler';

const TaskDashboard: React.FC = () => {
  const { tasks, currentUser, updateTask } = useStore();
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Filter tasks for current user role
  const userTasks = useMemo(() => {
    if (!currentUser) return [];
    return tasks.filter(task => task.assignedToRole === currentUser.role);
  }, [tasks, currentUser]);

  // Apply filters
  const filteredTasks = useMemo(() => {
    return userTasks.filter(task => {
      const priorityMatch = selectedPriority === 'all' || task.priority === selectedPriority;
      const statusMatch = selectedStatus === 'all' || task.status === selectedStatus;
      return priorityMatch && statusMatch;
    });
  }, [userTasks, selectedPriority, selectedStatus]);

  // Get next available tasks (not blocked)
  const availableTasks = useMemo(() => {
    if (!currentUser) return [];
    return TaskScheduler.getTasksByRole(tasks, currentUser.role);
  }, [tasks, currentUser]);

  // Task statistics
  const taskStats = useMemo(() => {
    return {
      total: userTasks.length,
      todo: userTasks.filter(t => t.status === 'todo').length,
      inProgress: userTasks.filter(t => t.status === 'in_progress').length,
      done: userTasks.filter(t => t.status === 'done').length,
      blocked: userTasks.filter(t => t.status === 'blocked').length,
      urgent: userTasks.filter(t => t.priority === 'urgent').length,
      overdue: userTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'done').length
    };
  }, [userTasks]);

  const handleStatusChange = (taskId: string, newStatus: 'todo' | 'in_progress' | 'done' | 'blocked') => {
    updateTask({ 
      id: taskId, 
      status: newStatus,
      updatedAt: new Date().toISOString()
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <PlayCircle className="h-4 w-4 text-blue-600" />;
      case 'blocked': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== 'done';
  };

  if (!currentUser) {
    return <div>No hay usuario autenticado</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Panel de Tareas</h1>
          <p className="text-slate-600 mt-2">
            Gestión de tareas para {currentUser.role === 'logistics' ? 'Logística' : 'Cocina'}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Tareas</p>
                <p className="text-2xl font-bold text-slate-900">{taskStats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">En Progreso</p>
                <p className="text-2xl font-bold text-slate-900">{taskStats.inProgress}</p>
              </div>
              <PlayCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Urgentes</p>
                <p className="text-2xl font-bold text-slate-900">{taskStats.urgent}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Completadas</p>
                <p className="text-2xl font-bold text-slate-900">{taskStats.done}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="available" className="space-y-6">
        <TabsList>
          <TabsTrigger value="available">Tareas Disponibles</TabsTrigger>
          <TabsTrigger value="all">Todas las Tareas</TabsTrigger>
          <TabsTrigger value="schedule">Cronograma</TabsTrigger>
        </TabsList>

        {/* Available Tasks Tab */}
        <TabsContent value="available" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Próximas Tareas Disponibles</CardTitle>
              <CardDescription>
                Tareas que puedes comenzar ahora (sin dependencias bloqueantes)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {availableTasks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-300" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">¡Todas las tareas completadas!</h3>
                  <p className="text-slate-600">No hay tareas disponibles en este momento</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(task.status)}
                        <div>
                          <h4 className="font-medium text-slate-900">{task.description}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                            <span className="text-sm text-slate-600">
                              Vence: {new Date(task.dueDate).toLocaleDateString('es-ES')}
                            </span>
                            {task.estimatedDuration && (
                              <span className="text-sm text-slate-600">
                                ~{task.estimatedDuration}h
                              </span>
                            )}
                            {isOverdue(task.dueDate, task.status) && (
                              <Badge className="bg-red-100 text-red-800">
                                Retrasada
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {task.status === 'todo' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleStatusChange(task.id, 'in_progress')}
                          >
                            Comenzar
                          </Button>
                        )}
                        {task.status === 'in_progress' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStatusChange(task.id, 'done')}
                          >
                            Completar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Tasks Tab */}
        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div>
                  <label className="text-sm font-medium">Prioridad:</label>
                  <select 
                    value={selectedPriority} 
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="ml-2 border rounded px-2 py-1"
                  >
                    <option value="all">Todas</option>
                    <option value="urgent">Urgente</option>
                    <option value="high">Alta</option>
                    <option value="medium">Media</option>
                    <option value="low">Baja</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Estado:</label>
                  <select 
                    value={selectedStatus} 
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="ml-2 border rounded px-2 py-1"
                  >
                    <option value="all">Todos</option>
                    <option value="todo">Por hacer</option>
                    <option value="in_progress">En progreso</option>
                    <option value="done">Completado</option>
                    <option value="blocked">Bloqueado</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks List */}
          <Card>
            <CardHeader>
              <CardTitle>Todas las Tareas ({filteredTasks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(task.status)}
                      <div>
                        <h4 className="font-medium">{task.description}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <span className="text-sm text-slate-600">
                            {new Date(task.dueDate).toLocaleDateString('es-ES')}
                          </span>
                          {task.autoScheduled && (
                            <Badge variant="outline">Auto-programada</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{task.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cronograma de Tareas</CardTitle>
              <CardDescription>Vista temporal de todas las tareas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Group tasks by date */}
                {Object.entries(
                  userTasks.reduce((groups: Record<string, typeof userTasks>, task) => {
                    const date = new Date(task.dueDate).toDateString();
                    if (!groups[date]) groups[date] = [];
                    groups[date].push(task);
                    return groups;
                  }, {})
                )
                .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                .map(([date, dayTasks]) => (
                  <div key={date} className="border-l-2 border-blue-200 pl-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 bg-blue-600 rounded-full -ml-6 border-2 border-white"></div>
                      <h4 className="font-medium">
                        {new Date(date).toLocaleDateString('es-ES', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h4>
                    </div>
                    <div className="space-y-2 mb-4">
                      {dayTasks.map((task) => (
                        <div key={task.id} className="flex items-center gap-2 text-sm">
                          {getStatusIcon(task.status)}
                          <span className="flex-1">{task.description}</span>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskDashboard; 