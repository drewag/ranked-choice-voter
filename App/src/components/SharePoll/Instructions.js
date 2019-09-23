import React from 'react';

function Instructions(props) {
  return (
    <div className="share">
      <h2>Share</h2>
      <p>
          To have other people take this poll, you only need to send them the link.
          Anyone with the link will be able to take the poll.
      </p>
      <a className="link" href={`/${props.pollId}`}>Link (right click to copy)</a>
      <p>To copy the link, right click on it and select “Copy”</p>
    </div>
  )
}

export default Instructions;
