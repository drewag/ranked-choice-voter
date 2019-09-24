import React, {useState, useEffect} from 'react';

import API from '../API.js';

import useLoading from './Loading.js';

const useValueLoading = (props, endpoint, name, validate, onLoaded) => {
  const [value, setValue] = useState();
  const [startLoading, stopLoading] = useLoading(props);

  const loadValue = async () => {
    startLoading(`Loading ${name}...`);
    const value = await fetch(endpoint)
      .then(response => {
        if (response.status === 404) {
          return null;
        }
        else {
          return response.json()
        }
      })
    stopLoading();
    if (value && validate(value)) {
      onLoaded && onLoaded(value);
      setValue(value);
    }
    else if (value == null) {
      setValue(value);
    }
    else {
      throw "this is an error";
    }
  }

  useEffect(() => {
    loadValue();
  }, []);

  return value;
}

export default useValueLoading;
