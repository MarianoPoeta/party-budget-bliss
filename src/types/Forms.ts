// Form Types - Comprehensive interfaces to replace 'any' types

import { Accommodation } from './Accommodation';
import { Menu, MenuItem } from './Menu';
import { Food } from './Food';
import { Product } from './Product';
import { TransportTemplate } from './Budget';

// Base form data interface
export interface BaseFormData {
  id?: string;
  name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Configuration form data types
export interface AccommodationFormData extends BaseFormData {
  address: string;
  costPerNight: number | string;
  pricePerNight: number | string;
  maxCapacity: number | string;
  description?: string;
  roomType?: string;
  amenities?: string[];
  location?: string;
  rating?: number;
}

export interface MenuFormData extends BaseFormData {
  selectedFoodsWithQuantity: SelectedItemWithQuantity[];
  description?: string;
  type?: 'breakfast' | 'lunch' | 'dinner' | 'brunch' | 'cocktail' | 'catering';
  pricePerPerson?: number;
  minPeople?: number;
  maxPeople?: number;
  restaurant?: string;
  items?: MenuItem[];
}

export interface FoodFormData extends BaseFormData {
  pricePerGuest: number | string;
  guestsPerUnit: number | string;
  selectedProductsWithQuantity: SelectedItemWithQuantity[];
  description?: string;
  category?: string;
  allergens?: string[];
  dietaryInfo?: string[];
  preparationTime?: number;
  supplier?: string;
}

export interface ProductFormData extends BaseFormData {
  category: string;
  cost: number | string;
  unit: string;
  description?: string;
  estimatedPrice?: number;
  supplier?: string;
  notes?: string;
}

export interface TransportFormData extends BaseFormData {
  pricePerGuest: number | string;
  costToCompany: number | string;
  type: string;
  capacity: number | string;
  vehicleType?: 'bus' | 'minivan' | 'car' | 'limousine' | 'boat';
  pricePerHour?: number;
  pricePerKm?: number;
  includesDriver?: boolean;
  description?: string;
}

// Union type for all form data
export type ConfigurationFormData = 
  | AccommodationFormData 
  | MenuFormData 
  | FoodFormData 
  | ProductFormData 
  | TransportFormData;

// Configuration item types
export type ConfigurationItem = 
  | Accommodation 
  | Menu 
  | Food 
  | Product 
  | TransportTemplate;

// Selected item with quantity interface
export interface SelectedItemWithQuantity {
  id: string;
  quantity: number;
}

// Form validation types
export interface FormValidationError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Form handler types
export type FormSubmitHandler<T = ConfigurationFormData> = (data: T) => void;
export type FormCancelHandler = () => void;
export type FormChangeHandler = (field: string, value: unknown) => void;
export type FormValidationHandler = () => FormValidationResult;

// Enhanced configuration form props
export interface EnhancedConfigurationFormProps {
  type: 'accommodation' | 'menu' | 'food' | 'product' | 'transport';
  item?: ConfigurationItem;
  onSave: FormSubmitHandler;
  onCancel: FormCancelHandler;
}

// Search and filter types for forms
export interface FormSearchFilters {
  searchTerm: string;
  categoryFilter: string;
  statusFilter: 'all' | 'active' | 'inactive';
}

// Dropdown option type
export interface SelectOption {
  value: string;
  label: string;
}

// Form field types
export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'checkbox' | 'multiselect';
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  validation?: (value: unknown) => string | null;
}

// Enhanced selector props
export interface EnhancedSelectorProps {
  items: (Food | Product)[];
  selectedItems: SelectedItemWithQuantity[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterValue: string;
  onFilterChange: (value: string) => void;
  arrayField: string;
  title: string;
  categories: string[];
  onAddItem: (itemId: string, arrayField: string) => void;
  onRemoveItem: (itemId: string, arrayField: string) => void;
  onQuantityChange: (itemId: string, quantity: number, arrayField: string) => void;
}

// Categories constants
export const FOOD_CATEGORIES = [
  'appetizer', 'main', 'dessert', 'beverage', 'special'
] as const;

export const PRODUCT_CATEGORIES = [
  'meat', 'vegetables', 'beverages', 'condiments', 'equipment', 'decorations', 'other'
] as const;

export const ACCOMMODATION_ROOM_TYPES = [
  'single', 'double', 'suite', 'apartment', 'villa', 'hostel'
] as const;

export const TRANSPORT_VEHICLE_TYPES = [
  'bus', 'minivan', 'car', 'limousine', 'boat'
] as const;

export const MENU_TYPES = [
  'breakfast', 'lunch', 'dinner', 'brunch', 'cocktail', 'catering'
] as const;

export type FoodCategory = typeof FOOD_CATEGORIES[number];
export type ProductCategory = typeof PRODUCT_CATEGORIES[number];
export type AccommodationRoomType = typeof ACCOMMODATION_ROOM_TYPES[number];
export type TransportVehicleType = typeof TRANSPORT_VEHICLE_TYPES[number];
export type MenuType = typeof MENU_TYPES[number]; 