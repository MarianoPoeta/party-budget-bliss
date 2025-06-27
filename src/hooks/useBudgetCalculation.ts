
import { useMemo } from 'react';
import { MealTemplate, ActivityTemplate, TransportTemplate, StayTemplate } from '../types/Budget';

interface BudgetCalculationProps {
  selectedMeals: any[];
  selectedActivities: any[];
  selectedTransport: any[];
  selectedStay?: any;
  guestCount: number;
  extras: number;
}

export const useBudgetCalculation = ({
  selectedMeals = [],
  selectedActivities = [],
  selectedTransport = [],
  selectedStay,
  guestCount = 0,
  extras = 0
}: BudgetCalculationProps) => {
  return useMemo(() => {
    if (guestCount <= 0) return extras; // Early return if no guests

    let total = 0;

    // Calculate meals with better type checking
    selectedMeals.forEach(meal => {
      const pricePerPerson = meal.pricePerPerson || 0;
      total += pricePerPerson * guestCount;
    });

    // Calculate activities with transport handling
    selectedActivities.forEach(activity => {
      const basePrice = activity.basePrice || 0;
      total += basePrice;
      
      // Add transport cost if required and enabled
      if (activity.transportRequired && activity.includeTransport) {
        total += activity.transportCost || 0;
      }
    });

    // Calculate transport with default duration
    selectedTransport.forEach(transport => {
      const pricePerHour = transport.pricePerHour || 0;
      const hours = transport.estimatedHours || 2; // Default 2 hours
      total += pricePerHour * hours;
    });

    // Calculate stay with proper room calculation
    if (selectedStay) {
      const pricePerNight = selectedStay.pricePerNight || 0;
      const nights = selectedStay.nights || 1;
      const maxOccupancy = selectedStay.maxOccupancy || 2;
      const rooms = Math.ceil(guestCount / maxOccupancy);
      total += pricePerNight * nights * rooms;
    }

    // Add extras
    total += Math.max(0, extras); // Ensure extras is not negative

    return Math.round(total * 100) / 100; // Round to 2 decimal places
  }, [selectedMeals, selectedActivities, selectedTransport, selectedStay, guestCount, extras]);
};
