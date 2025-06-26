
import React from 'react';
import { Search, Calendar } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { BudgetStatus } from '../BudgetCard';

interface BudgetsFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: BudgetStatus | 'all';
  setStatusFilter: (status: BudgetStatus | 'all') => void;
  dateRange: { start: string; end: string };
  setDateRange: (range: { start: string; end: string }) => void;
  statusCounts: {
    all: number;
    pending: number;
    paid: number;
    canceled: number;
  };
}

const BudgetsFilters: React.FC<BudgetsFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateRange,
  setDateRange,
  statusCounts
}) => {
  return (
    <Card className="border-slate-200">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Date Range */}
          <div className="flex gap-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                type="date"
                placeholder="Start date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                type="date"
                placeholder="End date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {(['all', 'pending', 'paid', 'canceled'] as const).map((status) => (
              <Button
                key={status}
                onClick={() => setStatusFilter(status)}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                className={statusFilter === status ? "bg-slate-800 hover:bg-slate-700" : ""}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetsFilters;
