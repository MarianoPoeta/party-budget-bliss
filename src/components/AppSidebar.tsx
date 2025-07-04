import { Calendar, DollarSign, Home, Settings, Bell, Moon, Sun, LogOut, User, CalendarDays, CheckSquare } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState } from 'react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { useStore } from '../store';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';

// Simplified navigation - focus on core functionality
const navByRole = {
  admin: [
    { name: 'Panel Principal', href: '/dashboard', icon: Home },
    { name: 'Presupuestos', href: '/budgets', icon: Calendar },
    { name: 'Clientes', href: '/clients', icon: User },
    { name: 'Configuración', href: '/configuration', icon: Settings },
  ],
  sales: [
    { name: 'Panel Principal', href: '/dashboard', icon: Home },
    { name: 'Presupuestos', href: '/budgets', icon: Calendar },
    { name: 'Clientes', href: '/clients', icon: User },
  ],
  logistics: [
    { name: 'Panel Principal', href: '/dashboard', icon: Home },
    { name: 'Presupuestos', href: '/budgets', icon: Calendar },
    { name: 'Planificación Semanal', href: '/weekly-planning', icon: CalendarDays },
    { name: 'Mis Tareas', href: '/tasks', icon: CheckSquare },
    { name: 'Clientes', href: '/clients', icon: User },
  ],
  cook: [
    { name: 'Panel Principal', href: '/dashboard', icon: Home },
    { name: 'Presupuestos', href: '/budgets', icon: Calendar },
    { name: 'Mis Tareas', href: '/tasks', icon: CheckSquare },
    { name: 'Clientes', href: '/clients', icon: User },
  ],
};

export function AppSidebar() {
  const currentUser = useStore(s => s.currentUser);
  const setCurrentUser = useStore(s => s.setCurrentUser);
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const [showDark, setShowDark] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { notifications } = useStore();

  if (!currentUser) return null;

  const isCollapsed = state === 'collapsed';
  const navigation = navByRole[currentUser.role];
  // Only show notifications for the current user's role or global (no role specified)
  const filteredNotifications = notifications.filter(n => !n.role || n.role === currentUser.role);
  const unreadCount = filteredNotifications.filter(n => !n.read).length;

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Avatar fallback: initials
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  // Dark mode toggle (demo only)
  const handleToggleDark = () => {
    setShowDark((d) => !d);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    setIsLoading(true);
    // Simulate logout
    setTimeout(() => {
      setCurrentUser(null);
      navigate('/login');
      setIsLoading(false);
    }, 500);
  };

  const getNotificationIcon = () => {
    return 'ℹ️'; // Simple info icon for all notifications
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'sales': return 'Ventas';
      case 'logistics': return 'Logística';
      case 'cook': return 'Cocinero';
      default: return role;
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200 bg-gradient-to-b from-slate-50 to-white transition-all duration-300 shadow-lg">
      {/* User Profile Section */}
      <SidebarHeader className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-20">
        <div className="flex items-center gap-3 px-4 py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 hover:bg-slate-100 rounded-lg p-1 transition-colors">
                <Avatar className="h-10 w-10 shadow-md">
                  <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="flex flex-col flex-1 text-left">
                    <span className="text-base font-semibold text-slate-900 leading-tight">{currentUser.name}</span>
                    <span className="text-xs text-slate-500">{getRoleName(currentUser.role)}</span>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} disabled={isLoading}>
                <LogOut className="mr-2 h-4 w-4" />
                {isLoading ? 'Cerrando sesión...' : 'Cerrar sesión'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Notifications Bell */}
          <Popover open={notifOpen} onOpenChange={setNotifOpen}>
            <PopoverTrigger asChild>
              <button className="relative ml-auto p-2 rounded-full hover:bg-slate-100 transition-colors duration-200" aria-label="Mostrar notificaciones">
                <Bell className="h-5 w-5 text-slate-600" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full shadow animate-pulse">{unreadCount}</Badge>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="bg-white rounded-lg shadow-lg divide-y divide-slate-100">
                <div className="p-4 font-semibold text-slate-800 border-b flex items-center justify-between">
                  <span>Notificaciones</span>
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="text-xs">{unreadCount} nuevas</Badge>
                  )}
                </div>
                <ul className="max-h-64 overflow-y-auto">
                  {filteredNotifications.length === 0 ? (
                    <li className="p-4 text-slate-500 text-sm text-center">No hay notificaciones</li>
                  ) : filteredNotifications.map(n => (
                    <li key={n.id} className="p-4 hover:bg-slate-50 transition-colors duration-200 flex items-start gap-3">
                      <span className="text-lg">{getNotificationIcon()}</span>
                      <div className="flex-1">
                        <span className="text-slate-800 text-sm block">{n.text}</span>
                        <span className="text-xs text-slate-400">{n.time}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Navigation Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 font-semibold tracking-wide uppercase px-4 pt-4 pb-2 text-xs">Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={isCollapsed ? item.name : undefined}
                    className={`rounded-xl transition-all duration-200 px-3 py-2 my-1 mx-2 flex items-center gap-3 group hover:scale-105 ${
                      isActive(item.href) 
                        ? 'bg-blue-100/80 border-l-4 border-blue-600 shadow-sm text-blue-800 font-semibold' 
                        : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <NavLink 
                      to={item.href}
                      className="flex items-center gap-3 w-full"
                      aria-label={item.name}
                    >
                      <item.icon className={`h-5 w-5 transition-transform duration-200 ${isActive(item.href) ? 'scale-110' : 'group-hover:scale-110'}`} />
                      <span>{item.name}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer with dark mode toggle */}
      <SidebarFooter className="border-t border-slate-200 bg-gradient-to-t from-slate-50 to-white">
        <div className="p-4 flex items-center justify-between">
          {!isCollapsed ? (
            <>
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-1">Magnus</p>
                <p className="text-xs font-medium text-slate-600">v1.0</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                aria-label="Alternar modo oscuro" 
                onClick={handleToggleDark} 
                className="rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {showDark ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-slate-500" />}
              </Button>
            </>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Alternar modo oscuro" 
              onClick={handleToggleDark} 
              className="rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              {showDark ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-slate-500" />}
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
