import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useBudgetWorkflow } from '../../hooks/useBudgetWorkflow';
import { useBudgetCalculation } from '../../hooks/useBudgetCalculation';
import { useTemplates } from '../../hooks/useTemplates';
import { useDebounce } from '../../utils/performance';
import { ValidationService } from '../../utils/validation';
import { Menu } from '../../types/Menu';
import { BudgetItemType } from '../../types/EnhancedBudget';
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
  menus?: Menu[];
}

const EnhancedBudgetForm: React.FC<EnhancedBudgetFormProps> = ({
  onSave,
  onCancel,
  initialBudget,
  menus = []
}) => {
  const { templates, error: templatesError } = useTemplates();
  const {
    budget,
    validationErrors,
    addItem,
    removeItem,
    updateItem,
    validateBudget,
    updateBudgetField,
    isDirty,
    clearValidationErrors
  } = useBudgetWorkflow(initialBudget);

  const [searchTerms, setSearchTerms] = useState({
    meals: '',
    activities: '',
    transport: '',
    stay: ''
  });

  // Debounce search terms for better performance
  const debouncedSearchTerms = useDebounce(searchTerms, 300);

  // Real-time budget calculation with breakdown
  const budgetCalculation = useBudgetCalculation({
    selectedMeals: budget.selectedMeals || [],
    selectedActivities: budget.selectedActivities || [],
    selectedTransport: budget.selectedTransport || [],
    selectedStay: budget.selectedStay,
    guestCount: budget.guestCount || 0,
    extras: budget.extras || 0
  });

  // Memoized validation result
  const validationResult = useMemo(() => {
    return ValidationService.validateBudget({
      clientName: budget.clientName || '',
      eventDate: budget.eventDate || '',
      guestCount: budget.guestCount || 0,
      selectedMeals: budget.selectedMeals || [],
      selectedActivities: budget.selectedActivities || [],
      selectedTransport: budget.selectedTransport || [],
      selectedStay: budget.selectedStay
    });
  }, [budget]);

  // Update total amount in real-time
  useEffect(() => {
    updateBudgetField('totalAmount', budgetCalculation.totalAmount);
  }, [budgetCalculation.totalAmount, updateBudgetField]);

  // Handle save with validation
  const handleSave = useCallback(() => {
    const errors = validateBudget();
    const hasErrors = errors.filter(e => e.severity === 'error').length > 0;
    
    if (!hasErrors && validationResult.isValid) {
      onSave({ 
        ...budget, 
        totalAmount: budgetCalculation.totalAmount,
        breakdown: budgetCalculation.breakdown
      });
    }
  }, [validateBudget, validationResult.isValid, budget, budgetCalculation, onSave]);

  // Handle cancel with confirmation if dirty
  const handleCancel = useCallback(() => {
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirmed) return;
    }
    clearValidationErrors();
    onCancel();
  }, [isDirty, clearValidationErrors, onCancel]);

  // Update search term with debouncing
  const updateSearchTerm = useCallback((type: BudgetItemType, value: string) => {
    setSearchTerms(prev => ({ ...prev, [type]: value }));
  }, []);

  // Memoized error state
  const hasErrors = useMemo(() => {
    return validationErrors.some(e => e.severity === 'error') || 
           !validationResult.isValid;
  }, [validationErrors, validationResult.isValid]);

  // Memoized item counts for badges
  const itemCounts = useMemo(() => ({
    meals: budget.selectedMeals?.length || 0,
    activities: budget.selectedActivities?.length || 0,
    transport: budget.selectedTransport?.length || 0,
    stay: budget.selectedStay ? 1 : 0
  }), [budget.selectedMeals, budget.selectedActivities, budget.selectedTransport, budget.selectedStay]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Error Display */}
      {(validationErrors.length > 0 || templatesError) && (
        <div className="space-y-2">
          {validationErrors.map((error, index) => (
            <Alert key={index} variant={error.severity === 'error' ? 'destructive' : 'default'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          ))}
          {templatesError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{templatesError}</AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Budget Header */}
      <BudgetHeader
        budget={budget}
        totalAmount={budgetCalculation.totalAmount}
        updateBudgetField={updateBudgetField}
      />

      {/* Enhanced Tabs for Budget Items */}
      <Tabs defaultValue="meals" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="meals" className="flex items-center gap-2">
            Menus
            {itemCounts.meals > 0 && (
              <Badge variant="secondary" className="ml-1">
                {itemCounts.meals}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-2">
            Activities
            {itemCounts.activities > 0 && (
              <Badge variant="secondary" className="ml-1">
                {itemCounts.activities}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="transport" className="flex items-center gap-2">
            Transport
            {itemCounts.transport > 0 && (
              <Badge variant="secondary" className="ml-1">
                {itemCounts.transport}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="stay" className="flex items-center gap-2">
            Stay
            {itemCounts.stay > 0 && (
              <Badge variant="secondary" className="ml-1">1</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="meals" className="space-y-4">
          <MealsTab
            templates={menus}
            selectedMeals={budget.selectedMeals || []}
            searchTerm={debouncedSearchTerms.meals}
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
            searchTerm={debouncedSearchTerms.activities}
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
        onCancel={handleCancel}
        onSave={handleSave}
        hasErrors={hasErrors}
        isDirty={isDirty}
      />
    </div>
  );
};

export default EnhancedBudgetForm;
