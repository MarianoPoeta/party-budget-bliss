import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { mockUsers } from '../mock/mockUsers';
import { Button } from '../components/ui/button';
import { Shield, DollarSign, Truck, UtensilsCrossed, Sparkles, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/card';
import { LoadingSpinner } from '../components/LoadingSpinner';

const roleIcons = {
  admin: Shield,
  sales: DollarSign,
  logistics: Truck,
  cook: UtensilsCrossed,
};

const roleColors = {
  admin: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
  sales: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
  logistics: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
  cook: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
};

const roleDescriptions = {
  admin: 'Acceso completo al sistema y configuración',
  sales: 'Gestión de presupuestos y coordinación con clientes',
  logistics: 'Planificación de transporte y alojamiento',
  cook: 'Planificación de menús y preparación de alimentos',
};

const roleNames = {
  admin: 'Administrador',
  sales: 'Ventas',
  logistics: 'Logística',
  cook: 'Cocinero',
};

const Login: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState(mockUsers[0]);
  const [isLoading, setIsLoading] = useState(false);
  const { setCurrentUser } = useStore();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentUser(selectedUser);
    setIsLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-12 w-12 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold text-slate-800">Fiesta Presupuesto Feliz</h1>
          </div>
          <p className="text-slate-600 text-lg">
            Sistema de gestión de eventos y presupuestos
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-4 text-center">
              Selecciona tu rol para continuar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockUsers.map((user) => {
                const Icon = roleIcons[user.role];
                const isSelected = user.id === selectedUser.id;
                return (
                  <div
                    key={user.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? `${roleColors[user.role]} border-current` 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-6 w-6" />
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-slate-800">{user.name}</h3>
                        <p className="text-sm text-slate-600 capitalize">{roleNames[user.role]}</p>
                        <p className="text-xs text-slate-500 mt-1">{roleDescriptions[user.role]}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg"
            size="lg"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" text="Iniciando sesión..." />
            ) : (
              <>
                Continuar como {selectedUser.name}
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>

          <div className="text-center text-sm text-slate-500">
            <p>Demo del sistema - Selecciona cualquier rol para explorar</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login; 