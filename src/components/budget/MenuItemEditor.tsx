import React, { useState, useEffect } from 'react';
import { Plus, Minus, X, ChefHat, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Menu, MenuItem } from '../../types/Menu';

interface MenuItemEditorProps {
  isOpen: boolean;
  onClose: () => void;
  menu: Menu;
  guestCount: number;
  onSave: (customizedMenu: Menu) => void;
}

const MenuItemEditor: React.FC<MenuItemEditorProps> = ({
  isOpen,
  onClose,
  menu,
  guestCount,
  onSave
}) => {
  const [editedMenu, setEditedMenu] = useState<Menu>(menu);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({ 
    name: '', 
    description: '', 
    price: 0, 
    category: 'main' 
  });

  // Initialize menu items
  useEffect(() => {
    if (isOpen && menu) {
      setEditedMenu(menu);
      setMenuItems([...menu.items]);
    }
  }, [isOpen, menu]);

  const addNewItem = () => {
    if (newItem.name?.trim()) {
      const item: MenuItem = {
        id: Date.now().toString(),
        name: newItem.name,
        description: newItem.description || '',
        price: newItem.price || 0,
        category: newItem.category || 'main'
      };
      setMenuItems(prev => [...prev, item]);
      setNewItem({ name: '', description: '', price: 0, category: 'main' });
    }
  };

  const updateItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const removeItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const calculateTotalItemsPrice = () => {
    return menuItems.reduce((total, item) => total + item.price, 0);
  };

  const handleSave = () => {
    const customizedMenu: Menu = {
      ...editedMenu,
      items: menuItems,
      pricePerPerson: editedMenu.pricePerPerson // Keep original price per person or could be calculated
    };
    onSave(customizedMenu);
    onClose();
  };

  const categoryColors = {
    appetizer: 'bg-orange-100 text-orange-800',
    main: 'bg-blue-100 text-blue-800',
    dessert: 'bg-pink-100 text-pink-800',
    beverage: 'bg-green-100 text-green-800',
    special: 'bg-purple-100 text-purple-800'
  };

  const typeColors = {
    breakfast: 'bg-yellow-100 text-yellow-800',
    lunch: 'bg-green-100 text-green-800',
    dinner: 'bg-blue-100 text-blue-800',
    brunch: 'bg-orange-100 text-orange-800',
    cocktail: 'bg-purple-100 text-purple-800',
    catering: 'bg-red-100 text-red-800',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Customize Menu: {menu.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Menu Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                Menu Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="menu-name">Menu Name</Label>
                  <Input
                    id="menu-name"
                    value={editedMenu.name}
                    onChange={(e) => setEditedMenu(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="restaurant">Restaurant</Label>
                  <Input
                    id="restaurant"
                    value={editedMenu.restaurant}
                    onChange={(e) => setEditedMenu(prev => ({ ...prev, restaurant: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editedMenu.description}
                  onChange={(e) => setEditedMenu(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="price-per-person">Price per Person</Label>
                  <Input
                    id="price-per-person"
                    type="number"
                    step="0.01"
                    value={editedMenu.pricePerPerson}
                    onChange={(e) => setEditedMenu(prev => ({ ...prev, pricePerPerson: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="min-people">Min People</Label>
                  <Input
                    id="min-people"
                    type="number"
                    value={editedMenu.minPeople}
                    onChange={(e) => setEditedMenu(prev => ({ ...prev, minPeople: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="max-people">Max People</Label>
                  <Input
                    id="max-people"
                    type="number"
                    value={editedMenu.maxPeople}
                    onChange={(e) => setEditedMenu(prev => ({ ...prev, maxPeople: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="flex items-center">
                  <Badge className={`px-3 py-1 ${typeColors[editedMenu.type]}`}>
                    {editedMenu.type.charAt(0).toUpperCase() + editedMenu.type.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Guests:</span> 
                  <Badge variant="outline">{guestCount}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">Total Cost:</span> 
                  <Badge variant="outline">${(editedMenu.pricePerPerson * guestCount).toFixed(2)}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Items Value:</span> 
                  <Badge variant="outline">${calculateTotalItemsPrice().toFixed(2)}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Menu Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                Menu Items ({menuItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Items */}
              <div className="grid gap-4">
                {menuItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-4 border rounded-lg bg-white">
                    <div className="flex-1 grid grid-cols-4 gap-3">
                      <div>
                        <Input
                          placeholder="Item name"
                          value={item.name}
                          onChange={(e) => updateItem(item.id, { name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Input
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, { description: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Price"
                          value={item.price}
                          onChange={(e) => updateItem(item.id, { price: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <Badge className={categoryColors[item.category]}>
                          {item.category}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Item */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                <div className="flex-1 grid grid-cols-5 gap-3">
                  <Input
                    placeholder="New item name"
                    value={newItem.name || ''}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    placeholder="Description"
                    value={newItem.description || ''}
                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      value={newItem.price || ''}
                      onChange={(e) => setNewItem(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <Select
                    value={newItem.category}
                    onValueChange={(value: MenuItem['category']) => setNewItem(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appetizer">Appetizer</SelectItem>
                      <SelectItem value="main">Main</SelectItem>
                      <SelectItem value="dessert">Dessert</SelectItem>
                      <SelectItem value="beverage">Beverage</SelectItem>
                      <SelectItem value="special">Special</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={addNewItem} 
                    disabled={!newItem.name?.trim()}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <ChefHat className="h-4 w-4" />
              Save Customized Menu
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemEditor;
