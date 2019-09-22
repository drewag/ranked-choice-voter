import React from 'react';

class RCVComponent extends React.Component {
  startLoading(text) {
    this.isLoading = true;
    this.props.setLoading(text);
  }

  stopLoading() {
    this.isLoading = false;
    this.props.setLoading(null);
  }

  handleLoadingError(json) {
    if (json == "notFound") {
      this.setState({notFound:true})
    }
    else if (json.title && json.alertMessage) {
      this.setState({error:json})
    }
    else {
      this.setState({error:{
        title: "Error Loading",
        alertMessage: "Unknown error.",
      }})
    }
  }

  handleErrorResponse(response) {
    response.json().then(json => {
      if (json.title && json.alertMessage) {
        alert(json.title + ": " + json.alertMessage);
      }
      else {
        alert("Unknown Error");
      }
    });
  }
}

export default RCVComponent;
