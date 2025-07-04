import React, { useState } from 'react';
import { MoreHorizontal, Eye, Edit, Trash2, Calendar, Users, DollarSign, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { 
  ResponsiveTable, 
  ResponsiveTableHeader, 
  ResponsiveTableBody, 
  ResponsiveTableRow, 
  ResponsiveTableCell, 
  ResponsiveTableHeaderCell 
} from '../ui/responsive-table';

interface Budget {
  id: string;
  clientName: string;
  eventDate: string;
  totalAmount: number;
  guestCount: number;
  status: 'pending' | 'paid' | 'canceled' | 'draft' | 'approved' | 'completed';
  isClosed: boolean;
  paymentStatus: 'unpaid' | 'partially_paid' | 'paid';
  activities: string[];
  createdAt: string;
}

interface ResponsiveBudgetsTableProps {
  budgets: Budget[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ResponsiveBudgetsTable: React.FC<ResponsiveBudgetsTableProps> = ({
  budgets,
  onView,
  onEdit,
  onDelete
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      draft: 'bg-gray-100 text-gray-700 border-gray-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      approved: 'bg-blue-100 text-blue-700 border-blue-200',
      paid: 'bg-green-100 text-green-700 border-green-200',
      completed: 'bg-purple-100 text-purple-700 border-purple-200',
      canceled: 'bg-red-100 text-red-700 border-red-200'
    };

    const statusLabels = {
      draft: 'Borrador',
      pending: 'Pendiente',
      approved: 'Aprobado',
      paid: 'Pagado',
      completed: 'Completado',
      canceled: 'Cancelado'
    };

    return (
      <Badge 
        variant="outline" 
        className={`${statusStyles[status as keyof typeof statusStyles]} border font-medium text-xs px-2 py-1`}
      >
        {statusLabels[status as keyof typeof statusLabels] || status}
      </Badge>
    );
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const paymentStyles = {
      unpaid: 'bg-red-50 text-red-700 border-red-200',
      partially_paid: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      paid: 'bg-green-50 text-green-700 border-green-200'
    };

    const paymentLabels = {
      unpaid: 'Sin Pagar',
      partially_paid: 'Pago Parcial',
      paid: 'Pagado'
    };

    return (
      <Badge 
        variant="outline" 
        className={`${paymentStyles[paymentStatus as keyof typeof paymentStyles]} border font-medium text-xs px-2 py-1`}
      >
        {paymentLabels[paymentStatus as keyof typeof paymentLabels] || paymentStatus}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const ActionMenu = ({ budget }: { budget: Budget }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onView(budget.id)} className="gap-2">
          <Eye className="h-4 w-4" />
          Ver Detalles
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(budget.id)} className="gap-2">
          <Edit className="h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onDelete(budget.id)} 
          className="gap-2 text-red-600 focus:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Mobile Card Component
  const BudgetCard = ({ budget }: { budget: Budget }) => (
    <Card className="hover:shadow-md transition-all duration-200 border border-slate-200/60">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header with client name and actions */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">{budget.clientName}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(budget.eventDate)}</span>
              </div>
            </div>
            <ActionMenu budget={budget} />
          </div>

          {/* Status and payment badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {getStatusBadge(budget.status)}
            {getPaymentBadge(budget.paymentStatus)}
            {budget.isClosed && (
              <Badge variant="outline" className="bg-slate-100 text-slate-700">
                Cerrado
              </Badge>
            )}
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-600">Invitados</p>
                <p className="font-semibold text-slate-900">{budget.guestCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-600">Total</p>
                <p className="font-semibold text-green-600">{formatCurrency(budget.totalAmount)}</p>
              </div>
            </div>
          </div>

          {/* Activities preview */}
          {budget.activities && budget.activities.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-600 mb-2">Actividades</p>
              <div className="flex flex-wrap gap-1">
                {budget.activities.slice(0, 3).map((activity, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {activity}
                  </Badge>
                ))}
                {budget.activities.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{budget.activities.length - 3} más
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Quick action buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onView(budget.id)}
              className="flex-1 h-8 text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              Ver
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(budget.id)}
              className="flex-1 h-8 text-xs"
            >
              <Edit className="h-3 w-3 mr-1" />
              Editar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* View Toggle Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">
            {budgets.length} presupuesto{budgets.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        {/* Desktop only view toggle */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
            className="h-8 text-xs"
          >
            Tabla
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('cards')}
            className="h-8 text-xs"
          >
            Tarjetas
          </Button>
        </div>
      </div>

      {/* Desktop Table View */}
      {viewMode === 'table' && (
        <Card>
          <CardContent className="hidden md:block p-0 overflow-x-auto">
            <div className="min-w-[800px]">
              <ResponsiveTable>
                <ResponsiveTableHeader>
                  <ResponsiveTableRow>
                    <ResponsiveTableHeaderCell className="min-w-[140px]">Cliente</ResponsiveTableHeaderCell>
                    <ResponsiveTableHeaderCell className="min-w-[120px]">Fecha del Evento</ResponsiveTableHeaderCell>
                    <ResponsiveTableHeaderCell className="min-w-[80px]">Invitados</ResponsiveTableHeaderCell>
                    <ResponsiveTableHeaderCell className="min-w-[100px]">Monto Total</ResponsiveTableHeaderCell>
                    <ResponsiveTableHeaderCell className="min-w-[90px]">Estado</ResponsiveTableHeaderCell>
                    <ResponsiveTableHeaderCell className="min-w-[90px]">Pago</ResponsiveTableHeaderCell>
                    <ResponsiveTableHeaderCell className="min-w-[70px]">Cerrado</ResponsiveTableHeaderCell>
                    <ResponsiveTableHeaderCell className="min-w-[80px]">Acciones</ResponsiveTableHeaderCell>
                  </ResponsiveTableRow>
                </ResponsiveTableHeader>
                <ResponsiveTableBody>
                {budgets.map((budget) => (
                  <ResponsiveTableRow key={budget.id}>
                    <ResponsiveTableCell label="Cliente">
                      <div>
                        <p className="font-semibold text-slate-900">{budget.clientName}</p>
                        <p className="text-xs text-slate-500">ID: {budget.id.slice(-6)}</p>
                      </div>
                    </ResponsiveTableCell>
                    <ResponsiveTableCell label="Fecha">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>{formatDate(budget.eventDate)}</span>
                      </div>
                    </ResponsiveTableCell>
                    <ResponsiveTableCell label="Invitados">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">{budget.guestCount}</span>
                      </div>
                    </ResponsiveTableCell>
                    <ResponsiveTableCell label="Total">
                      <span className="font-semibold text-green-600">
                        {formatCurrency(budget.totalAmount)}
                      </span>
                    </ResponsiveTableCell>
                    <ResponsiveTableCell label="Estado">
                      {getStatusBadge(budget.status)}
                    </ResponsiveTableCell>
                    <ResponsiveTableCell label="Pago">
                      {getPaymentBadge(budget.paymentStatus)}
                    </ResponsiveTableCell>
                    <ResponsiveTableCell label="Cerrado">
                      {budget.isClosed ? (
                        <Badge variant="outline" className="bg-slate-100 text-slate-700">
                          Sí
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          No
                        </Badge>
                      )}
                    </ResponsiveTableCell>
                    <ResponsiveTableCell label="Acciones">
                      <ActionMenu budget={budget} />
                    </ResponsiveTableCell>
                  </ResponsiveTableRow>
                ))}
              </ResponsiveTableBody>
                          </ResponsiveTable>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mobile Cards View (always visible on mobile) */}
      <div className="md:hidden space-y-3">
        {budgets.map((budget) => (
          <BudgetCard key={budget.id} budget={budget} />
        ))}
      </div>

      {/* Desktop Cards View */}
      {viewMode === 'cards' && (
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
          {budgets.map((budget) => (
            <BudgetCard key={budget.id} budget={budget} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {budgets.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                <Calendar className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">No hay presupuestos</h3>
                <p className="text-slate-600 text-sm">
                  Comienza creando tu primer presupuesto de evento
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResponsiveBudgetsTable; 