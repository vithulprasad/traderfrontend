import axios from 'axios';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: 'https://tradebackend-rd9x.onrender.com', // Replace with your actual Backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable if you need to send cookies/sessions
});



// const api = axios.create({
//   baseURL: 'http://localhost:5000', // Replace with your actual Backend URL
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true, // Enable if you need to send cookies/sessions
// });


api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error status codes globally (e.g., 401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // Logic to redirect to login or clear storage could go here
    }
    return Promise.reject(error);
  }
);

export default api;