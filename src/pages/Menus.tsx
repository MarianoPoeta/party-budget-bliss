
import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Layout from '../components/Layout';
import MenuCard from '../components/MenuCard';
import { Menu } from '../types/Menu';

// Mock data
const mockMenus: Menu[] = [
  {
    id: '1',
    name: 'Premium Steakhouse Experience',
    description: 'Elegant 3-course dinner featuring prime cuts and fine wines',
    type: 'dinner',
    pricePerPerson: 85,
    minPeople: 6,
    maxPeople: 20,
    restaurant: 'Prime & Proper',
    isActive: true,
    items: [
      { id: '1', name: 'Wagyu Ribeye', description: 'Premium cut with truffle butter', price: 65, category: 'main' },
      { id: '2', name: 'Lobster Bisque', description: 'Rich and creamy starter', price: 18, category: 'appetizer' },
      { id: '3', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with vanilla ice cream', price: 12, category: 'dessert' },
    ],
  },
  {
    id: '2',
    name: 'BBQ Feast Package',
    description: 'All-you-can-eat BBQ with sides and craft beer selection',
    type: 'lunch',
    pricePerPerson: 45,
    minPeople: 8,
    maxPeople: 30,
    restaurant: 'Smoky Joes BBQ',
    isActive: true,
    items: [
      { id: '4', name: 'Mixed Meat Platter', description: 'Brisket, ribs, and pulled pork', price: 28, category: 'main' },
      { id: '5', name: 'Mac & Cheese', description: 'Creamy three-cheese blend', price: 8, category: 'appetizer' },
      { id: '6', name: 'Craft Beer Selection', description: 'Local brewery favorites', price: 6, category: 'beverage' },
    ],
  },
  {
    id: '3',
    name: 'Cocktail & Canapés',
    description: 'Sophisticated cocktail hour with premium spirits and hors d\'oeuvres',
    type: 'cocktail',
    pricePerPerson: 65,
    minPeople: 10,
    maxPeople: 25,
    restaurant: 'The Rooftop Bar',
    isActive: true,
    items: [
      { id: '7', name: 'Premium Cocktails', description: 'Top-shelf spirits and mixers', price: 15, category: 'beverage' },
      { id: '8', name: 'Shrimp Cocktail', description: 'Jumbo shrimp with cocktail sauce', price: 12, category: 'appetizer' },
      { id: '9', name: 'Beef Sliders', description: 'Mini wagyu burgers with truffle aioli', price: 8, category: 'special' },
    ],
  },
  {
    id: '4',
    name: 'Brunch Extravaganza',
    description: 'Weekend brunch with bottomless mimosas and breakfast classics',
    type: 'brunch',
    pricePerPerson: 55,
    minPeople: 6,
    maxPeople: 18,
    restaurant: 'Sunday Social',
    isActive: true,
    items: [
      { id: '10', name: 'Eggs Benedict', description: 'Poached eggs with hollandaise', price: 16, category: 'main' },
      { id: '11', name: 'Bottomless Mimosas', description: 'Unlimited champagne cocktails', price: 25, category: 'beverage' },
      { id: '12', name: 'French Toast', description: 'Brioche with maple syrup', price: 14, category: 'main' },
    ],
  },
];

const Menus = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<Menu['type'] | 'all'>('all');
  const [showInactive, setShowInactive] = useState(false);

  const types: Array<Menu['type'] | 'all'> = ['all', 'breakfast', 'lunch', 'dinner', 'brunch', 'cocktail', 'catering'];

  const filteredMenus = mockMenus.filter(menu => {
    const matchesSearch = menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         menu.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         menu.restaurant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || menu.type === typeFilter;
    const matchesStatus = showInactive || menu.isActive;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Menus</h1>
            <p className="text-gray-600">Manage catering and dining options for bachelor parties</p>
          </div>
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
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
                placeholder="Search menus or restaurants..."
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
              onClick={() => console.log('Edit menu:', menu.id)}
            />
          ))}
        </div>

        {filteredMenus.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No menus found matching your criteria.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Menus;
