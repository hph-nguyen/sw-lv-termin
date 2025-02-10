import { useState } from "react";

export const useSessionStorage = (keyName, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = sessionStorage.getItem(keyName);
      if (value) {
        return JSON.parse(value);
      } else {
        sessionStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      return defaultValue;
    }
  });
  const setValue = (newValue) => {
    try {
      sessionStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {
      console.log(err);
    }
    setStoredValue(newValue);
  };
  return [storedValue, setValue];
};
