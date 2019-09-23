import React from 'react';
import './PollResults.css';
import RCVComponent from '../RCVComponent.js';

class PollResults extends RCVComponent {
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
          <Winners choices={this.state.result.winners} />
          <Breakdown rounds={this.state.result.rounds} />
        </div>
      )
    }
    else if (this.state.notFound) {
      return (
        <div className="poll-not-found">
          <h1>Poll Not Found</h1>
          <p>No poll was found. Please double check that the link is correct.</p>
        </div>
      )
    }
    else if (this.state.error) {
      return (
        <div className="error">
          <h1>{this.state.error.title}</h1>
          <p>{this.state.error.alertMessage}</p>
        </div>
      )
    }
    else {
      this.loadResults();
      return null;
    }
  }

  generateURL() {
    return 'http://localhost:8080/api/v1/polls/' + this.props.pollId + "/results"
  }

  loadResults() {
    if (this.isLoading) {
      return;
    }
    this.startLoading("Loading Poll Results...");
    fetch(this.generateURL())
      .then(response => {
        if (response.status === 404) {
          return "notFound";
        }
        else {
          return response.json()
        }
      })
      .then(json => {
        this.stopLoading();
        if (json.pollName && json.result) {
          this.setState({
            pollName: json.pollName,
            result: json.result,
          })
        }
        else {
          this.handleLoadingError(json);
        }
      });
  }
}

function Winners(props) {
  if (props.choices.length === 1) {
    return (
      <div className="winner">
        <h2>Current Winner</h2>
        <p className="choice">{props.choices[0]}</p>
      </div>
    )
  }
  return (
    <div className="winner">
      <h2>Current Winners</h2>
      <p>These choices are currently tied.</p>
      {props.choices.map((choice, index) =>
        <p className="choice">{choice}</p>
      )}
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
