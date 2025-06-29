
import React, { useState } from 'react';
import { Search, Plus, Edit, ChefHat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { BudgetItem } from '../../types/EnhancedBudget';
import { Menu } from '../../types/Menu';
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

  const calculateMenuCost = (menu: Menu) => {
    return menu.pricePerPerson * guestCount;
  };

  const handleEditMenu = (menu: Menu) => {
    setEditingMenu(menu);
  };

  const handleSaveCustomizedMenu = (customizedMenu: Menu) => {
    onAddItem(customizedMenu);
    setEditingMenu(null);
  };

  const typeColors = {
    breakfast: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    lunch: 'bg-green-100 text-green-800 border-green-200',
    dinner: 'bg-blue-100 text-blue-800 border-blue-200',
    brunch: 'bg-orange-100 text-orange-800 border-orange-200',
    cocktail: 'bg-purple-100 text-purple-800 border-purple-200',
    catering: 'bg-red-100 text-red-800 border-red-200',
  };

  // Helper function to check if a template is a Menu
  const isMenu = (template: any): template is Menu => {
    return template && typeof template === 'object' && 'type' in template && 'pricePerPerson' in template && 'items' in template;
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input
          placeholder="Search menus..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Selected Menus */}
      {selectedMeals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              Selected Menus ({selectedMeals.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedMeals.map((item) => {
              // Type guard to ensure we're working with a Menu
              if (!isMenu(item.template)) return null;
              
              const menu = item.template as Menu;
              const hasCustomItems = menu.items && menu.items.length > 0;
              
              return (
                <div key={item.id} className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{menu.name}</h4>
                        <Badge className={`px-2 py-1 rounded-full text-xs font-medium border ${typeColors[menu.type]}`}>
                          {menu.type.charAt(0).toUpperCase() + menu.type.slice(1)}
                        </Badge>
                        {!menu.isActive && (
                          <Badge variant="secondary" className="text-xs">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{menu.description}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <ChefHat className="h-3 w-3" />
                        {menu.restaurant}
                      </p>
                      <div className="text-lg font-semibold text-green-600 mt-3">
                        ${calculateMenuCost(menu).toLocaleString()} total 
                        <span className="text-sm font-normal text-gray-500 ml-2">
                          (${menu.pricePerPerson.toFixed(2)}/person)
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditMenu(menu)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>

                  {/* Show menu items if available */}
                  {hasCustomItems && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-lg border-l-4 border-blue-500">
                      <h5 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                        <ChefHat className="h-4 w-4" />
                        Menu Items ({menu.items.length}):
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {menu.items.slice(0, 6).map((menuItem, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                            <div className="flex-1">
                              <span className="font-medium text-sm">{menuItem.name}</span>
                              <p className="text-xs text-gray-500 truncate">{menuItem.description}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              ${menuItem.price}
                            </Badge>
                          </div>
                        ))}
                        {menu.items.length > 6 && (
                          <div className="text-sm text-slate-500 font-medium">
                            +{menu.items.length - 6} more items
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Available Menus */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Available Menus
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <ChefHat className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No menus found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTemplates.map((template) => {
                const isSelected = selectedMeals.some(item => item.templateId === template.id);
                const canAdd = guestCount >= template.minPeople && guestCount <= template.maxPeople && template.isActive;
                
                return (
                  <div key={template.id} className="bg-white border-2 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-slate-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{template.name}</h4>
                          <Badge className={`px-2 py-1 rounded-full text-xs font-medium border ${typeColors[template.type]}`}>
                            {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                          </Badge>
                          {!template.isActive && (
                            <Badge variant="secondary" className="text-xs">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{template.description}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <ChefHat className="h-3 w-3" />
                          {template.restaurant}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <div className="text-lg font-semibold text-green-600">
                            ${calculateMenuCost(template).toLocaleString()} total
                          </div>
                          <div className="text-slate-500">
                            ${template.pricePerPerson}/person • {template.minPeople}-{template.maxPeople} guests • {template.items.length} items
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditMenu(template)}
                          disabled={!canAdd}
                          className="flex items-center gap-1 flex-1"
                        >
                          <Edit className="h-4 w-4" />
                          Customize
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => onAddItem(template)}
                          disabled={isSelected || !canAdd}
                          className="flex items-center gap-1 flex-1"
                        >
                          <Plus className="h-4 w-4" />
                          {isSelected ? 'Added' : 'Add'}
                        </Button>
                      </div>
                      
                      {!canAdd && (
                        <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
                          {!template.isActive 
                            ? 'Menu is inactive' 
                            : `Guest count (${guestCount}) is outside the allowed range (${template.minPeople}-${template.maxPeople})`
                          }
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Menu Item Editor Dialog */}
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
