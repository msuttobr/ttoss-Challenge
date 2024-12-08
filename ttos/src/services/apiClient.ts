import axios from 'axios';

const apiKey = import.meta.env.VITE_API_KEY;

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api/videos/',
  headers: {
    'api-key': apiKey,
  },
});

export default apiClient;