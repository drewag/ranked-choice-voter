const useErrorHandling = () => {
  return (response) => {
    response.json().then(json => {
      if (json.title && json.alertMessage) {
        alert(`${json.title}: ${json.alertMessage}`);
      }
      else {
        alert('Unknown Error');
      }
    });
  }
}

export default useErrorHandling;
