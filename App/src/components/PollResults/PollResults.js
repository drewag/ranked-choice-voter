import React from 'react';

import './PollResults.css';

import API from '../../API.js'
import RCVComponent from '../RCVComponent.js';

import Winners from './Winners.js';
import Breakdown from './Breakdown.js';

class PollResults extends RCVComponent {
  constructor(props) {
    super(props);
    this.state = {
      pollName: null,
      result: null,
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
    return API('polls', this.props.pollId, 'results')
  }

  loadResults() {
    if (this.isLoading) {
      return;
    }
    this.startLoading('Loading Poll Results...');
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

export default PollResults;
