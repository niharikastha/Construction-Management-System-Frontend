// src/services/api.js
import axios from 'axios';

const baseURL = 'http://localhost:3000'; // Replace with your API base URL

const api = axios.create({
  baseURL,
});

export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    console.log('connected')
    return response.data;
  } 
  catch (error) {
    throw error.response.data;
  }
};

export default api;
