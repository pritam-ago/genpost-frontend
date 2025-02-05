import axios from "axios";

const API_URL = "https://gp-backend-iota.vercel.app"; 

export const deleteUser = (userId: string) => {
  return axios.delete(`${API_URL}/user/${userId}`);
}

export const updateUser = (userId: string, name: string, username: string, email: string, password : string) => {
    return axios.put(`${API_URL}/user/${userId}`, {name, username, email, password });
}

export const getUser = (userId: string) => {
    return axios.get(`${API_URL}/user/${userId}`);
}

export const verifyPassword = async (userId: string, currentPassword: string) => {
  return await axios.post(`/user/${userId}/verify-password`, { currentPassword });
};
