import {BackendTypes} from '../constants/backendData';

export const GetTypeById = (id: string) => {
  const type = BackendTypes.find((typeTemp) => typeTemp.id === id);
  return type;
};
