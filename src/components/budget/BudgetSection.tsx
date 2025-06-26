
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';

interface BudgetSectionProps {
  title: string;
  count: number;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const BudgetSection: React.FC<BudgetSectionProps> = ({
  title,
  count,
  isOpen,
  onToggle,
  children
}) => {
  return (
    <Card className="border-slate-200">
      <CardHeader 
        className="cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
            {count > 0 && (
              <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-sm font-medium">
                {count}
              </span>
            )}
          </div>
          {isOpen ? (
            <ChevronDown className="h-5 w-5 text-slate-600" />
          ) : (
            <ChevronRight className="h-5 w-5 text-slate-600" />
          )}
        </div>
      </CardHeader>
      
      {isOpen && (
        <CardContent>
          {children}
        </CardContent>
      )}
    </Card>
  );
};

export default BudgetSection;
