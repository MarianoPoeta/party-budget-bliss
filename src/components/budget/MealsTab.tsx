
import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { BudgetItem } from '../../types/EnhancedBudget';
import { MealTemplate } from '../../types/Budget';

interface MealsTabProps {
  templates: MealTemplate[];
  selectedMeals: BudgetItem[];
  searchTerm: string;
  guestCount: number;
  onSearchChange: (value: string) => void;
  onAddItem: (template: MealTemplate) => void;
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
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateMealCost = (meal: MealTemplate) => {
    return meal.pricePerPerson * guestCount;
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input
          placeholder="Search meals..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Selected Meals */}
      {selectedMeals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Selected Meals ({selectedMeals.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedMeals.map((item) => {
              const meal = item.template as MealTemplate;
              return (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{meal.name}</h4>
                      <Badge variant="outline">{meal.type}</Badge>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{meal.description}</p>
                    <p className="text-sm text-slate-500">{meal.restaurant}</p>
                    <div className="text-sm font-medium text-green-600 mt-1">
                      ${calculateMealCost(meal).toLocaleString()} total (${meal.pricePerPerson}/person)
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Available Meals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Available Meals</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTemplates.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No meals found matching your search.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => {
                const isSelected = selectedMeals.some(item => item.templateId === template.id);
                const canAdd = guestCount >= template.minPeople && guestCount <= template.maxPeople;
                
                return (
                  <div key={template.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{template.name}</h4>
                          <Badge variant="outline">{template.type}</Badge>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{template.description}</p>
                        <p className="text-sm text-slate-500">{template.restaurant}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <div className="font-medium text-green-600">
                          ${calculateMealCost(template).toLocaleString()} total
                        </div>
                        <div className="text-slate-500">
                          ${template.pricePerPerson}/person • {template.minPeople}-{template.maxPeople} guests
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => onAddItem(template)}
                        disabled={isSelected || !canAdd}
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        {isSelected ? 'Added' : 'Add'}
                      </Button>
                    </div>
                    
                    {!canAdd && (
                      <p className="text-xs text-red-600">
                        Guest count ({guestCount}) is outside the allowed range ({template.minPeople}-{template.maxPeople})
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MealsTab;
