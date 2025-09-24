import axios from "axios";

const api = import.meta.env.VITE_API_URL;

export const postApi = () => {
  const authHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };
  };

  return {
    create: async (payload) => {
      return axios.post(`${api}/posts`, payload, authHeaders());
    },
    update: async (id, payload) => {
      return axios.put(`${api}/posts/${id}`, payload, authHeaders());
    },
    deleted: async (id) => {
      return axios.delete(`${api}/posts/${id}`, authHeaders());
    },
    postById: async (id) => {
      return axios.get(`${api}/posts/${id}`, authHeaders());
    },
    getAllPost: async () => {
      return axios.get(`${api}/posts`);
    }
  };
};
