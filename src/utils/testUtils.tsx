import type {RenderOptions} from '@testing-library/react';
import {render} from '@testing-library/react';
import type {PropsWithChildren} from 'react';
import React from 'react';
import {Provider} from 'react-redux';

import type {AppStore, RootState} from '../store';
import {setupStore} from '../store';
import EnumProvider from '../store/providers/enumProvider';
import {LoadingProvider} from '../store/providers/loadingProvider';
import NextAuthProvider from '../store/providers/nextAuthProvider';

// As a basic setup, import your same slice reducers

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: RootState;
  store?: AppStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {
      view: {
        view: 'list',
      },
      grid: {
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
        },
        adminOrdersGridSettings: {
          columnsSettings: [],
        },
        adminScreensGridSettings: {
          columnsSettings: [],
        },
      },
      enum: {
        enumData: null,
        venueType: null,
        inventory: null,
        status: 'pending',
      },
      _persist: {
        version: -1,
        rehydrated: true,
      },
    },
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({children}: PropsWithChildren<object>): JSX.Element {
    return (
      <Provider store={store}>
        <EnumProvider>
          <LoadingProvider>
            <NextAuthProvider>{children}</NextAuthProvider>
          </LoadingProvider>
        </EnumProvider>
      </Provider>
    );
  }

  // Return an object with the store and all of RTL's query functions
  return {store, ...render(ui, {wrapper: Wrapper, ...renderOptions})};
}
