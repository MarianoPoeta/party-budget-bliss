import React, { useState } from 'react';
import { UtensilsCrossed, Users, DollarSign, Edit, Plus, X, ChefHat, MapPin, Clock, Star } from 'lucide-react';
import { Menu, MenuItem } from '../types/Menu';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';

interface MenuSelectorProps {
  menus: Menu[];
  onSelect?: (menu: Menu, calculatedPrice: number, guestCount: number) => void;
  guestCount: number;
}

const MenuSelector: React.FC<MenuSelectorProps> = ({
  menus,
  onSelect,
  guestCount
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedMenu, setEditedMenu] = useState<Menu | null>(null);

  const typeColors = {
    breakfast: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200',
    lunch: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200',
    dinner: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200',
    brunch: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200',
    cocktail: 'bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800 border-pink-200',
    catering: 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200',
  };

  const categoryColors = {
    appetizer: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    main: 'bg-blue-50 text-blue-700 border-blue-200',
    dessert: 'bg-pink-50 text-pink-700 border-pink-200',
    beverage: 'bg-amber-50 text-amber-700 border-amber-200',
    special: 'bg-violet-50 text-violet-700 border-violet-200',
  };

  const handleMenuSelect = (menu: Menu) => {
    const calculatedPrice = (menu.pricePerPerson || 0) * guestCount;
    onSelect?.(menu, calculatedPrice, guestCount);
  };

  const handleEditMenu = (menu: Menu) => {
    // Deep clone menu to avoid mutating global template
    setEditedMenu(JSON.parse(JSON.stringify(menu)));
    setIsEditDialogOpen(true);
  };

  const handleSaveEditedMenu = () => {
    if (editedMenu) {
      const calculatedPrice = (editedMenu.pricePerPerson || 0) * guestCount;
      onSelect?.(editedMenu, calculatedPrice, guestCount);
      setIsEditDialogOpen(false);
      setEditedMenu(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
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
        items: [...(editedMenu.items || []), newItem]
      });
    }
  };

  const updateMenuItem = (itemId: string, updates: Partial<MenuItem>) => {
    if (editedMenu && editedMenu.items) {
      setEditedMenu({
        ...editedMenu,
        items: editedMenu.items.map(item =>
          item.id === itemId ? { ...item, ...updates } : item
        )
      });
    }
  };

  const removeMenuItem = (itemId: string) => {
    if (editedMenu && editedMenu.items) {
      setEditedMenu({
        ...editedMenu,
        items: editedMenu.items.filter(item => item.id !== itemId)
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Select Menus</h3>
          <p className="text-slate-600 mt-1">Choose from our curated menu collection</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Users className="h-4 w-4" />
          <span>{guestCount} guests</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {menus.map((menu) => {
          const calculatedPrice = (menu.pricePerPerson || 0) * guestCount;
          const isValidForGuestCount = guestCount >= (menu.minPeople || 0) && guestCount <= (menu.maxPeople || 999);
          const itemCount = menu.items?.length || 0;
          
          return (
            <Card key={menu.id} className={`group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 ${
              !isValidForGuestCount 
                ? 'opacity-60 border-slate-200' 
                : 'border-slate-200 hover:border-slate-300 hover:scale-[1.02]'
            }`}>
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                        {menu.name}
                      </h4>
                      <Badge className={`${typeColors[menu.type || 'catering']} font-medium`}>
                        {(menu.type || 'catering').charAt(0).toUpperCase() + (menu.type || 'catering').slice(1)}
                      </Badge>
                    </div>
                    {!isValidForGuestCount && (
                      <Badge variant="destructive" className="text-xs mb-2">
                        {guestCount < (menu.minPeople || 0) ? `Min ${(menu.minPeople || 0)} guests` : `Max ${(menu.maxPeople || 999)} guests`}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <UtensilsCrossed className="h-5 w-5 text-slate-600" />
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-slate-600 mb-4 line-clamp-2">{menu.description}</p>
                
                {/* Restaurant Info */}
                <div className="flex items-center gap-2 mb-4 text-sm text-slate-500">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">{menu.restaurant || 'Unknown Restaurant'}</span>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-slate-700">Per Person</span>
                    </div>
                    <p className="text-lg font-bold text-green-600">${menu.pricePerPerson || 0}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-slate-700">Capacity</span>
                    </div>
                    <p className="text-lg font-bold text-blue-600">{(menu.minPeople || 0)}-{(menu.maxPeople || 999)}</p>
                  </div>
                </div>

                {/* Menu Items Preview */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <ChefHat className="h-4 w-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">{itemCount} items</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {menu.items?.slice(0, 3).map((item) => (
                      <Badge key={item.id} variant="outline" className="text-xs">
                        {item.name}
                      </Badge>
                    ))}
                    {menu.items?.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{menu.items.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Total Price */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Total for {guestCount} guests</p>
                      <p className="text-2xl font-bold text-green-700">${calculatedPrice.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-green-600">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-medium">Best Value</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    size="lg"
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium"
                    onClick={() => handleMenuSelect(menu)}
                    disabled={!isValidForGuestCount}
                  >
                    Select Menu
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={() => handleEditMenu(menu)}
                    className="border-slate-300 hover:bg-slate-50"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Customize
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Menu Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Customize Menu</DialogTitle>
            <p className="text-slate-600">Edit menu details before adding to your budget</p>
          </DialogHeader>
          
          {editedMenu && (
            <div className="space-y-8">
              {/* Basic Menu Info */}
              <div className="bg-slate-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Menu Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="menuName" className="text-sm font-medium">Menu Name</Label>
                    <Input
                      id="menuName"
                      value={editedMenu.name}
                      onChange={(e) => setEditedMenu({ ...editedMenu, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="menuType" className="text-sm font-medium">Type</Label>
                    <Select value={editedMenu.type} onValueChange={(value) => setEditedMenu({ ...editedMenu, type: value as Menu['type'] })}>
                      <SelectTrigger className="mt-1">
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
                    <Label htmlFor="pricePerPerson" className="text-sm font-medium">Price per Person ($)</Label>
                    <Input
                      id="pricePerPerson"
                      type="number"
                      value={editedMenu.pricePerPerson || 0}
                      onChange={(e) => setEditedMenu({ ...editedMenu, pricePerPerson: parseFloat(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="restaurant" className="text-sm font-medium">Restaurant</Label>
                    <Input
                      id="restaurant"
                      value={editedMenu.restaurant}
                      onChange={(e) => setEditedMenu({ ...editedMenu, restaurant: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="minPeople" className="text-sm font-medium">Min People</Label>
                    <Input
                      id="minPeople"
                      type="number"
                      value={editedMenu.minPeople || 1}
                      onChange={(e) => setEditedMenu({ ...editedMenu, minPeople: parseInt(e.target.value) || 1 })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxPeople" className="text-sm font-medium">Max People</Label>
                    <Input
                      id="maxPeople"
                      type="number"
                      value={editedMenu.maxPeople || 999}
                      onChange={(e) => setEditedMenu({ ...editedMenu, maxPeople: parseInt(e.target.value) || 999 })}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                  <Textarea
                    id="description"
                    value={editedMenu.description}
                    onChange={(e) => setEditedMenu({ ...editedMenu, description: e.target.value })}
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Menu Items */}
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Menu Items</h3>
                    <p className="text-slate-600 text-sm">Customize the items in your menu</p>
                  </div>
                  <Button onClick={addMenuItem} className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-4">
                  {editedMenu.items.map((item, index) => (
                    <div key={item.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-slate-900">Item {index + 1}</h4>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeMenuItem(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Name</Label>
                          <Input
                            value={item.name}
                            onChange={(e) => updateMenuItem(item.id, { name: e.target.value })}
                            placeholder="Item name"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Category</Label>
                          <Select value={item.category} onValueChange={(value) => updateMenuItem(item.id, { category: value as MenuItem['category'] })}>
                            <SelectTrigger className="mt-1">
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
                          <Label className="text-sm font-medium">Price ($)</Label>
                          <Input
                            type="number"
                            value={item.price}
                            onChange={(e) => updateMenuItem(item.id, { price: parseFloat(e.target.value) || 0 })}
                            placeholder="0.00"
                            className="mt-1"
                          />
                        </div>
                        <div className="flex items-end">
                          <Badge className={`${categoryColors[item.category]} font-medium`}>
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Label className="text-sm font-medium">Description</Label>
                        <Textarea
                          value={item.description}
                          onChange={(e) => updateMenuItem(item.id, { description: e.target.value })}
                          placeholder="Item description"
                          rows={2}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Preview */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Price Preview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-sm text-slate-600">Price per person</p>
                    <p className="text-2xl font-bold text-green-600">${editedMenu.pricePerPerson || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-600">Guest count</p>
                    <p className="text-2xl font-bold text-blue-600">{guestCount}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-600">Total price</p>
                    <p className="text-3xl font-bold text-green-700">
                      ${(editedMenu.pricePerPerson || 0) * guestCount}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button variant="outline" onClick={handleCancelEdit} size="lg">
                  Cancel
                </Button>
                <Button onClick={handleSaveEditedMenu} size="lg" className="bg-green-600 hover:bg-green-700">
                  Add to Budget
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuSelector;
