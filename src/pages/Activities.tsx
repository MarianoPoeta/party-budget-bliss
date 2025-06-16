
import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import Layout from '../components/Layout';
import ActivityCard from '../components/ActivityCard';
import { Activity } from '../types/Activity';

// Mock data
const mockActivities: Activity[] = [
  {
    id: '1',
    name: 'Go-Karting Championship',
    description: 'High-speed go-kart racing with professional timing and prizes for winners',
    basePrice: 85,
    duration: 2,
    maxCapacity: 20,
    category: 'adventure',
    transportRequired: true,
    transportCost: 25,
    location: 'SpeedZone Racing',
    isActive: true,
  },
  {
    id: '2',
    name: 'Paintball Battle',
    description: 'Military-style paintball combat with multiple game modes and equipment included',
    basePrice: 65,
    duration: 3,
    maxCapacity: 16,
    category: 'outdoor',
    transportRequired: true,
    transportCost: 30,
    location: 'Combat Zone',
    isActive: true,
  },
  {
    id: '3',
    name: 'VIP Club Experience',
    description: 'Exclusive VIP table service at premium nightclub with bottle service',
    basePrice: 150,
    duration: 4,
    maxCapacity: 12,
    category: 'nightlife',
    transportRequired: false,
    location: 'Downtown District',
    isActive: true,
  },
  {
    id: '4',
    name: 'Brewery Tour & Tasting',
    description: 'Guided tour of local craft breweries with tasting sessions and lunch',
    basePrice: 75,
    duration: 4,
    maxCapacity: 25,
    category: 'dining',
    transportRequired: true,
    transportCost: 20,
    location: 'Craft Beer District',
    isActive: true,
  },
  {
    id: '5',
    name: 'Casino Night',
    description: 'Professional casino setup with poker, blackjack, and roulette tables',
    basePrice: 120,
    duration: 5,
    maxCapacity: 30,
    category: 'indoor',
    transportRequired: false,
    location: 'Grand Casino',
    isActive: false,
  },
];

const Activities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Activity['category'] | 'all'>('all');
  const [showInactive, setShowInactive] = useState(false);

  const categories: Array<Activity['category'] | 'all'> = ['all', 'outdoor', 'indoor', 'nightlife', 'dining', 'adventure', 'cultural'];

  const filteredActivities = mockActivities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || activity.category === categoryFilter;
    const matchesStatus = showInactive || activity.isActive;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Activities</h1>
            <p className="text-gray-600">Manage activities available for bachelor parties</p>
          </div>
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Plus className="h-4 w-4" />
            New Activity
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
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    categoryFilter === category
                      ? 'bg-slate-800 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
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

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              {...activity}
              onClick={() => console.log('Edit activity:', activity.id)}
            />
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No activities found matching your criteria.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Activities;
