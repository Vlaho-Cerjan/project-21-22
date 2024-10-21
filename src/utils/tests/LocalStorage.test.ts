import type {GridState} from '@/src/store/slices/gridSlice';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {loadState, saveState} from '../FakeLocalStorage';

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
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

const mockGridState: GridState = {
  screensGridSettings: {
    columnsSettings: [
      {id: '1', hidden: false, order: 1},
      {id: '2', hidden: true, order: 2},
    ],
  },
  orderGridSettings: {
    columnsSettings: [
      {id: '1', hidden: false, order: 1},
      {id: '2', hidden: true, order: 2},
    ],
  },
  venueGridSettings: {
    columnsSettings: [
      {id: '1', hidden: false, order: 1},
      {id: '2', hidden: true, order: 2},
    ],
  },
  conversionGridSettings: {
    columnsSettings: [
      {id: '1', hidden: false, order: 1},
      {id: '2', hidden: true, order: 2},
    ],
  },
  businessesGridSettings: {
    columnsSettings: [
      {id: '1', hidden: false, order: 1},
      {id: '2', hidden: true, order: 2},
    ],
  },
  adminVenuesGridSettings: {
    columnsSettings: [
      {id: '1', hidden: false, order: 1},
      {id: '2', hidden: true, order: 2},
    ],
    view: 'list',
  },
  adminOrdersGridSettings: {
    columnsSettings: [
      {id: '1', hidden: false, order: 1},
      {id: '2', hidden: true, order: 2},
    ],
  },
  adminScreensGridSettings: {
    columnsSettings: [
      {id: '1', hidden: false, order: 1},
      {id: '2', hidden: true, order: 2},
    ],
  },
};

describe('localStorageUtils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('loadState', () => {
    it('should return undefined if localStorage is empty', () => {
      expect(loadState()).toBeUndefined();
    });

    it('should return parsed state from localStorage', () => {
      localStorage.setItem('gridState', JSON.stringify(mockGridState));
      const loadedState = loadState();
      expect(loadedState).toEqual(mockGridState);
    });

    it('should return undefined if JSON parsing fails', () => {
      localStorage.setItem('gridState', 'invalid JSON');
      expect(loadState()).toBeUndefined();
    });
  });

  describe('saveState', () => {
    it('should save the state to localStorage', () => {
      saveState(mockGridState);
      const serializedState = localStorage.getItem('gridState');
      expect(serializedState).toEqual(JSON.stringify(mockGridState));
    });

    it('should handle JSON serialization errors gracefully', () => {
      // Mock JSON.stringify to throw an error
      const originalStringify = JSON.stringify;
      JSON.stringify = vi.fn(() => {
        throw new Error('Serialization error');
      });

      expect(() => saveState(mockGridState)).not.toThrow();

      // Restore original JSON.stringify
      JSON.stringify = originalStringify;
    });
  });
});
