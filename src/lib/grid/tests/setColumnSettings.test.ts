import type {GridSettings} from '@/src/store/slices/gridSlice';
import {describe, expect, it} from 'vitest';
import {setColumnSettings} from '../setColumnSettings';

describe('setColumnSettings', () => {
  it('should return original columns if settings is not an array', () => {
    const columns = [{colId: '1', hide: false}];
    const settings = null;
    const result = setColumnSettings(
      columns,
      settings as unknown as GridSettings['columnsSettings'],
    );
    expect(result).toEqual(columns);
  });

  it('should order columns according to settings', () => {
    const columns = [
      {colId: '1', hide: false},
      {colId: '2', hide: false},
    ];
    const settings: GridSettings['columnsSettings'] = [
      {id: '2', order: 1, hidden: false},
      {id: '1', order: 2, hidden: false},
    ];
    const result = setColumnSettings(columns, settings);
    expect(result).toEqual([
      {colId: '2', hide: false},
      {colId: '1', hide: false},
    ]);
  });

  it('should handle missing order values by not changing order', () => {
    const columns = [
      {colId: '1', hide: false},
      {colId: '2', hide: false},
    ];
    const settings: GridSettings['columnsSettings'] = [
      // @ts-expect-error - order is missing
      {id: '2', hidden: false},
      // @ts-expect-error - order is missing
      {id: '1', hidden: false},
    ];
    const result = setColumnSettings(columns, settings);
    expect(result).toEqual(columns);
  });

  it('should apply hidden settings to columns', () => {
    const columns = [
      {colId: '1', hide: false},
      {colId: '2', hide: false},
    ];
    const settings: GridSettings['columnsSettings'] = [
      {id: '1', order: 1, hidden: true},
      {id: '2', order: 2, hidden: false},
    ];
    const result = setColumnSettings(columns, settings);
    expect(result).toEqual([
      {colId: '1', hide: true},
      {colId: '2', hide: false},
    ]);
  });

  it('should keep original hidden values if settings do not specify hidden', () => {
    const columns = [
      {colId: '1', hide: false},
      {colId: '2', hide: true},
    ];
    const settings: GridSettings['columnsSettings'] = [
      // @ts-expect-error - hidden is missing
      {id: '1', order: 1},
      // @ts-expect-error - hidden is missing
      {id: '2', order: 2},
    ];
    const result = setColumnSettings(columns, settings);
    expect(result).toEqual([
      {colId: '1', hide: false},
      {colId: '2', hide: true},
    ]);
  });
});
