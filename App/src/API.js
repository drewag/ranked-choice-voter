const hostname = window && window.location && window.location.hostname;

function API(path) {
  if (hostname === 'localhost') {
    return "http://localhost:8080/api/v1/" + path;
  }
  return "/api/v1/" + path;
}

export default API;
