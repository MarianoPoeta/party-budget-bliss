export type UserRole = 'admin' | 'sales' | 'logistics' | 'cook';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
} 