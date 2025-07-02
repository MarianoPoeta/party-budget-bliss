import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import type { Budget } from '../store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  Download,
  MoreHorizontal
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../components/ui/dropdown-menu';
import { LoadingSpinner } from '../components/LoadingSpinner';
import Layout from '../components/Layout';
import { RoleSelector } from '../components/RoleSelector';

const Budgets = () => {
  const navigate = useNavigate();
  const { budgets, deleteBudget } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [isLoading, setIsLoading] = useState(false);

  // Filter and sort budgets
  const filteredBudgets = useMemo(() => {
    let filtered = budgets.filter(budget => {
      const matchesSearch = budget.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           budget.eventType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || budget.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort budgets
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
        case 'amount':
          return b.totalAmount - a.totalAmount;
        case 'guests':
          return b.guestCount - a.guestCount;
        case 'name':
          return a.clientName.localeCompare(b.clientName);
        default:
          return 0;
      }
    });

    return filtered;
  }, [budgets, searchTerm, statusFilter, sortBy]);

  const handleDelete = async (budgetId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este presupuesto?')) {
      setIsLoading(true);
      try {
        deleteBudget(budgetId);
        // Show success message
      } catch (error) {
        console.error('Error deleting budget:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      reserva: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      draft: '📝',
      pending: '⏳',
      approved: '✅',
      reserva: '📅',
      completed: '🎉',
      rejected: '❌'
    };
    return icons[status as keyof typeof icons] || '📝';
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const total = budgets.length;
    const completed = budgets.filter(b => b.status === 'completed').length;
    const pending = budgets.filter(b => b.status === 'pending').length;
    const totalRevenue = budgets.reduce((sum, b) => sum + b.totalAmount, 0);
    const avgGuests = budgets.length > 0 
      ? Math.round(budgets.reduce((sum, b) => sum + b.guestCount, 0) / budgets.length)
      : 0;
    const avgAmount = budgets.length > 0 
      ? Math.round(budgets.reduce((sum, b) => sum + b.totalAmount, 0) / budgets.length)
      : 0;

    return { total, completed, pending, totalRevenue, avgGuests, avgAmount };
  }, [budgets]);

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      reserva: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      draft: 'Borrador',
      pending: 'Pendiente',
      approved: 'Aprobado',
      reserva: 'Reserva',
      completed: 'Completado',
      rejected: 'Rechazado'
    };

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Presupuestos</h1>
            <p className="text-slate-600 mt-2">Gestiona y rastrea todos los presupuestos de clientes</p>
          </div>
          <Button onClick={() => navigate('/budgets/new')} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Presupuesto
          </Button>
        </div>

        {/* Role Selector */}
        <RoleSelector />

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Presupuestos</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Valor Total</p>
                  <p className="text-2xl font-bold text-slate-900">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pendientes de Aprobación</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Promedio Presupuesto</p>
                  <p className="text-2xl font-bold text-slate-900">${stats.avgAmount.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar presupuestos por nombre de cliente o tipo de evento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Estados</SelectItem>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="approved">Aprobado</SelectItem>
                  <SelectItem value="reserva">Reserva</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                  <SelectItem value="rejected">Rechazado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Fecha de Creación</SelectItem>
                  <SelectItem value="amount">Monto Total</SelectItem>
                  <SelectItem value="guests">Número de Invitados</SelectItem>
                  <SelectItem value="name">Nombre del Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Budgets List */}
        <div className="space-y-4">
          {isLoading && <LoadingSpinner text="Cargando presupuestos..." />}
          
          {filteredBudgets.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No se encontraron presupuestos</h3>
                <p className="text-slate-600 mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Intenta ajustar tu búsqueda o filtros' 
                    : 'Comienza creando tu primer presupuesto'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Button onClick={() => navigate('/budgets/new')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primer Presupuesto
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBudgets.map((budget) => (
                <Card key={budget.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-slate-900 mb-1">
                          {budget.clientName}
                        </CardTitle>
                        <CardDescription className="text-sm text-slate-600">
                          {budget.eventType} • {new Date(budget.eventDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/budgets/${budget.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/budgets/${budget.id}/edit`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar Presupuesto
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Exportar PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(budget.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Status */}
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(budget.status)}>
                          <span className="mr-1">{getStatusIcon(budget.status)}</span>
                          {budget.status === 'draft' ? 'Borrador' :
                           budget.status === 'pending' ? 'Pendiente' :
                           budget.status === 'approved' ? 'Aprobado' :
                           budget.status === 'completed' ? 'Completado' :
                           budget.status === 'rejected' ? 'Rechazado' :
                           budget.status === 'reserva' ? 'Reserva' : budget.status}
                        </Badge>
                        <span className="text-sm text-slate-500">
                          {new Date(budget.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Budget Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Monto Total:</span>
                          <div className="font-semibold text-slate-900">${budget.totalAmount.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Invitados:</span>
                          <div className="font-semibold text-slate-900">{budget.guestCount}</div>
                        </div>
                      </div>

                      {/* Budget Breakdown */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Comidas:</span>
                          <span className="font-medium">${budget.mealsAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Actividades:</span>
                          <span className="font-medium">${budget.activitiesAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Transporte:</span>
                          <span className="font-medium">${budget.transportAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Alojamiento:</span>
                          <span className="font-medium">${budget.accommodationAmount.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => navigate(`/budgets/${budget.id}`)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Ver
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => navigate(`/budgets/${budget.id}/edit`)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Budgets;
