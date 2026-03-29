import axios from 'axios';
import { Config } from './Config';


const api = axios.create({
  baseURL: Config.baseUrl,
  withCredentials: true,
  timeout: 15000
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network timeout and offline handling for better user feedback upstream.
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. Please try again.'));
    }

    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check your internet connection.'));
    }

    return Promise.reject(error);
  }
);

export default api;