import React, {useState, useEffect} from 'react';

import API from '../API.js';

import useValueLoading from './ValueLoading.js';

const usePollLoading = (props, onLoaded) => {
  const endpoint = API('polls/' + props.pollId);
  const poll = useValueLoading(
    props,
    endpoint,
    'Polls',
    (poll) => {
      return poll.name
    },
    onLoaded
  )

  return [poll, endpoint];
}

export default usePollLoading;
