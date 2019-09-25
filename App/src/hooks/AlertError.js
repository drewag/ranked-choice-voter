import {useCallback} from 'react';

const useAlertError = () => {
  return useCallback((error) => {
    console.log(error);

    const alertJSONError = json => {
        if (json.title && json.alertMessage) {
          alert(`${json.title}: ${json.alertMessage}`);
        }
        else {
          alert('Unknown Error');
        }
    }

    if (error instanceof Response) {
      error.json().then(alertJSONError);
    }
    else if (error instanceof Error) {
      alert(error.message);
    }
    else {
      alertJSONError(error);
    }
  }, []);
}

export default useAlertError;
