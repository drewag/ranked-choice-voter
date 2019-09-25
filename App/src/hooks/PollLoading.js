import API from '../API.js';

import {useCallback} from 'react';

import useValueLoading from './ValueLoading.js';

const usePollLoading = (pollId, onLoaded) => {
  const endpoint = API('polls/' + pollId);
  const validatePoll = useCallback((poll) => {
    return poll.name
  }, [])
  const poll = useValueLoading(
    endpoint,
    'Polls',
    validatePoll,
    onLoaded
  )

  return [poll, endpoint];
}

export default usePollLoading;
