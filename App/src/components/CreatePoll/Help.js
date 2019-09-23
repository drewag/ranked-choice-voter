import React from 'react';

function Help(props) {
  return (
    <div className="help">
      <h2>What is Ranked Choice Voting</h2>
      <p><a href="https://www.fairvote.org/rcv">Ranked choice voting</a>, also referred to as
        Instant Runoff Voting, is a method of tallying votes that ensures the winner has a
        majority of the votes.
      </p>
      <p>
          Each voter ranks their choices in the order they prefer. If their top choice cannot
          possibly win, their vote then goes to their next highest preference. This allows
          voters to vote for their favorite choices without worrying about “throwing their
          vote away” and generally allows finding the winner with the largest consensus.
      </p>
      <p>
          It works best when there are more voters than options.
      </p>
    </div>
  )
}

export default Help;
