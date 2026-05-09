import axios from 'axios';

const API = axios.create({
  baseURL: 'https://hospitalmanagementapplication20260418005920-dzfyechah9b2dzg7.canadacentral-01.azurewebsites.net/api',
});

export default API;