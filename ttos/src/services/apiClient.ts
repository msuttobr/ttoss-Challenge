import axios from 'axios';

export const apiKey = import.meta.env.VITE_API_KEY;
export const baseApi = import.meta.env.VITE_BASE_API;
export const port = import.meta.env.VITE_PORT;

const apiClient = axios.create({
  baseURL: `${baseApi}:${port}/api/videos/`,
  headers: {
    'api-key': apiKey,
  },
});

export default apiClient;