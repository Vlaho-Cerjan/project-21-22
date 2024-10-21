import React, {Suspense, createContext} from 'react';
import Loading from '../../components/common/loading/loading';

interface LoadingContextProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const LoadingContext = createContext<{
  loading: boolean;
  setLoading: (loading: boolean) => void;
}>({} as LoadingContextProps);

export const LoadingProvider = ({children}: {children: React.ReactNode}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const loadingContext = React.useMemo(() => {
    return {
      loading: isLoading,
      setLoading: setIsLoading,
    };
  }, [isLoading]);

  return (
    <LoadingContext.Provider value={loadingContext}>
      {children}
      <Suspense fallback={<div />}>
        <Loading loading={isLoading} />
      </Suspense>
    </LoadingContext.Provider>
  );
};
