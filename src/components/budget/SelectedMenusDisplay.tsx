import React from 'react';
import { Edit, ChefHat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { BudgetItem } from '../../types/EnhancedBudget';
import { Menu } from '../../types/Menu';

interface SelectedMenusDisplayProps {
  selectedMeals: BudgetItem[];
  guestCount: number;
  onEditMenu: (menu: Menu) => void;
  onRemoveItem: (itemId: string) => void;
}

const SelectedMenusDisplay: React.FC<SelectedMenusDisplayProps> = ({
  selectedMeals,
  guestCount,
  onEditMenu,
  onRemoveItem
}) => {
  const typeColors = {
    breakfast: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    lunch: 'bg-green-100 text-green-800 border-green-200',
    dinner: 'bg-blue-100 text-blue-800 border-blue-200',
    brunch: 'bg-orange-100 text-orange-800 border-orange-200',
    cocktail: 'bg-purple-100 text-purple-800 border-purple-200',
    catering: 'bg-red-100 text-red-800 border-red-200',
  };

  const calculateMenuCost = (menu: Menu) => {
    return (menu.pricePerPerson || 0) * guestCount;
  };

  const isMenu = (template: any): template is Menu => {
    return template && typeof template === 'object' && 'type' in template && 'pricePerPerson' in template;
  };

  if (!selectedMeals || selectedMeals.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ChefHat className="h-5 w-5" />
          Selected Menus ({selectedMeals.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedMeals.map((item) => {
          if (!item || !isMenu(item.template)) return null;
          
          const menu = item.template as Menu;
          const hasCustomItems = menu.items && menu.items.length > 0;
          const itemsCount = menu.items?.length || 0;
          const menuType = menu.type || 'catering';
          
          return (
            <div key={item.id} className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{menu.name}</h4>
                    <Badge className={`px-2 py-1 rounded-full text-xs font-medium border ${typeColors[menuType] || typeColors.catering}`}>
                      {menuType.charAt(0).toUpperCase() + menuType.slice(1)}
                    </Badge>
                    {!menu.isActive && (
                      <Badge variant="secondary" className="text-xs">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{menu.description || 'No description available'}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <ChefHat className="h-3 w-3" />
                    {menu.restaurant || 'Restaurant not specified'}
                  </p>
                  <div className="text-lg font-semibold text-green-600 mt-3">
                    ${calculateMenuCost(menu).toLocaleString()} total 
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      (${(menu.pricePerPerson || 0).toFixed(2)}/persona)
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEditMenu(menu)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Eliminar
                  </Button>
                </div>
              </div>

              {hasCustomItems && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg border-l-4 border-blue-500">
                  <h5 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                    <ChefHat className="h-4 w-4" />
                    Menu Items ({itemsCount}):
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {menu.items && menu.items.slice(0, 6).map((menuItem, index) => (
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
                    {itemsCount > 6 && (
                      <div className="text-sm text-slate-500 font-medium">
                        +{itemsCount - 6} more items
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
  );
};

export default SelectedMenusDisplay;
