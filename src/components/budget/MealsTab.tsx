
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
}

const MealsTab: React.FC<MealsTabProps> = ({
  templates,
  selectedMeals,
  searchTerm,
  guestCount,
  onSearchChange,
  onAddItem,
  onRemoveItem
}) => {
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.restaurant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditMenu = (menu: Menu) => {
    setEditingMenu(menu);
  };

  const handleSaveCustomizedMenu = (customizedMenu: Menu) => {
    onAddItem(customizedMenu);
    setEditingMenu(null);
  };

  return (
    <div className="space-y-6">
      <MenuSearch
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
      />

      <SelectedMenusDisplay
        selectedMeals={selectedMeals}
        guestCount={guestCount}
        onEditMenu={handleEditMenu}
        onRemoveItem={onRemoveItem}
      />

      <AvailableMenusGrid
        templates={filteredTemplates}
        selectedMeals={selectedMeals}
        guestCount={guestCount}
        onEditMenu={handleEditMenu}
        onAddItem={onAddItem}
      />

      {editingMenu && (
        <MenuItemEditor
          isOpen={!!editingMenu}
          onClose={() => setEditingMenu(null)}
          menu={editingMenu}
          guestCount={guestCount}
          onSave={handleSaveCustomizedMenu}
        />
      )}
    </div>
  );
};

export default MealsTab;
