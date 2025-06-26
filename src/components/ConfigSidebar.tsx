
import React, { useState } from 'react';
import { Settings, Plus, Edit, Trash2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { useTemplates } from '../hooks/useTemplates';
import { MealTemplate, ActivityTemplate, TransportTemplate, StayTemplate } from '../types/Budget';

interface ConfigSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfigSidebar: React.FC<ConfigSidebarProps> = ({ isOpen, onClose }) => {
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useTemplates();
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<string>('');
  const [newItem, setNewItem] = useState<any>({});
  const [activeTab, setActiveTab] = useState('meals');

  const handleSaveTemplate = (type: string, template: any) => {
    if (editingItem) {
      updateTemplate(type, editingItem.id, template);
      setEditingItem(null);
    } else {
      addTemplate(type, template);
    }
    setNewItem({});
  };

  const renderTemplateForm = (type: string, item: any = {}) => {
    switch (type) {
      case 'meals':
        return (
          <div className="space-y-4">
            <Input
              placeholder="Meal name"
              value={item.name || ''}
              onChange={(e) => setNewItem({ ...item, name: e.target.value })}
            />
            <Textarea
              placeholder="Description"
              value={item.description || ''}
              onChange={(e) => setNewItem({ ...item, description: e.target.value })}
            />
            <Select value={item.type || ''} onValueChange={(value) => setNewItem({ ...item, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="brunch">Brunch</SelectItem>
                <SelectItem value="cocktail">Cocktail</SelectItem>
                <SelectItem value="catering">Catering</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Price per person"
              value={item.pricePerPerson || ''}
              onChange={(e) => setNewItem({ ...item, pricePerPerson: Number(e.target.value) })}
            />
            <Input
              placeholder="Restaurant"
              value={item.restaurant || ''}
              onChange={(e) => setNewItem({ ...item, restaurant: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min people"
                value={item.minPeople || ''}
                onChange={(e) => setNewItem({ ...item, minPeople: Number(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="Max people"
                value={item.maxPeople || ''}
                onChange={(e) => setNewItem({ ...item, maxPeople: Number(e.target.value) })}
              />
            </div>
          </div>
        );

      case 'activities':
        return (
          <div className="space-y-4">
            <Input
              placeholder="Activity name"
              value={item.name || ''}
              onChange={(e) => setNewItem({ ...item, name: e.target.value })}
            />
            <Textarea
              placeholder="Description"
              value={item.description || ''}
              onChange={(e) => setNewItem({ ...item, description: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Base price"
              value={item.basePrice || ''}
              onChange={(e) => setNewItem({ ...item, basePrice: Number(e.target.value) })}
            />
            <Input
              type="number"
              placeholder="Duration (hours)"
              value={item.duration || ''}
              onChange={(e) => setNewItem({ ...item, duration: Number(e.target.value) })}
            />
            <Input
              placeholder="Location"
              value={item.location || ''}
              onChange={(e) => setNewItem({ ...item, location: e.target.value })}
            />
            <Select value={item.category || ''} onValueChange={(value) => setNewItem({ ...item, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="outdoor">Outdoor</SelectItem>
                <SelectItem value="indoor">Indoor</SelectItem>
                <SelectItem value="nightlife">Nightlife</SelectItem>
                <SelectItem value="dining">Dining</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      // Similar forms for transport and stay...
      default:
        return <div>Form for {type}</div>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg border-l border-slate-200 z-50 overflow-y-auto">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Template Configuration
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="meals">Meals</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="transport">Transport</TabsTrigger>
            <TabsTrigger value="stay">Stay</TabsTrigger>
          </TabsList>

          <TabsContent value="meals" className="space-y-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full" onClick={() => setNewItem({})}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Meal Template
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Meal Template</DialogTitle>
                </DialogHeader>
                {renderTemplateForm('meals', newItem)}
                <Button onClick={() => handleSaveTemplate('meals', newItem)}>
                  Save Template
                </Button>
              </DialogContent>
            </Dialog>

            {templates.meals.map((meal) => (
              <Card key={meal.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{meal.name}</h4>
                      <p className="text-sm text-slate-600">${meal.pricePerPerson}/person</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteTemplate('meals', meal.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Similar TabsContent for other types... */}
        </Tabs>
      </div>
    </div>
  );
};

export default ConfigSidebar;
