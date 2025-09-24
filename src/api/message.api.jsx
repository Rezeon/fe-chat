import axios from "axios";

const api = import.meta.env.VITE_API_URL;

export const messageApi = () => {
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
      return axios.post(`${api}/messages`, payload, authHeaders());
    },
    update: async (id, payload) => {
      return axios.put(`${api}/messages/${id}`, payload, authHeaders());
    },
    deleted: async (id) => {
      return axios.delete(`${api}/messages/${id}`, authHeaders());
    },
    messageById: async (id) => {
      return axios.get(`${api}/messages/user/${id}`, authHeaders());
    },
    getAll: async () => {
      return axios.get(`${api}/messages`, authHeaders());
    },
    getById: async (id) => {
      return axios.get(`${api}/messages/${id}`, authHeaders());
    }
  };
};
