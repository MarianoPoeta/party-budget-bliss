
import React from 'react';
import { Search, Plus, MapPin, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { BudgetItem } from '../../types/EnhancedBudget';
import { ActivityTemplate } from '../../types/Budget';

interface ActivitiesTabProps {
  templates: ActivityTemplate[];
  selectedActivities: BudgetItem[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddItem: (template: ActivityTemplate) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateItem: (itemId: string, updates: Partial<BudgetItem>) => void;
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
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    const colors = {
      outdoor: 'bg-green-100 text-green-800 border-green-200',
      indoor: 'bg-blue-100 text-blue-800 border-blue-200',
      nightlife: 'bg-purple-100 text-purple-800 border-purple-200',
      dining: 'bg-orange-100 text-orange-800 border-orange-200',
      adventure: 'bg-red-100 text-red-800 border-red-200',
      cultural: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const calculateActivityCost = (activity: ActivityTemplate, includeTransport: boolean) => {
    let cost = activity.basePrice;
    if (activity.transportRequired && includeTransport && activity.transportCost) {
      cost += activity.transportCost;
    }
    return cost;
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input
          placeholder="Search activities..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Selected Activities */}
      {selectedActivities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Selected Activities ({selectedActivities.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedActivities.map((item) => {
              const activity = item.template as ActivityTemplate;
              return (
                <div key={item.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{activity.name}</h4>
                        <Badge className={getCategoryColor(activity.category)}>
                          {activity.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{activity.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {activity.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {activity.duration}h
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          Max {activity.maxCapacity}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-green-600 mt-2">
                        ${calculateActivityCost(activity, item.includeTransport || false).toLocaleString()}
                        {activity.transportRequired && activity.transportCost && (
                          <span className="text-slate-500 ml-1">
                            (Base: ${activity.basePrice}, Transport: ${activity.transportCost})
                          </span>
                        )}
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
                  
                  {activity.transportRequired && (
                    <div className="flex items-center space-x-2 pt-2 border-t">
                      <Checkbox
                        id={`transport-${item.id}`}
                        checked={item.includeTransport || false}
                        onCheckedChange={(checked) => 
                          onUpdateItem(item.id, { includeTransport: checked as boolean })
                        }
                      />
                      <label 
                        htmlFor={`transport-${item.id}`} 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Include Transport (+${activity.transportCost || 0})
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Available Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Available Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTemplates.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No activities found matching your search.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => {
                const isSelected = selectedActivities.some(item => item.templateId === template.id);
                
                return (
                  <div key={template.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{template.name}</h4>
                          <Badge className={getCategoryColor(template.category)}>
                            {template.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{template.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {template.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {template.duration}h
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            Max {template.maxCapacity}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <div className="font-medium text-green-600">
                          ${template.basePrice.toLocaleString()}
                          {template.transportRequired && template.transportCost && (
                            <span className="text-slate-500 ml-1">
                              (+${template.transportCost} transport)
                            </span>
                          )}
                        </div>
                        {template.transportRequired && (
                          <div className="text-red-600 text-xs mt-1">
                            Transport required
                          </div>
                        )}
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => onAddItem(template)}
                        disabled={isSelected}
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        {isSelected ? 'Added' : 'Add'}
                      </Button>
                    </div>
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

export default ActivitiesTab;
