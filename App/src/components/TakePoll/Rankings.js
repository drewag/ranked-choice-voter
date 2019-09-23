import React from 'react';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';

class Rankings extends React.Component {
  render() {
    if (this.props.rankings.length === 0) {
      return null;
    }
    else {
      return (
        <div className="rankings">
          <h2>Rankings</h2>
          {this.props.rankings.length > 1 ? <p>Drag to reorder your choices to finalize your preferences.</p> : null}
          <RankedChoices
            lockAxis="y"
            helperClass="dragging-choice"
            choices={this.props.rankings}
            onSortEnd={this.props.moveChoice}
          />
          <p>We highly recommend ranking all of the possible choices so that you have a say no
            matter what. Your vote will only go to one of your lower preferences if your higher
            preferences are guaranteed not to win.
          </p>
        </div>
      )
    }
  }
}

const RankedChoice = SortableElement((props) =>
  <li key={props.choice.id}>{props.position + 1} – {props.choice.name}</li>
);

const RankedChoices = SortableContainer(({choices}) => {
  return (
    <ul>
      {choices.map((choice, index) => (
        <RankedChoice key={choice.id} index={index} position={index} choice={choice} />
      ))}
    </ul>
  );
});


export default Rankings;
