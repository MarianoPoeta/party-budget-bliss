
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

interface ResponsiveTableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface ResponsiveTableBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface ResponsiveTableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface ResponsiveTableCellProps {
  children: React.ReactNode;
  label?: string; // Mobile label
  className?: string;
  hideOnMobile?: boolean;
}

export const ResponsiveTable = ({ children, className }: ResponsiveTableProps) => {
  return (
    <div className={cn('w-full', className)}>
      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full border-collapse">
          {children}
        </table>
      </div>
      
      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {children}
      </div>
    </div>
  );
};

export const ResponsiveTableHeader = ({ children, className }: ResponsiveTableHeaderProps) => {
  return (
    <thead className={cn('hidden md:table-header-group', className)}>
      {children}
    </thead>
  );
};

export const ResponsiveTableBody = ({ children, className }: ResponsiveTableBodyProps) => {
  return (
    <tbody className={cn('md:table-row-group', className)}>
      {children}
    </tbody>
  );
};

export const ResponsiveTableRow = ({ children, className, onClick }: ResponsiveTableRowProps) => {
  const isClickable = !!onClick;
  
  return (
    <>
      {/* Desktop row */}
      <tr 
        className={cn(
          'hidden md:table-row border-b border-slate-200 hover:bg-slate-50',
          isClickable && 'cursor-pointer',
          className
        )}
        onClick={onClick}
      >
        {children}
      </tr>
      
      {/* Mobile card */}
      <Card 
        className={cn(
          'md:hidden',
          isClickable && 'cursor-pointer hover:shadow-md transition-shadow',
          className
        )}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="space-y-2">
            {children}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export const ResponsiveTableCell = ({ 
  children, 
  label, 
  className, 
  hideOnMobile = false 
}: ResponsiveTableCellProps) => {
  return (
    <>
      {/* Desktop cell */}
      <td className={cn('hidden md:table-cell px-4 py-3 text-sm', className)}>
        {children}
      </td>
      
      {/* Mobile field */}
      {!hideOnMobile && (
        <div className="md:hidden flex justify-between items-center py-1">
          {label && (
            <span className="text-sm font-medium text-slate-600 min-w-0 flex-shrink-0 mr-3">
              {label}:
            </span>
          )}
          <div className={cn('text-sm text-slate-900 text-right', className)}>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export const ResponsiveTableHeaderCell = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) => {
  return (
    <th className={cn('text-left px-4 py-3 text-sm font-semibold text-slate-900 border-b border-slate-200', className)}>
      {children}
    </th>
  );
};
