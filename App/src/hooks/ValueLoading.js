import {useState, useEffect} from 'react';

import useLoading from './Loading.js';
import useDisplayError from './DisplayError.js';

const NotFound = new Error();

const useValueLoading = (endpoint, name, validate, onLoaded) => {
  const [value, setValue] = useState();

  const [startLoading, stopLoading] = useLoading();
  const displayError = useDisplayError();

  useEffect(() => {
    const fetchValue = async () => {
      startLoading(`Loading ${name}...`);
      let value = await fetch(endpoint)
        .then(response => {
          if (response.status === 404) {
            throw NotFound;
          }
          return response.json();
        })
        .then(json => {
          stopLoading();
          if (json && validate(json)) {
            onLoaded && onLoaded(json);
            return json;
          }
          else {
            displayError(json);
            return
          }
        })
        .catch(error => {
          stopLoading();
          if (error === NotFound) {
            return null;
          }
          else {
            displayError(error)
          }
        })
      if (value) {
        setValue(value);
      }
    }
    fetchValue();
  }, [endpoint, name, startLoading, stopLoading, displayError, onLoaded, validate]);

  return value;
}

export default useValueLoading;
