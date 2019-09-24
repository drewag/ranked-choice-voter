import React from 'react';

import './SharePoll.css'

import usePollLoading from '../../hooks/PollLoading.js';

import Instructions from './Instructions.js';
import Reset from './Reset.js';

const SharePoll = (props) => {
  const [poll] = usePollLoading(props);

  // Rendering

  if (poll) {
    return (
      <div className="share-poll">
        <h1>Share Poll</h1>
        <h2>Poll Information</h2>
        <table><tbody>
            <tr>
              <th>Name</th>
              <td>{poll.name}</td>
            </tr>
            <tr>
              <th>Details</th>
              <td>{poll.details}</td>
            </tr>
            <tr>
              <th>Id</th>
              <td><a href={`/${props.pollId}`}>{props.pollId}</a></td>
            </tr>
            <tr>
              <th>Results</th>
              <td><a href={`/${props.pollId}/results`}>View Now</a></td>
            </tr>
        </tbody></table>
        <Instructions pollId={props.pollId} />
        <Reset pollId={props.pollId} />
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
    return null;
  }
}

export default SharePoll;
