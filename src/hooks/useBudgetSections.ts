
import { useState } from 'react';

export const useBudgetSections = () => {
  const [openSections, setOpenSections] = useState<{
    basicInfo: boolean;
    meals: boolean;
    activities: boolean;
    transport: boolean;
    stay: boolean;
    extras: boolean;
  }>({
    basicInfo: true,
    meals: true,
    activities: true,
    transport: true,
    stay: true,
    extras: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return { openSections, toggleSection };
};
