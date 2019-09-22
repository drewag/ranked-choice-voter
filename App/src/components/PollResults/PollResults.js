import React from 'react';
import './PollResults.css';

class PollResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    if (this.state.pollName) {
      return (
        <div className="results">
          <h1>Results for “{this.state.pollName}”</h1>
          <Winner choice={this.state.result.rankings[0]} />
          <FullRanking rankings={this.state.result.rankings} />
          <Breakdown rounds={this.state.result.rounds} />
        </div>
      )
    }
    else {
      this.loadResults();
      return <LoadingResults />
    }
  }

  generateURL() {
    return 'http://localhost:8080/api/v1/polls/' + this.props.pollId + "/results"
  }

  loadResults() {
    fetch(this.generateURL())
      .then(response => response.json())
      .then(json => this.setState({
        pollName: json.pollName,
        result: json.result,
      }));
  }
}

function LoadingResults(props) {
    return (
      <p>Loading results...</p>
    )
}

function Winner(props) {
  return (
    <div className="winner">
      <h2>Current Winner</h2>
      <p className="choice">{props.choice}</p>
    </div>
  )
}

function FullRanking(props) {
  return (
    <div className="full-ranking">
      <h2>Full Ranking</h2>
      <table><tbody>
      {props.rankings.map((choice, index) =>
        <tr>
          <td className="rank">{index + 1}</td>
          <td>{choice}</td>
        </tr>
      )}
      </tbody></table>
    </div>
  )
}

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

export default PollResults;
