import React from 'react';

const AvailableChoices = (props) => {
    if (props.choices.length === 0) {
      return null;
    }
    return (
      <div className="available-choices">
        <h2>Choices</h2>
        <p>Choose your first choice out of those remaining.</p>
        <ul>
          {props.choices.map((choice, i) =>
            <li key={choice.id}><button
              data-index={i}
              onClick={props.makeChoice}
            >{choice.name}</button></li>
          )}
        </ul>
      </div>
    )
}

export default AvailableChoices;
