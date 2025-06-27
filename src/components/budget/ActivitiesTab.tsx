
import React from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { ActivityTemplate } from '../../types/Budget';

interface ActivitiesTabProps {
  templates: any[];
  selectedActivities: any[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddItem: (template: any) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateItem: (itemId: string, updates: any) => void;
}

const ActivitiesTab: React.FC<ActivitiesTabProps> = ({
  templates,
  selectedActivities,
  searchTerm,
  onSearchChange,
  onAddItem,
  onRemoveItem,
  onUpdateItem
}) => {
  const isActivityTemplate = (template: any): template is ActivityTemplate => {
    return template && 'basePrice' in template;
  };

  const filteredTemplates = templates.filter(activity => 
    activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Select Activities</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {filteredTemplates.map((activity) => (
            <Card key={activity.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">{activity.name}</h4>
                  {isActivityTemplate(activity) && activity.transportRequired && (
                    <Badge variant="outline" className="text-xs">Transport Required</Badge>
                  )}
                </div>
                <p className="text-sm text-slate-600 mb-3">{activity.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-600">
                    ${isActivityTemplate(activity) ? activity.basePrice : 0}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => onAddItem(activity)}
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

        {selectedActivities && selectedActivities.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Selected Activities</h3>
            <div className="space-y-3">
              {selectedActivities.map((item) => {
                const activity = item.template;
                const basePrice = isActivityTemplate(activity) ? activity.basePrice : 0;
                const transportRequired = isActivityTemplate(activity) ? activity.transportRequired : false;
                const transportCost = isActivityTemplate(activity) ? activity.transportCost || 0 : 0;

                return (
                  <div key={item.id} className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <div className="font-medium">{activity.name}</div>
                        <div className="text-sm text-slate-600">
                          Base price: ${basePrice}
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
                    
                    {transportRequired && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`transport-${item.id}`}
                          checked={item.includeTransport || false}
                          onCheckedChange={(checked) => 
                            onUpdateItem(item.id, { includeTransport: checked as boolean })
                          }
                        />
                        <label htmlFor={`transport-${item.id}`} className="text-sm">
                          Include Transport? (+${transportCost})
                        </label>
                      </div>
                    )}
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

export default ActivitiesTab;
