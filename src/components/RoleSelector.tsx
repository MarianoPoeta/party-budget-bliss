import { Shield, DollarSign, Truck, UtensilsCrossed } from 'lucide-react';
import { Button } from './ui/button';
import { useStore } from '../store';
import { mockUsers } from '../mock/mockUsers';
import { User } from '../types/User';

const roleIcons = {
  admin: Shield,
  sales: DollarSign,
  logistics: Truck,
  cook: UtensilsCrossed,
};

const roleColors = {
  admin: 'bg-purple-50 text-purple-700 border-purple-200',
  sales: 'bg-blue-50 text-blue-700 border-blue-200',
  logistics: 'bg-green-50 text-green-700 border-green-200',
  cook: 'bg-orange-50 text-orange-700 border-orange-200',
};

const roleNames = {
  admin: 'Administrador',
  sales: 'Ventas',
  logistics: 'Logística',
  cook: 'Cocinero',
};

export const RoleSelector = () => {
  const currentUser = useStore(s => s.currentUser);
  const setCurrentUser = useStore(s => s.setCurrentUser);

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
      <span className="font-medium text-slate-700 mr-2">Ver como:</span>
      <div className="flex flex-wrap gap-2">
        {mockUsers.map(user => {
          const Icon = roleIcons[user.role];
          const isActive = user.id === currentUser.id;
          return (
            <Button
              key={user.id}
              variant={isActive ? 'default' : 'outline'}
              onClick={() => setCurrentUser(user)}
              className={`flex items-center gap-2 transition-all duration-200 ${
                isActive ? roleColors[user.role] : 'hover:bg-slate-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{user.name}</span>
              <span className="text-xs opacity-70">({roleNames[user.role]})</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}; 