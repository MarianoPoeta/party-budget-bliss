
import { MapPin, Users, DollarSign, Star, Bed } from 'lucide-react';
import { Accommodation } from '../types/Accommodation';

interface AccommodationCardProps extends Accommodation {
  onClick?: () => void;
  isSelected?: boolean;
}

const AccommodationCard = ({ 
  name,
  description,
  pricePerNight,
  maxOccupancy,
  roomType,
  amenities,
  location,
  rating,
  isActive,
  onClick,
  isSelected 
}: AccommodationCardProps) => {
  const typeColors = {
    single: 'bg-blue-100 text-blue-800 border-blue-200',
    double: 'bg-green-100 text-green-800 border-green-200',
    suite: 'bg-purple-100 text-purple-800 border-purple-200',
    apartment: 'bg-orange-100 text-orange-800 border-orange-200',
    villa: 'bg-red-100 text-red-800 border-red-200',
    hostel: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border-2 p-6 hover:shadow-md transition-all duration-200 cursor-pointer ${
        isSelected ? 'border-slate-500 bg-slate-50' : 'border-gray-200'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${typeColors[roomType]}`}>
            {roomType.charAt(0).toUpperCase() + roomType.slice(1)}
          </span>
          {!isActive && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
              Inactive
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <DollarSign className="h-4 w-4 mr-1" />
          ${pricePerNight}/night
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Users className="h-4 w-4 mr-1" />
          Max {maxOccupancy}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Star className="h-4 w-4 mr-1" />
          {rating}/5 stars
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-1" />
          {location}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs text-gray-500 mb-2">Amenities:</p>
        <div className="flex flex-wrap gap-1">
          {amenities.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-slate-50 text-slate-700 rounded text-xs"
            >
              {amenity}
            </span>
          ))}
          {amenities.length > 3 && (
            <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded text-xs">
              +{amenities.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccommodationCard;
