import {useCallback, useContext} from 'react';

import ErrorContext from '../contexts/ErrorContext';

const useDisplayError = () => {
  const setError = useContext(ErrorContext);

  return useCallback((error) => {
    setError(error);
  }, [setError]);
}

export default useDisplayError;
