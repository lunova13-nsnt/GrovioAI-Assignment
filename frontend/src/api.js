import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });


API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export const signup = (data) => API.post('/auth/signup', data);
export const login  = (data) => API.post('/auth/login',  data);


export const getNotes   = ()           => API.get('/notes');
export const getNote    = (id)         => API.get(`/notes/${id}`);
export const createNote = (data)       => API.post('/notes', data);
export const updateNote = (id, data)   => API.put(`/notes/${id}`, data);
export const deleteNote = (id)         => API.delete(`/notes/${id}`);