
import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useBudgetWorkflow } from '../../hooks/useBudgetWorkflow';
import { useBudgetCalculation } from '../../hooks/useBudgetCalculation';
import { useTemplates } from '../../hooks/useTemplates';
import BudgetHeader from './BudgetHeader';
import MealsTab from './MealsTab';
import ActivitiesTab from './ActivitiesTab';
import TransportTab from './TransportTab';
import StayTab from './StayTab';
import BudgetFormActions from './BudgetFormActions';

interface EnhancedBudgetFormProps {
  onSave: (budget: any) => void;
  onCancel: () => void;
  initialBudget?: any;
}

const EnhancedBudgetForm: React.FC<EnhancedBudgetFormProps> = ({
  onSave,
  onCancel,
  initialBudget
}) => {
  const { templates } = useTemplates();
  const {
    budget,
    validationErrors,
    addItem,
    removeItem,
    updateItem,
    validateBudget,
    updateBudgetField
  } = useBudgetWorkflow(initialBudget);

  const [searchTerms, setSearchTerms] = useState({
    meals: '',
    activities: '',
    transport: '',
    stay: ''
  });

  // Real-time budget calculation
  const totalAmount = useBudgetCalculation({
    selectedMeals: budget.selectedMeals?.map(item => item.template) || [],
    selectedActivities: budget.selectedActivities?.map(item => item.template) || [],
    selectedTransport: budget.selectedTransport?.map(item => item.template) || [],
    selectedStay: budget.selectedStay?.template,
    guestCount: budget.guestCount || 0,
    extras: budget.extras || 0
  });

  // Update total amount in real-time
  useEffect(() => {
    updateBudgetField('totalAmount', totalAmount);
  }, [totalAmount, updateBudgetField]);

  const handleSave = () => {
    const errors = validateBudget();
    if (errors.filter(e => e.severity === 'error').length === 0) {
      onSave({ ...budget, totalAmount });
    }
  };

  const updateSearchTerm = (type: 'meals' | 'activities' | 'transport' | 'stay', value: string) => {
    setSearchTerms(prev => ({ ...prev, [type]: value }));
  };

  const hasErrors = validationErrors.some(e => e.severity === 'error');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="space-y-2">
          {validationErrors.map((error, index) => (
            <Alert key={index} variant={error.severity === 'error' ? 'destructive' : 'default'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Budget Header */}
      <BudgetHeader
        budget={budget}
        totalAmount={totalAmount}
        updateBudgetField={updateBudgetField}
      />

      {/* Enhanced Tabs for Budget Items */}
      <Tabs defaultValue="meals" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="meals" className="flex items-center gap-2">
            Meals
            {budget.selectedMeals && budget.selectedMeals.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {budget.selectedMeals.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-2">
            Activities
            {budget.selectedActivities && budget.selectedActivities.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {budget.selectedActivities.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="transport" className="flex items-center gap-2">
            Transport
            {budget.selectedTransport && budget.selectedTransport.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {budget.selectedTransport.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="stay" className="flex items-center gap-2">
            Stay
            {budget.selectedStay && (
              <Badge variant="secondary" className="ml-1">1</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="meals" className="space-y-4">
          <MealsTab
            templates={templates.meals || []}
            selectedMeals={budget.selectedMeals || []}
            searchTerm={searchTerms.meals}
            guestCount={budget.guestCount || 0}
            onSearchChange={(value) => updateSearchTerm('meals', value)}
            onAddItem={(template) => addItem('meals', template)}
            onRemoveItem={(itemId) => removeItem('meals', itemId)}
          />
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <ActivitiesTab
            templates={templates.activities || []}
            selectedActivities={budget.selectedActivities || []}
            searchTerm={searchTerms.activities}
            onSearchChange={(value) => updateSearchTerm('activities', value)}
            onAddItem={(template) => addItem('activities', template)}
            onRemoveItem={(itemId) => removeItem('activities', itemId)}
            onUpdateItem={(itemId, updates) => updateItem('activities', itemId, updates)}
          />
        </TabsContent>

        <TabsContent value="transport">
          <TransportTab />
        </TabsContent>

        <TabsContent value="stay">
          <StayTab />
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <BudgetFormActions
        onCancel={onCancel}
        onSave={handleSave}
        hasErrors={hasErrors}
      />
    </div>
  );
};

export default EnhancedBudgetForm;
