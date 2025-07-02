// API Configuration and Service Layer
// This file handles all backend communication for Party Budget Bliss

// Base API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error Handling
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// HTTP Client
class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string, timeout: number) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('authToken');

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ApiError(
          response.status,
          `HTTP ${response.status}: ${response.statusText}`,
          await response.json().catch(() => null)
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, error instanceof Error ? error.message : 'Network error');
    }
  }

  // Generic HTTP methods
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_CONFIG.BASE_URL, API_CONFIG.TIMEOUT);

// Authentication Service
export const authService = {
  async login(credentials: { email: string; password: string }) {
    return apiClient.post<{ user: any; token: string }>('/auth/login', credentials);
  },

  async register(userData: { name: string; email: string; password: string; role: string }) {
    return apiClient.post<{ user: any; token: string }>('/auth/register', userData);
  },

  async logout() {
    return apiClient.post('/auth/logout');
  },

  async refreshToken() {
    return apiClient.post<{ token: string }>('/auth/refresh');
  },

  async getCurrentUser() {
    return apiClient.get<any>('/auth/me');
  },
};

// User Management Service
export const userService = {
  async getUsers(params?: { page?: number; limit?: number; role?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.role) queryParams.append('role', params.role);
    
    return apiClient.get<PaginatedResponse<any>>(`/users?${queryParams}`);
  },

  async getUserById(id: string) {
    return apiClient.get<any>(`/users/${id}`);
  },

  async updateUser(id: string, userData: Partial<any>) {
    return apiClient.put<any>(`/users/${id}`, userData);
  },

  async deleteUser(id: string) {
    return apiClient.delete(`/users/${id}`);
  },
};

// Budget Management Service
export const budgetService = {
  async getBudgets(params?: { 
    page?: number; 
    limit?: number; 
    status?: string; 
    clientName?: string;
    eventDate?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.clientName) queryParams.append('clientName', params.clientName);
    if (params?.eventDate) queryParams.append('eventDate', params.eventDate);
    
    return apiClient.get<PaginatedResponse<any>>(`/budgets?${queryParams}`);
  },

  async getBudgetById(id: string) {
    return apiClient.get<any>(`/budgets/${id}`);
  },

  async createBudget(budgetData: any) {
    return apiClient.post<any>('/budgets', budgetData);
  },

  async updateBudget(id: string, budgetData: Partial<any>) {
    return apiClient.put<any>(`/budgets/${id}`, budgetData);
  },

  async deleteBudget(id: string) {
    return apiClient.delete(`/budgets/${id}`);
  },

  async updateBudgetStatus(id: string, status: string) {
    return apiClient.patch<any>(`/budgets/${id}/status`, { status });
  },
};

// Activity Management Service
export const activityService = {
  async getActivities(params?: { 
    page?: number; 
    limit?: number; 
    category?: string; 
    isActive?: boolean;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    
    return apiClient.get<PaginatedResponse<any>>(`/activities?${queryParams}`);
  },

  async getActivityById(id: string) {
    return apiClient.get<any>(`/activities/${id}`);
  },

  async createActivity(activityData: any) {
    return apiClient.post<any>('/activities', activityData);
  },

  async updateActivity(id: string, activityData: Partial<any>) {
    return apiClient.put<any>(`/activities/${id}`, activityData);
  },

  async deleteActivity(id: string) {
    return apiClient.delete(`/activities/${id}`);
  },

  async toggleActivityStatus(id: string, isActive: boolean) {
    return apiClient.patch<any>(`/activities/${id}/status`, { isActive });
  },
};

// Accommodation Management Service
export const accommodationService = {
  async getAccommodations(params?: { 
    page?: number; 
    limit?: number; 
    roomType?: string; 
    isActive?: boolean;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.roomType) queryParams.append('roomType', params.roomType);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    
    return apiClient.get<PaginatedResponse<any>>(`/accommodations?${queryParams}`);
  },

  async getAccommodationById(id: string) {
    return apiClient.get<any>(`/accommodations/${id}`);
  },

  async createAccommodation(accommodationData: any) {
    return apiClient.post<any>('/accommodations', accommodationData);
  },

  async updateAccommodation(id: string, accommodationData: Partial<any>) {
    return apiClient.put<any>(`/accommodations/${id}`, accommodationData);
  },

  async deleteAccommodation(id: string) {
    return apiClient.delete(`/accommodations/${id}`);
  },

  async toggleAccommodationStatus(id: string, isActive: boolean) {
    return apiClient.patch<any>(`/accommodations/${id}/status`, { isActive });
  },
};

// Menu Management Service
export const menuService = {
  async getMenus(params?: { 
    page?: number; 
    limit?: number; 
    type?: string; 
    isActive?: boolean;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    
    return apiClient.get<PaginatedResponse<any>>(`/menus?${queryParams}`);
  },

  async getMenuById(id: string) {
    return apiClient.get<any>(`/menus/${id}`);
  },

  async createMenu(menuData: any) {
    return apiClient.post<any>('/menus', menuData);
  },

  async updateMenu(id: string, menuData: Partial<any>) {
    return apiClient.put<any>(`/menus/${id}`, menuData);
  },

  async deleteMenu(id: string) {
    return apiClient.delete(`/menus/${id}`);
  },

  async toggleMenuStatus(id: string, isActive: boolean) {
    return apiClient.patch<any>(`/menus/${id}/status`, { isActive });
  },
};

// Product Management Service
export const productService = {
  async getProducts(params?: { 
    page?: number; 
    limit?: number; 
    category?: string; 
    isActive?: boolean;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    
    return apiClient.get<PaginatedResponse<any>>(`/products?${queryParams}`);
  },

  async getProductById(id: string) {
    return apiClient.get<any>(`/products/${id}`);
  },

  async createProduct(productData: any) {
    return apiClient.post<any>('/products', productData);
  },

  async updateProduct(id: string, productData: Partial<any>) {
    return apiClient.put<any>(`/products/${id}`, productData);
  },

  async deleteProduct(id: string) {
    return apiClient.delete(`/products/${id}`);
  },

  async toggleProductStatus(id: string, isActive: boolean) {
    return apiClient.patch<any>(`/products/${id}/status`, { isActive });
  },
};

// Transport Management Service
export const transportService = {
  async getTransports(params?: { 
    page?: number; 
    limit?: number; 
    vehicleType?: string; 
    isActive?: boolean;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.vehicleType) queryParams.append('vehicleType', params.vehicleType);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    
    return apiClient.get<PaginatedResponse<any>>(`/transports?${queryParams}`);
  },

  async getTransportById(id: string) {
    return apiClient.get<any>(`/transports/${id}`);
  },

  async createTransport(transportData: any) {
    return apiClient.post<any>('/transports', transportData);
  },

  async updateTransport(id: string, transportData: Partial<any>) {
    return apiClient.put<any>(`/transports/${id}`, transportData);
  },

  async deleteTransport(id: string) {
    return apiClient.delete(`/transports/${id}`);
  },

  async toggleTransportStatus(id: string, isActive: boolean) {
    return apiClient.patch<any>(`/transports/${id}/status`, { isActive });
  },
};

// Task Management Service
export const taskService = {
  async getTasks(params?: { 
    page?: number; 
    limit?: number; 
    status?: string; 
    type?: string;
    assignedToRole?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.assignedToRole) queryParams.append('assignedToRole', params.assignedToRole);
    
    return apiClient.get<PaginatedResponse<any>>(`/tasks?${queryParams}`);
  },

  async getTaskById(id: string) {
    return apiClient.get<any>(`/tasks/${id}`);
  },

  async createTask(taskData: any) {
    return apiClient.post<any>('/tasks', taskData);
  },

  async updateTask(id: string, taskData: Partial<any>) {
    return apiClient.put<any>(`/tasks/${id}`, taskData);
  },

  async deleteTask(id: string) {
    return apiClient.delete(`/tasks/${id}`);
  },

  async updateTaskStatus(id: string, status: string) {
    return apiClient.patch<any>(`/tasks/${id}/status`, { status });
  },

  async assignTask(id: string, assignedTo: string) {
    return apiClient.patch<any>(`/tasks/${id}/assign`, { assignedTo });
  },
};

// Notification Service
export const notificationService = {
  async getNotifications(params?: { 
    page?: number; 
    limit?: number; 
    read?: boolean; 
    role?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.read !== undefined) queryParams.append('read', params.read.toString());
    if (params?.role) queryParams.append('role', params.role);
    
    return apiClient.get<PaginatedResponse<any>>(`/notifications?${queryParams}`);
  },

  async markAsRead(id: string) {
    return apiClient.patch<any>(`/notifications/${id}/read`);
  },

  async markAllAsRead() {
    return apiClient.patch<any>('/notifications/read-all');
  },

  async deleteNotification(id: string) {
    return apiClient.delete(`/notifications/${id}`);
  },
};

// Dashboard Analytics Service
export const analyticsService = {
  async getDashboardStats() {
    return apiClient.get<any>('/analytics/dashboard');
  },

  async getBudgetStats(params?: { startDate?: string; endDate?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    return apiClient.get<any>(`/analytics/budgets?${queryParams}`);
  },

  async getTaskStats(params?: { startDate?: string; endDate?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    return apiClient.get<any>(`/analytics/tasks?${queryParams}`);
  },

  async getRevenueStats(params?: { startDate?: string; endDate?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    return apiClient.get<any>(`/analytics/revenue?${queryParams}`);
  },
};

// Export all services
export const apiServices = {
  auth: authService,
  users: userService,
  budgets: budgetService,
  activities: activityService,
  accommodations: accommodationService,
  menus: menuService,
  products: productService,
  transports: transportService,
  tasks: taskService,
  notifications: notificationService,
  analytics: analyticsService,
}; 