import API from '../API.js';

import {useCallback} from 'react';

import useValueLoading from './ValueLoading.js';

const usePollLoading = (props, onLoaded) => {
  const endpoint = API('polls/' + props.pollId);
  const validatePoll = useCallback((poll) => {
    return poll.name
  }, [])
  const poll = useValueLoading(
    props,
    endpoint,
    'Polls',
    validatePoll,
    onLoaded
  )

  return [poll, endpoint];
}

export default usePollLoading;
