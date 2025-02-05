import axios from "axios";

const API_URL = "https://gp-backend-iota.vercel.app";

export const signup = (email: string, password: string, name: string, username: string) => {
  return axios.post(`${API_URL}/api/auth/signup`, { email, password, name, username });
};

export const login =  (email: string, password: string) => {
  return axios.post(`${API_URL}/api/auth/login`, { email, password });
};
