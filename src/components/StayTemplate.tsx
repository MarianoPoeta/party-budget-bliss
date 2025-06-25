
import React from 'react';
import { MapPin, Users, DollarSign, Star, Bed } from 'lucide-react';
import { StayTemplate as StayTemplateType } from '../types/Budget';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface StayTemplateProps {
  items: StayTemplateType[];
  onSelect?: (item: StayTemplateType) => void;
  editable?: boolean;
  editableItem?: StayTemplateType;
  onChange?: (updated: StayTemplateType) => void;
  onRemove?: () => void;
}

const StayTemplate: React.FC<StayTemplateProps> = ({
  items,
  onSelect,
  editable = false,
  editableItem,
  onChange,
  onRemove
}) => {
  const typeColors = {
    single: 'bg-blue-100 text-blue-800',
    double: 'bg-green-100 text-green-800',
    suite: 'bg-purple-100 text-purple-800',
    apartment: 'bg-orange-100 text-orange-800',
    villa: 'bg-red-100 text-red-800',
    hostel: 'bg-yellow-100 text-yellow-800',
  };

  if (editable && editableItem) {
    return (
      <Card className="border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">Edit Stay</CardTitle>
          {onRemove && (
            <Button variant="ghost" size="sm" onClick={onRemove}>
              Remove
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-600">Name</label>
              <Input
                value={editableItem.name}
                onChange={(e) => onChange?.({ ...editableItem, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Location</label>
              <Input
                value={editableItem.location}
                onChange={(e) => onChange?.({ ...editableItem, location: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Price per Night</label>
              <Input
                type="number"
                value={editableItem.pricePerNight}
                onChange={(e) => onChange?.({ ...editableItem, pricePerNight: Number(e.target.value) })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Max Occupancy</label>
              <Input
                type="number"
                value={editableItem.maxOccupancy}
                onChange={(e) => onChange?.({ ...editableItem, maxOccupancy: Number(e.target.value) })}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Select Stay</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((stay) => (
          <Card key={stay.id} className="hover:shadow-md transition-shadow cursor-pointer border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 mb-1">{stay.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[stay.roomType]}`}>
                    {stay.roomType.charAt(0).toUpperCase() + stay.roomType.slice(1)}
                  </span>
                </div>
                <Bed className="h-5 w-5 text-slate-400" />
              </div>
              
              <p className="text-sm text-slate-600 mb-3">{stay.description}</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4">
                <div className="flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" />
                  ${stay.pricePerNight}/night
                </div>
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  Max {stay.maxOccupancy}
                </div>
                <div className="flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  {stay.rating}/5 stars
                </div>
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {stay.location}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-1">Amenities:</p>
                <div className="flex flex-wrap gap-1">
                  {stay.amenities.slice(0, 3).map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-slate-50 text-slate-700 rounded text-xs"
                    >
                      {amenity}
                    </span>
                  ))}
                  {stay.amenities.length > 3 && (
                    <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded text-xs">
                      +{stay.amenities.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              
              <Button 
                size="sm" 
                className="w-full bg-slate-800 hover:bg-slate-700"
                onClick={() => onSelect?.(stay)}
              >
                Select Stay
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StayTemplate;
