import React from 'react';

class AvailableChoices extends React.Component {
  render() {
    if (this.props.choices.length === 0) {
      return null;
    }
    return (
      <div className="available-choices">
        <h2>Choices</h2>
        <p>Choose your first choice out of those remaining.</p>
        <ul>
          {this.props.choices.map((choice, i) =>
            <li key={choice.id}><button
              data-index={i}
              onClick={this.props.makeChoice}
            >{choice.name}</button></li>
          )}
        </ul>
      </div>
    )
  }
}

export default AvailableChoices;
