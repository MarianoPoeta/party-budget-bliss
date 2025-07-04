import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Calendar,
  ShoppingCart,
  Users,
  Clock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const WeeklyPlanning: React.FC = () => {
  const { budgets, tasks } = useStore();
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Calculate week boundaries
  const weekStart = useMemo(() => {
    const start = new Date(currentWeek);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    return start;
  }, [currentWeek]);

  const weekEnd = useMemo(() => {
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  }, [weekStart]);

  // Get events for current week
  const weeklyEvents = useMemo(() => {
    return budgets
      .filter(budget => {
        const eventDate = new Date(budget.eventDate);
        return eventDate >= weekStart && eventDate <= weekEnd && budget.status === 'reserva';
      })
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  }, [budgets, weekStart, weekEnd]);

  // Get weekly tasks
  const weeklyTasks = useMemo(() => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate >= weekStart && taskDate <= weekEnd;
    });
  }, [tasks, weekStart, weekEnd]);

  // Generate consolidated shopping list
  const shoppingList = useMemo(() => {
    const items = [];
    weeklyEvents.forEach(event => {
      const guestCount = event.guestCount;
      
      items.push({
        id: `beverages-${event.id}`,
        name: 'Bebidas variadas',
        quantity: Math.ceil(guestCount * 1.5),
        unit: 'unidades',
        eventId: event.id,
        clientName: event.clientName,
        category: 'Bebidas'
      });

      items.push({
        id: `plates-${event.id}`,
        name: 'Platos y utensilios',
        quantity: guestCount,
        unit: 'sets',
        eventId: event.id,
        clientName: event.clientName,
        category: 'Utensilios'
      });

      if (guestCount > 10) {
        items.push({
          id: `tables-${event.id}`,
          name: 'Mesas adicionales',
          quantity: Math.ceil(guestCount / 8),
          unit: 'unidades',
          eventId: event.id,
          clientName: event.clientName,
          category: 'Mobiliario'
        });
      }
    });

    // Consolidate similar items
    const consolidated = new Map();
    items.forEach(item => {
      const key = `${item.name}-${item.unit}`;
      if (consolidated.has(key)) {
        const existing = consolidated.get(key);
        existing.quantity += item.quantity;
        if (!existing.clientName.includes(item.clientName)) {
          existing.clientName += `, ${item.clientName}`;
        }
      } else {
        consolidated.set(key, { ...item });
      }
    });

    return Array.from(consolidated.values());
  }, [weeklyEvents]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const formatWeekRange = () => {
    const start = weekStart.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    const end = weekEnd.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${start} - ${end}`;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Planificación Semanal</h1>
          <p className="text-slate-600 mt-2">Vista consolidada de eventos y tareas de logística</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium px-3">{formatWeekRange()}</span>
          <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Eventos</p>
                <p className="text-2xl font-bold text-slate-900">{weeklyEvents.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Invitados</p>
                <p className="text-2xl font-bold text-slate-900">
                  {weeklyEvents.reduce((sum, event) => sum + event.guestCount, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Artículos de Compra</p>
                <p className="text-2xl font-bold text-slate-900">{shoppingList.length}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Tareas Pendientes</p>
                <p className="text-2xl font-bold text-slate-900">
                  {weeklyTasks.filter(t => t.status !== 'done').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="events" className="space-y-6">
        <TabsList>
          <TabsTrigger value="events">Eventos de la Semana</TabsTrigger>
          <TabsTrigger value="shopping">Lista de Compras</TabsTrigger>
          <TabsTrigger value="timeline">Cronograma</TabsTrigger>
        </TabsList>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          {weeklyEvents.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No hay eventos esta semana</h3>
                <p className="text-slate-600">No hay eventos confirmados para esta semana</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {weeklyEvents.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{event.clientName}</CardTitle>
                        <CardDescription>
                          {new Date(event.eventDate).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">
                        {event.guestCount} invitados
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-slate-600">
                      <p>Presupuesto total: ${event.totalAmount.toLocaleString()}</p>
                      <p>Estado: <Badge className="ml-1">{event.status}</Badge></p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Shopping List Tab */}
        <TabsContent value="shopping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Compras Consolidada</CardTitle>
              <CardDescription>
                Todos los artículos necesarios para {weeklyEvents.length} eventos esta semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              {shoppingList.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                  <p className="text-slate-600">No hay artículos en la lista de compras</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(
                    shoppingList.reduce((groups: Record<string, any[]>, item) => {
                      if (!groups[item.category]) groups[item.category] = [];
                      groups[item.category].push(item);
                      return groups;
                    }, {} as Record<string, any[]>)
                  ).map(([category, items]: [string, any[]]) => (
                    <div key={category}>
                      <h4 className="font-medium mb-2 text-slate-900">{category}</h4>
                      <div className="grid gap-2">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-slate-600">Para: {item.clientName}</p>
                            </div>
                            <Badge variant="outline">
                              {item.quantity} {item.unit}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cronograma Semanal</CardTitle>
              <CardDescription>Vista temporal de tareas y entregas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const currentDay = new Date(weekStart);
                  currentDay.setDate(currentDay.getDate() + dayIndex);
                  const dayTasks = weeklyTasks.filter(task => {
                    const taskDate = new Date(task.dueDate);
                    return taskDate.toDateString() === currentDay.toDateString();
                  });

                  return (
                    <div key={dayIndex} className="border-l-2 border-slate-200 pl-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-blue-600 rounded-full -ml-6 border-2 border-white"></div>
                        <h4 className="font-medium">
                          {currentDay.toLocaleDateString('es-ES', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </h4>
                      </div>
                      {dayTasks.length > 0 ? (
                        <div className="space-y-2 mb-4">
                          {dayTasks.map((task) => (
                            <div key={task.id} className="flex items-center gap-2 text-sm">
                              {task.status === 'done' ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-orange-600" />
                              )}
                              <span>{task.description}</span>
                              <Badge>
                                {task.assignedToRole}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-600 mb-4">Sin tareas programadas</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WeeklyPlanning; 