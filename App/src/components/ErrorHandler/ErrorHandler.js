import React from 'react';

import ErrorContext from '../../contexts/ErrorContext';

class ErrorHandler extends React.Component {
  constructor(props) {
    super(props);

    this.state = {error: null};
  }

  componentDidCatch(error, info) {
    this.setState({error:error});
  }

  setError = (error) => {
    this.setState({error:error});
  }

  render() {
    let title;
    let message;
    if (this.state.error) {
      if (this.state.error.title && this.state.error.alertMessage) {
        title = this.state.error.title;
        message = this.state.error.alertMessage;
      }
      else if (this.state.error.message) {
        title = 'Error Occurred';
        message = this.state.error.message;
      }
      else {
        title = 'Unknown Error';
        message = 'The reason for this error could not be determined.';
      }

      return (
        <div className="error">
          <h1>{title}</h1>
          <p>{message}</p>
        </div>
      )
    }

    return (
      <ErrorContext.Provider value={this.setError}>
        {this.props.children}
      </ErrorContext.Provider>
    )
  }
}

export default ErrorHandler;
