import axios from 'axios';

// Use plain axios (no token needed) for auth endpoints
const plain = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' } });

export const registerApi = (data) => plain.post('/auth/register', data);
export const loginApi = (data) => plain.post('/auth/login', data);
export const logoutApi = (refreshToken) =>
  plain.post(
    '/auth/logout',
    { refreshToken },
    { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
  );
