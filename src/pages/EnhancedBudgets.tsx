
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import EnhancedBudgetsTable from '../components/budget/EnhancedBudgetsTable';
import EnhancedBudgetForm from '../components/budget/EnhancedBudgetForm';
import { useBudgetsData } from '../hooks/useBudgetsData';

const EnhancedBudgets = () => {
  const { budgets } = useBudgetsData();
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
    setEditingBudget(budget);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      // Handle delete logic
      console.log('Delete budget:', id);
    }
  };

  const handleSave = (budget: any) => {
    console.log('Save budget:', budget);
    setShowForm(false);
    setEditingBudget(null);
    // Handle save logic here
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBudget(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Budget Management</h1>
            <p className="text-slate-600">Create, track, and manage bachelor party budgets efficiently</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
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
