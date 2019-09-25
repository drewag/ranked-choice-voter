import {useCallback, useContext} from 'react';

import LoadingContext from '../contexts/LoadingContext';

const useLoading = () => {
  const setLoading = useContext(LoadingContext);

  const startLoading = useCallback((text) => {
    setLoading(text);
  }, [setLoading]);

  const stopLoading = useCallback(() => {
    setLoading(null);
  }, [setLoading]);

  return [
    startLoading,
    stopLoading,
  ];
}

export default useLoading;
