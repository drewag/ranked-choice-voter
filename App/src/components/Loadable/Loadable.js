import React, {useState} from 'react';
import LoadingOverlay from 'react-loading-overlay';

import LoadingContext from '../../contexts/LoadingContext';

const Loadable = (props) => {
  const [loadingText, setLoadingText] = useState(null);

  return (
    <LoadingOverlay
      className={props.className}
      active={loadingText != null}
      spinner
      text={loadingText}
    >
      <LoadingContext.Provider value={setLoadingText}>
        {props.children}
      </LoadingContext.Provider>
    </LoadingOverlay>
  )
}

export default Loadable;
