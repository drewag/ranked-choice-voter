import React from 'react';
//import './App.css';

class CreatePoll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      details: '',
      choices: [''],
    };
  }

  nonEmptyChoices() {
    return this.state.choices.filter(choice => choice.length > 0);
  }

  isValid() {
    return this.nonEmptyChoices().length >= 3 && this.state.name.length > 0
  }

  changeHandler = event => {
    const name = event.target.name;
    const value = event.target.value;

    let update = new Array();
    update[name] = value;
    this.setState(update);
  }

  choiceChangeHandler = event => {
    const index = parseInt(event.target.name);
    const value = event.target.value;

    let choices = this.state.choices.slice();
    choices[index] = value;

    if (choices[choices.length - 1] != '') {
      choices.push('');
    }

    this.setState({choices: choices});
  }

  submitHandler = event => {
    let finalChoices = this.nonEmptyChoices();
    const input = {
      name: this.state.name,
      details: this.state.details,
      choices: finalChoices,
    }

    fetch('http://localhost:8080/api/v1/polls', {
        method: 'POST',
        body: JSON.stringify(input),
      })
      .then(response => response.json())
      .then(json => {
        const url = "/" + json.id;
        window.location.href = url;
      });

    event.preventDefault();
  }

  render() {
    return (
      <form id="createPoll" onSubmit={this.submitHandler}>
        <h1>Create a Poll</h1>
        <p>Start your own poll to help make a group decision with fixed choices.</p>
        <label>Question</label>
        <input type="text"
          name="name"
          placeholder="The question to ask your poll takers"
          value={this.state.name}
          onChange={this.changeHandler}
        />

        <label>Details (optional)</label>
        <textarea
          name="details"
          placeholder="Extra details to help people rank the available choices."
          value={this.state.details}
          onChange={this.changeHandler}
        />

        <label>Choices (minimum of 3)</label>
          {this.state.choices.map((choice, i) => (
            <input
              type="text"
              name={i}
              value={choice}
              onChange={this.choiceChangeHandler}
              placeholder="Add a choice"
            />
          ))}

          <input
            disabled={this.isValid() ? "" : "disabled"}
            type="submit"
            value="Create"
          />
      </form>
    );
  }
}

export default CreatePoll;
