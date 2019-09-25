import React, {useState, useCallback} from 'react';
import arrayMove from 'array-move';

import './TakePoll.css';

import useLoading from '../../hooks/Loading.js';
import usePollLoading from '../../hooks/PollLoading.js';
import useAlertError from '../../hooks/AlertError.js';
import AvailableChoices from './AvailableChoices.js';

import Rankings from './Rankings.js';

const TakePoll = (props) => {
  const [availableChoices, setAvailableChoices] = useState();
  const [rankings, setRankings] = useState();

  const [startLoading, stopLoading] = useLoading();
  const [poll, endpoint] = usePollLoading(props.pollId, useCallback((loaded) => {
    setAvailableChoices(loaded.choices);
    setRankings([]);
  }, []));
  const alertError = useAlertError();

  // Local State

  const isValid = () => {
    return rankings && rankings.length >= 1;
  }

  const makeChoice = event => {
    const index = event.target.dataset.index;
    const newAvailableChoices = availableChoices.slice();
    const choice = newAvailableChoices.splice(index, 1)[0];
    let newRankings = rankings.slice();
    newRankings.push(choice);
    setAvailableChoices(newAvailableChoices);
    setRankings(newRankings);
  }

  const moveChoice = ({oldIndex, newIndex}) => {
    setRankings(arrayMove(rankings, oldIndex, newIndex));
  };

  // Remote State


  const submitPoll = () => {
    startLoading('Submitting...');
    const input = rankings.map((choice, i) => {
      return choice.id
    });
    fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(input),
      })
      .then(response => {
        stopLoading();
        if (response.status === 201) {
          window.location.href = `/${props.pollId}/results`;
        }
        else {
          alertError(response);
        }
      })
      .catch(alertError);
  }

  // Rendering

  if (poll) {
    return (
      <div className="poll">
        <h1>{poll.name}</h1>
        <p>{poll.details}</p>
        <AvailableChoices
          choices={availableChoices}
          makeChoice={makeChoice}
        />
        <Rankings
          rankings={rankings}
          moveChoice={moveChoice}
        />

        <button
          className="submit"
          disabled={isValid() ? null : 'disabled'}
          onClick={submitPoll}
        >Submit</button>
        <p className="divider">– or –</p>
        <a className="viewResults" href={`/${props.pollId}/results`}>View Results Without Taking Poll</a>
      </div>
    )
  }
  else if (poll === null) {
    return (
      <div className="poll-not-found">
        <h1>Poll Not Found</h1>
        <p>No poll was found. Please double check that the link is correct.</p>
      </div>
    )
  }
  else {
    return null
  }
};

export default TakePoll;
