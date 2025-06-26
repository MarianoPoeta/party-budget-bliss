
import { useState } from 'react';

export const useBudgetSections = () => {
  const [openSections, setOpenSections] = useState({
    basicInfo: true,
    meals: false,
    activities: false,
    transport: false,
    stay: false,
    extras: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return {
    openSections,
    toggleSection
  };
};
