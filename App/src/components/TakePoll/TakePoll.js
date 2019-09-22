import React from 'react';
import update from 'immutability-helper';
const arrayMove = require('array-move');

class TakePoll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  moveChoice(from, to) {
    var choices = this.state.poll.choices.slice();
    choices = arrayMove(choices, from, to);
    var newState = update(this.state, {
      poll:{choices:{$set:choices}}
    });
    this.setState(newState);
  }

  moveUpHandler = event => {
    const index = event.target.dataset.index;
    this.moveChoice(index, index - 1);
  }

  moveDownHandler = event => {
    const index = event.target.dataset.index;
    this.moveChoice(index, index + 1);
  }

  render() {
    if (this.state.poll) {
      if (this.state.poll.name) {
        return (
          <div className="poll">
            <h1>{this.state.poll.name}</h1>
            <p>{this.state.poll.details}</p>
            <ul>
              {this.state.poll.choices.map((choice, i) => {
                let upControl;
                let downControl;
                if (i > 0) {
                  upControl = <button
                    data-index={i}
                    onClick={this.moveUpHandler}
                  >{'\u2b06'}</button>
                }
                if (i < this.state.poll.choices.length - 1) {
                  downControl = <button
                    data-index={i}
                    onClick={this.moveDownHandler}
                  >{'\u2b07'}</button>
                }
                return (
                  <li key={choice.id}>{upControl}{downControl} {i + 1}: {choice.name}</li>
                )
              })}
            </ul>

            <button onClick={this.submitPoll.bind(this)}>Submit</button>
          </div>
        )
      }
      else if (this.state.poll.details == "Status: NOT FOUND") {
        return (
          <p>Not Found</p>
        )
      }
      else {
        return (
          <div className="error">
            <h2>{this.state.poll.title}</h2>
            <p>{this.state.poll.alertMessage}</p>
          </div>
        )
      }
    }
    else {
      this.loadPoll();
      return (
        <p>Loading...</p>
      )
    }
  }

  generateURL() {
    return 'http://localhost:8080/api/v1/polls/' + this.props.pollId
  }

  loadPoll() {
    fetch(this.generateURL())
      .then(response => response.json())
      .then(json => this.setState({poll: json}));
  }

  submitPoll() {
    const rankings = this.state.poll.choices.map((choice, i) => {
      return choice.id
    });
    fetch(this.generateURL(), {
        method: 'POST',
        body: JSON.stringify(rankings),
      })
      .then(response => {
        window.location.href = "/" + this.props.pollId + "/results";
      })
  }
}

export default TakePoll;
