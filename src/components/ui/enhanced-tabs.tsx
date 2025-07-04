import React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { CheckCircle, AlertCircle } from 'lucide-react';

const EnhancedTabs = TabsPrimitive.Root;

interface EnhancedTabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  variant?: 'default' | 'modern' | 'pills';
}

const EnhancedTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  EnhancedTabsListProps
>(({ className, variant = 'modern', ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex items-center text-muted-foreground',
      variant === 'default' && 'h-10 justify-center rounded-md bg-muted p-1',
      variant === 'modern' && 'h-auto bg-transparent border-b border-slate-200/60 gap-1 p-1 justify-start',
      variant === 'pills' && 'h-auto bg-slate-100/60 rounded-xl p-1 gap-1',
      className
    )}
    {...props}
  />
));
EnhancedTabsList.displayName = TabsPrimitive.List.displayName;

interface EnhancedTabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  icon?: React.ReactNode;
  badge?: string | number;
  status?: 'completed' | 'error' | 'active' | 'default';
  variant?: 'default' | 'modern' | 'pills';
}

const EnhancedTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  EnhancedTabsTriggerProps
>(({ className, children, icon, badge, status, variant = 'modern', ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      
      // Default variant
      variant === 'default' && 'rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      
      // Modern variant (card-like tabs)
      variant === 'modern' && cn(
        'relative flex items-center gap-3 px-6 py-4 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50/80 rounded-t-xl border-b-2 border-transparent transition-all duration-200',
        'data-[state=active]:text-blue-600 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50/50',
        'hover:scale-[1.02] hover:shadow-sm',
        status === 'completed' && 'text-green-600 data-[state=active]:text-green-700 data-[state=active]:border-green-500',
        status === 'error' && 'text-red-600 data-[state=active]:text-red-700 data-[state=active]:border-red-500'
      ),
      
      // Pills variant
      variant === 'pills' && cn(
        'rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-all duration-200',
        'data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm',
        'hover:scale-[1.02]'
      ),
      
      className
    )}
    {...props}
  >
    <div className="flex items-center gap-2">
      {/* Status icon */}
      {status === 'completed' && (
        <CheckCircle className="h-4 w-4 text-green-500" />
      )}
      {status === 'error' && (
        <AlertCircle className="h-4 w-4 text-red-500" />
      )}
      
      {/* Custom icon */}
      {icon && !status && (
        <span className="transition-transform duration-200 group-hover:scale-110">
          {icon}
        </span>
      )}
      
      {/* Tab label */}
      <span>{children}</span>
      
      {/* Badge */}
      {badge && (
        <Badge 
          variant={status === 'completed' ? 'default' : status === 'error' ? 'destructive' : 'secondary'} 
          className="ml-1 text-xs px-1.5 py-0.5"
        >
          {badge}
        </Badge>
      )}
    </div>
    
    {/* Modern variant active indicator */}
    {variant === 'modern' && (
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 transition-opacity duration-200 data-[state=active]:opacity-100" />
    )}
  </TabsPrimitive.Trigger>
));
EnhancedTabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const EnhancedTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & {
    animated?: boolean;
  }
>(({ className, animated = true, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      animated && 'data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:zoom-out-95',
      className
    )}
    {...props}
  />
));
EnhancedTabsContent.displayName = TabsPrimitive.Content.displayName;

export { 
  EnhancedTabs, 
  EnhancedTabsList, 
  EnhancedTabsTrigger, 
  EnhancedTabsContent,
  type EnhancedTabsListProps,
  type EnhancedTabsTriggerProps
}; 