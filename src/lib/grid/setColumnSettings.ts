import {Filter} from '@/types/filterData';
import {isArray} from 'lodash';
import type {GridSettings} from '../../store/slices/gridSlice';

export const setColumnSettings = (
  col: any,
  settings: GridSettings['columnsSettings'],
  filters?: Filter[],
) => {
  if (!isArray(settings)) return col;

  const orderedColumns = col?.sort((a: any, b: any) => {
    const aOrder = settings.find((c) => c.id === a.colId)?.order;
    const bOrder = settings.find((c) => c.id === b.colId)?.order;
    if (typeof aOrder === 'undefined' || typeof bOrder === 'undefined')
      return 0;
    return aOrder - bOrder;
  });
  const columnsWithSettingsData = orderedColumns?.map((colTemp: any) => {
    const hidden = settings?.find((c) => c.id === colTemp.colId)?.hidden;
    //console.log(colTemp.colId, colTemp.hide, hidden);
    if (
      (colTemp.colId === 'shipping_status' || colTemp.colId === 'tracking') &&
      filters
    ) {
      if (
        !filters
          .find((f) => f.id === 'status')
          ?.data.find((fi) => fi.checked && fi.id === 5)
      ) {
        return {
          ...colTemp,
          hide: true,
        };
      } else {
        return {
          ...colTemp,
          hide: typeof hidden !== 'undefined' ? hidden : colTemp.hide,
        };
      }
    }

    //console.log(colTemp.colId, colTemp.hide, hidden);

    return {
      ...colTemp,
      hide: typeof hidden !== 'undefined' ? hidden : colTemp.hide,
    };
  });

  return columnsWithSettingsData;
};
