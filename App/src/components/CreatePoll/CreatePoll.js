import React, {useState} from 'react';

import './CreatePoll.css';

import API from '../../API.js';

import useLoading from '../../hooks/Loading.js';
import useErrorHandling from '../../hooks/ErrorHandling.js';

import Help from './Help.js';
import PastPolls from './PastPolls.js';

const CreatePoll = (props) => {
  // Hooks

  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [choices, setChoices] = useState(['']);

  const [startLoading, stopLoading] = useLoading(props);
  const handleError = useErrorHandling();

  // Local state

  const nonEmptyChoices = choices.filter(choice => choice.length > 0);
  const isValid = name.length > 0 && nonEmptyChoices.length >= 2;

  const changeHandler = (setter) => (event) => {
    const value = event.target.value;
    setter(value);
  }

  const choiceChangeHandler = event => {
    const index = parseInt(event.target.name);
    const value = event.target.value;

    let newChoices = choices.slice();
    newChoices[index] = value;

    if (newChoices[choices.length - 1] !== '') {
      newChoices.push('');
    }

    setChoices(newChoices);
  }

  const getPastPolls = () => {
    const pastPollsJSON = localStorage.getItem('generated-polls');
    return pastPollsJSON ? JSON.parse(pastPollsJSON) : [];
  }

  const addPoll = (id, name) => {
    let polls = getPastPolls();
    polls.push({id: id, name: name});
    localStorage.setItem('generated-polls', JSON.stringify(polls));
  }

  // Remote State

  const submitHandler = event => {
    startLoading('Creating Poll...');
    let finalChoices = nonEmptyChoices;
    const input = {
      name: name,
      details: details,
      choices: finalChoices,
    }

    fetch(API('polls'), {
        method: 'POST',
        body: JSON.stringify(input),
      })
      .then(response => {
        if (response.status === 201) {
          return response.json()
        }

        handleError(response);
      })
      .then(json => {
        stopLoading();
        if (json) {
          addPoll(json.id, name);
          const url = `/${json.id}/share`;
          window.location.href = url;
        }
      });

    event.preventDefault();
  }

  // Rendering

  return (
    <div className="create-poll">
      <form id="createPoll" onSubmit={submitHandler}>
        <h1>Create a Poll</h1>
        <p>Start your own poll to help make a group decision with fixed choices.</p>
        <label>Question</label>
        <input type="text"
          name="name"
          placeholder="The question to ask your poll takers"
          value={name}
          onChange={changeHandler(setName)}
        />

        <label>Details (optional)</label>
        <textarea
          name="details"
          placeholder="Extra details to help people rank the available choices."
          value={details}
          onChange={changeHandler(setDetails)}
        />

        <label>Choices (minimum of 2)</label>
          {choices.map((choice, i) => (
            <input
              type="text"
              name={i}
              value={choice}
              onChange={choiceChangeHandler}
              placeholder="Add a choice"
            />
          ))}

          <input
            disabled={isValid ? null : 'disabled'}
            type="submit"
            value="Create Poll"
          />
      </form>
      <PastPolls polls={getPastPolls()} />
      <Help />
    </div>
  );
}

export default CreatePoll;
