import axios from 'axios';

// Base URL points to /api
const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// FIX 1: Update the path to match your backend route (/api/users/register)
export const registerUser = (userData) => API.post('/users/register', userData);

// FIX 2: Added login function (since you have a /login route in backend)
export const loginUser = (userData) => API.post('/users/login', userData);

// Keep these if you have created routes for them in userRoutes.js
export const verifyKYC = (data) => API.post('/users/kyc', data);
export const translateText = (data) => API.post('/users/translate', data);