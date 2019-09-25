import React from 'react';

function PastPolls(props) {
  const polls = props.polls;
  if (polls.length === 0) {
    return null;
  }
  return (
    <div className="past-polls">
      <h2>Your Past Polls</h2>
      <p>These are polls you've created in the past.</p>
      <ul>
        {polls.map((poll, index) => {
          return (
            <li key={poll.id}><a href={`/${poll.id}/share`}>{poll.name}</a></li>
          )
        })}
      </ul>
      <p>This history is stored on your computer. <strong>Don't rely on it to keep track of your past polls.</strong></p>
    </div>
  )
}

export default PastPolls;
