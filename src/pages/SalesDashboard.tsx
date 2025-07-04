import React, { useState } from 'react';
import { mockTasks } from '../mock/mockTasks';
import { mockUsers } from '../mock/mockUsers';
import { Task } from '../types/Task';
import { User } from '../types/User';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

import { useStore } from '../store';


// Mock budgets/events
const mockBudgets = [
  { id: 'b1', name: "Martín's Bachelor Party", date: '2024-07-13' },
  { id: 'b2', name: "Lucas's Bachelor Party", date: '2024-08-02' },
];

const statusColors = {
  todo: 'bg-slate-200 text-slate-800',
  in_progress: 'bg-yellow-200 text-yellow-800',
  done: 'bg-green-200 text-green-800',
};

const SalesDashboard: React.FC = () => {
  const currentUser = useStore(s => s.currentUser);
  const setCurrentUser = useStore(s => s.setCurrentUser);
  const tasks = useStore(s => s.tasks);
  const setTasks = useStore(s => s.setTasks);
  const notifications = useStore(s => s.notifications);
  const [budgets, setBudgets] = useState(mockBudgets);
  const [assignments, setAssignments] = useState<{ [budgetId: string]: { logistics?: string; cook?: string } }>({});

  const handleAssign = (budgetId: string, role: 'logistics' | 'cook', userId: string) => {
    setAssignments(prev => ({
      ...prev,
      [budgetId]: { ...prev[budgetId], [role]: userId },
    }));
  };

  return (
    <Card>
        <CardHeader>
          <CardTitle className="text-xl">Sales/Coordinator Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {budgets.map(budget => {
              const budgetTasks = tasks.filter(t => t.relatedBudgetId === budget.id);
              return (
                <Card key={budget.id} className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg">{budget.name} <span className="text-xs text-slate-500">({budget.date})</span></CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex gap-4 items-center mb-2">
                      <span className="text-sm">Assign:</span>
                      <span>Logistics:</span>
                      <select
                        value={assignments[budget.id]?.logistics || ''}
                        onChange={e => handleAssign(budget.id, 'logistics', e.target.value)}
                        className="border rounded p-1 text-sm"
                      >
                        <option value="">Unassigned</option>
                        {mockUsers.filter(u => u.role === 'logistics').map(u => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </select>
                      <span>Cook:</span>
                      <select
                        value={assignments[budget.id]?.cook || ''}
                        onChange={e => handleAssign(budget.id, 'cook', e.target.value)}
                        className="border rounded p-1 text-sm"
                      >
                        <option value="">Unassigned</option>
                        {mockUsers.filter(u => u.role === 'cook').map(u => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      {budgetTasks.length === 0 && <div className="text-slate-400 text-xs">No tasks for this event.</div>}
                      {budgetTasks.map(task => (
                        <div key={task.id} className="flex items-center gap-2 text-xs">
                          <span className="font-medium text-slate-700">{task.description}</span>
                          <Badge className={statusColors[task.status]}>{task.status.replace('_', ' ')}</Badge>
                          <span className="text-slate-400">({task.type})</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
  );
};

export default SalesDashboard; 