import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import CreatePoll from './components/CreatePoll/CreatePoll';
import TakePoll from './components/TakePoll/TakePoll';
import PollResults from './components/PollResults/PollResults';
import * as serviceWorker from './serviceWorker';
import LoadingOverlay from 'react-loading-overlay';

var Router = require('react-router-component')
var Locations = Router.Locations
var Location = Router.Location

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingText: null,
    }
  }

  setLoading(text) {
    this.setState({loadingText: text});
  }

  render() {
    const setLoading = this.setLoading.bind(this);
    return (
      <LoadingOverlay
        className="app"
        active={this.state.loadingText != null}
        spinner
        text={this.state.loadingText}
      >
          <header>
            <img alt="RCV - Ranked Choice Voter" src="/img/logo.png" width="200" />
          </header>
          <Locations>
            <Location path="/" setLoading={setLoading} handler={CreatePoll} />
            <Location path="/:pollId" setLoading={setLoading} handler={TakePoll} />
            <Location path="/:pollId/results" setLoading={setLoading} handler={PollResults} />
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
