import React, { useMemo, useState } from 'react';
import Layout from '../components/Layout';
import { useStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Calendar } from 'lucide-react';

const LogisticsDashboard: React.FC = () => {
  const { budgets, products, tasks, updateTask } = useStore();
  const [purchased, setPurchased] = useState<{ [needId: string]: boolean }>({});

  // Get all budgets with status 'reserva' and eventDate within next 7 days
  const now = new Date();
  const weekFromNow = new Date();
  weekFromNow.setDate(now.getDate() + 7);
  const upcomingBudgets = useMemo(() =>
    budgets.filter(b => b.status === 'reserva' && new Date(b.eventDate) >= now && new Date(b.eventDate) <= weekFromNow),
    [budgets]
  );

  // Gather all logistics tasks for these budgets
  const logisticsTasks = useMemo(() =>
    tasks.filter(t => t.assignedToRole === 'logistics' && upcomingBudgets.some(b => b.id === t.relatedBudgetId)),
    [tasks, upcomingBudgets]
  );

  // Consolidate product needs from all logistics tasks
  const shoppingList = useMemo(() => {
    const productMap: { [productId: string]: { product: any; quantity: number; needs: any[] } } = {};
    logisticsTasks.forEach(task => {
      (task.needs || []).forEach(need => {
        const product = products.find(p => need.description.includes(p.name));
        if (product) {
          if (!productMap[product.id]) {
            productMap[product.id] = { product, quantity: 0, needs: [] };
          }
          productMap[product.id].quantity += need.quantity;
          productMap[product.id].needs.push({ ...need, taskId: task.id });
        }
      });
    });
    return Object.values(productMap);
  }, [logisticsTasks, products]);

  const handleTogglePurchased = (needId: string, taskId: string) => {
    setPurchased(prev => ({ ...prev, [needId]: !prev[needId] }));
    // Optionally update task/need status in store
    const task = tasks.find(t => t.id === taskId);
    if (task && task.needs) {
      const updatedNeeds = task.needs.map(n => n.id === needId ? { ...n, status: 'done' } : n);
      updateTask({ ...task, needs: updatedNeeds });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Logística: Compras Semanales</h1>
          <Badge className="bg-indigo-100 text-indigo-800">Semana actual</Badge>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Lista Consolidada de Compras</CardTitle>
          </CardHeader>
          <CardContent>
            {shoppingList.length === 0 ? (
              <div className="text-slate-500">No hay productos pendientes para la semana.</div>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left">Producto</th>
                    <th className="text-left">Cantidad Total</th>
                    <th className="text-left">Proveedor</th>
                    <th className="text-left">Precio Estimado</th>
                    <th className="text-left">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {shoppingList.map(({ product, quantity, needs }) => (
                    <tr key={product.id} className="border-b">
                      <td>{product.name}</td>
                      <td>{quantity} {product.unit}</td>
                      <td>{product.supplier}</td>
                      <td>${(product.estimatedPrice * quantity).toLocaleString()}</td>
                      <td>
                        {needs.map(need => (
                          <div key={need.id} className="flex items-center gap-2">
                            <Checkbox checked={purchased[need.id] || need.status === 'done'} onCheckedChange={() => handleTogglePurchased(need.id, need.taskId)} />
                            <span className={purchased[need.id] || need.status === 'done' ? 'line-through text-green-600' : ''}>
                              {need.description}
                            </span>
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Eventos de la Semana</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingBudgets.length === 0 ? (
              <div className="text-slate-500">No hay eventos reservados para la semana.</div>
            ) : (
              <ul className="space-y-2">
                {upcomingBudgets.map(budget => (
                  <li key={budget.id} className="flex items-center gap-4">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="font-medium text-slate-800">{budget.clientName}</span>
                    <span className="text-slate-500">{budget.eventType}</span>
                    <span className="text-slate-500">{new Date(budget.eventDate).toLocaleDateString()}</span>
                    <Badge className="bg-indigo-100 text-indigo-800">Reserva</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LogisticsDashboard; 