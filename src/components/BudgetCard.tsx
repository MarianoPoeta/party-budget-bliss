
import { Calendar, DollarSign, Users } from 'lucide-react';

export type BudgetStatus = 'pending' | 'paid' | 'canceled';

interface BudgetCardProps {
  id: string;
  clientName: string;
  eventDate: string;
  totalAmount: number;
  guestCount: number;
  status: BudgetStatus;
  activities: string[];
  onClick?: () => void;
}

const BudgetCard = ({ 
  clientName, 
  eventDate, 
  totalAmount, 
  guestCount, 
  status, 
  activities,
  onClick 
}: BudgetCardProps) => {
  const statusColors = {
    pending: 'bg-orange-100 text-orange-800 border-orange-200',
    paid: 'bg-green-100 text-green-800 border-green-200',
    canceled: 'bg-red-100 text-red-800 border-red-200',
  };

  const statusLabels = {
    pending: 'Pending',
    paid: 'Paid',
    canceled: 'Canceled',
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{clientName}</h3>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Calendar className="h-4 w-4 mr-1" />
            {eventDate}
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[status]}`}>
          {statusLabels[status]}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-lg font-semibold text-gray-900">${totalAmount.toLocaleString()}</span>
        </div>
        <div className="flex items-center">
          <Users className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">{guestCount} guests</span>
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-2">Activities:</p>
        <div className="flex flex-wrap gap-1">
          {activities.slice(0, 3).map((activity, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
            >
              {activity}
            </span>
          ))}
          {activities.length > 3 && (
            <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded text-xs">
              +{activities.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
