
import { Clock, MapPin, Users, DollarSign, Car } from 'lucide-react';
import { Activity } from '../types/Activity';

interface ActivityCardProps extends Activity {
  onClick?: () => void;
  isSelected?: boolean;
}

const ActivityCard = ({ 
  name,
  description,
  basePrice,
  duration,
  maxCapacity,
  category,
  transportRequired,
  transportCost,
  location,
  isActive,
  onClick,
  isSelected 
}: ActivityCardProps) => {
  const categoryColors = {
    outdoor: 'bg-green-100 text-green-800 border-green-200',
    indoor: 'bg-blue-100 text-blue-800 border-blue-200',
    nightlife: 'bg-purple-100 text-purple-800 border-purple-200',
    dining: 'bg-orange-100 text-orange-800 border-orange-200',
    adventure: 'bg-red-100 text-red-800 border-red-200',
    cultural: 'bg-yellow-100 text-yellow-800 border-yellow-200',
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
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${categoryColors[category]}`}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
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
          ${basePrice}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-1" />
          {duration}h
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Users className="h-4 w-4 mr-1" />
          Max {maxCapacity}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-1" />
          {location}
        </div>
      </div>

      {transportRequired && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-slate-600">
            <Car className="h-4 w-4 mr-2" />
            Transport included
          </div>
          {transportCost && (
            <span className="text-sm font-medium text-slate-700">+${transportCost}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityCard;
