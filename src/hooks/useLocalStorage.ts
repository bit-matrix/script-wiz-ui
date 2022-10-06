import { useState } from 'react';

export const useLocalStorageData = <T>(k: string) => {
  const value = typeof window !== 'undefined' ? localStorage.getItem(k) : null;
  const object = value !== null ? JSON.parse(value) : undefined;
  const [data, setData] = useState<T | undefined>(object);

  const getTxLocalData = (): T | undefined => {
    return data;
  };

  const setTxLocalData = (value: T) => {
    setData(value);
    localStorage.setItem(k, JSON.stringify(value));
  };

  const clearTxLocalData = () => {
    localStorage.removeItem(k);
    setData(undefined);
  };

  return { getTxLocalData, setTxLocalData, clearTxLocalData };
};
