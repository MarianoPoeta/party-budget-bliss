
import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Layout from '../components/Layout';
import AccommodationCard from '../components/AccommodationCard';
import AccommodationForm from '../components/AccommodationForm';
import { Accommodation } from '../types/Accommodation';

// Mock data
const mockAccommodations: Accommodation[] = [
  {
    id: '1',
    name: 'Luxury Downtown Hotel',
    description: 'Premium hotel in the heart of the city with rooftop bar and spa facilities',
    pricePerNight: 250,
    maxOccupancy: 4,
    roomType: 'suite',
    amenities: ['WiFi', 'Pool', 'Gym', 'Spa', 'Room Service', 'Bar'],
    location: 'Downtown District',
    rating: 5,
    isActive: true,
  },
  {
    id: '2',
    name: 'Beachfront Resort',
    description: 'Stunning oceanview resort with private beach access and water sports',
    pricePerNight: 180,
    maxOccupancy: 6,
    roomType: 'villa',
    amenities: ['Beach Access', 'Pool', 'Restaurant', 'Water Sports', 'WiFi'],
    location: 'Coastal Area',
    rating: 4,
    isActive: true,
  },
  {
    id: '3',
    name: 'Modern City Apartment',
    description: 'Spacious apartment with full kitchen and living area in trendy neighborhood',
    pricePerNight: 120,
    maxOccupancy: 8,
    roomType: 'apartment',
    amenities: ['Kitchen', 'WiFi', 'Washer/Dryer', 'Parking', 'Balcony'],
    location: 'Arts District',
    rating: 4,
    isActive: true,
  },
  {
    id: '4',
    name: 'Budget Hostel',
    description: 'Clean and comfortable hostel with shared facilities and great location',
    pricePerNight: 45,
    maxOccupancy: 12,
    roomType: 'hostel',
    amenities: ['WiFi', 'Shared Kitchen', 'Lounge', 'Lockers'],
    location: 'City Center',
    rating: 3,
    isActive: true,
  },
];

const Accommodations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState<Accommodation['roomType'] | 'all'>('all');
  const [showInactive, setShowInactive] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState<Accommodation | null>(null);

  const roomTypes: Array<Accommodation['roomType'] | 'all'> = ['all', 'single', 'double', 'suite', 'apartment', 'villa', 'hostel'];

  const filteredAccommodations = mockAccommodations.filter(accommodation => {
    const matchesSearch = accommodation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         accommodation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = roomTypeFilter === 'all' || accommodation.roomType === roomTypeFilter;
    const matchesStatus = showInactive || accommodation.isActive;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleEditAccommodation = (accommodation: Accommodation) => {
    setEditingAccommodation(accommodation);
    setIsFormOpen(true);
  };

  const handleNewAccommodation = () => {
    setEditingAccommodation(null);
    setIsFormOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Accommodations</h1>
            <p className="text-gray-600">Manage hotels and lodging for bachelor parties</p>
          </div>
          <button 
            onClick={handleNewAccommodation}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Accommodation
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
                placeholder="Search accommodations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              />
            </div>

            {/* Room Type Filter */}
            <div className="flex gap-2 flex-wrap">
              {roomTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setRoomTypeFilter(type)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    roomTypeFilter === type
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

        {/* Accommodations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAccommodations.map((accommodation) => (
            <AccommodationCard
              key={accommodation.id}
              {...accommodation}
              onClick={() => handleEditAccommodation(accommodation)}
            />
          ))}
        </div>

        {filteredAccommodations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No accommodations found matching your criteria.</p>
          </div>
        )}

        <AccommodationForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          accommodation={editingAccommodation}
        />
      </div>
    </Layout>
  );
};

export default Accommodations;
