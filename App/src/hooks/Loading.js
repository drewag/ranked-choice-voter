const useLoading = (props) => {
  const startLoading = (text) => {
    props.setLoading(text);
  }

  const stopLoading = () => {
    props.setLoading(null);
  }

  return [startLoading, stopLoading];
}

export default useLoading;
