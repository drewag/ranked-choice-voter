import React from 'react';
import RCVComponent from '../RCVComponent.js';
import './TakePoll.css';
const arrayMove = require('array-move');
var Sortable = require('react-sortable-hoc');
var SortableContainer = Sortable.SortableContainer;
var SortableElement = Sortable.SortableElement;

class TakePoll extends RCVComponent {
  state = {};

  // Local State

  isValid() {
    return this.state.rankings.length >= 1;
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

  moveChoice = ({oldIndex, newIndex}) => {
    this.setState(({rankings}) => ({
      rankings: arrayMove(rankings, oldIndex, newIndex),
    }));
  };

  // Remote State

  generateURL() {
    return 'http://localhost:8080/api/v1/polls/' + this.props.pollId
  }

  loadPoll() {
    if (this.isLoading) {
      return
    }
    this.startLoading("Loading Poll...");
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
        if (json.name && json.choices) {
          this.setState({
            name: json.name,
            details: json.details,
            availableChoices: json.choices,
            rankings: [],
          })
        }
        else {
          this.handleLoadingError(json);
        }
      });
  }

  submitPoll() {
    this.startLoading("Submitting...");
    const rankings = this.state.rankings.map((choice, i) => {
      return choice.id
    });
    fetch(this.generateURL(), {
        method: 'POST',
        body: JSON.stringify(rankings),
      })
      .then(response => {
        this.stopLoading();
        if (response.status === 201) {
          window.location.href = "/" + this.props.pollId + "/results";
        }
        else {
          this.handleErrorResponse(response);
        }
      })
  }

  // Rendering

  render() {
    if (this.state.name) {
      return (
        <div className="poll">
          <h1>{this.state.name}</h1>
          <p>{this.state.details}</p>
          <AvailableChoices
            choices={this.state.availableChoices}
            makeChoice={this.makeChoice}
          />
          <Rankings
            rankings={this.state.rankings}
            moveChoice={this.moveChoice}
          />

          <button
            className="submit"
            disabled={this.isValid() ? "" : "disabled"}
            onClick={this.submitPoll.bind(this)}
          >Submit</button>
          <p className="divider">– or –</p>
          <a className="viewResults" href={'/' + this.props.pollId + '/results'}>View Results Without Taking Poll</a>
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
      this.loadPoll();
      return null
    }
  }
}

class AvailableChoices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {choices: props.choices}
  }

  componentWillReceiveProps({choices}) {
    this.setState({...this.state,choices})
  }

  render() {
    if (this.state.choices.length === 0) {
      return null;
    }
    return (
      <div className="available-choices">
        <h2>Choices</h2>
        <p>Choose your first choice out of those remaining.</p>
        <ul>
          {this.state.choices.map((choice, i) =>
            <li key={choice.id}><button
              data-index={i}
              onClick={this.props.makeChoice}
            >{choice.name}</button></li>
          )}
        </ul>
      </div>
    )
  }
}

const RankedChoice = SortableElement((props) =>
  <li key={props.choice.id}>{props.position + 1} – {props.choice.name}</li>
);

const RankedChoices = SortableContainer(({choices}) => {
  return (
    <ul>
      {choices.map((choice, index) => (
        <RankedChoice key={choice.id} index={index} position={index} choice={choice} />
      ))}
    </ul>
  );
});

class Rankings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {rankings: props.rankings}
  }

  componentWillReceiveProps({rankings}) {
    this.setState({...this.state,rankings})
  }

  render() {
    if (this.state.rankings.length === 0) {
      return null;
    }
    else {
      return (
        <div className="rankings">
          <h2>Rankings</h2>
          {this.state.rankings.length > 1 ? <p>Drag to reorder your choices to finalize your preferences.</p> : null}
          <RankedChoices
            lockAxis="y"
            helperClass="dragging-choice"
            choices={this.state.rankings}
            onSortEnd={this.props.moveChoice}
          />
          <p>We highly recommend ranking all of the possible choices so that you have a say no
            matter what. Your vote will only go to one of your lower preferences if your higher
            preferences are guaranteed not to win.
          </p>
        </div>
      )
    }
  }
}


export default TakePoll;
