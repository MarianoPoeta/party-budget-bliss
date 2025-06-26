
import { useEffect, useState } from 'react';
import { MealTemplate, ActivityTemplate, TransportTemplate as TransportTemplateType, StayTemplate as StayTemplateType } from '../types/Budget';

interface UseBudgetCalculationProps {
  selectedMeals: MealTemplate[];
  selectedActivities: ActivityTemplate[];
  selectedTransport: TransportTemplateType[];
  selectedStay?: StayTemplateType;
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
}: UseBudgetCalculationProps) => {
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const calculateTotal = () => {
      let total = 0;
      
      selectedMeals.forEach(meal => {
        total += meal.pricePerPerson * guestCount;
      });
      
      selectedActivities.forEach(activity => {
        total += activity.basePrice;
        if (activity.transportRequired && activity.transportCost) {
          total += activity.transportCost;
        }
      });
      
      selectedTransport.forEach(transport => {
        total += transport.pricePerHour * 8; // Assuming 8 hours average
      });
      
      if (selectedStay) {
        total += selectedStay.pricePerNight * 2; // Assuming 2 nights
      }
      
      total += extras;
      
      setTotalAmount(total);
    };

    calculateTotal();
  }, [selectedMeals, selectedActivities, selectedTransport, selectedStay, guestCount, extras]);

  return totalAmount;
};
