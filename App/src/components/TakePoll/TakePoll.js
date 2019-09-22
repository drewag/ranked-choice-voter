import React from 'react';
import update from 'immutability-helper';
const arrayMove = require('array-move');
var Sortable = require('react-sortable-hoc');
var SortableContainer = Sortable.SortableContainer;
var SortableElement = Sortable.SortableElement;

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

  makeChoice = event => {
    const index = event.target.dataset.index;
    var availableChoices = this.state.availableChoices.slice();
    var choice = availableChoices.splice(index, 1)[0];
    var rankings = this.state.rankings.slice();
    rankings.push(choice);
    this.setState({
      availableChoices: availableChoices,
      rankings: rankings,
    });
  }

  render() {
    console.log(this.state.rankings);
    if (this.state.poll) {
      if (this.state.poll.name) {
        let rankings;
        if (this.state.rankings.length > 0) {
          rankings = (
            <div>
              <label>Rankings</label>
              <ul>
                {this.state.rankings.map((choice, i) =>
                  <li key={choice.id}>{i + 1}: {choice.name}</li>
                )}
              </ul>
            </div>
          )
        }
        return (
          <div className="poll">
            <h1>{this.state.name}</h1>
            <p>{this.state.details}</p>
            <label>Choices</label>
            <p>Choose your preferences in order.</p>
            <ul>
              {this.state.availableChoices.map((choice, i) =>
                <li key={choice.id}><button
                  data-index={i}
                  onClick={this.makeChoice}
                >{choice.name}</button></li>
              )}
            </ul>
            {rankings}

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
      .then(json => {
        this.setState({
          name: json.name,
          details: json.details,
          availableChoices: json.choices,
          rankings: [],
          poll: json
        })
      });
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
