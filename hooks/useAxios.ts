import axios from 'axios';

const config = {
  // baseURL: 'http://donomedi.gabia.io/api',
  baseURL: 'http://192.168.0.117:8080/api',
  timeout: 5000,
};

export default axios.create(config);
