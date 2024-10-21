import {act, renderHook} from '@testing-library/react';
import {expect, test} from 'vitest';
import {useNetworkStatus} from '../network';

describe('useNetworkStatus', () => {
  const map = {};

  const ectStatusListeners = {
    addEventListener: vi.fn().mockImplementation((event, callback) => {
      // @ts-expect-error - We are testing the callback function
      map[event] = callback;
    }),
    removeEventListener: vi.fn(),
  };

  afterEach(() => {
    Object.values(ectStatusListeners).forEach((listener) =>
      listener.mockClear(),
    );
  });

  /**
   * Tests that addEventListener or removeEventListener was called during the
   * lifecycle of the useEffect hook within useNetworkStatus
   */
  const testEctStatusEventListenerMethod = (method: any) => {
    expect(method).toBeCalled();
    expect(method.mock.calls[0][0]).toEqual('change');
    expect(method.mock.calls[0][1].constructor).toEqual(Function);
  };

  test(`should return "true" for unsupported case`, () => {
    const {result} = renderHook(() => useNetworkStatus());

    expect(result.current.unsupported).toBe(true);
  });

  test('should return initialEffectiveConnectionType for unsupported case', () => {
    const initialEffectiveConnectionType = '4g';

    const {result} = renderHook(() =>
      useNetworkStatus(initialEffectiveConnectionType),
    );

    expect(result.current.unsupported).toBe(true);
    expect(result.current.effectiveConnectionType).toBe(
      initialEffectiveConnectionType,
    );
  });

  test('should return 4g of effectiveConnectionType', () => {
    // @ts-expect-error - navigator.connection is not supported in JSDOM
    global.navigator.connection = {
      ...ectStatusListeners,
      effectiveType: '4g',
    };

    const {result} = renderHook(() => useNetworkStatus());

    testEctStatusEventListenerMethod(ectStatusListeners.addEventListener);
    expect(result.current.unsupported).toBe(false);
    expect(result.current.effectiveConnectionType).toEqual('4g');
  });

  test('should not return initialEffectiveConnectionType for supported case', () => {
    const initialEffectiveConnectionType = '2g';
    // @ts-expect-error - navigator.connection is not supported in JSDOM
    global.navigator.connection = {
      ...ectStatusListeners,
      effectiveType: '4g',
    };

    const {result} = renderHook(() =>
      useNetworkStatus(initialEffectiveConnectionType),
    );

    testEctStatusEventListenerMethod(ectStatusListeners.addEventListener);
    expect(result.current.unsupported).toBe(false);
    expect(result.current.effectiveConnectionType).toEqual('4g');
  });

  test('should update the effectiveConnectionType state', () => {
    const {result} = renderHook(() => useNetworkStatus());
    // @ts-expect-error - navigator.connection is not supported in JSDOM
    act(() => result.current.setNetworkStatus({effectiveConnectionType: '2g'}));

    expect(result.current.effectiveConnectionType).toEqual('2g');
  });

  test('should update the effectiveConnectionType state when navigator.connection change event', () => {
    // @ts-expect-error - navigator.connection is not supported in JSDOM
    global.navigator.connection = {
      ...ectStatusListeners,
      effectiveType: '2g',
    };

    const {result} = renderHook(() => useNetworkStatus());
    // @ts-expect-error - navigator.connection is not supported in JSDOM
    global.navigator.connection.effectiveType = '4g';
    // @ts-expect-error - navigator.connection is not supported in JSDOM
    act(() => map.change());

    expect(result.current.effectiveConnectionType).toEqual('4g');
  });

  test('should remove the listener for the navigator.connection change event on unmount', () => {
    // @ts-expect-error - navigator.connection is not supported in JSDOM
    global.navigator.connection = {
      ...ectStatusListeners,
      effectiveType: '2g',
    };

    const {unmount} = renderHook(() => useNetworkStatus());

    testEctStatusEventListenerMethod(ectStatusListeners.addEventListener);
    unmount();
    testEctStatusEventListenerMethod(ectStatusListeners.removeEventListener);
  });
});
