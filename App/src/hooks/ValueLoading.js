import {useState, useEffect} from 'react';

import useLoading from './Loading.js';

const NotFound = new Error();

const useValueLoading = (props, endpoint, name, validate, onLoaded) => {
  const [value, setValue] = useState();

  const [startLoading, stopLoading] = useLoading(props);
  const setError = props.setError;

  useEffect(() => {
    startLoading(`Loading ${name}...`);
    let value = fetch(endpoint)
      .then(response => {
        if (response.status === 404) {
          throw NotFound;
        }
        return response.json();
      })
      .then(json => {
        if (json && validate(json)) {
          onLoaded && onLoaded(json);
          stopLoading();
          return json;
        }
        else {
          throw new Error();
        }
      })
      .catch(error => {
        stopLoading();
        if (error === NotFound) {
          return null;
        }
        else {
          setError(error)
        }
      })
    setValue(value);
  }, [endpoint, name, startLoading, stopLoading, setError, onLoaded, validate]);

  return value;
}

export default useValueLoading;
