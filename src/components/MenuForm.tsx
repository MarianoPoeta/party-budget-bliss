
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Menu, MenuItem } from '../types/Menu';

interface MenuFormProps {
  isOpen: boolean;
  onClose: () => void;
  menu?: Menu | null;
}

const MenuForm = ({ isOpen, onClose, menu }: MenuFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'lunch' as Menu['type'],
    pricePerPerson: 0,
    minPeople: 1,
    maxPeople: 10,
    restaurant: '',
    isActive: true,
  });

  const [items, setItems] = useState<MenuItem[]>([]);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'main' as MenuItem['category'],
  });

  useEffect(() => {
    if (menu) {
      setFormData({
        name: menu.name,
        description: menu.description,
        type: menu.type,
        pricePerPerson: menu.pricePerPerson,
        minPeople: menu.minPeople,
        maxPeople: menu.maxPeople,
        restaurant: menu.restaurant,
        isActive: menu.isActive,
      });
      setItems([...menu.items]);
    } else {
      setFormData({
        name: '',
        description: '',
        type: 'lunch',
        pricePerPerson: 0,
        minPeople: 1,
        maxPeople: 10,
        restaurant: '',
        isActive: true,
      });
      setItems([]);
    }
  }, [menu, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const menuData = { ...formData, items };
    console.log(menu ? 'Updating menu:' : 'Creating menu:', menuData);
    onClose();
  };

  const addMenuItem = () => {
    if (newItem.name.trim()) {
      const menuItem: MenuItem = {
        id: Date.now().toString(),
        ...newItem,
      };
      setItems(prev => [...prev, menuItem]);
      setNewItem({
        name: '',
        description: '',
        price: 0,
        category: 'main',
      });
    }
  };

  const removeMenuItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {menu ? 'Edit Menu' : 'Add New Menu'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                placeholder="Menu name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Menu['type'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="brunch">Brunch</option>
                <option value="cocktail">Cocktail</option>
                <option value="catering">Catering</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Person ($) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.pricePerPerson}
                onChange={(e) => setFormData(prev => ({ ...prev, pricePerPerson: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant *
              </label>
              <input
                type="text"
                required
                value={formData.restaurant}
                onChange={(e) => setFormData(prev => ({ ...prev, restaurant: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                placeholder="Restaurant name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min People *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.minPeople}
                onChange={(e) => setFormData(prev => ({ ...prev, minPeople: parseInt(e.target.value) || 1 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max People *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.maxPeople}
                onChange={(e) => setFormData(prev => ({ ...prev, maxPeople: parseInt(e.target.value) || 1 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                placeholder="10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              placeholder="Describe the menu..."
            />
          </div>

          {/* Menu Items Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Menu Items</h3>
            
            {/* Add New Item Form */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Add Menu Item</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  placeholder="Item name"
                />
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value as MenuItem['category'] }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                >
                  <option value="appetizer">Appetizer</option>
                  <option value="main">Main</option>
                  <option value="dessert">Dessert</option>
                  <option value="beverage">Beverage</option>
                  <option value="special">Special</option>
                </select>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) => setNewItem(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  placeholder="Price"
                />
                <Button type="button" onClick={addMenuItem} variant="outline">
                  Add Item
                </Button>
              </div>
              <textarea
                rows={2}
                value={newItem.description}
                onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                placeholder="Item description"
              />
            </div>

            {/* Menu Items List */}
            {items.length > 0 && (
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{item.name}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.category === 'appetizer' ? 'bg-green-100 text-green-800' :
                          item.category === 'main' ? 'bg-blue-100 text-blue-800' :
                          item.category === 'dessert' ? 'bg-pink-100 text-pink-800' :
                          item.category === 'beverage' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {item.category}
                        </span>
                        <span className="text-sm font-medium text-gray-900">${item.price}</span>
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMenuItem(item.id)}
                      className="text-red-500 hover:text-red-700 ml-3"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="sr-only"
              />
              <div className={`relative w-10 h-6 rounded-full transition-colors ${formData.isActive ? 'bg-slate-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
              <span className="ml-3 text-sm text-gray-700">Active</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {menu ? 'Update' : 'Create'} Menu
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MenuForm;
