import {useEffect, useRef} from 'react';

export default function useDidUpdateEffect(fn: () => void, inputs: any[]) {
  const isMountingRef = useRef(false);

  useEffect(() => {
    isMountingRef.current = true;
  }, []);

  useEffect(() => {
    if (!isMountingRef.current) {
      return fn();
    }
    isMountingRef.current = false;
  }, inputs);
}
