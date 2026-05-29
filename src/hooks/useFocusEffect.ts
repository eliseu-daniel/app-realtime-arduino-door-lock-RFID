import { useEffect, useRef } from 'react';

export function useFocusEffect(callback: () => void) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    callbackRef.current();
  }, []);
}
