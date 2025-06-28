
import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface BreadcrumbConfig {
  path: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const breadcrumbConfig: BreadcrumbConfig[] = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/budgets', label: 'Budgets' },
  { path: '/budgets/new', label: 'New Budget' },
  { path: '/budgets/enhanced', label: 'Budget Management' },
  { path: '/activities', label: 'Activities' },
  { path: '/accommodations', label: 'Accommodations' },
  { path: '/menus', label: 'Menus' },
  { path: '/finances', label: 'Finances' },
];

export function BreadcrumbNav() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Build breadcrumb items
  const breadcrumbItems: BreadcrumbConfig[] = [];
  let currentPath = '';

  // Always start with Dashboard for non-root paths
  if (location.pathname !== '/' && location.pathname !== '/dashboard') {
    breadcrumbItems.push({ path: '/dashboard', label: 'Dashboard', icon: Home });
  }

  // Build path segments
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Find config for this path
    const config = breadcrumbConfig.find(c => c.path === currentPath);
    if (config && currentPath !== '/dashboard') {
      breadcrumbItems.push(config);
    }
    
    // Handle dynamic routes (like /budgets/:id)
    if (!config && index === pathSegments.length - 1) {
      // Try to find parent config
      const parentPath = pathSegments.slice(0, -1).join('/');
      const parentConfig = breadcrumbConfig.find(c => c.path === `/${parentPath}`);
      
      if (parentConfig) {
        // Add a generic label for the dynamic segment
        breadcrumbItems.push({
          path: currentPath,
          label: segment.charAt(0).toUpperCase() + segment.slice(1)
        });
      }
    }
  });

  // Don't show breadcrumbs on dashboard
  if (location.pathname === '/' || location.pathname === '/dashboard') {
    return null;
  }

  return (
    <div className="mb-6">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <BreadcrumbItem key={item.path}>
              {index < breadcrumbItems.length - 1 ? (
                <>
                  <BreadcrumbLink asChild>
                    <Link 
                      to={item.path}
                      className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                </>
              ) : (
                <BreadcrumbPage className="flex items-center gap-1 font-medium text-slate-900">
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
