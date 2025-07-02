import { useMemo } from 'react';
import { MealTemplate, ActivityTemplate, TransportTemplate, StayTemplate } from '../types/Budget';
import { BudgetCalculationInput, BudgetCalculationResult, MenuBudgetItem, TransportAssignment } from '../types/EnhancedBudget';
import { Menu } from '../types/Menu';

interface BudgetCalculationProps {
  selectedMeals: BudgetCalculationInput['selectedMeals'];
  selectedActivities: BudgetCalculationInput['selectedActivities'];
  selectedTransport: BudgetCalculationInput['selectedTransport'];
  transportAssignments: TransportAssignment[];
  selectedStay?: BudgetCalculationInput['selectedStay'];
  guestCount: number;
  extras: number;
}

export const useBudgetCalculation = ({
  selectedMeals = [],
  selectedActivities = [],
  selectedTransport = [],
  transportAssignments = [],
  selectedStay,
  guestCount = 0,
  extras = 0
}: BudgetCalculationProps): BudgetCalculationResult => {
  return useMemo(() => {
    if (guestCount <= 0) {
      return {
        totalAmount: Math.max(0, extras),
        breakdown: {
          meals: 0,
          activities: 0,
          transport: 0,
          stay: 0,
          extras: Math.max(0, extras)
        }
      };
    }

    let mealsTotal = 0;
    let activitiesTotal = 0;
    let transportTotal = 0;
    let stayTotal = 0;

    // Calculate meals (now supporting both Menu and MealTemplate)
    selectedMeals.forEach(item => {
      // Check if it's a Menu (new system) or MealTemplate (legacy)
      if (item.template && 'items' in item.template) {
        // This is a Menu
        const menu = item.template as Menu;
        const menuItem = item as MenuBudgetItem;
        
        // Use calculated price if available, otherwise calculate based on guest count
        if (menuItem.calculatedPrice) {
          mealsTotal += menuItem.calculatedPrice * item.quantity;
        } else {
          const pricePerPerson = menu.pricePerPerson || 0;
          const calculatedPrice = pricePerPerson * guestCount;
          mealsTotal += calculatedPrice * item.quantity;
        }
      } else {
        // This is a MealTemplate (legacy)
        const meal = item.template as MealTemplate;
        const pricePerPerson = meal?.pricePerPerson || 0;
        mealsTotal += pricePerPerson * guestCount * item.quantity;
      }
    });

    // Calculate activities with transport handling
    selectedActivities.forEach(item => {
      const activity = item.template as ActivityTemplate;
      const basePrice = activity?.basePrice || 0;
      activitiesTotal += basePrice * item.quantity;
      
      // Note: Transport costs are now handled separately through transportAssignments
    });

    // Calculate transport using the new transport assignments system
    transportAssignments.forEach(assignment => {
      transportTotal += assignment.calculatedPrice;
    });

    // Also include legacy transport items if any
    selectedTransport.forEach(item => {
      const transport = item.template as TransportTemplate;
      const pricePerHour = transport?.pricePerHour || 0;
      const hours = (item.customizations?.estimatedHours as number) || 2; // Default 2 hours
      transportTotal += pricePerHour * hours * item.quantity;
    });

    // Calculate stay with proper room calculation
    if (selectedStay) {
      const stay = selectedStay.template as StayTemplate;
      const pricePerNight = stay?.pricePerNight || 0;
      const nights = (selectedStay.customizations?.nights as number) || 1;
      const maxOccupancy = stay?.maxOccupancy || 2;
      const rooms = Math.ceil(guestCount / maxOccupancy);
      stayTotal += pricePerNight * nights * rooms;
    }

    // Ensure extras is not negative
    const safeExtras = Math.max(0, extras);

    const totalAmount = mealsTotal + activitiesTotal + transportTotal + stayTotal + safeExtras;

    return {
      totalAmount: Math.round(totalAmount * 100) / 100, // Round to 2 decimal places
      breakdown: {
        meals: Math.round(mealsTotal * 100) / 100,
        activities: Math.round(activitiesTotal * 100) / 100,
        transport: Math.round(transportTotal * 100) / 100,
        stay: Math.round(stayTotal * 100) / 100,
        extras: safeExtras
      }
    };
  }, [selectedMeals, selectedActivities, selectedTransport, transportAssignments, selectedStay, guestCount, extras]);
};
