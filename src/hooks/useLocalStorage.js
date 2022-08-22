import { useState } from 'react';

export const useLocalStorageData = (k) => {
  const value = localStorage.getItem(k);
  const object = value !== null ? JSON.parse(value) : undefined;
  const [data, setData] = useState(object);

  const getTxLocalData = () => {
    return data;
  };

  const setTxLocalData = (value) => {
    setData(value);
    localStorage.setItem(k, JSON.stringify(value));
  };

  const clearTxLocalData = () => {
    localStorage.removeItem(k);
    setData(undefined);
  };

  return { getTxLocalData, setTxLocalData, clearTxLocalData };
};
