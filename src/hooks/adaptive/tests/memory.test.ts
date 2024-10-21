import {renderHook} from '@testing-library/react';
import {expect, test, vi} from 'vitest';

afterEach(function () {
  // Reload hook for every test
  vi.resetModules();
});

const getMemoryStatus = (currentResult: any) => ({
  unsupported: false,
  deviceMemory: currentResult.deviceMemory,
  totalJSHeapSize: currentResult.totalJSHeapSize,
  usedJSHeapSize: currentResult.usedJSHeapSize,
  jsHeapSizeLimit: currentResult.jsHeapSizeLimit,
});

describe('useMemoryStatus', () => {
  test(`should return "true" for unsupported case`, async () => {
    const {useMemoryStatus} = await import('../memory');
    const {result} = renderHook(() => useMemoryStatus());

    expect(result.current.unsupported).toBe(true);
  });

  test('should return initialMemoryStatus for unsupported case', async () => {
    const mockInitialMemoryStatus = {
      deviceMemory: 4 as const,
    };
    const {deviceMemory} = mockInitialMemoryStatus;

    const {useMemoryStatus} = await import('../memory');
    const {result} = renderHook(() => useMemoryStatus(mockInitialMemoryStatus));

    expect(result.current.unsupported).toBe(true);
    // @ts-expect-error - deviceMemory is not supported
    expect(result.current.deviceMemory).toEqual(deviceMemory);
  });

  test('should return mockMemory status', async () => {
    const mockMemoryStatus = {
      deviceMemory: 4,
    };
    // @ts-expect-error - deviceMemory is not supported
    global.navigator.deviceMemory = mockMemoryStatus.deviceMemory;

    const {useMemoryStatus} = await import('../memory');
    const {result} = renderHook(() => useMemoryStatus());

    expect(getMemoryStatus(result.current)).toEqual({
      ...mockMemoryStatus,
      unsupported: false,
    });
  });

  test('should return mockMemory status without performance memory data', async () => {
    const mockMemoryStatus = {
      deviceMemory: 4,
    };
    // @ts-expect-error - deviceMemory is not supported
    global.navigator.deviceMemory = mockMemoryStatus.deviceMemory;
    // @ts-expect-error - performance.memory is not supported
    delete global.window.performance.memory;

    const {useMemoryStatus} = await import('../memory');
    const {result} = renderHook(() => useMemoryStatus());
    // @ts-expect-error - performance.memory is not supported
    expect(result.current.deviceMemory).toEqual(mockMemoryStatus.deviceMemory);
    expect(result.current.unsupported).toEqual(false);
  });

  test('should not return initialMemoryStatus for supported case', async () => {
    const mockMemoryStatus = {
      deviceMemory: 4,
    };
    const mockInitialMemoryStatus = {
      deviceMemory: 4 as const,
    };
    // @ts-expect-error - deviceMemory is not supported
    global.navigator.deviceMemory = mockMemoryStatus.deviceMemory;

    const {useMemoryStatus} = await import('../memory');
    const {result} = renderHook(() => useMemoryStatus(mockInitialMemoryStatus));

    expect(getMemoryStatus(result.current)).toEqual({
      ...mockMemoryStatus,
      unsupported: false,
    });
  });
});
