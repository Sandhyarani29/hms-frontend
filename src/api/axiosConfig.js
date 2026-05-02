import axios from 'axios';

const API = axios.create({
  baseURL: 'https://localhost:7059/api',
});

export default API;


