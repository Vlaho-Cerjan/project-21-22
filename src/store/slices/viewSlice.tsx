import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';

export const defaultView = 'map';

export interface ViewState {
  view: 'list' | 'map';
}

const getInitialState = (): ViewState => {
  if (typeof localStorage !== 'undefined') {
    const storedView = localStorage.getItem('view') as ViewState['view'];
    return {
      view: storedView || defaultView,
    };
  }
  return {view: defaultView};
};

export const viewSlice = createSlice({
  name: 'view',
  initialState: getInitialState(),
  reducers: {
    setView: (state, action: PayloadAction<'list' | 'map'>) => {
      state.view = action.payload;
      localStorage.setItem('view', action.payload);
    },
  },
});

export const {setView} = viewSlice.actions;
export const viewReducer = viewSlice.reducer;
