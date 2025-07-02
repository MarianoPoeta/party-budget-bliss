import React, { useState } from 'react';
import { UtensilsCrossed, Users, DollarSign, Clock, MapPin, Edit, Plus, X } from 'lucide-react';
import { Menu, MenuItem } from '../types/Menu';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface MenuSelectionTemplateProps {
  menus: Menu[];
  onSelect?: (menu: Menu, calculatedPrice: number, guestCount: number) => void;
  guestCount: number;
}

const MenuSelectionTemplate: React.FC<MenuSelectionTemplateProps> = ({
  menus,
  onSelect,
  guestCount
}) => {
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedMenu, setEditedMenu] = useState<Menu | null>(null);

  const typeColors = {
    breakfast: 'bg-yellow-100 text-yellow-800',
    lunch: 'bg-blue-100 text-blue-800',
    dinner: 'bg-purple-100 text-purple-800',
    brunch: 'bg-green-100 text-green-800',
    cocktail: 'bg-pink-100 text-pink-800',
    catering: 'bg-orange-100 text-orange-800',
  };

  const categoryColors = {
    appetizer: 'bg-green-100 text-green-800',
    main: 'bg-blue-100 text-blue-800',
    dessert: 'bg-pink-100 text-pink-800',
    beverage: 'bg-yellow-100 text-yellow-800',
    special: 'bg-purple-100 text-purple-800',
  };

  const handleMenuSelect = (menu: Menu) => {
    const calculatedPrice = menu.pricePerPerson * guestCount;
    onSelect?.(menu, calculatedPrice, guestCount);
  };

  const handleEditMenu = (menu: Menu) => {
    // Deep clone menu to avoid mutating global template
    setEditingMenu(menu);
    setEditedMenu(JSON.parse(JSON.stringify(menu)));
    setIsEditDialogOpen(true);
  };

  const handleSaveEditedMenu = () => {
    if (editedMenu) {
      const calculatedPrice = editedMenu.pricePerPerson * guestCount;
      onSelect?.(editedMenu, calculatedPrice, guestCount);
      setIsEditDialogOpen(false);
      setEditingMenu(null);
      setEditedMenu(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setEditingMenu(null);
    setEditedMenu(null);
  };

  const addMenuItem = () => {
    if (editedMenu) {
      const newItem: MenuItem = {
        id: Date.now().toString(),
        name: '',
        description: '',
        price: 0,
        category: 'main'
      };
      setEditedMenu({
        ...editedMenu,
        items: [...editedMenu.items, newItem]
      });
    }
  };

  const updateMenuItem = (itemId: string, updates: Partial<MenuItem>) => {
    if (editedMenu) {
      setEditedMenu({
        ...editedMenu,
        items: editedMenu.items.map(item =>
          item.id === itemId ? { ...item, ...updates } : item
        )
      });
    }
  };

  const removeMenuItem = (itemId: string) => {
    if (editedMenu) {
      setEditedMenu({
        ...editedMenu,
        items: editedMenu.items.filter(item => item.id !== itemId)
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Select Menus</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menus.map((menu) => {
          const calculatedPrice = menu.pricePerPerson * guestCount;
          const isValidForGuestCount = guestCount >= menu.minPeople && guestCount <= menu.maxPeople;
          
          return (
            <Card key={menu.id} className={`hover:shadow-md transition-shadow cursor-pointer border-slate-200 ${
              !isValidForGuestCount ? 'opacity-50' : ''
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">{menu.name}</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={typeColors[menu.type]}>
                        {menu.type.charAt(0).toUpperCase() + menu.type.slice(1)}
                      </Badge>
                      {!isValidForGuestCount && (
                        <Badge variant="destructive" className="text-xs">
                          {guestCount < menu.minPeople ? `Min ${menu.minPeople}` : `Max ${menu.maxPeople}`}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <UtensilsCrossed className="h-5 w-5 text-slate-400" />
                </div>
                
                <p className="text-sm text-slate-600 mb-3">{menu.description}</p>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4">
                  <div className="flex items-center">
                    <DollarSign className="h-3 w-3 mr-1" />
                    ${menu.pricePerPerson}/person
                  </div>
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {menu.minPeople}-{menu.maxPeople} people
                  </div>
                  <div className="flex items-center col-span-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    {menu.restaurant}
                  </div>
                  <div className="flex items-center col-span-2 font-medium text-green-600">
                    <DollarSign className="h-3 w-3 mr-1" />
                    Total: ${calculatedPrice.toLocaleString()} ({guestCount} guests)
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-slate-800 hover:bg-slate-700"
                    onClick={() => handleMenuSelect(menu)}
                    disabled={!isValidForGuestCount}
                  >
                    Select Menu
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditMenu(menu)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Menu Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Menu Before Adding</DialogTitle>
          </DialogHeader>
          
          {editedMenu && (
            <div className="space-y-6">
              {/* Basic Menu Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="menuName">Menu Name</Label>
                  <Input
                    id="menuName"
                    value={editedMenu.name}
                    onChange={(e) => setEditedMenu({ ...editedMenu, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="menuType">Type</Label>
                  <Select value={editedMenu.type} onValueChange={(value) => setEditedMenu({ ...editedMenu, type: value as Menu['type'] })}>
                    <SelectTrigger>
                      <SelectValue />
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
                </div>
                <div>
                  <Label htmlFor="pricePerPerson">Price per Person ($)</Label>
                  <Input
                    id="pricePerPerson"
                    type="number"
                    value={editedMenu.pricePerPerson}
                    onChange={(e) => setEditedMenu({ ...editedMenu, pricePerPerson: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="restaurant">Restaurant</Label>
                  <Input
                    id="restaurant"
                    value={editedMenu.restaurant}
                    onChange={(e) => setEditedMenu({ ...editedMenu, restaurant: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="minPeople">Min People</Label>
                  <Input
                    id="minPeople"
                    type="number"
                    value={editedMenu.minPeople}
                    onChange={(e) => setEditedMenu({ ...editedMenu, minPeople: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <Label htmlFor="maxPeople">Max People</Label>
                  <Input
                    id="maxPeople"
                    type="number"
                    value={editedMenu.maxPeople}
                    onChange={(e) => setEditedMenu({ ...editedMenu, maxPeople: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editedMenu.description}
                  onChange={(e) => setEditedMenu({ ...editedMenu, description: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Menu Items */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Menu Items</h3>
                  <Button size="sm" onClick={addMenuItem}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-3">
                  {editedMenu.items.map((item, index) => (
                    <div key={item.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Item {index + 1}</h4>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeMenuItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={item.name}
                            onChange={(e) => updateMenuItem(item.id, { name: e.target.value })}
                            placeholder="Item name"
                          />
                        </div>
                        <div>
                          <Label>Category</Label>
                          <Select value={item.category} onValueChange={(value) => updateMenuItem(item.id, { category: value as MenuItem['category'] })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="appetizer">Appetizer</SelectItem>
                              <SelectItem value="main">Main</SelectItem>
                              <SelectItem value="dessert">Dessert</SelectItem>
                              <SelectItem value="beverage">Beverage</SelectItem>
                              <SelectItem value="special">Special</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Price ($)</Label>
                          <Input
                            type="number"
                            value={item.price}
                            onChange={(e) => updateMenuItem(item.id, { price: parseFloat(e.target.value) || 0 })}
                            placeholder="0.00"
                          />
                        </div>
                        <div className="flex items-end">
                          <Badge className={categoryColors[item.category]}>
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={item.description}
                          onChange={(e) => updateMenuItem(item.id, { description: e.target.value })}
                          placeholder="Item description"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Preview */}
              <div className="border-t pt-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Price Preview</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Price per person:</span>
                      <span className="ml-2 font-medium">${editedMenu.pricePerPerson}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Guest count:</span>
                      <span className="ml-2 font-medium">{guestCount}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-600">Total price:</span>
                      <span className="ml-2 font-medium text-lg text-green-600">
                        ${(editedMenu.pricePerPerson * guestCount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveEditedMenu}>
                  Agregar al Presupuesto
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuSelectionTemplate; 