
import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Layout from '../components/Layout';
import MenuCard from '../components/MenuCard';
import MenuForm from '../components/MenuForm';
import { Menu } from '../types/Menu';

// Mock data
const mockMenus: Menu[] = [
  {
    id: '1',
    name: 'Premium BBQ Package',
    description: 'High-quality barbecue experience with premium cuts and craft beer pairings',
    type: 'lunch',
    pricePerPerson: 85,
    minPeople: 8,
    maxPeople: 25,
    items: [
      { id: '1', name: 'Wagyu Beef Brisket', description: 'Slow-smoked for 12 hours', price: 32, category: 'main' },
      { id: '2', name: 'Craft Beer Selection', description: 'Local brewery selection', price: 12, category: 'beverage' },
      { id: '3', name: 'Smoked Wings', description: 'Bourbon glazed chicken wings', price: 18, category: 'appetizer' },
      { id: '4', name: 'Bourbon Pecan Pie', description: 'House-made dessert', price: 14, category: 'dessert' }
    ],
    restaurant: 'Smokehouse Prime',
    isActive: true,
  },
  {
    id: '2',
    name: 'Rooftop Cocktail Experience',
    description: 'Exclusive rooftop cocktail service with city views and premium spirits',
    type: 'cocktail',
    pricePerPerson: 65,
    minPeople: 6,
    maxPeople: 20,
    items: [
      { id: '5', name: 'Signature Old Fashioned', description: 'House bourbon blend', price: 16, category: 'beverage' },
      { id: '6', name: 'Gourmet Sliders', description: 'Wagyu beef mini burgers', price: 22, category: 'appetizer' },
      { id: '7', name: 'Whiskey Flight', description: 'Selection of premium whiskeys', price: 28, category: 'special' }
    ],
    restaurant: 'Sky Lounge',
    isActive: true,
  },
  {
    id: '3',
    name: 'Steakhouse Dinner',
    description: 'Classic steakhouse experience with premium cuts and wine pairings',
    type: 'dinner',
    pricePerPerson: 120,
    minPeople: 4,
    maxPeople: 16,
    items: [
      { id: '8', name: 'Dry-Aged Ribeye', description: '28-day aged prime cut', price: 58, category: 'main' },
      { id: '9', name: 'Lobster Tail', description: 'Canadian cold water lobster', price: 45, category: 'main' },
      { id: '10', name: 'Wine Pairing', description: 'Sommelier selected wines', price: 35, category: 'beverage' },
      { id: '11', name: 'Chocolate Soufflé', description: 'Made to order dessert', price: 18, category: 'dessert' }
    ],
    restaurant: 'Prime Cut Steakhouse',
    isActive: true,
  },
];

const Menus = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<Menu['type'] | 'all'>('all');
  const [showInactive, setShowInactive] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

  const types: Array<Menu['type'] | 'all'> = ['all', 'breakfast', 'lunch', 'dinner', 'brunch', 'cocktail', 'catering'];

  const filteredMenus = mockMenus.filter(menu => {
    const matchesSearch = menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         menu.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || menu.type === typeFilter;
    const matchesStatus = showInactive || menu.isActive;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleEditMenu = (menu: Menu) => {
    setEditingMenu(menu);
    setIsFormOpen(true);
  };

  const handleNewMenu = () => {
    setEditingMenu(null);
    setIsFormOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Menus</h1>
            <p className="text-gray-600">Manage dining options for bachelor parties</p>
          </div>
          <button 
            onClick={handleNewMenu}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Menu
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search menus..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              />
            </div>

            {/* Type Filter */}
            <div className="flex gap-2 flex-wrap">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    typeFilter === type
                      ? 'bg-slate-800 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Show Inactive Toggle */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                  className="sr-only"
                />
                <div className={`relative w-10 h-6 rounded-full transition-colors ${showInactive ? 'bg-slate-600' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${showInactive ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
                <span className="ml-2 text-sm text-gray-700">Show inactive</span>
              </label>
            </div>
          </div>
        </div>

        {/* Menus Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenus.map((menu) => (
            <MenuCard
              key={menu.id}
              {...menu}
              onClick={() => handleEditMenu(menu)}
            />
          ))}
        </div>

        {filteredMenus.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No menus found matching your criteria.</p>
          </div>
        )}

        <MenuForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          menu={editingMenu}
        />
      </div>
    </Layout>
  );
};

export default Menus;
