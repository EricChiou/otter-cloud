import axios from 'axios';

const request = axios.create({ timeout: 30000 });

request.interceptors.response.use(
  (resp) => {
    if (200 <= resp.status && resp.status <= 299) {
      return resp.data;
    } else {
      return Promise.reject(resp.data);
    }
  },
  (error) => {
    console.error('api error:', error);
    return Promise.reject(errorHandler(error));
  }
)

function errorHandler(error: any): any {
  if (error.response && error.response.data) {
    return error.response.data;
  }
  return error;
}
