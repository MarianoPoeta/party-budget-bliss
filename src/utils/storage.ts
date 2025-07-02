// Enhanced storage utility with caching and validation
export class EnhancedStorage {
  private prefix = 'party-budget-bliss:';
  private cache = new Map<string, { data: unknown; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private getFullKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  get<T>(key: string, defaultValue: T): T {
    const fullKey = this.getFullKey(key);
    
    // Check cache first
    const cached = this.cache.get(fullKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data as T;
    }

    try {
      const item = window.localStorage.getItem(fullKey);
      if (item === null) {
        return defaultValue;
      }

      const parsed = JSON.parse(item);
      this.cache.set(fullKey, { data: parsed, timestamp: Date.now() });
      return parsed;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  }

  set<T>(key: string, value: T): void {
    const fullKey = this.getFullKey(key);
    
    try {
      const serialized = JSON.stringify(value);
      window.localStorage.setItem(fullKey, serialized);
      this.cache.set(fullKey, { data: value, timestamp: Date.now() });
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      throw new Error(`Failed to save data for key: ${key}`);
    }
  }

  remove(key: string): void {
    const fullKey = this.getFullKey(key);
    
    try {
      window.localStorage.removeItem(fullKey);
      this.cache.delete(fullKey);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(window.localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          window.localStorage.removeItem(key);
        }
      });
      this.cache.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  has(key: string): boolean {
    const fullKey = this.getFullKey(key);
    return this.cache.has(fullKey) || window.localStorage.getItem(fullKey) !== null;
  }

  clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.cacheTimeout) {
        this.cache.delete(key);
      }
    }
  }

  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

// Export enhanced storage instance
export const enhancedStorage = new EnhancedStorage();

// Legacy export for backward compatibility
export const localStorage = {
  get: <T>(key: string, defaultValue: T): T => enhancedStorage.get(key, defaultValue),
  set: <T>(key: string, value: T): void => enhancedStorage.set(key, value),
  remove: (key: string): void => enhancedStorage.remove(key),
  clear: (): void => enhancedStorage.clear()
}; 