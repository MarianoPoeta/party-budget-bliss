import React, { useState } from 'react';
import { mockTasks } from '../mock/mockTasks';
import { mockUsers } from '../mock/mockUsers';
import { Task, TaskStatus, Need } from '../types/Task';
import { User } from '../types/User';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import Layout from '../components/Layout';
import { useStore } from '../store';

const localizer = momentLocalizer(moment);

const statusColors = {
  todo: 'bg-slate-200 text-slate-800',
  in_progress: 'bg-yellow-200 text-yellow-800',
  done: 'bg-green-200 text-green-800',
};

const CookDashboard: React.FC = () => {
  const currentUser = useStore(s => s.currentUser);
  const setCurrentUser = useStore(s => s.setCurrentUser);
  const tasks = useStore(s => s.tasks);
  const setTasks = useStore(s => s.setTasks);
  const notifications = useStore(s => s.notifications);
  const addToast = useStore(s => s.addToast);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [newNeed, setNewNeed] = useState<{ mealId: string; description: string; quantity: number }>({ mealId: '', description: '', quantity: 1 });

  // Only show cook tasks
  const cookTasks = tasks.filter(t => t.assignedToRole === 'cook');

  // Calendar events
  const events = cookTasks.map(task => ({
    id: task.id,
    title: task.description,
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    resource: task,
    allDay: false,
  }));

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    const newTasks = tasks.map(t => t.id === taskId ? { ...t, status } : t);
    setTasks(newTasks);
  };

  const handleAddNeed = (taskId: string) => {
    const newTasks = tasks.map(t => {
      if (t.id === taskId) {
        const needs = t.needs ? [...t.needs] : [];
        needs.push({
          id: 'n' + (needs.length + 1),
          description: newNeed.description,
          quantity: newNeed.quantity,
          status: 'todo',
          requestedBy: currentUser.name,
        });
        return { ...t, needs };
      }
      return t;
    });
    setTasks(newTasks);
    setNewNeed({ mealId: '', description: '', quantity: 1 });
    addToast({ id: Date.now().toString(), message: 'Need/request added!', type: 'success' });
  };

  return (
    <Layout>
      {/* Role Switcher */}
      <div className="flex items-center gap-4 mb-6">
        <span className="font-medium">View as:</span>
        {mockUsers.map(user => (
          <Button
            key={user.id}
            variant={user.id === currentUser.id ? 'default' : 'outline'}
            onClick={() => setCurrentUser(user)}
          >
            {user.name} ({user.role})
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Cook Dashboard</CardTitle>
          <div className="flex gap-2">
            <Button variant={view === 'calendar' ? 'default' : 'outline'} onClick={() => setView('calendar')}>Calendar</Button>
            <Button variant={view === 'list' ? 'default' : 'outline'} onClick={() => setView('list')}>List</Button>
          </div>
        </CardHeader>
        <CardContent>
          {view === 'calendar' ? (
            <div className="h-[600px] bg-white rounded shadow">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                titleAccessor="title"
                style={{ height: 600 }}
                eventPropGetter={event => {
                  const task = event.resource as Task;
                  return {
                    className: statusColors[task.status],
                  };
                }}
                tooltipAccessor={event => event.title}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {cookTasks.length === 0 && <div className="text-slate-500">No tasks found.</div>}
              {cookTasks.map(task => (
                <Card key={task.id} className="border-slate-200">
                  <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-800">{task.description}</span>
                        <Badge className={statusColors[task.status]}>{task.status.replace('_', ' ')}</Badge>
                      </div>
                      <div className="text-xs text-slate-500 mb-1">Due: {moment(task.dueDate).format('YYYY-MM-DD HH:mm')}</div>
                      {task.notes && <div className="text-xs text-slate-600 italic">{task.notes}</div>}
                      {/* Needs/Requests */}
                      <div className="mt-2">
                        <div className="font-medium text-xs mb-1">Needs/Requests:</div>
                        <ul className="list-disc pl-5 space-y-1">
                          {task.needs && task.needs.length > 0 ? (
                            task.needs.map(need => (
                              <li key={need.id} className="text-xs flex items-center gap-2">
                                <span>{need.description} (x{need.quantity})</span>
                                <Badge className={statusColors[need.status]}>{need.status.replace('_', ' ')}</Badge>
                                {need.fulfilledBy && <span className="text-green-700">Fulfilled by {need.fulfilledBy}</span>}
                              </li>
                            ))
                          ) : (
                            <li className="text-xs text-slate-400">No needs yet.</li>
                          )}
                        </ul>
                        {/* Add Need */}
                        <div className="flex gap-2 mt-2">
                          <Input
                            placeholder="Add need/request..."
                            value={newNeed.description}
                            onChange={e => setNewNeed(n => ({ ...n, description: e.target.value }))}
                            className="text-xs"
                          />
                          <Input
                            type="number"
                            min={1}
                            value={newNeed.quantity}
                            onChange={e => setNewNeed(n => ({ ...n, quantity: parseInt(e.target.value) || 1 }))}
                            className="text-xs w-16"
                          />
                          <Button size="sm" onClick={() => handleAddNeed(task.id)} disabled={!newNeed.description}>Add</Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[180px]">
                      <select
                        value={task.status}
                        onChange={e => handleStatusChange(task.id, e.target.value as TaskStatus)}
                        className="border rounded p-1 text-sm"
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default CookDashboard; 