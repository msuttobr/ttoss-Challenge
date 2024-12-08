import axios from 'axios';

const apiKey = import.meta.env.VITE_API_KEY;
const baseApi = import.meta.env.VITE_BASE_API;
const port = import.meta.env.VITE_PORT;

const apiClient = axios.create({
  baseURL: `${baseApi}:${port}/api/videos/`,
  headers: {
    'api-key': apiKey,
  },
});

export default apiClient;