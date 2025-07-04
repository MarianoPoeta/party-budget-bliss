import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useBudgetWorkflow } from '../../hooks/useBudgetWorkflow';
import { useBudgetCalculation } from '../../hooks/useBudgetCalculation';
import { useStore } from '../../store';
import { useDebounce } from '../../utils/performance';
import { ValidationService } from '../../utils/validation';
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
}

const EnhancedBudgetForm: React.FC<EnhancedBudgetFormProps> = ({
  onSave,
  onCancel,
  initialBudget
}) => {
  // Get all templates from store
  const { 
    menus, 
    activities, 
    accommodations, 
    transportTemplates,
    addToast 
  } = useStore();

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

  const [activeTab, setActiveTab] = useState('meals');
  const [isLoading, setIsLoading] = useState(false);

  // Debounce search terms for better performance
  const debouncedSearchTerms = useDebounce(searchTerms, 300);

  // Real-time budget calculation with breakdown
  const budgetCalculation = useBudgetCalculation({
    selectedMeals: budget.selectedMeals || [],
    selectedActivities: budget.selectedActivities || [],
    selectedTransport: budget.selectedTransport || [],
    transportAssignments: budget.transportAssignments || [],
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
  const handleSave = useCallback(async () => {
    setIsLoading(true);
    try {
      const errors = validateBudget();
      const hasErrors = errors.filter(e => e.severity === 'error').length > 0;
      
      if (!hasErrors && validationResult.isValid) {
        const budgetToSave = { 
          ...budget, 
          totalAmount: budgetCalculation.totalAmount,
          breakdown: budgetCalculation.breakdown,
          id: budget.id || `budget-${Date.now()}`,
          createdAt: budget.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        await onSave(budgetToSave);
        addToast({
          id: `save-${Date.now()}`,
          message: 'Presupuesto guardado exitosamente',
          type: 'success'
        });
      } else {
        addToast({
          id: `error-${Date.now()}`,
          message: 'Corrige los errores antes de guardar',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error saving budget:', error);
      addToast({
        id: `error-${Date.now()}`,
        message: 'Error al guardar el presupuesto',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  }, [validateBudget, validationResult.isValid, budget, budgetCalculation, onSave, addToast]);

  // Handle cancel with confirmation if dirty
  const handleCancel = useCallback(() => {
    if (isDirty) {
      const confirmed = window.confirm('Tienes cambios sin guardar. ¿Estás seguro de que quieres cancelar?');
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

  // Filter templates based on search and active status
  const filteredTemplates = useMemo(() => ({
    menus: (menus || []).filter(menu => menu.isActive),
    activities: (activities || []).filter(activity => activity.isActive),
    accommodations: (accommodations || []).filter(accommodation => accommodation.isActive),
    transportTemplates: transportTemplates || []
  }), [menus, activities, accommodations, transportTemplates]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Error Display */}
      {(validationErrors.length > 0) && (
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
        totalAmount={budgetCalculation.totalAmount}
        updateBudgetField={updateBudgetField}
      />

      {/* Enhanced Tabs for Budget Items */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1">
          <TabsTrigger 
            value="meals" 
            className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            <span className="text-2xl">🍽️</span>
            <div className="flex flex-col items-start">
              <span className="font-medium">Menús</span>
              {itemCounts.meals > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {itemCounts.meals} seleccionado{itemCounts.meals !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="activities" 
            className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            <span className="text-2xl">🎯</span>
            <div className="flex flex-col items-start">
              <span className="font-medium">Actividades</span>
              {itemCounts.activities > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {itemCounts.activities} seleccionada{itemCounts.activities !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="transport" 
            className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <span className="text-2xl">🚐</span>
            <div className="flex flex-col items-start">
              <span className="font-medium">Transporte</span>
              {itemCounts.transport > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {itemCounts.transport} seleccionado{itemCounts.transport !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="stay" 
            className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
          >
            <span className="text-2xl">🏨</span>
            <div className="flex flex-col items-start">
              <span className="font-medium">Alojamiento</span>
              {itemCounts.stay > 0 && (
                <Badge variant="secondary" className="text-xs">1 seleccionado</Badge>
              )}
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="meals" className="space-y-6 mt-6">
          <MealsTab
            templates={filteredTemplates.menus}
            selectedMeals={budget.selectedMeals || []}
            searchTerm={debouncedSearchTerms.meals}
            guestCount={budget.guestCount || 0}
            onSearchChange={(value) => updateSearchTerm('meals', value)}
            onAddItem={(template) => addItem('meals', template)}
            onRemoveItem={(itemId) => removeItem('meals', itemId)}
            onUpdateItem={(itemId, updates) => updateItem('meals', itemId, updates)}
          />
        </TabsContent>

        <TabsContent value="activities" className="space-y-6 mt-6">
          <ActivitiesTab
            templates={filteredTemplates.activities}
            selectedActivities={budget.selectedActivities || []}
            selectedTransport={budget.selectedTransport || []}
            transportTemplates={filteredTemplates.transportTemplates}
            searchTerm={debouncedSearchTerms.activities}
            guestCount={budget.guestCount || 0}
            onSearchChange={(value) => updateSearchTerm('activities', value)}
            onAddItem={(template) => addItem('activities', template)}
            onRemoveItem={(itemId) => removeItem('activities', itemId)}
            onUpdateItem={(itemId, updates) => updateItem('activities', itemId, updates)}
            onAddTransport={(template) => addItem('transport', template)}
            onRemoveTransport={(itemId) => removeItem('transport', itemId)}
          />
        </TabsContent>

        <TabsContent value="transport" className="space-y-6 mt-6">
          <TransportTab
            templates={filteredTemplates.transportTemplates}
            selectedTransport={budget.selectedTransport || []}
            selectedActivities={budget.selectedActivities || []}
            searchTerm={debouncedSearchTerms.transport}
            guestCount={budget.guestCount || 0}
            onSearchChange={(value) => updateSearchTerm('transport', value)}
            onAddItem={(template) => addItem('transport', template)}
            onRemoveItem={(itemId) => removeItem('transport', itemId)}
            onUpdateItem={(itemId, updates) => updateItem('transport', itemId, updates)}
          />
        </TabsContent>

        <TabsContent value="stay" className="space-y-6 mt-6">
          <StayTab
            templates={filteredTemplates.accommodations}
            selectedStay={budget.selectedStay}
            searchTerm={debouncedSearchTerms.stay}
            guestCount={budget.guestCount || 0}
            onSearchChange={(value) => updateSearchTerm('stay', value)}
            onAddItem={(template) => addItem('stay', template)}
            onRemoveItem={(itemId) => removeItem('stay', itemId)}
            onUpdateItem={(itemId, updates) => updateItem('stay', itemId, updates)}
          />
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <BudgetFormActions
        onCancel={handleCancel}
        onSave={handleSave}
        hasErrors={hasErrors}
        isDirty={isDirty}
        isLoading={isLoading}
      />
    </div>
  );
};

export default EnhancedBudgetForm;
