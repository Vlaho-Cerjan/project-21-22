import type {GridState} from '../store/slices/gridSlice';

export const loadState = (): GridState | undefined => {
  try {
    const serializedState = localStorage.getItem('gridState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

export const saveState = (state: GridState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('gridState', serializedState);
  } catch {
    // Ignore write errors.
  }
};
