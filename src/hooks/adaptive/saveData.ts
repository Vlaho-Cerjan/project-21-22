import type {NetworkInformation} from './types/networkInformation';

const useSaveData = (initialSaveData = null) => {
  const data = {
    unsupported: true,
  };

  if (
    typeof navigator !== 'undefined' &&
    'connection' in navigator &&
    'saveData' in (navigator.connection as NetworkInformation)
  ) {
    data.unsupported = false;
  } else {
    data.unsupported = true;
  }

  return {
    unsupported: data.unsupported,
    saveData: data.unsupported
      ? initialSaveData
      : 'connection' in navigator &&
        (navigator.connection as NetworkInformation).saveData === true,
  };
};

export {useSaveData};
