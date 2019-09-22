import React from 'react';

class PollResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    if (this.state.results) {
      return (
        <div className="results">
          <h2>Winner: {this.state.results.winner}</h2>
          {this.state.results.rounds.map((round, index) => {
            return (
              <div className="round">
                <h2>Round {index + 1}</h2>
                <ul>
                    {round.tallies.map((tally, index) => {
                      return (
                        <li>{tally.count}: {tally.choice}</li>
                      )
                    })}
                </ul>
              </div>
            )
          })}
        </div>
      )
    }
    else {
      this.loadResults();
      return (
        <p>Loading results...</p>
      )
    }
  }

  generateURL() {
    return 'http://localhost:8080/api/v1/polls/' + this.props.pollId + "/results"
  }

  loadResults() {
    fetch(this.generateURL())
      .then(response => response.json())
      .then(json => this.setState({results: json}));
  }
}

export default PollResults;
