import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from './types/User';
import { Task } from './types/Task';
import { mockUsers } from './mock/mockUsers';
import { mockTasks } from './mock/mockTasks';
import { Activity } from './types/Activity';
import { Accommodation } from './types/Accommodation';
import { Menu } from './types/Menu';
import { Product } from './types/Product';
import { TransportTemplate } from './types/Budget';
import { mockMenus } from './mock/mockMenus';
import { mockProducts } from './mock/mockProducts';

// Development flag - set to true to enable session persistence
const isDevelopment = process.env.NODE_ENV === 'development';

export interface Notification {
  id: number;
  text: string;
  time: string;
  read?: boolean;
  role?: 'admin' | 'sales' | 'logistics' | 'cook';
}

export interface Budget {
  id: string;
  name: string;
  clientName: string;
  eventType: string;
  activities: string[];
  status: 'draft' | 'pending' | 'approved' | 'reserva' | 'rejected' | 'completed';
  eventDate: string;
  totalAmount: number;
  mealsAmount: number;
  activitiesAmount: number;
  transportAmount: number;
  accommodationAmount: number;
  guestCount: number;
  createdAt: string;
  templateId: string;
  selectedMenus?: Menu[];
  selectedAccommodations?: Accommodation[];
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export interface StoreState {
  // User Management
  users: User[];
  currentUser: User;
  setCurrentUser: (user: User) => void;
  
  // Tasks Management
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  updateTask: (task: Task) => void;
  addTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  
  // Budget Management
  budgets: Budget[];
  setBudgets: (budgets: Budget[]) => void;
  addBudget: (budget: Budget) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (budgetId: string) => void;
  
  // Activity Management
  activities: Activity[];
  setActivities: (activities: Activity[]) => void;
  addActivity: (activity: Activity) => void;
  updateActivity: (activity: Activity) => void;
  deleteActivity: (activityId: string) => void;
  
  // Accommodation Management
  accommodations: Accommodation[];
  setAccommodations: (accommodations: Accommodation[]) => void;
  addAccommodation: (accommodation: Accommodation) => void;
  updateAccommodation: (accommodation: Accommodation) => void;
  deleteAccommodation: (accommodationId: string) => void;
  
  // Menu Management
  menus: Menu[];
  setMenus: (menus: Menu[]) => void;
  addMenu: (menu: Menu) => void;
  updateMenu: (menu: Menu) => void;
  deleteMenu: (menuId: string) => void;
  
  // Product Management
  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  
  // Transport Template Management
  transportTemplates: TransportTemplate[];
  setTransportTemplates: (templates: TransportTemplate[]) => void;
  addTransportTemplate: (template: TransportTemplate) => void;
  updateTransportTemplate: (template: TransportTemplate) => void;
  deleteTransportTemplate: (templateId: string) => void;
  
  // Notification Management
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: number) => void;
  
  // Toast Management
  toasts: Toast[];
  addToast: (toast: Toast) => void;
  removeToast: (id: string) => void;
}

// Initial mock data
const initialBudgets: Budget[] = [
  {
    id: 'b1',
    name: "Martín's Bachelor Party",
    clientName: 'Martín',
    eventType: 'Bachelor Party',
    activities: ['Go-Karting', 'VIP Club'],
    status: 'completed',
    eventDate: '2024-07-13',
    totalAmount: 3200,
    mealsAmount: 1000,
    activitiesAmount: 1000,
    transportAmount: 200,
    accommodationAmount: 1000,
    guestCount: 12,
    createdAt: '2024-05-01',
    templateId: '1',
  },
  {
    id: 'b2',
    name: "Lucas's Bachelor Party",
    clientName: 'Lucas',
    eventType: 'Bachelor Party',
    activities: ['Paintball', 'Brewery Tour'],
    status: 'pending',
    eventDate: '2024-08-02',
    totalAmount: 2500,
    mealsAmount: 800,
    activitiesAmount: 800,
    transportAmount: 100,
    accommodationAmount: 900,
    guestCount: 10,
    createdAt: '2024-05-10',
    templateId: '1',
  },
];

const initialActivities: Activity[] = [
  {
    id: '1',
    name: 'Go-Karting Championship',
    description: 'High-speed go-kart racing with professional timing and prizes for winners',
    basePrice: 85,
    duration: 2,
    maxCapacity: 20,
    category: 'adventure',
    transportRequired: true,
    transportCost: 25,
    location: 'SpeedZone Racing',
    isActive: true,
  },
  {
    id: '2',
    name: 'Paintball Battle',
    description: 'Military-style paintball combat with multiple game modes and equipment included',
    basePrice: 65,
    duration: 3,
    maxCapacity: 16,
    category: 'outdoor',
    transportRequired: true,
    transportCost: 30,
    location: 'Combat Zone',
    isActive: true,
  },
  // ... existing activities ...
];

const initialAccommodations: Accommodation[] = [
  {
    id: 'a1',
    name: 'Grand Hotel',
    description: 'Luxury hotel in the city center',
    roomType: 'suite',
    pricePerNight: 250,
    maxOccupancy: 4,
    amenities: ['WiFi', 'Breakfast', 'Pool'],
    location: 'City Center',
    rating: 5,
    isActive: true,
  },
  {
    id: 'a2',
    name: 'Beachside Villa',
    description: 'Private villa with ocean view',
    roomType: 'villa',
    pricePerNight: 400,
    maxOccupancy: 8,
    amenities: ['WiFi', 'Private Beach', 'BBQ'],
    location: 'Beachfront',
    rating: 5,
    isActive: true,
  },
];

const initialProducts: Product[] = [
  {
    id: 'p1',
    name: 'Beef Ribs',
    description: 'Premium beef ribs for asado',
    category: 'meat',
    unit: 'kg',
    estimatedPrice: 25.00,
    supplier: 'Carnes Premium',
    notes: 'Order 24h in advance',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'p2',
    name: 'Charcoal',
    description: 'High-quality charcoal for grilling',
    category: 'equipment',
    unit: 'bags',
    estimatedPrice: 15.00,
    supplier: 'BBQ Supplies',
    notes: 'Get 2 bags minimum',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'p3',
    name: 'Red Wine',
    description: 'Premium red wine for dinner',
    category: 'beverages',
    unit: 'bottles',
    estimatedPrice: 18.00,
    supplier: 'Wine & Spirits',
    notes: 'Get 2 bottles per 4 people',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const initialMenus: Menu[] = mockMenus;

const initialTransportTemplates: TransportTemplate[] = [
  {
    id: 't1',
    name: 'Minivan Ejecutiva',
    description: 'Minivan de lujo para grupos pequeños',
    vehicleType: 'minivan',
    capacity: 8,
    pricePerHour: 45,
    pricePerKm: 2.5,
    includesDriver: true,
  },
  {
    id: 't2',
    name: 'Bus Turístico',
    description: 'Bus espacioso para grupos grandes',
    vehicleType: 'bus',
    capacity: 25,
    pricePerHour: 80,
    pricePerKm: 3.0,
    includesDriver: true,
  },
  {
    id: 't3',
    name: 'Limousina Premium',
    description: 'Limousina de lujo para eventos especiales',
    vehicleType: 'limousine',
    capacity: 6,
    pricePerHour: 120,
    pricePerKm: 5.0,
    includesDriver: true,
  },
];

// Enhanced store with better persistence and error handling
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // User Management
      users: mockUsers,
      currentUser: mockUsers[0],
      setCurrentUser: (user: User) => {
        set({ currentUser: user });
        // Save to sessionStorage for immediate persistence
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('currentUser', JSON.stringify(user));
        }
      },
      
      // Tasks Management
      tasks: mockTasks,
      setTasks: (tasks: Task[]) => set({ tasks }),
      updateTask: (task: Task) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === task.id ? task : t))
        }));
      },
      addTask: (task: Task) => {
        set((state) => ({ tasks: [...state.tasks, task] }));
      },
      deleteTask: (taskId: string) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== taskId)
        }));
      },
      
      // Budget Management
      budgets: initialBudgets,
      setBudgets: (budgets: Budget[]) => set({ budgets }),
      addBudget: (budget: Budget) => {
        set((state) => ({ budgets: [...state.budgets, budget] }));
      },
      updateBudget: (budget: Budget) => {
        set((state) => {
          const prevBudget = state.budgets.find((b) => b.id === budget.id);
          const statusChangedToReserva = prevBudget && prevBudget.status !== 'reserva' && budget.status === 'reserva';
          const updatedBudgets = state.budgets.map((b) => (b.id === budget.id ? budget : b));
          // Task automation
          if (statusChangedToReserva && budget.templateId) {
            try {
              const { TaskGenerator } = require('./services/taskGenerator');
              const { useTemplates } = require('./hooks/useTemplates');
              const { products } = state;
              const templates = useTemplates().templates;
              const allTemplates = [
                ...templates.meals,
                ...templates.activities,
                ...templates.transport,
                ...templates.stay
              ];
              const template = allTemplates.find(t => t.id === budget.templateId);
              if (template) {
                const result = TaskGenerator.generateTasksFromBudget(budget, template, products);
                // Add tasks
                result.logisticsTasks.forEach(state.addTask);
                result.cookTasks.forEach(state.addTask);
                // Add notifications for logistics and cook
                if (result.logisticsTasks.length > 0) {
                  state.addNotification({
                    id: Date.now(),
                    text: `Nuevas tareas de logística para la reserva de ${budget.clientName}.`,
                    time: new Date().toISOString(),
                    read: false,
                    role: 'logistics'
                  });
                }
                if (result.cookTasks.length > 0) {
                  state.addNotification({
                    id: Date.now() + 1,
                    text: `Nuevas tareas de cocina para la reserva de ${budget.clientName}.`,
                    time: new Date().toISOString(),
                    read: false,
                    role: 'cook'
                  });
                }
              }
            } catch (err) {
              console.error('Error generating tasks for reserva:', err);
            }
          }
          return { budgets: updatedBudgets };
        });
      },
      deleteBudget: (budgetId: string) => {
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== budgetId)
        }));
      },
      
      // Activity Management
      activities: initialActivities,
      setActivities: (activities: Activity[]) => set({ activities }),
      addActivity: (activity: Activity) => {
        set((state) => ({ activities: [...state.activities, activity] }));
      },
      updateActivity: (activity: Activity) => {
        set((state) => ({
          activities: state.activities.map((a) => (a.id === activity.id ? activity : a))
        }));
      },
      deleteActivity: (activityId: string) => {
        set((state) => ({
          activities: state.activities.filter((a) => a.id !== activityId)
        }));
      },
      
      // Accommodation Management
      accommodations: initialAccommodations,
      setAccommodations: (accommodations: Accommodation[]) => set({ accommodations }),
      addAccommodation: (accommodation: Accommodation) => {
        set((state) => ({ accommodations: [...state.accommodations, accommodation] }));
      },
      updateAccommodation: (accommodation: Accommodation) => {
        set((state) => ({
          accommodations: state.accommodations.map((a) => (a.id === accommodation.id ? accommodation : a))
        }));
      },
      deleteAccommodation: (accommodationId: string) => {
        set((state) => ({
          accommodations: state.accommodations.filter((a) => a.id !== accommodationId)
        }));
      },
      
      // Menu Management
      menus: initialMenus,
      setMenus: (menus: Menu[]) => set({ menus }),
      addMenu: (menu: Menu) => {
        set((state) => ({ menus: [...state.menus, menu] }));
      },
      updateMenu: (menu: Menu) => {
        set((state) => ({
          menus: state.menus.map((m) => (m.id === menu.id ? menu : m))
        }));
      },
      deleteMenu: (menuId: string) => {
        set((state) => ({
          menus: state.menus.filter((m) => m.id !== menuId)
        }));
      },
      
      // Product Management
      products: initialProducts,
      setProducts: (products: Product[]) => set({ products }),
      addProduct: (product: Product) => {
        set((state) => ({ products: [...state.products, product] }));
      },
      updateProduct: (product: Product) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === product.id ? product : p))
        }));
      },
      deleteProduct: (productId: string) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId)
        }));
      },
      
      // Transport Template Management
      transportTemplates: initialTransportTemplates,
      setTransportTemplates: (templates: TransportTemplate[]) => set({ transportTemplates: templates }),
      addTransportTemplate: (template: TransportTemplate) => {
        set((state) => ({ transportTemplates: [...state.transportTemplates, template] }));
      },
      updateTransportTemplate: (template: TransportTemplate) => {
        set((state) => ({
          transportTemplates: state.transportTemplates.map((t) => (t.id === template.id ? template : t))
        }));
      },
      deleteTransportTemplate: (templateId: string) => {
        set((state) => ({
          transportTemplates: state.transportTemplates.filter((t) => t.id !== templateId)
        }));
      },
      
      // Notification Management
      notifications: [],
      addNotification: (notification: Notification) => {
        set((state) => ({ notifications: [...state.notifications, notification] }));
      },
      markNotificationRead: (id: number) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          )
        }));
      },
      
      // Toast Management
      toasts: [],
      addToast: (toast: Toast) => {
        set((state) => ({ toasts: [...state.toasts, toast] }));
        // Auto-remove toast after duration
        setTimeout(() => {
          get().removeToast(toast.id);
        }, toast.duration || 5000);
      },
      removeToast: (id: string) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id)
        }));
      },
    }),
    {
      name: 'party-budget-bliss-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        budgets: state.budgets,
        activities: state.activities,
        accommodations: state.accommodations,
        menus: state.menus,
        products: state.products,
        transportTemplates: state.transportTemplates,
        tasks: state.tasks,
        notifications: state.notifications,
      }),
      onRehydrateStorage: () => (state) => {
        // Restore current user from sessionStorage if available
        if (typeof window !== 'undefined') {
          const savedUser = sessionStorage.getItem('currentUser');
          if (savedUser && state) {
            try {
              const user = JSON.parse(savedUser);
              state.setCurrentUser(user);
            } catch (error) {
              console.error('Error restoring user from sessionStorage:', error);
            }
          }
        }
      },
    }
  )
); 