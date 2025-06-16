
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Activity } from '../types/Activity';

interface ActivityFormProps {
  isOpen: boolean;
  onClose: () => void;
  activity?: Activity | null;
}

const ActivityForm = ({ isOpen, onClose, activity }: ActivityFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: 0,
    duration: 1,
    maxCapacity: 1,
    category: 'outdoor' as Activity['category'],
    transportRequired: false,
    transportCost: 0,
    location: '',
    isActive: true,
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        name: activity.name,
        description: activity.description,
        basePrice: activity.basePrice,
        duration: activity.duration,
        maxCapacity: activity.maxCapacity,
        category: activity.category,
        transportRequired: activity.transportRequired,
        transportCost: activity.transportCost || 0,
        location: activity.location,
        isActive: activity.isActive,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        basePrice: 0,
        duration: 1,
        maxCapacity: 1,
        category: 'outdoor',
        transportRequired: false,
        transportCost: 0,
        location: '',
        isActive: true,
      });
    }
  }, [activity, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(activity ? 'Updating activity:' : 'Creating activity:', formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {activity ? 'Edit Activity' : 'Add New Activity'}
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
                placeholder="Activity name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Activity['category'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              >
                <option value="outdoor">Outdoor</option>
                <option value="indoor">Indoor</option>
                <option value="nightlife">Nightlife</option>
                <option value="dining">Dining</option>
                <option value="adventure">Adventure</option>
                <option value="cultural">Cultural</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Price ($) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.basePrice}
                onChange={(e) => setFormData(prev => ({ ...prev, basePrice: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (hours) *
              </label>
              <input
                type="number"
                required
                min="0.5"
                step="0.5"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseFloat(e.target.value) || 1 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Capacity *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.maxCapacity}
                onChange={(e) => setFormData(prev => ({ ...prev, maxCapacity: parseInt(e.target.value) || 1 }))}
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
              placeholder="Describe the activity..."
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.transportRequired}
                  onChange={(e) => setFormData(prev => ({ ...prev, transportRequired: e.target.checked }))}
                  className="sr-only"
                />
                <div className={`relative w-10 h-6 rounded-full transition-colors ${formData.transportRequired ? 'bg-slate-600' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.transportRequired ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
                <span className="ml-3 text-sm text-gray-700">Transport Required</span>
              </label>
            </div>

            {formData.transportRequired && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transport Cost ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.transportCost}
                  onChange={(e) => setFormData(prev => ({ ...prev, transportCost: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  placeholder="0.00"
                />
              </div>
            )}

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
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {activity ? 'Update' : 'Create'} Activity
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityForm;
