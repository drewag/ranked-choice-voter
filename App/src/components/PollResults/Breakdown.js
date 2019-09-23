import React from 'react';

function Breakdown(props) {
  let rounds = props.rounds;
  rounds.pop();
  return (
    <div className="breakdown">
      <h2>Understanding the Results</h2>
      <p>Here is a breakdown of how the results were calculated.</p>
      {rounds.map((round, index) => {
        let reallocated = null;
        if (index > 0) {
          const tallies = props.rounds[index - 1].tallies;
          const previousLoser = tallies[tallies.length - 1].choice;
          reallocated = <p>Any votes for “{previousLoser}” were thrown since it was in last place. Then, the next priority vote for anyone who voted for it, was used on the remaining choices.</p>
        }
        else {
          reallocated = <p>For the first round, everyone's first choice was tallied.</p>
        }
        return (
          <div className="round">
            <h3>Round {index + 1}</h3>
            {reallocated}
            <table className="round"><tbody>
              <tr><th>choice</th><th>vote(s)</th></tr>
              {round.tallies.map((tally, index) => {
                return (
                  <tr>
                    <td>{tally.choice}</td>
                    <td className="count">{tally.count}</td>
                  </tr>
                )
              })}
            </tbody></table>
          </div>
        )
      })}
    </div>
  )
}

export default Breakdown;
