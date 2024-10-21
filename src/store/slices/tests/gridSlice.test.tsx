import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import type {GridState} from '../gridSlice';
import {gridReducer, setGridSettings} from '../gridSlice';

describe('gridSlice reducer', () => {
  const initialState: GridState = {
    screensGridSettings: {
      columnsSettings: [],
    },
    orderGridSettings: {
      columnsSettings: [],
    },
    venueGridSettings: {
      columnsSettings: [],
    },
    conversionGridSettings: {
      columnsSettings: [],
    },
    businessesGridSettings: {
      columnsSettings: [],
    },
    adminVenuesGridSettings: {
      columnsSettings: [],
      view: 'list',
    },
    adminOrdersGridSettings: {
      columnsSettings: [],
    },
    adminScreensGridSettings: {
      columnsSettings: [],
    },
  };

  it('should handle initial state', () => {
    expect(gridReducer(undefined, {type: 'unknown'})).toEqual(initialState);
  });

  it('should handle setGridSettings', () => {
    const newSettings = {
      columnsSettings: [
        {id: 'col1', hidden: false, order: 1},
        {id: 'col2', hidden: true, order: 2},
      ],
    };

    const newState = gridReducer(
      initialState,
      setGridSettings({
        conversionGridSettings: newSettings,
      }),
    );
    expect(newState.conversionGridSettings).toEqual(newSettings);
  });
});

describe('LocalStorage interaction', () => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => (store[key] = value.toString()),
      removeItem: (key: string) => delete store[key],
      clear: () => (store = {}),
    };
  })();

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('should receive empty array for columnsSettings if localStorage is empty', () => {
    const state = gridReducer(undefined, {type: 'unknown'});
    expect(state.conversionGridSettings.columnsSettings).toEqual([]);
  });

  it('should update LocalStorage when setGridSettings is called', () => {
    const newSettings = {
      columnsSettings: [
        {id: 'col1', hidden: false, order: 1},
        {id: 'col2', hidden: true, order: 2},
      ],
    };

    gridReducer(
      undefined,
      setGridSettings({
        conversionGridSettings: newSettings,
      }),
    );
    expect(localStorage.getItem('conversionColumns')).toEqual(
      JSON.stringify(newSettings),
    );
  });
});
