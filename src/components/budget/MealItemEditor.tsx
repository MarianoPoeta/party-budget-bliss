import React, { useState, useEffect } from 'react';
import { Plus, Minus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MealTemplate, MealItem } from '../../types/Budget';

interface MealItemEditorProps {
  isOpen: boolean;
  onClose: () => void;
  mealTemplate: MealTemplate;
  guestCount: number;
  onSave: (customizedMeal: MealTemplate & { items: MealItem[]; customizations: any }) => void;
}

const MealItemEditor: React.FC<MealItemEditorProps> = ({
  isOpen,
  onClose,
  mealTemplate,
  guestCount,
  onSave
}) => {
  const [editedMeal, setEditedMeal] = useState<MealTemplate>(mealTemplate);
  const [mealItems, setMealItems] = useState<MealItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: 0, unit: '', pricePerUnit: 0 });

  // Initialize meal items based on template
  useEffect(() => {
    if (isOpen && mealTemplate) {
      setEditedMeal(mealTemplate);
      
      // Create default items based on meal type
      const defaultItems = getDefaultItemsForMeal(mealTemplate, guestCount);
      setMealItems(defaultItems);
    }
  }, [isOpen, mealTemplate, guestCount]);

  const getDefaultItemsForMeal = (meal: MealTemplate, guests: number): MealItem[] => {
    // Define default items based on meal type and name
    const itemsMap: Record<string, MealItem[]> = {
      'Asado Premium': [
        { id: '1', name: 'Chorizo', quantity: guests * 2, unit: 'units', pricePerUnit: 1.5, notes: '2 per person' },
        { id: '2', name: 'Vacio', quantity: guests * 200, unit: 'gr', pricePerUnit: 0.015, notes: '200gr per person' },
        { id: '3', name: 'Morcilla', quantity: guests, unit: 'units', pricePerUnit: 2.0, notes: '1 per person' },
        { id: '4', name: 'Provoleta', quantity: Math.ceil(guests / 4), unit: 'units', pricePerUnit: 4.0, notes: '1 per 4 people' },
        { id: '5', name: 'Chimichurri', quantity: Math.ceil(guests / 6), unit: 'portions', pricePerUnit: 3.0, notes: '1 portion per 6 people' }
      ],
      'Wine Tasting Lunch': [
        { id: '1', name: 'Empanadas', quantity: guests * 3, unit: 'units', pricePerUnit: 1.2, notes: '3 per person' },
        { id: '2', name: 'Wine Selection', quantity: Math.ceil(guests / 4), unit: 'bottles', pricePerUnit: 25.0, notes: '1 bottle per 4 people' },
        { id: '3', name: 'Cheese Board', quantity: Math.ceil(guests / 6), unit: 'boards', pricePerUnit: 15.0, notes: '1 board per 6 people' },
        { id: '4', name: 'Bread Basket', quantity: Math.ceil(guests / 4), unit: 'baskets', pricePerUnit: 5.0, notes: '1 basket per 4 people' }
      ]
    };

    return itemsMap[meal.name] || [
      { id: '1', name: 'Main Course', quantity: guests, unit: 'portions', pricePerUnit: meal.pricePerPerson * 0.7, notes: '1 portion per person' },
      { id: '2', name: 'Side Dishes', quantity: guests, unit: 'portions', pricePerUnit: meal.pricePerPerson * 0.2, notes: '1 portion per person' },
      { id: '3', name: 'Beverages', quantity: guests, unit: 'portions', pricePerUnit: meal.pricePerPerson * 0.1, notes: '1 portion per person' }
    ];
  };

  const addNewItem = () => {
    if (newItem.name.trim()) {
      const item: MealItem = {
        id: Date.now().toString(),
        ...newItem
      };
      setMealItems(prev => [...prev, item]);
      setNewItem({ name: '', quantity: 0, unit: '', pricePerUnit: 0 });
    }
  };

  const updateItem = (id: string, updates: Partial<MealItem>) => {
    setMealItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const removeItem = (id: string) => {
    setMealItems(prev => prev.filter(item => item.id !== id));
  };

  const calculateTotalPrice = () => {
    return mealItems.reduce((total, item) => total + (item.quantity * item.pricePerUnit), 0);
  };

  const calculatePricePerPerson = () => {
    return guestCount > 0 ? calculateTotalPrice() / guestCount : 0;
  };

  const handleSave = () => {
    const customizedMeal = {
      ...editedMeal,
      pricePerPerson: calculatePricePerPerson(),
      items: mealItems,
      customizations: {
        itemsCustomized: true,
        originalTemplate: mealTemplate,
        guestCount
      }
    };
    onSave(customizedMeal);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize Meal: {mealTemplate.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Meal Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Meal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="meal-name">Meal Name</Label>
                  <Input
                    id="meal-name"
                    value={editedMeal.name}
                    onChange={(e) => setEditedMeal(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="restaurant">Restaurant</Label>
                  <Input
                    id="restaurant"
                    value={editedMeal.restaurant}
                    onChange={(e) => setEditedMeal(prev => ({ ...prev, restaurant: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editedMeal.description}
                  onChange={(e) => setEditedMeal(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm bg-slate-50 p-3 rounded">
                <div>
                  <span className="font-medium">Guests:</span> {guestCount}
                </div>
                <div>
                  <span className="font-medium">Total Cost:</span> ${calculateTotalPrice().toFixed(2)}
                </div>
                <div>
                  <span className="font-medium">Per Person:</span> ${calculatePricePerPerson().toFixed(2)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meal Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Meal Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Items */}
              {mealItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-1 grid grid-cols-4 gap-3">
                    <Input
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) => updateItem(item.id, { name: e.target.value })}
                    />
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateItem(item.id, { quantity: Math.max(0, item.quantity - 1) })}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, { quantity: parseInt(e.target.value) || 0 })}
                        className="text-center"
                      />
                      <span className="text-sm text-slate-600">{item.unit}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateItem(item.id, { quantity: item.quantity + 1 })}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Price per unit"
                      value={item.pricePerUnit}
                      onChange={(e) => updateItem(item.id, { pricePerUnit: parseFloat(e.target.value) || 0 })}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        ${(item.quantity * item.pricePerUnit).toFixed(2)}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {item.notes && (
                    <div className="text-xs text-slate-500 col-span-4">{item.notes}</div>
                  )}
                </div>
              ))}

              {/* Add New Item */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Input
                  placeholder="New item name"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Qty"
                  value={newItem.quantity || ''}
                  onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                  className="w-20"
                />
                <Input
                  placeholder="Unit"
                  value={newItem.unit}
                  onChange={(e) => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
                  className="w-20"
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={newItem.pricePerUnit || ''}
                  onChange={(e) => setNewItem(prev => ({ ...prev, pricePerUnit: parseFloat(e.target.value) || 0 }))}
                  className="w-24"
                />
                <Button onClick={addNewItem} disabled={!newItem.name.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Customized Meal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealItemEditor;
