const memoryFallback: Record<string, string> = {};

export const SafeStorage = {
  get: (key: string, defaultValue: string): string => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const val = window.localStorage.getItem(key);
        return val !== null ? val : defaultValue;
      }
    } catch {
      // Ignore security errors in sandboxed iframes
    }
    return memoryFallback[key] !== undefined ? memoryFallback[key] : defaultValue;
  },
  set: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch {
      // Fallback
    }
    memoryFallback[key] = value;
  },
  remove: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch {
      // Fallback
    }
    delete memoryFallback[key];
  }
};
