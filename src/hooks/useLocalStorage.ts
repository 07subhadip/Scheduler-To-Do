"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // safe initial state: use the provided initial value (avoiding hydration mismatch)
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      } else {
        // If not found, persist the initial value
        const valToStore = initialValue instanceof Function ? initialValue() : initialValue;
        setStoredValue(valToStore);
        window.localStorage.setItem(key, JSON.stringify(valToStore));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Return initialValue until hydrated to prevent mismatch
  return [isHydrated ? storedValue : initialValue, setValue] as const;
}
