import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import CreatePoll from './components/CreatePoll/CreatePoll';
import TakePoll from './components/TakePoll/TakePoll';
import PollResults from './components/PollResults/PollResults';
import * as serviceWorker from './serviceWorker';

var Router = require('react-router-component')
var Locations = Router.Locations
var Location = Router.Location

ReactDOM.render(
  <div className="App">
    <header className="App-header">
      <h1>RCV</h1>
      <p>Ranked Choice Voter</p>
    </header>
    <Locations>
      <Location path="/" handler={CreatePoll} />
      <Location path="/:pollId" handler={TakePoll} />
      <Location path="/:pollId/results" handler={PollResults} />
    </Locations>
  </div>
  , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
