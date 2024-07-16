import { useEffect, useState } from "react";

export function useLocalStorage(initalState, key) {
  const [value, setValue] = useState(function () {
    const storedValues = localStorage.getItem(key);
    return storedValues ? JSON.parse(storedValues) : initalState;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);
  return [value, setValue];
}
