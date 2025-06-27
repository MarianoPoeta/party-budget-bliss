
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Alert, AlertDescription } from '../components/ui/alert';
import EnhancedBudgetsTable from '../components/budget/EnhancedBudgetsTable';
import EnhancedBudgetForm from '../components/budget/EnhancedBudgetForm';
import { useBudgetsData } from '../hooks/useBudgetsData';
import { useLoadingState } from '../hooks/useLoadingState';

const EnhancedBudgets = () => {
  const { budgets } = useBudgetsData();
  const { isLoading, error, withLoading, clearError } = useLoadingState();
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);

  // Transform existing budgets to include new fields
  const enhancedBudgets = budgets.map(budget => ({
    ...budget,
    isClosed: false,
    paymentStatus: budget.status === 'paid' ? 'paid' : 'unpaid' as 'paid' | 'unpaid',
    createdAt: new Date().toISOString()
  }));

  const handleView = (id: string) => {
    // Navigate to budget details
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
    if (!confirm('Are you sure you want to delete this budget?')) return;

    await withLoading(async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Delete budget:', id);
      // TODO: Implement actual delete logic
    }, 'Failed to delete budget');
  };

  const handleSave = async (budget: any) => {
    const success = await withLoading(async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Save budget:', budget);
      // TODO: Implement actual save logic
      return true;
    }, 'Failed to save budget');

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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Budget Management</h1>
            <p className="text-slate-600">Create, track, and manage bachelor party budgets efficiently</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Budget
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
                {editingBudget ? 'Edit Budget' : 'Create New Budget'}
              </DialogTitle>
              <DialogDescription>
                {editingBudget 
                  ? 'Make changes to your budget below. All changes will be saved automatically.'
                  : 'Create a new budget by filling out the information below. You can add meals, activities, transport, and accommodation.'
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
