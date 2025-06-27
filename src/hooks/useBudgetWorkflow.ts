
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
    if (!template || !template.id) {
      console.error('Invalid template provided to addItem');
      return;
    }

    const newItem: BudgetItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
      
      // Check for duplicates
      const isDuplicate = currentItems.some(item => item.templateId === template.id);
      if (isDuplicate) {
        console.warn(`Template ${template.name} is already added`);
        return prev;
      }

      return {
        ...prev,
        [`selected${type.charAt(0).toUpperCase() + type.slice(1)}`]: [...currentItems, newItem]
      };
    });
  }, []);

  const removeItem = useCallback((type: 'meals' | 'activities' | 'transport' | 'stay', itemId?: string, index?: number) => {
    if (!itemId && index === undefined) {
      console.error('Either itemId or index must be provided to removeItem');
      return;
    }

    setBudget(prev => {
      if (type === 'stay') {
        return { ...prev, selectedStay: undefined };
      }
      
      const currentItems = prev[`selected${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof typeof prev] as BudgetItem[] || [];
      let updatedItems: BudgetItem[];

      if (itemId) {
        updatedItems = currentItems.filter(item => item.id !== itemId);
      } else if (index !== undefined) {
        updatedItems = currentItems.filter((_, i) => i !== index);
      } else {
        return prev;
      }
      
      return {
        ...prev,
        [`selected${type.charAt(0).toUpperCase() + type.slice(1)}`]: updatedItems
      };
    });
  }, []);

  const updateItem = useCallback((type: 'meals' | 'activities' | 'transport' | 'stay', itemId: string, updates: Partial<BudgetItem>) => {
    if (!itemId || !updates) {
      console.error('Valid itemId and updates must be provided to updateItem');
      return;
    }

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
      const activity = item.template as any;
      if (activity.transportRequired && !item.includeTransport && (!budget.selectedTransport || budget.selectedTransport.length === 0)) {
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
