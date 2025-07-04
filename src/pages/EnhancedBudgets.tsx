import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { Alert, AlertDescription } from '../components/ui/alert';
import ResponsiveBudgetsTable from '../components/budget/ResponsiveBudgetsTable';
import UnifiedBudgetCreator from '../components/budget/UnifiedBudgetCreator';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useBudgetsData } from '../hooks/useBudgetsData';
import { useLoadingState } from '../hooks/useLoadingState';
import { useStore } from '../store';

const EnhancedBudgets = () => {
  const { budgets, isLoading: dataLoading, error: dataError, updateBudget, deleteBudget } = useBudgetsData();
  const { isLoading, error, withLoading, clearError } = useLoadingState();
  const { addBudget } = useStore();
  const [showCreator, setShowCreator] = useState(false);
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
      setShowCreator(true);
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
      } else {
        // For new budgets, add to store
        addBudget({
          ...budget,
          id: budget.id || `budget-${Date.now()}`,
          name: `${budget.clientName}'s Budget`,
          eventType: 'Bachelor Party',
          activities: budget.selectedActivities?.map((a: any) => a.template.name) || [],
          status: 'draft',
          mealsAmount: budget.breakdown?.meals || 0,
          activitiesAmount: budget.breakdown?.activities || 0,
          transportAmount: budget.breakdown?.transport || 0,
          accommodationAmount: budget.breakdown?.stay || 0,
          createdAt: new Date().toISOString(),
          templateId: '1'
        });
      }
      return true;
    }, 'Error al guardar el presupuesto');

    if (success) {
      setShowCreator(false);
      setEditingBudget(null);
    }
  };

  const handleCancel = () => {
    setShowCreator(false);
    setEditingBudget(null);
    clearError();
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Cargando presupuestos..." />
      </div>
    );
  }

  return (
    <>
      {/* Content with proper spacing */}
      <div className="space-y-6">
        {/* Error Display */}
        {(error || dataError) && (
          <Alert variant="destructive">
            <AlertDescription>{error || dataError}</AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Gestión de Presupuestos</h1>
            <p className="text-slate-600 text-sm sm:text-base">Crear, rastrear y gestionar presupuestos de despedidas de soltero eficientemente</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              onClick={() => setShowCreator(true)}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span className="sm:inline">Nuevo Presupuesto</span>
            </Button>
          </div>
        </div>

        {/* Responsive Budgets Table */}
        <ResponsiveBudgetsTable
          budgets={enhancedBudgets}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Unified Budget Creator Dialog */}
        <Dialog open={showCreator} onOpenChange={setShowCreator}>
          <DialogContent className="max-w-[98vw] w-full max-h-[98vh] overflow-hidden p-0">
            <UnifiedBudgetCreator
              initialBudget={editingBudget}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default EnhancedBudgets;
