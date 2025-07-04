import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from './types/User';
import { Task } from './types/Task';
import { mockUsers } from './mock/mockUsers';
import { mockTasks } from './mock/mockTasks';
import { Activity } from './types/Activity';
import { Accommodation } from './types/Accommodation';
import { Menu } from './types/Menu';
import { Food } from './types/Food';
import { Product } from './types/Product';
import { TransportTemplate } from './types/Budget';
import { Client } from './types/Client';
import { WorkflowAutomation, WorkflowTrigger } from './services/workflowAutomation';
import { mockMenus } from './mock/mockMenus';
import { mockFoodItems } from './mock/mockFoodItems';
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
  
  // Client Management
  clients: Client[];
  setClients: (clients: Client[]) => void;
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  deleteClient: (clientId: string) => void;
  findOrCreateClient: (clientData: { name: string; email: string; phone: string }) => Client;
  
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
  
  // Food Management
  foods: Food[];
  setFoods: (foods: Food[]) => void;
  addFood: (food: Food) => void;
  updateFood: (food: Food) => void;
  deleteFood: (foodId: string) => void;
  
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
const initialClients: Client[] = [
  {
    id: 'c1',
    name: 'Juan Pérez',
    email: 'juan.perez@email.com',
    phone: '+54 11 1234-5678',
    address: 'Av. Corrientes 1234, CABA',
    company: 'Eventos JP',
    taxId: '20-12345678-9',
    notes: 'Cliente VIP, prefiere eventos al aire libre',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'c2',
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    phone: '+54 11 9876-5432',
    address: 'Callao 567, CABA',
    company: '',
    taxId: '',
    notes: '',
    isActive: true,
    createdAt: '2024-02-01T14:30:00Z',
    updatedAt: '2024-02-01T14:30:00Z'
  }
];

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
    name: 'Grand Hotel Buenos Aires',
    address: 'Av. Corrientes 1234, C1043 CABA, Buenos Aires, Argentina',
    costPerNight: 180, // Cost to company
    pricePerNight: 250, // Price to client
    maxCapacity: 4,
    description: 'Hotel de lujo en el centro de la ciudad con vistas panorámicas',
    roomType: 'suite',
    maxOccupancy: 4, // Legacy field
    amenities: ['WiFi', 'Desayuno', 'Piscina', 'Spa', 'Gimnasio'],
    location: 'Centro de la Ciudad',
    rating: 5,
    isActive: true,
  },
  {
    id: 'a2',
    name: 'Villa Costera Privada',
    address: 'Ruta 11 Km 623, B7165 Villa Gesell, Provincia de Buenos Aires, Argentina',
    costPerNight: 320, // Cost to company
    pricePerNight: 400, // Price to client
    maxCapacity: 8,
    description: 'Villa privada con vista al océano y acceso directo a la playa',
    roomType: 'villa',
    maxOccupancy: 8, // Legacy field
    amenities: ['WiFi', 'Playa Privada', 'Parrilla', 'Jacuzzi', 'Estacionamiento'],
    location: 'Frente al Mar',
    rating: 5,
    isActive: true,
  },
  {
    id: 'a3',
    name: 'Hostería Boutique Palermo',
    address: 'Guatemala 4778, C1425 CABA, Buenos Aires, Argentina',
    costPerNight: 90, // Cost to company
    pricePerNight: 120, // Price to client
    maxCapacity: 2,
    description: 'Hostería boutique en el corazón de Palermo con diseño moderno',
    roomType: 'double',
    maxOccupancy: 2, // Legacy field
    amenities: ['WiFi', 'Desayuno', 'Terraza', 'Bar'],
    location: 'Palermo',
    rating: 4,
    isActive: true,
  },
];

const initialProducts: Product[] = [
  {
    id: 'p1',
    name: 'Costillas de Res Premium',
    category: 'meat',
    unit: 'kg',
    cost: 25.00, // Cost for company
    description: 'Costillas de res premium para asado argentino',
    estimatedPrice: 25.00, // Legacy field
    supplier: 'Carnes Premium',
    notes: 'Pedir con 24h de anticipación',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'p2',
    name: 'Carbón de Quebracho',
    category: 'equipment',
    unit: 'bags',
    cost: 15.00, // Cost for company
    description: 'Carbón de quebracho de alta calidad para parrilla',
    estimatedPrice: 15.00, // Legacy field
    supplier: 'Suministros BBQ',
    notes: 'Comprar mínimo 2 bolsas',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'p3',
    name: 'Vino Tinto Malbec',
    category: 'beverages',
    unit: 'bottles',
    cost: 18.00, // Cost for company
    description: 'Vino tinto Malbec premium para cena',
    estimatedPrice: 18.00, // Legacy field
    supplier: 'Vinos & Licores',
    notes: 'Comprar 2 botellas por cada 4 personas',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const initialMenus: Menu[] = mockMenus;

const initialTransportTemplates: TransportTemplate[] = [
  {
    id: 't1',
    name: 'Minivan Ejecutiva Premium',
    description: 'Minivan de lujo para grupos pequeños con chofer profesional',
    pricePerGuest: 25, // Price per guest
    costToCompany: 180, // Cost to company  
    type: 'minivan',
    capacity: 8,
    vehicleType: 'minivan', // Legacy field
    pricePerHour: 45, // Legacy field
    pricePerKm: 2.5,
    includesDriver: true,
  },
  {
    id: 't2',
    name: 'Bus Turístico Confort',
    description: 'Bus espacioso y cómodo para grupos grandes con aire acondicionado',
    pricePerGuest: 15, // Price per guest
    costToCompany: 300, // Cost to company
    type: 'bus',
    capacity: 25,
    vehicleType: 'bus', // Legacy field
    pricePerHour: 80, // Legacy field
    pricePerKm: 3.0,
    includesDriver: true,
  },
  {
    id: 't3',
    name: 'Limousina Premium VIP',
    description: 'Limousina de lujo para eventos especiales con champagne incluido',
    pricePerGuest: 45, // Price per guest
    costToCompany: 240, // Cost to company
    type: 'limousine',
    capacity: 6,
    vehicleType: 'limousine', // Legacy field
    pricePerHour: 120, // Legacy field
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
      
      // Client Management
      clients: initialClients,
      setClients: (clients: Client[]) => set({ clients }),
      addClient: (client: Client) => {
        set((state) => ({ clients: [...state.clients, client] }));
      },
      updateClient: (client: Client) => {
        set((state) => ({
          clients: state.clients.map((c) => (c.id === client.id ? client : c))
        }));
      },
      deleteClient: (clientId: string) => {
        set((state) => ({
          clients: state.clients.filter((c) => c.id !== clientId)
        }));
      },
      findOrCreateClient: (clientData: { name: string; email: string; phone: string }) => {
        const state = get();
        
        // Try to find existing client by email or phone
        let existingClient = state.clients.find(
          c => c.email.toLowerCase() === clientData.email.toLowerCase() ||
               c.phone === clientData.phone
        );
        
        if (existingClient) {
          // Update existing client with new information
          const updatedClient = {
            ...existingClient,
            name: clientData.name,
            email: clientData.email,
            phone: clientData.phone,
            updatedAt: new Date().toISOString()
          };
          state.updateClient(updatedClient);
          return updatedClient;
        } else {
          // Create new client
          const newClient: Client = {
            id: `client-${Date.now()}`,
            name: clientData.name,
            email: clientData.email,
            phone: clientData.phone,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          state.addClient(newClient);
          return newClient;
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
          
          // Enhanced workflow automation
          if (statusChangedToReserva && prevBudget) {
            const trigger: WorkflowTrigger = {
              budgetId: budget.id,
              previousStatus: prevBudget.status,
              newStatus: budget.status,
              triggerDate: new Date().toISOString()
            };

            const workflowResult = WorkflowAutomation.handleStatusChange(
              trigger,
              budget,
              state.products,
              state.menus,
              state.activities
            );

            if (workflowResult) {
              // Add generated tasks
              workflowResult.tasks.forEach(task => {
                state.addTask(task);
              });

              // Add generated notifications
              workflowResult.notifications.forEach(notification => {
                state.addNotification(notification);
              });

              // Add success toast
              state.addToast({
                id: `workflow-${Date.now()}`,
                message: `Reserva confirmada. Se generaron ${workflowResult.tasks.length} tareas automáticamente.`,
                type: 'success',
                duration: 5000
              });
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
      
      // Food Management
      foods: mockFoodItems,
      setFoods: (foods: Food[]) => set({ foods }),
      addFood: (food: Food) => {
        set((state) => ({ foods: [...state.foods, food] }));
      },
      updateFood: (food: Food) => {
        set((state) => ({
          foods: state.foods.map((f) => (f.id === food.id ? food : f))
        }));
      },
      deleteFood: (foodId: string) => {
        set((state) => ({
          foods: state.foods.filter((f) => f.id !== foodId)
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
        clients: state.clients,
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