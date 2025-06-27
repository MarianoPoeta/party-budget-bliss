
import React from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { MealTemplate } from '../../types/Budget';

interface MealsTabProps {
  templates: any[];
  selectedMeals: any[];
  searchTerm: string;
  guestCount: number;
  onSearchChange: (value: string) => void;
  onAddItem: (template: any) => void;
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
  const isMealTemplate = (template: any): template is MealTemplate => {
    return template && 'pricePerPerson' in template;
  };

  const filteredTemplates = templates.filter(meal => 
    meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meal.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Select Meals</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search meals..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {filteredTemplates.map((meal) => (
            <Card key={meal.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">{meal.name}</h4>
                <p className="text-sm text-slate-600 mb-3">{meal.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-600">
                    ${isMealTemplate(meal) ? meal.pricePerPerson : 0}/person
                  </span>
                  <Button
                    size="sm"
                    onClick={() => onAddItem(meal)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedMeals && selectedMeals.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Selected Meals</h3>
            <div className="space-y-2">
              {selectedMeals.map((item) => {
                const meal = item.template;
                const pricePerPerson = isMealTemplate(meal) ? meal.pricePerPerson : 0;
                return (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{meal.name}</div>
                      <div className="text-sm text-slate-600">
                        ${pricePerPerson}/person × {guestCount} guests = 
                        ${(pricePerPerson * guestCount).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MealsTab;
