import React from 'react';

import './SharePoll.css'

import API from '../../API.js'
import RCVComponent from '../RCVComponent.js';

import Instructions from './Instructions.js';
import Reset from './Reset.js';

class SharePoll extends RCVComponent {
  state = {};

  // Remote State

  generateURL() {
    return API('polls', this.props.pollId);
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

  // Rendering

  render() {
    if (this.state.name) {
      return (
        <div className="share-poll">
          <h1>Share Poll</h1>
          <h2>Poll Information</h2>
          <table><tbody>
              <tr>
                <th>Name</th>
                <td>{this.state.name}</td>
              </tr>
              <tr>
                <th>Details</th>
                <td>{this.state.details}</td>
              </tr>
              <tr>
                <th>Id</th>
                <td><a href={`/${this.props.pollId}`}>{this.props.pollId}</a></td>
              </tr>
              <tr>
                <th>Results</th>
                <td><a href={`/${this.props.pollId}/results`}>View Now</a></td>
              </tr>
          </tbody></table>
          <Instructions pollId={this.props.pollId} />
          <Reset pollId={this.props.pollId} />
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

export default SharePoll;
