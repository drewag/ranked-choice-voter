import React from 'react';

function Winners(props) {
  if (props.choices.length === 1) {
    return (
      <div className="winner">
        <h2>Current Winner</h2>
        <p className="choice">{props.choices[0]}</p>
      </div>
    )
  }
  return (
    <div className="winner">
      <h2>Current Winners</h2>
      <p>These choices are currently tied.</p>
      {props.choices.map((choice, index) =>
        <p className="choice">{choice}</p>
      )}
    </div>
  )
}

export default Winners;
