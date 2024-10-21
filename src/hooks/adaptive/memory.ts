type DeviceMemory = 0.25 | 0.5 | 1 | 2 | 4 | 8;

const data = {
  unsupported: true,
};

if (typeof navigator !== 'undefined' && 'deviceMemory' in navigator) {
  data.unsupported = false;
} else {
  data.unsupported = true;
}
let memoryStatus;
if (!data.unsupported) {
  memoryStatus = {
    unsupported: data.unsupported,
    deviceMemory:
      'deviceMemory' in navigator
        ? (navigator.deviceMemory as DeviceMemory)
        : null,
  };
} else {
  memoryStatus = {unsupported: data.unsupported};
}

const useMemoryStatus = (initialMemoryStatus?: {
  deviceMemory: DeviceMemory | null;
}) => {
  return data.unsupported && initialMemoryStatus
    ? {...memoryStatus, ...initialMemoryStatus}
    : {...memoryStatus};
};

export {useMemoryStatus};
