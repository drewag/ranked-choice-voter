import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import {Locations, Location} from 'react-router-component';

import './index.css';

import Loadable from './components/Loadable/Loadable';
import ErrorHandler from './components/ErrorHandler/ErrorHandler';
import CreatePoll from './components/CreatePoll/CreatePoll';
import SharePoll from './components/SharePoll/SharePoll';
import TakePoll from './components/TakePoll/TakePoll';
import PollResults from './components/PollResults/PollResults';

const App = () => {
  return (
    <Loadable className="app">
        <header>
          <a href="/">
            <img alt="RCV - Ranked Choice Voter" src="/img/logo.png" width="200" />
          </a>
        </header>
        <ErrorHandler>
          <Locations>
            <Location path="/" handler={CreatePoll} />
            <Location path="/:pollId" handler={TakePoll} />
            <Location path="/:pollId/share" handler={SharePoll} />
            <Location path="/:pollId/results" handler={PollResults} />
          </Locations>
          <footer><a href="https://drewag.me">Created by Drewag</a></footer>
        </ErrorHandler>
    </Loadable>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
