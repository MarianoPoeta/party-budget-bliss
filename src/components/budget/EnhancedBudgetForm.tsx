
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Search, Filter, Plus, Trash2, Edit2, Calendar, Users, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import { useBudgetWorkflow } from '../../hooks/useBudgetWorkflow';
import { useRealTimeUpdates } from '../../hooks/useRealTimeUpdates';
import { useBudgetCalculation } from '../../hooks/useBudgetCalculation';
import { useTemplates } from '../../hooks/useTemplates';

interface EnhancedBudgetFormProps {
  onSave: (budget: any) => void;
  onCancel: () => void;
  initialBudget?: any;
}

const EnhancedBudgetForm: React.FC<EnhancedBudgetFormProps> = ({
  onSave,
  onCancel,
  initialBudget
}) => {
  const { templates } = useTemplates();
  const {
    budget,
    validationErrors,
    addItem,
    removeItem,
    updateItem,
    validateBudget,
    updateBudgetField
  } = useBudgetWorkflow(initialBudget);

  const [searchTerms, setSearchTerms] = useState({
    meals: '',
    activities: '',
    transport: '',
    stay: ''
  });

  // Real-time budget calculation
  const totalAmount = useBudgetCalculation({
    selectedMeals: budget.selectedMeals?.map(item => item.template) || [],
    selectedActivities: budget.selectedActivities?.map(item => item.template) || [],
    selectedTransport: budget.selectedTransport?.map(item => item.template) || [],
    selectedStay: budget.selectedStay?.template,
    guestCount: budget.guestCount || 0,
    extras: budget.extras || 0
  });

  // Update total amount in real-time
  useEffect(() => {
    updateBudgetField('totalAmount', totalAmount);
  }, [totalAmount, updateBudgetField]);

  const handleSave = () => {
    const errors = validateBudget();
    if (errors.filter(e => e.severity === 'error').length === 0) {
      onSave({ ...budget, totalAmount });
    }
  };

  const filteredTemplates = (type: 'meals' | 'activities' | 'transport' | 'stay') => {
    const items = templates[type] || [];
    const searchTerm = searchTerms[type].toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm)
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="space-y-2">
          {validationErrors.map((error, index) => (
            <Alert key={index} variant={error.severity === 'error' ? 'destructive' : 'default'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Budget Header with Real-time Total */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Client Name</label>
              <Input
                value={budget.clientName || ''}
                onChange={(e) => updateBudgetField('clientName', e.target.value)}
                placeholder="Enter client name"
                className="bg-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Event Date</label>
              <Input
                type="date"
                value={budget.eventDate || ''}
                onChange={(e) => updateBudgetField('eventDate', e.target.value)}
                className="bg-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Guest Count</label>
              <Input
                type="number"
                value={budget.guestCount || 0}
                onChange={(e) => updateBudgetField('guestCount', parseInt(e.target.value) || 0)}
                min="1"
                className="bg-white"
              />
            </div>
            <div className="flex items-end">
              <div className="bg-white p-3 rounded-lg border shadow-sm w-full">
                <div className="text-2xl font-bold text-green-600 flex items-center">
                  <DollarSign className="h-5 w-5 mr-1" />
                  {totalAmount.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">Total Budget</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Tabs for Budget Items */}
      <Tabs defaultValue="meals" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="meals" className="flex items-center gap-2">
            Meals
            {budget.selectedMeals && budget.selectedMeals.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {budget.selectedMeals.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-2">
            Activities
            {budget.selectedActivities && budget.selectedActivities.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {budget.selectedActivities.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="transport" className="flex items-center gap-2">
            Transport
            {budget.selectedTransport && budget.selectedTransport.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {budget.selectedTransport.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="stay" className="flex items-center gap-2">
            Stay
            {budget.selectedStay && (
              <Badge variant="secondary" className="ml-1">1</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Meals Tab */}
        <TabsContent value="meals" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Select Meals</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search meals..."
                    value={searchTerms.meals}
                    onChange={(e) => setSearchTerms(prev => ({ ...prev, meals: e.target.value }))}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredTemplates('meals').map((meal) => (
                  <Card key={meal.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">{meal.name}</h4>
                      <p className="text-sm text-slate-600 mb-3">{meal.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-600">
                          ${meal.pricePerPerson}/person
                        </span>
                        <Button
                          size="sm"
                          onClick={() => addItem('meals', meal)}
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

              {/* Selected Meals */}
              {budget.selectedMeals && budget.selectedMeals.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Selected Meals</h3>
                  <div className="space-y-2">
                    {budget.selectedMeals.map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{item.template.name}</div>
                          <div className="text-sm text-slate-600">
                            ${item.template.pricePerPerson}/person × {budget.guestCount} guests = 
                            ${(item.template.pricePerPerson * (budget.guestCount || 0)).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeItem('meals', item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Select Activities</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search activities..."
                    value={searchTerms.activities}
                    onChange={(e) => setSearchTerms(prev => ({ ...prev, activities: e.target.value }))}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredTemplates('activities').map((activity) => (
                  <Card key={activity.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{activity.name}</h4>
                        {activity.transportRequired && (
                          <Badge variant="outline" className="text-xs">Transport Required</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{activity.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-600">
                          ${activity.basePrice}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => addItem('activities', activity)}
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

              {/* Selected Activities */}
              {budget.selectedActivities && budget.selectedActivities.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Selected Activities</h3>
                  <div className="space-y-3">
                    {budget.selectedActivities.map((item, index) => (
                      <div key={item.id} className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <div className="font-medium">{item.template.name}</div>
                            <div className="text-sm text-slate-600">
                              Base price: ${item.template.basePrice}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeItem('activities', item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {item.template.transportRequired && (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`transport-${item.id}`}
                              checked={item.includeTransport || false}
                              onCheckedChange={(checked) => 
                                updateItem('activities', item.id, { includeTransport: checked as boolean })
                              }
                            />
                            <label htmlFor={`transport-${item.id}`} className="text-sm">
                              Include Transport? (+${item.template.transportCost || 0})
                            </label>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transport and Stay tabs would follow similar patterns */}
        <TabsContent value="transport">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-slate-500">Transport selection interface here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stay">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-slate-500">Stay selection interface here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 px-8"
          disabled={validationErrors.some(e => e.severity === 'error')}
        >
          Save Budget
        </Button>
      </div>
    </div>
  );
};

export default EnhancedBudgetForm;
