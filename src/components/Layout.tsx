import { ReactNode, Suspense } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
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
        <div className="flex min-h-screen w-full">
          {currentUser && <AppSidebar />}
          <SidebarInset className="flex-1">
            {/* Sticky, visually distinct header (top bar) */}
            <header className="flex h-16 items-center gap-4 border-b border-slate-200 px-6 bg-white/95 backdrop-blur-sm sticky top-0 z-30 shadow-sm">
              {/* Sidebar toggle button */}
              <SidebarTrigger 
                className="h-9 w-9 -ml-2 hover:bg-slate-100 rounded-lg transition-colors duration-200" 
                aria-label="Toggle sidebar"
              />
              {/* App title or logo */}
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg tracking-wide text-slate-800">Party Budget Bliss</span>
                <div className="h-4 w-px bg-slate-300"></div>
                <span className="text-sm text-slate-500">Event Management</span>
              </div>
              <div className="flex-1" />
              {/* Placeholder for user info/actions */}
              <div className="flex items-center gap-3">
                {/* Add user avatar, notifications, etc. here if desired */}
              </div>
            </header>

            {/* Main content */}
            <main id="main-content" className="flex-1 p-6 bg-slate-50/30 min-h-[calc(100vh-4rem)]" tabIndex={-1}>
              <Suspense fallback={<LoadingSpinner />}>
                <BreadcrumbNav />
                <div className="mt-4">
                  {children}
                </div>
              </Suspense>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
};

export default Layout;
