import path from 'path';

const hostname = window && window.location && window.location.hostname;

function API() {
  const relativePath = path.join.apply(null, arguments);
  if (hostname === 'localhost') {
    return 'http://localhost:8080/api/v1/' + relativePath;
  }
  return '/api/v1/' + relativePath;
}

export default API;
