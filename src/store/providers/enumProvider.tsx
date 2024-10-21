import React, {createContext} from 'react';

import {useAppDispatch} from '@/src/hooks';

import {fetchEnum} from '../slices/enumSlice';

const EnumContext = createContext<{
  enumData: any[];
}>({
  enumData: [],
});

const EnumProvider = ({children}: {children: React.ReactNode}) => {
  const dispatch = useAppDispatch();

  const enumData = React.useMemo(() => {
    return [];
  }, []);

  React.useEffect(() => {
    if (dispatch) dispatch(fetchEnum());
  }, [dispatch]);

  const contextValue = React.useMemo(() => {
    return {enumData};
  }, []);

  return (
    <EnumContext.Provider value={contextValue}>{children}</EnumContext.Provider>
  );
};

export default EnumProvider;
