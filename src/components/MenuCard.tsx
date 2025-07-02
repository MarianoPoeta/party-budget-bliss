import { Users, DollarSign, ChefHat, MapPin, Star, Trash2 } from 'lucide-react';
import { Menu } from '../types/Menu';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface MenuCardProps extends Menu {
  onClick?: () => void;
  onDelete?: () => void;
  isSelected?: boolean;
}

const MenuCard = ({ 
  name,
  description,
  type,
  pricePerPerson,
  minPeople,
  maxPeople,
  items,
  restaurant,
  isActive,
  onClick,
  onDelete,
  isSelected 
}: MenuCardProps) => {
  const typeColors = {
    breakfast: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200',
    lunch: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200',
    dinner: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200',
    brunch: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200',
    cocktail: 'bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800 border-pink-200',
    catering: 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200',
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border-2 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group ${
        isSelected 
          ? 'border-slate-500 bg-slate-50 shadow-lg' 
          : 'border-slate-200 hover:border-slate-300 hover:scale-[1.02]'
      } ${!isActive ? 'opacity-60' : ''}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
              {name}
            </h3>
            <Badge className={`${typeColors[type]} font-medium`}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
            {!isActive && (
              <Badge variant="secondary" className="text-xs">
                Inactive
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-slate-100 transition-colors">
            <ChefHat className="h-5 w-5 text-slate-600" />
          </div>
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-600 mb-4 line-clamp-2">{description}</p>

      {/* Restaurant Info */}
      <div className="flex items-center gap-2 mb-4 text-sm text-slate-500">
        <MapPin className="h-4 w-4" />
        <span className="font-medium">{restaurant}</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 rounded-lg p-3 group-hover:bg-slate-100 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-slate-700">Per Person</span>
          </div>
          <p className="text-lg font-bold text-green-600">${pricePerPerson}</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-3 group-hover:bg-slate-100 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Capacity</span>
          </div>
          <p className="text-lg font-bold text-blue-600">{minPeople}-{maxPeople}</p>
        </div>
      </div>

      {/* Menu Items Preview */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <ChefHat className="h-4 w-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">{items.length} items</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.slice(0, 3).map((item) => (
            <Badge key={item.id} variant="outline" className="text-xs">
              {item.name}
            </Badge>
          ))}
          {items.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{items.length - 3} more
            </Badge>
          )}
        </div>
      </div>

      {/* Value Indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1 text-amber-600">
          <Star className="h-4 w-4 fill-current" />
          <span className="text-sm font-medium">Premium Quality</span>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Last updated</p>
          <p className="text-sm font-medium text-slate-700">Recently</p>
        </div>
      </div>

      {/* Action Button */}
      <Button 
        size="lg"
        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium group-hover:bg-slate-700 transition-colors"
      >
        View Details
      </Button>
    </div>
  );
};

export default MenuCard;
