import React, { useState } from 'react';
import { BudgetItem } from '../../types/EnhancedBudget';
import { Menu } from '../../types/Menu';
import MenuSearch from './MenuSearch';
import SelectedMenusDisplay from './SelectedMenusDisplay';
import AvailableMenusGrid from './AvailableMenusGrid';
import MenuItemEditor from './MenuItemEditor';

interface MealsTabProps {
  templates: Menu[];
  selectedMeals: BudgetItem[];
  searchTerm: string;
  guestCount: number;
  onSearchChange: (value: string) => void;
  onAddItem: (menu: Menu) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateItem?: (itemId: string, updates: Partial<BudgetItem>) => void;
}

const MealsTab: React.FC<MealsTabProps> = ({
  templates,
  selectedMeals,
  searchTerm,
  guestCount,
  onSearchChange,
  onAddItem,
  onRemoveItem,
  onUpdateItem
}) => {
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

  // Ensure templates and selectedMeals are always arrays
  const safeTemplates = templates || [];
  const safeMeals = selectedMeals || [];
  const safeGuestCount = guestCount || 0;
  const safeSearchTerm = searchTerm || '';

  const filteredTemplates = safeTemplates.filter(template => {
    if (!template) return false;
    
    const name = (template.name || '').toLowerCase();
    const description = (template.description || '').toLowerCase();
    const type = (template.type || '').toLowerCase();
    const search = safeSearchTerm.toLowerCase();
    
    return name.includes(search) || description.includes(search) || type.includes(search);
  });

  const handleEditMenu = (menu: Menu) => {
    if (menu) {
      setEditingMenu(menu);
    }
  };

  const handleSaveCustomizedMenu = (customizedMenu: Menu) => {
    if (customizedMenu) {
      onAddItem(customizedMenu);
      setEditingMenu(null);
    }
  };

  return (
    <div className="space-y-6">
      <MenuSearch
        searchTerm={safeSearchTerm}
        onSearchChange={onSearchChange}
      />

      <SelectedMenusDisplay
        selectedMeals={safeMeals}
        guestCount={safeGuestCount}
        onEditMenu={handleEditMenu}
        onRemoveItem={onRemoveItem}
      />

      <AvailableMenusGrid
        templates={filteredTemplates}
        selectedMeals={safeMeals}
        guestCount={safeGuestCount}
        onEditMenu={handleEditMenu}
        onAddItem={onAddItem}
      />

      {editingMenu && (
        <MenuItemEditor
          isOpen={!!editingMenu}
          onClose={() => setEditingMenu(null)}
          menu={editingMenu}
          guestCount={safeGuestCount}
          onSave={handleSaveCustomizedMenu}
        />
      )}
    </div>
  );
};

export default MealsTab;
