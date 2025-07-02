import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Alert, AlertDescription } from '../components/ui/alert';
import EnhancedBudgetsTable from '../components/budget/EnhancedBudgetsTable';
import EnhancedBudgetForm from '../components/budget/EnhancedBudgetForm';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useBudgetsData } from '../hooks/useBudgetsData';
import { useLoadingState } from '../hooks/useLoadingState';

const EnhancedBudgets = () => {
  const { budgets, isLoading: dataLoading, error: dataError, updateBudget, deleteBudget } = useBudgetsData();
  const { isLoading, error, withLoading, clearError } = useLoadingState();
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);

  // Transform existing budgets to include new fields
  const enhancedBudgets = budgets.map(budget => ({
    ...budget,
    isClosed: false,
    paymentStatus: budget.status === 'paid' ? 'paid' : 'unpaid' as 'paid' | 'unpaid',
    createdAt: budget.createdAt || new Date().toISOString()
  }));

  const handleView = (id: string) => {
    window.location.href = `/budgets/${id}`;
  };

  const handleEdit = (id: string) => {
    const budget = enhancedBudgets.find(b => b.id === id);
    if (budget) {
      setEditingBudget(budget);
      setShowForm(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este presupuesto?')) return;

    await withLoading(async () => {
      deleteBudget(id);
    }, 'Error al eliminar el presupuesto');
  };

  const handleSave = async (budget: any) => {
    const success = await withLoading(async () => {
      if (editingBudget) {
        updateBudget(editingBudget.id, budget);
      }
      return true;
    }, 'Error al guardar el presupuesto');

    if (success) {
      setShowForm(false);
      setEditingBudget(null);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBudget(null);
    clearError();
  };

  if (dataLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" text="Cargando presupuestos..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Error Display */}
        {(error || dataError) && (
          <Alert variant="destructive">
            <AlertDescription>{error || dataError}</AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Gestión de Presupuestos</h1>
            <p className="text-slate-600">Crear, rastrear y gestionar presupuestos de despedidas de soltero eficientemente</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nuevo Presupuesto
          </Button>
        </div>

        {/* Enhanced Budgets Table */}
        <EnhancedBudgetsTable
          budgets={enhancedBudgets}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Budget Form Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBudget ? 'Editar Presupuesto' : 'Crear Nuevo Presupuesto'}
              </DialogTitle>
              <DialogDescription>
                {editingBudget 
                  ? 'Realiza cambios en tu presupuesto a continuación. Todos los cambios se guardarán automáticamente.'
                  : 'Crea un nuevo presupuesto completando la información a continuación. Puedes agregar comidas, actividades, transporte y alojamiento.'
                }
              </DialogDescription>
            </DialogHeader>
            <EnhancedBudgetForm
              initialBudget={editingBudget}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default EnhancedBudgets;
