import {renderHook} from '@testing-library/react';
import {expect, test, vi} from 'vitest';

afterEach(function () {
  // Reload hook for every test
  vi.resetModules();
});

describe('useHardwareConcurrency', () => {
  const {navigator} = window;

  afterEach(() => {
    if (!window.navigator) window.navigator = navigator;
  });

  test(`should return "true" for unsupported case`, async () => {
    Object.defineProperty(window, 'navigator', {
      value: undefined,
      configurable: true,
      writable: true,
    });

    const {useHardwareConcurrency} = await import('../hardwareConcurrency');
    const {result} = renderHook(() => useHardwareConcurrency());

    expect(result.current.unsupported).toBe(true);
  });

  test(`should return window.navigator.hardwareConcurrency`, async () => {
    const {useHardwareConcurrency} = await import('../hardwareConcurrency');
    const {result} = renderHook(() => useHardwareConcurrency());

    // @ts-expect-error - navigator.hardwareConcurrency is not supported in JSDOM
    expect(result.current.numberOfLogicalProcessors).toBe(
      window.navigator.hardwareConcurrency,
    );
    expect(result.current.unsupported).toBe(false);
  });

  test('should return 4 for device of hardwareConcurrency = 4', async () => {
    Object.defineProperty(window.navigator, 'hardwareConcurrency', {
      value: 4,
      configurable: true,
      writable: true,
    });
    const {useHardwareConcurrency} = await import('../hardwareConcurrency');
    const {result} = renderHook(() => useHardwareConcurrency());

    // @ts-expect-error - navigator.hardwareConcurrency is not supported in JSDOM
    expect(result.current.numberOfLogicalProcessors).toEqual(4);
    expect(result.current.unsupported).toBe(false);
  });

  test('should return 2 for device of hardwareConcurrency = 2', async () => {
    Object.defineProperty(window.navigator, 'hardwareConcurrency', {
      value: 2,
      configurable: true,
      writable: true,
    });
    const {useHardwareConcurrency} = await import('../hardwareConcurrency');
    const {result} = renderHook(() => useHardwareConcurrency());

    // @ts-expect-error - navigator.hardwareConcurrency is not supported in JSDOM
    expect(result.current.numberOfLogicalProcessors).toEqual(2);
    expect(result.current.unsupported).toBe(false);
  });
});
