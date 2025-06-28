
import { ReactNode } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { BreadcrumbNav } from './BreadcrumbNav';
import { SkipLink } from './ui/skip-link';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <SidebarInset className="flex-1">
            {/* Header with trigger */}
            <header className="flex h-14 items-center gap-4 border-b border-slate-200 px-6">
              <SidebarTrigger 
                className="h-8 w-8" 
                aria-label="Toggle sidebar"
              />
              <div className="flex-1" />
            </header>

            {/* Main content */}
            <main id="main-content" className="flex-1 p-6" tabIndex={-1}>
              <BreadcrumbNav />
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
};

export default Layout;
