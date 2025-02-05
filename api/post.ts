import axios from "axios";

const API_URL = "https://gp-backend-iota.vercel.app"; 

export const getPosts = () => {
  return axios.get(`${API_URL}/api/posts`);
}

export const deletePost = (postId: string) => {
  return axios.delete(`${API_URL}/api/posts/${postId}`);
}

export const getPost = (postId: string) => {
    return axios.get(`${API_URL}/api/posts/${postId}`);
}