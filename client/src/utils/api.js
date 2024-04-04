import axios from 'axios';

const ip = 'kassianoc.tech';

export const api = axios.create({
  baseURL: `https://${ip}:2005`,
});

export const createSession = async (email, password) => {
  return api.post('users/login', { email, password });
};
