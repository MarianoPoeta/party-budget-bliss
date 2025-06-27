
import { useState, useCallback } from 'react';
import { EnhancedBudget, BudgetItem, ValidationError } from '../types/EnhancedBudget';

export const useBudgetWorkflow = (initialBudget?: Partial<EnhancedBudget>) => {
  const [budget, setBudget] = useState<Partial<EnhancedBudget>>(initialBudget || {
    clientName: '',
    eventDate: '',
    guestCount: 0,
    selectedMeals: [],
    selectedActivities: [],
    selectedTransport: [],
    selectedStay: undefined,
    extras: 0,
    totalAmount: 0,
    isClosed: false
  });

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const addItem = useCallback((type: 'meals' | 'activities' | 'transport' | 'stay', template: any) => {
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      templateId: template.id,
      template,
      customizations: {},
      quantity: 1,
      includeTransport: type === 'activities' ? template.transportRequired : undefined
    };

    setBudget(prev => {
      if (type === 'stay') {
        return { ...prev, selectedStay: newItem };
      }
      
      const currentItems = prev[`selected${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof typeof prev] as BudgetItem[] || [];
      return {
        ...prev,
        [`selected${type.charAt(0).toUpperCase() + type.slice(1)}`]: [...currentItems, newItem]
      };
    });
  }, []);

  const removeItem = useCallback((type: 'meals' | 'activities' | 'transport' | 'stay', itemId?: string, index?: number) => {
    setBudget(prev => {
      if (type === 'stay') {
        return { ...prev, selectedStay: undefined };
      }
      
      const currentItems = prev[`selected${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof typeof prev] as BudgetItem[] || [];
      const updatedItems = itemId 
        ? currentItems.filter(item => item.id !== itemId)
        : currentItems.filter((_, i) => i !== index);
      
      return {
        ...prev,
        [`selected${type.charAt(0).toUpperCase() + type.slice(1)}`]: updatedItems
      };
    });
  }, []);

  const updateItem = useCallback((type: 'meals' | 'activities' | 'transport' | 'stay', itemId: string, updates: Partial<BudgetItem>) => {
    setBudget(prev => {
      if (type === 'stay' && prev.selectedStay?.id === itemId) {
        return { ...prev, selectedStay: { ...prev.selectedStay, ...updates } };
      }
      
      const currentItems = prev[`selected${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof typeof prev] as BudgetItem[] || [];
      const updatedItems = currentItems.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      );
      
      return {
        ...prev,
        [`selected${type.charAt(0).toUpperCase() + type.slice(1)}`]: updatedItems
      };
    });
  }, []);

  const validateBudget = useCallback((): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Check for activities requiring transport
    budget.selectedActivities?.forEach(item => {
      const activity = item.template as any;
      if (activity.transportRequired && !item.includeTransport && (!budget.selectedTransport || budget.selectedTransport.length === 0)) {
        errors.push({
          section: 'activities',
          message: `Activity '${activity.name}' requires transport—please add or enable transport before closing.`,
          severity: 'warning'
        });
      }
    });

    // Check basic info
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
    }

    if (!budget.guestCount || budget.guestCount <= 0) {
      errors.push({
        section: 'basicInfo',
        message: 'Guest count must be greater than 0',
        severity: 'error'
      });
    }

    setValidationErrors(errors);
    return errors;
  }, [budget]);

  const updateBudgetField = useCallback((field: keyof EnhancedBudget, value: any) => {
    setBudget(prev => ({ ...prev, [field]: value }));
  }, []);

  return {
    budget,
    setBudget,
    validationErrors,
    addItem,
    removeItem,
    updateItem,
    validateBudget,
    updateBudgetField
  };
};
