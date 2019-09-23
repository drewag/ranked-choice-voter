import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import LoadingOverlay from 'react-loading-overlay';
import {Locations, Location} from 'react-router-component';

import './index.css';

import CreatePoll from './components/CreatePoll/CreatePoll';
import SharePoll from './components/SharePoll/SharePoll';
import TakePoll from './components/TakePoll/TakePoll';
import PollResults from './components/PollResults/PollResults';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingText: null,
    }
  }

  setLoading = (text) => {
    this.setState({loadingText: text});
  }

  render() {
    return (
      <LoadingOverlay
        className="app"
        active={this.state.loadingText != null}
        spinner
        text={this.state.loadingText}
      >
          <header>
            <a href="/">
              <img alt="RCV - Ranked Choice Voter" src="/img/logo.png" width="200" />
            </a>
          </header>
          <Locations>
            <Location path="/" setLoading={this.setLoading} handler={CreatePoll} />
            <Location path="/:pollId" setLoading={this.setLoading} handler={TakePoll} />
            <Location path="/:pollId/share" setLoading={this.setLoading} handler={SharePoll} />
            <Location path="/:pollId/results" setLoading={this.setLoading} handler={PollResults} />
          </Locations>
          <footer><a href="https://drewag.me">Created by Drewag</a></footer>
      </LoadingOverlay>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
