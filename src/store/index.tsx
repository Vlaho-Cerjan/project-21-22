import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {persistReducer} from 'redux-persist';

import storage from './customStorage';
import {enumReducer} from './slices/enumSlice';
import {gridReducer} from './slices/gridSlice';
import {viewReducer} from './slices/viewSlice';

const combinedReducer = combineReducers({
  view: viewReducer,
  grid: gridReducer,
  enum: enumReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducers = persistReducer(persistConfig, combinedReducer);

export const configStore = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({serializableCheck: false}).concat(),
});

export const setupStore = (preloadedState?: RootState) => {
  return configureStore({
    reducer: persistReducer(persistConfig, combinedReducer),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({serializableCheck: false}).concat(),
    preloadedState,
  });
};

const store = configStore;

export default store;
export type AppStore = ReturnType<typeof setupStore>;
export type RootState = ReturnType<typeof persistedReducers>;
// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
