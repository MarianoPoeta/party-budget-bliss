
import React from 'react';
import { Calendar, DollarSign, Users, Eye, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { TableCell, TableRow } from '../ui/table';

interface Budget {
  id: string;
  clientName: string;
  eventDate: string;
  totalAmount: number;
  guestCount: number;
  status: 'pending' | 'paid' | 'canceled';
  isClosed: boolean;
  paymentStatus: 'unpaid' | 'partially_paid' | 'paid';
  activities: string[];
  createdAt: string;
}

interface BudgetTableRowProps {
  budget: Budget;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const BudgetTableRow: React.FC<BudgetTableRowProps> = ({
  budget,
  onView,
  onEdit,
  onDelete
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'canceled': return 'bg-red-100 text-red-800 border-red-200';
      case 'partially_paid': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unpaid': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <TableRow className="hover:bg-slate-50">
      <TableCell>
        <div>
          <div className="font-medium">{budget.clientName}</div>
          <div className="text-sm text-slate-500">
            {budget.activities.slice(0, 2).join(', ')}
            {budget.activities.length > 2 && ` +${budget.activities.length - 2} more`}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4 text-slate-400" />
          {new Date(budget.eventDate).toLocaleDateString()}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-slate-400" />
          {budget.guestCount}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 font-medium">
          <DollarSign className="h-4 w-4 text-green-600" />
          {budget.totalAmount.toLocaleString()}
        </div>
      </TableCell>
      <TableCell>
        <Badge className={getStatusColor(budget.status)}>
          {budget.status.charAt(0).toUpperCase() + budget.status.slice(1)}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge className={getStatusColor(budget.paymentStatus)}>
          {budget.paymentStatus.replace('_', ' ').charAt(0).toUpperCase() + 
           budget.paymentStatus.replace('_', ' ').slice(1)}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={budget.isClosed ? "default" : "outline"}>
          {budget.isClosed ? 'Yes' : 'No'}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" onClick={() => onView(budget.id)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onEdit(budget.id)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDelete(budget.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default BudgetTableRow;
