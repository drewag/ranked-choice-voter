import React from 'react';

class ErrorHandler extends React.Component {
  constructor(props) {
    super(props);

    this.state = {error: null};
  }

  componentDidCatch(error, info) {
    this.setState({error:error});
  }

  render() {
    if (this.state.error) {
      if (this.state.error.title && this.state.error.alertMessage) {
        return (
          <div className="error">
            <h1>{this.state.error.title}</h1>
            <p>{this.state.error.alertMessage}</p>
          </div>
        )
      }
      else {
        return (
          <div className="error">
            <h1>Unknown Error</h1>
            <p>The reason for this error could not be determined.</p>
          </div>
        )
      }
    }

    return this.props.children;
  }
}

export default ErrorHandler;
