import React from 'react';
import { Plus, Edit, ChefHat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { BudgetItem } from '../../types/EnhancedBudget';
import { Menu } from '../../types/Menu';

interface AvailableMenusGridProps {
  templates: Menu[];
  selectedMeals: BudgetItem[];
  guestCount: number;
  onEditMenu: (menu: Menu) => void;
  onAddItem: (menu: Menu) => void;
}

const AvailableMenusGrid: React.FC<AvailableMenusGridProps> = ({
  templates,
  selectedMeals,
  guestCount,
  onEditMenu,
  onAddItem
}) => {
  // Ensure all props are safe
  const safeTemplates = Array.isArray(templates) ? templates : [];
  const safeMeals = Array.isArray(selectedMeals) ? selectedMeals : [];
  const safeGuestCount = typeof guestCount === 'number' ? guestCount : 0;

  const typeColors = {
    breakfast: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    lunch: 'bg-green-100 text-green-800 border-green-200',
    dinner: 'bg-blue-100 text-blue-800 border-blue-200',
    brunch: 'bg-orange-100 text-orange-800 border-orange-200',
    cocktail: 'bg-purple-100 text-purple-800 border-purple-200',
    catering: 'bg-red-100 text-red-800 border-red-200',
  };

  const calculateMenuCost = (menu: Menu) => {
    const price = typeof menu?.pricePerPerson === 'number' ? menu.pricePerPerson : 0;
    return price * safeGuestCount;
  };

  const getItemCount = (menu: Menu) => {
    if (!menu) return 0;
    if (Array.isArray(menu.items)) return menu.items.length;
    if (Array.isArray(menu.selectedFoods)) return menu.selectedFoods.length;
    return 0;
  };

  const getRestaurantName = (menu: Menu) => {
    return menu?.restaurant || 'Restaurant No Disponible';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ChefHat className="h-5 w-5" />
          Available Menus
        </CardTitle>
      </CardHeader>
      <CardContent>
        {safeTemplates.length === 0 ? (
          <div className="text-center py-12">
            <ChefHat className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No menus found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {safeTemplates.map((template) => {
              if (!template?.id) return null;
              
              const isSelected = safeMeals.some(item => item?.templateId === template.id);
              const minPeople = typeof template.minPeople === 'number' ? template.minPeople : 0;
              const maxPeople = typeof template.maxPeople === 'number' ? template.maxPeople : 999;
              const canAdd = safeGuestCount >= minPeople && 
                           safeGuestCount <= maxPeople && 
                           template.isActive !== false;
              
              return (
                <div key={template.id} className="bg-white border-2 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-slate-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{template.name || 'Unnamed Menu'}</h4>
                        <Badge className={`px-2 py-1 rounded-full text-xs font-medium border ${typeColors[template.type] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                          {template.type ? template.type.charAt(0).toUpperCase() + template.type.slice(1) : 'Unknown'}
                        </Badge>
                        {template.isActive === false && (
                          <Badge variant="secondary" className="text-xs">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{template.description || 'No description available'}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <ChefHat className="h-3 w-3" />
                        {getRestaurantName(template)}
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
                          ${template.pricePerPerson || 0}/person • {minPeople}-{maxPeople} guests • {getItemCount(template)} items
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditMenu(template)}
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
                        {template.isActive === false
                          ? 'Menu is inactive' 
                          : `Guest count (${safeGuestCount}) is outside the allowed range (${minPeople}-${maxPeople})`
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
  );
};

export default AvailableMenusGrid;
