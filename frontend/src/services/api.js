import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const registerUser = (userData) => API.post('/users', userData);
export const verifyKYC = (data) => API.post('/users/kyc', data);
export const translateText = (data) => API.post('/users/translate', data);