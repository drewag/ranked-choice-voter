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
    let finalChoices = this.state.choices.filter(choice => choice.length > 0);
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
        <label>Name</label>
        <input type="text"
          name="name"
          value={this.state.name}
          onChange={this.changeHandler}
        />

        <label>Details</label>
        <textarea
          name="details"
          value={this.state.details}
          onChange={this.changeHandler}
        />

        <p>Choices</p>
          {this.state.choices.map((choice, i) => (
            <div className="choice">
              <label>{i + 1}</label>
              <input
                type="text"
                name={i}
                value={choice}
                onChange={this.choiceChangeHandler}
                placeholder="Add Another Choice"
              />
            </div>
          ))};

        <input type="submit" />
      </form>
    );
  }
}

export default CreatePoll;
