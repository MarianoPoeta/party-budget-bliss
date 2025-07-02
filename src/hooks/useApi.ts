import { useCallback, useEffect, useState } from 'react';
import { useStore } from '../store';
import { apiServices, ApiError } from '../services/api';

// Custom hook for API integration with store
export const useApi = () => {
  const store = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Error handler
  const handleError = useCallback((error: ApiError) => {
    setError(error.message);
    console.error('API Error:', error);
    
    // Handle specific error cases
    if (error.status === 401) {
      // Unauthorized - redirect to login
      store.setCurrentUser(null);
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    } else if (error.status === 403) {
      // Forbidden - show access denied message
      setError('Access denied. You do not have permission to perform this action.');
    }
  }, [store]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Authentication
  const login = useCallback(async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await apiServices.auth.login(credentials);
      const { user, token } = response.data;
      
      // Store token
      localStorage.setItem('authToken', token);
      
      // Update store
      store.setCurrentUser(user);
      
      return response.data;
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  const logout = useCallback(async () => {
    try {
      await apiServices.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local data regardless of API response
      localStorage.removeItem('authToken');
      store.setCurrentUser(null);
    }
  }, [store]);

  // Budget Management
  const loadBudgets = useCallback(async (params?: any) => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await apiServices.budgets.getBudgets(params);
      store.setBudgets(response.data.data);
      return response.data;
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  const createBudget = useCallback(async (budgetData: any) => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await apiServices.budgets.createBudget(budgetData);
      store.addBudget(response.data);
      return response.data;
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  const updateBudget = useCallback(async (id: string, budgetData: any) => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await apiServices.budgets.updateBudget(id, budgetData);
      store.updateBudget(response.data);
      return response.data;
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  const deleteBudget = useCallback(async (id: string) => {
    setIsLoading(true);
    clearError();
    
    try {
      await apiServices.budgets.deleteBudget(id);
      store.deleteBudget(id);
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  // Activity Management
  const loadActivities = useCallback(async (params?: any) => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await apiServices.activities.getActivities(params);
      store.setActivities(response.data.data);
      return response.data;
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  const createActivity = useCallback(async (activityData: any) => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await apiServices.activities.createActivity(activityData);
      store.addActivity(response.data);
      return response.data;
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  const updateActivity = useCallback(async (id: string, activityData: any) => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await apiServices.activities.updateActivity(id, activityData);
      store.updateActivity(response.data);
      return response.data;
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  const deleteActivity = useCallback(async (id: string) => {
    setIsLoading(true);
    clearError();
    
    try {
      await apiServices.activities.deleteActivity(id);
      store.deleteActivity(id);
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  // Accommodation Management
  const loadAccommodations = useCallback(async (params?: any) => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await apiServices.accommodations.getAccommodations(params);
      store.setAccommodations(response.data.data);
      return response.data;
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  const createAccommodation = useCallback(async (accommodationData: any) => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await apiServices.accommodations.createAccommodation(accommodationData);
      store.addAccommodation(response.data);
      return response.data;
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  const updateAccommodation = useCallback(async (id: string, accommodationData: any) => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await apiServices.accommodations.updateAccommodation(id, accommodationData);
      store.updateAccommodation(response.data);
      return response.data;
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  const deleteAccommodation = useCallback(async (id: string) => {
    setIsLoading(true);
    clearError();
    
    try {
      await apiServices.accommodations.deleteAccommodation(id);
      store.deleteAccommodation(id);
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  // Menu Management
  const loadMenus = useCallback(async (params?: any) => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await apiServices.menus.getMenus(params);
      store.setMenus(response.data.data);
      return response.data;
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  const createMenu = useCallback(async (menuData: any) => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await apiServices.menus.createMenu(menuData);
      store.addMenu(response.data);
      return response.data;
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  const updateMenu = useCallback(async (id: string, menuData: any) => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await apiServices.menus.updateMenu(id, menuData);
      store.updateMenu(response.data);
      return response.data;
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  const deleteMenu = useCallback(async (id: string) => {
    setIsLoading(true);
    clearError();
    
    try {
      await apiServices.menus.deleteMenu(id);
      store.deleteMenu(id);
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  // Product Management
  const loadProducts = useCallback(async (params?: any) => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await apiServices.products.getProducts(params);
      store.setProducts(response.data.data);
      return response.data;
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  const createProduct = useCallback(async (productData: any) => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await apiServices.products.createProduct(productData);
      store.addProduct(response.data);
      return response.data;
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  const updateProduct = useCallback(async (id: string, productData: any) => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await apiServices.products.updateProduct(id, productData);
      store.updateProduct(response.data);
      return response.data;
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  const deleteProduct = useCallback(async (id: string) => {
    setIsLoading(true);
    clearError();
    
    try {
      await apiServices.products.deleteProduct(id);
      store.deleteProduct(id);
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  // Transport Management
  const loadTransports = useCallback(async (params?: any) => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await apiServices.transports.getTransports(params);
      store.setTransportTemplates(response.data.data);
      return response.data;
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  const createTransport = useCallback(async (transportData: any) => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await apiServices.transports.createTransport(transportData);
      store.addTransportTemplate(response.data);
      return response.data;
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  const updateTransport = useCallback(async (id: string, transportData: any) => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await apiServices.transports.updateTransport(id, transportData);
      store.updateTransportTemplate(response.data);
      return response.data;
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  const deleteTransport = useCallback(async (id: string) => {
    setIsLoading(true);
    clearError();
    
    try {
      await apiServices.transports.deleteTransport(id);
      store.deleteTransportTemplate(id);
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  // Task Management
  const loadTasks = useCallback(async (params?: any) => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await apiServices.tasks.getTasks(params);
      store.setTasks(response.data.data);
      return response.data;
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  const createTask = useCallback(async (taskData: any) => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await apiServices.tasks.createTask(taskData);
      store.addTask(response.data);
      return response.data;
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  const updateTask = useCallback(async (id: string, taskData: any) => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await apiServices.tasks.updateTask(id, taskData);
      store.updateTask(response.data);
      return response.data;
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  const deleteTask = useCallback(async (id: string) => {
    setIsLoading(true);
    clearError();
    
    try {
      await apiServices.tasks.deleteTask(id);
      store.deleteTask(id);
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [store, handleError, clearError]);

  // Notification Management
  const loadNotifications = useCallback(async (params?: any) => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await apiServices.notifications.getNotifications(params);
      // Update notifications in store (you'll need to add this to your store)
      return response.data;
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, clearError]);

  const markNotificationAsRead = useCallback(async (id: string) => {
    try {
      await apiServices.notifications.markAsRead(id);
      store.markNotificationRead(parseInt(id));
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    }
  }, [store, handleError]);

  // Analytics
  const loadDashboardStats = useCallback(async () => {
    setIsLoading(true);
    clearError();
    
    try {
      const response = await apiServices.analytics.getDashboardStats();
      return response.data;
    } catch (error) {
      handleError(error as ApiError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, clearError]);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      if (store.currentUser) {
        try {
          // Load initial data
          await Promise.all([
            loadBudgets(),
            loadActivities(),
            loadAccommodations(),
            loadMenus(),
            loadProducts(),
            loadTransports(),
            loadTasks(),
            loadNotifications()
          ]);
        } catch (error) {
          console.error('Error initializing data:', error);
        }
      }
    };

    initializeData();
  }, [store.currentUser, loadBudgets, loadActivities, loadAccommodations, loadMenus, loadProducts, loadTransports, loadTasks, loadNotifications]);

  return {
    // State
    isLoading,
    error,
    clearError,
    
    // Authentication
    login,
    logout,
    
    // Budget Management
    loadBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    
    // Activity Management
    loadActivities,
    createActivity,
    updateActivity,
    deleteActivity,
    
    // Accommodation Management
    loadAccommodations,
    createAccommodation,
    updateAccommodation,
    deleteAccommodation,
    
    // Menu Management
    loadMenus,
    createMenu,
    updateMenu,
    deleteMenu,
    
    // Product Management
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    
    // Transport Management
    loadTransports,
    createTransport,
    updateTransport,
    deleteTransport,
    
    // Task Management
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    
    // Notification Management
    loadNotifications,
    markNotificationAsRead,
    
    // Analytics
    loadDashboardStats,
  };
}; 