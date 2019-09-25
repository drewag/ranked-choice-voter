import React, {useCallback} from 'react';

import './PollResults.css';

import API from '../../API.js'

import useValueLoading from '../../hooks/ValueLoading.js';

import Winners from './Winners.js';
import Breakdown from './Breakdown.js';

const PollResults = (props) => {
  // Hooks

  const endpoint = API('polls', props.pollId, 'results');
  const results = useValueLoading(
    endpoint,
    'Results',
    useCallback((results) => {
      return results.result && results.pollName
    }, [])
  )

  // Rendering

  if (results) {
    return (
      <div className="results">
        <h1>Results for “{results.pollName}”</h1>
        <Winners choices={results.result.winners} />
        <Breakdown rounds={results.result.rounds} />
      </div>
    )
  }
  else if (results == null) {
    return (
      <div className="poll-not-found">
        <h1>Poll Not Found</h1>
        <p>No poll was found. Please double check that the link is correct.</p>
      </div>
    )
  }
  else {
    return null;
  }
}

export default PollResults;
