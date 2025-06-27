
import React from 'react';
import { Calendar, DollarSign, Users, Eye, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useSearch } from '../../hooks/useSearch';

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

interface EnhancedBudgetsTableProps {
  budgets: Budget[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const EnhancedBudgetsTable: React.FC<EnhancedBudgetsTableProps> = ({
  budgets,
  onView,
  onEdit,
  onDelete
}) => {
  const {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    filteredItems
  } = useSearch(budgets, ['clientName', 'activities']);

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

  const totalRevenue = filteredItems
    .filter(b => b.status === 'paid' || b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const pendingRevenue = filteredItems
    .filter(b => b.status === 'pending' || b.paymentStatus === 'unpaid')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-900">{filteredItems.length}</div>
            <p className="text-sm text-slate-600">Total Budgets</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div>
            <p className="text-sm text-slate-600">Confirmed Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">${pendingRevenue.toLocaleString()}</div>
            <p className="text-sm text-slate-600">Pending Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {filteredItems.filter(b => b.isClosed).length}
            </div>
            <p className="text-sm text-slate-600">Closed Budgets</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search by client name or activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) => updateFilter('status', value === 'all' ? null : value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.paymentStatus || 'all'}
                onValueChange={(value) => updateFilter('paymentStatus', value === 'all' ? null : value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partially_paid">Partially Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.isClosed?.toString() || 'all'}
                onValueChange={(value) => updateFilter('isClosed', value === 'all' ? null : value === 'true')}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Closed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">Closed</SelectItem>
                  <SelectItem value="false">Open</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={clearFilters}>
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Table */}
      <Card>
        <CardHeader>
          <CardTitle>Budgets ({filteredItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Closed</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((budget) => (
                <TableRow key={budget.id} className="hover:bg-slate-50">
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedBudgetsTable;
