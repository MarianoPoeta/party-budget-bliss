
import { useMemo } from 'react';

interface BudgetCalculationProps {
  selectedMeals: any[];
  selectedActivities: any[];
  selectedTransport: any[];
  selectedStay?: any;
  guestCount: number;
  extras: number;
}

export const useBudgetCalculation = ({
  selectedMeals,
  selectedActivities,
  selectedTransport,
  selectedStay,
  guestCount,
  extras
}: BudgetCalculationProps) => {
  return useMemo(() => {
    let total = 0;

    // Calculate meals
    selectedMeals.forEach(meal => {
      total += meal.pricePerPerson * guestCount;
    });

    // Calculate activities
    selectedActivities.forEach(activity => {
      total += activity.basePrice;
      if (activity.transportRequired && activity.includeTransport) {
        total += activity.transportCost || 0;
      }
    });

    // Calculate transport
    selectedTransport.forEach(transport => {
      total += transport.pricePerHour * 2; // Default 2 hours
    });

    // Calculate stay
    if (selectedStay) {
      const rooms = Math.ceil(guestCount / selectedStay.maxOccupancy);
      total += selectedStay.pricePerNight * rooms;
    }

    // Add extras
    total += extras;

    return total;
  }, [selectedMeals, selectedActivities, selectedTransport, selectedStay, guestCount, extras]);
};
