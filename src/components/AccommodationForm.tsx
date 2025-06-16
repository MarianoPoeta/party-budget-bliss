
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Accommodation } from '../types/Accommodation';

interface AccommodationFormProps {
  isOpen: boolean;
  onClose: () => void;
  accommodation?: Accommodation | null;
}

const AccommodationForm = ({ isOpen, onClose, accommodation }: AccommodationFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricePerNight: 0,
    maxOccupancy: 1,
    roomType: 'double' as Accommodation['roomType'],
    amenities: [] as string[],
    location: '',
    rating: 3,
    isActive: true,
  });

  const [newAmenity, setNewAmenity] = useState('');

  useEffect(() => {
    if (accommodation) {
      setFormData({
        name: accommodation.name,
        description: accommodation.description,
        pricePerNight: accommodation.pricePerNight,
        maxOccupancy: accommodation.maxOccupancy,
        roomType: accommodation.roomType,
        amenities: [...accommodation.amenities],
        location: accommodation.location,
        rating: accommodation.rating,
        isActive: accommodation.isActive,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        pricePerNight: 0,
        maxOccupancy: 1,
        roomType: 'double',
        amenities: [],
        location: '',
        rating: 3,
        isActive: true,
      });
    }
  }, [accommodation, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(accommodation ? 'Updating accommodation:' : 'Creating accommodation:', formData);
    onClose();
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {accommodation ? 'Edit Accommodation' : 'Add New Accommodation'}
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
                placeholder="Accommodation name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Type *
              </label>
              <select
                required
                value={formData.roomType}
                onChange={(e) => setFormData(prev => ({ ...prev, roomType: e.target.value as Accommodation['roomType'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              >
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="hostel">Hostel</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Night ($) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.pricePerNight}
                onChange={(e) => setFormData(prev => ({ ...prev, pricePerNight: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Occupancy *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.maxOccupancy}
                onChange={(e) => setFormData(prev => ({ ...prev, maxOccupancy: parseInt(e.target.value) || 1 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                placeholder="Location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating (1-5 stars) *
              </label>
              <input
                type="number"
                required
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) || 3 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                placeholder="3"
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
              placeholder="Describe the accommodation..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                placeholder="Add an amenity"
              />
              <Button type="button" onClick={addAmenity} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-sm"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => removeAmenity(amenity)}
                    className="ml-2 text-slate-500 hover:text-slate-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
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
              {accommodation ? 'Update' : 'Create'} Accommodation
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AccommodationForm;
