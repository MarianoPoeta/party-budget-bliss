import { useState, useCallback, useMemo } from 'react';
import { EnhancedBudget, BudgetItem, ValidationError, BudgetItemType, BudgetWorkflowState } from '../types/EnhancedBudget';
import { MealTemplate, ActivityTemplate, TransportTemplate, StayTemplate } from '../types/Budget';
import { Menu } from '../types/Menu';
import { Activity } from '../types/Activity';
import { Accommodation } from '../types/Accommodation';

const DEFAULT_BUDGET: Partial<EnhancedBudget> = {
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  eventDate: '',
  eventEndDate: '',
  guestCount: 0,
  selectedMeals: [],
  selectedActivities: [],
  selectedTransport: [],
  selectedStay: undefined,
  extras: 0,
  totalAmount: 0,
  isClosed: false
};

export const useBudgetWorkflow = (initialBudget?: Partial<EnhancedBudget>) => {
  const [budget, setBudget] = useState<Partial<EnhancedBudget>>(initialBudget || DEFAULT_BUDGET);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Memoized state object
  const workflowState: BudgetWorkflowState = useMemo(() => ({
    budget,
    validationErrors,
    isLoading,
    isDirty
  }), [budget, validationErrors, isLoading, isDirty]);

  const generateItemId = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const getFieldName = useCallback((type: BudgetItemType): keyof EnhancedBudget => {
    const fieldMap: Record<BudgetItemType, keyof EnhancedBudget> = {
      meals: 'selectedMeals',
      activities: 'selectedActivities',
      transport: 'selectedTransport',
      stay: 'selectedStay'
    };
    return fieldMap[type];
  }, []);

  const addItem = useCallback((type: BudgetItemType, template: Menu | Activity | Accommodation | TransportTemplate | MealTemplate | ActivityTemplate | StayTemplate) => {
    if (!template?.id) {
      console.error('Invalid template provided to addItem');
      return;
    }

    const newItem: BudgetItem = {
      id: generateItemId(),
      templateId: template.id,
      template,
      customizations: {},
      quantity: 1,
      includeTransport: type === 'activities' ? (template as ActivityTemplate).transportRequired : undefined
    };

    setBudget(prev => {
      if (type === 'stay') {
        return { ...prev, selectedStay: newItem };
      }
      
      const fieldName = getFieldName(type);
      const currentItems = (prev[fieldName] as BudgetItem[]) || [];
      
      // Check for duplicates
      const isDuplicate = currentItems.some((item: BudgetItem) => item.templateId === template.id);
      if (isDuplicate) {
        console.warn(`Template ${template.name} is already added`);
        return prev;
      }

      return {
        ...prev,
        [fieldName]: [...currentItems, newItem]
      };
    });
    setIsDirty(true);
  }, [generateItemId, getFieldName]);

  const removeItem = useCallback((type: BudgetItemType, itemId: string) => {
    if (!itemId) {
      console.error('itemId must be provided to removeItem');
      return;
    }

    setBudget(prev => {
      if (type === 'stay') {
        return { ...prev, selectedStay: undefined };
      }
      
      const fieldName = getFieldName(type);
      const currentItems = (prev[fieldName] as BudgetItem[]) || [];
      const updatedItems = currentItems.filter((item: BudgetItem) => item.id !== itemId);
      
      return {
        ...prev,
        [fieldName]: updatedItems
      };
    });
    setIsDirty(true);
  }, [getFieldName]);

  const updateItem = useCallback((type: BudgetItemType, itemId: string, updates: Partial<BudgetItem>) => {
    if (!itemId || !updates) {
      console.error('Valid itemId and updates must be provided to updateItem');
      return;
    }

    setBudget(prev => {
      if (type === 'stay' && prev.selectedStay?.id === itemId) {
        return { ...prev, selectedStay: { ...prev.selectedStay, ...updates } };
      }
      
      const fieldName = getFieldName(type);
      const currentItems = (prev[fieldName] as BudgetItem[]) || [];
      const updatedItems = currentItems.map((item: BudgetItem) =>
        item.id === itemId ? { ...item, ...updates } : item
      );
      
      return {
        ...prev,
        [fieldName]: updatedItems
      };
    });
    setIsDirty(true);
  }, [getFieldName]);

  const validateBudget = useCallback((): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Basic info validation
    if (!budget.clientName?.trim()) {
      errors.push({
        section: 'basicInfo',
        message: 'Client name is required',
        severity: 'error'
      });
    }

    if (!budget.eventDate) {
      errors.push({
        section: 'basicInfo',
        message: 'Event date is required',
        severity: 'error'
      });
    } else {
      const eventDate = new Date(budget.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (eventDate < today) {
        errors.push({
          section: 'basicInfo',
          message: 'Event date cannot be in the past',
          severity: 'warning'
        });
      }
    }

    if (!budget.guestCount || budget.guestCount <= 0) {
      errors.push({
        section: 'basicInfo',
        message: 'Guest count must be greater than 0',
        severity: 'error'
      });
    }

    // Activity validation
    budget.selectedActivities?.forEach(item => {
      const activity = item.template as ActivityTemplate;
      if (activity?.transportRequired && !item.includeTransport && (!budget.selectedTransport || budget.selectedTransport.length === 0)) {
        errors.push({
          section: 'activities',
          message: `Activity '${activity.name}' requires transport. Please add transport or enable transport for this activity.`,
          severity: 'warning'
        });
      }
    });

    // Check if budget has any items
    const hasItems = (budget.selectedMeals?.length || 0) + 
                    (budget.selectedActivities?.length || 0) + 
                    (budget.selectedTransport?.length || 0) + 
                    (budget.selectedStay ? 1 : 0) > 0;

    if (!hasItems) {
      errors.push({
        section: 'items',
        message: 'Budget must include at least one meal, activity, transport, or accommodation',
        severity: 'warning'
      });
    }

    setValidationErrors(errors);
    return errors;
  }, [budget]);

  const updateBudgetField = useCallback(<K extends keyof EnhancedBudget>(field: K, value: EnhancedBudget[K]) => {
    setBudget(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }, []);

  const resetBudget = useCallback(() => {
    setBudget(DEFAULT_BUDGET);
    setValidationErrors([]);
    setIsDirty(false);
  }, []);

  const clearValidationErrors = useCallback(() => {
    setValidationErrors([]);
  }, []);

  return {
    ...workflowState,
    addItem,
    removeItem,
    updateItem,
    validateBudget,
    updateBudgetField,
    resetBudget,
    clearValidationErrors,
    setLoading: setIsLoading
  };
};
