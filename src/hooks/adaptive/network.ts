import {useEffect, useState} from 'react';
import type {NetworkInformation} from './types/networkInformation';

const useNetworkStatus = (
  initialEffectiveConnectionType: 'slow-2g' | '2g' | '3g' | '4g' | null = null,
) => {
  const data = {
    unsupported: true,
  };
  if (
    typeof navigator !== 'undefined' &&
    'connection' in navigator &&
    'effectiveType' in (navigator.connection as NetworkInformation)
  ) {
    data.unsupported = false;
  } else {
    data.unsupported = true;
  }

  const initialNetworkStatus = {
    unsupported: data.unsupported,
    effectiveConnectionType: data.unsupported
      ? initialEffectiveConnectionType
      : 'connection' in navigator &&
        (navigator.connection as NetworkInformation).effectiveType,
  };

  const [networkStatus, setNetworkStatus] = useState(initialNetworkStatus);

  useEffect(() => {
    if (!data.unsupported) {
      const navigatorConnection =
        'connection' in navigator &&
        (navigator.connection as NetworkInformation);
      if (!navigatorConnection) return;
      const updateECTStatus = () => {
        setNetworkStatus({
          unsupported: data.unsupported,
          effectiveConnectionType: navigatorConnection.effectiveType,
        });
      };
      navigatorConnection.addEventListener('change', updateECTStatus);
      return () => {
        navigatorConnection.removeEventListener('change', updateECTStatus);
      };
    }

    return () => {};
  }, []);

  return {...networkStatus, setNetworkStatus};
};

export {useNetworkStatus};
