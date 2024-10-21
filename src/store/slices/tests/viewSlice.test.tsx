import {configureStore} from '@reduxjs/toolkit';
import {describe, expect, it} from 'vitest';
import type {ViewState} from '../viewSlice';
import {defaultView, setView, viewReducer} from '../viewSlice';
// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    clear() {
      store = {};
    },
    removeItem(key: string) {
      delete store[key];
    },
  };
})();

let originalLocalStorage: Storage;

describe('localStorage interaction', () => {
  beforeAll(() => {
    originalLocalStorage = window.localStorage;
    (window as any).localStorage = localStorageMock;
  });

  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem('view', 'list');
  });

  afterAll(() => {
    window.localStorage = originalLocalStorage;
  });

  it('should have initial state as defaultView if localStorage is not defined', () => {
    if (window.localStorage) {
      // @ts-expect-error delete localStorage
      delete window.localStorage;
    }
    const store = configureStore({reducer: viewReducer});
    const state = store.getState() as ViewState;
    expect(window.localStorage).toBeUndefined();
    expect(state.view).toBe(defaultView);
  });
});

describe('viewSlice', () => {
  beforeAll((): void => {
    originalLocalStorage = window.localStorage;
    (window as any).localStorage = localStorageMock;
  });

  beforeEach((): void => {
    (window as any).localStorage = localStorageMock;
    localStorage.clear();
  });

  afterAll((): void => {
    (window as any).localStorage = originalLocalStorage;
  });

  it('should have initial state as defaultView if localStorage is not defined', () => {
    if (window.localStorage) {
      // @ts-expect-error delete localStorage
      delete window.localStorage;
    }
    const store = configureStore({reducer: viewReducer});
    const state = store.getState() as ViewState;
    expect(window.localStorage).toBeUndefined();
    expect(state.view).toBe(defaultView);
  });

  it('should set view to "list" and update localStorage', () => {
    const store = configureStore({reducer: viewReducer});
    store.dispatch(setView('list'));
    const state = store.getState() as ViewState;
    expect(state.view).toBe('list');
    expect(localStorage.getItem('view')).toBe('list');
  });

  it('should set view to "map" and update localStorage', () => {
    const store = configureStore({reducer: viewReducer});
    store.dispatch(setView('map'));
    const state = store.getState() as ViewState;
    expect(state.view).toBe('map');
    expect(localStorage.getItem('view')).toBe('map');
  });

  it('should handle invalid localStorage value gracefully', () => {
    localStorage.setItem('view', 'invalid');
    const store = configureStore({reducer: viewReducer});
    const state = store.getState() as ViewState;
    expect(state.view).toBe(defaultView);
  });
});
