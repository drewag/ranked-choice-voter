import {useCallback} from 'react';

const useLoading = (props) => {
  const startLoading = (text) => {
    props.setLoading(text);
  }

  const stopLoading = () => {
    props.setLoading(null);
  }

  return [
    useCallback(startLoading, []),
    useCallback(stopLoading, []),
  ];
}

export default useLoading;
