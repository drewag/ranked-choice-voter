import React from 'react';

import API from '../../API.js'

class Reset extends React.Component {
  reset = () => {
    if (window.confirm('Are you sure you want to clear the results?\n\nThis cannot be undone!')) {
      fetch(API(`polls/${this.props.pollId}/answers`), {
          method: 'DELETE',
        })
        .then(response => {
          if (response.status === 200) {
            alert('Results Cleared Successfully');
            return
          }

          this.handleErrorResponse(response);
        })
    }
  }

  render() {
    return (
      <div className="reset">
        <h2>Reset Votes</h2>
        <p>At any point, you can reset all of the existing votes on this poll.</p>
        <button className="danger" onClick={this.reset}>Reset Votes (this cannot be undone)</button>
      </div>
    )
  }
}

export default Reset;
