import React from 'react';
import arrayMove from 'array-move';

import './TakePoll.css';

import API from '../../API.js';
import RCVComponent from '../RCVComponent.js';
import AvailableChoices from './AvailableChoices.js';

import Rankings from './Rankings.js';

class TakePoll extends RCVComponent {
  state = {};

  // Local State

  isValid() {
    return this.state.rankings.length >= 1;
  }

  makeChoice = event => {
    const index = event.target.dataset.index;
    const availableChoices = this.state.availableChoices.slice();
    const choice = availableChoices.splice(index, 1)[0];
    let rankings = this.state.rankings.slice();
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
    return API('polls/' + this.props.pollId)
  }

  loadPoll() {
    if (this.isLoading) {
      return
    }
    this.startLoading('Loading Poll...');
    fetch(this.generateURL())
      .then(response => {
        if (response.status === 404) {
          return RCVComponent.NotFound;
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

  submitPoll = () => {
    this.startLoading('Submitting...');
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
          window.location.href = `/${this.props.pollId}/results`;
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
            disabled={this.isValid() ? null : 'disabled'}
            onClick={this.submitPoll}
          >Submit</button>
          <p className="divider">– or –</p>
          <a className="viewResults" href={`/${this.props.pollId}/results`}>View Results Without Taking Poll</a>
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

export default TakePoll;
