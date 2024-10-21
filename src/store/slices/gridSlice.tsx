// src/store/gridSlice.ts
import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';

export interface GridSettings {
  columnsSettings?: {
    id: string;
    hidden: boolean;
    order: number;
  }[];
  view?: 'card' | 'list';
}

export interface GridState {
  conversionGridSettings: GridSettings;
  orderGridSettings: GridSettings;
  venueGridSettings: GridSettings;
  screensGridSettings: GridSettings;
  businessesGridSettings: GridSettings;
  adminVenuesGridSettings: GridSettings;
  adminOrdersGridSettings: GridSettings;
  adminScreensGridSettings: GridSettings;
}

const initialState: GridState = {
  conversionGridSettings: {
    columnsSettings:
      typeof localStorage !== 'undefined'
        ? JSON.parse(localStorage.getItem('conversionColumns') || 'null') || []
        : [],
  },
  orderGridSettings: {
    columnsSettings:
      typeof localStorage !== 'undefined'
        ? JSON.parse(localStorage.getItem('orderColumns') || 'null') || []
        : [],
  },
  venueGridSettings: {
    columnsSettings:
      typeof localStorage !== 'undefined'
        ? JSON.parse(localStorage.getItem('venueColumns') || 'null') || []
        : [],
  },
  businessesGridSettings: {
    columnsSettings:
      typeof localStorage !== 'undefined'
        ? JSON.parse(localStorage.getItem('businessesColumns') || 'null') || []
        : [],
  },
  screensGridSettings: {
    columnsSettings:
      typeof localStorage !== 'undefined'
        ? JSON.parse(localStorage.getItem('screensColumns') || 'null') || []
        : [],
  },
  adminVenuesGridSettings: {
    columnsSettings:
      typeof localStorage !== 'undefined'
        ? JSON.parse(localStorage.getItem('adminVenuesColumns') || 'null') || []
        : [],
    view:
      typeof localStorage !== 'undefined'
        ? JSON.parse(localStorage.getItem('adminVenuesView') || 'null') ||
          'list'
        : 'list',
  },
  adminOrdersGridSettings: {
    columnsSettings:
      typeof localStorage !== 'undefined'
        ? JSON.parse(localStorage.getItem('adminOrderColumns') || 'null') || []
        : [],
  },
  adminScreensGridSettings: {
    columnsSettings:
      typeof localStorage !== 'undefined'
        ? JSON.parse(localStorage.getItem('adminScreensColumns') || 'null') ||
          []
        : [],
  },
};

export const gridSlice = createSlice({
  name: 'grid',
  initialState,
  reducers: {
    setGridSettings: (state, action: PayloadAction<Partial<GridState>>) => {
      if (action.payload.screensGridSettings) {
        state.screensGridSettings = action.payload.screensGridSettings;
        localStorage.setItem(
          'screensColumns',
          JSON.stringify(action.payload.screensGridSettings.columnsSettings),
        );
      }
      if (action.payload.conversionGridSettings) {
        state.conversionGridSettings = action.payload.conversionGridSettings;
        localStorage.setItem(
          'conversionColumns',
          JSON.stringify(action.payload.conversionGridSettings.columnsSettings),
        );
      }
      if (action.payload.orderGridSettings) {
        state.orderGridSettings = action.payload.orderGridSettings;
        localStorage.setItem(
          'orderColumns',
          JSON.stringify(action.payload.orderGridSettings.columnsSettings),
        );
      }
      if (action.payload.venueGridSettings) {
        state.venueGridSettings = action.payload.venueGridSettings;
        localStorage.setItem(
          'venueColumns',
          JSON.stringify(action.payload.venueGridSettings.columnsSettings),
        );
      }
      if (action.payload.businessesGridSettings) {
        state.businessesGridSettings = action.payload.businessesGridSettings;
        localStorage.setItem(
          'businessesColumns',
          JSON.stringify(action.payload.businessesGridSettings.columnsSettings),
        );
      }
      if (action.payload.adminVenuesGridSettings) {
        state.adminVenuesGridSettings = action.payload.adminVenuesGridSettings;
        if (action.payload.adminVenuesGridSettings.columnsSettings) {
          localStorage.setItem(
            'adminVenuesColumns',
            JSON.stringify(
              action.payload.adminVenuesGridSettings.columnsSettings,
            ),
          );
        }
        if (action.payload.adminVenuesGridSettings.view) {
          localStorage.setItem(
            'adminVenuesView',
            JSON.stringify(action.payload.adminVenuesGridSettings.view),
          );
        }
      }
      if (action.payload.adminOrdersGridSettings) {
        state.adminOrdersGridSettings = action.payload.adminOrdersGridSettings;
        localStorage.setItem(
          'adminOrderColumns',
          JSON.stringify(
            action.payload.adminOrdersGridSettings.columnsSettings,
          ),
        );
      }
      if (action.payload.adminScreensGridSettings) {
        state.adminScreensGridSettings =
          action.payload.adminScreensGridSettings;
        localStorage.setItem(
          'adminScreensColumns',
          JSON.stringify(
            action.payload.adminScreensGridSettings.columnsSettings,
          ),
        );
      }
    },
  },
});

export const {setGridSettings} = gridSlice.actions;

export const gridReducer = gridSlice.reducer;
