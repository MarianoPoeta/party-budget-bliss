import { ReactNode, Suspense } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { EnhancedAppSidebar } from './EnhancedAppSidebar';
import { BreadcrumbNav } from './BreadcrumbNav';
import { SkipLink } from './ui/skip-link';
import { useStore } from '../store';
import { LoadingSpinner } from './LoadingSpinner';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const currentUser = useStore(s => s.currentUser);
  
  return (
    <>
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-slate-50/30">
          {currentUser && <EnhancedAppSidebar />}
          <SidebarInset className="flex-1 min-w-0 flex flex-col">
            {/* Sticky header with better visual hierarchy */}
            <header className="flex h-16 items-center gap-4 border-b border-slate-200/60 px-4 sm:px-6 bg-white/95 backdrop-blur-sm sticky top-0 z-30 shadow-sm">
              {/* Sidebar toggle button */}
              {currentUser && (
                <SidebarTrigger 
                  className="h-9 w-9 -ml-2 hover:bg-slate-100 rounded-lg transition-colors duration-200" 
                  aria-label="Toggle sidebar"
                />
              )}
              
              {/* App branding */}
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg tracking-wide text-slate-800">Magnus</span>
                <div className="h-4 w-px bg-slate-300"></div>
                <span className="text-sm text-slate-500 hidden sm:block">Event Management System</span>
              </div>
              
              <div className="flex-1" />
              
              {/* User info placeholder */}
              <div className="flex items-center gap-3">
                {currentUser && (
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium text-slate-700">{currentUser.name}</div>
                    <div className="text-xs text-slate-500 capitalize">{currentUser.role}</div>
                  </div>
                )}
              </div>
            </header>

            {/* Main content area with proper spacing */}
            <main 
              id="main-content" 
              className="flex-1 min-w-0"
              tabIndex={-1}
            >
              <div className="px-4 sm:px-6 py-6">
                <Suspense fallback={<LoadingSpinner text="Loading..." />}>
                  <BreadcrumbNav />
                  <div className="mt-6">
                    {children}
                  </div>
                </Suspense>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
};

export default Layout;
