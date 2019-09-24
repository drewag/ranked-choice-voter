import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import LoadingOverlay from 'react-loading-overlay';
import {Locations, Location} from 'react-router-component';

import './index.css';

import ErrorHandler from './components/ErrorHandler/ErrorHandler';
import CreatePoll from './components/CreatePoll/CreatePoll';
import SharePoll from './components/SharePoll/SharePoll';
import TakePoll from './components/TakePoll/TakePoll';
import PollResults from './components/PollResults/PollResults';

const App = () => {
  const [loadingText, setLoadingText] = useState(null);

  return (
    <LoadingOverlay
      className="app"
      active={loadingText != null}
      spinner
      text={loadingText}
    >
        <header>
          <a href="/">
            <img alt="RCV - Ranked Choice Voter" src="/img/logo.png" width="200" />
          </a>
        </header>
        <ErrorHandler>
          <Locations>
            <Location path="/" setLoading={setLoadingText} handler={CreatePoll} />
            <Location path="/:pollId" setLoading={setLoadingText} handler={TakePoll} />
            <Location path="/:pollId/share" setLoading={setLoadingText} handler={SharePoll} />
            <Location path="/:pollId/results" setLoading={setLoadingText} handler={PollResults} />
          </Locations>
          <footer><a href="https://drewag.me">Created by Drewag</a></footer>
        </ErrorHandler>
    </LoadingOverlay>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
