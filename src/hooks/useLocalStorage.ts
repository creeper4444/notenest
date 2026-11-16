// The data provider owns all writes. This hook provides a safe first read so
// components never need to access localStorage during render themselves.
import { useState } from 'react';
import { loadAppData } from '../utils/storage';

export function useLocalStorage() {
  const [initialValue] = useState(loadAppData);
  return initialValue;
}
