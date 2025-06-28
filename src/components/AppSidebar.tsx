
import { Calendar, DollarSign, Home, MapPin, Users, UtensilsCrossed } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Budgets', href: '/budgets', icon: Calendar },
  { name: 'Activities', href: '/activities', icon: Users },
  { name: 'Accommodations', href: '/accommodations', icon: MapPin },
  { name: 'Menus', href: '/menus', icon: UtensilsCrossed },
  { name: 'Finances', href: '/finances', icon: DollarSign },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === 'collapsed';

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200">
      <SidebarHeader className="border-b border-slate-200">
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-sm">
            BP
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900">Bachelor Pro</span>
              <span className="text-xs text-slate-500">Event Manager</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={isCollapsed ? item.name : undefined}
                  >
                    <NavLink 
                      to={item.href}
                      className="flex items-center gap-3"
                      aria-label={item.name}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200">
        <div className="p-3">
          {!isCollapsed ? (
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">Bachelor Organizer</p>
              <p className="text-xs font-medium text-slate-600">v1.0</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="text-xs text-slate-500">v1.0</span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
